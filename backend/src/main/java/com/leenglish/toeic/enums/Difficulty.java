package com.leenglish.toeic.enums;

/**
 * Difficulty levels for TOEIC exercises
 */
public enum Difficulty {
    EASY("Easy"),
    BEGINNER("Beginner"),
    INTERMEDIATE("Intermediate"),
    ADVANCED("Advanced"),
    EXPERT("Expert");

    private final String displayName;

    Difficulty(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
