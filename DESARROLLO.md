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
