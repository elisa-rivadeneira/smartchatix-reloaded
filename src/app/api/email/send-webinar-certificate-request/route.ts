import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, webinar } = await request.json();

    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y correo electrónico son requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El correo electrónico no es válido' },
        { status: 400 }
      );
    }

    const emailHTMLToAdmin = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header {
            background: linear-gradient(135deg, #003366 0%, #0066CC 100%);
            color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;
          }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
          .info-box {
            background: #f8f9fa; border-left: 4px solid #FF6600;
            padding: 20px; margin: 20px 0; border-radius: 4px;
          }
          .footer {
            background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px;
            color: #666; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 26px;">🎓 Solicitud de Certificado de Webinar</h1>
            <p style="margin: 10px 0 0 0; font-size: 15px;">Pago confirmado por el usuario</p>
          </div>

          <div class="content">
            <p>Un usuario confirmó su pago y solicitó el certificado de un webinar.</p>

            <div class="info-box">
              <p style="margin: 10px 0;">
                <strong>Nombre completo (para el certificado):</strong> ${nombre}<br>
                <strong>Correo para enviar el certificado:</strong> ${email}<br>
                ${webinar ? `<strong>Webinar:</strong> ${webinar}<br>` : ''}
              </p>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;">
              <strong>⏰ Siguiente paso:</strong><br>
              Emitir el certificado manualmente y enviarlo al correo indicado.
            </p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} SmartChatix. Sistema de notificaciones automáticas.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!resend) {
      console.log('⚠️  RESEND_API_KEY no está configurada. Solicitud de certificado de webinar:');
      console.log(`👤 Nombre: ${nombre}`);
      console.log(`📧 Email: ${email}`);
      console.log(`🎓 Webinar: ${webinar || 'No especificado'}`);

      return NextResponse.json({
        success: true,
        message: 'Modo desarrollo: solicitud mostrada en consola',
        devMode: true
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartchatix.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'SmartChatix <onboarding@resend.dev>';

    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🎓 Solicitud de Certificado de Webinar - ${nombre}`,
      html: emailHTMLToAdmin,
      replyTo: email
    });

    if (adminResult.error) {
      console.error('Error enviando correo al admin:', adminResult.error);
      return NextResponse.json(
        { error: 'No se pudo enviar la solicitud, intenta de nuevo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error enviando solicitud de certificado de webinar:', error);
    return NextResponse.json(
      { error: 'Error al enviar la solicitud', details: error.message },
      { status: 500 }
    );
  }
}
