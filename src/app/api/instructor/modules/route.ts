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
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { course_id, title, description } = body;

    const courseCheck = await query(
      'SELECT id FROM courses WHERE id = ? AND instructor_id = ?',
      [course_id, decoded.id]
    );

    if (!courseCheck || courseCheck.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const maxOrder = await query(
      'SELECT COALESCE(MAX(order_index), -1) as max_order FROM modules WHERE course_id = ?',
      [course_id]
    );

    const order_index = (maxOrder[0]?.max_order || -1) + 1;

    const result = await query(
      'INSERT INTO modules (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
      [course_id, title, description || '', order_index]
    );

    return NextResponse.json({
      success: true,
      module: {
        id: (result as any).insertId,
        course_id,
        title,
        description,
        order_index
      }
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Error al crear módulo' }, { status: 500 });
  }
}
