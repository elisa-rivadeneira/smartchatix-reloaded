import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;

    const [course]: any = await query(
      `SELECT id, instructor_id FROM courses WHERE slug = ?`,
      [slug]
    );

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (decoded.role === 'instructor' && course.instructor_id !== decoded.id) {
      return NextResponse.json({ error: 'No tienes permiso para ver estos estudiantes' }, { status: 403 });
    }

    const students = await query(`
      SELECT
        u.id,
        u.name,
        u.email,
        e.modality,
        e.enrolled_at,
        e.payment_status,
        c.certificate_url,
        c.verification_code,
        c.issue_type,
        COALESCE(
          (SELECT
            ROUND((COUNT(DISTINCT CASE WHEN p.completed = 1 THEN p.lesson_id END) * 100.0 / COUNT(DISTINCT l.id)), 0)
          FROM modules m
          INNER JOIN lessons l ON l.module_id = m.id
          LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = u.id
          WHERE m.course_id = ?
          ), 0
        ) as progress
      FROM enrollments e
      INNER JOIN users u ON e.user_id = u.id
      LEFT JOIN certificates c ON c.student_id = u.id AND c.course_id = e.course_id
      WHERE e.course_id = ? AND e.payment_status = 'completed'
      ORDER BY e.enrolled_at DESC
    `, [course.id, course.id]);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching course students:', error);
    return NextResponse.json({ error: 'Error al obtener estudiantes' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;
    const { email, modality } = await request.json();

    const [course]: any = await query(
      `SELECT id, instructor_id FROM courses WHERE slug = ?`,
      [slug]
    );

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (decoded.role === 'instructor' && course.instructor_id !== decoded.id) {
      return NextResponse.json({ error: 'No tienes permiso para agregar estudiantes' }, { status: 403 });
    }

    const [user]: any = await query(
      `SELECT id, role FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado con ese email' }, { status: 404 });
    }

    const [existing]: any = await query(
      `SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?`,
      [user.id, course.id]
    );

    if (existing) {
      return NextResponse.json({ error: 'El usuario ya está inscrito en este curso' }, { status: 400 });
    }

    await query(
      `INSERT INTO enrollments (user_id, course_id, modality, payment_status, enrolled_at)
       VALUES (?, ?, ?, 'completed', NOW())`,
      [user.id, course.id, modality || 'grabado']
    );

    return NextResponse.json({ message: 'Estudiante agregado exitosamente' });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Error al agregar estudiante' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;
    const { userId } = await request.json();

    const [course]: any = await query(
      `SELECT id, instructor_id FROM courses WHERE slug = ?`,
      [slug]
    );

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (decoded.role === 'instructor' && course.instructor_id !== decoded.id) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar estudiantes' }, { status: 403 });
    }

    await query(
      `DELETE FROM enrollments WHERE user_id = ? AND course_id = ?`,
      [userId, course.id]
    );

    await query(
      `DELETE FROM progress WHERE user_id = ? AND lesson_id IN (
        SELECT l.id FROM lessons l
        INNER JOIN modules m ON l.module_id = m.id
        WHERE m.course_id = ?
      )`,
      [userId, course.id]
    );

    return NextResponse.json({ message: 'Estudiante eliminado exitosamente' });
  } catch (error) {
    console.error('Error removing student:', error);
    return NextResponse.json({ error: 'Error al eliminar estudiante' }, { status: 500 });
  }
}
