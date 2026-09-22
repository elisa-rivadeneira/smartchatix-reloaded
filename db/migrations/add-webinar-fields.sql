-- Sección de Webinar en la landing pública del curso (antes de la sección de certificado).
-- Si webinar_video_url está vacío, la sección no se muestra: la landing queda igual que ahora.

ALTER TABLE courses
ADD COLUMN webinar_title VARCHAR(255) NULL COMMENT 'Título editable de la sección de webinar en la landing',
ADD COLUMN webinar_description TEXT NULL COMMENT 'Descripción editable de la sección de webinar en la landing',
ADD COLUMN webinar_video_url VARCHAR(500) NULL COMMENT 'URL del video del webinar (YouTube). Vacío = sección oculta';
