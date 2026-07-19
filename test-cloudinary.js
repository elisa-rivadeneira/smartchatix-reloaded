#!/usr/bin/env node

const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'b0yzpair',
  api_key: '488978186762519',
  api_secret: 'rCvXF-IwZwTTgZB8HjvcRcBVvNI'
});

async function testCloudinary() {
  try {
    // 2. Upload an image
    console.log('Uploading sample image...');
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { public_id: 'test_sample_image' }
    );
    console.log('✓ Image uploaded successfully!');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 3. Get image details
    console.log('\nFetching image details...');
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log('✓ Image details:');
    console.log('  Width:', details.width, 'px');
    console.log('  Height:', details.height, 'px');
    console.log('  Format:', details.format);
    console.log('  File size:', details.bytes, 'bytes');

    // 4. Transform the image
    // f_auto: Automatically selects the best format (WebP, AVIF, etc.) based on browser support
    // q_auto: Automatically adjusts quality for optimal file size vs visual quality
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log('\n✓ Done! Click link below to see optimized version of the image.');
    console.log('Check the size and the format.');
    console.log('Transformed URL:', transformedUrl);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCloudinary();
