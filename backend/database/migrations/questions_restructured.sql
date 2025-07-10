-- Xóa dữ liệu cũ và reset
DELETE FROM questions;
ALTER TABLE questions AUTO_INCREMENT = 1;

-- ========================================
-- EXERCISE 1: Basic Greetings & Politeness (6 questions)
-- ========================================
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('A', '2025-07-02 10:00:00.000000', 'Hello means Xin chào.', b'1', 'Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi', 10, 1, 'What does "Hello" mean in Vietnamese?', '2025-07-02 10:00:00.000000', 1),
('B', '2025-07-02 10:00:00.000000', 'Goodbye means Tạm biệt.', b'1', 'Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi', 10, 2, 'What does "Goodbye" mean in Vietnamese?', '2025-07-02 10:00:00.000000', 1),
('C', '2025-07-02 10:00:00.000000', 'Thank you means Cảm ơn.', b'1', 'Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi', 10, 3, 'What does "Thank you" mean in Vietnamese?', '2025-07-02 10:00:00.000000', 1),
('D', '2025-07-02 10:00:00.000000', 'Sorry means Xin lỗi.', b'1', 'Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi', 10, 4, 'What does "Sorry" mean in Vietnamese?', '2025-07-02 10:00:00.000000', 1),
('A', '2025-07-02 10:00:00.000000', 'Please means Làm ơn.', b'1', 'Làm ơn', 'Không có gì', 'Có thể', 'Được rồi', 10, 5, 'What does "Please" mean in Vietnamese?', '2025-07-02 10:00:00.000000', 1),
('A', '2025-07-02 10:00:00.000000', 'Xin chào is a greeting in Vietnamese, meaning Hello.', b'1', 'Hello', 'Goodbye', 'Please', 'Thank you', 10, 6, 'What does the Vietnamese word "Xin chào" mean in English?', '2025-07-02 10:00:00.000000', 1);

