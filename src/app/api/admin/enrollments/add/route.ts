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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { user_id, course_id, modality, payment_amount, payment_status } = body;

    const existing = await query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'El usuario ya está inscrito en este curso' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO enrollments (user_id, course_id, modality, payment_amount, payment_status, enrolled_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, course_id, modality || 'grabado', payment_amount || 0, payment_status || 'completed']
    );

    const userResult = await query(
      'SELECT id, email, name, password_hash FROM users WHERE id = ?',
      [user_id]
    );

    const courseResult = await query(
      'SELECT id, title, slug, email_confirmation_template FROM courses WHERE id = ?',
      [course_id]
    );

    const user = userResult && userResult.length > 0 ? userResult[0] : null;
    const hasPassword = user && user.password_hash ? true : false;

    const course = courseResult && courseResult.length > 0 ? courseResult[0] : null;

    return NextResponse.json({
      success: true,
      message: 'Inscripción agregada correctamente',
      user: user ? { id: user.id, email: user.email, name: user.name } : null,
      course: course ? {
        id: course.id,
        title: course.title,
        slug: course.slug,
        emailTemplate: course.email_confirmation_template
      } : null,
      hasPassword: hasPassword
    });
  } catch (error: any) {
    console.error('Error adding enrollment:', error);
    return NextResponse.json(
      { error: 'Error al agregar inscripción', details: error.message },
      { status: 500 }
    );
  }
}
