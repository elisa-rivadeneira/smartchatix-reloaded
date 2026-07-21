ALTER TABLE lessons
ADD COLUMN documents_urls JSON NULL COMMENT 'Array de URLs de múltiples documentos (PDF, Word, Excel)';
