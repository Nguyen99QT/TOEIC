-- SQL commands to update image_url and audio_url for all flashcards
-- Run this after importing the main SQL file

USE english7;

-- Update flashcards with image_url and audio_url based on the front_text (term)
-- Basic Nouns Set (ID 1)
UPDATE flashcards SET image_url = 'images/apple.jpg', audio_url = 'audio/apple.mp3' WHERE id = 1 AND front_text = 'Apple';
UPDATE flashcards SET image_url = 'images/book.jpg', audio_url = 'audio/book.mp3' WHERE id = 2 AND front_text = 'Book';
UPDATE flashcards SET image_url = 'images/car.jpg', audio_url = 'audio/car.mp3' WHERE id = 3 AND front_text = 'Car';
UPDATE flashcards SET image_url = 'images/dog.jpg', audio_url = 'audio/dog.mp3' WHERE id = 4 AND front_text = 'Dog';

-- Daily Verbs Set (ID 2)
UPDATE flashcards SET image_url = 'images/go.jpg', audio_url = 'audio/go.mp3' WHERE id = 5 AND front_text = 'Go';
UPDATE flashcards SET image_url = 'images/eat.jpg', audio_url = 'audio/eat.mp3' WHERE id = 6 AND front_text = 'Eat';
UPDATE flashcards SET image_url = 'images/read.jpg', audio_url = 'audio/read.mp3' WHERE id = 7 AND front_text = 'Read';
UPDATE flashcards SET image_url = 'images/write.jpg', audio_url = 'audio/write.mp3' WHERE id = 8 AND front_text = 'Write';

-- Colors Set (ID 3)
UPDATE flashcards SET image_url = 'images/red.jpg', audio_url = 'audio/red.mp3' WHERE id = 9 AND front_text = 'Red';
UPDATE flashcards SET image_url = 'images/blue.jpg', audio_url = 'audio/blue.mp3' WHERE id = 10 AND front_text = 'Blue';
UPDATE flashcards SET image_url = 'images/green.jpg', audio_url = 'audio/green.mp3' WHERE id = 11 AND front_text = 'Green';
UPDATE flashcards SET image_url = 'images/yellow.jpg', audio_url = 'audio/yellow.mp3' WHERE id = 12 AND front_text = 'Yellow';

-- Fruits Set (ID 4)
UPDATE flashcards SET image_url = 'images/banana.jpg', audio_url = 'audio/banana.mp3' WHERE id = 13 AND front_text = 'Banana';
UPDATE flashcards SET image_url = 'images/orange.jpg', audio_url = 'audio/orange.mp3' WHERE id = 14 AND front_text = 'Orange';
UPDATE flashcards SET image_url = 'images/grape.jpg', audio_url = 'audio/grape.mp3' WHERE id = 15 AND front_text = 'Grape';
UPDATE flashcards SET image_url = 'images/mango.jpg', audio_url = 'audio/mango.mp3' WHERE id = 16 AND front_text = 'Mango';

-- Animals Set (ID 5)
UPDATE flashcards SET image_url = 'images/cat.jpg', audio_url = 'audio/cat.mp3' WHERE id = 17 AND front_text = 'Cat';
UPDATE flashcards SET image_url = 'images/bird.jpg', audio_url = 'audio/bird.mp3' WHERE id = 18 AND front_text = 'Bird';
UPDATE flashcards SET image_url = 'images/fish.jpg', audio_url = 'audio/fish.mp3' WHERE id = 19 AND front_text = 'Fish';
UPDATE flashcards SET image_url = 'images/horse.jpg', audio_url = 'audio/horse.mp3' WHERE id = 20 AND front_text = 'Horse';

-- Business English Set (ID 6)
UPDATE flashcards SET image_url = 'images/meeting.jpg', audio_url = 'audio/meeting.mp3' WHERE id = 21 AND front_text = 'Meeting';
UPDATE flashcards SET image_url = 'images/deadline.jpg', audio_url = 'audio/deadline.mp3' WHERE id = 22 AND front_text = 'Deadline';
UPDATE flashcards SET image_url = 'images/contract.jpg', audio_url = 'audio/contract.mp3' WHERE id = 23 AND front_text = 'Contract';
UPDATE flashcards SET image_url = 'images/promotion.jpg', audio_url = 'audio/promotion.mp3' WHERE id = 24 AND front_text = 'Promotion';

