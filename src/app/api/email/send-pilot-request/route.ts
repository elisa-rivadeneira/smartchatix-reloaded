import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const {
      nombre,
      entidad,
      cargo,
      email
    } = await request.json();

    if (!nombre || !entidad || !email) {
      return NextResponse.json(
        { error: 'Nombre, entidad y email son requeridos' },
        { status: 400 }
      );
    }

    const emailHTMLToAdmin = `
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
            background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
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
            border-left: 4px solid #8b5cf6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
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
            <h1 style="margin: 0; font-size: 28px;">🚀 Nueva Solicitud de Piloto</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Entidad interesada en probar SmartChatix Academy</p>
          </div>

          <div class="content">
            <p>Se ha recibido una nueva solicitud para participar en el programa piloto de SmartChatix Academy.</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #8b5cf6;">📋 Datos de la Solicitud</h3>
              <p style="margin: 10px 0;">
                <strong>Nombre completo:</strong> ${nombre}<br>
                <strong>Organización:</strong> ${entidad}<br>
                <strong>Cargo:</strong> ${cargo || 'No especificado'}<br>
                <strong>Correo electrónico:</strong> ${email}
              </p>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;">
              <strong>⏰ Próximos pasos:</strong><br>
              Contacta a esta entidad en menos de 24 horas para coordinar la demostración y onboarding.
            </p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} SmartChatix. Sistema de notificaciones automáticas.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailHTMLToUser = `
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
            background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
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
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
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
            <h1 style="margin: 0; font-size: 28px;">✅ ¡Solicitud Recibida!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Programa Piloto - SmartChatix Academy</p>
          </div>

          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>Gracias por tu interés en participar en el programa piloto de SmartChatix Academy.</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #1e40af;">🎯 ¿Qué sigue?</h3>
              <p style="margin: 10px 0;">
                Nuestro equipo revisará tu solicitud y te contactará en <strong>menos de 24 horas</strong> para:
              </p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Agendar una demostración personalizada</li>
                <li>Conocer las necesidades específicas de ${entidad}</li>
                <li>Definir el plan de implementación del piloto</li>
              </ul>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
              <strong>✨ Datos de tu solicitud:</strong><br>
              Organización: ${entidad}<br>
              Cargo: ${cargo || 'No especificado'}<br>
              Email: ${email}
            </p>

            <p style="margin-top: 30px;">
              Si tienes alguna pregunta urgente, puedes contactarnos directamente a <strong>admin@smartchatix.com</strong>
            </p>

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

    if (!resend) {
      console.log('⚠️  RESEND_API_KEY no está configurada. Solicitud de piloto:');
      console.log(`📧 Email: ${email}`);
      console.log(`🏢 Entidad: ${entidad}`);
      console.log(`👤 Nombre: ${nombre}`);
      console.log(`💼 Cargo: ${cargo}`);

      return NextResponse.json({
        success: true,
        message: 'Modo desarrollo: solicitud mostrada en consola',
        devMode: true
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartchatix.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'SmartChatix <onboarding@resend.dev>';

    // Enviar a admin
    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚀 Nueva Solicitud Piloto - ${entidad}`,
      html: emailHTMLToAdmin,
      replyTo: email
    });

    if (adminResult.error) {
      console.error('Error enviando correo al admin:', adminResult.error);
    }

    // Enviar confirmación al usuario
    const userResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '✅ Solicitud de Piloto Recibida - SmartChatix Academy',
      html: emailHTMLToUser,
    });

    if (userResult.error) {
      console.error('Error enviando correo al usuario:', userResult.error);
    }

    console.log(`✅ Solicitud de piloto recibida de ${entidad}`);
    console.log(`📧 Correos enviados a admin y ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada exitosamente'
    });

  } catch (error: any) {
    console.error('Error enviando solicitud de piloto:', error);
    return NextResponse.json(
      { error: 'Error al enviar solicitud', details: error.message },
      { status: 500 }
    );
  }
}
