import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id: courseId } = await params;
    const body = await request.json();
    const { instructor_id } = body;

    await query(
      'UPDATE courses SET instructor_id = ? WHERE id = ?',
      [instructor_id, courseId]
    );

    return NextResponse.json({
      success: true,
      message: 'Curso actualizado correctamente'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Error al actualizar curso' }, { status: 500 });
  }
}
