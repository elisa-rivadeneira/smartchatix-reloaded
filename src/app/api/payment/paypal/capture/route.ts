import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

function generateTemporaryPassword(): string {
  return crypto.randomBytes(8).toString('hex').slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 PayPal Capture endpoint called');
    const body = await request.json();

    const {
      orderId,
      courseSlug,
      courseTitle,
      modality,
      email
    } = body;

    console.log('🔵 Processing PayPal capture:', { orderId, email, courseSlug });

    if (!orderId || !email || !courseSlug) {
      return NextResponse.json(
        { error: 'Datos incompletos para procesar el pago' },
        { status: 400 }
      );
    }

    const courseResult = await query(
      `SELECT id, title, live_start_date, live_schedule, email_confirmation_template,
              email_payment_confirmation_template, price_vivo_usd, price_grabado_usd
       FROM courses WHERE slug = ?`,
      [courseSlug]
    );

    if (!courseResult || courseResult.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseResult[0];
    const enrollmentMode = modality || 'grabado';

    // --- Verificación real con PayPal (servidor a servidor, nunca confiar en el cliente) ---
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.error('❌ PayPal credentials not configured');
      return NextResponse.json({ error: 'PayPal no configurado' }, { status: 500 });
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const orderRes = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const orderData = await orderRes.json();

    if (!orderRes.ok || orderData.status !== 'COMPLETED') {
      console.error('❌ Orden de PayPal no verificada como completada:', orderData);
      return NextResponse.json(
        { error: 'No se pudo verificar el pago con PayPal' },
        { status: 400 }
      );
    }

    const capture = orderData.purchase_units?.[0]?.payments?.captures?.[0];
    const capturedAmount = parseFloat(capture?.amount?.value || '0');
    const capturedCurrency = capture?.amount?.currency_code;
    const expectedPrice = enrollmentMode === 'vivo' ? course.price_vivo_usd : course.price_grabado_usd;

    if (
      !capture ||
      capture.status !== 'COMPLETED' ||
      capturedCurrency !== 'USD' ||
      (expectedPrice != null && capturedAmount < Number(expectedPrice) - 0.01)
    ) {
      console.error('❌ Captura de PayPal inválida o monto insuficiente:', {
        capturedAmount,
        capturedCurrency,
        expectedPrice,
        capture
      });
      return NextResponse.json(
        { error: 'El pago no pudo ser verificado' },
        { status: 400 }
      );
    }

    const amount = capturedAmount;

    try {
      console.log('🔍 Verificando inscripción previa para:', email, 'en curso:', courseSlug);

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
          console.log('❌ INSCRIPCIÓN DUPLICADA DETECTADA - Bloqueando pago');
          return NextResponse.json(
            {
              error: 'Ya estás inscrito en este curso',
              message: 'Ya tienes una inscripción activa en este curso. Por favor revisa tu correo electrónico para ver la confirmación de tu inscripción anterior.',
              alreadyEnrolled: true
            },
            { status: 400 }
          );
        }
      }
    } catch (dbError) {
      console.error('Error verificando inscripción existente:', dbError);
    }

    try {
      let userId;
      let isNewUser = false;
      let userName = email.split('@')[0];

      const tempPassword = generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const userResult = await query(
        'SELECT id, name FROM users WHERE email = ?',
        [email]
      );

      if (userResult && userResult.length > 0) {
        userId = userResult[0].id;
        userName = userResult[0].name || userName;
        console.log('👤 Usuario existente encontrado, ID:', userId);

        await query(
          'UPDATE users SET password_hash = ? WHERE id = ?',
          [hashedPassword, userId]
        );
      } else {
        console.log('👤 Creando nuevo usuario');
        isNewUser = true;

        const insertUserResult: any = await query(
          `INSERT INTO users (name, email, password_hash, role, is_active, created_at)
           VALUES (?, ?, ?, 'student', TRUE, NOW())`,
          [userName, email, hashedPassword]
        );
        userId = insertUserResult.insertId;
      }

      const insertEnrollmentResult = await query(
        `INSERT INTO enrollments (
          user_id,
          course_id,
          modality,
          payment_amount,
          payment_status,
          enrolled_at
        ) VALUES (?, ?, ?, ?, 'completed', NOW())`,
        [userId, course.id, enrollmentMode, amount]
      );

      console.log('✅ Inscripción creada exitosamente:', insertEnrollmentResult);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const emailResponse = await fetch(`${baseUrl}/api/email/send-purchase-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            name: userName,
            courseTitle: courseTitle || course.title,
            modality: enrollmentMode === 'vivo' ? 'En Vivo' : 'Grabado',
            amount: amount,
            password: tempPassword,
            isNewUser: true,
            liveStartDate: course.live_start_date,
            liveSchedule: course.live_schedule,
            emailConfirmationTemplate: course.email_confirmation_template,
            emailPaymentConfirmationTemplate: course.email_payment_confirmation_template
          })
        });

        if (emailResponse.ok) {
          console.log('✅ Email enviado exitosamente');
        } else {
          const errorText = await emailResponse.text();
          console.error('❌ Error enviando email:', errorText);
        }
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
      }

      return NextResponse.json({
        success: true,
        paymentId: orderId,
        enrollment: {
          userId,
          courseId: course.id,
          courseTitle: course.title,
          email: email,
          isNewUser: isNewUser
        }
      });
    } catch (dbError) {
      console.error('❌ Error en inscripción:', dbError);
      return NextResponse.json(
        { error: 'Error al procesar la inscripción' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error en PayPal capture:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
