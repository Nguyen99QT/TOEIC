-- SQL Script to update questions with audio and image files
-- Updates the questions table with appropriate audio_url and image_url values
-- Based on exercise_id and question_order

-- First, create a backup of the questions table (recommended)
-- CREATE TABLE questions_backup AS SELECT * FROM questions;

-- Update questions for Exercise 1 (Greetings)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex1.mp3',
    image_url = '/files/images/exercises/ex1.jpg'
WHERE exercise_id = 1 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex2.mp3',
    image_url = '/files/images/exercises/ex2.jpg'
WHERE exercise_id = 1 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex3.mp3',
    image_url = '/files/images/exercises/ex3.jpg'
WHERE exercise_id = 1 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex4.mp3',
    image_url = '/files/images/exercises/ex4.jpg'
WHERE exercise_id = 1 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex5.mp3',
    image_url = '/files/images/exercises/ex5.jpg'
WHERE exercise_id = 1 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex6.mp3',
    image_url = '/files/images/exercises/ex6.jpg'
WHERE exercise_id = 1 AND question_order = 6;

-- Update questions for Exercise 2 (Capitals)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex7.mp3',
    image_url = '/files/images/exercises/ex7.jpg'
WHERE exercise_id = 2 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex8.mp3',
    image_url = '/files/images/exercises/ex8.jpg'
WHERE exercise_id = 2 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex9.mp3',
    image_url = '/files/images/exercises/ex9.jpg'
WHERE exercise_id = 2 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex10.mp3',
    image_url = '/files/images/exercises/ex10.jpg'
WHERE exercise_id = 2 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex11.mp3',
    image_url = '/files/images/exercises/ex11.jpg'
WHERE exercise_id = 2 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex12.mp3',
    image_url = '/files/images/exercises/ex12.jpg'
WHERE exercise_id = 2 AND question_order = 6;

-- Update questions for Exercise 3 (Colors)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex13.mp3',
    image_url = '/files/images/exercises/ex13.jpg'
WHERE exercise_id = 3 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex14.mp3',
    image_url = '/files/images/exercises/ex14.jpg'
WHERE exercise_id = 3 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex15.mp3',
    image_url = '/files/images/exercises/ex15.jpg'
WHERE exercise_id = 3 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex16.mp3',
    image_url = '/files/images/exercises/ex16.jpg'
WHERE exercise_id = 3 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex17.mp3',
    image_url = '/files/images/exercises/ex17.jpg'
WHERE exercise_id = 3 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex18.mp3',
    image_url = '/files/images/exercises/ex18.jpg'
WHERE exercise_id = 3 AND question_order = 6;

-- Update questions for Exercise 4 (Opposites)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex19.mp3',
    image_url = '/files/images/exercises/ex19.jpg'
WHERE exercise_id = 4 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex20.mp3',
    image_url = '/files/images/exercises/ex20.jpg'
WHERE exercise_id = 4 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex21.mp3',
    image_url = '/files/images/exercises/ex21.jpg'
WHERE exercise_id = 4 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex22.mp3',
    image_url = '/files/images/exercises/ex22.jpg'
WHERE exercise_id = 4 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex23.mp3',
    image_url = '/files/images/exercises/ex23.jpg'
WHERE exercise_id = 4 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex24.mp3',
    image_url = '/files/images/exercises/ex24.jpg'
WHERE exercise_id = 4 AND question_order = 6;

-- Update questions for Exercise 5 (General Knowledge)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex25.mp3',
    image_url = '/files/images/exercises/ex25.jpg'
WHERE exercise_id = 5 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex26.mp3',
    image_url = '/files/images/exercises/ex26.jpg'
WHERE exercise_id = 5 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex27.mp3',
    image_url = '/files/images/exercises/ex27.jpg'
WHERE exercise_id = 5 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex28.mp3',
    image_url = '/files/images/exercises/ex28.jpg'
WHERE exercise_id = 5 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex29.mp3',
    image_url = '/files/images/exercises/ex29.jpg'
