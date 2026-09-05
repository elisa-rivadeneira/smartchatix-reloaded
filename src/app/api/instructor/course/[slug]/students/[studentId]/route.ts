import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; studentId: string }> }
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

    const { slug, studentId } = await params;
    const { modality } = await request.json();

    if (modality !== 'vivo' && modality !== 'grabado') {
      return NextResponse.json({ error: 'Modalidad inválida' }, { status: 400 });
    }

    const [course]: any = await query(
      `SELECT id, instructor_id FROM courses WHERE slug = ?`,
      [slug]
    );

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (decoded.role === 'instructor' && course.instructor_id !== decoded.id) {
      return NextResponse.json({ error: 'No tienes permiso para editar estudiantes de este curso' }, { status: 403 });
    }

    await query(
      `UPDATE enrollments SET modality = ? WHERE user_id = ? AND course_id = ?`,
      [modality, studentId, course.id]
    );

    return NextResponse.json({ message: 'Modalidad actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating student modality:', error);
    return NextResponse.json({ error: 'Error al actualizar la modalidad' }, { status: 500 });
  }
}
