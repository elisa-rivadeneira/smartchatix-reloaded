import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request: NextRequest) {
  console.log('📤 Upload request received');
  try {
    const token = request.cookies.get('auth_token')?.value;
    console.log('🔑 Token:', token ? 'Found' : 'Missing');
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log('👤 Decoded user:', decoded?.email, 'Role:', decoded?.role);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('📎 File received:', file?.name, 'Type:', file?.type, 'Size:', file?.size);

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;

    const key = `uploads/${fileName}`;

    console.log('☁️ Uploading to Cloudflare R2:', key);
    const fileUrl = await uploadToR2(buffer, key, file.type || 'application/octet-stream');
    console.log('✅ Uploaded successfully:', fileUrl);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}
