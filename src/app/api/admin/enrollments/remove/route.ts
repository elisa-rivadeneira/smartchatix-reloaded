import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { user_id, course_id } = body;

    await query(
      'DELETE FROM enrollments WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );

    return NextResponse.json({
      success: true,
      message: 'Inscripción eliminada correctamente'
    });
  } catch (error: any) {
    console.error('Error removing enrollment:', error);
    return NextResponse.json(
      { error: 'Error al eliminar inscripción', details: error.message },
      { status: 500 }
    );
  }
}
