-- SQL Script to update exercises with topic-related questions
-- Generated on July 10, 2025
-- This script ensures each exercise has multiple topic-related questions with proper audio and image support

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

-- Identify exercises with only one question
SET @row_number = 0;
DROP TEMPORARY TABLE IF EXISTS single_question_exercises;
CREATE TEMPORARY TABLE single_question_exercises AS
SELECT 
    e.id AS exercise_id, 
    e.title,
    e.type AS exercise_type,
    e.level AS level, 
    e.question, 
    e.options, 
    e.correct_answer, 
    e.explanation, 
    e.difficulty_level, 
    e.points, 
    e.is_active, 
    e.audio_url, 
    e.image_url,
    e.lesson_id,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')) as option_a,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')) as option_b,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')) as option_c,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')) as option_d,
    q.id AS question_id,
    q.question_type
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    );

-- Generate thematic questions based on the exercise topic

-- For Greeting exercises (lesson_id = 1)
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
    image_url
)
SELECT 
    exercise_id,
    'What do you say when you meet someone for the first time?' as question_text,
    question_type,
    'Hello' as option_a,
    'Goodbye' as option_b,
    'Thank you' as option_c,
    'Sorry' as option_d,
    'A' as correct_answer,
    'When meeting someone for the first time, you say Hello.' as explanation,
    difficulty_level,
    points,
    2 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 1;

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
    image_url
)
SELECT 
    exercise_id,
    'What is an appropriate evening greeting?' as question_text,
    question_type,
    'Good morning' as option_a,
    'Good afternoon' as option_b,
    'Good evening' as option_c,
    'Good day' as option_d,
    'C' as correct_answer,
    'Good evening is used as a greeting in the evening.' as explanation,
    difficulty_level,
    points,
    3 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 1;

-- For Numbers exercises (lesson_id = 2)
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
    image_url
)
SELECT 
    exercise_id,
    'How do you say the number 5 in English?' as question_text,
    question_type,
    'Five' as option_a,
    'Four' as option_b,
    'Six' as option_c,
    'Seven' as option_d,
    'A' as correct_answer,
    'The correct way to say 5 in English is "Five".' as explanation,
    difficulty_level,
    points,
    2 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 2;

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
    image_url
)
SELECT 
    exercise_id,
    'Which of these is an odd number?' as question_text,
    question_type,
    'Two' as option_a,
    'Four' as option_b,
    'Six' as option_c,
    'Seven' as option_d,
    'D' as correct_answer,
    'Seven is an odd number. The others are even numbers.' as explanation,
    difficulty_level,
    points,
    3 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 2;

-- For Colors exercises (lesson_id = 3)
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
    image_url
)
SELECT 
    exercise_id,
    'What color is a banana?' as question_text,
    question_type,
    'Red' as option_a,
    'Yellow' as option_b,
    'Green' as option_c,
    'Blue' as option_d,
    'B' as correct_answer,
    'A ripe banana is yellow.' as explanation,
    difficulty_level,
    points,
    2 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 3;

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
    image_url
)
SELECT 
    exercise_id,
    'What color is grass?' as question_text,
    question_type,
    'Blue' as option_a,
    'Yellow' as option_b,
    'Green' as option_c,
    'Red' as option_d,
    'C' as correct_answer,
    'Grass is typically green in color.' as explanation,
    difficulty_level,
    points,
    3 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 3;

-- For Family exercises (lesson_id = 4)
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
    image_url
)
SELECT 
    exercise_id,
    'What do you call your father\'s brother?' as question_text,
    question_type,
    'Uncle' as option_a,
    'Cousin' as option_b,
    'Nephew' as option_c,
    'Brother' as option_d,
    'A' as correct_answer,
    'Your father\'s brother is your uncle.' as explanation,
    difficulty_level,
    points,
    2 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 4;

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
    image_url
)
SELECT 
    exercise_id,
    'What is the relationship between your mother\'s sister and you?' as question_text,
    question_type,
    'Sister' as option_a,
    'Aunt' as option_b,
    'Niece' as option_c,
    'Grandmother' as option_d,
    'B' as correct_answer,
    'Your mother\'s sister is your aunt.' as explanation,
    difficulty_level,
    points,
    3 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 4;

-- For Food exercises (lesson_id = 5)
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
    image_url
)
SELECT 
    exercise_id,
    'Which of these is a fruit?' as question_text,
    question_type,
    'Carrot' as option_a,
    'Potato' as option_b,
    'Apple' as option_c,
    'Broccoli' as option_d,
    'C' as correct_answer,
    'An apple is a fruit. The others are vegetables.' as explanation,
    difficulty_level,
    points,
    2 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 5;

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
    image_url
)
SELECT 
    exercise_id,
    'What do you typically eat for breakfast?' as question_text,
    question_type,
    'Cereal' as option_a,
    'Steak' as option_b,
    'Pasta' as option_c,
    'Cake' as option_d,
    'A' as correct_answer,
    'Cereal is a common breakfast food.' as explanation,
    difficulty_level,
    points,
    3 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id = 5;

-- For generic exercises (other lesson IDs)
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
    image_url
)
SELECT 
    exercise_id,
    CONCAT('Practice question for: ', question) as question_text,
    question_type,
    TRIM(REPLACE(option_a, 'A. ', '')) as option_a,
    TRIM(REPLACE(option_b, 'B. ', '')) as option_b,
    TRIM(REPLACE(option_c, 'C. ', '')) as option_c,
    TRIM(REPLACE(option_d, 'D. ', '')) as option_d,
    correct_answer,
    explanation,
    difficulty_level,
    points,
    2 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises
WHERE
    lesson_id NOT IN (1, 2, 3, 4, 5);

-- Add more generic questions for all remaining exercises with only one question
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
    image_url
)
SELECT 
    exercise_id,
    CONCAT('Additional practice for: ', question) as question_text,
    question_type,
    TRIM(REPLACE(option_a, 'A. ', '')) as option_a,
    TRIM(REPLACE(option_b, 'B. ', '')) as option_b,
    TRIM(REPLACE(option_c, 'C. ', '')) as option_c,
    TRIM(REPLACE(option_d, 'D. ', '')) as option_d,
    correct_answer,
    explanation,
    difficulty_level,
    points,
    3 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises;

-- Update the question_order of the original questions to 1
UPDATE questions q
JOIN single_question_exercises sqe ON q.id = sqe.question_id
SET q.question_order = 1
WHERE q.exercise_id = sqe.exercise_id;

-- Make sure all questions have the correct created_at and updated_at timestamps
UPDATE questions 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL;

-- Verify the results
SELECT exercise_id, COUNT(*) as question_count
FROM questions
GROUP BY exercise_id
ORDER BY question_count;

-- Drop temporary table
DROP TEMPORARY TABLE IF EXISTS single_question_exercises;
