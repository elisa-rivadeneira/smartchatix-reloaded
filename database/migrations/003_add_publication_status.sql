-- Agregar campo publication_status a la tabla courses
-- Estados: published, coming_soon, unpublished

ALTER TABLE courses
ADD COLUMN publication_status ENUM('published', 'coming_soon', 'unpublished')
DEFAULT 'unpublished'
AFTER is_active;

-- Actualizar cursos existentes activos a 'published'
UPDATE courses
SET publication_status = 'published'
WHERE is_active = 1;
