-- Agregar campo para "Lo que dominarás" (learning outcomes)

ALTER TABLE courses
ADD COLUMN learning_outcomes JSON NULL COMMENT 'Lo que dominarás (bullets de aprendizaje)';
