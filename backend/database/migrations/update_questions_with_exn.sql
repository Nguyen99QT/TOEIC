-- Add audio_url and image_url columns to questions table if they don't exist
ALTER TABLE `questions` 
ADD COLUMN IF NOT EXISTS `audio_url` VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `question_type` VARCHAR(100) DEFAULT 'MULTIPLE_CHOICE';

-- ========================================
-- UPDATE EXERCISE 1: Basic Greetings & Politeness (6 questions)
-- ========================================

-- Question 1: Hello
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex1.mp3',
    `image_url` = '/files/images/exercises/ex1.jpg',
    `question_text` = 'What does "Hello" mean in Vietnamese?',
    `option_a` = 'Xin chào',
    `option_b` = 'Tạm biệt',
    `option_c` = 'Cảm ơn', 
    `option_d` = 'Xin lỗi',
    `correct_answer` = 'A',
    `explanation` = 'Hello means Xin chào in Vietnamese. It is a common greeting used when meeting someone.'
WHERE `exercise_id` = 1 AND `question_order` = 1;

-- Question 2: Goodbye
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex2.mp3',
    `image_url` = '/files/images/exercises/ex2.jpg',
    `question_text` = 'What does "Goodbye" mean in Vietnamese?',
    `option_a` = 'Xin chào',
    `option_b` = 'Tạm biệt',
    `option_c` = 'Cảm ơn', 
    `option_d` = 'Xin lỗi',
    `correct_answer` = 'B',
    `explanation` = 'Goodbye means Tạm biệt in Vietnamese. It is used when parting ways with someone.'
WHERE `exercise_id` = 1 AND `question_order` = 2;

-- Question 3: Thank you
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex3.mp3',
    `image_url` = '/files/images/exercises/ex3.jpg',
    `question_text` = 'What does "Thank you" mean in Vietnamese?',
    `option_a` = 'Xin chào',
    `option_b` = 'Tạm biệt',
    `option_c` = 'Cảm ơn', 
    `option_d` = 'Xin lỗi',
    `correct_answer` = 'C',
    `explanation` = 'Thank you means Cảm ơn in Vietnamese. It is used to express gratitude.'
WHERE `exercise_id` = 1 AND `question_order` = 3;

-- Question 4: Sorry
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex4.mp3',
    `image_url` = '/files/images/exercises/ex4.jpg',
    `question_text` = 'What does "Sorry" mean in Vietnamese?',
    `option_a` = 'Xin chào',
    `option_b` = 'Tạm biệt',
    `option_c` = 'Cảm ơn', 
    `option_d` = 'Xin lỗi',
    `correct_answer` = 'D',
    `explanation` = 'Sorry means Xin lỗi in Vietnamese. It is used to apologize to someone.'
WHERE `exercise_id` = 1 AND `question_order` = 4;

-- Question 5: Please
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex5.mp3',
    `image_url` = '/files/images/exercises/ex5.jpg',
    `question_text` = 'What does "Please" mean in Vietnamese?',
    `option_a` = 'Làm ơn',
    `option_b` = 'Không có gì',
    `option_c` = 'Có thể', 
    `option_d` = 'Được rồi',
    `correct_answer` = 'A',
    `explanation` = 'Please means Làm ơn in Vietnamese. It is used when making a polite request.'
WHERE `exercise_id` = 1 AND `question_order` = 5;

-- Question 6: Xin chào
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex6.mp3',
    `image_url` = '/files/images/exercises/ex6.jpg',
    `question_text` = 'What does the Vietnamese word "Xin chào" mean in English?',
    `option_a` = 'Hello',
    `option_b` = 'Goodbye',
    `option_c` = 'Please', 
    `option_d` = 'Thank you',
    `correct_answer` = 'A',
    `explanation` = 'Xin chào means Hello in English. It is a common greeting in Vietnamese.'
WHERE `exercise_id` = 1 AND `question_order` = 6;

-- ========================================
-- UPDATE EXERCISE 2: World Capitals - Europe (6 questions)
-- ========================================

