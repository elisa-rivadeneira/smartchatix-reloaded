-- Registro de inscripciones a masterclasses (ej. "Desarrolla con Claude")
CREATE TABLE IF NOT EXISTS masterclass_registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  masterclass_name VARCHAR(150) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  whatsapp_auto_enviado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_masterclass_name (masterclass_name)
);
