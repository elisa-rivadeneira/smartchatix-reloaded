import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, courseSlug } = await request.json();

    if (!email || !courseSlug) {
      return NextResponse.json(
        { error: 'Email y curso son requeridos' },
        { status: 400 }
      );
    }

    console.log('🔍 Verificando inscripción para:', email, 'en curso:', courseSlug);

    const courseResult = await query(
      'SELECT id, title FROM courses WHERE slug = ?',
      [courseSlug]
    );

    if (!courseResult || courseResult.length === 0) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    const course = courseResult[0];

    const userResult = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (userResult && userResult.length > 0) {
      const userId = userResult[0].id;

      const existingEnrollment = await query(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
        [userId, course.id]
      );

      if (existingEnrollment && existingEnrollment.length > 0) {
        console.log('❌ Usuario ya inscrito en este curso');
        return NextResponse.json({
          alreadyEnrolled: true,
          message: 'Ya tienes una inscripción activa en este curso. Por favor revisa tu correo electrónico para ver la confirmación de tu inscripción.',
          courseTitle: course.title
        });
      }
    }

    console.log('✅ Usuario no inscrito, puede continuar');
    return NextResponse.json({
      alreadyEnrolled: false,
      canProceed: true
    });

  } catch (error: any) {
    console.error('Error verificando inscripción:', error);
    return NextResponse.json(
      { error: 'Error al verificar inscripción', details: error.message },
      { status: 500 }
    );
  }
}
