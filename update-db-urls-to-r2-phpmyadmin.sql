-- ============================================================
-- Script para actualizar URLs de /uploads/ a Cloudflare R2
-- Compatible con phpMyAdmin
-- Base de datos: mariadbsmart (producción Easypanel)
-- Generado: 2026-07-18
-- ============================================================

-- IMPORTANTE: Hacer backup antes de ejecutar
-- En phpMyAdmin: Seleccionar tabla → Exportar → SQL

-- ============================================================
-- PASO 1: VERIFICAR URLs que serán actualizadas (EJECUTAR PRIMERO)
-- ============================================================

-- Cursos con thumbnails en /uploads/
SELECT 'COURSES - Thumbnails a actualizar:' as Verificacion;
SELECT id, slug, title, thumbnail
FROM courses
WHERE thumbnail LIKE '/uploads/%';

-- Videos en /uploads/
SELECT 'LESSONS - Videos a actualizar:' as Verificacion;
SELECT id, title, video_url
FROM lessons
WHERE video_url LIKE '/uploads/%';

-- Documentos en /uploads/
SELECT 'LESSONS - Documentos a actualizar:' as Verificacion;
SELECT id, title, document_url
FROM lessons
WHERE document_url LIKE '/uploads/%';

-- Imágenes markdown en /uploads/
SELECT 'LESSONS - Imágenes markdown a actualizar:' as Verificacion;
SELECT id, title, markdown_image
FROM lessons
WHERE markdown_image LIKE '/uploads/%';

-- Archivos de assignments en /uploads/
SELECT 'ASSIGNMENT_SUBMISSIONS - Archivos a actualizar:' as Verificacion;
SELECT id, user_id, lesson_id, file_url
FROM assignment_submissions
WHERE file_url LIKE '/uploads/%';

-- ============================================================
-- PASO 2: ACTUALIZAR URLs (EJECUTAR DESPUÉS DE VERIFICAR)
-- ============================================================

-- ⚠️ IMPORTANTE: Selecciona y ejecuta SOLO estas queries después de verificar

-- Actualizar thumbnails de cursos
UPDATE courses
SET thumbnail = REPLACE(thumbnail, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE thumbnail LIKE '/uploads/%';

-- Actualizar videos de lecciones
UPDATE lessons
SET video_url = REPLACE(video_url, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE video_url LIKE '/uploads/%';

-- Actualizar documentos de lecciones
UPDATE lessons
SET document_url = REPLACE(document_url, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE document_url LIKE '/uploads/%';

-- Actualizar imágenes markdown de lecciones
UPDATE lessons
SET markdown_image = REPLACE(markdown_image, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE markdown_image LIKE '/uploads/%';

-- Actualizar archivos de assignments
UPDATE assignment_submissions
SET file_url = REPLACE(file_url, '/uploads/', 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/')
WHERE file_url LIKE '/uploads/%';

-- ============================================================
-- PASO 3: VERIFICAR resultados (EJECUTAR AL FINAL)
-- ============================================================

SELECT 'VERIFICACIÓN POST-ACTUALIZACIÓN' as Resultado;

-- Contar cursos con URLs de R2
SELECT 'Courses con R2 URLs:' as Tabla, COUNT(*) as Total
FROM courses
WHERE thumbnail LIKE '%r2.dev%';

-- Contar lecciones con videos en R2
SELECT 'Lessons con R2 URLs (videos):' as Tabla, COUNT(*) as Total
FROM lessons
WHERE video_url LIKE '%r2.dev%';

-- Contar lecciones con documentos en R2
SELECT 'Lessons con R2 URLs (docs):' as Tabla, COUNT(*) as Total
FROM lessons
WHERE document_url LIKE '%r2.dev%';

-- Contar assignments en R2
SELECT 'Assignments con R2 URLs:' as Tabla, COUNT(*) as Total
FROM assignment_submissions
WHERE file_url LIKE '%r2.dev%';

-- ============================================================
-- ROLLBACK (solo si necesitas revertir)
-- ============================================================

-- ⚠️ NO EJECUTAR a menos que necesites deshacer los cambios

-- UPDATE courses
-- SET thumbnail = REPLACE(thumbnail, 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/', '/uploads/')
-- WHERE thumbnail LIKE '%r2.dev/uploads/%';

-- UPDATE lessons
-- SET video_url = REPLACE(video_url, 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/', '/uploads/')
-- WHERE video_url LIKE '%r2.dev/uploads/%';

-- UPDATE lessons
-- SET document_url = REPLACE(document_url, 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/', '/uploads/')
-- WHERE document_url LIKE '%r2.dev/uploads/%';

-- UPDATE lessons
-- SET markdown_image = REPLACE(markdown_image, 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/', '/uploads/')
-- WHERE markdown_image LIKE '%r2.dev/uploads/%';

-- UPDATE assignment_submissions
-- SET file_url = REPLACE(file_url, 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/uploads/', '/uploads/')
-- WHERE file_url LIKE '%r2.dev/uploads/%';
