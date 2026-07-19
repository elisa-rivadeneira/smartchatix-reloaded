const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

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

async function uploadVideo(filePath, key) {
  console.log(`\nUploading ${filePath}...`);

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = 'video/mp4';

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const publicUrl = `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
  console.log(`✓ Uploaded successfully!`);
  console.log(`Public URL: ${publicUrl}`);

  return publicUrl;
}

async function main() {
  try {
    const videos = [
      {
        path: './public/videos/people_animated.mp4',
        key: 'videos/people_animated.mp4'
      },
      {
        path: './public/videos/bomba_animation.mp4',
        key: 'videos/bomba_animation.mp4'
      }
    ];

    console.log('Starting video uploads to Cloudflare R2...\n');

    for (const video of videos) {
      if (fs.existsSync(video.path)) {
        await uploadVideo(video.path, video.key);
      } else {
        console.log(`⚠ Skipping ${video.path} - file not found`);
      }
    }

    console.log('\n✓ All uploads completed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
