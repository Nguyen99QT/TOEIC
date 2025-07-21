-- ====================================================
-- IMPORT BASIC DATA FOR TOEIC PROJECT
-- ====================================================
-- This script will create basic data for testing

-- 1. Create a basic user for testing
INSERT IGNORE INTO user (
    user_id, username, email, password_hash, full_name, 
    is_active, role, membership_type, created_at, updated_at
) VALUES 
(1, 'anonymous', 'anonymous@test.com', 'test', 'Anonymous User', 
 true, 'USER', 'BASIC', NOW(), NOW()),
(2, 'testuser', 'test@toeic.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K', 'Test User',
 true, 'USER', 'BASIC', NOW(), NOW());

-- 2. Create a basic test
INSERT IGNORE INTO test (
    test_id, title, description, created_by, created_at
) VALUES 
(1, 'Sample TOEIC Test 1', 'Basic TOEIC test for beginners', 1, NOW()),
(2, 'Quick Random TOEIC Test', 'Quick test with random questions', 1, NOW());

-- 3. Create basic questions for Part 1 (Photo Description)
INSERT IGNORE INTO question_test (
    question_id, question_text, correct_option, part_number, 
    question_order, audio_url, image_url, created_by
) VALUES 
(1, 'Look at the picture and choose the best description.', 'A', 1, 1, 
 '/uploads/audio/sample_part1_audio.mp3', '/uploads/images/sample_part1_image.jpg', 1),
(2, 'What is happening in this picture?', 'B', 1, 2,
 '/uploads/audio/sample_part1_audio2.mp3', '/uploads/images/sample_part1_image2.jpg', 1);

-- 4. Create basic questions for Part 2 (Question-Response)
INSERT IGNORE INTO question_test (
    question_id, question_text, correct_option, part_number, 
    question_order, audio_url, created_by
) VALUES 
(3, 'When will the meeting start?', 'A', 2, 1,
 '/uploads/audio/sample_part2_audio.mp3', 1),
(4, 'Where is the nearest bank?', 'C', 2, 2,
 '/uploads/audio/sample_part2_audio2.mp3', 1);

-- 5. Create options for questions
INSERT IGNORE INTO `option` (option_id, question_id, label, content) VALUES 
-- Question 1 options
(1, 1, 'A', 'A man is reading a newspaper.'),
(2, 1, 'B', 'A woman is drinking coffee.'),
(3, 1, 'C', 'People are walking in the park.'),
(4, 1, 'D', 'A car is parked outside.'),

-- Question 2 options  
(5, 2, 'A', 'The woman is cooking dinner.'),
(6, 2, 'B', 'The children are playing games.'),
(7, 2, 'C', 'The man is working on computer.'),
(8, 2, 'D', 'People are having a meeting.'),

-- Question 3 options (Part 2)
(9, 3, 'A', 'At 2 PM today.'),
(10, 3, 'B', 'In the conference room.'),
(11, 3, 'C', 'Yes, it is important.'),

-- Question 4 options (Part 2)
(12, 4, 'A', 'Next to the post office.'),
(13, 4, 'B', 'It opens at 9 AM.'),
(14, 4, 'C', 'Turn left at the corner.');

-- 6. Link questions to tests
INSERT IGNORE INTO test_question (test_id, question_id, question_order, part_number) VALUES 
(1, 1, 1, 1),
(1, 2, 2, 1),
(1, 3, 3, 2),
(1, 4, 4, 2),
(2, 1, 1, 1),
(2, 2, 2, 1),
(2, 3, 3, 2),
(2, 4, 4, 2);

-- 7. Create basic lessons
INSERT IGNORE INTO lessons (
    id, title, description, content, level, difficulty, 
    duration, is_active, is_premium, type, created_at, updated_at
) VALUES 
(1, 'TOEIC Listening Basics', 'Introduction to TOEIC Listening section', 
 'Learn the basics of TOEIC listening test format and strategies.', 
 'BEGINNER', 'EASY', 30, true, false, 'LISTENING', NOW(), NOW()),
(2, 'Part 1: Photo Description', 'How to tackle photo description questions',
 'Detailed guide for TOEIC Part 1 questions with examples.',
 'BEGINNER', 'EASY', 45, true, false, 'LISTENING', NOW(), NOW());

-- 8. Create basic flashcard sets
INSERT IGNORE INTO flashcard_sets (
    id, name, description, category, difficulty_level, card_count,
    is_active, is_premium, is_public, created_by, created_at, updated_at
) VALUES 
(1, 'Basic TOEIC Vocabulary', 'Essential vocabulary for TOEIC beginners',
 'VOCABULARY', 'BEGINNER', 50, true, false, true, 1, NOW(), NOW()),
(2, 'Business English Terms', 'Common business terms used in TOEIC',
 'BUSINESS', 'INTERMEDIATE', 30, true, false, true, 1, NOW(), NOW());

-- Success message
SELECT 'Basic data imported successfully!' AS status;
