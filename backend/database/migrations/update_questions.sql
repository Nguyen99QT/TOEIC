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
    `audio_url` = '/files/audio/exercises/ex24.mp3',
    `image_url` = '/files/images/exercises/ex24.jpg',
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
    `audio_url` = '/files/audio/exercises/greetings_goodbye.mp3',
    `image_url` = '/files/images/exercises/greetings_goodbye.jpg',
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
    `audio_url` = '/files/audio/exercises/greetings_thankyou.mp3',
    `image_url` = '/files/images/exercises/greetings_thankyou.jpg',
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
    `audio_url` = '/files/audio/exercises/greetings_sorry.mp3',
    `image_url` = '/files/images/exercises/greetings_sorry.jpg',
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
    `audio_url` = '/files/audio/exercises/greetings_please.mp3',
    `image_url` = '/files/images/exercises/greetings_please.jpg',
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
    `audio_url` = '/files/audio/exercises/greetings/greeting1.mp3',
    `image_url` = '/files/images/exercises/exercises/greetings_xinchao.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/france.mp3',
    `image_url` = '/files/images/exercises/exercises/capitals_france.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/italy.mp3',
    `image_url` = '/files/images/exercises/exercises/capitals_italy.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/germany.mp3',
    `image_url` = '/files/images/exercises/exercises/capitals_germany.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/spain.mp3',
    `image_url` = '/files/images/exercises/exercises/capitals_spain.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/greece.mp3',
    `image_url` = '/files/images/exercises/exercises/capitals_greece.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/sweden.mp3',
    `image_url` = '/files/images/exercises/exercises/capitals_sweden.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/banana.mp3',
    `image_url` = '/files/images/exercises/exercises/colors_banana.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/apple.mp3',
    `image_url` = '/files/images/exercises/exercises/colors_apple.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/sky.mp3',
    `image_url` = '/files/images/exercises/exercises/colors_sky.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/grass.mp3',
    `image_url` = '/files/images/exercises/exercises/colors_grass.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/sun.mp3',
    `image_url` = '/files/images/exercises/exercises/colors_sun.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/snow.mp3',
    `image_url` = '/files/images/exercises/exercises/colors_snow.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/hot.mp3',
    `image_url` = '/files/images/exercises/exercises/opposites_hot.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/tall.mp3',
    `image_url` = '/files/images/exercises/exercises/opposites_tall.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/light.mp3',
    `image_url` = '/files/images/exercises/exercises/opposites_light.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/slow.mp3',
    `image_url` = '/files/images/exercises/exercises/opposites_slow.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/young.mp3',
    `image_url` = '/files/images/exercises/exercises/opposites_young.jpg',
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
    `audio_url` = '/files/audio/exercises/vocabulary/small.mp3',
    `image_url` = '/files/images/exercises/vocabulary/small.jpg',
    `question_text` = 'What is the opposite of "small"?',
    `option_a` = 'Large',
    `option_b` = 'Huge',
    `option_c` = 'Big', 
    `option_d` = 'Giant',
    `correct_answer` = 'C',
    `explanation` = 'Big is the opposite of small. It refers to being of considerable size.'
WHERE `exercise_id` = 4 AND `question_order` = 6;

-- Check for additional exercises beyond 4 and add more updates if needed
-- If you need to update more exercises, follow the same pattern

-- For TOEIC specific vocabulary exercises, we can add more realistic listening exercises
-- Example for a TOEIC listening question:

-- ========================================
-- UPDATE EXERCISE 5: Business Vocabulary (if exists)
-- ========================================

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/business/meeting_1.mp3',
    `image_url` = '/files/images/exercises/business/meeting.jpg',
    `question_text` = 'When will the meeting be rescheduled?',
    `option_a` = 'Next Monday',
    `option_b` = 'Tomorrow afternoon',
    `option_c` = 'Next week', 
    `option_d` = 'This Friday',
    `correct_answer` = 'B',
    `explanation` = 'In the audio, the speaker mentions that the meeting will be rescheduled for tomorrow afternoon.'
WHERE `exercise_id` = 5 AND `question_order` = 1;

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/business/report_1.mp3',
    `image_url` = '/files/images/exercises/business/report.jpg',
    `question_text` = 'What is the deadline for submitting the report?',
    `option_a` = 'End of the month',
    `option_b` = 'Next Thursday',
    `option_c` = 'This Friday', 
    `option_d` = 'Monday morning',
    `correct_answer` = 'C',
    `explanation` = 'The speaker in the audio clearly states that the report must be submitted by this Friday.'
WHERE `exercise_id` = 5 AND `question_order` = 2;

-- ========================================
-- UPDATE EXERCISE 6: TOEIC Listening Practice (if exists)
-- ========================================

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/listening/conversation_1.mp3',
    `image_url` = '/files/images/exercises/listening/office_conversation.jpg',
    `question_text` = 'Where are the speakers most likely located?',
    `option_a` = 'In a restaurant',
    `option_b` = 'In an office',
    `option_c` = 'In a car', 
    `option_d` = 'At the airport',
    `correct_answer` = 'B',
    `explanation` = 'Based on the conversation and background noises in the audio, the speakers are most likely in an office environment.'
WHERE `exercise_id` = 6 AND `question_order` = 1;

UPDATE `questions` 
SET 
    `audio_url` = '/files/audio/exercises/listening/announcement_1.mp3',
    `image_url` = '/files/images/exercises/listening/airport_announcement.jpg',
    `question_text` = 'What time will the flight depart?',
    `option_a` = '9:30 AM',
    `option_b` = '10:15 AM',
    `option_c` = '11:45 AM', 
    `option_d` = '1:20 PM',
    `correct_answer` = 'C',
    `explanation` = 'The announcement in the audio clearly states that the flight will depart at 11:45 AM.'
WHERE `exercise_id` = 6 AND `question_order` = 2;

-- ========================================
-- COMMIT THE CHANGES
-- ========================================
COMMIT;
