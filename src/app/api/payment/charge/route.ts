import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

function generateTemporaryPassword(): string {
  return crypto.randomBytes(8).toString('hex').slice(0, 12);
}

function replaceEmailVariables(template: string, variables: {
  nombre: string;
  email: string;
  clave: string;
  curso: string;
  modalidad?: string;
  precio?: string;
}): string {
  return template
    .replace(/{nombre}/g, variables.nombre)
    .replace(/{email}/g, variables.email)
    .replace(/{clave}/g, variables.clave)
    .replace(/{curso}/g, variables.curso)
    .replace(/{modalidad}/g, variables.modalidad || '')
    .replace(/{precio}/g, variables.precio || '');
}

function convertTextToHtml(text: string): string {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      if (line.startsWith('---')) {
        return '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">';
      }
      if (line.match(/^#+\s/)) {
        return `<h2 style="color: #003366; margin: 20px 0 10px 0;">${line.replace(/^#+\s/, '')}</h2>`;
      }
      return `<p style="margin: 10px 0; line-height: 1.6;">${line}</p>`;
    })
    .join('\n');
}

function wrapInEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #003366 0%, #0066CC 100%); padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SmartChatix</h1>
    </div>
    <div style="padding: 40px 30px;">
      ${content}
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="margin: 0; color: #5F6368; font-size: 12px;">SmartChatix - Transformamos la forma en que las personas trabajan</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Charge endpoint called');
    const body = await request.json();

    const {
      token,
      amount,
      email,
      currency = 'PEN',
      description,
      metadata
    } = body;

    console.log('🔵 Processing charge:', { token, amount, email, currency });

    if (!token || !amount || !email) {
      return NextResponse.json(
        { error: 'Token, monto y email son requeridos' },
        { status: 400 }
      );
    }

    if (metadata?.course_slug && metadata?.student_email) {
      try {
        console.log('🔍 Verificando inscripción previa para:', metadata.student_email, 'en curso:', metadata.course_slug);

        const courseResult = await query(
          'SELECT id, title FROM courses WHERE slug = ?',
          [metadata.course_slug]
        );

        if (courseResult && courseResult.length > 0) {
          const course = courseResult[0];
          console.log('📚 Curso encontrado:', course.title, 'ID:', course.id);

          const userResult = await query(
            'SELECT id FROM users WHERE email = ?',
            [metadata.student_email]
          );

          if (userResult && userResult.length > 0) {
            const userId = userResult[0].id;
            console.log('👤 Usuario encontrado, ID:', userId);

            const existingEnrollment = await query(
              'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
              [userId, course.id]
            );

            console.log('📋 Inscripciones existentes:', existingEnrollment);

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
            } else {
              console.log('✅ No hay inscripción previa, procediendo con el pago');
            }
          } else {
            console.log('✅ Usuario nuevo, procediendo con el pago');
          }
        }
      } catch (dbError) {
        console.error('Error verificando inscripción existente:', dbError);
      }
    }

    const isDemoMode = process.env.PAYMENT_DEMO_MODE === 'true' || metadata?.demo_mode === true;
    let charge: any;

    if (isDemoMode) {
      console.log('🎭 DEMO MODE: Simulating successful payment (PAYMENT_DEMO_MODE=true)');

      await new Promise(resolve => setTimeout(resolve, 1500));

      charge = {
        id: 'demo_charge_' + Date.now(),
        amount: Math.round(amount * 100),
        currency_code: currency,
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
        currency_code: currency,
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
      console.log('🔍 Respuesta de Culqi:', JSON.stringify(charge, null, 2));

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

      if (charge.outcome && charge.outcome.type !== 'venta_exitosa') {
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
          'SELECT id, title, live_start_date, live_schedule, email_confirmation_template, email_payment_confirmation_template FROM courses WHERE slug = ?',
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

          console.log('📧 Sending purchase confirmation email to:', metadata.student_email);

          try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

            const emailResponse = await fetch(`${baseUrl}/api/email/send-purchase-confirmation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: metadata.student_email,
                name: metadata.student_name || 'Estudiante',
                courseTitle: course.title,
                modality: metadata.modality || 'grabado',
                amount: amount,
                password: isNewUser ? temporaryPassword : null,
                isNewUser: isNewUser,
                liveStartDate: course.live_start_date,
                liveSchedule: course.live_schedule,
                emailConfirmationTemplate: course.email_confirmation_template,
                emailPaymentConfirmationTemplate: course.email_payment_confirmation_template
              })
            });

            if (emailResponse.ok) {
              const result = await emailResponse.json();
              console.log('📧 Purchase confirmation email sent:', result);
            } else {
              const errorText = await emailResponse.text();
              console.error('⚠️ Error sending email - Status:', emailResponse.status, 'Response:', errorText);
            }
          } catch (emailError: any) {
            console.error('⚠️ Error enviando correo de confirmación:', emailError.message);
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
