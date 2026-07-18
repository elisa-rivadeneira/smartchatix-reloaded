-- ============================================================
-- Script para migrar video_file a video_url con URLs de R2
-- Compatible con phpMyAdmin
-- Base de datos: mariadbsmart (producción Easypanel)
-- Generado: 2026-07-18
-- ============================================================

-- CONTEXTO:
-- - video_url: antes solo para YouTube, ahora para CUALQUIER video externo (YouTube o R2)
-- - video_file: antes para videos en servidor local /uploads/, ahora migrar a R2
--
-- OBJETIVO:
-- 1. Actualizar video_file: /uploads/video.mp4 → https://r2.dev/uploads/video.mp4
-- 2. Copiar video_file actualizado → video_url (para que el sistema lo use)
-- 3. Limpiar video_file (opcional, dejarlo NULL)

-- ============================================================
-- PASO 1: VERIFICAR lecciones con video_file
-- ============================================================

SELECT 'LECCIONES CON VIDEO_FILE (antes de migrar):' as Verificacion;
SELECT id, title, content_type, video_url, video_file
FROM lessons
WHERE video_file IS NOT NULL
  AND video_file != ''
  AND video_file LIKE '/uploads/%';

-- ============================================================
-- PASO 2: ACTUALIZAR video_file a URLs de R2
-- ============================================================

-- Actualizar rutas locales a URLs de R2
UPDATE lessons
SET video_file = REPLACE(video_file, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE video_file IS NOT NULL
  AND video_file != ''
  AND video_file LIKE '/uploads/%';

-- ============================================================
-- PASO 3: COPIAR video_file → video_url
-- ============================================================

-- Copiar URLs de R2 de video_file a video_url
-- Solo si video_url está vacío O si quieres sobreescribir
UPDATE lessons
SET video_url = video_file
WHERE video_file IS NOT NULL
  AND video_file != ''
  AND video_file LIKE 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/%';

-- ============================================================
-- PASO 4: LIMPIAR video_file (OPCIONAL)
-- ============================================================

-- Una vez migrado todo, puedes dejar video_file vacío
-- Descomenta estas líneas solo si quieres limpiar:

-- UPDATE lessons
-- SET video_file = NULL
-- WHERE video_file LIKE 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/%';

-- ============================================================
-- PASO 5: VERIFICAR resultado final
-- ============================================================

SELECT 'VERIFICACIÓN POST-MIGRACIÓN:' as Resultado;

-- Ver lecciones con videos en R2 (en video_url)
SELECT id, title, content_type, video_url, video_file
FROM lessons
WHERE video_url LIKE 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/%';

-- Contar total
SELECT 'Total lecciones con videos en R2:' as Tabla, COUNT(*) as Total
FROM lessons
WHERE video_url LIKE '%r2.dev/uploads/%';

-- ============================================================
-- ACTUALIZAR OTROS CAMPOS (del script anterior)
-- ============================================================

-- Thumbnails de cursos
UPDATE courses
SET thumbnail = REPLACE(thumbnail, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE thumbnail LIKE '/uploads/%';

-- Documentos de lecciones
UPDATE lessons
SET document_url = REPLACE(document_url, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE document_url LIKE '/uploads/%';

-- Imágenes markdown de lecciones
UPDATE lessons
SET markdown_image = REPLACE(markdown_image, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE markdown_image LIKE '/uploads/%';

-- Archivos de assignments
UPDATE assignment_submissions
SET file_url = REPLACE(file_url, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE file_url LIKE '/uploads/%';

-- ============================================================
-- VERIFICACIÓN FINAL COMPLETA
-- ============================================================

SELECT 'RESUMEN FINAL DE MIGRACIÓN:' as Resultado;

SELECT 'Courses - Thumbnails en R2:' as Tipo, COUNT(*) as Total
FROM courses WHERE thumbnail LIKE '%r2.dev%'
UNION ALL
SELECT 'Lessons - Videos en R2:', COUNT(*)
FROM lessons WHERE video_url LIKE '%r2.dev%'
UNION ALL
SELECT 'Lessons - Documentos en R2:', COUNT(*)
FROM lessons WHERE document_url LIKE '%r2.dev%'
UNION ALL
SELECT 'Lessons - Imágenes Markdown en R2:', COUNT(*)
FROM lessons WHERE markdown_image LIKE '%r2.dev%'
UNION ALL
SELECT 'Assignments - Archivos en R2:', COUNT(*)
FROM assignment_submissions WHERE file_url LIKE '%r2.dev%';

-- ============================================================
-- ROLLBACK (solo si necesitas revertir)
-- ============================================================

-- ⚠️ NO EJECUTAR a menos que necesites deshacer

-- Revertir video_url a video_file
-- UPDATE lessons
-- SET video_file = video_url, video_url = NULL
-- WHERE video_url LIKE '%r2.dev/uploads/%';

-- Revertir video_file a /uploads/
-- UPDATE lessons
-- SET video_file = REPLACE(video_file, 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/', '/uploads/')
-- WHERE video_file LIKE '%r2.dev/uploads/%';
