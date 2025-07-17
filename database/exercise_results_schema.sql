-- ================================================================
-- EXERCISE RESULTS TABLE - Track exercise completion by user
-- ================================================================

-- Create exercise_results table to track user completion per exercise
CREATE TABLE IF NOT EXISTS `exercise_results` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `lesson_id` bigint(20) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `answers_correct` int(11) DEFAULT 0,
  `total_questions` int(11) DEFAULT 0,
  `time_taken` int(11) DEFAULT NULL COMMENT 'Time taken in seconds',
  `percentage` decimal(5,2) DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT 1,
  `attempt_number` int(11) DEFAULT 1,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_exercise_attempt` (`user_id`, `exercise_id`, `attempt_number`),
  KEY `idx_user_exercise` (`user_id`, `exercise_id`),
  KEY `idx_lesson_user` (`lesson_id`, `user_id`),
  KEY `idx_exercise_completion` (`exercise_id`, `is_completed`),
  CONSTRAINT `fk_exercise_results_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exercise_results_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================================================
-- USER LESSON PROGRESS TABLE - Track overall lesson progress
-- ================================================================

CREATE TABLE IF NOT EXISTS `user_lesson_progress` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `lesson_id` bigint(20) NOT NULL,
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_exercises` int(11) DEFAULT 0,
  `total_exercises` int(11) DEFAULT 0,
  `time_spent_minutes` int(11) DEFAULT 0,
  `started_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `completed_at` datetime(6) DEFAULT NULL,
  `last_accessed_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_lesson` (`user_id`, `lesson_id`),
  KEY `idx_user_progress` (`user_id`, `is_completed`),
  KEY `idx_lesson_progress` (`lesson_id`, `is_completed`),
  CONSTRAINT `fk_user_lesson_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_lesson_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- Additional indexes for faster queries
CREATE INDEX `idx_exercise_results_created` ON `exercise_results` (`created_at`);
CREATE INDEX `idx_exercise_results_score` ON `exercise_results` (`score` DESC);
CREATE INDEX `idx_user_lesson_progress_updated` ON `user_lesson_progress` (`last_accessed_at`);

-- ================================================================
-- SAMPLE DATA FOR TESTING
-- ================================================================

-- Insert some test data (uncomment if needed)
-- INSERT INTO `exercise_results` (`user_id`, `exercise_id`, `lesson_id`, `score`, `answers_correct`, `total_questions`, `time_taken`, `percentage`, `is_completed`) VALUES
-- (10, 4, 2, 33.33, 1, 3, 600, 33.33, 1),
-- (10, 5, 2, 80.00, 4, 5, 300, 80.00, 1);

-- INSERT INTO `user_lesson_progress` (`user_id`, `lesson_id`, `progress_percentage`, `is_completed`, `completed_exercises`, `total_exercises`, `time_spent_minutes`) VALUES
-- (10, 1, 100.00, 1, 3, 3, 25),
-- (10, 2, 66.67, 0, 2, 3, 15);
