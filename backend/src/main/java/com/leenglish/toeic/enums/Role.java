package com.leenglish.toeic.enums;

public enum Role {
    USER("User"), // Chỉ xem và làm bài
    COLLABORATOR("Collaborator"), // Có thể tạo/sửa content
    ADMIN("Admin"); // Full permissions

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    // ✅ Permission matrices
    public boolean canEditLessons() {
        return this == ADMIN || this == COLLABORATOR;
    }

    public boolean canEditExercises() {
        return this == ADMIN || this == COLLABORATOR;
    }

    public boolean canEditFlashcards() {
        return this == ADMIN || this == COLLABORATOR;
    }

    public boolean canManageUsers() {
        return this == ADMIN;
    }

    public boolean canViewAnalytics() {
        return this == ADMIN || this == COLLABORATOR;
    }

    public boolean canDeleteContent() {
        return this == ADMIN; // Only admin can delete
    }

    public boolean canPublishContent() {
        return this == ADMIN || this == COLLABORATOR;
    }
}
