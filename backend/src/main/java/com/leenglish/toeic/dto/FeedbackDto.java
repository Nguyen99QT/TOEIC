package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

import com.leenglish.toeic.domain.Feedback.FeedbackType;
import com.leenglish.toeic.domain.Feedback.Priority;
import com.leenglish.toeic.domain.Feedback.Status;

public class FeedbackDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String subject;
    private String content;
    private FeedbackType feedbackType;
    private Priority priority;
    private Status status;
    private Boolean isAnonymous;
    private String contactEmail;
    private String contactPhone;
    private String adminResponse;
    private Long respondedBy;
    private String respondedByUserName;
    private LocalDateTime respondedAt;
    private Boolean isEdited;
    private LocalDateTime editedAt;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean canEdit;
    private Boolean canDelete;
    private Boolean canRespond;

    // Constructors
    public FeedbackDto() {
    }

    public FeedbackDto(Long id, Long userId, String userName, String subject, String content, FeedbackType feedbackType) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.subject = subject;
        this.content = content;
        this.feedbackType = feedbackType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserAvatar() {
        return userAvatar;
    }

    public void setUserAvatar(String userAvatar) {
        this.userAvatar = userAvatar;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public FeedbackType getFeedbackType() {
        return feedbackType;
    }

    public void setFeedbackType(FeedbackType feedbackType) {
        this.feedbackType = feedbackType;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public Long getRespondedBy() {
        return respondedBy;
    }

    public void setRespondedBy(Long respondedBy) {
        this.respondedBy = respondedBy;
    }

    public String getRespondedByUserName() {
        return respondedByUserName;
    }

    public void setRespondedByUserName(String respondedByUserName) {
        this.respondedByUserName = respondedByUserName;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public Boolean getIsEdited() {
        return isEdited;
    }

    public void setIsEdited(Boolean isEdited) {
        this.isEdited = isEdited;
    }

    public LocalDateTime getEditedAt() {
        return editedAt;
    }

    public void setEditedAt(LocalDateTime editedAt) {
        this.editedAt = editedAt;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getCanEdit() {
        return canEdit;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getCanDelete() {
        return canDelete;
    }

    public void setCanDelete(Boolean canDelete) {
        this.canDelete = canDelete;
    }

    public Boolean getCanRespond() {
        return canRespond;
    }

    public void setCanRespond(Boolean canRespond) {
        this.canRespond = canRespond;
    }

    // Additional methods for compatibility with ExerciseResultService
    public Long getLessonId() {
        return null; // This is not applicable for admin feedback
    }

    public void setLessonId(Long lessonId) {
        // This is not applicable for admin feedback
    }

    public Long getExerciseId() {
        return null; // This is not applicable for admin feedback
    }

    public void setExerciseId(Long exerciseId) {
        // This is not applicable for admin feedback
    }

    public Integer getRating() {
        return null; // This is not applicable for admin feedback
    }

    public void setRating(Integer rating) {
        // This is not applicable for admin feedback
    }

    public String getComment() {
        return content; // Use content as comment for compatibility
    }

    public void setComment(String comment) {
        this.content = comment; // Use content as comment for compatibility
    }
}
