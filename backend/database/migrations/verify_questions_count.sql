-- SQL script to verify that all exercises have multiple questions
-- Run this after applying the add_multiple_questions_to_exercises.sql script

-- Check question count per exercise
SELECT exercise_id, COUNT(*) as question_count
FROM questions
GROUP BY exercise_id
ORDER BY question_count;

-- Verify that no exercise has fewer than 6 questions
SELECT 
    COUNT(*) as exercises_with_few_questions
FROM 
    (SELECT 
        exercise_id, COUNT(*) as question_count
     FROM 
        questions
     GROUP BY 
        exercise_id
     HAVING 
        question_count < 6
    ) as subquery;

-- If the above query returns 0, then all exercises have at least 6 questions!

-- Verify that all questions have the correct question_order values
SELECT 
    exercise_id, 
    question_order, 
    COUNT(*) as count_per_order
FROM 
    questions
GROUP BY 
    exercise_id, question_order
HAVING 
    count_per_order > 1
ORDER BY 
    exercise_id, question_order;

-- If the above query returns no rows, then all question_order values are correct!

-- Verify that the correct_answer values match between exercises and questions
SELECT 
    e.id as exercise_id, 
    e.correct_answer as exercise_correct_answer,
    q.id as question_id,
    q.correct_answer as question_correct_answer
FROM 
    exercises e
JOIN 
    questions q ON e.id = q.exercise_id
WHERE 
    e.correct_answer != q.correct_answer;

-- If the above query returns no rows, then all correct_answer values match!