-- Question 1: France
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex7.mp3',
    `image_url` = '/files/images/exercises/ex7.jpg',
    `question_text` = 'What is the capital of France?',
    `option_a` = 'Berlin',
    `option_b` = 'Madrid',
    `option_c` = 'Paris', 
    `option_d` = 'Rome',
    `correct_answer` = 'C',
    `explanation` = 'Paris is the capital city of France. It is known as the "City of Light" and is famous for the Eiffel Tower.'
WHERE `exercise_id` = 2 AND `question_order` = 1;

-- Question 2: Italy
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex8.mp3',
    `image_url` = '/files/images/exercises/ex8.jpg',
    `question_text` = 'What is the capital of Italy?',
    `option_a` = 'Rome',
    `option_b` = 'Venice',
    `option_c` = 'Florence', 
    `option_d` = 'Milan',
    `correct_answer` = 'A',
    `explanation` = 'Rome is the capital city of Italy. It is known for its ancient history and landmarks like the Colosseum.'
WHERE `exercise_id` = 2 AND `question_order` = 2;

-- Question 3: Germany
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex9.mp3',
    `image_url` = '/files/images/exercises/ex9.jpg',
    `question_text` = 'What is the capital of Germany?',
    `option_a` = 'Berlin',
    `option_b` = 'Munich',
    `option_c` = 'Frankfurt', 
    `option_d` = 'Hamburg',
    `correct_answer` = 'A',
    `explanation` = 'Berlin is the capital city of Germany. It has a rich history and is known for the Berlin Wall and Brandenburg Gate.'
WHERE `exercise_id` = 2 AND `question_order` = 3;

-- Question 4: Spain
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex10.mp3',
    `image_url` = '/files/images/exercises/ex10.jpg',
    `question_text` = 'What is the capital of Spain?',
    `option_a` = 'Madrid',
    `option_b` = 'Barcelona',
    `option_c` = 'Valencia', 
    `option_d` = 'Seville',
    `correct_answer` = 'A',
    `explanation` = 'Madrid is the capital city of Spain. It is known for its elegant boulevards and expansive parks.'
WHERE `exercise_id` = 2 AND `question_order` = 4;

-- Question 5: Greece
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex11.mp3',
    `image_url` = '/files/images/exercises/ex11.jpg',
    `question_text` = 'What is the capital of Greece?',
    `option_a` = 'Athens',
    `option_b` = 'Thessaloniki',
    `option_c` = 'Patras', 
    `option_d` = 'Heraklion',
    `correct_answer` = 'A',
    `explanation` = 'Athens is the capital city of Greece. It is one of the oldest cities in the world and is famous for the Acropolis.'
WHERE `exercise_id` = 2 AND `question_order` = 5;

-- Question 6: Sweden
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex12.mp3',
    `image_url` = '/files/images/exercises/ex12.jpg',
    `question_text` = 'What is the capital of Sweden?',
    `option_a` = 'Stockholm',
    `option_b` = 'Gothenburg',
    `option_c` = 'Malmo', 
    `option_d` = 'Uppsala',
    `correct_answer` = 'A',
    `explanation` = 'Stockholm is the capital city of Sweden. It is built on 14 islands and is known for its beautiful architecture.'
WHERE `exercise_id` = 2 AND `question_order` = 6;

-- ========================================
-- UPDATE EXERCISE 3: Colors & Nature (6 questions)
-- ========================================

-- Question 1: Banana
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex13.mp3',
    `image_url` = '/files/images/exercises/ex13.jpg',
    `question_text` = 'What color is a banana?',
    `option_a` = 'Red',
    `option_b` = 'Green',
    `option_c` = 'Yellow', 
    `option_d` = 'Blue',
    `correct_answer` = 'C',
    `explanation` = 'A banana is yellow when it is ripe. Before ripening, bananas are green.'
WHERE `exercise_id` = 3 AND `question_order` = 1;

-- Question 2: Apple
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex14.mp3',
    `image_url` = '/files/images/exercises/ex14.jpg',
    `question_text` = 'What color is an apple typically?',
    `option_a` = 'Red',
    `option_b` = 'Blue',
    `option_c` = 'Yellow', 
    `option_d` = 'Purple',
    `correct_answer` = 'A',
    `explanation` = 'Apples are typically red, though they can also be green or yellow depending on the variety.'
