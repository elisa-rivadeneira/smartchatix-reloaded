# 🚀 Guía Rápida de Desarrollo

## Iniciar Servidor

```bash
./dev.sh
```

## Reiniciar Limpio (si hay problemas)

```bash
./dev.sh clean
```

## URLs

- 🌐 **Local**: http://localhost:3000
- 📱 **Red**: http://192.168.18.49:3000
- 🔐 **Login**: http://localhost:3000/login

## Usuarios de Prueba

### Instructor
- Email: `instructor@fluideka.com`
- Password: `instructor123`

### Admin
- Email: `admin@fluideka.com`
- Password: `admin123`

### Estudiante
- Email: `estudiante@test.com`
- Password: `estudiante123`

## ⚡ Hard Refresh (Limpiar Cache del Navegador)

- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

O abre DevTools (F12) → Pestaña "Network" → Marca "Disable cache"

## 📝 Notas Importantes

- El servidor hace **hot reload automático** cuando editas archivos
- **NO necesitas reiniciar** el servidor en cada cambio
- Solo usa `./dev.sh clean` si hay problemas de cache persistentes
- El script mata TODOS los procesos Node y libera el puerto 3000 automáticamente

## 🐛 Solución de Problemas

### El navegador muestra contenido viejo
→ Haz hard refresh: `Ctrl + Shift + R`

### El servidor no arranca en puerto 3000
→ El script automáticamente mata procesos y libera el puerto

### Los cambios no se reflejan
1. Verifica que el archivo se guardó
2. Espera 2-3 segundos (hot reload)
3. Hard refresh en el navegador
4. Si persiste: `./dev.sh clean`

### Error "Port already in use"
→ Usa `./dev.sh` que mata todos los procesos automáticamente

---

## 📦 Infraestructura en Producción

### Hosting - Easypanel
- **URL**: https://smartchatix.com
- **Plataforma**: Easypanel (VPS)
- **Deploy**: Automático desde GitHub (rama `main`)

### Base de Datos - MariaDB
- **Host**: `automation_mariadbsmart` (interno Easypanel)
- **Puerto**: `3306`
- **Usuario**: `mariadbsmart`
- **Base de datos**: `mariadbsmart`
- **Tipo**: MariaDB (100% compatible con MySQL)

**Variables de entorno necesarias:**
```env
DATABASE_URL=mysql://mariadbsmart:PASSWORD@automation_mariadbsmart:3306/mariadbsmart
DB_HOST=automation_mariadbsmart
DB_PORT=3306
DB_USER=mariadbsmart
DB_PASSWORD=PASSWORD
DB_NAME=mariadbsmart
```

### CDN - Cloudflare R2

**Plan**: Free (10GB almacenamiento + transferencia ilimitada gratis)

**Credenciales:**
- Account ID: `94c75028ea4d361827fdc3d08f8a3bc5`
- Access Key ID: `a703707a46667566149dc938cd7f1863`
- Secret Access Key: `a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf`
- Bucket: `smartchatix-media`
- Public URL: `https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev`

**Endpoint S3 API:**
```
https://94c75028ea4d361827fdc3d08f8a3bc5.r2.cloudflarestorage.com
```

**Uso:**
- Videos del hero y landing
- Archivos subidos por instructores (videos, PDFs)
- Imágenes de cursos y thumbnails
- Material de aulas virtuales

**Subir archivos a R2:**
```bash
node upload-videos-to-r2.js
```

O usa la utilidad en `src/lib/r2.ts` para uploads programáticos.

---

## 🔧 Sesión 2026-07-17

### Problemas Resueltos

#### 1. Errores TypeScript en Build de Producción
Next.js en producción es más estricto que en desarrollo. Se corrigieron:

- `average_percentage` - Type assertion agregada
- `showModal` no definida en componentes - Reemplazado con `alert`
- `is_certification_enabled` y `passing_score` faltantes en interfaz `Course`
- `renderMarkdown` sin tipo de retorno en `MarkdownEditor.tsx` (2 archivos)
- `title` y `description` faltantes en interfaz `ParsedStructure`

