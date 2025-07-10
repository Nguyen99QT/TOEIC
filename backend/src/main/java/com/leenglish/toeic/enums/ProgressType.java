package com.leenglish.toeic.enums;

public enum ProgressType {
    LESSON_STARTED("Lesson Started"),
    LESSON_COMPLETED("Lesson Completed"),
    EXERCISE_STARTED("Exercise Started"),
    EXERCISE_COMPLETED("Exercise Completed"),
    QUESTION_ANSWERED("Question Answered");

    private final String displayName;

    ProgressType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
