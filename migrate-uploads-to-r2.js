const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const R2_ACCOUNT_ID = '94c75028ea4d361827fdc3d08f8a3bc5';
const R2_ACCESS_KEY_ID = 'a703707a46667566149dc938cd7f1863';
const R2_SECRET_ACCESS_KEY = 'a196f85159c0d280be81213aefd2f43087f6be69aef5ef50aa528d92c8ba25cf';
const R2_BUCKET_NAME = 'smartchatix-media';
const PUBLIC_URL_BASE = 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const uploadedFiles = [];

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.pdf': 'application/pdf',
    '.webp': 'image/webp',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function uploadFile(filePath, relativePath) {
  const stats = fs.statSync(filePath);
  const fileSize = formatBytes(stats.size);

  console.log(`\n📤 Uploading: ${relativePath} (${fileSize})`);

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);
  const key = `uploads/${relativePath}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const publicUrl = `${PUBLIC_URL_BASE}/${key}`;
  console.log(`✅ Uploaded successfully!`);
  console.log(`🔗 URL: ${publicUrl}`);

  uploadedFiles.push({
    originalPath: `/uploads/${relativePath}`,
    r2Url: publicUrl,
    size: fileSize,
    contentType,
  });

  return publicUrl;
}

function getAllFiles(dirPath, arrayOfFiles = [], basePath = '') {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const relativePath = basePath ? path.join(basePath, file) : file;

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, relativePath);
    } else {
      arrayOfFiles.push({
        fullPath,
        relativePath,
      });
    }
  });

  return arrayOfFiles;
}

async function main() {
  try {
    const uploadsDir = './public/uploads';

    if (!fs.existsSync(uploadsDir)) {
      console.error(`❌ Directory ${uploadsDir} not found`);
      process.exit(1);
    }

    console.log('🚀 Starting migration of public/uploads/ to Cloudflare R2...\n');
    console.log(`📂 Scanning directory: ${uploadsDir}`);

    const allFiles = getAllFiles(uploadsDir);
    console.log(`\n📊 Found ${allFiles.length} files to upload\n`);
    console.log('─'.repeat(60));

    let uploaded = 0;
    let failed = 0;

    for (const file of allFiles) {
      try {
        await uploadFile(file.fullPath, file.relativePath);
        uploaded++;
      } catch (error) {
        console.error(`❌ Failed to upload ${file.relativePath}:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '─'.repeat(60));
    console.log('\n✅ Migration completed!');
    console.log(`📊 Total files: ${allFiles.length}`);
    console.log(`✅ Uploaded: ${uploaded}`);
    console.log(`❌ Failed: ${failed}`);

    const reportPath = './r2-migration-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(uploadedFiles, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Review r2-migration-report.json');
    console.log('   2. Update database URLs from /uploads/* to R2 URLs');
    console.log('   3. Test production environment');
    console.log('   4. Remove public/uploads/ from production');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

main();