-- ========================================
-- EXERCISE 2: World Capitals - Europe (6 questions)
-- ========================================
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('C', '2025-07-02 10:00:00.000000', 'Paris is the capital of France.', b'1', 'Berlin', 'Madrid', 'Paris', 'Rome', 10, 1, 'What is the capital of France?', '2025-07-02 10:00:00.000000', 2),
('A', '2025-07-02 10:00:00.000000', 'Rome is the capital of Italy.', b'1', 'Rome', 'Venice', 'Florence', 'Milan', 10, 2, 'What is the capital of Italy?', '2025-07-02 10:00:00.000000', 2),
('A', '2025-07-02 10:00:00.000000', 'Berlin is the capital of Germany.', b'1', 'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 10, 3, 'What is the capital of Germany?', '2025-07-02 10:00:00.000000', 2),
('A', '2025-07-02 10:00:00.000000', 'Madrid is the capital of Spain.', b'1', 'Madrid', 'Barcelona', 'Valencia', 'Seville', 10, 4, 'What is the capital of Spain?', '2025-07-02 10:00:00.000000', 2),
('A', '2025-07-02 10:00:00.000000', 'Athens is the capital of Greece.', b'1', 'Athens', 'Thessaloniki', 'Patras', 'Heraklion', 10, 5, 'What is the capital of Greece?', '2025-07-02 10:00:00.000000', 2),
('A', '2025-07-02 10:00:00.000000', 'Stockholm is the capital of Sweden.', b'1', 'Stockholm', 'Gothenburg', 'Malmo', 'Uppsala', 10, 6, 'What is the capital of Sweden?', '2025-07-02 10:00:00.000000', 2);

-- ========================================
-- EXERCISE 3: Colors & Nature (6 questions)
-- ========================================
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('C', '2025-07-02 10:00:00.000000', 'A banana is yellow when ripe.', b'1', 'Red', 'Green', 'Yellow', 'Blue', 10, 1, 'What color is a banana?', '2025-07-02 10:00:00.000000', 3),
('A', '2025-07-02 10:00:00.000000', 'An apple is typically red.', b'1', 'Red', 'Blue', 'Yellow', 'Purple', 10, 2, 'What color is an apple typically?', '2025-07-02 10:00:00.000000', 3),
('B', '2025-07-02 10:00:00.000000', 'The sky is blue.', b'1', 'Green', 'Blue', 'Red', 'Yellow', 10, 3, 'What color is the sky?', '2025-07-02 10:00:00.000000', 3),
('A', '2025-07-02 10:00:00.000000', 'Grass is green.', b'1', 'Green', 'Blue', 'Red', 'Yellow', 10, 4, 'What color is grass?', '2025-07-02 10:00:00.000000', 3),
('D', '2025-07-02 10:00:00.000000', 'The sun is yellow.', b'1', 'Red', 'Blue', 'Green', 'Yellow', 10, 5, 'What color is the sun?', '2025-07-02 10:00:00.000000', 3),
('A', '2025-07-02 10:00:00.000000', 'Snow is white.', b'1', 'White', 'Black', 'Gray', 'Blue', 10, 6, 'What color is snow?', '2025-07-02 10:00:00.000000', 3);

-- ========================================
-- EXERCISE 4: Opposites (6 questions)  
-- ========================================
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('C', '2025-07-02 10:00:00.000000', 'Cold is the opposite of hot.', b'1', 'Warm', 'Cool', 'Cold', 'Freezing', 10, 1, 'What is the opposite of "hot"?', '2025-07-02 10:00:00.000000', 4),
('B', '2025-07-02 10:00:00.000000', 'Short is the opposite of tall.', b'1', 'Small', 'Short', 'Thin', 'Low', 10, 2, 'What is the opposite of "tall"?', '2025-07-02 10:00:00.000000', 4),
('A', '2025-07-02 10:00:00.000000', 'Dark is the opposite of light.', b'1', 'Dark', 'Dim', 'Black', 'Shadow', 10, 3, 'What is the opposite of "light"?', '2025-07-02 10:00:00.000000', 4),
('D', '2025-07-02 10:00:00.000000', 'Fast is the opposite of slow.', b'1', 'Quick', 'Rapid', 'Swift', 'Fast', 10, 4, 'What is the opposite of "slow"?', '2025-07-02 10:00:00.000000', 4),
('B', '2025-07-02 10:00:00.000000', 'Old is the opposite of young.', b'1', 'Ancient', 'Old', 'Aged', 'Elder', 10, 5, 'What is the opposite of "young"?', '2025-07-02 10:00:00.000000', 4),
('C', '2025-07-02 10:00:00.000000', 'Big is the opposite of small.', b'1', 'Large', 'Huge', 'Big', 'Giant', 10, 6, 'What is the opposite of "small"?', '2025-07-02 10:00:00.000000', 4);

-- ========================================
-- EXERCISE 5: Numbers & Science (6 questions) - MEDIUM DIFFICULTY
-- ========================================
-- UPDATE exercises SET difficulty_level = 'medium' WHERE id = 5;
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('C', '2025-07-02 10:00:00.000000', 'There are seven continents.', b'1', 'Five', 'Six', 'Seven', 'Eight', 15, 1, 'How many continents are there?', '2025-07-02 10:00:00.000000', 5),
('B', '2025-07-02 10:00:00.000000', '2 is the smallest prime number.', b'1', '1', '2', '3', '5', 15, 2, 'What is the smallest prime number?', '2025-07-02 10:00:00.000000', 5),
('D', '2025-07-02 10:00:00.000000', 'The Pacific Ocean is the largest.', b'1', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 15, 3, 'What is the largest ocean?', '2025-07-02 10:00:00.000000', 5),
('C', '2025-07-02 10:00:00.000000', 'Jupiter is the largest planet.', b'1', 'Earth', 'Mars', 'Jupiter', 'Saturn', 15, 4, 'What is the largest planet in our solar system?', '2025-07-02 10:00:00.000000', 5),
('C', '2025-07-02 10:00:00.000000', 'Diamond is the hardest natural substance.', b'1', 'Gold', 'Iron', 'Diamond', 'Platinum', 15, 5, 'What is the hardest natural substance on Earth?', '2025-07-02 10:00:00.000000', 5),
('A', '2025-07-02 10:00:00.000000', 'Au is the chemical symbol for gold.', b'1', 'Au', 'Ag', 'Pb', 'Fe', 15, 6, 'What is the chemical symbol for gold?', '2025-07-02 10:00:00.000000', 5);

-- Tiếp tục với các exercises còn lại...
-- ========================================
-- EXERCISE 6: Languages (6 questions) - MEDIUM DIFFICULTY
-- ========================================
-- UPDATE exercises SET difficulty_level = 'medium' WHERE id = 6;
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('B', '2025-07-02 10:00:00.000000', 'Mandarin is the most widely spoken language.', b'1', 'English', 'Mandarin', 'Spanish', 'Hindi', 15, 1, 'What is the most widely spoken language in the world?', '2025-07-02 10:00:00.000000', 6),
('B', '2025-07-02 10:00:00.000000', 'Portuguese is the main language in Brazil.', b'1', 'Spanish', 'Portuguese', 'English', 'French', 15, 2, 'What is the main language spoken in Brazil?', '2025-07-02 10:00:00.000000', 6),
('A', '2025-07-02 10:00:00.000000', 'English is the most spoken language in the USA.', b'1', 'English', 'Spanish', 'Chinese', 'French', 15, 3, 'What is the most spoken language in the USA?', '2025-07-02 10:00:00.000000', 6),
('A', '2025-07-02 10:00:00.000000', 'Arabic is the primary language in Egypt.', b'1', 'Arabic', 'English', 'French', 'Spanish', 15, 4, 'What is the primary language in Egypt?', '2025-07-02 10:00:00.000000', 6),
('A', '2025-07-02 10:00:00.000000', 'Russian is the primary language in Russia.', b'1', 'Russian', 'Ukrainian', 'Belarusian', 'Kazakh', 15, 5, 'What is the primary language in Russia?', '2025-07-02 10:00:00.000000', 6),
('A', '2025-07-02 10:00:00.000000', 'Spanish is the primary language in Argentina.', b'1', 'Spanish', 'Portuguese', 'Italian', 'French', 15, 6, 'What is the primary language in Argentina?', '2025-07-02 10:00:00.000000', 6);

-- ========================================
-- EXERCISE 7: World Capitals - Asia & Others (6 questions) - HARD DIFFICULTY
-- ========================================
-- UPDATE exercises SET difficulty_level = 'hard' WHERE id = 7;
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('C', '2025-07-02 10:00:00.000000', 'Tokyo is the capital of Japan.', b'1', 'Beijing', 'Seoul', 'Tokyo', 'Bangkok', 20, 1, 'What is the capital of Japan?', '2025-07-02 10:00:00.000000', 7),
('A', '2025-07-02 10:00:00.000000', 'Beijing is the capital of China.', b'1', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 20, 2, 'What is the capital of China?', '2025-07-02 10:00:00.000000', 7),
('D', '2025-07-02 10:00:00.000000', 'Ottawa is the capital of Canada.', b'1', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 20, 3, 'What is the capital of Canada?', '2025-07-02 10:00:00.000000', 7),
('C', '2025-07-02 10:00:00.000000', 'Canberra is the capital of Australia.', b'1', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 20, 4, 'What is the capital of Australia?', '2025-07-02 10:00:00.000000', 7),
('A', '2025-07-02 10:00:00.000000', 'Bangkok is the capital of Thailand.', b'1', 'Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 20, 5, 'What is the capital of Thailand?', '2025-07-02 10:00:00.000000', 7),
('A', '2025-07-02 10:00:00.000000', 'Hanoi is the capital of Vietnam.', b'1', 'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 20, 6, 'What is the capital of Vietnam?', '2025-07-02 10:00:00.000000', 7);

-- ========================================  
-- EXERCISE 8: Food & Cooking (6 questions) - HARD DIFFICULTY
-- ========================================
-- UPDATE exercises SET difficulty_level = 'hard' WHERE id = 8;
INSERT INTO `questions` (`correct_answer`, `created_at`, `explanation`, `is_active`, `option_a`, `option_b`, `option_c`, `option_d`, `points`, `question_order`, `question_text`, `updated_at`, `exercise_id`) VALUES
('A', '2025-07-02 10:00:00.000000', 'Rice is the main ingredient in sushi.', b'1', 'Rice', 'Noodles', 'Bread', 'Potato', 20, 1, 'What is the main ingredient in sushi?', '2025-07-02 10:00:00.000000', 8),
('A', '2025-07-02 10:00:00.000000', 'Flour is the main ingredient in bread.', b'1', 'Flour', 'Sugar', 'Salt', 'Yeast', 20, 2, 'What is the main ingredient in bread?', '2025-07-02 10:00:00.000000', 8),
('A', '2025-07-02 10:00:00.000000', 'Cocoa is the main ingredient in chocolate.', b'1', 'Cocoa', 'Sugar', 'Milk', 'Vanilla', 20, 3, 'What is the main ingredient in chocolate?', '2025-07-02 10:00:00.000000', 8),
('C', '2025-07-02 10:00:00.000000', 'Avocado is the main ingredient in guacamole.', b'1', 'Tomato', 'Onion', 'Avocado', 'Pepper', 20, 4, 'What is the main ingredient in guacamole?', '2025-07-02 10:00:00.000000', 8),
('A', '2025-07-02 10:00:00.000000', 'Basil is the main ingredient in pesto.', b'1', 'Basil', 'Parsley', 'Cilantro', 'Mint', 20, 5, 'What is the main ingredient in pesto?', '2025-07-02 10:00:00.000000', 8),
('A', '2025-07-02 10:00:00.000000', 'Chickpeas are the main ingredient in hummus.', b'1', 'Chickpeas', 'Lentils', 'Beans', 'Peas', 20, 6, 'What is the main ingredient in hummus?', '2025-07-02 10:00:00.000000', 8);