-- Test script to verify JSON extraction from options field
-- This will show how the options are extracted from the exercises table

-- Select a sample exercise to verify extraction
SELECT 
    id,
    question,
    options,
    -- Test JSON extraction
    JSON_EXTRACT(options, '$[0]') AS raw_option_a,
    JSON_UNQUOTE(JSON_EXTRACT(options, '$[0]')) AS unquoted_option_a,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(options, '$[0]')), 'A. ', '')) AS final_option_a,
    
    JSON_EXTRACT(options, '$[1]') AS raw_option_b,
    JSON_UNQUOTE(JSON_EXTRACT(options, '$[1]')) AS unquoted_option_b,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(options, '$[1]')), 'B. ', '')) AS final_option_b,
    
    JSON_EXTRACT(options, '$[2]') AS raw_option_c,
    JSON_UNQUOTE(JSON_EXTRACT(options, '$[2]')) AS unquoted_option_c,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(options, '$[2]')), 'C. ', '')) AS final_option_c,
    
    JSON_EXTRACT(options, '$[3]') AS raw_option_d,
    JSON_UNQUOTE(JSON_EXTRACT(options, '$[3]')) AS unquoted_option_d,
    TRIM(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(options, '$[3]')), 'D. ', '')) AS final_option_d
FROM 
    exercises
LIMIT 5;

-- Compare with some questions
SELECT 
    q.id,
    q.exercise_id,
    q.question_order,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    e.options
FROM 
    questions q
JOIN 
    exercises e ON e.id = q.exercise_id
LIMIT 5;

-- Run this after updating the questions to verify the changes
-- Uncomment this section after running the update scripts
/*
SELECT 
    q.id,
    q.exercise_id,
    q.question_order,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    e.options,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[0]')) AS expected_option_a,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[1]')) AS expected_option_b,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[2]')) AS expected_option_c,
    JSON_UNQUOTE(JSON_EXTRACT(e.options, '$[3]')) AS expected_option_d
FROM 
    questions q
JOIN 
    exercises e ON e.id = q.exercise_id
LIMIT 10;
*/
