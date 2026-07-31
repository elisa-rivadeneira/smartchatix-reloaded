import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const enrollments = await query(`
      SELECT
        e.id,
        e.user_id,
        e.course_id,
        e.modality,
        e.payment_amount,
        e.payment_status,
        e.enrolled_at,
        e.expires_at,
        u.name as student_name,
        u.email as student_email,
        c.title as course_title,
        c.slug as course_slug
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
    `);

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}