**Comando para verificar antes de deploy:**
```bash
npm run build
```

#### 2. Migración de Base de Datos a Easypanel
- Creado servicio MariaDB en Easypanel
- Exportado BD local: `mysqldump -u root -p fluideka_lms > ~/fluideka_backup.sql`
- Importado vía phpMyAdmin en Easypanel
- Actualizado variables de entorno

#### 3. Migración de Videos a Cloudflare R2
- Sustituye Cloudinary (solo 30 días trial)
- 10GB gratis permanente + transferencia ilimitada
- Videos subidos:
  - `videos/people_animated.mp4`
  - `videos/bomba_animation.mp4`
- URL pública configurada y funcionando

### Próximos Pasos

- [x] ~~Migrar uploads de cursos/aulas virtuales a R2~~ ✅ **COMPLETADO 2026-07-18**
- [ ] Configurar dominio custom para R2 (opcional): `media.smartchatix.com`
- [ ] Implementar upload automático a R2 desde panel de instructor
- [ ] Optimizar imágenes y subirlas a R2

---

## 🔧 Sesión 2026-07-18

### Migración Completa de Uploads a Cloudflare R2

#### ✅ Completado

**1. Migración de archivos existentes**
```bash
node migrate-uploads-to-r2.js
```

- ✅ 14 archivos migrados (1.2 GB total)
- ✅ 7 videos (.mp4) - ~1.2 GB
- ✅ 6 thumbnails de cursos (.png)
- ✅ 1 assignment de estudiante (.pdf)
- ✅ Reporte generado: `r2-migration-report.json`

**2. Scripts creados**

- `migrate-uploads-to-r2.js` - Script de migración masiva
- `update-db-urls-to-r2.sql` - Script SQL para actualizar base de datos
- `migrate-code-to-r2.md` - Guía para actualizar código

**3. Estructura de archivos en R2**
```
smartchatix-media/
├── uploads/
│   ├── 1783460346650_4erasevolucionhumana.png
│   ├── 1783544028760_DiagnosticodePrompts.mp4
│   ├── 1783611598819_DirigirConversacionesconIA.mp4
│   ├── ...
│   └── assignments/
│       └── assignment_2_57_1784061999783.pdf
└── videos/
    ├── people_animated.mp4
    └── bomba_animation.mp4
```

**URLs públicas:**
- Base URL: `https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/`
- Ejemplo: `https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/1783460346650_4erasevolucionhumana.png`

#### ⏳ Pendiente

**1. Ejecutar script SQL en producción**
```bash
# Conectar a BD de producción
mysql -u mariadbsmart -p mariadbsmart < update-db-urls-to-r2.sql
```

**2. Modificar APIs de upload**
- `/src/app/api/upload/route.ts` - Subir directo a R2
- `/src/app/api/student/assignment-submission/route.ts` - Subir assignments a R2

**3. Crear helper de R2**
- `/src/lib/r2.ts` - Función `uploadToR2()` reutilizable

**4. Variables de entorno en producción (Easypanel)**
```env
R2_ACCOUNT_ID=94c75028ea4d361827fdc3d08f8a3bc5
R2_ACCESS_KEY_ID=a703707a46667566149dc938cd7f1863
R2_SECRET_ACCESS_KEY=a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf
R2_BUCKET_NAME=smartchatix-media
R2_PUBLIC_URL=https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev
```

**5. Probar en desarrollo**
- Verificar que archivos en R2 se ven correctamente
- Probar uploads nuevos
- Probar assignments de estudiantes

**6. Deploy a producción**
- Push a GitHub (rama `main`)
- Verificar deploy automático en Easypanel
- Probar producción con URLs de R2

**7. Limpieza final**
- Eliminar `public/uploads/` del servidor de producción (NO del repo local)
- Confirmar que todo funciona con R2
- Eliminar archivos duplicados

#### 📊 Beneficios de la migración

