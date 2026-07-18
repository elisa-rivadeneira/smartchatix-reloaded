# Migración de Código para Usar R2

## Archivos que necesitan actualización

### 1. `/src/app/api/upload/route.ts`
**Línea 45:** Cambia `const fileUrl = `/uploads/${fileName}`;`

**Solución:** Integrar con `src/lib/r2.ts` para subir directamente a R2

```typescript
import { uploadToR2 } from '@/lib/r2';

// Reemplazar líneas 33-45:
const fileName = `${timestamp}_${sanitizedName}`;
const fileUrl = await uploadToR2(buffer, fileName, file.type);

return NextResponse.json({
  success: true,
  url: fileUrl, // Ahora será https://pub-*.r2.dev/uploads/...
  name: file.name,
  size: file.size,
  type: file.type
});
```

### 2. `/src/app/api/student/assignment-submission/route.ts`
**Línea 41:** Cambia `const fileUrl = `/uploads/assignments/${filename}`;`

**Solución:** Integrar con R2

```typescript
import { uploadToR2 } from '@/lib/r2';

// Reemplazar líneas 34-41:
const filename = `assignments/assignment_${decoded.id}_${lesson_id}_${timestamp}${ext}`;
const fileUrl = await uploadToR2(buffer, filename, file.type);

// Guardar en BD con URL de R2
await query(
  `INSERT INTO assignment_submissions (user_id, lesson_id, file_url, file_name)
   VALUES (?, ?, ?, ?)`,
  [decoded.id, lesson_id, fileUrl, file.name]
);
```

### 3. Crear `/src/lib/r2.ts` (si no existe)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '94c75028ea4d361827fdc3d08f8a3bc5';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'a703707a46667566149dc938cd7f1863';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'smartchatix-media';
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL || 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${PUBLIC_URL_BASE}/${key}`;
}
```

### 4. Actualizar variables de entorno

**Desarrollo (`.env.local`):**
```env
R2_ACCOUNT_ID=94c75028ea4d361827fdc3d08f8a3bc5
R2_ACCESS_KEY_ID=a703707a46667566149dc938cd7f1863
R2_SECRET_ACCESS_KEY=a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf
R2_BUCKET_NAME=smartchatix-media
R2_PUBLIC_URL=https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev
```

**Producción (Easypanel):**
- Agregar las mismas variables en el panel de Easypanel

## Ventajas de esta migración

1. **No usar disco local** - Todo va directo a R2 (CDN global)
2. **Transferencia ilimitada gratis** - Cloudflare no cobra por bandwidth
3. **URLs permanentes** - No dependen del servidor de aplicación
4. **Escalabilidad** - 10GB gratis, ampliable si es necesario
5. **Backups automáticos** - Los archivos están en R2, separados de la app

## Desventajas de mantener `/uploads/` local

1. ❌ Ocupa espacio en el servidor (1.2 GB)
2. ❌ No incluido en Git (se pierde en redeploys)
3. ❌ Backups manuales necesarios
4. ❌ Usa bandwidth del servidor (no es gratis)
5. ❌ No es CDN (lento para usuarios lejanos)

## Próximos pasos

1. ✅ Migrar archivos existentes a R2 (COMPLETADO)
2. ⏳ Actualizar base de datos con nuevas URLs
3. ⏳ Modificar APIs de upload para usar R2
4. ⏳ Probar en desarrollo
5. ⏳ Deploy a producción
6. ⏳ Eliminar `public/uploads/` del servidor de producción
