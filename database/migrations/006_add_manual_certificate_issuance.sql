-- Migración: Emisión manual de certificados por el instructor
-- Fecha: 2026-08-31
-- Descripción: Permite que un instructor emita un certificado a voluntad,
-- sin pasar por el quiz. final_score pasa a ser opcional (NULL = emitido
-- manualmente, sin nota) y se registra quién lo emitió y por qué vía.

ALTER TABLE certificates
  MODIFY COLUMN final_score DECIMAL(5,2) NULL COMMENT 'Calificación final del estudiante (0-20), NULL si se emitió manualmente sin quiz',
  ADD COLUMN issued_by INT NULL COMMENT 'Instructor/admin que emitió manualmente el certificado (NULL = emitido automáticamente por quiz)' AFTER is_valid,
  ADD COLUMN issue_type ENUM('quiz', 'manual') NOT NULL DEFAULT 'quiz' COMMENT 'Cómo se emitió el certificado' AFTER issued_by,
  ADD CONSTRAINT fk_certificates_issued_by FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL;
