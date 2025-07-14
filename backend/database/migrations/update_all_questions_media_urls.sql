-- SQL Script to update questions with audio and image files (Complete)
-- This script updates all questions in the database with audio_url and image_url
-- based on exercise_id and question_order using a consistent naming convention.

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

-- Update ALL questions with the appropriate audio and image URLs
-- This uses the pattern ex{N}.mp3 and ex{N}.jpg where N is calculated 
-- based on exercise_id and question_order

-- Main update statement that handles all questions at once
UPDATE questions
SET 
    audio_url = CONCAT('/files/audio/exercises/ex', 
                       (exercise_id - 1) * 6 + question_order, '.mp3'),
    image_url = CONCAT('/files/images/exercises/ex', 
                      (exercise_id - 1) * 6 + question_order, '.jpg')
WHERE 
    exercise_id IS NOT NULL AND
    question_order IS NOT NULL;

-- Update exercises table to match (assuming 1 question per exercise)
UPDATE exercises e
SET 
    e.audio_url = CONCAT('exercises/ex', e.id, '.mp3'),
    e.image_url = CONCAT('exercises/ex', e.id, '.jpg')
WHERE 
    e.id IS NOT NULL;
    
-- Optional: Verify results with a select statement
SELECT 
    id, exercise_id, question_order,
    audio_url, image_url
FROM 
    questions
ORDER BY 
    exercise_id, question_order
LIMIT 100;
