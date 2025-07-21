#!/usr/bin/env python
import os

def generate_additional_questions_sql():
    """
    Generates SQL to add additional questions for exercises that have only one question.
    
    This script analyzes the current state of exercises and questions tables,
    identifies exercises with only one question, and generates SQL statements
    to add additional questions while maintaining consistency with the exercise data.
    """
    
    # Output file path
    output_sql_path = 'database/migrations/add_multiple_questions_to_exercises.sql'
    
    # SQL header
    sql_output = """-- SQL Script to add multiple questions for exercises with only one question
-- Generated on August 5, 2023
-- This script identifies exercises with only one question and adds more questions
-- to ensure consistent progress calculation and better user experience

-- First, create a backup of the questions table (recommended)
CREATE TABLE IF NOT EXISTS questions_backup LIKE questions;
INSERT INTO questions_backup SELECT * FROM questions;

-- Check current question count per exercise
SELECT exercise_id, COUNT(*) as question_count
FROM questions
GROUP BY exercise_id
HAVING question_count = 1;

-- Insert additional questions for exercises that have only one question
"""
    
    # SQL to identify exercises with only one question
    sql_find_single_question_exercises = """
-- Identify exercises with only one question
SET @row_number = 0;
DROP TEMPORARY TABLE IF EXISTS single_question_exercises;
CREATE TEMPORARY TABLE single_question_exercises AS
SELECT 
    e.id AS exercise_id, 
    e.title, 
    e.question, 
    e.options, 
    e.correct_answer, 
    e.explanation, 
    e.difficulty_level, 
    e.points, 
    e.is_active, 
    e.audio_url, 
    e.image_url,
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
"""
    
    sql_output += sql_find_single_question_exercises
    
    # SQL to generate 5 additional questions for each exercise with only one question
    sql_generate_additional_questions = """
-- Generate 5 additional questions for each exercise with only one question

-- Question variant 2: Slightly modified question
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
    CONCAT(question, ' (Variant 1)') as question_text,
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
    single_question_exercises;

-- Question variant 3: Reversed question (what is the answer for...)
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
    CONCAT('What is the answer for: ', question, '?') as question_text,
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

-- Question variant 4: Reworded question
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
    CONCAT('Choose the correct answer for this question: ', question) as question_text,
    question_type,
    TRIM(REPLACE(option_a, 'A. ', '')) as option_a,
    TRIM(REPLACE(option_b, 'B. ', '')) as option_b,
    TRIM(REPLACE(option_c, 'C. ', '')) as option_c,
    TRIM(REPLACE(option_d, 'D. ', '')) as option_d,
    correct_answer,
    explanation,
    difficulty_level,
    points,
    4 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises;

-- Question variant 5: Based on explanation
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
    CONCAT('Based on the context, select the most appropriate answer: ', question) as question_text,
    question_type,
    TRIM(REPLACE(option_a, 'A. ', '')) as option_a,
    TRIM(REPLACE(option_b, 'B. ', '')) as option_b,
    TRIM(REPLACE(option_c, 'C. ', '')) as option_c,
    TRIM(REPLACE(option_d, 'D. ', '')) as option_d,
    correct_answer,
    explanation,
    difficulty_level,
    points,
    5 as question_order,
    is_active,
    audio_url,
    image_url
FROM 
    single_question_exercises;

-- Question variant 6: Practice question
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
    CONCAT('Practice Question: ', question) as question_text,
    question_type,
    TRIM(REPLACE(option_a, 'A. ', '')) as option_a,
    TRIM(REPLACE(option_b, 'B. ', '')) as option_b,
    TRIM(REPLACE(option_c, 'C. ', '')) as option_c,
    TRIM(REPLACE(option_d, 'D. ', '')) as option_d,
    correct_answer,
    explanation,
    difficulty_level,
    points,
    6 as question_order,
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

-- Verify the results
SELECT exercise_id, COUNT(*) as question_count
FROM questions
GROUP BY exercise_id
ORDER BY question_count;

-- Drop temporary table
DROP TEMPORARY TABLE IF EXISTS single_question_exercises;
"""
    
    sql_output += sql_generate_additional_questions
    
    # Write SQL to output file
    os.makedirs(os.path.dirname(output_sql_path), exist_ok=True)
    with open(output_sql_path, 'w', encoding='utf-8') as f:
        f.write(sql_output)
    
    print(f"SQL script generated at {output_sql_path}")

if __name__ == "__main__":
    generate_additional_questions_sql()
    print("SQL generation complete!")
