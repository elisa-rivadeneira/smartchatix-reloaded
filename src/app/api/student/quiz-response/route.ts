import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { lesson_id, responses, score } = await request.json();

    if (!lesson_id || !responses || score === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    await query(
      `INSERT INTO quiz_responses (user_id, lesson_id, responses, score)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       responses = VALUES(responses),
       score = VALUES(score),
       completed_at = CURRENT_TIMESTAMP`,
      [decoded.id, lesson_id, JSON.stringify(responses), score]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json({ error: 'Error al guardar respuesta' }, { status: 500 });
  }
}