✅ **No depende del servidor** - Archivos en CDN global
✅ **Transferencia ilimitada gratis** - Cloudflare no cobra bandwidth
✅ **Escalable** - 10GB gratis, ampliable según necesidad
✅ **Rápido** - CDN distribuido globalmente
✅ **Confiable** - Backups automáticos en R2
✅ **Separado de la app** - No se pierde en redeploys

---

## 🔧 Sesión 2026-08-21 - Integración PayPal

### ✅ Completado

**1. Integración completa de PayPal**
- ✅ Componente `PayPalButton.tsx` con SDK oficial
- ✅ Endpoints de API:
  - `/api/payment/paypal/create-order` - Crear orden
  - `/api/payment/paypal/capture` - Capturar pago
- ✅ `PayPalScriptProvider.tsx` - Carga dinámica del SDK
- ✅ Detección automática Sandbox vs Live
- ✅ Soporte para guest checkout (tarjeta sin cuenta PayPal)
- ✅ Pagos siempre en USD (PayPal no acepta PEN)
- ✅ Conversión automática PEN → USD si es necesario

**2. Métodos de pago desactivados temporalmente**
- ❌ **Culqi (tarjeta)** - Comentado en código
  - Esperando que Culqi habilite pagos internacionales
  - Código listo para activar (solo descomentar)
  - Archivos: `src/app/comprar-grabado/page.tsx:622-855` y `src/app/inscripcion-vivo/page.tsx:622-856`

**3. Métodos de pago activos**
- ✅ **PayPal** - Funciona con cuenta PayPal con saldo
  - ⚠️ Tarjetas pueden ser rechazadas por bancos (bloqueo de pagos internacionales)
  - No es problema del código, es restricción bancaria
- ✅ **Yape/Plin** - Para usuarios en Perú

**4. Fix de precios USD**
- ✅ Función `getCoursePrice()` en `smartchatix-principal-page.tsx`
- ✅ Prioriza precio USD configurado en curso (`priceGrabadoUsd`, `priceVivoUsd`)
- ✅ Solo convierte desde PEN si no existe precio USD
- ✅ Ejemplo: Muestra US$ 59 (configurado) en lugar de US$ 52.37 (convertido)

**5. Variables de entorno necesarias**
```env
# PayPal - Sandbox (Desarrollo)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AbysyyiUwzjlBrPRAwsUIVxYWm17ygCo14koE-DOJudgEnb3PglrNfEfwL3rRsC8gAolwgMHimI6HVfV
PAYPAL_SECRET_KEY=ENvUbYsbYUJLtEY2ti6CeKaFJ2olPjFlJFAy36_yXXcbhejitYP-C4e-qWOHeM4aSwo-_Poqn8BGazmI

# PayPal - Live (Producción)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_live
PAYPAL_SECRET_KEY=tu_secret_key_live
PAYPAL_MODE=live

# Culqi (comentado, esperando habilitación)
# NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_live_BkVNQg4Qo8SZBcro
# CULQI_SECRET_KEY=sk_live_BCBKan98UQHmQIaL
```

### ⏳ Pendiente

**1. Activar Culqi cuando esté disponible**
Cuando Culqi habilite pagos internacionales:
1. Descomentar sección de tarjeta en:
   - `src/app/comprar-grabado/page.tsx` (líneas 622-855)
   - `src/app/inscripcion-vivo/page.tsx` (líneas 622-856)
2. Descomentar variables de entorno de Culqi
3. Push a producción
4. Listo ✅

**Código a descomentar:**
```typescript
{/* Descomentar esta sección completa cuando Culqi habilite pagos */}
{/*
<div onClick={() => setPaymentMethod('card')} ...>
  // Todo el formulario de tarjeta Culqi
</div>
*/}
```

**2. Mejorar experiencia PayPal (opcional)**
- Implementar Advanced Credit and Debit Card Payments (requiere aprobación PayPal)
- Permitiría formulario de tarjeta en tu página con mejor control de errores

### 📊 Estado para Webinar (2026-08-22)

