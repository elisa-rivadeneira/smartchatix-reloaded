import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { module_id, title, description, content_type, video_url, video_file, main_content, document_url, markdown_content, markdown_image, markdown_video, duration, is_free, has_quiz, quiz_questions_count, quiz_data } = body;

    const moduleCheck = await query(`
      SELECT m.id FROM modules m
      INNER JOIN courses c ON m.course_id = c.id
      WHERE m.id = ? AND c.instructor_id = ?
    `, [module_id, decoded.id]);

    if (!moduleCheck || moduleCheck.length === 0) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }

    const maxOrder = await query(
      'SELECT COALESCE(MAX(order_index), -1) as max_order FROM lessons WHERE module_id = ?',
      [module_id]
    );

    const order_index = (maxOrder[0]?.max_order || -1) + 1;

    const result = await query(
      `INSERT INTO lessons (module_id, title, description, content_type, video_url, video_file, main_content, document_url, markdown_content, markdown_image, markdown_video, duration, is_free, has_quiz, quiz_questions_count, quiz_data, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [module_id, title, description || '', content_type, video_url || '', video_file || '', main_content || '', document_url || '', markdown_content || '', markdown_image || '', markdown_video || '', duration || '', is_free ? 1 : 0, has_quiz ? 1 : 0, quiz_questions_count || 0, quiz_data ? JSON.stringify(quiz_data) : null, order_index]
    );

    return NextResponse.json({
      success: true,
      lesson: {
        id: (result as any).insertId,
        module_id,
        title,
        description,
        content_type,
        video_url,
        document_url,
        markdown_content,
        markdown_image,
        duration,
        is_free,
        order_index
      }
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Error al crear lección' }, { status: 500 });
  }
}
