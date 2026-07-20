-- Agregar campos para "Lo que dominarás" y títulos de módulos

ALTER TABLE courses
ADD COLUMN learning_outcomes JSON NULL COMMENT 'Lo que dominarás (bullets de aprendizaje)',
ADD COLUMN module_titles JSON NULL COMMENT 'Títulos de módulos para Plan de Estudios';
