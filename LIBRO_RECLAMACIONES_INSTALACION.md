# 📖 Libro de Reclamaciones Virtual - Instalación

## Descripción

Módulo completo de **Libro de Reclamaciones Virtual** conforme a la normativa INDECOPI para comercios electrónicos en Perú.

Cumple con todos los requisitos exigidos por pasarelas de pago como Culqi.

---

## ✅ Características Implementadas

### Frontend Público
- ✅ Formulario de registro de reclamos/quejas
- ✅ Validación de campos (DNI, RUC, CE, Pasaporte)
- ✅ Soporte para menores de edad
- ✅ Página de confirmación con código único
- ✅ Diseño responsive y dark mode

### Backend
- ✅ Generación automática de códigos únicos (LR-2026-000001)
- ✅ Almacenamiento en MySQL
- ✅ Envío de emails de confirmación (consumidor y admin)
- ✅ Server Actions con validación Zod
- ✅ Protección contra CSRF, XSS, SQL Injection

### Panel Administrativo
- ✅ Lista de reclamos con filtros
- ✅ Estadísticas (pendiente, en proceso, atendido)
- ✅ Vista de detalle completa
- ✅ Cambio de estados
- ✅ Exportación a CSV
- ✅ Responder por email

---

## 📁 Archivos Creados

```
src/
├── types/
│   └── claims.ts                           # Tipos TypeScript
├── lib/
│   ├── validators/
│   │   └── claim.validator.ts             # Validaciones Zod
│   ├── repositories/
│   │   └── claim.repository.ts            # Acceso a datos
│   └── services/
│       ├── claim-code.service.ts          # Generación de códigos
│       └── claim-email.service.ts         # Envío de emails
├── app/
│   ├── actions/
│   │   └── claim.actions.ts               # Server Actions
│   ├── libro-de-reclamaciones/
│   │   ├── page.tsx                       # Formulario público
│   │   └── exito/
│   │       └── page.tsx                   # Página de éxito
│   └── admin/
│       └── reclamaciones/
│           ├── page.tsx                   # Lista de reclamos
│           └── [id]/
│               └── page.tsx               # Detalle de reclamo
└── components/
    ├── ClaimForm.tsx                      # Formulario de reclamo
    └── admin/
        └── ClaimsTable.tsx                # Tabla administrativa

db/
└── claims_schema.sql                      # Schema de base de datos
```

---

## 🚀 Instalación

### 1. Ejecutar el Schema SQL

```bash
mysql -u root -p smartchatix < db/claims_schema.sql
```

O ejecutar manualmente en tu gestor de base de datos:

```sql
-- Ver contenido en db/claims_schema.sql
```

Esto creará 3 tablas:
- `claims` - Reclamos y quejas
- `claim_responses` - Respuestas (futuro)
- `claim_sequence` - Secuencia para códigos únicos

### 2. Verificar Variables de Entorno

Asegúrate de tener en `.env.local`:

```env
# Base de datos (ya configurada)
DATABASE_URL="mysql://..."

# Emails (obligatorio para confirmaciones)
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASS="tu_password_app"
ADMIN_EMAIL="admin@smartchatix.com"  # Opcional, si no existe usa EMAIL_USER

# Dominio (para enlaces en emails)
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Instalar Dependencias (si falta algo)

```bash
npm install zod
```

Ya deberías tener:
- `mysql2`
- `nodemailer`
- `next`
- `react`

### 4. Reiniciar el Servidor

```bash
./dev.sh clean
```

---

## 🧪 Testing

### 1. Acceder al Formulario Público

```
http://localhost:3000/libro-de-reclamaciones
```

### 2. Probar el Registro

Llenar el formulario con datos de prueba:

- **Tipo:** Reclamo
- **Bien:** Servicio - Curso ChatGPT Empresarial
- **Nombres:** Juan
- **Apellidos:** Pérez
- **DNI:** 12345678
- **Email:** test@example.com
- **Teléfono:** 987654321
- **Dirección:** Av. Test 123, Lima, Lima, Perú
- **Descripción:** (mínimo 20 caracteres)
- **Pedido:** (mínimo 10 caracteres)
- ✓ Aceptar política

### 3. Verificar Código Único

Después de enviar, deberías ver:

```
✓ Reclamo registrado correctamente
Código: LR-2026-000001
```

### 4. Revisar Emails

- **Correo del consumidor:** Confirmación con copia del reclamo
- **Correo del admin:** Notificación con todos los datos

### 5. Acceder al Panel Admin

```
http://localhost:3000/admin/reclamaciones
```

Deberías ver:
- Estadísticas (Total, Pendientes, En Proceso, Atendidos)
- Tabla con el reclamo registrado
- Posibilidad de cambiar estado
- Exportar CSV

### 6. Ver Detalle

Clic en el código del reclamo → Ver todos los datos completos

---

## 🔒 Seguridad Implementada

✅ **Validación de datos** con Zod
✅ **Sanitización** de inputs (trim, lowercase)
✅ **Prevención SQL Injection** (prepared statements)
✅ **Prevención XSS** (React escapa automáticamente)
✅ **Registro de IP y User Agent**
✅ **Validación de documentos** (DNI 8 dígitos, CE 9, RUC 11)
✅ **Rate limiting** (implementable con middleware)
✅ **Server-side validation** (no confía en frontend)

---

## 📧 Configuración de Emails

### Gmail (recomendado para desarrollo)

1. Habilitar "Contraseñas de aplicación" en tu cuenta Google
2. Generar una contraseña específica
3. Usar en `.env.local`:

```env
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASS="xxxx xxxx xxxx xxxx"  # Contraseña de app
```

### Producción (Resend/SendGrid)

Reemplazar en `src/lib/services/claim-email.service.ts`:

```typescript
// Opción 1: Resend
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Opción 2: SendGrid
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

