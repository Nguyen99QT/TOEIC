package com.leenglish.toeic.enums;

public enum ActivityType {
    LESSON_COMPLETED("Lesson Completed"),
    PRACTICE_TEST("Practice Test"),
    FLASHCARD_STUDY("Flashcard Study"),
    EXERCISE_COMPLETED("Exercise Completed"),
    ACHIEVEMENT_EARNED("Achievement Earned"),
    LOGIN("Login"),
    STREAK_MILESTONE("Streak Milestone"),
    SCORE_IMPROVEMENT("Score Improvement"),
    QUESTION_ANSWERED("Question Answered");

    private final String displayName;

    ActivityType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
