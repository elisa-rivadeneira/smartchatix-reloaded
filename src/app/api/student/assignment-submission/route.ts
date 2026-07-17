import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const lesson_id = formData.get('lesson_id') as string;

    if (!file || !lesson_id) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo es demasiado grande (máx. 10MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `assignment_${decoded.id}_${lesson_id}_${timestamp}${ext}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'assignments', filename);

    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/assignments/${filename}`;

    await query(
      `INSERT INTO assignment_submissions (user_id, lesson_id, file_url, file_name)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       file_url = VALUES(file_url),
       file_name = VALUES(file_name),
       submitted_at = CURRENT_TIMESTAMP`,
      [decoded.id, lesson_id, fileUrl, file.name]
    );

    const [submission] = await query(
      `SELECT * FROM assignment_submissions WHERE user_id = ? AND lesson_id = ?`,
      [decoded.id, lesson_id]
    ) as any[];

    return NextResponse.json({
      success: true,
      submission: submission
    });
  } catch (error) {
    console.error('Error saving assignment submission:', error);
    return NextResponse.json({ error: 'Error al guardar la tarea' }, { status: 500 });
  }
}
