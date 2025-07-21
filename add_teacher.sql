INSERT INTO user (
    username, email, password_hash, full_name, phone, date_of_birth, country,
    total_score, is_active, is_premium, profile_picture_url, last_login,
    created_at, updated_at, gender, role, membership_type
) VALUES (
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
    'VIP'
);
