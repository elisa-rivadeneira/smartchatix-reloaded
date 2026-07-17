import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      console.error('No token found');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('Invalid token');
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { lessonId } = await params;
    console.log('Getting quiz response for user:', decoded.id, 'lesson:', lessonId);

    const result = await query(
      `SELECT responses, score FROM quiz_responses WHERE user_id = ? AND lesson_id = ?`,
      [decoded.id, lessonId]
    );

    console.log('Query result:', result);

    if (!result || result.length === 0) {
      console.log('No response found, returning false');
      return NextResponse.json({ hasResponse: false });
    }

    console.log('Response found, returning data');

    let responses = result[0].responses;
    if (typeof responses === 'string') {
      responses = JSON.parse(responses);
    }

    return NextResponse.json({
      hasResponse: true,
      responses: responses,
      score: result[0].score
    });
  } catch (error) {
    console.error('Error getting quiz response:', error);
    return NextResponse.json({ error: 'Error al obtener respuesta' }, { status: 500 });
  }
}
