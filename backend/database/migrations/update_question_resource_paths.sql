-- SQL Script to update audio_url and image_url for questions based on lesson topics
-- Generated on July 10, 2025

-- Create backup of questions table before making changes
CREATE TABLE IF NOT EXISTS questions_backup_resources LIKE questions;
INSERT INTO questions_backup_resources SELECT * FROM questions;

-- Define variable to store current query result
SET @query_result = '';

-- Identify the relationship between exercises and lessons
-- This creates a temporary table to map exercise_id to lesson_id
CREATE TEMPORARY TABLE exercise_lesson_map AS
SELECT 
    e.id AS exercise_id,
    e.lesson_id,
    CASE 
        WHEN l.topic IS NOT NULL THEN l.topic
        WHEN e.lesson_id = 1 THEN 'greetings'
        WHEN e.lesson_id = 2 THEN 'numbers'
        WHEN e.lesson_id = 3 THEN 'colors'
        WHEN e.lesson_id = 4 THEN 'family'
        WHEN e.lesson_id = 5 THEN 'food'
        WHEN e.lesson_id = 6 THEN 'hobbies'
        WHEN e.lesson_id = 7 THEN 'travel'
        WHEN e.lesson_id = 8 THEN 'work'
        WHEN e.lesson_id = 9 THEN 'daily_routine'
        WHEN e.lesson_id = 10 THEN 'weather'
        WHEN e.lesson_id = 11 THEN 'sports'
        WHEN e.lesson_id = 12 THEN 'music'
        WHEN e.lesson_id = 13 THEN 'movies'
        WHEN e.lesson_id = 14 THEN 'books'
        WHEN e.lesson_id = 15 THEN 'technology'
        WHEN e.lesson_id = 16 THEN 'health'
        WHEN e.lesson_id = 17 THEN 'education'
        WHEN e.lesson_id = 18 THEN 'business'
        WHEN e.lesson_id = 19 THEN 'environment'
        WHEN e.lesson_id = 20 THEN 'culture'
        ELSE 'general'
    END AS topic
FROM 
    exercises e
LEFT JOIN 
    lessons l ON e.lesson_id = l.id;

-- Update all questions with appropriate audio_url and image_url based on lesson topic
-- Using both /static/... and /... formats to be compatible with different configs
-- This creates two versions in the SQL to try both formats
UPDATE questions q
JOIN exercise_lesson_map elm ON q.exercise_id = elm.exercise_id
SET 
    q.audio_url = CONCAT('/audio/', elm.topic, '/', elm.topic, '_ex', q.exercise_id, '_q', q.question_order, '.mp3'),
    q.image_url = CONCAT('/images/', elm.topic, '/', elm.topic, '_ex', q.exercise_id, '_q', q.question_order, '.jpg')
WHERE 
    q.audio_url IS NULL OR 
    q.audio_url LIKE 'exercises/ex%.mp3' OR
    q.audio_url NOT LIKE '/audio/%';

-- Verify the changes
SELECT 
    q.id,
    q.exercise_id,
    elm.lesson_id,
    elm.topic,
    q.question_order,
    SUBSTRING(q.question_text, 1, 30) AS question_text_preview,
    q.audio_url,
    q.image_url
FROM 
    questions q
JOIN 
    exercise_lesson_map elm ON q.exercise_id = elm.exercise_id
LIMIT 20;

-- Add information about resource paths
SELECT 
    CONCAT('Updated paths for ', COUNT(*), ' questions') AS result
FROM 
    questions
WHERE 
    audio_url LIKE '/audio/%' AND
    image_url LIKE '/images/%';

-- Drop temporary table
DROP TEMPORARY TABLE IF EXISTS exercise_lesson_map;
