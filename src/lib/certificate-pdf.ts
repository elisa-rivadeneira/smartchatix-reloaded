import { PDFDocument, PDFImage, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { CertificateTemplate } from '@/lib/certificate-template';
import { hexToRgb01 } from '@/lib/certificate-template';

export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code.match(/.{1,4}/g)?.join('-') || code;
}

async function embedImage(pdfDoc: PDFDocument, imageUrl: string): Promise<PDFImage | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') || '';
    const isPng = contentType.includes('png') || (buffer[0] === 0x89 && buffer[1] === 0x50);
    const isJpg = contentType.includes('jpeg') || contentType.includes('jpg') || (buffer[0] === 0xff && buffer[1] === 0xd8);

    if (isPng) return await pdfDoc.embedPng(buffer);
    if (isJpg) return await pdfDoc.embedJpg(buffer);
    return null;
  } catch (error) {
    console.error('No se pudo incrustar el logo del certificado, se omite:', error);
    return null;
  }
}

export interface CertificatePdfParams {
  studentName: string;
  courseTitle: string;
  courseDuration: string | null;
  modalityLabel: string;
  moduleCount: number;
  issueDate: Date;
  verificationCode: string;
  verificationUrl: string;
  template: CertificateTemplate;
  /** Nota final sobre 20, o null si el certificado se emitió sin nota (manual). */
  score: number | null;
}

