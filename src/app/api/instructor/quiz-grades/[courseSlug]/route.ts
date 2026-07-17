import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
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

    const courseData = await query(
      `SELECT id, title, instructor_id, quiz_weight, assignment_weight FROM courses WHERE slug = ?`,
      [courseSlug]
    );

    if (!courseData || courseData.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseData[0];

    if (user.role === 'instructor' && course.instructor_id !== user.id) {
      return NextResponse.json({ error: 'No tienes acceso a este curso' }, { status: 403 });
    }

    const quizGrades = await query(
      `SELECT
        qr.id,
        qr.user_id,
        qr.lesson_id,
        qr.responses,
        qr.score,
        qr.completed_at,
        u.name as student_name,
        u.email as student_email,
        l.title as lesson_title,
        l.quiz_questions_count as total_questions,
        m.title as module_title
       FROM quiz_responses qr
       JOIN users u ON qr.user_id = u.id
       JOIN lessons l ON qr.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ? AND l.quiz_questions_count > 0 AND l.content_type != 'assignment'
       ORDER BY qr.completed_at DESC`,
      [course.id]
    );

    const studentStats = await query(
      `SELECT
        u.id as student_id,
        u.name as student_name,
        u.email as student_email,
        (SELECT COUNT(DISTINCT qr2.lesson_id)
         FROM quiz_responses qr2
         JOIN lessons l2 ON qr2.lesson_id = l2.id
         JOIN modules m2 ON l2.module_id = m2.id
         WHERE qr2.user_id = u.id AND m2.course_id = ?
         AND l2.quiz_questions_count > 0 AND l2.content_type != 'assignment'
        ) as quizzes_completed,
        (SELECT COALESCE(SUM(qr3.score), 0)
         FROM quiz_responses qr3
         JOIN lessons l3 ON qr3.lesson_id = l3.id
         JOIN modules m3 ON l3.module_id = m3.id
         WHERE qr3.user_id = u.id AND m3.course_id = ?
         AND l3.quiz_questions_count > 0 AND l3.content_type != 'assignment'
        ) as quiz_score,
        (SELECT COALESCE(SUM(l8.quiz_questions_count), 0)
         FROM lessons l8
         JOIN modules m8 ON l8.module_id = m8.id
         WHERE m8.course_id = ?
         AND l8.quiz_questions_count > 0 AND l8.content_type != 'assignment'
        ) as quiz_max_points,
        (SELECT COALESCE(SUM(qr3.score), 0)
         FROM quiz_responses qr3
         JOIN lessons l3 ON qr3.lesson_id = l3.id
         JOIN modules m3 ON l3.module_id = m3.id
         WHERE qr3.user_id = u.id AND m3.course_id = ?
         AND l3.quiz_questions_count > 0 AND l3.content_type != 'assignment'
        ) +
        (SELECT COALESCE(SUM(asub2.grade), 0)
         FROM assignment_submissions asub2
         JOIN lessons l4 ON asub2.lesson_id = l4.id
         JOIN modules m4 ON l4.module_id = m4.id
         WHERE asub2.user_id = u.id AND m4.course_id = ?
        ) as total_score,
        (SELECT COUNT(*)
         FROM lessons l5
         JOIN modules m5 ON l5.module_id = m5.id
         WHERE m5.course_id = ?
         AND (l5.quiz_questions_count > 0 OR l5.content_type = 'assignment')
        ) as total_lessons,
        (SELECT COALESCE(SUM(l6.quiz_questions_count), 0)
         FROM lessons l6
         JOIN modules m6 ON l6.module_id = m6.id
         WHERE m6.course_id = ?
         AND (l6.quiz_questions_count > 0 OR l6.content_type = 'assignment')
        ) as max_possible_points,
        (SELECT ROUND(AVG(qr4.score / l7.quiz_questions_count * 100), 1)
         FROM quiz_responses qr4
         JOIN lessons l7 ON qr4.lesson_id = l7.id
         JOIN modules m7 ON l7.module_id = m7.id
         WHERE qr4.user_id = u.id AND m7.course_id = ?
         AND l7.quiz_questions_count > 0
        ) as average_percentage,
        (SELECT COALESCE(SUM(asub3.grade), 0)
         FROM assignment_submissions asub3
         JOIN lessons l9 ON asub3.lesson_id = l9.id
         JOIN modules m9 ON l9.module_id = m9.id
         WHERE asub3.user_id = u.id AND m9.course_id = ?
        ) as assignment_score,
        (SELECT COALESCE(SUM(l10.quiz_questions_count), 0)
         FROM lessons l10
         JOIN modules m10 ON l10.module_id = m10.id
         WHERE m10.course_id = ?
         AND l10.content_type = 'assignment'
        ) as assignment_max_points
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       WHERE e.course_id = ? AND u.role = 'student'
       GROUP BY u.id, u.name, u.email
       ORDER BY average_percentage DESC`,
      [course.id, course.id, course.id, course.id, course.id, course.id, course.id, course.id, course.id, course.id, course.id, course.id]
    );

    const assignmentSubmissions = await query(
      `SELECT
        asub.id,
        asub.user_id,
        asub.lesson_id,
        asub.file_url,
        asub.file_name,
        asub.submitted_at,
        asub.grade,
        asub.feedback,
        asub.graded_at,
        u.name as student_name,
        u.email as student_email,
        l.title as lesson_title,
        l.quiz_questions_count as total_points,
        m.title as module_title
       FROM assignment_submissions asub
       JOIN users u ON asub.user_id = u.id
       JOIN lessons l ON asub.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ?
       ORDER BY asub.submitted_at DESC`,
      [course.id]
    );

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        quiz_weight: course.quiz_weight || 50,
        assignment_weight: course.assignment_weight || 50
      },
      quizGrades,
      studentStats,
      assignmentSubmissions
    });
  } catch (error) {
    console.error('Error fetching quiz grades:', error);
    return NextResponse.json(
      { error: 'Error al obtener calificaciones' },
      { status: 500 }
    );
  }
}
