# Sistema Multi-Tenant para Aulas Virtuales SmartChatix

## Objetivo

Permitir que múltiples colegios/instituciones (tenants) prueben el aula virtual en un solo VPS compartido durante 30 días, cada uno con su propio admin, apariencia personalizada y datos aislados.

---

## Arquitectura General

### **Modelo de Despliegue:**

```
┌─────────────────────────────────────────────────┐
│  VPS CENTRAL (Pruebas)                          │
│  Droplet 8GB RAM, 160GB SSD - $48/mes           │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ colegio-sanmartin.prueba.smartchatix.com │  │
│  │ colegio-salesiano.prueba.smartchatix.com │  │
│  │ instituto-tech.prueba.smartchatix.com    │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Base de datos MySQL (multi-tenant)             │
│  - tenant_id en todas las tablas                │
│  - Aislamiento por queries                      │
└─────────────────────────────────────────────────┘

            ⬇️ AL CONTRATAR (después de 30 días)

┌─────────────────────────────────────────────────┐
│  DROPLET DEDICADO                               │
│  $24-48/mes según plan                          │
│                                                  │
│  aulavirtual.colegio-sanmartin.edu.pe          │
│                                                  │
│  - Base de datos propia                         │
│  - Personalización completa                     │
│  - Sin límites de prueba                        │
└─────────────────────────────────────────────────┘
```

---

## Base de Datos Multi-Tenant

### **Nueva Tabla: `tenants`**

```sql
CREATE TABLE tenants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,              -- ej: "colegio-sanmartin"
  name VARCHAR(255) NOT NULL,                     -- ej: "Colegio San Martín de Porres"
  subdomain VARCHAR(100) UNIQUE NOT NULL,         -- ej: "colegio-sanmartin.prueba.smartchatix.com"

  -- Personalización de marca
  logo_url VARCHAR(500),                          -- URL del logo
  primary_color VARCHAR(7) DEFAULT '#003366',     -- Color principal (hex)
  secondary_color VARCHAR(7) DEFAULT '#0066CC',   -- Color secundario (hex)
  accent_color VARCHAR(7) DEFAULT '#FF6600',      -- Color de acento (hex)

  -- Datos de contacto
  admin_email VARCHAR(255) NOT NULL,
  admin_name VARCHAR(255),
  phone VARCHAR(50),

  -- Estado del tenant
  status ENUM('trial', 'active', 'suspended', 'cancelled') DEFAULT 'trial',
  trial_started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  trial_ends_at DATETIME,                         -- trial_started_at + 30 días

  -- Límites (durante prueba)
  max_students INT DEFAULT 50,
  max_courses INT DEFAULT 3,
  max_videos INT DEFAULT 15,
  max_quizzes_per_month INT DEFAULT 50,

  -- Plan contratado (después de prueba)
  plan ENUM('basic', 'pro', 'enterprise') NULL,   -- NULL durante trial

  -- Metadatos
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_slug (slug),
  INDEX idx_subdomain (subdomain),
  INDEX idx_status (status)
);
```

### **Modificar Tablas Existentes:**

```sql
-- Agregar tenant_id a TODAS las tablas principales
ALTER TABLE users ADD COLUMN tenant_id INT NOT NULL AFTER id;
ALTER TABLE courses ADD COLUMN tenant_id INT NOT NULL AFTER id;
ALTER TABLE modules ADD COLUMN tenant_id INT NOT NULL AFTER id;
ALTER TABLE lessons ADD COLUMN tenant_id INT NOT NULL AFTER id;
ALTER TABLE enrollments ADD COLUMN tenant_id INT NOT NULL AFTER id;
ALTER TABLE quiz_responses ADD COLUMN tenant_id INT NOT NULL AFTER id;

-- Agregar foreign keys
ALTER TABLE users ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE courses ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE modules ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE lessons ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE enrollments ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE quiz_responses ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

-- Índices compuestos para performance
CREATE INDEX idx_tenant_user ON users(tenant_id, id);
CREATE INDEX idx_tenant_course ON courses(tenant_id, id);
CREATE INDEX idx_tenant_module ON modules(tenant_id, course_id);
CREATE INDEX idx_tenant_lesson ON lessons(tenant_id, module_id);
```

