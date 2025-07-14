-- SQL Script to update exercises with topic-related questions
-- Generated on July 10, 2025
-- This script ensures each exercise has 3 questions based on lesson themes
-- with proper audio and image resource paths

-- Audio and image paths follow these patterns:
-- Audio files: /audio/[topic]/[specific_concept]_[exercise_id].mp3
-- Image files: /images/[topic]/[specific_concept]_[exercise_id].jpg
-- Example: /audio/greetings/greeting_hello_45.mp3, /images/colors/color_banana_22.jpg

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

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
-- Update the question_order of the original questions for Greetings to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/greetings/greeting_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/greetings/greeting_main_', e.id, '.jpg')
WHERE e.lesson_id = 1
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Greetings exercises
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
WHERE 
    e.lesson_id = 1
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Greetings exercises
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
WHERE 
    e.lesson_id = 1
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Greetings lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added greeting questions' FROM exercises e
WHERE e.lesson_id = 1
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 2: NUMBERS
-- ======================================================================
-- Update the question_order of the original questions for Numbers to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/numbers/number_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/numbers/number_main_', e.id, '.jpg')
WHERE e.lesson_id = 2
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Numbers exercises
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
WHERE 
    e.lesson_id = 2
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Numbers exercises
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
WHERE 
    e.lesson_id = 2
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Numbers lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added number questions' FROM exercises e
WHERE e.lesson_id = 2
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 3: COLORS
-- ======================================================================
-- Update the question_order of the original questions for Colors to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/colors/color_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/colors/color_main_', e.id, '.jpg')
WHERE e.lesson_id = 3
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Colors exercises
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
WHERE 
    e.lesson_id = 3
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Colors exercises
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
WHERE 
    e.lesson_id = 3
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Colors lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added color questions' FROM exercises e
WHERE e.lesson_id = 3
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 4: FAMILY
-- ======================================================================
-- Update the question_order of the original questions for Family to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/family/family_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/family/family_main_', e.id, '.jpg')
WHERE e.lesson_id = 4
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Family exercises
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
WHERE 
    e.lesson_id = 4
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Family exercises
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
WHERE 
    e.lesson_id = 4
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Family lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added family questions' FROM exercises e
WHERE e.lesson_id = 4
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 5: FOOD
-- ======================================================================
-- Update the question_order of the original questions for Food to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/food/food_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/food/food_main_', e.id, '.jpg')
WHERE e.lesson_id = 5
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Food exercises
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
WHERE 
    e.lesson_id = 5
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Food exercises
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
WHERE 
    e.lesson_id = 5
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Food lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added food questions' FROM exercises e
WHERE e.lesson_id = 5
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 6: BUSINESS
-- ======================================================================
-- Update the question_order of the original questions for Business to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/business/business_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/business/business_main_', e.id, '.jpg')
WHERE e.lesson_id = 6
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Business exercises
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
    'What do you call a formal meeting between two business representatives?' as question_text,
    'multiple_choice' as question_type,
    'Conference' as option_a,
    'Party' as option_b,
    'Lunch' as option_c,
    'Trip' as option_d,
    'A' as correct_answer,
    'A formal meeting between business representatives is called a conference.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/business/business_meeting_', e.id, '.mp3') as audio_url,
    CONCAT('/images/business/business_meeting_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 6
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Business exercises
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
    'Which of these is a common business document?' as question_text,
    'multiple_choice' as question_type,
    'Invoice' as option_a,
    'Novel' as option_b,
    'Magazine' as option_c,
    'Menu' as option_d,
    'A' as correct_answer,
    'An invoice is a common business document used for billing.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/business/business_document_', e.id, '.mp3') as audio_url,
    CONCAT('/images/business/business_document_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 6
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Business lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added business questions' FROM exercises e
WHERE e.lesson_id = 6
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 7: TRAVEL
-- ======================================================================
-- Update the question_order of the original questions for Travel to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/travel/travel_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/travel/travel_main_', e.id, '.jpg')
WHERE e.lesson_id = 7
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Travel exercises
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
    'Where would you go to board a plane?' as question_text,
    'multiple_choice' as question_type,
    'Airport' as option_a,
    'Train station' as option_b,
    'Bus stop' as option_c,
    'Harbor' as option_d,
    'A' as correct_answer,
    'You go to an airport to board a plane.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/travel/travel_airport_', e.id, '.mp3') as audio_url,
    CONCAT('/images/travel/travel_airport_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 7
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Travel exercises
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
    'Passport' as option_a,
    'Driver\'s license' as option_b,
    'Credit card' as option_c,
    'Library card' as option_d,
    'A' as correct_answer,
    'You need a passport to travel to another country.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/travel/travel_passport_', e.id, '.mp3') as audio_url,
    CONCAT('/images/travel/travel_passport_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 7
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Travel lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added travel questions' FROM exercises e
WHERE e.lesson_id = 7
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- LESSON 8: OFFICE
-- ======================================================================
-- Update the question_order of the original questions for Office to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/office/office_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/office/office_main_', e.id, '.jpg')
WHERE e.lesson_id = 8
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for Office exercises
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
    'What do you use to write on paper in an office?' as question_text,
    'multiple_choice' as question_type,
    'Pen' as option_a,
    'Mouse' as option_b,
    'Keyboard' as option_c,
    'Stapler' as option_d,
    'A' as correct_answer,
    'You use a pen to write on paper in an office.' as explanation,
    e.difficulty_level,
    e.points,
    2 as question_order,
    e.is_active,
    CONCAT('/audio/office/office_pen_', e.id, '.mp3') as audio_url,
    CONCAT('/images/office/office_pen_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 8
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for Office exercises
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
    'Where do you store paper documents in an office?' as question_text,
    'multiple_choice' as question_type,
    'File cabinet' as option_a,
    'Refrigerator' as option_b,
    'Closet' as option_c,
    'Drawer' as option_d,
    'A' as correct_answer,
    'Paper documents are typically stored in a file cabinet in an office.' as explanation,
    e.difficulty_level,
    e.points,
    3 as question_order,
    e.is_active,
    CONCAT('/audio/office/office_filing_', e.id, '.mp3') as audio_url,
    CONCAT('/images/office/office_filing_', e.id, '.jpg') as image_url,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    exercises e
WHERE 
    e.lesson_id = 8
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for Office lesson
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added office questions' FROM exercises e
WHERE e.lesson_id = 8
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- ======================================================================
-- GENERIC LESSONS (other lesson IDs)
-- ======================================================================
-- Update the question_order of the original questions for generic lessons to 1
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.question_order = 1,
    q.audio_url = CONCAT('/audio/generic/generic_main_', e.id, '.mp3'),
    q.image_url = CONCAT('/images/generic/generic_main_', e.id, '.jpg')
WHERE e.lesson_id NOT IN (1, 2, 3, 4, 5, 6, 7, 8)
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Insert second question for generic exercises
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
WHERE 
    e.lesson_id NOT IN (1, 2, 3, 4, 5, 6, 7, 8)
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Insert third question for generic exercises
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
WHERE 
    e.lesson_id NOT IN (1, 2, 3, 4, 5, 6, 7, 8)
    AND e.id IN (
        SELECT exercise_id 
        FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
    );

-- Log the update for generic lessons
INSERT INTO question_update_log (exercise_id, action)
SELECT e.id, 'Added generic questions' FROM exercises e
WHERE e.lesson_id NOT IN (1, 2, 3, 4, 5, 6, 7, 8)
AND e.id IN (
    SELECT exercise_id 
    FROM (SELECT exercise_id, COUNT(*) as count FROM questions GROUP BY exercise_id HAVING count = 1) as single_q
);

-- Make sure all questions have the correct created_at and updated_at timestamps
UPDATE questions 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL;

-- Verify the results
SELECT 
    e.lesson_id, 
    COUNT(DISTINCT e.id) as exercise_count, 
    COUNT(q.id) as question_count,
    COUNT(q.id) / COUNT(DISTINCT e.id) as avg_questions_per_exercise
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
VALUES (0, CONCAT('Update completed. Added questions for exercises with 1 question. Total updated: ', 
    (SELECT COUNT(*) FROM (
        SELECT exercise_id, COUNT(*) as count 
        FROM questions 
        GROUP BY exercise_id 
        HAVING count > 1
    ) as multi_q)
));
