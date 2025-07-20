-- Migration: Create complete comment and feedback system
-- Date: 2024-01-XX
-- Description: Create all tables for lesson comments and admin feedback system

-- ========================================
-- LESSON COMMENTS SYSTEM
-- ========================================

-- Create lesson_comments table
CREATE TABLE IF NOT EXISTS lesson_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    like_count INT NOT NULL DEFAULT 0,
    dislike_count INT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    
    INDEX idx_lesson_comments_lesson_id (lesson_id),
    INDEX idx_lesson_comments_user_id (user_id),
    INDEX idx_lesson_comments_created_at (created_at),
    INDEX idx_lesson_comments_active (is_deleted),
    INDEX idx_lesson_comments_lesson_user (lesson_id, user_id)
);

-- Create comment_replies table
CREATE TABLE IF NOT EXISTS comment_replies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    parent_comment_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    like_count INT NOT NULL DEFAULT 0,
    dislike_count INT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES lesson_comments(id) ON DELETE CASCADE,
    
    INDEX idx_comment_replies_parent_comment_id (parent_comment_id),
    INDEX idx_comment_replies_user_id (user_id),
    INDEX idx_comment_replies_created_at (created_at),
    INDEX idx_comment_replies_active (is_deleted)
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    comment_id BIGINT NULL,
    reply_id BIGINT NULL,
    like_type VARCHAR(10) NOT NULL DEFAULT 'LIKE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES lesson_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_id) REFERENCES comment_replies(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_user_comment_like (user_id, comment_id),
    UNIQUE KEY uk_user_reply_like (user_id, reply_id),
    INDEX idx_comment_likes_comment_id (comment_id),
    INDEX idx_comment_likes_reply_id (reply_id),
    INDEX idx_comment_likes_user_id (user_id),
    INDEX idx_comment_likes_type (like_type),
    INDEX idx_comment_likes_comment_type (comment_id, like_type),
    INDEX idx_comment_likes_reply_type (reply_id, like_type),
    
    -- Ensure either comment_id or reply_id is set, but not both
    CONSTRAINT chk_comment_or_reply CHECK (
        (comment_id IS NOT NULL AND reply_id IS NULL) OR 
        (comment_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- ========================================
-- ADMIN FEEDBACK SYSTEM
-- ========================================

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    feedback_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    contact_email VARCHAR(255) NULL,
    contact_phone VARCHAR(20) NULL,
    admin_response TEXT NULL,
    responded_by BIGINT NULL,
    responded_at TIMESTAMP NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_feedback_user_id (user_id),
    INDEX idx_feedback_status (status),
    INDEX idx_feedback_priority (priority),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_feedback_created_at (created_at),
    INDEX idx_feedback_responded_by (responded_by),
    INDEX idx_feedback_active (is_deleted),
    INDEX idx_feedback_pending (status, priority),
    INDEX idx_feedback_urgent (priority, created_at)
);

-- ========================================
-- SAMPLE DATA (Optional)
-- ========================================

-- Insert sample lesson comments
-- INSERT INTO lesson_comments (user_id, lesson_id, content) 
-- VALUES 
--     (1, 1, 'Great lesson! Very helpful for TOEIC preparation.'),
--     (1, 1, 'The audio quality is excellent.'),
--     (2, 1, 'I found this lesson quite challenging but informative.');

-- Insert sample comment replies
-- INSERT INTO comment_replies (user_id, parent_comment_id, content) 
-- VALUES 
--     (2, 1, 'I agree! This lesson really helped me understand the listening section.'),
--     (3, 1, 'Thanks for sharing your experience!');

-- Insert sample feedback
-- INSERT INTO feedback (user_id, subject, content, feedback_type, priority) 
-- VALUES 
--     (1, 'Bug Report', 'The audio is not playing in lesson 5', 'BUG_REPORT', 'HIGH'),
--     (1, 'Feature Request', 'Please add more listening exercises', 'FEATURE_REQUEST', 'MEDIUM'),
--     (2, 'Technical Issue', 'Cannot access premium content', 'TECHNICAL_ISSUE', 'HIGH');

-- Insert sample comment likes
-- INSERT INTO comment_likes (user_id, comment_id, like_type) 
-- VALUES 
--     (2, 1, 'LIKE'),
--     (3, 1, 'LIKE'),
--     (1, 2, 'LIKE');

-- ========================================
-- VIEWS FOR ANALYTICS (Optional)
-- ========================================

-- Create view for comment statistics
CREATE OR REPLACE VIEW comment_statistics AS
SELECT 
    l.id as lesson_id,
    l.title as lesson_title,
    COUNT(c.id) as total_comments,
    COUNT(CASE WHEN c.is_deleted = FALSE THEN 1 END) as active_comments,
    COUNT(r.id) as total_replies,
    COUNT(CASE WHEN r.is_deleted = FALSE THEN 1 END) as active_replies,
    SUM(c.like_count) as total_likes,
    SUM(c.dislike_count) as total_dislikes
FROM lessons l
LEFT JOIN lesson_comments c ON l.id = c.lesson_id
LEFT JOIN comment_replies r ON c.id = r.parent_comment_id
GROUP BY l.id, l.title;

-- Create view for feedback statistics
CREATE OR REPLACE VIEW feedback_statistics AS
SELECT 
    feedback_type,
    priority,
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN is_deleted = FALSE THEN 1 END) as active_count,
    COUNT(CASE WHEN admin_response IS NOT NULL THEN 1 END) as responded_count,
    AVG(CASE WHEN responded_at IS NOT NULL THEN TIMESTAMPDIFF(HOUR, created_at, responded_at) END) as avg_response_hours
