# Cloudflare R2 - Implementación en SmartChatix

## ¿Qué es Cloudflare R2?

Cloudflare R2 es un servicio de almacenamiento de objetos compatible con S3, sin costos de transferencia de datos. En SmartChatix se utiliza para almacenar:

- Imágenes de cursos (thumbnails)
- Documentos de lecciones
- Archivos adjuntos de tareas
- Material del instructor

## Configuración

### Variables de Entorno

```env
R2_ACCOUNT_ID=94c75028ea4d361827fdc3d08f8a3bc5
R2_ACCESS_KEY_ID=a703707a46667566149dc938cd7f1863
R2_SECRET_ACCESS_KEY=a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf
R2_BUCKET_NAME=smartchatix-media
R2_PUBLIC_URL=https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev
```

### Dependencias

```json
{
  "@aws-sdk/client-s3": "^3.x"
}
```

## Arquitectura

### Cliente S3 (`/src/lib/r2.ts`)

Cloudflare R2 es compatible con la API de AWS S3, por lo que usamos el SDK de AWS:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});
```

**Puntos clave:**
- `region: 'auto'` - R2 selecciona automáticamente la región óptima
- Endpoint específico de Cloudflare R2
- Autenticación mediante Access Key y Secret Key

### Función de Upload

```typescript
export async function uploadToR2(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${R2_PUBLIC_URL}/${key}`;
}
```

**Retorno:** URL pública del archivo subido

## API Endpoint (`/api/upload`)

### Seguridad

- **Autenticación:** Solo usuarios con `auth_token` válido
- **Autorización:** Solo instructores y administradores
- **Validación:** Verifica que el archivo esté presente

### Flujo de Upload

1. **Autenticación**
   ```typescript
   const token = request.cookies.get('auth_token')?.value;
   const decoded = verifyToken(token);
   if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
     return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
   }
   ```

2. **Procesamiento del Archivo**
   ```typescript
   const formData = await request.formData();
   const file = formData.get('file') as File;
   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);
   ```

3. **Generación de Nombre Único**
   ```typescript
   const timestamp = Date.now();
   const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
   const fileName = `${timestamp}_${sanitizedName}`;
   const key = `uploads/${fileName}`;
   ```

4. **Upload a R2**
   ```typescript
   const fileUrl = await uploadToR2(buffer, key, file.type);
   ```

5. **Respuesta**
   ```typescript
   return NextResponse.json({
     success: true,
     url: fileUrl,
     name: file.name,
     size: file.size,
     type: file.type
   });
   ```

## Estructura de Archivos en R2

```
smartchatix-media/
└── uploads/
    ├── 1784296468560_tuempleado_ia3.png
    ├── 1784297801476_curso_automatiza_conia.png
    └── [timestamp]_[nombre_sanitizado].[ext]
```

**Convención de nombres:**
- Prefijo: timestamp Unix en milisegundos
- Separador: guión bajo `_`
- Nombre: caracteres sanitizados (solo alfanuméricos, puntos y guiones)

## Uso en el Aula Virtual

### Desde el Frontend

```typescript
// Ejemplo: Upload de imagen de curso
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});

const data = await response.json();
console.log('URL del archivo:', data.url);
// Output: https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/1784296468560_imagen.png
```

### Almacenamiento en Base de Datos

Las URLs de R2 se guardan en la base de datos:

```sql
-- Tabla courses
UPDATE courses
SET thumbnail = 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/...'
WHERE id = 6;

-- Tabla lessons
UPDATE lessons
SET document_url = 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/...'
WHERE id = 88;
```

## Ventajas de Cloudflare R2

1. **Sin costos de transferencia de datos** - A diferencia de AWS S3
2. **Compatible con S3** - Usa el mismo SDK y herramientas
3. **Red global de Cloudflare** - Entrega rápida desde edge locations
4. **URLs públicas automáticas** - Configuración simple de bucket público
5. **Integración fácil** - Solo 5 variables de entorno

## Limitaciones Actuales

- Solo implementado para upload (no hay delete ni list)
- Solo soporta archivos individuales (no multipart upload para archivos grandes)
- No hay validación de tipo MIME
- No hay límite de tamaño configurado

## Migración desde Sistema Local

Anteriormente los archivos se guardaban en `/public/uploads/`. Ahora:

```typescript
// Antes
const filePath = `/uploads/${fileName}`;
// Se guardaba en: /public/uploads/file.png

// Ahora
const fileUrl = await uploadToR2(buffer, `uploads/${fileName}`, contentType);
// Se guarda en: https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/file.png
```

## Logs y Debugging

El endpoint `/api/upload` incluye logs detallados:

```
📤 Upload request received
🔑 Token: Found
👤 Decoded user: instructor@example.com Role: instructor
📎 File received: imagen.png Type: image/png Size: 45678
☁️ Uploading to Cloudflare R2: uploads/1784296468560_imagen.png
✅ Uploaded successfully: https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/...
```

## Configuración en Cloudflare Dashboard

1. Crear bucket `smartchatix-media`
2. Habilitar acceso público
3. Generar API Token con permisos de escritura
4. Configurar dominio personalizado público (opcional)

## Seguridad

- Las credenciales están en variables de entorno
- No se exponen en el cliente
- Solo instructores/admins pueden subir archivos
- Los archivos son públicos una vez subidos (considera agregar autenticación para archivos privados si es necesario)

## Próximas Mejoras

- [ ] Implementar eliminación de archivos
- [ ] Validación de tipo MIME permitido
- [ ] Límite de tamaño de archivo
- [ ] Soporte para archivos privados con URLs firmadas
- [ ] Multipart upload para archivos grandes (>5MB)
- [ ] Lista de archivos del usuario
- [ ] Compresión automática de imágenes
