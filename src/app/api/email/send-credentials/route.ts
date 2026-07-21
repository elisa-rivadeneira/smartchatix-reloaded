import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, courseTitle } = await request.json();

    if (!email || !password || !courseTitle) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

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
            background: linear-gradient(135deg, #003366 0%, #0066CC 100%);
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
          .credentials-box {
            background: #f8f9fa;
            border-left: 4px solid #FF6600;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .credentials-box strong {
            color: #003366;
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 ¡Felicitaciones!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Te has inscrito exitosamente</p>
          </div>

          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>

            <p>¡Bienvenido a <strong>SmartChatix</strong>! Nos complace confirmarte que tu inscripción al curso <strong>"${courseTitle}"</strong> ha sido exitosa.</p>

            <div class="credentials-box">
              <h3 style="margin-top: 0; color: #003366;">📧 Tus Credenciales de Acceso</h3>
              <p style="margin: 10px 0;">
                <strong>Usuario:</strong> ${email}<br>
                <strong>Contraseña temporal:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; color: #FF6600; font-weight: bold;">${password}</code>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                ⚠️ Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.
              </p>
            </div>

            <p><strong>Ya puedes acceder al aula virtual:</strong></p>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
                Ingresar al Aula Virtual
              </a>
            </div>

            <p style="margin-top: 30px;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>

            <p style="margin-top: 20px;">¡Éxito en tu aprendizaje! 🚀</p>

            <p style="margin-top: 30px; color: #666;">
              Saludos cordiales,<br>
              <strong>El equipo de SmartChatix</strong>
            </p>
          </div>

          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>© ${new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️  RESEND_API_KEY no está configurada. Credenciales:');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Contraseña: ${password}`);
      console.log(`📚 Curso: ${courseTitle}`);

      return NextResponse.json({
        success: true,
        message: 'Modo desarrollo: credenciales mostradas en consola',
        devMode: true
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'SmartChatix <no-reply@smartchatix.com>',
      to: [email],
      subject: `🎉 Bienvenido a ${courseTitle} - Tus credenciales de acceso`,
      html: emailHTML,
    });

    if (error) {
      console.error('Error enviando correo con Resend:', error);
      return NextResponse.json(
        { error: 'Error al enviar correo', details: error },
        { status: 500 }
      );
    }

    console.log(`✅ Correo enviado exitosamente a ${email}`);
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
