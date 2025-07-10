package com.leenglish.toeic.enums;

/**
 * Exercise types for TOEIC platform
 */
public enum ExerciseType {
    LISTENING("Listening"),
    READING("Reading"),
    VOCABULARY("Vocabulary"),
    GRAMMAR("Grammar"),
    SPEAKING("Speaking"),
    WRITING("Writing"),
    MIXED("Mixed");

    private final String displayName;

    ExerciseType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
