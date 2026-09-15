import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { lessonIds } = await req.json();

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json(
        { error: 'lessonIds debe ser un array no vacío' },
        { status: 400 }
      );
    }

    for (let i = 0; i < lessonIds.length; i++) {
      await query(
        'UPDATE lessons SET order_index = ? WHERE id = ?',
        [i, lessonIds[i]]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering lessons:', error);
    return NextResponse.json(
      { error: 'Error al reordenar lecciones' },
      { status: 500 }
    );
  }
}