-- Travel Set (ID 7)
UPDATE flashcards SET image_url = 'images/airport.jpg', audio_url = 'audio/airport.mp3' WHERE id = 25 AND front_text = 'Airport';
UPDATE flashcards SET image_url = 'images/passport.jpg', audio_url = 'audio/passport.mp3' WHERE id = 26 AND front_text = 'Passport';
UPDATE flashcards SET image_url = 'images/luggage.jpg', audio_url = 'audio/luggage.mp3' WHERE id = 27 AND front_text = 'Luggage';
UPDATE flashcards SET image_url = 'images/tourist.jpg', audio_url = 'audio/tourist.mp3' WHERE id = 28 AND front_text = 'Tourist';

-- Technology Set (ID 8)
UPDATE flashcards SET image_url = 'images/software.jpg', audio_url = 'audio/software.mp3' WHERE id = 29 AND front_text = 'Software';
UPDATE flashcards SET image_url = 'images/hardware.jpg', audio_url = 'audio/hardware.mp3' WHERE id = 30 AND front_text = 'Hardware';
UPDATE flashcards SET image_url = 'images/network.jpg', audio_url = 'audio/network.mp3' WHERE id = 31 AND front_text = 'Network';
UPDATE flashcards SET image_url = 'images/database.jpg', audio_url = 'audio/database.mp3' WHERE id = 32 AND front_text = 'Database';

-- Idioms Set (ID 9)
UPDATE flashcards SET image_url = 'images/break_a_leg.jpg', audio_url = 'audio/break_a_leg.mp3' WHERE id = 33 AND front_text = 'Break a leg';
UPDATE flashcards SET image_url = 'images/hit_the_books.jpg', audio_url = 'audio/hit_the_books.mp3' WHERE id = 34 AND front_text = 'Hit the books';
UPDATE flashcards SET image_url = 'images/piece_of_cake.jpg', audio_url = 'audio/piece_of_cake.mp3' WHERE id = 35 AND front_text = 'Piece of cake';
UPDATE flashcards SET image_url = 'images/under_the_weather.jpg', audio_url = 'audio/under_the_weather.mp3' WHERE id = 36 AND front_text = 'Under the weather';

-- Advanced Verbs Set (ID 10)
UPDATE flashcards SET image_url = 'images/arise.jpg', audio_url = 'audio/arise.mp3' WHERE id = 37 AND front_text = 'Arise';
UPDATE flashcards SET image_url = 'images/comprehend.jpg', audio_url = 'audio/comprehend.mp3' WHERE id = 38 AND front_text = 'Comprehend';
UPDATE flashcards SET image_url = 'images/negotiate.jpg', audio_url = 'audio/negotiate.mp3' WHERE id = 39 AND front_text = 'Negotiate';
UPDATE flashcards SET image_url = 'images/accomplish.jpg', audio_url = 'audio/accomplish.mp3' WHERE id = 40 AND front_text = 'Accomplish';

-- Verify the updates
SELECT 'Verification: Flashcards with media files' AS message;
SELECT id, front_text, image_url, audio_url 
FROM flashcards 
WHERE image_url IS NOT NULL AND audio_url IS NOT NULL 
ORDER BY id;

-- Count flashcards with and without media
SELECT 'Summary' AS message;
SELECT 
    COUNT(*) AS total_flashcards,
    SUM(CASE WHEN image_url IS NOT NULL THEN 1 ELSE 0 END) AS with_image,
    SUM(CASE WHEN audio_url IS NOT NULL THEN 1 ELSE 0 END) AS with_audio,
    SUM(CASE WHEN image_url IS NOT NULL AND audio_url IS NOT NULL THEN 1 ELSE 0 END) AS with_both
FROM flashcards;
