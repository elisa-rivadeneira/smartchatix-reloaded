-- Curso "Desarrolla con Claude" — taller en vivo (6 sesiones)
-- INSERT normal sobre la tabla courses existente, sin alterar estructura.
-- Ejecutar también en producción antes de publicar la landing page.
--
-- ⚠️ Precio promocional: S/200 (50% OFF de S/400) hasta el 28 de septiembre 2026 (día de inicio).
-- Desde el 29/09/2026 vuelve a precio completo. No hay automatización para esto — correr manualmente:
--   UPDATE courses SET price_vivo = 400.00, price_vivo_old = NULL WHERE slug = 'desarrolla-con-claude';
INSERT INTO courses (
  slug, category, title, description, thumbnail,
  price_vivo, price_vivo_old, price_vivo_usd,
  price_grabado, price_grabado_usd,
  has_live_mode, has_recorded_mode,
  live_start_date, live_schedule,
  duration, module_titles, module_descriptions,
  instructor_id, is_active, publication_status,
  is_certification_enabled
) VALUES (
  'desarrolla-con-claude',
  'General',
  'Desarrolla con Claude',
  'Taller en vivo de 6 sesiones donde construyes y publicas tu propia app con IA, de punta a punta.',
  NULL,
  200.00, 400.00, 0.00,
  NULL, NULL,
  1, 0,
  '2026-09-28', 'Lunes, miércoles y viernes de 8:00 pm a 10:00 pm',
  '12 horas en 2 semanas',
  JSON_ARRAY(
    'Prompting estructurado',
    'Estructura de un sistema',
    'Interactividad',
    'Git, GitHub y deploy a producción',
    'Depuración básica',
    'Proyecto final supervisado'
  ),
  JSON_ARRAY(
    'Aprende a comunicarte con la IA de forma estructurada para obtener resultados consistentes. Generas la primera versión estática de tu sistema a partir de tu propia idea.',
    'Entiendes cómo está organizado tu sistema — páginas, componentes y secciones — y cómo pedirle a la IA que lo amplíe.',
    'Tu sistema deja de ser estático: agregas formularios, botones y validaciones para que responda a las acciones del usuario.',
    'Publicas tu sistema en internet con control de versiones: repositorio, commits y deploy en vivo a Vercel.',
    'Pierdes el miedo a los errores: protocolo paso a paso para describírselos a la IA y verificar que el fix funcionó.',
    'Consolidas todo lo aprendido con acompañamiento en rondas: construyes y despliegas tu sistema de punta a punta.'
  ),
  NULL, 1, 'published',
  1
);
