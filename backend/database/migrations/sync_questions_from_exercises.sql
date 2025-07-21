-- SQL Script to synchronize questions with exercises data
-- This script updates question_text, audio_url, image_url, and option fields in the questions table
-- based on corresponding data in the exercises table

-- First, create a backup of the questions table (recommended)
-- CREATE TABLE questions_backup AS SELECT * FROM questions;

-- Update Exercise 1 questions
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET 
    q.question_text = e.question,
    q.audio_url = CONCAT('/files/audio/', e.audio_url),
    q.image_url = CONCAT('/files/images/', e.image_url),
    q.option_a = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')),
    q.option_b = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')),
    q.option_c = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')),
    q.option_d = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')),
    q.correct_answer = e.correct_answer,
    q.explanation = e.explanation
WHERE q.exercise_id = 1 AND q.question_order = 1 AND e.id = 1;

UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET 
    q.question_text = e.question,
    q.audio_url = CONCAT('/files/audio/', e.audio_url),
    q.image_url = CONCAT('/files/images/', e.image_url),
    q.option_a = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 1), '"', -1),
    q.option_b = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 2), '"', -1),
    q.option_c = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 3), '"', -1),
    q.option_d = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 4), '"', -1)
WHERE q.exercise_id = 1 AND q.question_order = 2 AND e.id = 2;

UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET 
    q.question_text = e.question,
    q.audio_url = CONCAT('/files/audio/', e.audio_url),
    q.image_url = CONCAT('/files/images/', e.image_url),
    q.option_a = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 1), '"', -1),
    q.option_b = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 2), '"', -1),
    q.option_c = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 3), '"', -1),
    q.option_d = SUBSTRING_INDEX(SUBSTRING_INDEX(e.options, '", "', 4), '"', -1)
WHERE q.exercise_id = 1 AND q.question_order = 3 AND e.id = 3;

-- Note: The pattern continues for all 90 exercises...

-- Creating a more efficient alternative using a single statement per exercise
-- This handles all questions for an exercise in one statement

-- Exercise 1 (Questions 1-6)
UPDATE questions q
JOIN (
    SELECT 1 as exercise_id, 
           JSON_EXTRACT(e.options, '$[0]') as opt_a, 
           JSON_EXTRACT(e.options, '$[1]') as opt_b,
           JSON_EXTRACT(e.options, '$[2]') as opt_c,
           JSON_EXTRACT(e.options, '$[3]') as opt_d,
           e.question, 
           CONCAT('/files/audio/', e.audio_url) as audio,
           CONCAT('/files/images/', e.image_url) as image
    FROM exercises e 
    WHERE e.id = 1
) AS ex ON q.exercise_id = ex.exercise_id
SET 
    q.question_text = ex.question,
    q.audio_url = ex.audio,
    q.image_url = ex.image,
    q.option_a = TRIM(BOTH '"' FROM ex.opt_a),
    q.option_b = TRIM(BOTH '"' FROM ex.opt_b),
    q.option_c = TRIM(BOTH '"' FROM ex.opt_c),
    q.option_d = TRIM(BOTH '"' FROM ex.opt_d)
WHERE q.exercise_id = 1;

-- Exercise 2 (Questions 7-12)
UPDATE questions q
JOIN (
    SELECT 2 as exercise_id, 
           JSON_EXTRACT(e.options, '$[0]') as opt_a, 
           JSON_EXTRACT(e.options, '$[1]') as opt_b,
           JSON_EXTRACT(e.options, '$[2]') as opt_c,
           JSON_EXTRACT(e.options, '$[3]') as opt_d,
           e.question, 
           CONCAT('/files/audio/', e.audio_url) as audio,
           CONCAT('/files/images/', e.image_url) as image
    FROM exercises e 
    WHERE e.id = 4
) AS ex ON q.exercise_id = ex.exercise_id
SET 
    q.question_text = ex.question,
    q.audio_url = ex.audio,
    q.image_url = ex.image,
    q.option_a = TRIM(BOTH '"' FROM ex.opt_a),
    q.option_b = TRIM(BOTH '"' FROM ex.opt_b),
    q.option_c = TRIM(BOTH '"' FROM ex.opt_c),
    q.option_d = TRIM(BOTH '"' FROM ex.opt_d)
WHERE q.exercise_id = 2;

-- Exercise 3 (Questions 13-18)
UPDATE questions q
JOIN (
    SELECT 3 as exercise_id, 
           JSON_EXTRACT(e.options, '$[0]') as opt_a, 
           JSON_EXTRACT(e.options, '$[1]') as opt_b,
           JSON_EXTRACT(e.options, '$[2]') as opt_c,
           JSON_EXTRACT(e.options, '$[3]') as opt_d,
           e.question, 
           CONCAT('/files/audio/', e.audio_url) as audio,
           CONCAT('/files/images/', e.image_url) as image
    FROM exercises e 
    WHERE e.id = 7
) AS ex ON q.exercise_id = ex.exercise_id
SET 
    q.question_text = ex.question,
    q.audio_url = ex.audio,
    q.image_url = ex.image,
    q.option_a = TRIM(BOTH '"' FROM ex.opt_a),
    q.option_b = TRIM(BOTH '"' FROM ex.opt_b),
    q.option_c = TRIM(BOTH '"' FROM ex.opt_c),
    q.option_d = TRIM(BOTH '"' FROM ex.opt_d)