**Métodos disponibles:**
- ✅ PayPal (cuenta con saldo)
- ✅ Yape/Plin (Perú)

**Mensaje para usuarios:**
> "Pagos con PayPal (si tienes cuenta con saldo) o Yape/Plin. Pagos con tarjeta internacional estarán disponibles en 24-48 horas."

**Plan B si tarjetas demoran:**
- Transferencia bancaria manual
- Western Union / Wise
- Inscripción manual desde dashboard

### 🐛 Problemas Conocidos

**PayPal rechaza tarjetas:**
- **Causa**: Bancos bloquean pagos internacionales por defecto
- **Solución para usuarios**:
  1. Usar cuenta PayPal con saldo
  2. Habilitar pagos internacionales con su banco
  3. Usar Yape/Plin si es peruano

**Comportamiento de PayPal:**
- Si tarjeta es rechazada, PayPal permite reintentar con otra tarjeta
- Este comportamiento NO es controlable desde el código
- Es el flujo estándar de PayPal para no perder ventas

---

## 🔧 Sesión 2026-08-25 - Estado Actual del Proyecto

### ✅ Proyecto Funcionando Correctamente

**Estado general:**
- ✅ Plataforma LMS completa operativa
- ✅ Sistema de pagos funcionando (PayPal + Yape/Plin)
- ✅ IA integrada para generación de contenido
- ✅ Cloudflare R2 para almacenamiento de archivos
- ✅ Sistema de certificados automáticos
- ✅ Deploy automático a producción (Easypanel)

### 📋 Arquitectura Actual

**Dashboard Unificado (en migración):**
- ✅ **Ruta activa:** `/dashboard` → `/src/app/dashboard/page.tsx`
- ✅ **Componentes:** `/src/components/dashboard/*`
- ⚠️ **Legacy (no tocar):** `/admin`, `/instructor`, `/aula-virtual`
- **Regla:** Todos los roles (Admin, Instructor, Student) usan `/dashboard`
- **Diferenciación:** Por permisos y módulos según rol

**Roles del sistema:**
1. **Admin** - Control total de usuarios, cursos, estadísticas
2. **Instructor** - Creación de cursos con IA, calificaciones, certificados
3. **Student** - Acceso a cursos, quizzes, tareas, certificados

### 🎯 Funcionalidades Implementadas

**Instructor:**
- ✅ Asistente IA para crear estructura de cursos (pegar contenido o chat)
- ✅ Generación de contenido markdown con IA
- ✅ Generación de quizzes con IA (GPT-4o)
- ✅ Sistema de tareas con archivos adjuntos múltiples (R2)
- ✅ Calificaciones ponderadas configurables
- ✅ Certificados automáticos con QR verificable
- ✅ Drag & drop para reordenar módulos/lecciones

**Estudiante:**
- ✅ Aula virtual con videos, markdown, PDFs
- ✅ Quizzes interactivos con retroalimentación
- ✅ Sistema de entregas de tareas
- ✅ Descarga de certificados verificables
- ✅ Tracking de progreso

**Pagos:**
- ✅ PayPal (Sandbox + Live) - Pagos en USD
- ✅ Yape/Plin - Transferencias Perú
- ⏳ Culqi (comentado) - Esperando habilitación pagos internacionales

### 🔧 Infraestructura

**Producción:**
- **URL:** https://smartchatix.com
- **Hosting:** Easypanel (VPS con auto-deploy)
- **BD:** MariaDB (`automation_mariadbsmart`)
- **CDN:** Cloudflare R2 (10GB gratis + bandwidth ilimitado)

**Desarrollo:**
- **Comando:** `./dev.sh` (puerto 3000)
- **Hard refresh:** `Ctrl + Shift + R`
- **Build antes de push:** `npm run build` ⚠️ OBLIGATORIO

**Usuarios de prueba:**
```
Admin:
- Email: admin@fluideka.com
- Password: admin123

Instructor:
- Email: instructor@fluideka.com
- Password: instructor123

Estudiante:
- Email: estudiante@test.com
- Password: estudiante123
```

