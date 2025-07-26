-- Update content using question_test and question_groups for Parts 6 & 7
-- This will add reading passages to make Parts 6 & 7 questions complete

-- First, check current state of question_test and question_groups
SELECT 
    qt.part_number,
    COUNT(qt.question_id) as question_count,
    qg.group_id,
    qg.title,
    CASE 
        WHEN qg.content IS NOT NULL AND LENGTH(qg.content) > 50 THEN 'Has Content'
        ELSE 'No Content'
    END as content_status
FROM question_test qt
LEFT JOIN question_groups qg ON qt.group_id = qg.group_id
WHERE qt.part_number IN (6, 7)
GROUP BY qt.part_number, qg.group_id, qg.title, qg.content;

-- Update question_test to link Part 6 questions to the correct group (group_id = 1)
UPDATE question_test 
SET group_id = 1
WHERE part_number = 6;

-- Update question_test to link Part 7 questions to the correct group (group_id = 2)  
UPDATE question_test 
SET group_id = 2
WHERE part_number = 7;

-- Verify the updates
SELECT 
    qt.part_number,
    qt.question_id,
    qg.group_id,
    SUBSTRING(qg.content, 1, 100) as content_preview,
    CASE 
        WHEN qg.content IS NOT NULL AND LENGTH(qg.content) > 50 THEN 'Updated'
        ELSE 'No Content'
    END as update_status
FROM question_test qt
LEFT JOIN question_groups qg ON qt.group_id = qg.group_id
WHERE qt.part_number IN (6, 7)
ORDER BY qt.part_number, qt.question_order;