WHERE q.exercise_id = 3;

-- Exercise 4 (Questions 19-24)
UPDATE questions q
JOIN (
    SELECT 4 as exercise_id, 
           JSON_EXTRACT(e.options, '$[0]') as opt_a, 
           JSON_EXTRACT(e.options, '$[1]') as opt_b,
           JSON_EXTRACT(e.options, '$[2]') as opt_c,
           JSON_EXTRACT(e.options, '$[3]') as opt_d,
           e.question, 
           CONCAT('/files/audio/', e.audio_url) as audio,
           CONCAT('/files/images/', e.image_url) as image
    FROM exercises e 
    WHERE e.id = 10
) AS ex ON q.exercise_id = ex.exercise_id
SET 
    q.question_text = ex.question,
    q.audio_url = ex.audio,
    q.image_url = ex.image,
    q.option_a = TRIM(BOTH '"' FROM ex.opt_a),
    q.option_b = TRIM(BOTH '"' FROM ex.opt_b),
    q.option_c = TRIM(BOTH '"' FROM ex.opt_c),
    q.option_d = TRIM(BOTH '"' FROM ex.opt_d)
WHERE q.exercise_id = 4;

-- Exercise 5 (Questions 25-30)
UPDATE questions q
JOIN (
    SELECT 5 as exercise_id, 
           JSON_EXTRACT(e.options, '$[0]') as opt_a, 
           JSON_EXTRACT(e.options, '$[1]') as opt_b,
           JSON_EXTRACT(e.options, '$[2]') as opt_c,
           JSON_EXTRACT(e.options, '$[3]') as opt_d,
           e.question, 
           CONCAT('/files/audio/', e.audio_url) as audio,
           CONCAT('/files/images/', e.image_url) as image
    FROM exercises e 
    WHERE e.id = 13
) AS ex ON q.exercise_id = ex.exercise_id
SET 
    q.question_text = ex.question,
    q.audio_url = ex.audio,
    q.image_url = ex.image,
    q.option_a = TRIM(BOTH '"' FROM ex.opt_a),
    q.option_b = TRIM(BOTH '"' FROM ex.opt_b),
    q.option_c = TRIM(BOTH '"' FROM ex.opt_c),
    q.option_d = TRIM(BOTH '"' FROM ex.opt_d)
WHERE q.exercise_id = 5;

-- Continue with more exercises...

-- Alternative approach using a stored procedure to update all questions
-- This will be more maintainable for large number of questions

DELIMITER //
CREATE PROCEDURE update_questions_from_exercises()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE exercise_count INT DEFAULT 15; -- Update with your actual number of exercises
    DECLARE questions_per_exercise INT DEFAULT 6; -- Update with your typical questions per exercise
    
    WHILE i <= exercise_count DO
        SET j = 1;
        WHILE j <= questions_per_exercise DO
            -- Calculate the corresponding exercise id in the exercises table
            -- This mapping needs to be adjusted based on your actual data relationship
            SET @exercise_in_exercises_table = i;
            
            -- Update the question
            UPDATE questions q
            JOIN exercises e ON e.id = @exercise_in_exercises_table
            SET 
                -- Update question text exactly as it appears in the exercises table
                q.question_text = e.question,
                
                -- Update audio and image URLs with correct paths
                q.audio_url = CONCAT('/files/audio/', e.audio_url),
                q.image_url = CONCAT('/files/images/', e.image_url),
                
                -- Update options using JSON extraction to ensure exact matching with exercises
                -- Extract the first option (A) and remove the "A. " prefix if present
                q.option_a = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')),
                
                -- Extract the second option (B) and remove the "B. " prefix if present
                q.option_b = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')),
                
                -- Extract the third option (C) and remove the "C. " prefix if present
                q.option_c = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')),
                
                -- Extract the fourth option (D) and remove the "D. " prefix if present
                q.option_d = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')),
                
                -- Also update the correct answer field to match
                q.correct_answer = e.correct_answer,
                
                -- Update the explanation field as well
                q.explanation = e.explanation
            WHERE q.exercise_id = i AND q.question_order = j;
            
            SET j = j + 1;
        END WHILE;
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- Call the procedure to update all questions
-- CALL update_questions_from_exercises();
-- DROP PROCEDURE IF EXISTS update_questions_from_exercises;

-- Simple direct SQL update for all questions (more efficient)
-- This version properly handles JSON options and extracts question text and options correctly
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET 
    -- Update question text exactly as it appears in the exercises table
    q.question_text = e.question,
    
    -- Update audio and image URLs with correct paths
    q.audio_url = CONCAT('/files/audio/', e.audio_url),
    q.image_url = CONCAT('/files/images/', e.image_url),
    
    -- Update options using JSON extraction to ensure exact matching with exercises
    -- Extract the first option (A) and remove the "A. " prefix if present
    q.option_a = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')), 'A. ', '')),
    
    -- Extract the second option (B) and remove the "B. " prefix if present
    q.option_b = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')), 'B. ', '')),
    
    -- Extract the third option (C) and remove the "C. " prefix if present
    q.option_c = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')), 'C. ', '')),
    
    -- Extract the fourth option (D) and remove the "D. " prefix if present
    q.option_d = TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')), 'D. ', '')),
    
    -- Also update the correct answer field to match
    q.correct_answer = e.correct_answer,
    
    -- Update the explanation field as well
    q.explanation = e.explanation;
