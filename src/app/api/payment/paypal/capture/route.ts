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
      email,
      amount,
      currency = 'USD',
      paypalOrderData
    } = body;

    console.log('🔵 Processing PayPal capture:', { orderId, email, courseSlug, amount, currency });

    if (!orderId || !email || !courseSlug) {
      return NextResponse.json(
        { error: 'Datos incompletos para procesar el pago' },
        { status: 400 }
      );
    }

    if (courseSlug && email) {
      try {
        console.log('🔍 Verificando inscripción previa para:', email, 'en curso:', courseSlug);

        const courseResult = await query(
          'SELECT id, title FROM courses WHERE slug = ?',
          [courseSlug]
        );

        if (courseResult && courseResult.length > 0) {
          const course = courseResult[0];
          console.log('📚 Curso encontrado:', course.title, 'ID:', course.id);

          const userResult = await query(
            'SELECT id FROM users WHERE email = ?',
            [email]
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
              console.log('✅ No hay inscripción previa, procediendo con la inscripción');
            }
          } else {
            console.log('✅ Usuario nuevo, procediendo con la inscripción');
          }
        }
      } catch (dbError) {
        console.error('Error verificando inscripción existente:', dbError);
      }
    }

    if (courseSlug && email) {
      try {
        const courseResult = await query(
          'SELECT id, title, live_start_date, live_schedule, email_confirmation_template, email_payment_confirmation_template FROM courses WHERE slug = ?',
          [courseSlug]
        );

        if (courseResult && courseResult.length > 0) {
          const course = courseResult[0];
          console.log('📚 Curso encontrado para inscripción:', course.title);

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
            console.log('🔑 Generando nueva contraseña temporal');

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
            console.log('✅ Nuevo usuario creado, ID:', userId);
          }

          const enrollmentMode = modality || 'grabado';
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

          console.log('📧 Enviando email con credenciales');
          try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const emailResponse = await fetch(`${baseUrl}/api/email/send-purchase-confirmation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email,
                name: userName,
                courseTitle: courseTitle,
                modality: modality === 'vivo' ? 'En Vivo' : 'Grabado',
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
        } else {
          return NextResponse.json(
            { error: 'Curso no encontrado' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('❌ Error en inscripción:', dbError);
        return NextResponse.json(
          { error: 'Error al procesar la inscripción' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      paymentId: orderId
    });
  } catch (error) {
    console.error('❌ Error en PayPal capture:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
