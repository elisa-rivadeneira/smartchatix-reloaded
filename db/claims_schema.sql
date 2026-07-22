-- =====================================================
-- LIBRO DE RECLAMACIONES VIRTUAL
-- SmartChatix - Conforme a normativa INDECOPI
-- =====================================================

CREATE TABLE IF NOT EXISTS claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  claimCode VARCHAR(20) NOT NULL UNIQUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('PENDIENTE', 'EN_PROCESO', 'ATENDIDO', 'ARCHIVADO') NOT NULL DEFAULT 'PENDIENTE',
  type ENUM('RECLAMO', 'QUEJA') NOT NULL,
  productType ENUM('PRODUCTO', 'SERVICIO') NOT NULL,
  productName VARCHAR(200) NOT NULL,
  amount DECIMAL(10, 2) NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  documentType ENUM('DNI', 'CE', 'PASAPORTE', 'RUC') NOT NULL,
  documentNumber VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  address VARCHAR(250) NOT NULL,
  isMinor BOOLEAN NOT NULL DEFAULT FALSE,
  guardianName VARCHAR(200) NULL,
  description TEXT NOT NULL,
  consumerRequest TEXT NOT NULL,
  ipAddress VARCHAR(45) NOT NULL,
  userAgent VARCHAR(500) NOT NULL,
  INDEX idx_claimCode (claimCode),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_createdAt (createdAt),
  INDEX idx_email (email),
  INDEX idx_documentNumber (documentNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para respuestas/seguimiento de reclamos
CREATE TABLE IF NOT EXISTS claim_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  claimId INT NOT NULL,
  adminUserId INT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (claimId) REFERENCES claims(id) ON DELETE CASCADE,
  INDEX idx_claimId (claimId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Secuencia para generar códigos únicos
CREATE TABLE IF NOT EXISTS claim_sequence (
  year INT NOT NULL PRIMARY KEY,
  lastNumber INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