WHERE `exercise_id` = 3 AND `question_order` = 2;

-- Question 3: Sky
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex15.mp3',
    `image_url` = '/files/images/exercises/ex15.jpg',
    `question_text` = 'What color is the sky?',
    `option_a` = 'Green',
    `option_b` = 'Blue',
    `option_c` = 'Red', 
    `option_d` = 'Yellow',
    `correct_answer` = 'B',
    `explanation` = 'The sky appears blue during the day due to the scattering of sunlight in the atmosphere.'
WHERE `exercise_id` = 3 AND `question_order` = 3;

-- Question 4: Grass
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex16.mp3',
    `image_url` = '/files/images/exercises/ex16.jpg',
    `question_text` = 'What color is grass?',
    `option_a` = 'Green',
    `option_b` = 'Blue',
    `option_c` = 'Red', 
    `option_d` = 'Yellow',
    `correct_answer` = 'A',
    `explanation` = 'Grass is green due to the presence of chlorophyll, which is used in photosynthesis.'
WHERE `exercise_id` = 3 AND `question_order` = 4;

-- Question 5: Sun
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex17.mp3',
    `image_url` = '/files/images/exercises/ex17.jpg',
    `question_text` = 'What color is the sun?',
    `option_a` = 'Red',
    `option_b` = 'Blue',
    `option_c` = 'Green', 
    `option_d` = 'Yellow',
    `correct_answer` = 'D',
    `explanation` = 'The sun appears yellow to the naked eye from Earth, though its actual color is white.'
WHERE `exercise_id` = 3 AND `question_order` = 5;

-- Question 6: Snow
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex18.mp3',
    `image_url` = '/files/images/exercises/ex18.jpg',
    `question_text` = 'What color is snow?',
    `option_a` = 'White',
    `option_b` = 'Black',
    `option_c` = 'Gray', 
    `option_d` = 'Blue',
    `correct_answer` = 'A',
    `explanation` = 'Snow is white because it reflects all the colors of the visible light spectrum back to our eyes.'
WHERE `exercise_id` = 3 AND `question_order` = 6;

-- ========================================
-- UPDATE EXERCISE 4: Opposites (6 questions)
-- ========================================

-- Question 1: Hot
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex19.mp3',
    `image_url` = '/files/images/exercises/ex19.jpg',
    `question_text` = 'What is the opposite of "hot"?',
    `option_a` = 'Warm',
    `option_b` = 'Cool',
    `option_c` = 'Cold', 
    `option_d` = 'Freezing',
    `correct_answer` = 'C',
    `explanation` = 'Cold is the opposite of hot. It refers to a low temperature.'
WHERE `exercise_id` = 4 AND `question_order` = 1;

-- Question 2: Tall
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex20.mp3',
    `image_url` = '/files/images/exercises/ex20.jpg',
    `question_text` = 'What is the opposite of "tall"?',
    `option_a` = 'Small',
    `option_b` = 'Short',
    `option_c` = 'Thin', 
    `option_d` = 'Low',
    `correct_answer` = 'B',
    `explanation` = 'Short is the opposite of tall. It refers to having little height.'
WHERE `exercise_id` = 4 AND `question_order` = 2;

-- Question 3: Light
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex21.mp3',
    `image_url` = '/files/images/exercises/ex21.jpg',
    `question_text` = 'What is the opposite of "light"?',
    `option_a` = 'Dark',
    `option_b` = 'Dim',
    `option_c` = 'Black', 
    `option_d` = 'Shadow',
    `correct_answer` = 'A',
    `explanation` = 'Dark is the opposite of light. It refers to the absence of light.'
WHERE `exercise_id` = 4 AND `question_order` = 3;

-- Question 4: Slow
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex22.mp3',
    `image_url` = '/files/images/exercises/ex22.jpg',
    `question_text` = 'What is the opposite of "slow"?',
    `option_a` = 'Quick',
    `option_b` = 'Rapid',
    `option_c` = 'Swift', 
    `option_d` = 'Fast',
    `correct_answer` = 'D',
    `explanation` = 'Fast is the opposite of slow. It refers to moving or happening quickly.'
WHERE `exercise_id` = 4 AND `question_order` = 4;

