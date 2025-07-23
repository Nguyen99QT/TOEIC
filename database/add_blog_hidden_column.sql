-- Add hidden column to blog_post table
ALTER TABLE blog_post ADD COLUMN hidden BOOLEAN DEFAULT FALSE;

-- Update existing records to have hidden = false
UPDATE blog_post SET hidden = FALSE WHERE hidden IS NULL;
