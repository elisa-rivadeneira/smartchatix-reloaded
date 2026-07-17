import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code.match(/.{1,4}/g)?.join('-') || code;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { courseSlug } = await request.json();

    const statusResponse = await fetch(`${request.nextUrl.origin}/api/student/course/${courseSlug}/certificate-status`, {
      headers: {
        Cookie: `auth_token=${token}`
      }
    });

    const statusData = await statusResponse.json();

    if (!statusData.eligible) {
      return NextResponse.json({
        error: statusData.reason || 'No eres elegible para el certificado'
      }, { status: 400 });
    }

    if (statusData.already_issued) {
      return NextResponse.json({
        success: true,
        already_exists: true,
        certificate: statusData.certificate
      });
    }

    const courses: any = await query(
      'SELECT id, title FROM courses WHERE slug = ?',
      [courseSlug]
    );

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courses[0];
    const verificationCode = generateVerificationCode();
    const issueDate = new Date();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const verificationUrl = `${baseUrl}/verificar/${verificationCode}`;
    const qrCodeBuffer = await QRCode.toBuffer(verificationUrl);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);

    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.4, 0.49, 0.92),
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

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('CERTIFICADO', {
      x: width / 2 - 180,
      y: height - 100,
      size: 48,
      font: fontBold,
      color: rgb(0.4, 0.49, 0.92),
    });

    page.drawText('DE FINALIZACIÓN', {
      x: width / 2 - 95,
      y: height - 140,
      size: 18,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText('Se otorga a:', {
      x: width / 2 - 60,
      y: height - 200,
      size: 14,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    const studentName = user.name || user.email;
    const nameWidth = fontBold.widthOfTextAtSize(studentName, 32);
    page.drawText(studentName, {
      x: (width - nameWidth) / 2,
      y: height - 250,
      size: 32,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    page.drawText('Por completar exitosamente el curso:', {
      x: width / 2 - 165,
      y: height - 300,
      size: 14,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    const courseTitleWidth = fontBold.widthOfTextAtSize(course.title, 22);
    const maxWidth = width - 200;
    const courseX = courseTitleWidth > maxWidth ? 100 : (width - courseTitleWidth) / 2;

    page.drawText(course.title, {
      x: courseX,
      y: height - 350,
      size: 22,
      font: fontBold,
      color: rgb(0.4, 0.49, 0.92),
      maxWidth: maxWidth,
    });

    const scoreText = `Calificación final: ${statusData.score}/20`;
    const scoreWidth = font.widthOfTextAtSize(scoreText, 16);
    page.drawText(scoreText, {
      x: (width - scoreWidth) / 2,
      y: height - 410,
      size: 16,
      font: font,
      color: rgb(0, 0, 0),
    });

    const dateText = `Fecha de emisión: ${issueDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })}`;
    const dateWidth = font.widthOfTextAtSize(dateText, 12);
    page.drawText(dateText, {
      x: (width - dateWidth) / 2,
      y: height - 450,
      size: 12,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
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
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(`Verifica la autenticidad en: ${baseUrl}/verificar/${verificationCode}`, {
      x: 60,
      y: 35,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
      maxWidth: width - 200,
    });

    const pdfBytes = await pdfDoc.save();

    const certificatesDir = path.join(process.cwd(), 'public', 'certificates');
    try {
      await mkdir(certificatesDir, { recursive: true });
    } catch (e) {
    }

    const fileName = `${verificationCode}.pdf`;
    const filePath = path.join(certificatesDir, fileName);

    await writeFile(filePath, pdfBytes);

    await query(
      `INSERT INTO certificates
      (student_id, course_id, final_score, issue_date, verification_code, certificate_url, is_valid)
      VALUES (?, ?, ?, ?, ?, ?, true)`,
      [
        user.id,
        course.id,
        parseFloat(statusData.score),
        issueDate,
        verificationCode,
        `/certificates/${fileName}`
      ]
    );

    return NextResponse.json({
      success: true,
      certificate: {
        verification_code: verificationCode,
        url: `/certificates/${verificationCode}.pdf`,
        score: statusData.score
      }
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Error al generar certificado' },
      { status: 500 }
    );
  }
}
