-- Create sample data for testing blog likes
-- First, let's create the post_like table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_like (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blog_post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (blog_post_id, user_id)
);

-- Insert sample blog posts if they don't exist
INSERT IGNORE INTO blog_post (id, title, author, content, created_at, hidden) VALUES
(1, 'TOEIC Listening Tips', 'Admin', 'Các mẹo để cải thiện kỹ năng nghe TOEIC', NOW(), FALSE),
(2, 'TOEIC Reading Strategies', 'Admin', 'Chiến lược đọc hiểu TOEIC hiệu quả', NOW(), FALSE),
(3, 'Grammar Fundamentals', 'Admin', 'Các nguyên tắc ngữ pháp cơ bản cho TOEIC', NOW(), FALSE),
(4, 'Vocabulary Building', 'Admin', 'Cách xây dựng vốn từ vựng TOEIC', NOW(), FALSE),
(5, 'Test Taking Strategies', 'Admin', 'Chiến thuật làm bài thi TOEIC', NOW(), FALSE),
(6, 'Speaking Practice', 'Admin', 'Luyện tập kỹ năng nói tiếng Anh', NOW(), FALSE),
(7, 'Writing Techniques', 'Admin', 'Kỹ thuật viết tiếng Anh hiệu quả', NOW(), FALSE),
(8, 'Business English', 'Admin', 'Tiếng Anh thương mại thực tế', NOW(), FALSE),
(9, 'Thông tin khóa học', 'Duy Anh', 'Nhiều nội dung quan trọng', NOW(), FALSE),
(10, 'Advanced TOEIC Tips', 'Admin', 'Mẹo nâng cao cho TOEIC', NOW(), FALSE);

-- Check if we have users table
SELECT 'Blog posts created successfully' as status;
SELECT id, title, author FROM blog_post LIMIT 10;
