import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { resolveCertificateTemplate } from '@/lib/certificate-template';

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
        price_vivo_old,
        price_vivo_usd,
        price_vivo_usd_old,
        price_grabado,
        price_grabado_old,
        price_grabado_usd,
        price_grabado_usd_old,
        duration,
        has_live_mode,
        has_recorded_mode,
        live_start_date,
        live_schedule,
        recorded_features,
        learning_outcomes,
        module_titles,
        module_descriptions,
        publication_status,
        is_certification_enabled,
        certificate_template
      FROM courses
      WHERE slug = ? AND publication_status IN ('published', 'coming_soon')
    `, [slug]);

    if (!courseData || courseData.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseData[0];

    const siteSettings = await query(
      `SELECT setting_value FROM site_settings WHERE setting_key = 'certificate_template_default'`
    );
    const siteDefaultJson = siteSettings?.[0]?.setting_value || null;
    const certificateTemplate = resolveCertificateTemplate(siteDefaultJson, course.certificate_template);

    const modules = await query(`
      SELECT id, title, description, order_index
      FROM modules
      WHERE course_id = ?
      ORDER BY order_index ASC
    `, [course.id]);

    const moduleTitles = typeof course.module_titles === 'string'
      ? JSON.parse(course.module_titles)
      : (course.module_titles || modules.map((m: any) => m.title));
    const moduleDescriptions = typeof course.module_descriptions === 'string'
      ? JSON.parse(course.module_descriptions)
      : (course.module_descriptions || modules.map((m: any) => m.description || ''));
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
      priceVivo: course.publication_status === 'published' ? course.price_vivo : null,
      priceVivoOld: course.publication_status === 'published' ? course.price_vivo_old : null,
      priceVivoUsd: course.publication_status === 'published' ? course.price_vivo_usd : null,
      priceVivoUsdOld: course.publication_status === 'published' ? course.price_vivo_usd_old : null,
      priceGrabado: course.publication_status === 'published' ? course.price_grabado : null,
      priceGrabadoOld: course.publication_status === 'published' ? course.price_grabado_old : null,
      priceGrabadoUsd: course.publication_status === 'published' ? course.price_grabado_usd : null,
      priceGrabadoUsdOld: course.publication_status === 'published' ? course.price_grabado_usd_old : null,
      hasLiveMode: Boolean(course.has_live_mode),
      hasRecordedMode: Boolean(course.has_recorded_mode),
      live_start_date: course.live_start_date,
      live_schedule: course.live_schedule,
      keyTopics: learningOutcomes,
      recorded_features: recordedFeatures,
      learning_outcomes: learningOutcomes,
      module_titles: moduleTitles,
      publication_status: course.publication_status,
      isCertificationEnabled: Boolean(course.is_certification_enabled),
      certificateTemplate,
      modules: moduleTitles.map((title: string, idx: number) => ({
        num: idx + 1,
        title: title,
        description: moduleDescriptions[idx] || '',
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
