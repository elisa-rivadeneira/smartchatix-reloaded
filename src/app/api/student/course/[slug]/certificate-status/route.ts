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

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { slug } = await params;

    const courses: any = await query(
      `SELECT
        id,
        title,
        is_certification_enabled,
        passing_score
      FROM courses
      WHERE slug = ?`,
      [slug]
    );

    if (!courses || courses.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courses[0];

    if (!course.is_certification_enabled) {
      return NextResponse.json({
        eligible: false,
        reason: 'Este curso no tiene certificación habilitada',
        score: 0,
        passing_score: course.passing_score || 75
      });
    }

    const lessonsWithQuiz: any = await query(
      `SELECT
        l.id,
        l.title,
        l.has_quiz
      FROM lessons l
      INNER JOIN modules m ON l.module_id = m.id
      WHERE m.course_id = ? AND l.has_quiz = true
      ORDER BY m.order_index, l.order_index`,
      [course.id]
    );

    if (!lessonsWithQuiz || lessonsWithQuiz.length === 0) {
      return NextResponse.json({
        eligible: false,
        reason: 'Este curso no tiene lecciones con quiz',
        score: 0,
        passing_score: course.passing_score || 75,
        total_quizzes: 0,
        completed_quizzes: 0
      });
    }

    const lessonIds = lessonsWithQuiz.map((l: any) => l.id);
    const placeholders = lessonIds.map(() => '?').join(',');

    const responses: any = await query(
      `SELECT
        lesson_id,
        score
      FROM quiz_responses
      WHERE user_id = ? AND lesson_id IN (${placeholders})
      ORDER BY lesson_id, score DESC`,
      [user.id, ...lessonIds]
    );

    const completedLessons = new Set<number>();
    let totalScore = 0;
    let totalPossibleScore = 0;

    const lessonScores: any = {};

    for (const lesson of lessonsWithQuiz) {
      const lessonResponses = responses.filter((r: any) => r.lesson_id === lesson.id);

      if (lessonResponses.length > 0) {
        const bestResponse = lessonResponses[0];
        completedLessons.add(lesson.id);

        const quizData = await query(
          'SELECT quiz_questions_count FROM lessons WHERE id = ?',
          [lesson.id]
        );

        const totalQuestions = quizData[0]?.quiz_questions_count || 0;
        totalScore += bestResponse.score;
        totalPossibleScore += totalQuestions;

        lessonScores[lesson.id] = {
          title: lesson.title,
          score: bestResponse.score,
          total: totalQuestions,
          percentage: totalQuestions > 0 ? (bestResponse.score / totalQuestions * 100).toFixed(2) : 0
        };
      }
    }

    const allQuizzesCompleted = completedLessons.size === lessonsWithQuiz.length;
    const notaSobre20 = totalPossibleScore > 0
      ? (totalScore / totalPossibleScore * 20)
      : 0;

    const passingScoreOn20 = ((course.passing_score || 75) / 100) * 20;
    const passesRequirement = notaSobre20 >= passingScoreOn20;

    const existingCertificate: any = await query(
      'SELECT verification_code, certificate_url, final_score FROM certificates WHERE student_id = ? AND course_id = ?',
      [user.id, course.id]
    );

    if (existingCertificate && existingCertificate.length > 0) {
      return NextResponse.json({
        eligible: true,
        already_issued: true,
        certificate: {
          verification_code: existingCertificate[0].verification_code,
          url: existingCertificate[0].certificate_url,
          score: existingCertificate[0].final_score
        },
        score: notaSobre20.toFixed(1),
        passing_score: passingScoreOn20.toFixed(1),
        total_quizzes: lessonsWithQuiz.length,
        completed_quizzes: completedLessons.size,
        lesson_scores: lessonScores
      });
    }

    if (!allQuizzesCompleted) {
      const missingLessons = lessonsWithQuiz
        .filter((l: any) => !completedLessons.has(l.id))
        .map((l: any) => l.title);

      return NextResponse.json({
        eligible: false,
        reason: 'Aún no has completado todos los quizzes',
        score: notaSobre20.toFixed(1),
        passing_score: passingScoreOn20.toFixed(1),
        total_quizzes: lessonsWithQuiz.length,
        completed_quizzes: completedLessons.size,
        missing_lessons: missingLessons,
        lesson_scores: lessonScores
      });
    }

    if (!passesRequirement) {
      return NextResponse.json({
        eligible: false,
        reason: `Tu promedio es ${notaSobre20.toFixed(1)}/20, necesitas al menos ${passingScoreOn20.toFixed(1)}/20`,
        score: notaSobre20.toFixed(1),
        passing_score: passingScoreOn20.toFixed(1),
        total_quizzes: lessonsWithQuiz.length,
        completed_quizzes: completedLessons.size,
        lesson_scores: lessonScores
      });
    }

    return NextResponse.json({
      eligible: true,
      already_issued: false,
      score: notaSobre20.toFixed(1),
      passing_score: passingScoreOn20.toFixed(1),
      total_quizzes: lessonsWithQuiz.length,
      completed_quizzes: completedLessons.size,
      lesson_scores: lessonScores
    });

  } catch (error) {
    console.error('Error checking certificate status:', error);
    return NextResponse.json(
      { error: 'Error al verificar elegibilidad de certificado' },
      { status: 500 }
    );
  }
}
