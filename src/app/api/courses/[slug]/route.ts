import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
}

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content_type: 'video' | 'document' | 'quiz' | 'assignment' | 'markdown' | 'tarea';
  video_url: string | null;
  video_file: string | null;
  main_content: string | null;
  document_url: string | null;
  markdown_content: string | null;
  markdown_image: string | null;
  markdown_video: string | null;
  duration: string;
  order_index: number;
  is_free: boolean;
  has_quiz: boolean;
  quiz_questions_count: number;
  quiz_data: any;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies['auth_token'];
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const course = await query(`
      SELECT c.*, e.modality, e.enrolled_at
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.user_id = ? AND e.payment_status = 'completed'
      WHERE c.slug = ?
    `, [payload.id, slug]);

    if (!course || course.length === 0) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    const courseData = course[0];

    // Permitir acceso a instructores y admins sin matrícula
    const isInstructorOrAdmin = payload.role === 'instructor' || payload.role === 'admin';

    if (!courseData.enrolled_at && !isInstructorOrAdmin) {
      return NextResponse.json(
        { error: 'No estás matriculado en este curso' },
        { status: 403 }
      );
    }

    const modules = await query<Module>(`
      SELECT id, title, description, order_index
      FROM modules
      WHERE course_id = ?
      ORDER BY order_index ASC
    `, [courseData.id]);

    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await query<Lesson>(`
          SELECT
            l.id, l.module_id, l.title, l.description, l.content_type,
            l.video_url, l.video_file, l.main_content, l.document_url,
            l.markdown_content, l.markdown_image, l.markdown_video,
            l.duration, l.order_index, l.is_free, l.has_quiz,
            l.quiz_questions_count, l.quiz_data,
            CASE WHEN qr.id IS NOT NULL THEN TRUE ELSE FALSE END as quiz_completed,
            qr.score as quiz_score
          FROM lessons l
          LEFT JOIN quiz_responses qr ON l.id = qr.lesson_id AND qr.user_id = ?
          WHERE l.module_id = ?
          ORDER BY l.order_index ASC
        `, [payload.id, module.id]);

        return {
          ...module,
          lessons
        };
      })
    );

    return NextResponse.json({
      course: {
        id: courseData.id,
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
        duration: courseData.duration,
        modality: courseData.modality,
        enrolled_at: courseData.enrolled_at
      },
      modules: modulesWithLessons
    });
  } catch (error) {
    console.error('Error getting course data:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del curso' },
      { status: 500 }
    );
  }
}