---

## Middleware de Tenant

### **Identificación del Tenant por Subdominio:**

```typescript
// middleware.ts (Next.js)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Extraer subdominio
  // Ej: "colegio-sanmartin.prueba.smartchatix.com" → "colegio-sanmartin"
  const parts = hostname.split('.');

  if (parts.length >= 4 && parts[1] === 'prueba' && parts[2] === 'smartchatix') {
    const tenantSlug = parts[0];

    // Inyectar tenant_id en headers para usar en APIs
    const response = NextResponse.next();
    response.headers.set('x-tenant-slug', tenantSlug);
    response.headers.set('x-is-trial', 'true');

    return response;
  }

  // Si es dominio principal (smartchatix.com) → landing page normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Context Provider de Tenant

### **Proveer datos del tenant en toda la app:**

```typescript
// lib/TenantContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface TenantData {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  status: 'trial' | 'active' | 'suspended' | 'cancelled';
  trialEndsAt: string | null;
  daysLeft: number;
  isTrial: boolean;
  limits: {
    maxStudents: number;
    maxCourses: number;
    maxVideos: number;
    maxQuizzes: number;
  };
}

const TenantContext = createContext<TenantData | null>(null);

export function TenantProvider({
  children,
  tenant
}: {
  children: ReactNode;
  tenant: TenantData
}) {
  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
```

### **Uso en componentes:**

```typescript
// En cualquier componente
import { useTenant } from '@/lib/TenantContext';

export default function Header() {
  const tenant = useTenant();

  return (
    <header style={{ backgroundColor: tenant.primaryColor }}>
      {tenant.logoUrl && (
        <img src={tenant.logoUrl} alt={tenant.name} />
      )}

      {tenant.isTrial && (
        <div className="trial-banner">
          ⏰ Modo Prueba - Quedan {tenant.daysLeft} días
          <button>Contratar Ahora</button>
        </div>
      )}
    </header>
  );
}
```

---

## Sistema de Límites

### **Validación antes de crear recursos:**

```typescript
// lib/tenant-limits.ts
import { db } from './database';

export async function checkStudentLimit(tenantId: number): Promise<boolean> {
  const tenant = await db.query('SELECT max_students FROM tenants WHERE id = ?', [tenantId]);
  const currentCount = await db.query(
    'SELECT COUNT(*) as count FROM users WHERE tenant_id = ? AND role = "student"',
    [tenantId]
  );

  return currentCount[0].count < tenant[0].max_students;
}

export async function checkCourseLimit(tenantId: number): Promise<boolean> {
  const tenant = await db.query('SELECT max_courses FROM tenants WHERE id = ?', [tenantId]);
  const currentCount = await db.query(
    'SELECT COUNT(*) as count FROM courses WHERE tenant_id = ?',
    [tenantId]
  );

  return currentCount[0].count < tenant[0].max_courses;
}

export async function checkVideoLimit(tenantId: number): Promise<boolean> {
  const tenant = await db.query('SELECT max_videos FROM tenants WHERE id = ?', [tenantId]);
  const currentCount = await db.query(
    'SELECT COUNT(*) as count FROM lessons WHERE tenant_id = ? AND content_type = "video"',
    [tenantId]
  );

  return currentCount[0].count < tenant[0].max_videos;
}

export async function checkQuizLimit(tenantId: number): Promise<boolean> {
  const tenant = await db.query('SELECT max_quizzes_per_month FROM tenants WHERE id = ?', [tenantId]);

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const currentCount = await db.query(
    `SELECT COUNT(*) as count FROM lessons
     WHERE tenant_id = ?
     AND content_type = "quiz"
     AND created_at >= ?`,
    [tenantId, firstDayOfMonth]
  );

  return currentCount[0].count < tenant[0].max_quizzes_per_month;
}
```

### **Uso en APIs:**

```typescript
// app/api/instructor/lessons/route.ts
import { checkVideoLimit, checkQuizLimit } from '@/lib/tenant-limits';

export async function POST(request: Request) {
  const tenantId = request.headers.get('x-tenant-id');
  const body = await request.json();

  // Validar límites
  if (body.content_type === 'video') {
    const canCreate = await checkVideoLimit(tenantId);
    if (!canCreate) {
      return Response.json({
        error: 'Has alcanzado el límite de videos en modo prueba. Contrata un plan para continuar.'
      }, { status: 403 });
    }
  }

  if (body.content_type === 'quiz') {
    const canCreate = await checkQuizLimit(tenantId);
    if (!canCreate) {
      return Response.json({
        error: 'Has alcanzado el límite de quizzes este mes. Contrata un plan para continuar.'
      }, { status: 403 });
    }
  }

  // Crear lección...
}
```

---

## Panel de Personalización (Admin)

### **Ruta: `/admin/personalizacion`**

```typescript
// app/admin/personalizacion/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTenant } from '@/lib/TenantContext';

export default function PersonalizacionPage() {
  const tenant = useTenant();
  const [logo, setLogo] = useState<File | null>(null);
  const [colors, setColors] = useState({
    primary: tenant.primaryColor,
    secondary: tenant.secondaryColor,
    accent: tenant.accentColor
  });

  const handleSave = async () => {
    const formData = new FormData();
    if (logo) formData.append('logo', logo);
    formData.append('primaryColor', colors.primary);
    formData.append('secondaryColor', colors.secondary);
    formData.append('accentColor', colors.accent);

    await fetch('/api/admin/personalizacion', {
      method: 'PATCH',
      body: formData
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Personalización de Marca</h1>

      <section>
        <h2>Logo de la Institución</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
        />
        {tenant.logoUrl && (
          <img src={tenant.logoUrl} alt="Logo actual" style={{ height: '60px' }} />
        )}
      </section>

      <section>
        <h2>Colores de Marca</h2>

        <div>
          <label>Color Principal</label>
          <input
            type="color"
            value={colors.primary}
            onChange={(e) => setColors({...colors, primary: e.target.value})}
          />
          <span>{colors.primary}</span>
        </div>

        <div>
          <label>Color Secundario</label>
          <input
            type="color"
            value={colors.secondary}
            onChange={(e) => setColors({...colors, secondary: e.target.value})}
          />
          <span>{colors.secondary}</span>
        </div>

        <div>
          <label>Color de Acento</label>
          <input
            type="color"
            value={colors.accent}
            onChange={(e) => setColors({...colors, accent: e.target.value})}
          />
          <span>{colors.accent}</span>
        </div>
      </section>

      <button onClick={handleSave}>Guardar Cambios</button>
    </div>
  );
}
```

---

## Script de Creación de Tenant

### **Comando CLI para crear nuevo tenant:**

```bash
# Uso:
npm run create-tenant -- --name "Colegio San Martín" --email admin@sanmartin.edu --phone "+51987654321"
```

### **Script: `scripts/create-tenant.js`**

```javascript
// scripts/create-tenant.js
const mysql = require('mysql2/promise');
const slugify = require('slugify');

async function createTenant({ name, email, phone }) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_password',
    database: 'smartchatix_multitenant'
  });

  try {
    // Generar slug único
    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const [existing] = await connection.query(
        'SELECT id FROM tenants WHERE slug = ?',
        [slug]
      );

      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear subdominio
    const subdomain = `${slug}.prueba.smartchatix.com`;

    // Calcular fecha de fin de prueba (30 días)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    // Insertar tenant
    const [result] = await connection.query(
      `INSERT INTO tenants (
        slug, name, subdomain, admin_email, phone,
        trial_ends_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'trial')`,
      [slug, name, subdomain, email, phone, trialEndsAt]
    );

    const tenantId = result.insertId;

    // Crear usuario admin para este tenant
    const bcrypt = require('bcrypt');
    const defaultPassword = 'admin123'; // Se les pide cambiar al primer login
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await connection.query(
      `INSERT INTO users (
        tenant_id, email, password_hash, name, role, is_active
      ) VALUES (?, ?, ?, ?, 'admin', 1)`,
      [tenantId, email, hashedPassword, 'Administrador']
    );

    console.log('✅ Tenant creado exitosamente:');
    console.log(`   ID: ${tenantId}`);
    console.log(`   Nombre: ${name}`);
    console.log(`   Subdominio: ${subdomain}`);
    console.log(`   Admin Email: ${email}`);
    console.log(`   Password Temporal: ${defaultPassword}`);
    console.log(`   Prueba válida hasta: ${trialEndsAt.toLocaleDateString()}`);

    // TODO: Enviar email de bienvenida con credenciales

  } catch (error) {
    console.error('❌ Error al crear tenant:', error);
  } finally {
    await connection.end();
  }
}

