import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const enrollments = await query(
      'SELECT user_id FROM enrollments WHERE course_id = ?',
      [id]
    );

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { student_ids } = body;

    await query('DELETE FROM enrollments WHERE course_id = ?', [id]);

    if (student_ids && student_ids.length > 0) {
      const values = student_ids.map((studentId: number) => [studentId, id, 'grabado', 0, 'completed']);
      const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();

      await query(
        `INSERT INTO enrollments (user_id, course_id, modality, payment_amount, payment_status) VALUES ${placeholders}`,
        flatValues
      );
    }

    return NextResponse.json({ message: 'Inscripciones actualizadas' });
  } catch (error) {
    console.error('Error updating enrollments:', error);
    return NextResponse.json({ error: 'Error al actualizar inscripciones' }, { status: 500 });
  }
}
