-- Fix question 1208 in part 2
-- This question has invalid data: questionText = "abc" and options with null values

-- First, let's check current data
SELECT 'Current question 1208 data:' as info;
SELECT * FROM question_group WHERE group_id = 1208;

-- Update the question text to be a proper Part 2 question
UPDATE question_group 
SET 
    title = 'What time does the conference begin?',
    audio_url = '/uploads/audio/sample_part2_audio.mp3',
    description = 'Part 2 - Question Response'
WHERE group_id = 1208;

-- Check options for this question (using question_id instead of group_id)
SELECT 'Current options for question 1208:' as info;
SELECT * FROM option WHERE question_id = 1208;

-- Update options to have proper values
UPDATE option SET label = 'A', content = 'At 9 AM' WHERE option_id = 709;
UPDATE option SET label = 'B', content = 'In the conference room' WHERE option_id = 710;
UPDATE option SET label = 'C', content = 'Next Monday' WHERE option_id = 711;
UPDATE option SET label = 'D', content = 'It starts promptly' WHERE option_id = 712;

-- Verify the fix
SELECT 'Fixed question 1208 data:' as info;
SELECT * FROM question_group WHERE group_id = 1208;
SELECT * FROM option WHERE question_id = 1208;