WHERE exercise_id = 5 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex30.mp3',
    image_url = '/files/images/exercises/ex30.jpg'
WHERE exercise_id = 5 AND question_order = 6;

-- Update questions for Exercise 6 (Languages)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex31.mp3',
    image_url = '/files/images/exercises/ex31.jpg'
WHERE exercise_id = 6 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex32.mp3',
    image_url = '/files/images/exercises/ex32.jpg'
WHERE exercise_id = 6 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex33.mp3',
    image_url = '/files/images/exercises/ex33.jpg'
WHERE exercise_id = 6 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex34.mp3',
    image_url = '/files/images/exercises/ex34.jpg'
WHERE exercise_id = 6 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex35.mp3',
    image_url = '/files/images/exercises/ex35.jpg'
WHERE exercise_id = 6 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex36.mp3',
    image_url = '/files/images/exercises/ex36.jpg'
WHERE exercise_id = 6 AND question_order = 6;

-- Update questions for Exercise 7 (Transport)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex37.mp3',
    image_url = '/files/images/exercises/ex37.jpg'
WHERE exercise_id = 7 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex38.mp3',
    image_url = '/files/images/exercises/ex38.jpg'
WHERE exercise_id = 7 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex39.mp3',
    image_url = '/files/images/exercises/ex39.jpg'
WHERE exercise_id = 7 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex40.mp3',
    image_url = '/files/images/exercises/ex40.jpg'
WHERE exercise_id = 7 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex41.mp3',
    image_url = '/files/images/exercises/ex41.jpg'
WHERE exercise_id = 7 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex42.mp3',
    image_url = '/files/images/exercises/ex42.jpg'
WHERE exercise_id = 7 AND question_order = 6;

-- Update questions for Exercise 8 (Technology)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex43.mp3',
    image_url = '/files/images/exercises/ex43.jpg'
WHERE exercise_id = 8 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex44.mp3',
    image_url = '/files/images/exercises/ex44.jpg'
WHERE exercise_id = 8 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex45.mp3',
    image_url = '/files/images/exercises/ex45.jpg'
WHERE exercise_id = 8 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex46.mp3',
    image_url = '/files/images/exercises/ex46.jpg'
WHERE exercise_id = 8 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex47.mp3',
    image_url = '/files/images/exercises/ex47.jpg'
WHERE exercise_id = 8 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex48.mp3',
    image_url = '/files/images/exercises/ex48.jpg'
WHERE exercise_id = 8 AND question_order = 6;

-- Update questions for Exercise 9 (Food and Dining)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex49.mp3',
    image_url = '/files/images/exercises/ex49.jpg'
WHERE exercise_id = 9 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex50.mp3',
    image_url = '/files/images/exercises/ex50.jpg'
WHERE exercise_id = 9 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex51.mp3',
    image_url = '/files/images/exercises/ex51.jpg'
WHERE exercise_id = 9 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex52.mp3',
    image_url = '/files/images/exercises/ex52.jpg'
WHERE exercise_id = 9 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex53.mp3',
    image_url = '/files/images/exercises/ex53.jpg'
WHERE exercise_id = 9 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex54.mp3',
    image_url = '/files/images/exercises/ex54.jpg'
WHERE exercise_id = 9 AND question_order = 6;

-- Update questions for Exercise 10 (Weather)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex55.mp3',
    image_url = '/files/images/exercises/ex55.jpg'
WHERE exercise_id = 10 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex56.mp3',
    image_url = '/files/images/exercises/ex56.jpg'
WHERE exercise_id = 10 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex57.mp3',
    image_url = '/files/images/exercises/ex57.jpg'
WHERE exercise_id = 10 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex58.mp3',
    image_url = '/files/images/exercises/ex58.jpg'
WHERE exercise_id = 10 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex59.mp3',
    image_url = '/files/images/exercises/ex59.jpg'
WHERE exercise_id = 10 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex60.mp3',
    image_url = '/files/images/exercises/ex60.jpg'
WHERE exercise_id = 10 AND question_order = 6;

