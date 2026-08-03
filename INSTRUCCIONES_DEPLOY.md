# 🚀 Instrucciones de Deploy a Producción - SmartChatix

**Fecha:** 2026-08-03
**Versión:** v2.1 - Sistema de Pagos Culqi Mejorado

---

## 📋 Resumen de Cambios

### ✅ Funcionalidades Implementadas
1. **Sistema de Pagos con Culqi**
   - Integración completa con Culqi (modo TEST y PRODUCCIÓN)
   - Modal de pago que se cierra automáticamente
   - Mensajes de error específicos y mejorados
   - Manejo de errores de fraude/seguridad
   - Prevención de doble inscripción

2. **Flujo de Inscripción Mejorado**
   - Verificación de inscripción previa
   - Envío automático de credenciales por email
   - Mensaje de éxito con botones de acción
   - Soporte para modalidad "en vivo" y "grabado"

3. **Configuración de Cursos**
   - Campos para modalidad en vivo (fecha, horario)
   - Características de curso grabado (JSON)
   - Learning outcomes y módulos
   - Configuración del sitio (site_settings)

---

## 🗄️ PASO 1: Migración de Base de Datos

### En el servidor de producción, ejecutar:

```bash
# Conectarse a MySQL
mysql -u root -p

# Seleccionar la base de datos
USE fluideka_lms;

# Ejecutar el script de migración
source /ruta/al/proyecto/DEPLOY_DB_MIGRATION.sql;
```

### Verificaciones importantes:

1. **Verificar que se crearon las columnas en `courses`:**
```sql
DESCRIBE courses;
```
Debe mostrar:
- `has_live_mode`
- `live_start_date`
- `live_schedule`
- `recorded_features`
- `learning_outcomes`
- `module_titles`

2. **Verificar que existe la tabla `site_settings`:**
```sql
SELECT * FROM site_settings;
```

3. **Verificar estructura de `enrollments`:**
```sql
DESCRIBE enrollments;
```
Debe tener la columna `modality` ENUM('vivo', 'grabado')

---

## 🔧 PASO 2: Variables de Entorno en Producción

### Verificar que el archivo `.env.local` (o `.env.production`) tenga:

```env
# Database
DATABASE_URL="mysql://usuario:password@localhost:3306/fluideka_lms"
DB_HOST="localhost"
DB_USER="usuario_produccion"
DB_PASSWORD="password_seguro"
DB_NAME="fluideka_lms"

# JWT Secret (CAMBIAR en producción)
JWT_SECRET="tu_jwt_secret_super_seguro_aqui"

# Culqi Payment Gateway - PRODUCCIÓN
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_live_BkVNQg4Qo8SZBcro
CULQI_SECRET_KEY=sk_live_BCBKan98UQHmQIaL
PAYMENT_DEMO_MODE=false

# Resend Email Service
RESEND_API_KEY=tu_resend_api_key_aqui
RESEND_FROM_EMAIL="SmartChatix <noreply@smartchatix.com>"
ADMIN_EMAIL="admin@smartchatix.com"

# Cloudflare R2
R2_ACCOUNT_ID=tu_r2_account_id
R2_ACCESS_KEY_ID=tu_r2_access_key_id
R2_SECRET_ACCESS_KEY=tu_r2_secret_access_key
R2_BUCKET_NAME=smartchatix-media
R2_PUBLIC_URL=https://tu-bucket-url.r2.dev

# OpenAI (para generación de contenido)
OPENAI_API_KEY=tu_openai_api_key
```

**⚠️ IMPORTANTE:**
- Usar llaves de **PRODUCCIÓN** de Culqi (`pk_live_...` y `sk_live_...`)
- `PAYMENT_DEMO_MODE=false`
- Cambiar `JWT_SECRET` por un valor único y seguro

---

## 📦 PASO 3: Deploy del Código

### Opción A: Si usas Git en producción

```bash
cd /ruta/al/proyecto
git pull origin main
npm install
npm run build
pm2 restart smartchatix
```

