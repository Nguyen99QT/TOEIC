-- SQL Script to create a new questions table from exercises data
-- This script creates a brand new questions table that matches the exercises table data
-- It preserves all the relationships between questions and exercises

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

-- Create the new questions table
DROP TABLE IF EXISTS questions_new;
CREATE TABLE questions_new (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exercise_id BIGINT NOT NULL,
    question_text VARCHAR(255) NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice',
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_answer VARCHAR(50) NOT NULL,
    explanation TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'EASY',
    points INT DEFAULT 10,
    question_order INT,
    is_active TINYINT(1) DEFAULT 1,
    audio_url VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Insert data from exercises table
-- This generates one question per exercise with matching data
INSERT INTO questions_new (
    exercise_id, 
    question_text, 
    question_type,
    option_a, 
    option_b, 
    option_c, 
    option_d, 
    correct_answer, 
    explanation, 
    difficulty_level, 
    points, 
    question_order, 
    is_active, 
    audio_url, 
    image_url
)
SELECT 
    e.id as exercise_id,
    e.question as question_text,
    CASE 
        WHEN e.type = 'multiple_choice' THEN 'multiple_choice'
        WHEN e.type = 'fill_in_the_blank' THEN 'fill_in_blank'
        WHEN e.type = 'matching' THEN 'matching'
        ELSE 'multiple_choice'
    END as question_type,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')) as option_a,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')) as option_b,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')) as option_c,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')) as option_d,
    e.correct_answer,
    e.explanation,
    CASE 
        WHEN e.difficulty_level = 'easy' THEN 'EASY'
        WHEN e.difficulty_level = 'medium' THEN 'MEDIUM'
        WHEN e.difficulty_level = 'hard' THEN 'HARD'
        ELSE 'EASY'
    END as difficulty_level,
    e.points,
    1 as question_order, -- Each exercise gets one question with order 1
    e.is_active,
    CONCAT('/files/audio/', e.audio_url) as audio_url,
    CONCAT('/files/images/', e.image_url) as image_url
FROM exercises e;

-- If you need multiple questions per exercise, you can replicate the data
-- For example, to add 5 more questions for each exercise (6 total per exercise):
-- This is just an example - adjust according to your needs

-- Add 5 more questions for each exercise
INSERT INTO questions_new (
    exercise_id, 
    question_text, 
    question_type,
    option_a, 
    option_b, 
    option_c, 
    option_d, 
    correct_answer, 
    explanation, 
    difficulty_level, 
    points, 
    question_order, 
    is_active, 
    audio_url, 
    image_url
)
SELECT 
    e.id as exercise_id,
    CONCAT(e.question, ' (Question ', q.question_order, ')') as question_text,
    CASE 
        WHEN e.type = 'multiple_choice' THEN 'multiple_choice'
        WHEN e.type = 'fill_in_the_blank' THEN 'fill_in_blank'
        WHEN e.type = 'matching' THEN 'matching'
        ELSE 'multiple_choice'
    END as question_type,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')) as option_a,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')) as option_b,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')) as option_c,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')) as option_d,
    e.correct_answer,
    e.explanation,
    CASE 
        WHEN e.difficulty_level = 'easy' THEN 'EASY'
        WHEN e.difficulty_level = 'medium' THEN 'MEDIUM'
        WHEN e.difficulty_level = 'hard' THEN 'HARD'
        ELSE 'EASY'
    END as difficulty_level,
    e.points,
    q.question_order as question_order,
    e.is_active,
    CONCAT('/files/audio/', e.audio_url) as audio_url,
    CONCAT('/files/images/', e.image_url) as image_url
FROM 
    exercises e,
    (SELECT 2 as question_order UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) q;

-- Verification queries
SELECT COUNT(*) FROM questions_new;
SELECT * FROM questions_new LIMIT 10;

-- To replace the original questions table, uncomment the following:
-- RENAME TABLE questions TO questions_old, questions_new TO questions;

-- To clean up the backup (only if you're sure everything is working correctly):
-- DROP TABLE questions_old;

-- Note: After executing this script, you may need to update the audio and image URLs
-- to match the actual files in your backend's static resources directory.
