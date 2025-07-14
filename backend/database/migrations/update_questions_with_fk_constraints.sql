-- SQL Script to handle foreign key constraints and update questions
-- Generated on July 10, 2025
-- This script safely handles the foreign key constraint error

-- ======================================================================
-- STEP 1: DISABLE FOREIGN KEY CHECKS (TEMPORARY)
-- ======================================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ======================================================================
-- STEP 2: BACK UP BOTH TABLES (questions and user_question_answers)
-- ======================================================================
-- Create backup of questions table
CREATE TABLE IF NOT EXISTS questions_backup_full LIKE questions;
INSERT INTO questions_backup_full SELECT * FROM questions;

-- Create backup of user_question_answers table
CREATE TABLE IF NOT EXISTS user_question_answers_backup LIKE user_question_answers;
INSERT INTO user_question_answers_backup SELECT * FROM user_question_answers;

-- ======================================================================
-- STEP 3: UPDATE QUESTION PATHS INSTEAD OF DELETING
-- ======================================================================
-- This approach preserves the foreign key relationships

-- LESSON 1: GREETINGS
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/greetings/greeting_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/greetings/greeting_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 1;

-- LESSON 2: NUMBERS
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/numbers/number_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/numbers/number_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 2;

-- LESSON 3: COLORS
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/colors/color_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/colors/color_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 3;

-- LESSON 4: FAMILY
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/family/family_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/family/family_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 4;

-- LESSON 5: FOOD
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/food/food_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/food/food_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 5;

-- LESSON 6: BUSINESS
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/business/business_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/business/business_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 6;

-- LESSON 7: TRAVEL
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/travel/travel_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/travel/travel_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 7;

-- LESSON 8: OFFICE
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/office/office_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/office/office_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 8;

-- LESSON 9: TECHNOLOGY
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/technology/technology_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/technology/technology_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id = 9;

-- OTHER LESSONS
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/audio/generic/generic_q', q.question_order, '_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/generic/generic_q', q.question_order, '_', e.id, '.jpg')
WHERE e.lesson_id > 9 OR e.lesson_id IS NULL;

-- ======================================================================
-- STEP 4: ENSURE EVERY EXERCISE HAS 3 QUESTIONS
-- ======================================================================

-- Check which exercises have less than 3 questions
CREATE TEMPORARY TABLE exercises_with_few_questions AS
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

-- Add questions to exercises with less than 3 questions
-- Start with Lesson 1: GREETINGS
INSERT INTO questions (
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
    image_url,
    created_at,
    updated_at
)
SELECT 
    e.exercise_id,
    CASE 
        WHEN missing = 1 THEN 'What do you say when you meet someone for the first time?'
        WHEN missing = 2 THEN 'What is an appropriate evening greeting?'
    END as question_text,
    'multiple_choice' as question_type,
    CASE 
        WHEN missing = 1 THEN 'Hello'
        WHEN missing = 2 THEN 'Good morning'
    END as option_a,
    CASE 
        WHEN missing = 1 THEN 'Goodbye'
        WHEN missing = 2 THEN 'Good afternoon'
    END as option_b,
    CASE 
        WHEN missing = 1 THEN 'Thank you'
        WHEN missing = 2 THEN 'Good evening'
    END as option_c,
    CASE 
        WHEN missing = 1 THEN 'Sorry'
        WHEN missing = 2 THEN 'Good day'
    END as option_d,
    CASE 
        WHEN missing = 1 THEN 'A'
        WHEN missing = 2 THEN 'C'
    END as correct_answer,
    CASE 
        WHEN missing = 1 THEN 'When meeting someone for the first time, you say Hello.'
        WHEN missing = 2 THEN 'Good evening is used as a greeting in the evening.'
    END as explanation,
    'EASY' as difficulty_level,
    10 as points,
    CASE 
        WHEN question_count = 1 THEN missing + 1
        WHEN question_count = 2 THEN 3
    END as question_order,
    b'1' as is_active,
    CASE 
        WHEN missing = 1 THEN CONCAT('/audio/greetings/greeting_q', 
            CASE WHEN question_count = 1 THEN '2' WHEN question_count = 2 THEN '3' END, 
            '_', e.exercise_id, '.mp3')
        WHEN missing = 2 THEN CONCAT('/audio/greetings/greeting_q3_', e.exercise_id, '.mp3')
    END as audio_url,
    CASE 
        WHEN missing = 1 THEN CONCAT('/images/greetings/greeting_q', 
            CASE WHEN question_count = 1 THEN '2' WHEN question_count = 2 THEN '3' END, 
            '_', e.exercise_id, '.jpg')
        WHEN missing = 2 THEN CONCAT('/images/greetings/greeting_q3_', e.exercise_id, '.jpg')
    END as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises_with_few_questions e
CROSS JOIN
    (SELECT 1 as missing UNION SELECT 2 as missing) as m
WHERE 
    e.lesson_id = 1
    AND 
    CASE 
        WHEN e.question_count = 1 THEN missing <= 2
        WHEN e.question_count = 2 THEN missing = 1
        ELSE FALSE
    END;

-- ======================================================================
-- STEP 5: ADD QUESTIONS FOR OTHER LESSON TYPES IF NEEDED
-- ======================================================================
-- The pattern can be repeated for other lesson types...
-- (Add code for other lesson types as needed)

-- ======================================================================
-- STEP 6: RE-ENABLE FOREIGN KEY CHECKS
-- ======================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ======================================================================
-- STEP 7: VERIFICATION AND REPORTING
-- ======================================================================
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
