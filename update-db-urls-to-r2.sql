-- Script para actualizar URLs de /uploads/ a Cloudflare R2
-- Base de datos: fluideka_lms / mariadbsmart (producción)
-- Generado: 2026-07-18
-- IMPORTANTE: Hacer backup antes de ejecutar

-- ============================================================
-- 1. VERIFICAR URLs que serán actualizadas
-- ============================================================

SELECT 'COURSES - Thumbnails a actualizar:' as info;
SELECT id, slug, title, thumbnail
FROM courses
WHERE thumbnail LIKE '/uploads/%';

SELECT 'LESSONS - Videos a actualizar:' as info;
SELECT id, title, video_url
FROM lessons
WHERE video_url LIKE '/uploads/%';

SELECT 'LESSONS - Documentos a actualizar:' as info;
SELECT id, title, document_url
FROM lessons
WHERE document_url LIKE '/uploads/%';

SELECT 'LESSONS - Imágenes markdown a actualizar:' as info;
SELECT id, title, markdown_image
FROM lessons
WHERE markdown_image LIKE '/uploads/%';

SELECT 'ASSIGNMENT_SUBMISSIONS - Archivos a actualizar:' as info;
SELECT id, user_id, lesson_id, file_url
FROM assignment_submissions
WHERE file_url LIKE '/uploads/%';

-- ============================================================
-- 2. ACTUALIZAR URLs (DESCOMENTAR PARA EJECUTAR)
-- ============================================================

-- IMPORTANTE: Verificar primero los SELECT de arriba
-- Hacer backup: mysqldump -u root -p fluideka_lms > backup_pre_r2_migration.sql

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
-- 3. VERIFICAR resultados después de actualizar
-- ============================================================

SELECT 'VERIFICACIÓN POST-ACTUALIZACIÓN' as info;

SELECT 'Courses con R2 URLs:' as info;
SELECT COUNT(*) as total
FROM courses
WHERE thumbnail LIKE '%r2.dev%';

SELECT 'Lessons con R2 URLs (videos):' as info;
SELECT COUNT(*) as total
FROM lessons
WHERE video_url LIKE '%r2.dev%';

SELECT 'Lessons con R2 URLs (docs):' as info;
SELECT COUNT(*) as total
FROM lessons
WHERE document_url LIKE '%r2.dev%';

SELECT 'Assignments con R2 URLs:' as info;
SELECT COUNT(*) as total
FROM assignment_submissions
WHERE file_url LIKE '%r2.dev%';

-- ============================================================
-- 4. ROLLBACK (en caso de error)
-- ============================================================

-- Si necesitas revertir los cambios:
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
