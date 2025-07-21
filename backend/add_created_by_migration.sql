-- Add created_by column to question_test and question_group tables
-- Migration script for question ownership tracking

-- Add created_by to question_test table
ALTER TABLE question_test 
ADD COLUMN created_by BIGINT,
ADD CONSTRAINT fk_question_test_created_by 
    FOREIGN KEY (created_by) REFERENCES user(user_id);

-- Add created_by to question_group table  
ALTER TABLE question_group
ADD COLUMN created_by BIGINT,
ADD CONSTRAINT fk_question_group_created_by
    FOREIGN KEY (created_by) REFERENCES user(user_id);

-- Optional: Set existing questions to a default admin user (ID = 1)
-- UPDATE question_test SET created_by = 1 WHERE created_by IS NULL;
-- UPDATE question_group SET created_by = 1 WHERE created_by IS NULL;

-- Create index for better query performance
CREATE INDEX idx_question_test_created_by ON question_test(created_by);
CREATE INDEX idx_question_group_created_by ON question_group(created_by);
