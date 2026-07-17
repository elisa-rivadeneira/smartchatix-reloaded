import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const submissions = await query(
      `SELECT
        asub.id,
        asub.user_id,
        asub.lesson_id,
        asub.file_url,
        asub.file_name,
        asub.submitted_at,
        asub.grade,
        asub.feedback,
        asub.graded_at,
        u.name as student_name,
        u.email as student_email
       FROM assignment_submissions asub
       JOIN users u ON asub.user_id = u.id
       WHERE asub.lesson_id = ?
       ORDER BY asub.submitted_at DESC`,
      [lessonId]
    );

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    return NextResponse.json(
      { error: 'Error al obtener entregas' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { submission_id, grade, feedback } = await request.json();

    if (!submission_id || grade === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    await query(
      `UPDATE assignment_submissions
       SET grade = ?, feedback = ?, graded_at = CURRENT_TIMESTAMP, graded_by = ?
       WHERE id = ? AND lesson_id = ?`,
      [grade, feedback || null, user.id, submission_id, lessonId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error grading assignment:', error);
    return NextResponse.json(
      { error: 'Error al calificar tarea' },
      { status: 500 }
    );
  }
}
