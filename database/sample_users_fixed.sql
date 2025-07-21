-- ====================================================
-- SAMPLE USERS FOR TOEIC LEARNING PLATFORM
-- ====================================================
-- Generated: December 2024
-- Description: Sample user accounts for testing login and functionality
-- Password: All accounts use 'password123' (hashed with BCrypt)

-- BCrypt hash for 'password123' (strength 12 - matches backend config)
-- $2a$12$thqpN0KEeKMZm7qdHyiBCezcRuFGoV.UAz79Jo.OJkQIiAN4iouzG

-- ====================================================
-- ADMIN USERS
-- ====================================================

INSERT INTO user (
    username, email, password_hash, full_name, phone, date_of_birth, country,
    total_score, is_active, is_premium, profile_picture_url, last_login,
    created_at, updated_at, gender, role, membership_type
) VALUES 
(
    'admin', 
    'admin@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'System Administrator',
    '+84901234567',
    '1985-01-15',
    'Vietnam',
    990,
    true,
    true,
    'https://example.com/admin-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'MALE',
    'ADMIN',
    'VIP'
),
(
    'teacher1', 
    'teacher@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Nguyễn Thị Hương',
    '+84987654321',
    '1988-03-22',
    'Vietnam',
    950,
    true,
    true,
    'https://example.com/teacher-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'FEMALE',
    'COLLABORATOR',
    'PREMIUM'
);

-- ====================================================
-- STUDENT USERS
-- ====================================================

INSERT INTO user (
    username, email, password_hash, full_name, phone, date_of_birth, country,
    total_score, is_active, is_premium, profile_picture_url, last_login,
    created_at, updated_at, gender, role, membership_type
) VALUES 
(
    'student1', 
    'student1@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Trần Văn Minh',
    '+84912345678',
    '1995-05-10',
    'Vietnam',
    650,
    true,
    true,
    'https://example.com/student1-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'MALE',
    'USER',
    'PREMIUM'
),
(
    'student2', 
    'student2@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Lê Thị Mai',
    '+84923456789',
    '1997-08-18',
    'Vietnam',
    720,
    true,
    false,
    'https://example.com/student2-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'FEMALE',
    'USER',
    'BASIC'
),
(
    'student3', 
    'student3@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Phạm Hoàng Nam',
    '+84934567890',
    '1996-12-03',
    'Vietnam',
    580,
    true,
    false,
    'https://example.com/student3-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'MALE',
    'USER',
    'BASIC'
),
(
    'student4', 
    'student4@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Nguyễn Thị Lan',
    '+84945678901',
    '1994-07-25',
    'Vietnam',
    820,
    true,
    true,
    'https://example.com/student4-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'FEMALE',
    'USER',
    'VIP'
),
(
    'demo_user', 
    'demo@toeic.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Demo User',
    '+84956789012',
    '1990-01-01',
    'Vietnam',
    0,
    true,
    false,
    'https://example.com/demo-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'OTHER',
    'USER',
    'BASIC'
);

-- ====================================================
-- INTERNATIONAL USERS (for testing diversity)
-- ====================================================

INSERT INTO user (
    username, email, password_hash, full_name, phone, date_of_birth, country,
    total_score, is_active, is_premium, profile_picture_url, last_login,
    created_at, updated_at, gender, role, membership_type
) VALUES 
(
    'john_doe', 
    'john.doe@email.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'John Doe',
    '+1234567890',
    '1992-04-15',
    'United States',
    780,
    true,
    true,
    'https://example.com/john-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'MALE',
    'USER',
    'PREMIUM'
),
(
    'yuki_tanaka', 
    'yuki@email.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Yuki Tanaka',
    '+81901234567',
    '1993-09-12',
    'Japan',
    890,
    true,
    true,
    'https://example.com/yuki-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'FEMALE',
    'USER',
    'VIP'
),
(
    'kim_sora', 
    'sora.kim@email.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K',
    'Kim Sora',
    '+82101234567',
    '1991-11-28',
    'South Korea',
    845,
    true,
    false,
    'https://example.com/sora-avatar.jpg',
    NOW(),
    NOW(),
    NOW(),
    'FEMALE',
    'USER',
    'BASIC'
);

-- ====================================================
-- VERIFY INSERTION
-- ====================================================

-- Check if user were inserted successfully
SELECT 
    id, username, email, full_name, role, membership_type, is_premium, total_score 
FROM user 
ORDER BY role DESC, username ASC;

-- ====================================================
-- LOGIN CREDENTIALS FOR TESTING
-- ====================================================

/*
TESTING ACCOUNTS:
==================

ADMIN ACCOUNT:
- Username: admin
- Email: admin@toeic.com
- Password: password123
- Role: ADMIN
- Features: Full access to all admin features

TEACHER ACCOUNT:
- Username: teacher1
- Email: teacher@toeic.com
- Password: password123
- Role: COLLABORATOR
- Features: Can create/edit content

STUDENT ACCOUNTS:
- Username: student1 | Email: student1@toeic.com | Password: password123 | Premium User
- Username: student2 | Email: student2@toeic.com | Password: password123 | Basic User
- Username: student3 | Email: student3@toeic.com | Password: password123 | Basic User
- Username: student4 | Email: student4@toeic.com | Password: password123 | VIP User

DEMO ACCOUNT:
- Username: demo_user | Email: demo@toeic.com | Password: password123 | Basic User

INTERNATIONAL USERS:
- Username: john_doe | Email: john.doe@email.com | Password: password123 | Premium User (US)
- Username: yuki_tanaka | Email: yuki@email.com | Password: password123 | VIP User (Japan)
- Username: kim_sora | Email: sora.kim@email.com | Password: password123 | Basic User (Korea)

PASSWORD FOR ALL ACCOUNTS: password123
*/
