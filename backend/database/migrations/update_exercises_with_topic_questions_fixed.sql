-- SQL Script to update exercises with topic-related questions (Fixed Version)
-- Generated on July 10, 2025
-- This script ensures each exercise has 3 questions with unique audio_url and image_url
-- Fixed to avoid temporary table issues

-- Audio and image paths follow these patterns:
-- Audio files: /audio/[topic]/[specific_concept]_[exercise_id].mp3
-- Image files: /images/[topic]/[specific_concept]_[exercise_id].jpg
-- Example: /audio/greetings/greeting_hello_45.mp3, /images/colors/color_banana_22.jpg

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

-- Find exercises with only one question
-- Instead of using a temporary table, we'll use direct subqueries

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
    image_url,
    created_at,
    updated_at
)
SELECT 
    e.id,
    'What do you say when you meet someone for the first time?' as question_text,
    'multiple_choice' as question_type,
    'Hello' as option_a,
    'Goodbye' as option_b,
    'Thank you' as option_c,
    'Sorry' as option_d,
    'A' as correct_answer,
    'When meeting someone for the first time, you say Hello.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/greetings/greeting_hello_', e.id, '.mp3') as audio_url,
    CONCAT('/images/greetings/greeting_hello_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 1
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    e.id,
    'What is an appropriate evening greeting?' as question_text,
    'multiple_choice' as question_type,
    'Good morning' as option_a,
    'Good afternoon' as option_b,
    'Good evening' as option_c,
    'Good day' as option_d,
    'C' as correct_answer,
    'Good evening is used as a greeting in the evening.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/greetings/greeting_evening_', e.id, '.mp3') as audio_url,
    CONCAT('/images/greetings/greeting_evening_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 1
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    image_url,
    created_at,
    updated_at
)
SELECT 
    e.id,
    'How do you say the number 5 in English?' as question_text,
    'multiple_choice' as question_type,
    'Five' as option_a,
    'Four' as option_b,
    'Six' as option_c,
    'Seven' as option_d,
    'A' as correct_answer,
    'The correct way to say 5 in English is "Five".' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/numbers/number_five_', e.id, '.mp3') as audio_url,
    CONCAT('/images/numbers/number_five_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 2
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    e.id,
    'Which of these is an odd number?' as question_text,
    'multiple_choice' as question_type,
    'Two' as option_a,
    'Four' as option_b,
    'Six' as option_c,
    'Seven' as option_d,
    'D' as correct_answer,
    'Seven is an odd number. The others are even numbers.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/numbers/number_odd_', e.id, '.mp3') as audio_url,
    CONCAT('/images/numbers/number_odd_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 2
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    image_url,
    created_at,
    updated_at
)
SELECT 
    e.id,
    'What color is a banana?' as question_text,
    'multiple_choice' as question_type,
    'Red' as option_a,
    'Yellow' as option_b,
    'Green' as option_c,
    'Blue' as option_d,
    'B' as correct_answer,
    'A ripe banana is yellow.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/colors/color_banana_', e.id, '.mp3') as audio_url,
    CONCAT('/images/colors/color_banana_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 3
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    e.id,
    'What color is grass?' as question_text,
    'multiple_choice' as question_type,
    'Blue' as option_a,
    'Yellow' as option_b,
    'Green' as option_c,
    'Red' as option_d,
    'C' as correct_answer,
    'Grass is typically green in color.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/colors/color_grass_', e.id, '.mp3') as audio_url,
    CONCAT('/images/colors/color_grass_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 3
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    image_url,
    created_at,
    updated_at
)
SELECT 
    e.id,
    'What do you call your father\'s brother?' as question_text,
    'multiple_choice' as question_type,
    'Uncle' as option_a,
    'Cousin' as option_b,
    'Nephew' as option_c,
    'Brother' as option_d,
    'A' as correct_answer,
    'Your father\'s brother is your uncle.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/family/family_uncle_', e.id, '.mp3') as audio_url,
    CONCAT('/images/family/family_uncle_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 4
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    e.id,
    'What is the relationship between your mother\'s sister and you?' as question_text,
    'multiple_choice' as question_type,
    'Sister' as option_a,
    'Aunt' as option_b,
    'Niece' as option_c,
    'Grandmother' as option_d,
    'B' as correct_answer,
    'Your mother\'s sister is your aunt.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/family/family_aunt_', e.id, '.mp3') as audio_url,
    CONCAT('/images/family/family_aunt_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 4
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    image_url,
    created_at,
    updated_at
)
SELECT 
    e.id,
    'Which of these is a fruit?' as question_text,
    'multiple_choice' as question_type,
    'Carrot' as option_a,
    'Potato' as option_b,
    'Apple' as option_c,
    'Broccoli' as option_d,
    'C' as correct_answer,
    'An apple is a fruit. The others are vegetables.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/food/food_fruit_', e.id, '.mp3') as audio_url,
    CONCAT('/images/food/food_fruit_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 5
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

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
    e.id,
    'What do you typically eat for breakfast?' as question_text,
    'multiple_choice' as question_type,
    'Cereal' as option_a,
    'Steak' as option_b,
    'Pasta' as option_c,
    'Cake' as option_d,
    'A' as correct_answer,
    'Cereal is a common breakfast food.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/food/food_breakfast_', e.id, '.mp3') as audio_url,
    CONCAT('/images/food/food_breakfast_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id = 5
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

-- For generic exercises (other lesson IDs)
-- Add generic questions for all exercises with only one question
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
    e.id,
    CONCAT('Practice question for: ', e.question) as question_text,
    'multiple_choice' as question_type,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', -1) as option_a,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', -1) as option_b,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', -1) as option_c,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', -1) as option_d,
    e.correct_answer,
    e.explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/generic/practice_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/generic/practice_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.lesson_id NOT IN (1, 2, 3, 4, 5)
    AND e.id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
GROUP BY e.id;

-- Add additional practice questions for all exercises with only one question
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
    e.id,
    CONCAT('Additional practice for: ', e.question) as question_text,
    'multiple_choice' as question_type,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', -1) as option_a,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', -1) as option_b,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', -1) as option_c,
    SUBSTRING_INDEX(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', -1) as option_d,
    e.correct_answer,
    e.explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/generic/practice_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/generic/practice_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
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
    )
GROUP BY e.id;

-- Update the question_order of the original questions to 1
UPDATE questions q
JOIN (
    SELECT q.id, q.exercise_id
    FROM questions q
    JOIN exercises e ON q.exercise_id = e.id
    WHERE q.exercise_id IN (
        SELECT exercise_id 
        FROM questions 
        GROUP BY exercise_id 
        HAVING COUNT(*) = 1
    )
) AS sq ON q.id = sq.id
SET q.question_order = 1;

-- Make sure all questions have the correct created_at and updated_at timestamps
UPDATE questions 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL;

-- Verify the results
SELECT exercise_id, COUNT(*) as question_count
FROM questions
GROUP BY exercise_id
ORDER BY question_count;
