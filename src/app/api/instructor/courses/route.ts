import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const courses = await query(`
      SELECT
        c.*,
        (SELECT COUNT(*) FROM modules WHERE course_id = c.id) as modules_count,
        (SELECT COUNT(*) FROM lessons l INNER JOIN modules m ON l.module_id = m.id WHERE m.course_id = c.id) as lessons_count,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id AND payment_status = 'completed') as students_count
      FROM courses c
      WHERE c.instructor_id = ?
      ORDER BY c.created_at DESC
    `, [decoded.id]);

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}

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

    const { title, description, price_vivo, price_grabado, modules } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const result: any = await query(
      `INSERT INTO courses (title, slug, description, price_vivo, price_grabado, instructor_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [title, slug, description, price_vivo || 0, price_grabado || 0, decoded.id]
    );

    const courseId = result.insertId;

    if (modules && Array.isArray(modules)) {
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const moduleResult: any = await query(
          `INSERT INTO modules (course_id, title, description, order_index)
           VALUES (?, ?, ?, ?)`,
          [courseId, module.title, module.description || '', i + 1]
        );

        const moduleId = moduleResult.insertId;

        if (module.lessons && Array.isArray(module.lessons)) {
          for (let j = 0; j < module.lessons.length; j++) {
            const lesson = module.lessons[j];
            await query(
              `INSERT INTO lessons (module_id, title, description, content_type, duration, order_index, is_free)
               VALUES (?, ?, ?, ?, ?, ?, 0)`,
              [
                moduleId,
                lesson.title,
                lesson.description || '',
                lesson.content_type || 'video',
                lesson.duration || '10 min',
                j + 1
              ]
            );
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      course: { id: courseId, slug, title }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Error al crear curso' }, { status: 500 });
  }
}
