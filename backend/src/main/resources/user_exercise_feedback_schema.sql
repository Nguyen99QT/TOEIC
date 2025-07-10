-- Bảng lưu kết quả làm bài tập của user
CREATE TABLE IF NOT EXISTS user_exercise_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    score INT NOT NULL,
    answers_correct INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken INT,
    completed_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Bảng lưu chi tiết các câu trả lời của user
CREATE TABLE IF NOT EXISTS user_question_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    result_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_answer VARCHAR(1),
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (result_id) REFERENCES user_exercise_results(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Bảng lưu feedback của user sau khi làm bài
CREATE TABLE IF NOT EXISTS user_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    exercise_id BIGINT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    submitted_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Index cho truy vấn thống kê
CREATE INDEX idx_user_exercise ON user_exercise_results(user_id, exercise_id);
CREATE INDEX idx_exercise_completion ON user_exercise_results(exercise_id, completed_at);
CREATE INDEX idx_feedback_rating ON user_feedback(lesson_id, exercise_id, rating);
