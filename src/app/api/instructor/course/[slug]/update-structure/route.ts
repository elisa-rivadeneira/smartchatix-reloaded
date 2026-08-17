import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(
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
    const body = await request.json();
    console.log('📥 Actualizando estructura del curso:', slug);

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
    const { modules } = body;

    if (modules && Array.isArray(modules)) {
      console.log(`📚 Procesando ${modules.length} módulos...`);

      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        console.log(`  Módulo ${i + 1}:`, module.title);

        if (!module.title) {
          console.error(`❌ Módulo ${i + 1} no tiene título`, module);
          continue;
        }

        const moduleResult: any = await query(
          `INSERT INTO modules (course_id, title, description, order_index)
           VALUES (?, ?, ?, ?)`,
          [courseId, module.title, module.description || '', i + 1]
        );

        const moduleId = moduleResult.insertId;
        console.log(`  ✅ Módulo creado con ID: ${moduleId}`);

        if (module.lessons && Array.isArray(module.lessons)) {
          console.log(`    Procesando ${module.lessons.length} lecciones...`);

          for (let j = 0; j < module.lessons.length; j++) {
            const lesson = module.lessons[j];
            console.log(`      Lección ${j + 1}:`, lesson.title);

            if (!lesson.title) {
              console.error(`❌ Lección ${j + 1} no tiene título`, lesson);
              continue;
            }

            const contentType = 'video';

            await query(
              `INSERT INTO lessons (module_id, title, description, content_type, duration, order_index, is_free)
               VALUES (?, ?, ?, ?, ?, ?, 0)`,
              [
                moduleId,
                lesson.title,
                lesson.description || '',
                contentType,
                lesson.duration || '10 min',
                j + 1
              ]
            );
            console.log(`      ✅ Lección creada con content_type: ${contentType}`);
          }
        }
      }
    }

    console.log('🎉 Estructura del curso actualizada exitosamente');
    return NextResponse.json({
      success: true,
      course: { id: courseId, slug, title: courseData[0].title }
    });
  } catch (error: any) {
    console.error('❌ Error updating course structure:', error);
    return NextResponse.json({
      error: 'Error al actualizar la estructura del curso',
      details: error.message
    }, { status: 500 });
  }
}