### Opción B: Deploy manual

```bash
# En tu máquina local
npm run build

# Subir archivos a producción (vía FTP/SFTP)
# - .next/
# - src/
# - public/
# - package.json
# - node_modules/ (o hacer npm install en servidor)
```

---

## 🧪 PASO 4: Pruebas en Producción

### 1. Verificar que el servidor funciona
```bash
curl -I https://tu-dominio.com
```
Debe retornar `HTTP/1.1 200 OK`

### 2. Probar flujo de inscripción

1. **Ir a página de inscripción:**
   - https://tu-dominio.com/inscripcion-vivo?curso=slug-del-curso
   - https://tu-dominio.com/comprar-grabado?curso=slug-del-curso

2. **Completar formulario:**
   - Ingresar email válido
   - Continuar a paso 2

3. **Probar pago con tarjeta real:**
   - ⚠️ Usar tarjeta real (no de prueba)
   - Verificar que el modal se cierre automáticamente
   - Verificar mensaje de éxito
   - Verificar email de confirmación

4. **Verificar en Panel Culqi:**
   - https://panel.culqi.com/
   - Sección "Ventas"
   - Debe aparecer el cargo

5. **Verificar en Base de Datos:**
```sql
SELECT * FROM enrollments ORDER BY enrolled_at DESC LIMIT 5;
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

---

## 🐛 PASO 5: Monitoreo y Logs

### Revisar logs del servidor
```bash
pm2 logs smartchatix
```

### Verificar errores comunes:

1. **Error de conexión a BD:**
   - Verificar credenciales en `.env`
   - Verificar que MySQL esté corriendo

2. **Error de Culqi:**
   - Verificar llaves de producción
   - Verificar que `PAYMENT_DEMO_MODE=false`

3. **Error de email:**
   - Verificar `RESEND_API_KEY`
   - Verificar logs de Resend

---

## 📝 Archivos Importantes

```
web_smartchatix/
├── DEPLOY_DB_MIGRATION.sql          # Script de migración SQL
├── INSTRUCCIONES_DEPLOY.md          # Este archivo
├── .env.local                        # Variables de entorno (NO subir a Git)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payment/charge/       # Endpoint de procesamiento de pago
│   │   │   ├── enrollment/check/     # Verificación de inscripción
│   │   │   └── email/                # Envío de emails
│   │   ├── inscripcion-vivo/         # Página de inscripción en vivo
│   │   └── comprar-grabado/          # Página de compra grabado
│   └── components/
│       └── CulqiPaymentForm.tsx      # Componente de pago Culqi
└── db/
    ├── schema.sql                    # Schema completo
    └── migrations/                   # Migraciones individuales
```

---

## ✅ Checklist Final

- [ ] Migración de BD ejecutada correctamente
- [ ] Variables de entorno configuradas (producción)
- [ ] Código actualizado (`git pull` o deploy manual)
- [ ] `npm install` ejecutado
- [ ] `npm run build` exitoso
- [ ] Servidor reiniciado (`pm2 restart`)
- [ ] Prueba de pago con tarjeta real exitosa
- [ ] Email de confirmación recibido
- [ ] Cargo visible en Panel Culqi
- [ ] Inscripción visible en BD
- [ ] Logs sin errores críticos

---

## 📞 Soporte

Si hay problemas durante el deploy:

1. Revisar logs: `pm2 logs smartchatix`
2. Revisar consola del navegador (F12)
3. Verificar conexión a BD
4. Verificar llaves de Culqi

---

## 🎯 Próximos Pasos (Opcional)

1. Configurar certificado SSL (HTTPS)
2. Configurar CDN para assets estáticos
3. Configurar backup automático de BD
4. Configurar monitoreo con Sentry/LogRocket
5. Pruebas de carga y optimización

---

**Fecha de Deploy:** _________________
**Responsable:** _________________
**Estado:** [ ] Exitoso [ ] Con errores
**Notas:** _________________
