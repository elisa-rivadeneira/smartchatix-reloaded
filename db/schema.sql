-- Fluideka LMS Database Schema
-- Ejecutar: mysql -u root -p fluideka_lms < db/schema.sql

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  price_vivo DECIMAL(10, 2),
  price_grabado DECIMAL(10, 2),
  duration VARCHAR(50),
  has_live_mode BOOLEAN DEFAULT FALSE COMMENT 'Si el curso está disponible en modalidad en vivo',
  live_start_date DATE NULL COMMENT 'Fecha de inicio del curso en vivo',
  live_schedule VARCHAR(500) NULL COMMENT 'Horario del curso en vivo',
  recorded_features JSON NULL COMMENT 'Características del curso grabado',
  learning_outcomes JSON NULL COMMENT 'Lo que dominarás (bullets de aprendizaje)',
  module_titles JSON NULL COMMENT 'Títulos de módulos para Plan de Estudios',
  instructor_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_instructor (instructor_id),
  INDEX idx_has_live_mode (has_live_mode),
  INDEX idx_live_start_date (live_start_date),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de módulos (secciones del curso)
CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_course (course_id),
  INDEX idx_order (order_index),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de lecciones
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type ENUM('video', 'document', 'quiz', 'assignment', 'markdown') DEFAULT 'video',
  video_url VARCHAR(500), -- YouTube video ID
  main_content TEXT, -- Contenido principal de la lección (HTML)
  document_url VARCHAR(500), -- Path al PDF/archivo
  markdown_content TEXT, -- Contenido Markdown
  markdown_image VARCHAR(500), -- Imagen de portada para Markdown
  markdown_video VARCHAR(500), -- Video de YouTube para Markdown
  duration VARCHAR(50), -- ej: "15:30"
  order_index INT NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  has_quiz BOOLEAN DEFAULT FALSE,
  quiz_questions_count INT DEFAULT 0,
  quiz_data JSON, -- Preguntas generadas por IA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_module (module_id),
  INDEX idx_order (order_index),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de inscripciones (enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  modality ENUM('vivo', 'grabado') NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  UNIQUE KEY unique_enrollment (user_id, course_id),
  INDEX idx_user (user_id),
  INDEX idx_course (course_id),
  INDEX idx_payment_status (payment_status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de respuestas a quiz
CREATE TABLE IF NOT EXISTS quiz_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  responses JSON NOT NULL,
  score INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_response (user_id, lesson_id),
  INDEX idx_user (user_id),
  INDEX idx_lesson (lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de progreso del estudiante
CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  last_position INT DEFAULT 0, -- Para videos: segundos
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (user_id, lesson_id),
  INDEX idx_user (user_id),
  INDEX idx_lesson (lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tokens de activación
CREATE TABLE IF NOT EXISTS activation_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  course_id INT NOT NULL,
  modality ENUM('vivo', 'grabado') NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  INDEX idx_email (email),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto (password: admin123)
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES ('admin@fluideka.com', '$2b$10$rQJ5qKzV8KxH9YjP6xZxc.N5nYX5vKQZWxY5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'Administrador Fluideka', 'admin', TRUE)
ON DUPLICATE KEY UPDATE email=email;
