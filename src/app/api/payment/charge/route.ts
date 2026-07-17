import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      token,
      amount,
      email,
      description,
      metadata
    } = body;

    if (!token || !amount || !email) {
      return NextResponse.json(
        { error: 'Token, monto y email son requeridos' },
        { status: 400 }
      );
    }

    const chargeData = {
      amount: Math.round(amount * 100),
      currency_code: 'PEN',
      email,
      source_id: token,
      description: description || 'Compra de curso',
      metadata: metadata || {}
    };

    const culqiResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CULQI_SECRET_KEY}`
      },
      body: JSON.stringify(chargeData)
    });

    const charge = await culqiResponse.json();

    if (!culqiResponse.ok) {
      console.error('Culqi charge error:', charge);
      return NextResponse.json(
        {
          error: 'Error al procesar el pago',
          details: charge.user_message || charge.merchant_message || 'Error desconocido'
        },
        { status: 400 }
      );
    }

    if (charge.outcome.type !== 'venta_exitosa') {
      return NextResponse.json(
        {
          error: 'El pago no fue exitoso',
          details: charge.outcome.user_message
        },
        { status: 400 }
      );
    }

    if (metadata?.course_slug && metadata?.student_email) {
      try {
        const courseResult = await query(
          'SELECT id, title FROM courses WHERE slug = ?',
          [metadata.course_slug]
        );

        if (courseResult && courseResult.length > 0) {
          const course = courseResult[0];

          let userResult = await query(
            'SELECT id FROM users WHERE email = ?',
            [metadata.student_email]
          );

          let userId;

          if (userResult && userResult.length > 0) {
            userId = userResult[0].id;
          } else {
            const insertResult: any = await query(
              `INSERT INTO users (name, email, password, role, created_at)
               VALUES (?, ?, '', 'student', NOW())`,
              [metadata.student_name || 'Estudiante', metadata.student_email]
            );
            userId = (insertResult as any).insertId;
          }

          const existingEnrollment = await query(
            'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
            [userId, course.id]
          );

          if (!existingEnrollment || existingEnrollment.length === 0) {
            await query(
              `INSERT INTO enrollments (user_id, course_id, enrolled_at, payment_status, payment_id)
               VALUES (?, ?, NOW(), 'completed', ?)`,
              [userId, course.id, charge.id]
            );
          }
        }
      } catch (dbError) {
        console.error('Error registrando matrícula:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      charge_id: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency_code,
      outcome: charge.outcome
    });

  } catch (error: any) {
    console.error('Error processing Culqi charge:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar el pago',
        details: error.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
