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

    const body = await request.json();
    console.log('📥 Datos recibidos en POST /api/instructor/courses:', JSON.stringify(body, null, 2));

    const { title, description, price_vivo, price_grabado, modules } = body;

    if (!title || !description) {
      console.error('❌ Datos incompletos:', { title, description });
      return NextResponse.json({ error: 'Datos incompletos: título y descripción son requeridos' }, { status: 400 });
    }

    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const existingSlugs: any[] = await query(
      `SELECT slug FROM courses WHERE slug LIKE ?`,
      [`${slug}%`]
    );

    if (existingSlugs.length > 0) {
      const slugExists = existingSlugs.some((s: any) => s.slug === slug);
      if (slugExists) {
        const timestamp = Date.now();
        slug = `${slug}-${timestamp}`;
        console.log('⚠️ Slug duplicado detectado, usando:', slug);
      }
    }

    console.log('📝 Creando curso:', { title, slug, description: description.substring(0, 50) + '...' });

    const result: any = await query(
      `INSERT INTO courses (title, slug, description, price_vivo, price_grabado, instructor_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [title, slug, description, price_vivo || 0, price_grabado || 0, decoded.id]
    );

    const courseId = result.insertId;
    console.log('✅ Curso creado con ID:', courseId);

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

    console.log('🎉 Curso creado exitosamente');
    return NextResponse.json({
      success: true,
      course: { id: courseId, slug, title }
    });
  } catch (error: any) {
    console.error('❌ Error creating course:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({
      error: 'Error al crear curso',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
