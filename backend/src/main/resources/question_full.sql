-- Script cập nhật các câu hỏi để phù hợp với bài tập tương ứng

-- 1. Exercise 1 - Bài tập về chào hỏi (Lesson 1: Greetings)
UPDATE `questions` 
SET `question_text` = 'Which is a common English greeting?',
    `option_a` = 'Hello',
    `option_b` = 'Goodbye',
    `option_c` = 'Thanks',
    `option_d` = 'Please',
    `correct_answer` = 'A',
    `explanation` = 'Hello is a common greeting.',
    `audio_url` = 'exercises/ex1.mp3',
    `image_url` = 'exercises/ex1.jpg'
WHERE `exercise_id` = 1;

-- 2. Exercise 4 - Bài tập về số đếm (Lesson 2: Numbers)
UPDATE `questions` 
SET `question_text` = 'How do you say \"1\" in English?',
    `option_a` = 'One',
    `option_b` = 'Two',
    `option_c` = 'Three',
    `option_d` = 'Four',
    `correct_answer` = 'A',
    `explanation` = 'One is the first number.',
    `audio_url` = 'exercises/ex4.mp3',
    `image_url` = 'exercises/ex4.jpg'
WHERE `exercise_id` = 4;

-- 3. Exercise 7 - Bài tập về màu sắc (Lesson 3: Colors)
UPDATE `questions` 
SET `question_text` = 'What color is the sky on a clear day?',
    `option_a` = 'Blue',
    `option_b` = 'Green',
    `option_c` = 'Red',
    `option_d` = 'Yellow',
    `correct_answer` = 'A',
    `explanation` = 'Blue is the color of the clear sky.',
    `audio_url` = 'exercises/ex7.mp3',
    `image_url` = 'exercises/ex7.jpg'
WHERE `exercise_id` = 7;

-- 4. Exercise 10 - Bài tập về gia đình (Lesson 4: Family)
UPDATE `questions` 
SET `question_text` = 'Who is your brother or sister\'s child?',
    `option_a` = 'Niece',
    `option_b` = 'Nephew',
    `option_c` = 'Cousin',
    `option_d` = 'Sibling',
    `correct_answer` = 'A',
    `explanation` = 'Cousin is the child of your uncle or aunt.',
    `audio_url` = 'exercises/ex10.mp3',
    `image_url` = 'exercises/ex10.jpg'
WHERE `exercise_id` = 10;

-- 5. Exercise 13 - Bài tập về thức ăn (Lesson 5: Food)
UPDATE `questions` 
SET `question_text` = 'What is a common breakfast food?',
    `option_a` = 'Bread',
    `option_b` = 'Shirt',
    `option_c` = 'Car',
    `option_d` = 'House',
    `correct_answer` = 'A',
    `explanation` = 'Bread is a common breakfast food.',
    `audio_url` = 'food/bread.mp3',
    `image_url` = 'exercises/ex13.jpg'
WHERE `exercise_id` = 13;

-- 6. Exercise 16 - Bài tập về sở thích (Lesson 6: Hobbies)
UPDATE `questions` 
SET `question_text` = 'What is a common indoor hobby?',
    `option_a` = 'Reading',
    `option_b` = 'Running',
    `option_c` = 'Swimming',
    `option_d` = 'Cycling',
    `correct_answer` = 'A',
    `explanation` = 'Reading is a common indoor hobby.',
    `audio_url` = 'hobbies/reading.mp3',
    `image_url` = 'exercises/ex16.jpg'
WHERE `exercise_id` = 16;

-- 7. Exercise 19 - Bài tập về du lịch (Lesson 7: Travel)
UPDATE `questions` 
SET `question_text` = 'Where can you see the Eiffel Tower?',
    `option_a` = 'Paris',
    `option_b` = 'London',
    `option_c` = 'New York',
    `option_d` = 'Tokyo',
    `correct_answer` = 'A',
    `explanation` = 'The Eiffel Tower is in Paris.',
    `audio_url` = 'travel/paris.mp3',
    `image_url` = 'exercises/ex19.jpg'
WHERE `exercise_id` = 19;

-- 8. Exercise 22 - Bài tập về công việc (Lesson 8: Work)
UPDATE `questions` 
SET `question_text` = 'What does a teacher do?',
    `option_a` = 'Teaches',
    `option_b` = 'Sings',
    `option_c` = 'Dances',
    `option_d` = 'Paints',
    `correct_answer` = 'A',
    `explanation` = 'A teacher teaches students.',
    `audio_url` = 'work/teacher.mp3',
    `image_url` = 'exercises/ex22.jpg'
WHERE `exercise_id` = 22;

-- 9. Exercise 25 - Bài tập về thói quen hàng ngày (Lesson 9: Daily Routine)
UPDATE `questions` 
SET `question_text` = 'What do you do first in the morning?',
    `option_a` = 'Wake up',
    `option_b` = 'Go to bed',
    `option_c` = 'Eat dinner',
    `option_d` = 'Take a shower',
    `correct_answer` = 'A',
    `explanation` = 'You wake up first thing in the morning.',
    `audio_url` = 'routine/wake.mp3',
    `image_url` = 'exercises/ex25.jpg'
WHERE `exercise_id` = 25;

-- 10. Exercise 28 - Bài tập về thời tiết (Lesson 10: Weather)
UPDATE `questions` 
SET `question_text` = 'How is the weather when it\'s raining?',
    `option_a` = 'Wet',
    `option_b` = 'Dry',
    `option_c` = 'Hot',
    `option_d` = 'Cold',
    `correct_answer` = 'A',
    `explanation` = 'Wet is the correct description for rainy weather.',
    `audio_url` = 'weather/rain.mp3',
    `image_url` = 'exercises/ex28.jpg'
