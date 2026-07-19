-- Agregar campos para configuración de modalidades del curso

-- Modalidad en vivo
ALTER TABLE courses
ADD COLUMN has_live_mode BOOLEAN DEFAULT FALSE COMMENT 'Si el curso está disponible en modalidad en vivo',
ADD COLUMN live_start_date DATE NULL COMMENT 'Fecha de inicio del curso en vivo',
ADD COLUMN live_schedule VARCHAR(500) NULL COMMENT 'Horario del curso en vivo (ej: "Lunes y Miércoles 7pm - 9pm")';

-- Características del curso grabado (JSON con los bullets)
ALTER TABLE courses
ADD COLUMN recorded_features JSON NULL COMMENT 'Características del curso grabado (bullets): {duration, modules, recordings, certificate, support}';

-- Índices para búsquedas
ALTER TABLE courses
ADD INDEX idx_has_live_mode (has_live_mode),
ADD INDEX idx_live_start_date (live_start_date);
