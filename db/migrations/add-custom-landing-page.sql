-- Permite que un curso use una landing page personalizada en vez de la genérica /cursos/[slug]

ALTER TABLE courses
ADD COLUMN landing_page_type ENUM('automated', 'custom') DEFAULT 'automated' COMMENT 'Si la landing del curso es la genérica (/cursos/slug) o una página personalizada',
ADD COLUMN custom_landing_url VARCHAR(255) NULL COMMENT 'Ruta interna de la landing personalizada (ej: /curso-desarrolla-con-claude), solo aplica si landing_page_type = custom';
