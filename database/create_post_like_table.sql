-- Create post_like table for blog post likes functionality
CREATE TABLE IF NOT EXISTS post_like (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blog_post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (blog_post_id, user_id),
    FOREIGN KEY (blog_post_id) REFERENCES blog_post(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add index for better performance
CREATE INDEX idx_post_like_blog_post_id ON post_like(blog_post_id);
CREATE INDEX idx_post_like_user_id ON post_like(user_id);

-- Verify table creation
DESCRIBE post_like;
