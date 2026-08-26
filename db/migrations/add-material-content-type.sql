ALTER TABLE lessons
MODIFY COLUMN content_type ENUM('video', 'document', 'quiz', 'assignment', 'markdown', 'material') DEFAULT 'video';
