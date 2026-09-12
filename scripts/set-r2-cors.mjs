import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

try {
  const current = await s3Client.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME }));
  console.log('CORS actual:', JSON.stringify(current.CORSRules, null, 2));
} catch (e) {
  console.log('Sin CORS configurado todavia (esperado):', e.name);
}

await s3Client.send(new PutBucketCorsCommand({
  Bucket: R2_BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: ['*'],
        AllowedMethods: ['GET', 'HEAD'],
        AllowedHeaders: ['*'],
        MaxAgeSeconds: 3600,
      },
    ],
  },
}));

console.log('CORS actualizado.');
const after = await s3Client.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME }));
console.log(JSON.stringify(after.CORSRules, null, 2));
