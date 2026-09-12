import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
  console.error('Faltan variables de entorno R2_*. Corre con: node --env-file=.env.local scripts/upload-ansys-cfd-assets-to-r2.mjs');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const FILES = [
  { path: '/home/oem/Pictures/cfd_modulo01.png', key: 'assets/ansys-cfd/cfd_modulo01.png', contentType: 'image/png' },
  { path: '/home/oem/Pictures/cfd_modulo02.png', key: 'assets/ansys-cfd/cfd_modulo02.png', contentType: 'image/png' },
  { path: '/home/oem/Pictures/cfd_modulo03.png', key: 'assets/ansys-cfd/cfd_modulo03.png', contentType: 'image/png' },
  { path: '/home/oem/Pictures/cfd_modulo04.png', key: 'assets/ansys-cfd/cfd_modulo04.png', contentType: 'image/png' },
];

async function upload({ path, key, contentType }) {
  const body = readFileSync(path);
  await s3Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  const url = `${R2_PUBLIC_URL}/${key}`;
  console.log(`${path} -> ${url}`);
  return url;
}

for (const file of FILES) {
  await upload(file);
}
