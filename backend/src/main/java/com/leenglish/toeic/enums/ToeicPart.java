package com.leenglish.toeic.enums;

/**
 * TOEIC Test Parts
 */
public enum ToeicPart {
    PART_1("Part 1 - Photographs"),
    PART_2("Part 2 - Question-Response"),
    PART_3("Part 3 - Conversations"),
    PART_4("Part 4 - Short Talks"),
    PART_5("Part 5 - Incomplete Sentences"),
    PART_6("Part 6 - Text Completion"),
    PART_7("Part 7 - Reading Comprehension");

    private final String displayName;

    ToeicPart(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
