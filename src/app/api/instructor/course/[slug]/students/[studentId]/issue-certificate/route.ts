import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';
import { resolveCertificateTemplate } from '@/lib/certificate-template';
import { buildCertificatePdf, generateVerificationCode } from '@/lib/certificate-pdf';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; studentId: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { slug, studentId } = await params;
    const studentIdNum = parseInt(studentId, 10);

    const courses: any = await query(
      'SELECT id, title, duration, recorded_features, certificate_template, instructor_id, is_certification_enabled FROM courses WHERE slug = ?',
      [slug]
    );

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courses[0];
    const recordedFeatures = typeof course.recorded_features === 'string'
      ? JSON.parse(course.recorded_features)
      : (course.recorded_features || {});
    const courseDuration = course.duration || (recordedFeatures.duration_hours ? `${recordedFeatures.duration_hours}h` : null);

    if (decoded.role === 'instructor' && course.instructor_id !== decoded.id) {
      return NextResponse.json({ error: 'No tienes permiso sobre este curso' }, { status: 403 });
    }

    if (!course.is_certification_enabled) {
      return NextResponse.json({ error: 'Primero habilita la certificación para este curso, en la pestaña Certificado' }, { status: 400 });
    }

    const enrollmentRows: any = await query(
      'SELECT modality FROM enrollments WHERE user_id = ? AND course_id = ? AND payment_status = ? ORDER BY enrolled_at DESC LIMIT 1',
      [studentIdNum, course.id, 'completed']
    );

    if (!enrollmentRows || enrollmentRows.length === 0) {
      return NextResponse.json({ error: 'El estudiante no está inscrito en este curso' }, { status: 400 });
    }

    const modalityLabel = enrollmentRows[0].modality === 'vivo' ? 'En Vivo' : 'Grabado';

    const studentRows: any = await query('SELECT id, name, email FROM users WHERE id = ?', [studentIdNum]);
    if (!studentRows || studentRows.length === 0) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }
    const student = studentRows[0];

    const existingCert: any = await query(
      'SELECT verification_code, certificate_url, final_score FROM certificates WHERE student_id = ? AND course_id = ?',
      [studentIdNum, course.id]
    );

    if (existingCert && existingCert.length > 0) {
      return NextResponse.json({
        success: true,
        already_exists: true,
        certificate: {
          verification_code: existingCert[0].verification_code,
          url: existingCert[0].certificate_url,
          score: existingCert[0].final_score,
        },
      });
    }

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
      studentName: student.name || student.email,
      courseTitle: course.title,
      courseDuration,
      modalityLabel,
      moduleCount,
      issueDate,
      verificationCode,
      verificationUrl,
      template,
      score: null,
    });

    const fileName = `${verificationCode}.pdf`;
    const pdfUrl = await uploadToR2(Buffer.from(pdfBytes), `certificates/${fileName}`, 'application/pdf');

    await query(
      `INSERT INTO certificates
      (student_id, course_id, final_score, issue_date, verification_code, certificate_url, is_valid, issued_by, issue_type)
      VALUES (?, ?, NULL, ?, ?, ?, true, ?, 'manual')`,
      [
        studentIdNum,
        course.id,
        issueDate,
        verificationCode,
        pdfUrl,
        decoded.id,
      ]
    );

    return NextResponse.json({
      success: true,
      certificate: {
        verification_code: verificationCode,
        url: pdfUrl,
        score: null,
      },
    });
  } catch (error) {
    console.error('Error issuing manual certificate:', error);
    return NextResponse.json({ error: 'Error al emitir el certificado' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; studentId: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { slug, studentId } = await params;
    const studentIdNum = parseInt(studentId, 10);

    const courses: any = await query(
      'SELECT id, instructor_id FROM courses WHERE slug = ?',
      [slug]
    );

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courses[0];

    if (decoded.role === 'instructor' && course.instructor_id !== decoded.id) {
      return NextResponse.json({ error: 'No tienes permiso sobre este curso' }, { status: 403 });
    }

    await query(
      'DELETE FROM certificates WHERE student_id = ? AND course_id = ?',
      [studentIdNum, course.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Error al eliminar el certificado' }, { status: 500 });
  }
}
