import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';
import { resolveCertificateTemplate } from '@/lib/certificate-template';
import { buildCertificatePdf, generateVerificationCode } from '@/lib/certificate-pdf';

export const runtime = 'nodejs';

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
      'SELECT id, title, duration, recorded_features, certificate_template FROM courses WHERE slug = ?',
      [courseSlug]
    );

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courses[0];
    const recordedFeatures = typeof course.recorded_features === 'string'
      ? JSON.parse(course.recorded_features)
      : (course.recorded_features || {});
    const courseDuration = course.duration || (recordedFeatures.duration_hours ? `${recordedFeatures.duration_hours}h` : null);

    const enrollmentRows: any = await query(
      'SELECT modality FROM enrollments WHERE user_id = ? AND course_id = ? ORDER BY enrolled_at DESC LIMIT 1',
      [user.id, course.id]
    );
    const modalityLabel = enrollmentRows?.[0]?.modality === 'vivo' ? 'En Vivo' : 'Grabado';

    const moduleCountRows: any = await query(
      'SELECT COUNT(*) as count FROM modules WHERE course_id = ?',
      [course.id]
    );
    const moduleCount = Number(moduleCountRows?.[0]?.count ?? 0);

    const siteSettings: any = await query(
      `SELECT setting_value FROM site_settings WHERE setting_key = 'certificate_template_default'`,
      []
    );
    const siteDefaultJson = siteSettings?.[0]?.setting_value ?? null;
    const template = resolveCertificateTemplate(siteDefaultJson, course.certificate_template);

    const verificationCode = generateVerificationCode();
    const issueDate = new Date();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smartchatix.com';
    const verificationUrl = `${baseUrl}/verificar/${verificationCode}`;

    const pdfBytes = await buildCertificatePdf({
      studentName: user.name || user.email,
      courseTitle: course.title,
      courseDuration,
      modalityLabel,
      moduleCount,
      issueDate,
      verificationCode,
      verificationUrl,
      template,
      score: statusData.score ?? null,
    });

    const fileName = `${verificationCode}.pdf`;
    const pdfUrl = await uploadToR2(Buffer.from(pdfBytes), `certificates/${fileName}`, 'application/pdf');

    await query(
      `INSERT INTO certificates
      (student_id, course_id, final_score, issue_date, verification_code, certificate_url, is_valid, issued_by, issue_type)
      VALUES (?, ?, ?, ?, ?, ?, true, NULL, 'quiz')`,
      [
        user.id,
        course.id,
        parseFloat(statusData.score),
        issueDate,
        verificationCode,
        pdfUrl
      ]
    );

    return NextResponse.json({
      success: true,
      certificate: {
        verification_code: verificationCode,
        url: pdfUrl,
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
