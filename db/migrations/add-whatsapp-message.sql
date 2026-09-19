-- Mensaje de WhatsApp personalizado por curso (para el botón flotante de las landings).
-- Si queda vacío, la landing arma un mensaje automático con el nombre del curso y su modalidad.
-- Admite la variable {curso}, que se reemplaza por el título real del curso.

ALTER TABLE courses
ADD COLUMN whatsapp_message VARCHAR(500) NULL COMMENT 'Mensaje personalizado del botón de WhatsApp de la landing. Admite {curso}. Vacío = mensaje automático';
