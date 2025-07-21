-- SQL Script to DELETE ALL questions and recreate them with topic-related resources
-- Generated on July 10, 2025
-- WARNING: This script will delete ALL questions and related user answers!

-- ======================================================================
-- STEP 1: BACK UP BOTH TABLES (questions and user_question_answers)
-- ======================================================================
-- Create backup of questions table
CREATE TABLE IF NOT EXISTS questions_backup_full LIKE questions;
INSERT INTO questions_backup_full SELECT * FROM questions;

-- Create backup of user_question_answers table
CREATE TABLE IF NOT EXISTS user_question_answers_backup LIKE user_question_answers;
INSERT INTO user_question_answers_backup SELECT * FROM user_question_answers;

-- ======================================================================
-- STEP 2: DISABLE FOREIGN KEY CHECKS (aTEMPORARY)
-- ======================================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ======================================================================
-- STEP 3: DELETE ALL DATA FROM DEPENDENT TABLES FIRST
-- ======================================================================
-- First, delete all records from user_question_answers
TRUNCATE TABLE user_question_answers;

-- ======================================================================
-- STEP 4: DELETE ALL QUESTIONS
-- ======================================================================
TRUNCATE TABLE questions;

-- ======================================================================
-- STEP 5: CREATE NEW QUESTIONS FOR EACH EXERCISE
-- ======================================================================

-- LESSON 1: GREETINGS
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
    'Which is a common English greeting?' as question_text,
    'multiple_choice' as question_type,
    'Hello' as option_a,
    'Goodbye' as option_b,
    'Thank you' as option_c,
    'Sorry' as option_d,
    'A' as correct_answer,
    'Hello is a common greeting in English.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/greetings/greeting_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/greetings/greeting_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 1;