// Parsear argumentos
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  params[key] = args[i + 1];
}

createTenant(params);
```

### **Agregar a `package.json`:**

```json
{
  "scripts": {
    "create-tenant": "node scripts/create-tenant.js"
  }
}
```

---

## Script de Migración a Droplet Dedicado

### **Cuando un tenant contrata (después de prueba):**

```bash
npm run migrate-tenant -- --tenant-id 5 --plan pro --droplet-ip 157.230.45.123
```

### **Script: `scripts/migrate-tenant.js`**

```javascript
// scripts/migrate-tenant.js
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function migrateTenant({ tenantId, plan, dropletIp }) {
  console.log(`🚀 Iniciando migración del tenant ${tenantId} a droplet dedicado...`);

  const sourceDb = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_password',
    database: 'smartchatix_multitenant'
  });

  try {
    // 1. Obtener datos del tenant
    const [tenant] = await sourceDb.query(
      'SELECT * FROM tenants WHERE id = ?',
      [tenantId]
    );

    if (!tenant.length) {
      throw new Error('Tenant no encontrado');
    }

    const tenantData = tenant[0];
    console.log(`   Tenant: ${tenantData.name}`);

    // 2. Exportar datos del tenant a SQL dump
    console.log('📦 Exportando datos...');

    const dumpFile = `/tmp/tenant_${tenantId}_dump.sql`;

    await execPromise(`mysqldump -u root -ptu_password smartchatix_multitenant \
      --where="tenant_id=${tenantId}" \
      users courses modules lessons enrollments quiz_responses \
      > ${dumpFile}`);

    // 3. Copiar dump al nuevo droplet
    console.log('📤 Copiando datos al droplet...');

    await execPromise(`scp ${dumpFile} root@${dropletIp}:/tmp/`);

    // 4. Ejecutar instalación en droplet remoto
    console.log('⚙️  Instalando aula virtual en droplet...');

    await execPromise(`ssh root@${dropletIp} "bash -s" < scripts/install-aula-virtual.sh`);

    // 5. Importar datos
    console.log('📥 Importando datos...');

    await execPromise(`ssh root@${dropletIp} "mysql -u root smartchatix < /tmp/tenant_${tenantId}_dump.sql"`);

    // 6. Actualizar registro del tenant
    console.log('✏️  Actualizando registro...');

    await sourceDb.query(
      `UPDATE tenants
       SET status = 'active',
           plan = ?,
           droplet_ip = ?
       WHERE id = ?`,
      [plan, dropletIp, tenantId]
    );

    // 7. Eliminar datos del VPS central
    console.log('🗑️  Limpiando datos del VPS central...');

    await sourceDb.query('DELETE FROM quiz_responses WHERE tenant_id = ?', [tenantId]);
    await sourceDb.query('DELETE FROM enrollments WHERE tenant_id = ?', [tenantId]);
    await sourceDb.query('DELETE FROM lessons WHERE tenant_id = ?', [tenantId]);
    await sourceDb.query('DELETE FROM modules WHERE tenant_id = ?', [tenantId]);
    await sourceDb.query('DELETE FROM courses WHERE tenant_id = ?', [tenantId]);
    await sourceDb.query('DELETE FROM users WHERE tenant_id = ?', [tenantId]);

    console.log('✅ Migración completada exitosamente!');
    console.log(`   Droplet IP: ${dropletIp}`);
    console.log(`   Plan: ${plan}`);

    // TODO: Enviar email al cliente con nueva URL

  } catch (error) {
    console.error('❌ Error durante migración:', error);
  } finally {
    await sourceDb.end();
  }
}

