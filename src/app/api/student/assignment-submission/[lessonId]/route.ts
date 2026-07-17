import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const submissions = await query(
      `SELECT * FROM assignment_submissions
       WHERE user_id = ? AND lesson_id = ?`,
      [user.id, lessonId]
    );

    if (submissions && submissions.length > 0) {
      return NextResponse.json({ submission: submissions[0] });
    }

    return NextResponse.json({ submission: null });
  } catch (error) {
    console.error('Error fetching assignment submission:', error);
    return NextResponse.json(
      { error: 'Error al obtener la entrega' },
      { status: 500 }
    );
  }
}
