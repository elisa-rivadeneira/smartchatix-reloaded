import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  try {
    const { courseSlug } = await params;
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { quiz_weight, assignment_weight } = await request.json();

    if (quiz_weight + assignment_weight !== 100) {
      return NextResponse.json({ error: 'Los pesos deben sumar 100%' }, { status: 400 });
    }

    const courseData = await query(
      `SELECT id, instructor_id FROM courses WHERE slug = ?`,
      [courseSlug]
    );

    if (!courseData || courseData.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseData[0];

    if (user.role === 'instructor' && course.instructor_id !== user.id) {
      return NextResponse.json({ error: 'No tienes acceso a este curso' }, { status: 403 });
    }

    await query(
      `UPDATE courses SET quiz_weight = ?, assignment_weight = ? WHERE id = ?`,
      [quiz_weight, assignment_weight, course.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating course weights:', error);
    return NextResponse.json(
      { error: 'Error al actualizar pesos' },
      { status: 500 }
    );
  }
}
