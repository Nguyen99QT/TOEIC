package com.leenglish.toeic.enums;

public enum QuestionDifficulty {
    EASY("Easy"),
    MEDIUM("Medium"),
    HARD("Hard");

    private final String displayName;

    QuestionDifficulty(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getPoints() {
        return switch (this) {
            case EASY -> 3;
            case MEDIUM -> 5;
            case HARD -> 7;
        };
    }
}
