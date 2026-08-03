-- =====================================================
-- MIGRACIÓN BASE DE DATOS - SMARTCHATIX
-- Fecha: 2026-08-03
-- Descripción: Scripts de migración para producción
-- =====================================================

-- =====================================================
-- 1. CONFIGURACIÓN DE MODALIDADES DE CURSO
-- =====================================================
-- NOTA: Si alguna columna ya existe, MySQL mostrará un error pero continuará.
-- Puedes ignorar errores tipo "Duplicate column name"

-- Modalidades del curso
ALTER TABLE courses
ADD COLUMN has_live_mode BOOLEAN DEFAULT FALSE COMMENT 'Si el curso está disponible en modalidad en vivo';

ALTER TABLE courses
ADD COLUMN has_recorded_mode BOOLEAN DEFAULT TRUE COMMENT 'Si el curso está disponible en modalidad grabada';

ALTER TABLE courses
ADD COLUMN live_start_date DATE NULL COMMENT 'Fecha de inicio del curso en vivo';

ALTER TABLE courses
ADD COLUMN live_schedule VARCHAR(500) NULL COMMENT 'Horario del curso en vivo';

-- Características del curso grabado
ALTER TABLE courses
ADD COLUMN recorded_features JSON NULL COMMENT 'Características del curso grabado';

-- Learning outcomes y módulos
ALTER TABLE courses
ADD COLUMN learning_outcomes JSON NULL COMMENT 'Lo que dominarás (bullets de aprendizaje)';

ALTER TABLE courses
ADD COLUMN module_titles JSON NULL COMMENT 'Títulos de módulos para Plan de Estudios';

ALTER TABLE courses
ADD COLUMN module_descriptions JSON NULL COMMENT 'Descripciones de módulos para Plan de Estudios';

-- Crear índices (MySQL ignorará si ya existen con IF NOT EXISTS)
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
-- NOTA: Si la columna ya existe, MySQL mostrará un error pero continuará.

-- Agregar columna modality si no existe
ALTER TABLE enrollments
ADD COLUMN modality ENUM('vivo', 'grabado') NOT NULL DEFAULT 'grabado';

-- =====================================================
-- 4. AGREGAR PRECIOS EN USD
-- =====================================================
-- NOTA: Si la columna ya existe, MySQL mostrará un error pero continuará.

-- Precios en USD para modalidad en vivo y grabado
ALTER TABLE courses
ADD COLUMN price_vivo_usd DECIMAL(10, 2) NULL COMMENT 'Precio en USD para modalidad en vivo';

ALTER TABLE courses
ADD COLUMN price_grabado_usd DECIMAL(10, 2) NULL COMMENT 'Precio en USD para modalidad grabada';

-- =====================================================
-- 5. RESUMEN DE CAMBIOS
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
