-- Script để cập nhật đường dẫn URL tài nguyên trong bảng questions
-- Tạo ngày 10/07/2025

-- Tạo bản sao lưu bảng questions trước khi thực hiện thay đổi
CREATE TABLE IF NOT EXISTS questions_backup_url_fix LIKE questions;
INSERT INTO questions_backup_url_fix SELECT * FROM questions;

-- Cập nhật các đường dẫn audio có dạng /files/audio/exercises/... thành /audio/...
UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/greetings/')
WHERE audio_url LIKE '%/files/audio/exercises/greetings%';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/numbers/')
WHERE audio_url LIKE '%/files/audio/exercises/numbers%';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/colors/')
WHERE audio_url LIKE '%/files/audio/exercises/colors%';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/family/')
WHERE audio_url LIKE '%/files/audio/exercises/family%';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/food/')
WHERE audio_url LIKE '%/files/audio/exercises/food%';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/languages/')
WHERE audio_url LIKE '%/files/audio/exercises/languages%';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/', '/audio/travel/')
WHERE audio_url LIKE '%/files/audio/exercises/travel%';

-- Cập nhật các đường dẫn audio có dạng /files/audio/food/... thành /audio/food/...
UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/food/', '/audio/food/')
WHERE audio_url LIKE '%/files/audio/food/%';

-- Cập nhật các đường dẫn audio có dạng /files/audio/exercises/ex... thành /audio/...
UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/ex1.mp3', '/audio/greetings/greetings_ex1_q1.mp3')
WHERE audio_url = '/files/audio/exercises/ex1.mp3';

UPDATE questions 
SET audio_url = REPLACE(audio_url, '/files/audio/exercises/ex7.mp3', '/audio/colors/colors_ex7_q1.mp3')
WHERE audio_url = '/files/audio/exercises/ex7.mp3';

-- Cập nhật các đường dẫn images có dạng /files/images/exercises/... thành /images/...
UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/greetings/')
WHERE image_url LIKE '%/files/images/exercises/greetings%';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/numbers/')
WHERE image_url LIKE '%/files/images/exercises/numbers%';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/colors/')
WHERE image_url LIKE '%/files/images/exercises/colors%';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/family/')
WHERE image_url LIKE '%/files/images/exercises/family%';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/food/')
WHERE image_url LIKE '%/files/images/exercises/food%';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/languages/')
WHERE image_url LIKE '%/files/images/exercises/languages%';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/', '/images/travel/')
WHERE image_url LIKE '%/files/images/exercises/travel%';

-- Cập nhật các đường dẫn image có dạng /files/images/exercises/ex... thành /images/...
UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/ex1.jpg', '/images/greetings/greetings_ex1_q1.jpg')
WHERE image_url = '/files/images/exercises/ex1.jpg';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/ex7.jpg', '/images/colors/colors_ex7_q1.jpg')
WHERE image_url = '/files/images/exercises/ex7.jpg';

UPDATE questions 
SET image_url = REPLACE(image_url, '/files/images/exercises/ex13.jpg', '/images/food/food_ex13_q1.jpg')
WHERE image_url = '/files/images/exercises/ex13.jpg';

-- Thống kê kết quả cập nhật
SELECT 'Đã cập nhật các đường dẫn tài nguyên cho câu hỏi' AS 'Kết quả';

SELECT 
    COUNT(*) AS 'Tổng số câu hỏi có đường dẫn tài nguyên mới',
    SUM(CASE WHEN audio_url LIKE '/audio/%' THEN 1 ELSE 0 END) AS 'Số câu hỏi có audio mới',
    SUM(CASE WHEN image_url LIKE '/images/%' THEN 1 ELSE 0 END) AS 'Số câu hỏi có hình ảnh mới'
FROM 
    questions;
