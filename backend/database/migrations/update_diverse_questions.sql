-- SQL Script to ensure all questions within an exercise are diverse and unique
-- Created on July 10, 2025

-- Create backup of questions table
CREATE TABLE IF NOT EXISTS questions_backup_diverse LIKE questions;
INSERT INTO questions_backup_diverse SELECT * FROM questions;

-- Update Exercise 1: Greetings
UPDATE questions 
SET question_text = 'Which phrase do you use to greet someone in the morning?',
    option_a = 'Good morning',
    option_b = 'Good afternoon', 
    option_c = 'Good evening', 
    option_d = 'Good night',
    correct_answer = 'A',
    explanation = 'Good morning is used to greet someone in the morning hours.'
WHERE exercise_id = 1 AND question_order = 1;

UPDATE questions 
SET question_text = 'What do you say when saying goodbye to someone?',
    option_a = 'Hello',
    option_b = 'Goodbye', 
    option_c = 'Thank you', 
    option_d = 'Excuse me',
    correct_answer = 'B',
    explanation = 'Goodbye is used when parting ways with someone.'
WHERE exercise_id = 1 AND question_order = 2;

UPDATE questions 
SET question_text = 'Which phrase expresses gratitude in English?',
    option_a = 'Sorry',
    option_b = 'Excuse me', 
    option_c = 'Thank you', 
    option_d = 'Hello',
    correct_answer = 'C',
    explanation = 'Thank you is used to express gratitude or appreciation.'
WHERE exercise_id = 1 AND question_order = 3;

-- Update Exercise 2: Numbers
UPDATE questions 
SET question_text = 'How do you write the number 1 in English?',
    option_a = 'One',
    option_b = 'Two', 
    option_c = 'Three', 
    option_d = 'Four',
    correct_answer = 'A',
    explanation = 'One is the written form of the number 1.'
WHERE exercise_id = 2 AND question_order = 1;

UPDATE questions 
SET question_text = 'Which number comes after "nine"?',
    option_a = 'Eight',
    option_b = 'Ten', 
    option_c = 'Seven', 
    option_d = 'Eleven',
    correct_answer = 'B',
    explanation = 'Ten comes after nine in the number sequence.'
WHERE exercise_id = 2 AND question_order = 2;

UPDATE questions 
SET question_text = 'Which of these numbers is the largest?',
    option_a = '15',
    option_b = '51', 
    option_c = '25', 
    option_d = '5',
    correct_answer = 'B',
    explanation = '51 is larger than 15, 25, and 5.'
WHERE exercise_id = 2 AND question_order = 3;

-- Update Exercise 3: Colors
UPDATE questions 
SET question_text = 'What color is the sky on a clear day?',
    option_a = 'Blue',
    option_b = 'Green', 
    option_c = 'Red', 
    option_d = 'Yellow',
    correct_answer = 'A',
    explanation = 'The sky appears blue on a clear day.'
WHERE exercise_id = 3 AND question_order = 1;

UPDATE questions 
SET question_text = 'What color is a ripe banana?',
    option_a = 'Green',
    option_b = 'Yellow', 
    option_c = 'Red', 
    option_d = 'Brown',
    correct_answer = 'B',
    explanation = 'A ripe banana is typically yellow in color.'
WHERE exercise_id = 3 AND question_order = 2;

UPDATE questions 
SET question_text = 'Which color is associated with stopping at traffic lights?',
    option_a = 'Yellow',
    option_b = 'Green', 
    option_c = 'Red', 
    option_d = 'Blue',
    correct_answer = 'C',
    explanation = 'Red means stop at traffic lights.'
WHERE exercise_id = 3 AND question_order = 3;

-- Update Exercise 4: Family
UPDATE questions 
SET question_text = 'Who is your father\'s sister?',
    option_a = 'Mother',
    option_b = 'Sister', 
    option_c = 'Aunt', 
    option_d = 'Cousin',
    correct_answer = 'C',
    explanation = 'Your father\'s sister is your aunt.'
WHERE exercise_id = 4 AND question_order = 1;

UPDATE questions 
SET question_text = 'What do you call your parents\' male child who is not you?',
    option_a = 'Sister',
    option_b = 'Brother', 
    option_c = 'Cousin', 
    option_d = 'Uncle',
    correct_answer = 'B',
    explanation = 'Your parents\' other male child is your brother.'
