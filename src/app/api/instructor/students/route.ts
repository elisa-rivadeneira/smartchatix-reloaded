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
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const students = await query(`
      SELECT
        u.id,
        u.name,
        u.email,
        c.title as course_title,
        e.modality,
        e.enrolled_at,
        COALESCE(
          (SELECT
            ROUND((COUNT(DISTINCT p.lesson_id) * 100.0 / COUNT(DISTINCT l.id)), 0)
          FROM modules m
          INNER JOIN lessons l ON l.module_id = m.id
          LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = u.id AND p.completed = 1
          WHERE m.course_id = c.id
          ), 0
        ) as progress
      FROM enrollments e
      INNER JOIN users u ON e.user_id = u.id
      INNER JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ? AND e.payment_status = 'completed'
      ORDER BY e.enrolled_at DESC
    `, [decoded.id]);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching instructor students:', error);
    return NextResponse.json({ error: 'Error al obtener estudiantes' }, { status: 500 });
  }
}
