import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

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

    let courseData;
    if (decoded.role === 'admin') {
      courseData = await query(`
        SELECT id, title FROM courses WHERE slug = ?
      `, [slug]);
    } else {
      courseData = await query(`
        SELECT id, title FROM courses WHERE slug = ? AND instructor_id = ?
      `, [slug, decoded.id]);
    }

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

    return NextResponse.json({
      message: 'Contenido renovado exitosamente',
      courseSlug: slug
    });
  } catch (error) {
    console.error('Error al renovar contenido del curso:', error);
    return NextResponse.json({ error: 'Error al renovar el contenido' }, { status: 500 });
  }
}