const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  params[key] = args[i + 1];
}

migrateTenant(params);
```

---

## Flujo Completo de Usuario (Tenant)

### **1. Solicitud de Prueba (desde web):**
```
Usuario llena formulario →
Tú ejecutas: npm run create-tenant --name "..." --email "..." →
Tenant recibe email con:
  - URL: colegio-xyz.prueba.smartchatix.com
  - Usuario: admin@colegio.edu
  - Password: admin123
  - Válido por: 30 días
```

### **2. Durante la Prueba:**
```
Tenant usa el aula virtual:
  ✅ Crea hasta 3 cursos
  ✅ Sube hasta 15 videos
  ✅ Agrega hasta 50 estudiantes
  ✅ Genera hasta 50 quizzes/mes con IA

Banner superior: "⏰ Quedan 23 días de prueba | Contratar Plan"
```

### **3. Decide Contratar:**
```
Tenant hace clic en "Contratar Plan Pro" →
Completa pago →
Tú ejecutas: npm run migrate-tenant --tenant-id X --plan pro --droplet-ip Y →
Tenant recibe:
  - Nueva URL: aulavirtual.colegio.edu (opcional)
  - Todos sus datos migrados
  - Sin límites
  - Droplet dedicado
```

### **4. Si NO Contrata (después de 30 días):**
```
Sistema automáticamente:
  ✅ Cambia status a 'suspended'
  ✅ Bloquea acceso (login redirige a página de renovación)
  ✅ Mantiene datos por 7 días más
  ✅ Después de 7 días: elimina datos (CASCADE delete del tenant)
