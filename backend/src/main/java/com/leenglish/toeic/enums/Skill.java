package com.leenglish.toeic.enums;

public enum Skill {
    LISTENING("Listening"),
    READING("Reading"),
    GRAMMAR("Grammar"),
    VOCABULARY("Vocabulary"),
    SPEAKING("Speaking"),
    WRITING("Writing");

    private final String displayName;

    Skill(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
