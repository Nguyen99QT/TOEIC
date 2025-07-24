-- Update flashcards table to add default image and audio URLs where they are NULL or empty

-- Update flashcards with missing image URLs
UPDATE flashcards 
SET image_url = CONCAT('flashcards/flashcard_', id, '.jpg')
WHERE image_url IS NULL OR image_url = '';

-- Update flashcards with missing audio URLs  
UPDATE flashcards 
SET audio_url = CONCAT('flashcards/flashcard_', id, '.mp3')
WHERE audio_url IS NULL OR audio_url = '';

-- Update exercises with missing image URLs
UPDATE exercises 
SET image_url = CONCAT('exercises/exercise_', id, '.jpg')
WHERE image_url IS NULL OR image_url = '';

-- Update exercises with missing audio URLs
UPDATE exercises 
SET audio_url = CONCAT('exercises/exercise_', id, '.mp3')
WHERE audio_url IS NULL OR audio_url = '';

-- Verify the updates
SELECT 'Flashcards updated' as operation, COUNT(*) as count 
FROM flashcards 
WHERE image_url LIKE 'flashcards/%' AND audio_url LIKE 'flashcards/%';

SELECT 'Exercises updated' as operation, COUNT(*) as count 
FROM exercises 
WHERE image_url LIKE 'exercises/%' AND audio_url LIKE 'exercises/%';
