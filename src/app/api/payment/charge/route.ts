import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

function generateTemporaryPassword(): string {
  return crypto.randomBytes(8).toString('hex').slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Charge endpoint called');
    const body = await request.json();

    const {
      token,
      amount,
      email,
      description,
      metadata
    } = body;

    console.log('🔵 Processing charge:', { token, amount, email });

    if (!token || !amount || !email) {
      return NextResponse.json(
        { error: 'Token, monto y email son requeridos' },
        { status: 400 }
      );
    }

    const isDemoMode = metadata?.demo_mode === true;
    let charge: any;

    if (isDemoMode) {
      console.log('🎭 DEMO MODE: Simulating successful payment');

      await new Promise(resolve => setTimeout(resolve, 1500));

      charge = {
        id: 'demo_charge_' + Date.now(),
        amount: Math.round(amount * 100),
        currency_code: 'PEN',
        email: email,
        outcome: {
          type: 'venta_exitosa',
          user_message: 'Pago simulado exitosamente (MODO DEMO)'
        },
        metadata: metadata
      };
    } else {
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

      charge = await culqiResponse.json();

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
          let isNewUser = false;
          let temporaryPassword = '';

          if (userResult && userResult.length > 0) {
            userId = userResult[0].id;
          } else {
            isNewUser = true;
            temporaryPassword = generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

            const insertResult: any = await query(
              `INSERT INTO users (name, email, password_hash, role, is_active, created_at)
               VALUES (?, ?, ?, 'student', TRUE, NOW())`,
              [metadata.student_name || 'Estudiante', metadata.student_email, hashedPassword]
            );
            userId = (insertResult as any).insertId;
          }

          const existingEnrollment = await query(
            'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
            [userId, course.id]
          );

          if (!existingEnrollment || existingEnrollment.length === 0) {
            await query(
              `INSERT INTO enrollments (user_id, course_id, modality, payment_amount, payment_status, enrolled_at)
               VALUES (?, ?, ?, ?, 'completed', NOW())`,
              [userId, course.id, metadata.modality || 'grabado', amount]
            );
          }

          if (isNewUser && temporaryPassword) {
            console.log('📧 Queuing credentials email to:', metadata.student_email);

            fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send-credentials`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: metadata.student_email,
                name: metadata.student_name || 'Estudiante',
                password: temporaryPassword,
                courseTitle: course.title
              })
            }).then(() => {
              console.log('📧 Email sent successfully');
            }).catch((emailError) => {
              console.error('⚠️ Error enviando correo:', emailError);
            });
          }

          return NextResponse.json({
            success: true,
            charge_id: charge.id,
            amount: charge.amount / 100,
            currency: charge.currency_code,
            outcome: charge.outcome,
            enrollment: {
              isNewUser,
              courseTitle: course.title,
              email: metadata.student_email
            }
          });
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
