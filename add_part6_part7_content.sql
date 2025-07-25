-- Add sample content for Part 6 and Part 7 questions

-- First, let's see what question groups exist for Part 6 and 7
SELECT qg.group_id, qg.title, qg.description, qg.content, p.part_number 
FROM question_groups qg 
JOIN parts p ON qg.part_id = p.part_id 
WHERE p.part_number IN (6, 7);

-- If no groups exist, we need to create some
-- Let's check what question_test records exist for parts 6 and 7
SELECT qt.question_id, qt.part_number, qt.group_id
FROM question_test qt 
WHERE qt.part_number IN (6, 7)
ORDER BY qt.part_number, qt.question_order;

-- Update existing groups or create new ones
-- Part 6 - Text Completion
INSERT INTO question_groups (title, description, content, part_id, created_by) 
SELECT 
    'Business Email - Text Completion',
    'Complete the text by choosing the best option for each blank',
    'Subject: Regarding Our New Branch Office

Dear Team,

I am pleased to announce that our company will be expanding its operations this year. ------- (131) new employees for our upcoming Windsor location has been a priority for the management team. The human resources department has been working diligently to find qualified candidates who meet our high standards.

Our technical support team has been ------- (132) the new office systems will integrate seamlessly with our existing infrastructure. We believe ------- (133) this expansion will allow us to better serve our clients in the region.

The new branch will focus on providing ------- (134) customer service to our growing client base. All staff members will undergo comprehensive training to ensure they are fully prepared for their new roles.

We are confident that this expansion will strengthen our position in the market and contribute to the company''s continued success.

Best regards,
Regional Manager',
    (SELECT part_id FROM parts WHERE part_number = 6),
    (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM question_groups qg 
    JOIN parts p ON qg.part_id = p.part_id 
    WHERE p.part_number = 6
);

-- Part 7 - Reading Comprehension
INSERT INTO question_groups (title, description, content, part_id, created_by)
SELECT 
    'Company Memo - Reading Comprehension',
    'Read the passage and answer the questions',
    'MEMO

TO: All Staff Members
FROM: Human Resources Department  
DATE: July 15, 2024
RE: Holiday Schedule Policy Update

We would like to inform all employees about an important update to our holiday request policy that will take effect immediately.

Due to the upcoming July 4th holiday weekend and the high volume of vacation requests we have received, we need to implement temporary scheduling adjustments. We have discovered that 35% of our planned staff have requested time off on July 5th, which exceeds our maximum allowable absence rate of 25%.

To ensure adequate coverage during this busy period, we are implementing the following temporary measures:

1. All time-off requests for July 5th and July 6th must be approved by department supervisors
2. Priority will be given to requests submitted before June 22nd
3. Emergency staffing procedures will be in effect for the entire holiday weekend

Please note that this is a temporary measure and our regular policies will resume on July 8th. We appreciate your understanding and cooperation during this transition period.

If you have any questions about these temporary changes, please contact your immediate supervisor or the HR department at extension 2847.

Thank you for your continued dedication to maintaining our high standards of customer service.

Human Resources Department',
    (SELECT part_id FROM parts WHERE part_number = 7),
    (SELECT user_id FROM users WHERE username = 'admin' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM question_groups qg 
    JOIN parts p ON qg.part_id = p.part_id 
    WHERE p.part_number = 7
);

-- Now update the question_test records to associate them with the groups
UPDATE question_test qt 
SET group_id = (
    SELECT qg.group_id 
    FROM question_groups qg 
    JOIN parts p ON qg.part_id = p.part_id 
    WHERE p.part_number = 6 
    LIMIT 1
)
WHERE qt.part_number = 6 AND qt.group_id IS NULL;

UPDATE question_test qt 
SET group_id = (
    SELECT qg.group_id 
    FROM question_groups qg 
    JOIN parts p ON qg.part_id = p.part_id 
    WHERE p.part_number = 7 
    LIMIT 1
)
WHERE qt.part_number = 7 AND qt.group_id IS NULL;

-- Verify the updates
SELECT 
    qt.question_id, 
    qt.part_number, 
    qt.question_text,
    qg.title as group_title,
    LEFT(qg.content, 100) as content_preview
FROM question_test qt 
LEFT JOIN question_groups qg ON qt.group_id = qg.group_id
WHERE qt.part_number IN (6, 7)
ORDER BY qt.part_number, qt.question_order;