### 📦 Stack Tecnológico

**Frontend:**
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Next.js API Routes
- MySQL/MariaDB
- JWT (HttpOnly cookies)
- bcrypt

**IA:**
- OpenAI GPT-4o (quizzes - mejor adherencia a instrucciones)
- OpenAI GPT-4o-mini (estructura de cursos - económico)

**Storage:**
- Cloudflare R2 (S3-compatible)
- Videos, imágenes, PDFs, archivos de tareas

**Pagos:**
- PayPal SDK oficial
- Culqi (preparado, comentado)

### 🎨 Filosofía de Diseño

**Principios:**
- La IA es un **medio**, la **persona** es el centro
- Hablar de **transformación, productividad, aprendizaje**
- **NO** hablar de IA, automatización, herramientas como protagonista
- Diseño minimalista, mucho espacio en blanco
- Evitar iconografía tecnológica excesiva

**Header segmentado por audiencia:**
- **B2B (Servicios):** Instituciones → Aulas Virtuales
- **B2C (Cursos):** Profesionales → Cursos de IA
- Componente: `/src/components/layout/Header.tsx`

### 📊 Estado de Sesión

**Trabajo reciente (2026-08-21):**
- ✅ Integración completa PayPal
- ✅ Fix precios USD vs PEN
- ✅ Culqi comentado (listo para activar)

**Próximos pasos posibles:**
- [ ] Activar Culqi cuando esté disponible (descomentar código)
- [ ] Migrar componentes legacy a `/dashboard`
- [ ] Dominio custom para R2: `media.smartchatix.com`
- [ ] Notificaciones por email
- [ ] Gamificación (badges, leaderboards)

### ⚠️ Reglas Críticas de Desarrollo

1. **SIEMPRE ejecutar `npm run build` antes de push**
   - TypeScript strict mode detecta errores
   - Previene errores en producción

2. **Usar `./dev.sh` para iniciar servidor**
   - Mata procesos zombies
   - Libera puerto 3000
   - Inicia limpio

3. **Confirmar cambios con líneas modificadas**
   - Ejemplo: "✅ src/app/admin/page.tsx:532 - Título cambiado"
   - NUNCA dejar al usuario sin respuesta

4. **Dashboard unificado:**
   - ✅ Editar: `/src/app/dashboard/page.tsx`
   - ❌ NO editar: `/src/app/admin/page.tsx` (legacy)

5. **Hot reload automático en desarrollo**
   - NO reiniciar servidor manualmente
   - Usuario debe hacer hard refresh: `Ctrl + Shift + R`

### 📚 Documentación Clave

- `CLAUDE.md` - Guía principal para Claude Code
- `DESARROLLO.md` - Este archivo (desarrollo y sesiones)
- `AULAVIRTUAL.md` - Detalles técnicos del aula virtual
- `FUNCIONALIDADES_COMPLETAS.md` - Catálogo completo de features
- `README.md` - Descripción general del proyecto
- `CLOUDFLARE_R2.md` - Configuración CDN
- `CULQI_TESTING.md` - Testing de pagos

### 🔑 Variables de Entorno Importantes

```env
# Base de datos
DATABASE_URL=mysql://mariadbsmart:PASSWORD@automation_mariadbsmart:3306/mariadbsmart

# Auth
JWT_SECRET=...
NEXTAUTH_SECRET=...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Cloudflare R2
R2_ACCOUNT_ID=94c75028ea4d361827fdc3d08f8a3bc5
R2_ACCESS_KEY_ID=a703707a46667566149dc938cd7f1863
R2_SECRET_ACCESS_KEY=a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf
R2_BUCKET_NAME=smartchatix-media
R2_PUBLIC_URL=https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_SECRET_KEY=...
PAYPAL_MODE=sandbox  # o "live" en producción

# Culqi (comentado, listo para activar)
# NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_live_...
# CULQI_SECRET_KEY=sk_live_...
```

### 🚀 Deploy a Producción

