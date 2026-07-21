import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const courseData = await query(`
      SELECT
        id,
        slug,
        category,
        title,
        description,
        thumbnail,
        price_vivo,
        price_grabado,
        duration,
        has_live_mode,
        live_start_date,
        live_schedule,
        recorded_features,
        learning_outcomes,
        module_titles,
        is_active
      FROM courses
      WHERE slug = ? AND is_active = TRUE
    `, [slug]);

    if (!courseData || courseData.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseData[0];

    const modules = await query(`
      SELECT id, title, description, order_index
      FROM modules
      WHERE course_id = ?
      ORDER BY order_index ASC
    `, [course.id]);

    const moduleTitles = typeof course.module_titles === 'string'
      ? JSON.parse(course.module_titles)
      : (course.module_titles || modules.map((m: any) => m.title));
    const recordedFeatures = typeof course.recorded_features === 'string'
      ? JSON.parse(course.recorded_features)
      : (course.recorded_features || {});
    const learningOutcomes = typeof course.learning_outcomes === 'string'
      ? JSON.parse(course.learning_outcomes)
      : (course.learning_outcomes || []);

    const result = {
      slug: course.slug,
      type: 'course',
      category: course.category || 'General',
      title: course.title,
      description: course.description,
      image: course.thumbnail,
      thumbnail: course.thumbnail,
      hours: course.duration || `${recordedFeatures.duration_hours || 0}h`,
      priceVivo: course.price_vivo,
      oldPriceVivo: course.price_vivo,
      priceGrabado: course.price_grabado,
      oldPriceGrabado: course.price_grabado,
      hasLiveMode: Boolean(course.has_live_mode),
      live_start_date: course.live_start_date,
      live_schedule: course.live_schedule,
      keyTopics: learningOutcomes,
      recorded_features: recordedFeatures,
      learning_outcomes: learningOutcomes,
      module_titles: moduleTitles,
      modules: moduleTitles.map((title: string, idx: number) => ({
        num: idx + 1,
        title: title,
        hours: recordedFeatures.duration_hours ? `${(recordedFeatures.duration_hours / moduleTitles.length).toFixed(1)}h` : '2h',
        topics: []
      }))
    };

    return NextResponse.json({ course: result });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Error al obtener curso' }, { status: 500 });
  }
}