-- Update questions for Exercise 11 (Numbers and Counting)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex61.mp3',
    image_url = '/files/images/exercises/ex61.jpg'
WHERE exercise_id = 11 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex62.mp3',
    image_url = '/files/images/exercises/ex62.jpg'
WHERE exercise_id = 11 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex63.mp3',
    image_url = '/files/images/exercises/ex63.jpg'
WHERE exercise_id = 11 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex64.mp3',
    image_url = '/files/images/exercises/ex64.jpg'
WHERE exercise_id = 11 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex65.mp3',
    image_url = '/files/images/exercises/ex65.jpg'
WHERE exercise_id = 11 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex66.mp3',
    image_url = '/files/images/exercises/ex66.jpg'
WHERE exercise_id = 11 AND question_order = 6;

-- Update questions for Exercise 12 (Time and Date)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex67.mp3',
    image_url = '/files/images/exercises/ex67.jpg'
WHERE exercise_id = 12 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex68.mp3',
    image_url = '/files/images/exercises/ex68.jpg'
WHERE exercise_id = 12 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex69.mp3',
    image_url = '/files/images/exercises/ex69.jpg'
WHERE exercise_id = 12 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex70.mp3',
    image_url = '/files/images/exercises/ex70.jpg'
WHERE exercise_id = 12 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex71.mp3',
    image_url = '/files/images/exercises/ex71.jpg'
WHERE exercise_id = 12 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex72.mp3',
    image_url = '/files/images/exercises/ex72.jpg'
WHERE exercise_id = 12 AND question_order = 6;

-- Update questions for Exercise 13 (Office Environment)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex73.mp3',
    image_url = '/files/images/exercises/ex73.jpg'
WHERE exercise_id = 13 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex74.mp3',
    image_url = '/files/images/exercises/ex74.jpg'
WHERE exercise_id = 13 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex75.mp3',
    image_url = '/files/images/exercises/ex75.jpg'
WHERE exercise_id = 13 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex76.mp3',
    image_url = '/files/images/exercises/ex76.jpg'
WHERE exercise_id = 13 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex77.mp3',
    image_url = '/files/images/exercises/ex77.jpg'
WHERE exercise_id = 13 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex78.mp3',
    image_url = '/files/images/exercises/ex78.jpg'
WHERE exercise_id = 13 AND question_order = 6;

-- Update questions for Exercise 14 (Travel and Tourism)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex79.mp3',
    image_url = '/files/images/exercises/ex79.jpg'
WHERE exercise_id = 14 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex80.mp3',
    image_url = '/files/images/exercises/ex80.jpg'
WHERE exercise_id = 14 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex81.mp3',
    image_url = '/files/images/exercises/ex81.jpg'
WHERE exercise_id = 14 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex82.mp3',
    image_url = '/files/images/exercises/ex82.jpg'
WHERE exercise_id = 14 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex83.mp3',
    image_url = '/files/images/exercises/ex83.jpg'
WHERE exercise_id = 14 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex84.mp3',
    image_url = '/files/images/exercises/ex84.jpg'
WHERE exercise_id = 14 AND question_order = 6;

-- Update questions for Exercise 15 (Health and Fitness)
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex85.mp3',
    image_url = '/files/images/exercises/ex85.jpg'
WHERE exercise_id = 15 AND question_order = 1;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex86.mp3',
    image_url = '/files/images/exercises/ex86.jpg'
WHERE exercise_id = 15 AND question_order = 2;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex87.mp3',
    image_url = '/files/images/exercises/ex87.jpg'
WHERE exercise_id = 15 AND question_order = 3;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex88.mp3',
    image_url = '/files/images/exercises/ex88.jpg'
WHERE exercise_id = 15 AND question_order = 4;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex89.mp3',
    image_url = '/files/images/exercises/ex89.jpg'
WHERE exercise_id = 15 AND question_order = 5;

UPDATE questions 
SET audio_url = '/files/audio/exercises/ex90.mp3',
    image_url = '/files/images/exercises/ex90.jpg'
WHERE exercise_id = 15 AND question_order = 6;