-- Question 5: Young
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex23.mp3',
    `image_url` = '/files/images/exercises/ex23.jpg',
    `question_text` = 'What is the opposite of "young"?',
    `option_a` = 'Ancient',
    `option_b` = 'Old',
    `option_c` = 'Aged', 
    `option_d` = 'Elder',
    `correct_answer` = 'B',
    `explanation` = 'Old is the opposite of young. It refers to having lived for a long time.'
WHERE `exercise_id` = 4 AND `question_order` = 5;

-- Question 6: Small
UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex24.mp3',
    `image_url` = '/files/images/exercises/ex24.jpg',
    `question_text` = 'What is the opposite of "small"?',
    `option_a` = 'Large',
    `option_b` = 'Huge',
    `option_c` = 'Big', 
    `option_d` = 'Giant',
    `correct_answer` = 'C',
    `explanation` = 'Big is the opposite of small. It refers to being of considerable size.'
WHERE `exercise_id` = 4 AND `question_order` = 6;

-- ========================================
-- UPDATE EXERCISE 5: General Knowledge (if exists)
-- ========================================

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex25.mp3',
    `image_url` = '/files/images/exercises/ex25.jpg',
    `question_text` = 'How many continents are there?',
    `option_a` = 'Five',
    `option_b` = 'Six',
    `option_c` = 'Seven', 
    `option_d` = 'Eight',
    `correct_answer` = 'C',
    `explanation` = 'There are seven continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.'
WHERE `exercise_id` = 5 AND `question_order` = 1;

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex26.mp3',
    `image_url` = '/files/images/exercises/ex26.jpg',
    `question_text` = 'What is the smallest prime number?',
    `option_a` = '1',
    `option_b` = '2',
    `option_c` = '3', 
    `option_d` = '5',
    `correct_answer` = 'B',
    `explanation` = '2 is the smallest prime number. 1 is not considered a prime number.'
WHERE `exercise_id` = 5 AND `question_order` = 2;

-- ========================================
-- UPDATE EXERCISE 6: Languages of the World (if exists)
-- ========================================

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex27.mp3',
    `image_url` = '/files/images/exercises/ex27.jpg',
    `question_text` = 'What is the most widely spoken language in the world?',
    `option_a` = 'English',
    `option_b` = 'Mandarin',
    `option_c` = 'Spanish', 
    `option_d` = 'Hindi',
    `correct_answer` = 'B',
    `explanation` = 'Mandarin Chinese is the most widely spoken language in the world by number of native speakers.'
WHERE `exercise_id` = 6 AND `question_order` = 1;

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex28.mp3',
    `image_url` = '/files/images/exercises/ex28.jpg',
    `question_text` = 'What is the main language spoken in Brazil?',
    `option_a` = 'Spanish',
    `option_b` = 'Portuguese',
    `option_c` = 'English', 
    `option_d` = 'French',
    `correct_answer` = 'B',
    `explanation` = 'Portuguese is the official and main language spoken in Brazil.'
WHERE `exercise_id` = 6 AND `question_order` = 2;

-- ========================================
-- UPDATE EXERCISE 7: Asian Capitals (if exists)
-- ========================================

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex29.mp3',
    `image_url` = '/files/images/exercises/ex29.jpg',
    `question_text` = 'What is the capital of Japan?',
    `option_a` = 'Beijing',
    `option_b` = 'Seoul',
    `option_c` = 'Tokyo', 
    `option_d` = 'Bangkok',
    `correct_answer` = 'C',
    `explanation` = 'Tokyo is the capital city of Japan.'
WHERE `exercise_id` = 7 AND `question_order` = 1;

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/ex30.mp3',
    `image_url` = '/files/images/exercises/ex30.jpg',
    `question_text` = 'What is the capital of China?',
    `option_a` = 'Beijing',
    `option_b` = 'Shanghai',
    `option_c` = 'Guangzhou', 
    `option_d` = 'Shenzhen',
    `correct_answer` = 'A',
    `explanation` = 'Beijing is the capital city of China.'
WHERE `exercise_id` = 7 AND `question_order` = 2;

-- ========================================
-- COMMIT THE CHANGES
-- ========================================
COMMIT;
