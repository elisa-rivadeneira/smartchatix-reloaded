import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const path = process.argv[2];
const key = process.argv[3];
const body = readFileSync(path);
await s3Client.send(new PutObjectCommand({
  Bucket: R2_BUCKET_NAME,
  Key: key,
  Body: body,
  ContentType: 'video/mp4',
  CacheControl: 'public, max-age=31536000, immutable',
}));
console.log(`${R2_PUBLIC_URL}/${key}`);
