package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;
    private Long blogPostId;
    private Long userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;

    // Constructors
    public CommentDTO() {
    }

    public CommentDTO(Long id, Long blogPostId, Long userId, String username, String content, LocalDateTime createdAt) {
        this.id = id;
        this.blogPostId = blogPostId;
        this.userId = userId;
        this.username = username;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBlogPostId() {
        return blogPostId;
    }

    public void setBlogPostId(Long blogPostId) {
        this.blogPostId = blogPostId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