WHERE exercise_id = 4 AND question_order = 2;

UPDATE questions 
SET question_text = 'What do you call your mother\'s father?',
    option_a = 'Father',
    option_b = 'Uncle', 
    option_c = 'Grandfather', 
    option_d = 'Brother',
    correct_answer = 'C',
    explanation = 'Your mother\'s father is your grandfather.'
WHERE exercise_id = 4 AND question_order = 3;

-- Update Exercise 5: Food
UPDATE questions 
SET question_text = 'What is a common breakfast food?',
    option_a = 'Cereal',
    option_b = 'Steak', 
    option_c = 'Pizza', 
    option_d = 'Cake',
    correct_answer = 'A',
    explanation = 'Cereal is a common breakfast food in many countries.'
WHERE exercise_id = 5 AND question_order = 1;

UPDATE questions 
SET question_text = 'Which of these is a fruit?',
    option_a = 'Carrot',
    option_b = 'Apple', 
    option_c = 'Potato', 
    option_d = 'Onion',
    correct_answer = 'B',
    explanation = 'An apple is a fruit, while the others are vegetables.'
WHERE exercise_id = 5 AND question_order = 2;

UPDATE questions 
SET question_text = 'What do you drink when you are thirsty?',
    option_a = 'Water',
    option_b = 'Sand', 
    option_c = 'Salt', 
    option_d = 'Stone',
    correct_answer = 'A',
    explanation = 'Water is what people typically drink when they are thirsty.'
WHERE exercise_id = 5 AND question_order = 3;

-- Continue with other exercises...
-- Exercise 6: Languages
UPDATE questions 
SET question_text = 'What is the most widely spoken language in the world?',
    option_a = 'English',
    option_b = 'Mandarin', 
    option_c = 'Spanish', 
    option_d = 'Hindi',
    correct_answer = 'B',
    explanation = 'Mandarin Chinese has the most native speakers in the world.'
WHERE exercise_id = 6 AND question_order = 1;

UPDATE questions 
SET question_text = 'What is the main language spoken in Brazil?',
    option_a = 'Spanish',
    option_b = 'Portuguese', 
    option_c = 'English', 
    option_d = 'French',
    correct_answer = 'B',
    explanation = 'Portuguese is the official language of Brazil.'
WHERE exercise_id = 6 AND question_order = 2;

UPDATE questions 
SET question_text = 'Which language uses the Cyrillic alphabet?',
    option_a = 'Russian',
    option_b = 'German', 
    option_c = 'Arabic', 
    option_d = 'Hindi',
    correct_answer = 'A',
    explanation = 'Russian uses the Cyrillic alphabet.'
WHERE exercise_id = 6 AND question_order = 3;

-- Exercise 7: Travel
UPDATE questions 
SET question_text = 'What is the capital of Japan?',
    option_a = 'Beijing',
    option_b = 'Seoul', 
    option_c = 'Tokyo', 
    option_d = 'Bangkok',
    correct_answer = 'C',
    explanation = 'Tokyo is the capital of Japan.'
WHERE exercise_id = 7 AND question_order = 1;

UPDATE questions 
SET question_text = 'What document do you need to travel to another country?',
    option_a = 'ID card',
    option_b = 'Passport', 
    option_c = 'Driver\'s license', 
    option_d = 'Credit card',
    correct_answer = 'B',
    explanation = 'A passport is required for international travel.'
WHERE exercise_id = 7 AND question_order = 2;

UPDATE questions 
SET question_text = 'Where do airplanes take off and land?',
    option_a = 'Airport',
    option_b = 'Train station', 
    option_c = 'Bus terminal', 
    option_d = 'Harbor',
    correct_answer = 'A',
    explanation = 'Airplanes take off and land at airports.'
WHERE exercise_id = 7 AND question_order = 3;

-- Add a verification query at the end to show the changes
SELECT 
    e.title AS exercise_title,
    q.question_order,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_answer,
    q.explanation
FROM 
    questions q
JOIN 
    exercises e ON q.exercise_id = e.id
WHERE 
    e.id IN (1, 2, 3, 4, 5, 6, 7)
ORDER BY 
    e.id, q.question_order;

-- Create an index to improve query performance on the questions table
CREATE INDEX IF NOT EXISTS idx_questions_exercise_order ON questions (exercise_id, question_order); 