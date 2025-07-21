-- SQL Script to update ALL questions with topic-related audio and image URLs
-- Generated on July 10, 2025
-- This script updates ALL questions in the database to have proper themed resources based on lesson topics

-- Audio and image paths follow these patterns:
-- Audio files: /audio/[topic]/[specific_concept]_[exercise_id]_[question_order].mp3
-- Image files: /images/[topic]/[specific_concept]_[exercise_id]_[question_order].jpg
-- Example: /audio/greetings/greeting_hello_45_1.mp3, /images/colors/color_banana_22_2.jpg

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup_before_update LIKE questions;
INSERT INTO questions_backup_before_update SELECT * FROM questions;

-- Create a log table to track changes
CREATE TABLE IF NOT EXISTS question_update_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT,
    action VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- LESSON 1: GREETINGS
-- ======================================================================
-- Update all questions for Greetings exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/greetings/greeting_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/greetings/greeting_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 1;

-- Log the update for Greetings lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated greeting questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 1;

-- ======================================================================
-- LESSON 2: NUMBERS
-- ======================================================================
-- Update all questions for Numbers exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/numbers/number_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/numbers/number_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 2;

-- Log the update for Numbers lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated number questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 2;

-- ======================================================================
-- LESSON 3: COLORS
-- ======================================================================
-- Update all questions for Colors exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/colors/color_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/colors/color_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 3;

-- Log the update for Colors lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated color questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 3;

-- ======================================================================
-- LESSON 4: FAMILY
-- ======================================================================
-- Update all questions for Family exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/family/family_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/family/family_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 4;

-- Log the update for Family lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated family questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 4;

-- ======================================================================
-- LESSON 5: FOOD
-- ======================================================================
-- Update all questions for Food exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/food/food_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/food/food_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 5;

-- Log the update for Food lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated food questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 5;

-- ======================================================================
-- LESSON 6: BUSINESS
-- ======================================================================
-- Update all questions for Business exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/business/business_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/business/business_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 6;

-- Log the update for Business lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated business questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 6;

-- ======================================================================
-- LESSON 7: TRAVEL
-- ======================================================================
-- Update all questions for Travel exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/travel/travel_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/travel/travel_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 7;

-- Log the update for Travel lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated travel questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 7;

-- ======================================================================
-- LESSON 8: OFFICE
-- ======================================================================
-- Update all questions for Office exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/office/office_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/office/office_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 8;

-- Log the update for Office lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated office questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 8;

-- ======================================================================
-- LESSON 9: TECHNOLOGY
-- ======================================================================
-- Update all questions for Technology exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/technology/technology_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/technology/technology_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 9;

-- Log the update for Technology lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated technology questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id = 9;

-- ======================================================================
-- OTHER LESSONS
-- ======================================================================
-- Update all questions for other exercises
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/generic/generic_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/generic/generic_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id > 9 OR e.lesson_id IS NULL;

-- Log the update for other lessons
INSERT INTO question_update_log (exercise_id, action)
SELECT DISTINCT e.id, 'Updated generic questions with topic resources' 
FROM exercises e
JOIN questions q ON e.id = q.exercise_id
WHERE e.lesson_id > 9 OR e.lesson_id IS NULL;

-- ======================================================================
-- VERIFICATION AND REPORTING
-- ======================================================================

-- Check if there are any exercises with less than 3 questions
-- (This is informational and helps identify any exercises that may need more questions)
SELECT 
    e.id as exercise_id,
    e.title as exercise_title,
    e.lesson_id,
    COUNT(q.id) as question_count
FROM 
    exercises e
LEFT JOIN 
    questions q ON e.id = q.exercise_id
GROUP BY 
    e.id
HAVING 
    question_count < 3
ORDER BY 
    e.lesson_id, e.id;

-- Summary statistics
SELECT 
    e.lesson_id,
    COUNT(DISTINCT e.id) as total_exercises,
    COUNT(q.id) as total_questions,
    COUNT(q.id) / COUNT(DISTINCT e.id) as avg_questions_per_exercise,
    SUM(CASE WHEN q.audio_url IS NOT NULL THEN 1 ELSE 0 END) as questions_with_audio,
    SUM(CASE WHEN q.image_url IS NOT NULL THEN 1 ELSE 0 END) as questions_with_images
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
GROUP BY 
    e.lesson_id
ORDER BY 
    e.lesson_id;

-- Log summary
INSERT INTO question_update_log (exercise_id, action)
VALUES (0, CONCAT('Update completed. All questions now have topic-specific resource paths. Timestamp: ', NOW()));
