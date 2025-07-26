-- Create question_groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS question_groups (
    group_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    test_id BIGINT,
    part_number INT,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(test_id)
);

-- Check if we have any question groups
SELECT COUNT(*) as question_group_count FROM question_groups;

-- Create question groups for Parts 6 & 7 if they don't exist
INSERT INTO question_groups (part_number, test_id, content, title, created_at, updated_at)
SELECT 6, 2, 
'Windsor Regional Bank is pleased to announce the opening of our newest branch office in downtown Windsor. This expansion represents our continued commitment to serving the financial needs of the Windsor community. Our new location features modern facilities, convenient parking, and extended hours to better serve our customers. We have hired experienced staff members who are fluent in both English and French to provide excellent customer service. The Windsor branch will offer all of our standard banking services, including personal and business accounts, loans, and investment services. We look forward to welcoming new customers and continuing to serve our existing clients in this vibrant community.',
'Bank Branch Opening Announcement',
NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM question_groups WHERE part_number = 6 AND test_id = 2);

INSERT INTO question_groups (part_number, test_id, content, title, created_at, updated_at)
SELECT 7, 2,
'MEMO
TO: All Staff Members
FROM: Sarah Johnson, Human Resources Director  
DATE: March 15, 2024
RE: New Employee Training Program

We are excited to announce the launch of our comprehensive new employee training program, which will begin on April 1st. This program has been designed to help new team members integrate more effectively into our company culture and develop the skills necessary for success in their roles.

The training program will consist of three phases:
1. Orientation Week: Introduction to company policies, procedures, and systems
2. Department-Specific Training: Hands-on learning with experienced mentors
3. Professional Development: Skills workshops and career planning sessions

All new employees will be required to complete this program within their first 90 days. Current employees who wish to participate in the professional development workshops may register through the HR portal. Please contact me if you have any questions about this exciting new initiative.',
'Employee Training Program Memo',
NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM question_groups WHERE part_number = 7 AND test_id = 2);

-- Check if questions table has group_id column
DESCRIBE questions;

-- Add group_id column to questions table if it doesn't exist
ALTER TABLE questions ADD COLUMN IF NOT EXISTS group_id BIGINT;
ALTER TABLE questions ADD FOREIGN KEY IF NOT EXISTS (group_id) REFERENCES question_groups(group_id);

-- Link existing Part 6 questions to their question group
UPDATE questions q
JOIN test_questions tq ON q.question_id = tq.question_id
SET q.group_id = (SELECT group_id FROM question_groups WHERE part_number = 6 AND test_id = 2 LIMIT 1)
WHERE tq.test_id = 2 AND tq.part_number = 6 AND q.group_id IS NULL;

-- Link existing Part 7 questions to their question group  
UPDATE questions q
JOIN test_questions tq ON q.question_id = tq.question_id
SET q.group_id = (SELECT group_id FROM question_groups WHERE part_number = 7 AND test_id = 2 LIMIT 1)
WHERE tq.test_id = 2 AND tq.part_number = 7 AND q.group_id IS NULL;

-- Verify the setup
SELECT 
    qg.group_id, 
    qg.part_number, 
    qg.title,
    SUBSTRING(qg.content, 1, 80) as content_preview,
    COUNT(q.question_id) as linked_questions
FROM question_groups qg
LEFT JOIN questions q ON qg.group_id = q.group_id  
WHERE qg.part_number IN (6, 7)
GROUP BY qg.group_id, qg.part_number, qg.title, qg.content;
