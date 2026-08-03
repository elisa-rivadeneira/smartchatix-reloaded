import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      courseTitle,
      modality,
      amount,
      password,
      isNewUser,
      liveStartDate,
      liveSchedule
    } = await request.json();

    if (!email || !courseTitle || !modality) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const isLiveMode = modality.toLowerCase().includes('vivo');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #FF6600 0%, #FF8C00 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .info-box {
            background: #f8f9fa;
            border-left: 4px solid #FF6600;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box strong {
            color: #003366;
          }
          .credentials-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            background: #FF6600;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .price {
            font-size: 24px;
            color: #FF6600;
            font-weight: bold;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ ¡Compra Confirmada!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Tu pago ha sido procesado exitosamente</p>
          </div>

          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>

            <p>¡Gracias por tu compra! Confirmamos que hemos recibido tu pago por el curso:</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #003366;">📚 Detalles de tu Compra</h3>
              <p style="margin: 10px 0;">
                <strong>Curso:</strong> ${courseTitle}<br>
                <strong>Modalidad:</strong> ${modality}<br>
                <strong>Monto pagado:</strong> <span class="price">S/ ${Number(amount).toFixed(2)}</span>
              </p>
            </div>

            ${isLiveMode ? `
              <div class="info-box" style="background: #e3f2fd; border-left-color: #2196f3;">
                <h3 style="margin-top: 0; color: #1565c0;">🎥 Información del Curso en Vivo</h3>
                <p style="margin: 10px 0;">
                  <strong>📅 Fecha de inicio:</strong> ${liveStartDate || 'Por confirmar'}<br>
                  <strong>🕐 Horario:</strong> ${liveSchedule || 'Por confirmar'}
                </p>
                <p style="margin: 15px 0 0 0; padding: 15px; background: white; border-radius: 4px;">
                  <strong>📌 Importante:</strong><br>
                  Te enviaremos el enlace para unirte a la clase el mismo día de inicio del curso.
                  Asegúrate de revisar tu correo electrónico antes de la clase.
                </p>
              </div>
            ` : `
              <div class="info-box" style="background: #e8f5e9; border-left-color: #4caf50;">
                <h3 style="margin-top: 0; color: #2e7d32;">🎬 Acceso Inmediato al Curso</h3>
                <p style="margin: 10px 0;">
                  ¡Ya puedes acceder a todo el contenido grabado del curso!
                  Estudia a tu propio ritmo, cuando y donde quieras.
                </p>
              </div>
            `}

            ${isNewUser && password ? `
              <div class="credentials-box">
                <h3 style="margin-top: 0; color: #e65100;">🔑 Tus Credenciales de Acceso</h3>
                <p style="margin: 10px 0;">
                  <strong>Usuario:</strong> ${email}<br>
                  <strong>Contraseña temporal:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; color: #FF6600; font-weight: bold;">${password}</code>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                  ⚠️ Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.
                </p>
              </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
                ${isLiveMode ? '📋 Ver Mi Inscripción' : '🚀 Acceder al Curso Ahora'}
              </a>
            </div>

            <p style="margin-top: 30px;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>

            <p style="margin-top: 20px;">
              ${isLiveMode ? '¡Nos vemos en clase! 🎓' : '¡Éxito en tu aprendizaje! 🚀'}
            </p>

            <p style="margin-top: 30px; color: #666;">
              Saludos cordiales,<br>
              <strong>El equipo de SmartChatix</strong>
            </p>
          </div>

          <div class="footer">
            <p><strong>Comprobante de Pago</strong></p>
            <p>Este correo sirve como comprobante de tu compra.</p>
            <p style="margin-top: 10px; font-size: 11px;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
            <p>© ${new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!resend) {
      console.log('⚠️  RESEND_API_KEY no está configurada. Confirmación de compra:');
      console.log(`📧 Email: ${email}`);
      console.log(`📚 Curso: ${courseTitle}`);
      console.log(`💰 Monto: S/ ${amount}`);
      console.log(`📝 Modalidad: ${modality}`);

      return NextResponse.json({
        success: true,
        message: 'Modo desarrollo: confirmación mostrada en consola',
        devMode: true
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartchatix.com';

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SmartChatix <onboarding@resend.dev>',
      to: [email, adminEmail],
      subject: `✅ Confirmación de Compra - ${courseTitle}`,
      html: emailHTML,
    });

    if (error) {
      console.error('Error enviando correo con Resend:', error);
      return NextResponse.json(
        { error: 'Error al enviar correo', details: error },
        { status: 500 }
      );
    }

    console.log(`✅ Correo de confirmación enviado a ${email}`);
    console.log(`📧 ID del email: ${data?.id}`);

    return NextResponse.json({
      success: true,
      message: 'Correo enviado exitosamente',
      emailId: data?.id
    });

  } catch (error: any) {
    console.error('Error enviando correo:', error);
    return NextResponse.json(
      { error: 'Error al enviar correo', details: error.message },
      { status: 500 }
    );
  }
}
