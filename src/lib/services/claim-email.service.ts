import nodemailer from 'nodemailer';
import type { Claim } from '@/types/claims';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
const COMPANY_NAME = 'SmartChatix';

export class ClaimEmailService {
  async sendConsumerConfirmation(claim: Claim): Promise<void> {
    const html = this.generateConsumerEmailHTML(claim);

    await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
      to: claim.email,
      subject: `Confirmación de ${claim.type.toLowerCase()} - ${claim.claimCode}`,
      html,
    });
  }

  async sendAdminNotification(claim: Claim): Promise<void> {
    const html = this.generateAdminEmailHTML(claim);

    await transporter.sendMail({
      from: `"Sistema de Reclamos" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `Nuevo ${claim.type.toLowerCase()} registrado - ${claim.claimCode}`,
      html,
    });
  }

  private generateConsumerEmailHTML(claim: Claim): string {
    const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .claim-code {
            background: #667eea;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
          }
          .info-box {
            background: white;
            padding: 15px;
            border-left: 4px solid #667eea;
            margin: 15px 0;
            border-radius: 4px;
          }
          .info-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✓ ${claim.type} Registrado</h1>
          <p>Hemos recibido su ${claim.type.toLowerCase()} correctamente</p>
        </div>

        <div class="content">
          <p>Estimado(a) <strong>${claim.firstName} ${claim.lastName}</strong>,</p>

          <p>Le confirmamos que hemos registrado su ${claim.type.toLowerCase()} en nuestro Libro de Reclamaciones Virtual conforme a la normativa vigente.</p>

          <div class="claim-code">
            ${claim.claimCode}
          </div>

          <p><strong>Fecha de registro:</strong> ${formattedDate}</p>

          <div class="info-box">
            <div class="info-label">TIPO DE ${claim.type}</div>
            <p><strong>${claim.type}</strong> - ${claim.type === 'RECLAMO' ? 'Disconformidad relacionada con el producto o servicio' : 'Disconformidad relacionada con la atención recibida'}</p>
          </div>

          <div class="info-box">
            <div class="info-label">BIEN CONTRATADO</div>
            <p><strong>${claim.productType}:</strong> ${claim.productName}</p>
            ${claim.amount ? `<p><strong>Monto:</strong> S/ ${claim.amount.toFixed(2)}</p>` : ''}
          </div>

          <div class="info-box">
            <div class="info-label">DETALLE DE SU ${claim.type}</div>
            <p>${claim.description}</p>
          </div>

          <div class="info-box">
            <div class="info-label">PEDIDO</div>
            <p>${claim.consumerRequest}</p>
          </div>

          <p><strong>¿Qué sigue ahora?</strong></p>
          <ul>
            <li>Su ${claim.type.toLowerCase()} será evaluado por nuestro equipo</li>
            <li>Recibirá una respuesta en un plazo máximo de 30 días calendario</li>
            <li>Puede guardar este correo como constancia de registro</li>
          </ul>

          <p>Si tiene alguna consulta adicional, puede contactarnos indicando su código de ${claim.type.toLowerCase()}: <strong>${claim.claimCode}</strong></p>

          <div class="footer">
            <p><strong>${COMPANY_NAME}</strong></p>
            <p>Este es un mensaje automático. Por favor no responda a este correo.</p>
            <p>Conforme al Código de Protección y Defensa del Consumidor - Ley N° 29571</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminEmailHTML(claim: Claim): string {
    const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #dc2626;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          table {
            width: 100%;
            background: white;
            border-collapse: collapse;
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
          }
          .alert {
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🔔 Nuevo ${claim.type} Registrado</h2>
          <p>Código: <strong>${claim.claimCode}</strong></p>
        </div>

        <div class="content">
          <div class="alert">
            <strong>⚠ Acción requerida:</strong> Se ha registrado un nuevo ${claim.type.toLowerCase()} que requiere atención.
          </div>

          <p><strong>Fecha de registro:</strong> ${formattedDate}</p>

          <h3>DATOS DEL CONSUMIDOR</h3>
          <table>
            <tr>
              <th>Nombres</th>
              <td>${claim.firstName} ${claim.lastName}</td>
            </tr>
            <tr>
              <th>${claim.documentType}</th>
              <td>${claim.documentNumber}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td><a href="mailto:${claim.email}">${claim.email}</a></td>
            </tr>
            <tr>
              <th>Teléfono</th>
              <td>${claim.phone}</td>
            </tr>
            <tr>
              <th>Dirección</th>
              <td>${claim.address}</td>
            </tr>
            ${claim.isMinor ? `
            <tr>
              <th>Representante Legal</th>
              <td>${claim.guardianName}</td>
            </tr>
            ` : ''}
          </table>

          <h3>DETALLE DEL ${claim.type}</h3>
          <table>
            <tr>
              <th>Tipo</th>
              <td><strong>${claim.type}</strong></td>
            </tr>
            <tr>
              <th>Bien contratado</th>
              <td>${claim.productType}: ${claim.productName}</td>
            </tr>
            ${claim.amount ? `
            <tr>
              <th>Monto reclamado</th>
              <td>S/ ${claim.amount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <th>Descripción</th>
              <td>${claim.description}</td>
            </tr>
            <tr>
              <th>Pedido del consumidor</th>
              <td>${claim.consumerRequest}</td>
            </tr>
          </table>

          <h3>INFORMACIÓN TÉCNICA</h3>
          <table>
            <tr>
              <th>IP</th>
              <td>${claim.ipAddress}</td>
            </tr>
            <tr>
              <th>User Agent</th>
              <td>${claim.userAgent}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>${claim.status}</td>
            </tr>
          </table>

          <p style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/reclamaciones/${claim.id}"
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver en el Panel Administrativo
            </a>
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

export const claimEmailService = new ClaimEmailService();
