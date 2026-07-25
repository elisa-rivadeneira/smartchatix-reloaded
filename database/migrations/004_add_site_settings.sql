-- Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración para mostrar el carrusel de cursos
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES ('show_courses_carousel', 'true', 'Mostrar carrusel "Explora más cursos" en página principal')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
