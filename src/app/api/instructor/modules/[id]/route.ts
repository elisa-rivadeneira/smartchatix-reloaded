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
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id: moduleId } = await params;
    const body = await request.json();
    const { title, description } = body;

    const moduleCheck = await query(`
      SELECT m.id FROM modules m
      INNER JOIN courses c ON m.course_id = c.id
      WHERE m.id = ? AND c.instructor_id = ?
    `, [moduleId, decoded.id]);

    if (!moduleCheck || moduleCheck.length === 0) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }

    await query(
      'UPDATE modules SET title = ?, description = ? WHERE id = ?',
      [title, description || '', moduleId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Error al actualizar módulo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: moduleId } = await params;

    const moduleCheck = await query(`
      SELECT m.id FROM modules m
      INNER JOIN courses c ON m.course_id = c.id
      WHERE m.id = ? AND c.instructor_id = ?
    `, [moduleId, decoded.id]);

    if (!moduleCheck || moduleCheck.length === 0) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }

    await query('DELETE FROM modules WHERE id = ?', [moduleId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ error: 'Error al eliminar módulo' }, { status: 500 });
  }
}