export async function buildCertificatePdf(params: CertificatePdfParams): Promise<Uint8Array> {
  const {
    studentName,
    courseTitle,
    courseDuration,
    modalityLabel,
    moduleCount,
    issueDate,
    verificationCode,
    verificationUrl,
    template,
    score,
  } = params;

  const qrCodeBuffer = await QRCode.toBuffer(verificationUrl);

  const pdfDoc = await PDFDocument.create();

  const primaryColor = hexToRgb01(template.primaryColor);
  const accentColor = hexToRgb01(template.accentColor);

  const backgroundImage = template.backgroundImageUrl ? await embedImage(pdfDoc, template.backgroundImageUrl) : null;

  // El fondo "diseño completo" se diseñó en 1536x1024px (proporción 3:2).
  // Usamos una página con esa misma proporción para que no se distorsione.
  const page = backgroundImage ? pdfDoc.addPage([900, 600]) : pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  if (backgroundImage) {
    page.drawImage(backgroundImage, { x: 0, y: 0, width, height });

    // El fondo ya incluye logos, título, firma del instructor y textos
    // fijos de verificación. Solo colocamos los datos variables encima,
    // usando las coordenadas del diseño en píxeles (base 1536x1024).
    const navy = rgb(2 / 255, 18 / 255, 72 / 255);
    const orange = rgb(182 / 255, 113 / 255, 12 / 255);
    const gray = rgb(0.42, 0.45, 0.5);

    const scale = width / 1536;
    const toX = (px: number) => px * scale;
    const toY = (pxFromTop: number) => height - pxFromTop * scale;

    const fitSize = (text: string, f: typeof fontBold, maxSize: number, minSize: number, maxWidth: number) => {
      let size = maxSize;
      while (size > minSize && f.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5;
      return size;
    };

    const drawCenteredAt = (
      text: string,
      xCenterPt: number,
      pxFromTop: number,
      size: number,
      f: typeof fontBold,
      color: ReturnType<typeof rgb>,
      maxWidth?: number
    ) => {
      const textWidth = Math.min(f.widthOfTextAtSize(text, size), maxWidth ?? Infinity);
      page.drawText(text, {
        x: xCenterPt - textWidth / 2,
        y: toY(pxFromTop),
        size,
        font: f,
        color,
        maxWidth,
      });
    };

    const introLabel = template.introText.replace(/:\s*$/, '').toUpperCase();
    drawCenteredAt(introLabel, width / 2, 405, 12, fontBold, orange);

    const nameSize = fitSize(studentName, fontBold, 28, 15, 720);
    drawCenteredAt(studentName, width / 2, 462, nameSize, fontBold, navy);

    drawCenteredAt(template.completionText, width / 2, 512, 11, font, gray, 720);

    const courseSize = fitSize(courseTitle, fontBold, 17, 11, 760);
    drawCenteredAt(courseTitle, width / 2, 555, courseSize, fontBold, navy, 760);

    const statLabelLeftPx = [290, 605, 885, 1150];
    const statValues = [
      courseDuration || '—',
      modalityLabel,
      `${moduleCount} módulo${moduleCount === 1 ? '' : 's'}`,
      issueDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    ];
    statValues.forEach((value, i) => {
      const size = fitSize(value, fontBold, 11, 8, 200);
      page.drawText(value, {
        x: toX(statLabelLeftPx[i]),
        y: toY(682),
        size,
        font: fontBold,
        color: orange,
        maxWidth: 200,
      });
    });

    const codeSize = fitSize(verificationCode, fontBold, 15, 10, 180);
    drawCenteredAt(verificationCode, toX(727.5), 868, codeSize, fontBold, navy);

    const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
    const qrBoxSize = 78;
    page.drawImage(qrImage, {
      x: toX((983 + 1130) / 2) - qrBoxSize / 2,
      y: toY((760 + 913) / 2) - qrBoxSize / 2,
      width: qrBoxSize,
      height: qrBoxSize,
    });
  } else {
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      borderWidth: 3,
    });

    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });

    const logoImage = template.logoUrl ? await embedImage(pdfDoc, template.logoUrl) : null;
    const topOffset = logoImage ? 60 : 0;

    if (logoImage) {
      const logoMaxSize = 50;
      const logoScale = Math.min(logoMaxSize / logoImage.width, logoMaxSize / logoImage.height);
      const logoWidth = logoImage.width * logoScale;
      const logoHeight = logoImage.height * logoScale;
      page.drawImage(logoImage, {
        x: width / 2 - logoWidth / 2,
        y: height - 65,
        width: logoWidth,
        height: logoHeight,
      });
    }

    page.drawText(template.titleText, {
      x: width / 2 - 180,
      y: height - 100 - topOffset,
      size: 48,
      font: fontBold,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
    });

    page.drawText(template.subtitleText, {
      x: width / 2 - 95,
      y: height - 140 - topOffset,
      size: 18,
      font: font,
      color: rgb(accentColor.r, accentColor.g, accentColor.b),
    });

    page.drawText(template.introText, {
      x: width / 2 - 60,
      y: height - 200 - topOffset,
      size: 14,
      font: font,
      color: rgb(accentColor.r, accentColor.g, accentColor.b),
    });

    const nameWidth = fontBold.widthOfTextAtSize(studentName, 32);
    page.drawText(studentName, {
      x: (width - nameWidth) / 2,
      y: height - 250 - topOffset,
      size: 32,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    page.drawText(template.completionText, {
      x: width / 2 - 165,
      y: height - 300 - topOffset,
      size: 14,
      font: font,
      color: rgb(accentColor.r, accentColor.g, accentColor.b),
    });

    const courseTitleWidth = fontBold.widthOfTextAtSize(courseTitle, 22);
    const maxWidth = width - 200;
    const courseX = courseTitleWidth > maxWidth ? 100 : (width - courseTitleWidth) / 2;

    page.drawText(courseTitle, {
      x: courseX,
      y: height - 350 - topOffset,
      size: 22,
      font: fontBold,
      color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
      maxWidth: maxWidth,
    });

    if (template.showScore && score !== null) {
      const scoreText = `Calificación final: ${score}/20`;
      const scoreWidth = font.widthOfTextAtSize(scoreText, 16);
      page.drawText(scoreText, {
        x: (width - scoreWidth) / 2,
        y: height - 410 - topOffset,
        size: 16,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    const dateText = `Fecha de emisión: ${issueDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })}`;
    const dateWidth = font.widthOfTextAtSize(dateText, 12);
    page.drawText(dateText, {
      x: (width - dateWidth) / 2,
      y: height - 450 - topOffset,
      size: 12,
      font: font,
      color: rgb(accentColor.r, accentColor.g, accentColor.b),
    });

    const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
    const qrSize = 80;
    page.drawImage(qrImage, {
      x: width - qrSize - 60,
      y: 60,
      width: qrSize,
      height: qrSize,
    });

    page.drawText('Escanea para verificar', {
      x: width - qrSize - 70,
      y: 45,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    page.drawText(`Código de verificación: ${verificationCode}`, {
      x: 60,
      y: 50,
      size: 10,
      font: font,
      color: rgb(accentColor.r, accentColor.g, accentColor.b),
    });

    page.drawText(`${template.footerText} ${verificationUrl}`, {
      x: 60,
      y: 35,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
      maxWidth: width - 200,
    });
  }

  return pdfDoc.save();
}
