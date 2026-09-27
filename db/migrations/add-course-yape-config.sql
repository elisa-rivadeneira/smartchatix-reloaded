-- Yape (número + QR) personalizado por curso, para el checkout en /inscripcion-vivo.
-- Si quedan vacíos, el checkout usa el Yape por defecto de Jesús Fernández
-- (+51 983 269 818 / /images/yape.jpeg) tal como funciona hoy.

ALTER TABLE courses
ADD COLUMN yape_phone VARCHAR(20) NULL COMMENT 'Número de Yape para este curso. Vacío = usa el número por defecto',
ADD COLUMN yape_qr_url VARCHAR(500) NULL COMMENT 'URL de la imagen del QR de Yape para este curso. Vacío = usa el QR por defecto';

UPDATE courses
SET yape_phone = '+51 967 717 179', yape_qr_url = '/images/yape-elisa.jpeg'
WHERE slug = 'desarrolla-con-claude';
