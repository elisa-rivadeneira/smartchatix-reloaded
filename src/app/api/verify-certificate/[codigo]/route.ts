import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    const certificates: any = await query(
      `SELECT
        c.verification_code,
        c.final_score,
        c.issue_date,
        c.is_valid,
        u.name as student_name,
        u.email as student_email,
        co.title as course_title
      FROM certificates c
      INNER JOIN users u ON c.student_id = u.id
      INNER JOIN courses co ON c.course_id = co.id
      WHERE c.verification_code = ?`,
      [codigo]
    );

    if (!certificates || certificates.length === 0) {
      return NextResponse.json({
        error: 'Certificado no encontrado'
      }, { status: 404 });
    }

    const cert = certificates[0];

    return NextResponse.json({
      success: true,
      certificate: {
        student_name: cert.student_name || cert.student_email,
        course_title: cert.course_title,
        final_score: cert.final_score,
        issue_date: cert.issue_date,
        is_valid: cert.is_valid,
        verification_code: cert.verification_code
      }
    });

  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Error al verificar certificado' },
      { status: 500 }
    );
  }
}
