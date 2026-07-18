-- Migración: Renombrar video_markdown a main_content
-- Fecha: 2026-07-18
-- Descripción: Cambiar nombre del campo para reflejar mejor su propósito

-- ============================================================
-- PASO 1: Renombrar columna en tabla lessons
-- ============================================================

ALTER TABLE lessons
CHANGE COLUMN video_markdown main_content TEXT COMMENT 'Contenido principal de la lección (HTML)';

-- ============================================================
-- PASO 2: Verificar el cambio
-- ============================================================

DESCRIBE lessons;

-- ============================================================
-- ROLLBACK (si es necesario)
-- ============================================================

-- Para revertir el cambio:
-- ALTER TABLE lessons
-- CHANGE COLUMN main_content video_markdown TEXT COMMENT 'Contenido Markdown para lecciones de video';
