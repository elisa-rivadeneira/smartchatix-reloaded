import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id: lessonId } = await params;
    const body = await request.json();
    const { title, description, content_type, video_url, video_file, main_content, document_url, documents_urls, markdown_content, markdown_image, markdown_video, duration, is_free, has_quiz, quiz_questions_count, quiz_data, module_id } = body;

    const lessonCheck = await query(`
      SELECT l.id FROM lessons l
      INNER JOIN modules m ON l.module_id = m.id
      INNER JOIN courses c ON m.course_id = c.id
      WHERE l.id = ? AND c.instructor_id = ?
    `, [lessonId, decoded.id]);

    if (!lessonCheck || lessonCheck.length === 0) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description || '');
    }
    if (content_type !== undefined) {
      updateFields.push('content_type = ?');
      updateValues.push(content_type);
    }
    if (video_url !== undefined) {
      updateFields.push('video_url = ?');
      updateValues.push(video_url || '');
    }
    if (video_file !== undefined) {
      updateFields.push('video_file = ?');
      updateValues.push(video_file || '');
    }
    if (main_content !== undefined) {
      updateFields.push('main_content = ?');
      updateValues.push(main_content || '');
    }
    if (document_url !== undefined) {
      updateFields.push('document_url = ?');
      updateValues.push(document_url || '');
    }
    if (documents_urls !== undefined) {
      updateFields.push('documents_urls = ?');
      updateValues.push(documents_urls ? JSON.stringify(documents_urls) : null);
    }
    if (markdown_content !== undefined) {
      updateFields.push('markdown_content = ?');
      updateValues.push(markdown_content || '');
    }
    if (markdown_image !== undefined) {
      updateFields.push('markdown_image = ?');
      updateValues.push(markdown_image || '');
    }
    if (markdown_video !== undefined) {
      updateFields.push('markdown_video = ?');
      updateValues.push(markdown_video || '');
    }
    if (duration !== undefined) {
      updateFields.push('duration = ?');
      updateValues.push(duration || '');
    }
    if (is_free !== undefined) {
      updateFields.push('is_free = ?');
      updateValues.push(is_free ? 1 : 0);
    }
    if (has_quiz !== undefined) {
      updateFields.push('has_quiz = ?');
      updateValues.push(has_quiz ? 1 : 0);
    }
    if (quiz_questions_count !== undefined) {
      updateFields.push('quiz_questions_count = ?');
      updateValues.push(quiz_questions_count || 0);
    }
    if (quiz_data !== undefined) {
      updateFields.push('quiz_data = ?');
      updateValues.push(quiz_data ? JSON.stringify(quiz_data) : null);
    }
    if (module_id !== undefined) {
      updateFields.push('module_id = ?');
      updateValues.push(module_id);
    }

    if (updateFields.length > 0) {
      updateValues.push(lessonId);
      await query(
        `UPDATE lessons SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ error: 'Error al actualizar lección' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id: lessonId } = await params;

    const lessonCheck = await query(`
      SELECT l.id FROM lessons l
      INNER JOIN modules m ON l.module_id = m.id
      INNER JOIN courses c ON m.course_id = c.id
      WHERE l.id = ? AND c.instructor_id = ?
    `, [lessonId, decoded.id]);

    if (!lessonCheck || lessonCheck.length === 0) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    await query('DELETE FROM lessons WHERE id = ?', [lessonId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Error al eliminar lección' }, { status: 500 });
  }
}