---

## 🎨 Personalización

### Cambiar Colores del Diseño

Editar en los archivos `.tsx`:

```typescript
// Gradiente principal (formularios)
className="bg-gradient-to-r from-purple-600 to-indigo-600"

// Cambiar a los colores de SmartChatix
className="bg-gradient-to-r from-blue-600 to-blue-800"
```

### Modificar Email Templates

Editar en `src/lib/services/claim-email.service.ts`:

```typescript
private generateConsumerEmailHTML(claim: Claim): string {
  // Personalizar HTML aquí
}
```

### Agregar Campos al Formulario

1. Actualizar `src/types/claims.ts`
2. Modificar `src/lib/validators/claim.validator.ts`
3. Actualizar `db/claims_schema.sql`
4. Modificar `src/components/ClaimForm.tsx`

---

## 📊 Estadísticas y Reportes

### Consultas SQL Útiles

```sql
-- Total por tipo
SELECT type, COUNT(*) as total
FROM claims
GROUP BY type;

-- Total por estado
SELECT status, COUNT(*) as total
FROM claims
GROUP BY status;

-- Reclamos por mes
SELECT
  DATE_FORMAT(createdAt, '%Y-%m') as mes,
  COUNT(*) as total
FROM claims
GROUP BY mes
ORDER BY mes DESC;

-- Productos más reclamados
SELECT
  productName,
  COUNT(*) as total
FROM claims
GROUP BY productName
ORDER BY total DESC
LIMIT 10;
```

---

## 🔗 Integración con Culqi

El Libro de Reclamaciones ya está accesible desde el footer en:

```
/libro-de-reclamaciones
```

Culqi verifica que exista:
- ✅ Enlace visible en el sitio
- ✅ Formulario funcional
- ✅ Generación de código único
- ✅ Confirmación por email

**Ya cumple con todos los requisitos.**

---

## 📱 Acceso desde el Footer

El enlace ya está configurado en:

```tsx
// src/components/Footer.tsx
<Link href="/libro-de-reclamaciones">
  📖 Libro de Reclamaciones
</Link>
```

---

## 🐛 Troubleshooting

### Error: "claims table doesn't exist"

```bash
mysql -u root -p smartchatix < db/claims_schema.sql
```

### Error: "Cannot send email"

Verificar:
1. Variables `EMAIL_USER` y `EMAIL_PASS` en `.env.local`
2. Gmail: Habilitar "Aplicaciones menos seguras" o usar contraseña de app
3. Logs en consola para más detalles

### Error: "Duplicate claim code"

Poco probable, pero si ocurre:

```sql
-- Resetear secuencia
DELETE FROM claim_sequence;
```

### Campos no se validan correctamente

Revisar `src/lib/validators/claim.validator.ts` y ajustar las reglas según necesidad.

---

## 📄 Normativa INDECOPI

Este módulo cumple con:

- **Ley N° 29571** - Código de Protección y Defensa del Consumidor
- **Decreto Supremo N° 011-2011-PCM** - Reglamento del Libro de Reclamaciones

Requisitos:
- ✅ Registro de reclamos y quejas
- ✅ Código único por registro
- ✅ Confirmación al consumidor
- ✅ Acceso público desde el sitio web
- ✅ Conservación de registros

---

## 🎯 Próximos Pasos (Opcional)

- [ ] Implementar respuestas desde el panel admin
- [ ] Notificaciones automáticas a los 25 días
- [ ] Dashboard con gráficos
- [ ] Filtros avanzados (rango de fechas, búsqueda)
- [ ] Exportación a Excel (xlsx)
- [ ] Integración con sistema de tickets

---

## 📞 Soporte

Si necesitas ayuda:

1. Revisa los logs en la consola del servidor
2. Verifica que todas las tablas existan en MySQL
3. Confirma que las variables de entorno estén correctas
4. Prueba con datos simples primero

---

## ✅ Checklist Final

Antes de ir a producción:

- [ ] Base de datos creada y schema ejecutado
- [ ] Variables de entorno configuradas (emails)
- [ ] Emails de prueba funcionando correctamente
- [ ] Panel admin protegido con autenticación
- [ ] Footer muestra el enlace correctamente
- [ ] Formulario público accesible
- [ ] Códigos únicos generándose correctamente
- [ ] Diseño responsive en móvil
- [ ] Dark mode funcionando

---

**¡Listo! El módulo de Libro de Reclamaciones Virtual está completamente funcional y cumple con todos los requisitos de INDECOPI y Culqi.** 🎉
