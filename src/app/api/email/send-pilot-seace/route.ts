import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const {
      nombre,
      empresa,
      cargo,
      email,
      whatsapp,
      segmentos
    } = await request.json();

    if (!nombre || !empresa || !email || !whatsapp || !segmentos || segmentos.length === 0) {
      return NextResponse.json(
        { error: 'Nombre, empresa, email, WhatsApp y al menos un segmento son requeridos' },
        { status: 400 }
      );
    }

    const segmentosHTML = segmentos.map((s: string) => `<li>${s}</li>`).join('');

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
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%);
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
            border-left: 4px solid #f7c948;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .segments-list {
            background: #f0f9ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }
          .segments-list ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .segments-list li {
            padding: 5px 0;
            color: #1e40af;
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
            <h1 style="margin: 0; font-size: 28px;">🤖 Nueva Solicitud Piloto SEACE</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Empresa interesada en alertas inteligentes</p>
          </div>

          <div class="content">
            <p>Se ha recibido una nueva solicitud para participar en el programa piloto del Agente IA SEACE.</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #1e3a5f;">📋 Datos de la Solicitud</h3>
              <p style="margin: 10px 0;">
                <strong>Nombre completo:</strong> ${nombre}<br>
                <strong>Empresa:</strong> ${empresa}<br>
                <strong>Cargo:</strong> ${cargo || 'No especificado'}<br>
                <strong>📧 Email:</strong> ${email}<br>
                <strong>📱 WhatsApp:</strong> <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" style="color: #1e3a5f; text-decoration: none;">${whatsapp}</a>
              </p>
            </div>

            <div class="segments-list">
              <h3 style="margin-top: 0; color: #1e40af;">🎯 Segmentos de Interés (${segmentos.length})</h3>
              <ul>
                ${segmentosHTML}
              </ul>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;">
              <strong>⏰ Próximos pasos:</strong><br>
              Contacta a esta empresa en menos de 24 horas para coordinar el onboarding y configuración de segmentos.
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
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%);
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
          .segments-box {
            background: #f0fdf4;
            border: 1px solid #86efac;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }
          .segments-box ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .segments-box li {
            padding: 3px 0;
            color: #166534;
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
            <p style="margin: 10px 0 0 0; font-size: 16px;">Programa Piloto - Agente IA SEACE</p>
          </div>

          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>Gracias por tu interés en participar en el programa piloto del Agente IA SEACE.</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #1e40af;">🎯 ¿Qué sigue?</h3>
              <p style="margin: 10px 0;">
                Nuestro equipo revisará tu solicitud y te contactará en <strong>menos de 24 horas</strong> para:
              </p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Configurar tus alertas personalizadas en WhatsApp</li>
                <li>Explicarte cómo interactuar con el agente IA</li>
                <li>Activar el monitoreo de tus ${segmentos.length} segmentos de interés</li>
              </ul>
            </div>

            <div class="segments-box">
              <h3 style="margin-top: 0; color: #166534;">📊 Segmentos que monitorearemos para ${empresa}</h3>
              <ul>
                ${segmentosHTML}
              </ul>
            </div>

            <p style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
              <strong>✨ Datos de tu solicitud:</strong><br>
              Empresa: ${empresa}<br>
              Cargo: ${cargo || 'No especificado'}<br>
              Email: ${email}<br>
              WhatsApp: ${whatsapp}<br>
              Segmentos: ${segmentos.length} seleccionados
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
      console.log('⚠️  RESEND_API_KEY no está configurada. Solicitud piloto SEACE:');
      console.log(`👤 Nombre: ${nombre}`);
      console.log(`🏢 Empresa: ${empresa}`);
      console.log(`💼 Cargo: ${cargo}`);
      console.log(`📧 Email: ${email}`);
      console.log(`📱 WhatsApp: ${whatsapp}`);
      console.log(`🎯 Segmentos (${segmentos.length}):`, segmentos);

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
      subject: `🤖 Nueva Solicitud Piloto SEACE - ${empresa}`,
      html: emailHTMLToAdmin,
      replyTo: whatsapp
    });

    if (adminResult.error) {
      console.error('Error enviando correo al admin:', adminResult.error);
    }

    const userResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '✅ Solicitud Piloto SEACE Recibida - SmartChatix',
      html: emailHTMLToUser,
    });

    if (userResult.error) {
      console.error('Error enviando correo al usuario:', userResult.error);
    }

    console.log(`✅ Solicitud piloto SEACE recibida de ${empresa}`);
    console.log(`📧 Correos enviados a admin y usuario: ${email}`);
    console.log(`🎯 Segmentos solicitados: ${segmentos.length}`);

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada exitosamente'
    });

  } catch (error: any) {
    console.error('Error enviando solicitud piloto SEACE:', error);
    return NextResponse.json(
      { error: 'Error al enviar solicitud', details: error.message },
      { status: 500 }
    );
  }
}
