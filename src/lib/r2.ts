import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = '94c75028ea4d361827fdc3d08f8a3bc5';
const R2_ACCESS_KEY_ID = 'a703707a46667566149dc938cd7f1863';
const R2_SECRET_ACCESS_KEY = 'a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf';
const R2_BUCKET_NAME = 'smartchatix-media';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

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

  return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
}

export { s3Client, R2_BUCKET_NAME };