```

---

## Costos y Capacidad

### **VPS Central (Pruebas):**

| Droplet | RAM | Disco | Capacidad | Costo/mes |
|---------|-----|-------|-----------|-----------|
| Basic   | 8GB | 160GB | 15 tenants | $48 |
| Pro     | 16GB | 320GB | 30 tenants | $96 |

### **Por Tenant en Prueba:**
```
Límites:
- 50 estudiantes
- 3 cursos
- 15 videos (~5 GB)
- 50 quizzes IA/mes

Uso real:
- RAM: ~300 MB
- Disco: ~2-5 GB
- OpenAI: ~$3/mes
```

### **Conversión Esperada:**
```
15 pruebas/mes → 6 contratan (40%) →

Ingresos: 6 × $86 (Plan Pro) = $516/mes
Costos VPS: $48/mes
Costos OpenAI (15 pruebas): $45/mes
────────────────────────────────────
GANANCIA NETA: $423/mes ✅
```

---

## Próximos Pasos de Implementación

### **Fase 1: Base de Datos**
- [ ] Crear tabla `tenants`
- [ ] Agregar `tenant_id` a tablas existentes
- [ ] Crear índices compuestos

### **Fase 2: Middleware y Context**
- [ ] Implementar middleware de detección de subdominio
- [ ] Crear TenantContext y provider
- [ ] Modificar todas las queries para filtrar por `tenant_id`

### **Fase 3: Límites y Validaciones**
- [ ] Sistema de validación de límites
- [ ] Mensajes de error cuando se alcanza límite
- [ ] Banner de días restantes de prueba

### **Fase 4: Panel de Personalización**
- [ ] Página de personalización en `/admin`
- [ ] Upload de logo
- [ ] Selector de colores
- [ ] Preview en tiempo real

### **Fase 5: Scripts de Automatización**
- [ ] Script `create-tenant.js`
- [ ] Script `migrate-tenant.js`
- [ ] Cronjob para suspender pruebas expiradas
- [ ] Cronjob para eliminar tenants suspendidos después de 7 días

### **Fase 6: DNS Wildcard**
- [ ] Configurar DNS wildcard: `*.prueba.smartchatix.com`
- [ ] SSL automático con Let's Encrypt

---

**Última actualización:** 2026-07-11
**Estado:** Documentación completa - Pendiente de implementación
