-- Fix question_group content column size
-- Current: tinytext (255 bytes) -> Change to: text (65,535 bytes)

USE toeic8;

-- Backup existing data (optional)
-- CREATE TABLE question_group_backup AS SELECT * FROM question_group;

-- Modify the content column to handle larger text
ALTER TABLE question_group 
MODIFY COLUMN content TEXT;

-- Verify the change
DESCRIBE question_group;

-- Check if there are any existing records
SELECT COUNT(*) as total_groups FROM question_group;

SELECT 'Column modified successfully. Content can now hold up to 65,535 characters.' as status;