**Proceso:**
1. `npm run build` ✅ (verificar que pase)
2. `git add .`
3. `git commit -m "mensaje"`
4. `git push origin main`
5. Easypanel detecta push y redeploya automáticamente
6. Verificar en https://smartchatix.com

**NUNCA hacer push sin verificar build.**

---

## 🔧 Sesión 2026-08-26 - Bugs de Producción y Material Adjunto

### 🐛 Bugs Corregidos

**1. CRUD de Instructores confundía "cursos que imparte" con "cursos inscrito como alumno"**
- `src/components/dashboard/AdminInstructorsSection.tsx`: el modal "Editar Instructor" mostraba/editaba matrículas de la tabla `enrollments` (alumno) bajo el título "Cursos Inscritos", mientras la tabla listaba `courses.instructor_id` (cursos que dicta). Se reemplazó por un editor real de "Cursos que Imparte" que asigna/desasigna `instructor_id` vía `PATCH /api/admin/courses/[id]`.
- Se corrigió además un desborde horizontal del modal (el `<select>` de cursos empujaba el botón "Asignar" fuera de la ventana).

**2. Menú del instructor mostraba "Mis Cursos" duplicado y con datos equivocados**
- `src/lib/dashboardMenus.ts`: el ítem "Mis Cursos" (`StudentCoursesSection`, matrícula como alumno) aparecía también para `role: 'instructor'`, duplicando "Cursos como Instructor". Ahora "Mis Cursos" es solo para `student`.

**3. Modales sin botón de cerrar (X)**
- Agregada X de cierre en los 4 modales de `AdminInstructorsSection.tsx` y los 3 de `AdminUsersSection.tsx`.

**4. 404 al crear/editar/eliminar módulos y lecciones como admin**
- Varios endpoints de `/api/instructor/*` validaban propiedad del curso con `WHERE c.instructor_id = ?` usando el ID del usuario autenticado, sin excepción para `admin`. Un admin editando el curso de OTRO instructor recibía "no encontrado" (404) en vez de poder operar.
- Corregido con bypass para `role === 'admin'` en:
  - `api/instructor/modules/route.ts` (crear módulo)
  - `api/instructor/modules/[id]/route.ts` (editar/eliminar módulo)
  - `api/instructor/lessons/route.ts` (crear lección)
  - `api/instructor/lessons/[id]/route.ts` (editar/eliminar lección)
- **Pendiente del mismo patrón** (no bloqueaban nada al momento de escribir esto): `api/instructor/students/route.ts`, `api/instructor/courses/route.ts`.

### ✨ Nueva Funcionalidad: Tipo de Lección "Material Adjunto"

Cuarto tipo de lección (junto a Lección/Quiz/Tarea) pensado para que el instructor suba material de trabajo (ej. un .zip) sin que sea video, quiz ni tarea calificada.

- **BD:** `content_type` de `lessons` ahora incluye `'material'` en el ENUM. Migración: `db/migrations/add-material-content-type.sql` (ya aplicada en local; **falta correrla en producción antes de crear lecciones de este tipo ahí**).
- **Editor** (`src/app/dashboard/curso/[slug]/page.tsx`): nueva opción en el selector de tipo, reutiliza el widget de subida múltiple de archivos (`documents_urls`) ya existente para Tareas.
- **Vista del estudiante** (`src/app/curso/[slug]/page.tsx`): nueva pantalla con título, descripción y lista de archivos descargables.

### 📌 Nota: Límite práctico de subida de video

No hay un límite de tamaño configurado en el código, pero `/api/upload` sube el archivo completo en un solo request (buffer en memoria, sin multipart ni reintentos vía `src/lib/r2.ts`). Videos de ~300MB son propensos a fallar por cortes de red o timeouts; videos livianos (~15MB) suben sin problema. **Recomendación mientras no se implemente multipart upload:** para videos pesados, subir a YouTube y pegar el link en el editor de lección.

---

**Última actualización:** 2026-08-26
**Estado:** ✅ Proyecto operativo y funcional
**Próximo agente:** Revisar este archivo completo antes de empezar cualquier tarea

---
