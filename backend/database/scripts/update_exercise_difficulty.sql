-- SQL script to update the difficulty levels of exercises 5-8
-- Run this after questions_restructured.sql to set the difficulty level of the exercises

-- Update Exercise 4 (Opposites) to Medium difficulty
UPDATE exercises SET difficulty_level = 'medium' WHERE id = 4;
-- Update Exercise 5 (Numbers & Science) to Medium difficulty
UPDATE exercises SET difficulty_level = 'medium' WHERE id = 5;

-- Update Exercise 6 (Languages) to Medium difficulty
UPDATE exercises SET difficulty_level = 'medium' WHERE id = 6;

-- Update Exercise 7 (World Capitals - Asia & Others) to Hard difficulty
UPDATE exercises SET difficulty_level = 'hard' WHERE id = 7;

-- Update Exercise 8 (Food & Cooking) to Hard difficulty
UPDATE exercises SET difficulty_level = 'hard' WHERE id = 8;

-- Make sure the first 4 exercises are set to easy difficulty for consistency
UPDATE exercises SET difficulty_level = 'easy' WHERE id IN (1, 2, 3, 4);

-- Also update the points accordingly
UPDATE exercises SET points = 15 WHERE difficulty_level = 'medium';
UPDATE exercises SET points = 20 WHERE difficulty_level = 'hard';
UPDATE exercises SET points = 10 WHERE difficulty_level = 'easy';

-- Display updated exercises with their difficulty levels
SELECT id, title, difficulty_level, points FROM exercises ORDER BY id;