-- Add second question for Greetings exercises
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
    CONCAT('/audio/greetings/greeting_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/greetings/greeting_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 1;

-- Add third question for Greetings exercises
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
    CONCAT('/audio/greetings/greeting_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/greetings/greeting_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 1;

-- LESSON 2: NUMBERS
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
    'How do you say "1" in English?' as question_text,
    'multiple_choice' as question_type,
    'One' as option_a,
    'Two' as option_b,
    'Three' as option_c,
    'Four' as option_d,
    'A' as correct_answer,
    'The number 1 is pronounced "one" in English.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/numbers/number_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/numbers/number_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 2;

-- Add second question for Numbers exercises
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
    'Which of these is the number ten?' as question_text,
    'multiple_choice' as question_type,
    '1' as option_a,
    '5' as option_b,
    '10' as option_c,
    '100' as option_d,
    'C' as correct_answer,
    'The number 10 is written as "10" in digits.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/numbers/number_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/numbers/number_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 2;

-- Add third question for Numbers exercises
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
    'What comes after "nineteen"?' as question_text,
    'multiple_choice' as question_type,
    'Eighteen' as option_a,
    'Twenty' as option_b,
    'Twelve' as option_c,
    'Ninety' as option_d,
    'B' as correct_answer,
    'After nineteen (19) comes twenty (20).' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/numbers/number_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/numbers/number_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 2;

-- LESSON 3: COLORS
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
    'What color is the sky on a clear day?' as question_text,
    'multiple_choice' as question_type,
    'Blue' as option_a,
    'Green' as option_b,
    'Red' as option_c,
    'Yellow' as option_d,
    'A' as correct_answer,
    'The sky appears blue on a clear day.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/colors/color_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/colors/color_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 3;

-- Add second question for Colors exercises
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
    'What color is a ripe banana?' as question_text,
    'multiple_choice' as question_type,
    'Green' as option_a,
    'Yellow' as option_b,
    'Red' as option_c,
    'Blue' as option_d,
    'B' as correct_answer,
    'A ripe banana is yellow in color.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/colors/color_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/colors/color_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 3;

-- Add third question for Colors exercises
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
    'Green' as option_b,
    'Yellow' as option_c,
    'Red' as option_d,
    'B' as correct_answer,
    'Grass is typically green in color.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/colors/color_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/colors/color_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 3;

-- LESSON 4: FAMILY
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
    'Who is your father\'s sister?' as question_text,
    'multiple_choice' as question_type,
    'Mother' as option_a,
    'Aunt' as option_b,
    'Sister' as option_c,
    'Cousin' as option_d,
    'B' as correct_answer,
    'Your father\'s sister is your aunt.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/family/family_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/family/family_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 4;

-- Add second question for Family exercises
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
    'Who is your mother\'s father?' as question_text,
    'multiple_choice' as question_type,
    'Uncle' as option_a,
    'Father' as option_b,
    'Grandfather' as option_c,
    'Brother' as option_d,
    'C' as correct_answer,
    'Your mother\'s father is your grandfather.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/family/family_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/family/family_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 4;

-- Add third question for Family exercises
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
    'Who is your brother or sister\'s child?' as question_text,
    'multiple_choice' as question_type,
    'Niece' as option_a,
    'Nephew' as option_b,
    'Cousin' as option_c,
    'Sibling' as option_d,
    'A' as correct_answer,
    'Your brother or sister\'s female child is your niece; male child is your nephew.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/family/family_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/family/family_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 4;

-- LESSON 5: FOOD
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
    'What is a common breakfast food?' as question_text,
    'multiple_choice' as question_type,
    'Bread' as option_a,
    'Steak' as option_b,
    'Pizza' as option_c,
    'Cake' as option_d,
    'A' as correct_answer,
    'Bread is a common breakfast food in many countries.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/food/food_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/food/food_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 5;

-- Add second question for Food exercises
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
    'Apple' as option_b,
    'Potato' as option_c,
    'Onion' as option_d,
    'B' as correct_answer,
    'An apple is a fruit, while the others are vegetables.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/food/food_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/food/food_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 5;

-- Add third question for Food exercises
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
    'What do you drink when you are thirsty?' as question_text,
    'multiple_choice' as question_type,
    'Water' as option_a,
    'Bread' as option_b,
    'Rice' as option_c,
    'Meat' as option_d,
    'A' as correct_answer,
    'Water is what people typically drink when they are thirsty.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/food/food_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/food/food_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 5;

-- LESSON 6: BUSINESS
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
    'What do you call a formal meeting between a job candidate and employer?' as question_text,
    'multiple_choice' as question_type,
    'Interview' as option_a,
    'Meeting' as option_b,
    'Conference' as option_c,
    'Seminar' as option_d,
    'A' as correct_answer,
    'A formal meeting between a job candidate and employer is called an interview.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/business/business_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/business/business_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 6;

-- Add second question for Business exercises
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
    'What do you call the person in charge of a company?' as question_text,
    'multiple_choice' as question_type,
    'Manager' as option_a,
    'CEO' as option_b,
    'Secretary' as option_c,
    'Intern' as option_d,
    'B' as correct_answer,
    'The person in charge of a company is often called the CEO (Chief Executive Officer).' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/business/business_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/business/business_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 6;

-- Add third question for Business exercises
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
    'What is a document that outlines your work experience and education?' as question_text,
    'multiple_choice' as question_type,
    'Report' as option_a,
    'Resume' as option_b,
    'Memo' as option_c,
    'Email' as option_d,
    'B' as correct_answer,
    'A resume or CV is a document that outlines your work experience and education.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/business/business_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/business/business_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 6;

-- LESSON 7: TRAVEL
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
    'Where do airplanes take off and land?' as question_text,
    'multiple_choice' as question_type,
    'Airport' as option_a,
    'Train station' as option_b,
    'Bus terminal' as option_c,
    'Harbor' as option_d,
    'A' as correct_answer,
    'Airplanes take off and land at airports.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/travel/travel_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/travel/travel_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 7;

-- Add second question for Travel exercises
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
    'What document do you need to travel to another country?' as question_text,
    'multiple_choice' as question_type,
    'ID card' as option_a,
    'Passport' as option_b,
    'Driver\'s license' as option_c,
    'Credit card' as option_d,
    'B' as correct_answer,
    'You need a passport to travel to another country.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/travel/travel_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/travel/travel_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 7;

-- Add third question for Travel exercises
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
    'What do you call a place where tourists stay when traveling?' as question_text,
    'multiple_choice' as question_type,
    'School' as option_a,
    'Office' as option_b,
    'Hotel' as option_c,
    'Hospital' as option_d,
    'C' as correct_answer,
    'Tourists typically stay at a hotel when traveling.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/travel/travel_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/travel/travel_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 7;

-- LESSON 8: OFFICE
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
    'What do you use to write on paper?' as question_text,
    'multiple_choice' as question_type,
    'Pen' as option_a,
    'Monitor' as option_b,
    'Stapler' as option_c,
    'Keyboard' as option_d,
    'A' as correct_answer,
    'You use a pen to write on paper.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/office/office_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/office/office_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 8;

-- Add second question for Office exercises
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
    'What do you use to make copies of a document?' as question_text,
    'multiple_choice' as question_type,
    'Printer' as option_a,
    'Photocopier' as option_b,
    'Computer' as option_c,
    'Scanner' as option_d,
    'B' as correct_answer,
    'You use a photocopier to make copies of a document.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/office/office_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/office/office_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 8;

-- Add third question for Office exercises
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
    'Where do you store important paper documents in an office?' as question_text,
    'multiple_choice' as question_type,
    'Desk' as option_a,
    'Chair' as option_b,
    'Filing cabinet' as option_c,
    'Printer' as option_d,
    'C' as correct_answer,
    'Important paper documents are typically stored in a filing cabinet.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/office/office_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/office/office_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 8;

-- LESSON 9: TECHNOLOGY
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
    'What device do you use to make phone calls?' as question_text,
    'multiple_choice' as question_type,
    'Television' as option_a,
    'Refrigerator' as option_b,
    'Smartphone' as option_c,
    'Microwave' as option_d,
    'C' as correct_answer,
    'You use a smartphone or telephone to make phone calls.' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/technology/technology_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/technology/technology_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 9;

-- Add second question for Technology exercises
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
    'What do you use to search for information on the internet?' as question_text,
    'multiple_choice' as question_type,
    'Browser' as option_a,
    'Email' as option_b,
    'Spreadsheet' as option_c,
    'Calculator' as option_d,
    'A' as correct_answer,
    'You use a browser (like Chrome, Firefox, or Safari) to search for information on the internet.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/technology/technology_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/technology/technology_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 9;

-- Add third question for Technology exercises
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
    'What do you call a portable computer?' as question_text,
    'multiple_choice' as question_type,
    'Desktop' as option_a,
    'Laptop' as option_b,
    'Server' as option_c,
    'Printer' as option_d,
    'B' as correct_answer,
    'A portable computer is called a laptop.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/technology/technology_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/technology/technology_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 9;

-- OTHER LESSONS (GENERIC)
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
    'Which is the correct English sentence?' as question_text,
    'multiple_choice' as question_type,
    'I am student a.' as option_a,
    'I am a student.' as option_b,
    'I a student am.' as option_c,
    'I a am student.' as option_d,
    'B' as correct_answer,
    'The correct word order is "I am a student."' as explanation,
    e.difficulty_level,
    e.points,
    1 as question_order,
    e.is_active,
    CONCAT('/audio/generic/generic_q1_', e.id, '.mp3') as audio_url,
    CONCAT('/images/generic/generic_q1_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id > 9 OR e.lesson_id IS NULL;

-- Add second question for Generic exercises
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
    'What is the past tense of "go"?' as question_text,
    'multiple_choice' as question_type,
    'Goed' as option_a,
    'Gone' as option_b,
    'Went' as option_c,
    'Going' as option_d,
    'C' as correct_answer,
    'The past tense of "go" is "went".' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/generic/generic_q2_', e.id, '.mp3') as audio_url,
    CONCAT('/images/generic/generic_q2_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id > 9 OR e.lesson_id IS NULL;

-- Add third question for Generic exercises
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
    'Which word is a verb?' as question_text,
    'multiple_choice' as question_type,
    'Happy' as option_a,
    'Run' as option_b,
    'Beautiful' as option_c,
    'Table' as option_d,
    'B' as correct_answer,
    '"Run" is a verb. The others are adjectives or nouns.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/generic/generic_q3_', e.id, '.mp3') as audio_url,
    CONCAT('/images/generic/generic_q3_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id > 9 OR e.lesson_id IS NULL;

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