FROM feedback
GROUP BY feedback_type, priority, status;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Additional composite indexes for better performance
CREATE INDEX idx_lesson_comments_lesson_created ON lesson_comments(lesson_id, created_at);
CREATE INDEX idx_lesson_comments_user_created ON lesson_comments(user_id, created_at);
CREATE INDEX idx_comment_replies_comment_created ON comment_replies(parent_comment_id, created_at);
CREATE INDEX idx_feedback_status_priority_created ON feedback(status, priority, created_at);
CREATE INDEX idx_feedback_type_priority ON feedback(feedback_type, priority);
CREATE INDEX idx_feedback_user_created ON feedback(user_id, created_at);

-- ========================================
-- TRIGGERS FOR AUTOMATIC UPDATES (Optional)
-- ========================================

-- Trigger to update comment like/dislike counts
DELIMITER //
CREATE TRIGGER update_comment_counts_after_like_insert
AFTER INSERT ON comment_likes
FOR EACH ROW
BEGIN
    IF NEW.comment_id IS NOT NULL THEN
        IF NEW.like_type = 'LIKE' THEN
            UPDATE lesson_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
        ELSE
            UPDATE lesson_comments SET dislike_count = dislike_count + 1 WHERE id = NEW.comment_id;
        END IF;
    END IF;
END//

CREATE TRIGGER update_comment_counts_after_like_delete
AFTER DELETE ON comment_likes
FOR EACH ROW
BEGIN
    IF OLD.comment_id IS NOT NULL THEN
        IF OLD.like_type = 'LIKE' THEN
            UPDATE lesson_comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
        ELSE
            UPDATE lesson_comments SET dislike_count = GREATEST(dislike_count - 1, 0) WHERE id = OLD.comment_id;
        END IF;
    END IF;
END//

CREATE TRIGGER update_comment_counts_after_like_update
AFTER UPDATE ON comment_likes
FOR EACH ROW
BEGIN
    IF NEW.comment_id IS NOT NULL THEN
        -- Remove old like/dislike
        IF OLD.like_type = 'LIKE' THEN
            UPDATE lesson_comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
        ELSE
            UPDATE lesson_comments SET dislike_count = GREATEST(dislike_count - 1, 0) WHERE id = OLD.comment_id;
        END IF;
        
        -- Add new like/dislike
        IF NEW.like_type = 'LIKE' THEN
            UPDATE lesson_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
        ELSE
            UPDATE lesson_comments SET dislike_count = dislike_count + 1 WHERE id = NEW.comment_id;
        END IF;
    END IF;
END//
DELIMITER ; 