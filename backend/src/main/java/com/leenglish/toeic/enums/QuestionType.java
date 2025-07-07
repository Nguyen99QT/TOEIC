package com.leenglish.toeic.enums;

public enum QuestionType {
    MULTIPLE_CHOICE("Multiple Choice"),
    FILL_IN_BLANK("Fill in the Blank"),
    TRUE_FALSE("True/False"),
    SHORT_ANSWER("Short Answer"),
    ESSAY("Essay");

    private final String displayName;

    QuestionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean hasOptions() {
        return this == MULTIPLE_CHOICE || this == TRUE_FALSE;
    }
}
