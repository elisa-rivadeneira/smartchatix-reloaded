-- Migración: Sistema de Certificados
-- Fecha: 2026-07-12
-- Descripción: Agrega tabla de certificados y campos necesarios en courses

-- 1. Agregar campos a la tabla courses
ALTER TABLE courses
ADD COLUMN is_certification_enabled BOOLEAN DEFAULT false COMMENT 'Habilita la emisión de certificados para este curso',
ADD COLUMN passing_score INT DEFAULT 75 COMMENT 'Porcentaje mínimo para obtener certificado (0-100)',
ADD COLUMN certificate_template TEXT COMMENT 'Plantilla personalizada del certificado (JSON)';

-- 2. Crear tabla de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL COMMENT 'ID del estudiante que obtuvo el certificado',
  course_id INT NOT NULL COMMENT 'ID del curso certificado',
  final_score DECIMAL(5,2) NOT NULL COMMENT 'Calificación final del estudiante (0-100)',
  issue_date DATETIME NOT NULL COMMENT 'Fecha de emisión del certificado',
  verification_code VARCHAR(50) UNIQUE NOT NULL COMMENT 'Código único para verificar autenticidad',
  certificate_url VARCHAR(255) COMMENT 'URL del PDF del certificado',
  is_valid BOOLEAN DEFAULT true COMMENT 'Si el certificado es válido o fue revocado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Restricciones
  UNIQUE KEY unique_student_course (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,

  -- Índices
  INDEX idx_verification_code (verification_code),
  INDEX idx_student (student_id),
  INDEX idx_course (course_id),
  INDEX idx_issue_date (issue_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Certificados emitidos a estudiantes al completar cursos';

-- 3. Crear directorio para certificados (comentario para documentar)
-- Los certificados PDF se guardarán en: /public/certificates/
-- Formato de archivo: {verification_code}.pdf
