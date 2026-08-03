-- =====================================================
-- MIGRACIÓN BASE DE DATOS - SMARTCHATIX
-- Fecha: 2026-08-03
-- Descripción: Scripts de migración para producción
-- =====================================================

-- =====================================================
-- 1. CONFIGURACIÓN DE MODALIDADES DE CURSO (si no existe)
-- =====================================================

-- Verificar si la columna has_live_mode existe
SELECT COUNT(*) INTO @columnExists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'courses'
  AND COLUMN_NAME = 'has_live_mode';

-- Solo agregar si no existe
SET @sql = IF(@columnExists = 0,
  'ALTER TABLE courses
   ADD COLUMN has_live_mode BOOLEAN DEFAULT FALSE COMMENT "Si el curso está disponible en modalidad en vivo",
   ADD COLUMN live_start_date DATE NULL COMMENT "Fecha de inicio del curso en vivo",
   ADD COLUMN live_schedule VARCHAR(500) NULL COMMENT "Horario del curso en vivo"',
  'SELECT "Las columnas de modalidad en vivo ya existen" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si la columna recorded_features existe
SELECT COUNT(*) INTO @columnExists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'courses'
  AND COLUMN_NAME = 'recorded_features';

-- Solo agregar si no existe
SET @sql = IF(@columnExists = 0,
  'ALTER TABLE courses
   ADD COLUMN recorded_features JSON NULL COMMENT "Características del curso grabado"',
  'SELECT "La columna recorded_features ya existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si la columna learning_outcomes existe
SELECT COUNT(*) INTO @columnExists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'courses'
  AND COLUMN_NAME = 'learning_outcomes';

-- Solo agregar si no existe
SET @sql = IF(@columnExists = 0,
  'ALTER TABLE courses
   ADD COLUMN learning_outcomes JSON NULL COMMENT "Lo que dominarás (bullets de aprendizaje)",
   ADD COLUMN module_titles JSON NULL COMMENT "Títulos de módulos para Plan de Estudios"',
  'SELECT "Las columnas de learning_outcomes ya existen" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_has_live_mode ON courses(has_live_mode);
CREATE INDEX IF NOT EXISTS idx_live_start_date ON courses(live_start_date);

-- =====================================================
-- 2. TABLA DE CONFIGURACIÓN DEL SITIO (si no existe)
-- =====================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES ('show_courses_carousel', 'true', 'Mostrar carrusel "Explora más cursos" en página principal')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- =====================================================
-- 3. VERIFICAR ESTRUCTURA DE ENROLLMENTS
-- =====================================================

-- Verificar que la tabla enrollments tenga la columna modality
SELECT COUNT(*) INTO @columnExists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'enrollments'
  AND COLUMN_NAME = 'modality';

-- Solo agregar si no existe
SET @sql = IF(@columnExists = 0,
  'ALTER TABLE enrollments
   ADD COLUMN modality ENUM("vivo", "grabado") NOT NULL DEFAULT "grabado"',
  'SELECT "La columna modality ya existe en enrollments" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 4. RESUMEN DE CAMBIOS
-- =====================================================
SELECT 'MIGRACIÓN COMPLETADA - VERIFICAR RESULTADOS' AS STATUS;

-- Mostrar estructura de courses
SELECT
  'courses' AS tabla,
  COUNT(*) AS total_registros
FROM courses;

-- Mostrar estructura de enrollments
SELECT
  'enrollments' AS tabla,
  COUNT(*) AS total_registros
FROM enrollments;

-- Mostrar configuraciones del sitio
SELECT
  setting_key,
  setting_value,
  description
FROM site_settings;
