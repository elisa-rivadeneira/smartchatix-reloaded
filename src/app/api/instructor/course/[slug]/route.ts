import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;

    const courseData = await query(`
      SELECT * FROM courses WHERE slug = ? AND instructor_id = ?
    `, [slug, decoded.id]);

    if (!courseData || courseData.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseData[0];

    if (typeof course.module_titles === 'string') {
      course.module_titles = JSON.parse(course.module_titles);
    }
    if (typeof course.learning_outcomes === 'string') {
      course.learning_outcomes = JSON.parse(course.learning_outcomes);
    }
    if (typeof course.recorded_features === 'string') {
      course.recorded_features = JSON.parse(course.recorded_features);
    }

    const modules = await query(`
      SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC
    `, [course.id]);

    for (const module of modules) {
      const lessons = await query(`
        SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC
      `, [module.id]);
      module.lessons = lessons;
    }

    course.modules = modules;

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Error al obtener curso' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;

    const courseData = await query(`
      SELECT id, title FROM courses WHERE slug = ? AND instructor_id = ?
    `, [slug, decoded.id]);

    if (!courseData || courseData.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const courseId = courseData[0].id;

    const modules = await query(`
      SELECT id FROM modules WHERE course_id = ?
    `, [courseId]);

    const moduleIds = modules.map((m: any) => m.id);

    if (moduleIds.length > 0) {
      const placeholders = moduleIds.map(() => '?').join(',');
      await query(`DELETE FROM lessons WHERE module_id IN (${placeholders})`, moduleIds);
    }

    await query(`DELETE FROM modules WHERE course_id = ?`, [courseId]);
    await query(`DELETE FROM enrollments WHERE course_id = ?`, [courseId]);
    await query(`DELETE FROM certificates WHERE course_id = ?`, [courseId]);
    await query(`DELETE FROM activation_tokens WHERE course_id = ?`, [courseId]);
    await query(`DELETE FROM courses WHERE id = ?`, [courseId]);

    return NextResponse.json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    return NextResponse.json({ error: 'Error al eliminar el curso' }, { status: 500 });
  }
}
