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
          let tempPassword = '';
          const userResult = await query(
            'SELECT id FROM users WHERE email = ?',
            [email]
          );

          let userName = '';

          if (userResult && userResult.length > 0) {
            userId = userResult[0].id;
            console.log('👤 Usuario existente encontrado, ID:', userId);
            console.log('📧 SE ENVIARÁ email de bienvenida al curso (sin credenciales)');
            const userNameResult = await query('SELECT name FROM users WHERE id = ?', [userId]);
            userName = userNameResult && userNameResult.length > 0 ? userNameResult[0].name : email.split('@')[0];
          } else {
            console.log('👤 Creando nuevo usuario');
            console.log('📧 SE ENVIARÁ email de bienvenida al curso (con credenciales)');
            isNewUser = true;
            tempPassword = generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            userName = email.split('@')[0];

            const insertUserResult: any = await query(
              `INSERT INTO users (name, email, password_hash, role, is_active, created_at)
               VALUES (?, ?, ?, 'student', TRUE, NOW())`,
              [userName, email, hashedPassword]
            );
            userId = insertUserResult.insertId;
            console.log('✅ Nuevo usuario creado, ID:', userId);
          }

          try {
            let emailBody = '';

            if (course.email_confirmation_template) {
              const textWithVariables = replaceEmailVariables(course.email_confirmation_template, {
                nombre: userName,
                email: email,
                clave: tempPassword,
                curso: courseTitle,
                modalidad: modality === 'vivo' ? 'En Vivo' : 'Grabado',
                precio: `${currency === 'USD' ? 'US$' : 'S/'} ${amount.toFixed(2)}`
              });
              const htmlContent = convertTextToHtml(textWithVariables);
              emailBody = wrapInEmailTemplate(htmlContent);
            } else {
              emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #003366 0%, #0066CC 100%); padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Bienvenido a SmartChatix!</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; color: #202124; line-height: 1.6; margin-bottom: 20px;">
        ¡Hola ${userName}! Te has inscrito exitosamente al curso: <strong>${courseTitle}</strong>
      </p>
      ${isNewUser ? `
      <p style="font-size: 16px; color: #202124; line-height: 1.6; margin-bottom: 20px;">
        Tus credenciales de acceso son:
      </p>
      <div style="background-color: #E8F5E9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; color: #2E7D32; font-size: 14px;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0; color: #2E7D32; font-size: 14px;"><strong>Contraseña temporal:</strong> ${tempPassword}</p>
      </div>
      <p style="font-size: 14px; color: #5F6368; line-height: 1.6; margin-bottom: 30px;">
        Por favor, cambia tu contraseña después de iniciar sesión por primera vez.
      </p>
      ` : `
      <p style="font-size: 16px; color: #202124; line-height: 1.6; margin-bottom: 20px;">
        Puedes acceder al curso usando tu cuenta existente: <strong>${email}</strong>
      </p>
      `}
      <div style="text-align: center;">
        <a href="https://smartchatix.com/login" style="display: inline-block; background: linear-gradient(135deg, #FF6600 0%, #FF8C00 100%); color: #ffffff; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Ir al Aula Virtual
        </a>
      </div>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
      <p style="margin: 0; color: #5F6368; font-size: 12px;">SmartChatix - Transformamos la forma en que las personas trabajan</p>
    </div>
  </div>
</body>
</html>
              `;
            }

            const emailHtml = emailBody;

            const resendApiKey = process.env.RESEND_API_KEY;
            const emailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
              },
              body: JSON.stringify({
                from: 'SmartChatix <noreply@smartchatix.com>',
                to: email,
                subject: `Bienvenido a ${courseTitle}${isNewUser ? ' - Tus credenciales de acceso' : ''}`,
                html: emailHtml
              })
            });

            if (emailResponse.ok) {
              const emailResult = await emailResponse.json();
              console.log('✅ Email de bienvenida enviado exitosamente:', emailResult);
            } else {
              const errorText = await emailResponse.text();
              console.error('❌ Error enviando email de bienvenida - Status:', emailResponse.status);
              console.error('❌ Error details:', errorText);
            }
          } catch (emailError) {
            console.error('❌ Error al enviar email de bienvenida:', emailError);
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

          try {
            let confirmationEmailBody = '';

            if (course.email_payment_confirmation_template) {
              const userName = await query('SELECT name FROM users WHERE id = ?', [userId]);
              const textWithVariables = replaceEmailVariables(course.email_payment_confirmation_template, {
                nombre: userName && userName.length > 0 ? userName[0].name : email.split('@')[0],
                email: email,
                clave: '',
                curso: courseTitle,
                modalidad: modality === 'vivo' ? 'En Vivo' : 'Grabado',
                precio: `${currency === 'USD' ? 'US$' : 'S/'} ${amount.toFixed(2)}`
              });
              const htmlContent = convertTextToHtml(textWithVariables);
              confirmationEmailBody = wrapInEmailTemplate(htmlContent);
            } else {
              confirmationEmailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #003366 0%, #0066CC 100%); padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Pago Confirmado!</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; color: #202124; line-height: 1.6; margin-bottom: 20px;">
        Tu pago ha sido procesado exitosamente a través de PayPal.
      </p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; color: #5F6368; font-size: 14px;"><strong>Curso:</strong> ${courseTitle}</p>
        <p style="margin: 0 0 10px 0; color: #5F6368; font-size: 14px;"><strong>Modalidad:</strong> ${modality === 'vivo' ? 'En Vivo' : 'Grabado'}</p>
        <p style="margin: 0 0 10px 0; color: #5F6368; font-size: 14px;"><strong>Monto:</strong> ${currency === 'USD' ? 'US$' : 'S/'} ${amount.toFixed(2)}</p>
        <p style="margin: 0; color: #5F6368; font-size: 14px;"><strong>ID de transacción:</strong> ${orderId}</p>
      </div>
      <div style="text-align: center;">
        <a href="https://smartchatix.com/login" style="display: inline-block; background: linear-gradient(135deg, #FF6600 0%, #FF8C00 100%); color: #ffffff; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Acceder al Curso
        </a>
      </div>
    </div>
  </div>
</body>
</html>
              `;
            }

            const confirmationEmailHtml = confirmationEmailBody;

            const resendApiKey = process.env.RESEND_API_KEY;
            const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
              },
              body: JSON.stringify({
                from: 'SmartChatix <noreply@smartchatix.com>',
                to: email,
                subject: `Confirmación de compra - ${courseTitle}`,
                html: confirmationEmailHtml
              })
            });

            if (confirmationEmailResponse.ok) {
              const confirmResult = await confirmationEmailResponse.json();
              console.log('✅ Email de confirmación enviado:', confirmResult);
            } else {
              const errorText = await confirmationEmailResponse.text();
              console.error('❌ Error enviando email de confirmación - Status:', confirmationEmailResponse.status);
              console.error('❌ Error details:', errorText);
            }
          } catch (emailError) {
            console.error('❌ Error enviando email de confirmación:', emailError);
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
