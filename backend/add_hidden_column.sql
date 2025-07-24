-- Add hidden column to blog_post table
ALTER TABLE blog_post 
ADD COLUMN hidden BOOLEAN DEFAULT FALSE;

-- Update existing records to not hidden
UPDATE blog_post SET hidden = FALSE WHERE hidden IS NULL;

-- Check the result
SELECT id, title, hidden FROM blog_post LIMIT 5;