WHERE `exercise_id` = 28;

-- 11. Exercise 31 - Bài tập về thể thao (Lesson 11: Sports)
UPDATE `questions` 
SET `question_text` = 'What sport uses a racket and ball?',
    `option_a` = 'Tennis',
    `option_b` = 'Football',
    `option_c` = 'Basketball',
    `option_d` = 'Baseball',
    `correct_answer` = 'A',
    `explanation` = 'Tennis is played with a racket and ball.',
    `audio_url` = 'sports/tennis.mp3',
    `image_url` = 'exercises/ex31.jpg'
WHERE `exercise_id` = 31;

-- 12. Exercise 34 - Bài tập về âm nhạc (Lesson 12: Music)
UPDATE `questions` 
SET `question_text` = 'What genre is Beethoven\'s music?',
    `option_a` = 'Classical',
    `option_b` = 'Rock',
    `option_c` = 'Jazz',
    `option_d` = 'Pop',
    `correct_answer` = 'A',
    `explanation` = 'Beethoven is known for classical music.',
    `audio_url` = 'music/classical.mp3',
    `image_url` = 'exercises/ex34.jpg'
WHERE `exercise_id` = 34;

-- 13. Exercise 37 - Bài tập về phim ảnh (Lesson 13: Movies)
UPDATE `questions` 
SET `question_text` = 'What genre is "The Godfather"?',
    `option_a` = 'Drama',
    `option_b` = 'Action',
    `option_c` = 'Comedy',
    `option_d` = 'Horror',
    `correct_answer` = 'A',
    `explanation` = 'The Godfather is a famous drama film.',
    `audio_url` = 'movies/drama.mp3',
    `image_url` = 'exercises/ex37.jpg'
WHERE `exercise_id` = 37;

-- 14. Exercise 40 - Bài tập về sách (Lesson 14: Books)
UPDATE `questions` 
SET `question_text` = 'What genre is "1984" by George Orwell?',
    `option_a` = 'Fiction',
    `option_b` = 'Non-Fiction',
    `option_c` = 'Mystery',
    `option_d` = 'Fantasy',
    `correct_answer` = 'A',
    `explanation` = '"1984" is a famous dystopian fiction.',
    `audio_url` = 'books/fiction.mp3',
    `image_url` = 'exercises/ex40.jpg'
WHERE `exercise_id` = 40;

-- Cập nhật cho các bài tập dạng Matching và Fill in the blank

-- Exercise 2 - Matching Greetings
UPDATE `questions` 
SET `question_text` = 'Match the greeting with the language.',
    `explanation` = 'Match 1-A, 2-B correctly.',
    `audio_url` = 'exercises/ex2.mp3',
    `image_url` = 'exercises/ex2.jpg'
WHERE `exercise_id` = 2;

-- Exercise 3 - Fill in the blank Greetings
UPDATE `questions` 
SET `question_text` = 'Complete the greeting: "___! How are you?"',
    `explanation` = 'Hello is the correct greeting to use.',
    `audio_url` = 'exercises/ex3.mp3',
    `image_url` = 'exercises/ex3.jpg'
WHERE `exercise_id` = 3;

-- Exercise 5 - Matching Numbers
UPDATE `questions` 
SET `question_text` = 'Match the number with the word.',
    `explanation` = 'Match 1-A, 2-B correctly.',
    `audio_url` = 'exercises/ex5.mp3',
    `image_url` = 'exercises/ex5.jpg'
WHERE `exercise_id` = 5;

-- Exercise 6 - Fill in the blank Numbers
UPDATE `questions` 
SET `question_text` = 'Complete the sentence: "I have ___ apples."',
    `explanation` = 'Two is the correct number to use in this sentence.',
    `audio_url` = 'exercises/ex6.mp3',
    `image_url` = 'exercises/ex6.jpg'
WHERE `exercise_id` = 6;

-- Bổ sung câu hỏi mới cho các bài tập chưa có câu hỏi
INSERT INTO `questions` (`id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `audio_url`, `image_url`, `is_active`, `points`, `question_order`, `difficulty_level`, `created_at`, `updated_at`, `exercise_id`)
VALUES 
-- Bài tập nghe từ bài 34 - Music
(201, 'Listen to the audio. What type of music is being played?', 'Classical', 'Rock', 'Jazz', 'Pop', 'A', 'The audio plays a classical music piece by Beethoven.', 'music/classical.mp3', 'exercises/ex34.jpg', b'1', 10, 1, 'EASY', '2025-07-08 12:00:00.000000', '2025-07-08 12:00:00.000000', 34),

-- Bài tập nghe từ bài 19 - Travel
(202, 'Listen to the audio. What famous landmark is described?', 'Eiffel Tower', 'Statue of Liberty', 'Big Ben', 'Sydney Opera House', 'A', 'The audio describes the Eiffel Tower in Paris.', 'travel/paris.mp3', 'exercises/ex19.jpg', b'1', 10, 1, 'EASY', '2025-07-08 12:00:00.000000', '2025-07-08 12:00:00.000000', 19),

-- Bài tập nghe từ bài 7 - Colors
(203, 'Look at the image and listen. What color is being described?', 'Blue', 'Green', 'Red', 'Yellow', 'A', 'The audio describes the blue color of the sky.', 'exercises/ex7.mp3', 'exercises/ex7.jpg', b'1', 10, 1, 'MEDIUM', '2025-07-08 12:00:00.000000', '2025-07-08 12:00:00.000000', 7);

-- Thêm trường audio_url và image_url vào bảng questions nếu chưa có
ALTER TABLE `questions`
ADD COLUMN IF NOT EXISTS `audio_url` VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(500) DEFAULT NULL;