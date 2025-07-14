-- Optimized SQL script to update all questions at once
-- This version handles all questions in a single statement for maximum efficiency

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

-- Update ALL questions in a single statement
-- This uses JSON_EXTRACT to properly extract options from the exercises table
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET 
    -- Update question text exactly as it appears in the exercises table
    q.question_text = e.question,
    
    -- Update audio and image URLs with correct paths
    q.audio_url = CONCAT('/files/audio/', e.audio_url),
    q.image_url = CONCAT('/files/images/', e.image_url),
    
    -- Extract options using JSON functions to ensure exact text from exercises
    q.option_a = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')),
    q.option_b = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')),
    q.option_c = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')),
    q.option_d = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')),
    
    -- Also update other fields for completeness
    q.correct_answer = e.correct_answer,
    q.explanation = e.explanation,
    q.difficulty_level = CASE 
        WHEN e.difficulty_level = 'easy' THEN 'EASY'
        WHEN e.difficulty_level = 'medium' THEN 'MEDIUM'
        WHEN e.difficulty_level = 'hard' THEN 'HARD'
        ELSE 'EASY'
    END,
    q.points = e.points,
    q.is_active = e.is_active;

-- Verify the update with a query
SELECT 
    q.id,
    q.exercise_id,
    q.question_order,
    q.question_text,
    e.question AS exercise_question,
    q.option_a,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')) AS expected_option_a,
    q.option_b,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')) AS expected_option_b,
    q.option_c,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')) AS expected_option_c,
    q.option_d,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')) AS expected_option_d
FROM 
    questions q
JOIN 
    exercises e ON e.id = q.exercise_id
LIMIT 10;
