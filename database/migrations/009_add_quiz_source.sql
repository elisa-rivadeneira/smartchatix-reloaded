-- Agregar campo quiz_source a la tabla lessons
-- Indica de dónde se genera el quiz: texto de la lección, transcripción del video, o PDFs adjuntos

ALTER TABLE lessons
ADD COLUMN quiz_source ENUM('lesson', 'video', 'material') DEFAULT NULL
AFTER has_quiz;
