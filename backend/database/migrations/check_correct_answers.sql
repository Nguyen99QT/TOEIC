-- SQL script để kiểm tra đáp án đúng và dữ liệu câu hỏi

-- Lấy danh sách câu hỏi và đáp án của Exercise 7
SELECT 
    q.id,
    q.question_order,
    SUBSTRING(q.question_text, 1, 50) AS question_text,
    q.option_a,
    q.option_b,
    q.option_c, 
    q.option_d,
    q.correct_answer,
    q.audio_url,
    q.image_url
FROM 
    questions q
JOIN 
    exercises e ON q.exercise_id = e.id
WHERE 
    e.id = 7
ORDER BY 
    q.question_order;

-- Kiểm tra đáp án đúng cho câu hỏi về thủ đô của Nhật Bản
SELECT 
    q.id,
    q.question_text,
    q.option_a,
    q.option_b, 
    q.option_c,
    q.option_d,
    q.correct_answer
FROM 
    questions q
WHERE 
    q.question_text LIKE '%capital of Japan%';
