import { Resend } from 'resend';
import type { Claim } from '@/types/claims';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'SmartChatix <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;

export class ClaimEmailService {
  async sendConsumerConfirmation(claim: Claim): Promise<void> {
    const html = this.generateConsumerEmailHTML(claim);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: claim.email,
      subject: `Confirmación de ${claim.type.toLowerCase()} - ${claim.claimCode}`,
      html,
    });
  }

  async sendAdminNotification(claim: Claim): Promise<void> {
    if (!ADMIN_EMAIL) return;

    const html = this.generateAdminEmailHTML(claim);

    await resend.emails.send({
      from: FROM_EMAIL,
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
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .claim-code { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✓ ${claim.type} Registrado</h1>
        </div>
        <div class="content">
          <p>Estimado(a) <strong>${claim.firstName} ${claim.lastName}</strong>,</p>
          <p>Le confirmamos que hemos registrado su ${claim.type.toLowerCase()} en nuestro Libro de Reclamaciones Virtual.</p>
          <div class="claim-code">${claim.claimCode}</div>
          <p><strong>Fecha de registro:</strong> ${formattedDate}</p>
          <div class="info-box">
            <strong>Bien contratado:</strong> ${claim.productType} - ${claim.productName}
            ${claim.amount !== null && claim.amount !== undefined ? `<br><strong>Monto:</strong> S/ ${Number(claim.amount).toFixed(2)}` : ''}
          </div>
          <p>Recibirá una respuesta en un plazo máximo de <strong>30 días calendario</strong>.</p>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">© ${new Date().getFullYear()} SmartChatix</p>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminEmailHTML(claim: Claim): string {
    const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE');

    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">🔔 Nuevo ${claim.type} - ${claim.claimCode}</h2>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Consumidor:</strong></td><td>${claim.firstName} ${claim.lastName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td>${claim.email}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td>${claim.phone}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Producto/Servicio:</strong></td><td>${claim.productName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Descripción:</strong></td><td>${claim.description}</td></tr>
        </table>
        <p><a href="${process.env.NEXTAUTH_URL}/admin/reclamaciones" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Ver en Admin Panel</a></p>
      </body>
      </html>
    `;
  }
}

export const claimEmailService = new ClaimEmailService();
