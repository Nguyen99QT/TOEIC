package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class BlogPostWithStatsDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdAt;
    private String imageUrl;
    private String videoUrl;
    private String pdfUrl;
    private Long likes;
    private Long comments;
    private Boolean hidden;

    // Constructors
    public BlogPostWithStatsDTO() {
    }

    public BlogPostWithStatsDTO(Long id, String title, String content, String author,
            LocalDateTime createdAt, String imageUrl, String videoUrl,
            String pdfUrl, Long likes, Long comments, Boolean hidden) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.pdfUrl = pdfUrl;
        this.likes = likes;
        this.comments = comments;
        this.hidden = hidden;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public Long getLikes() {
        return likes;
    }

    public void setLikes(Long likes) {
        this.likes = likes;
    }

    public Long getComments() {
        return comments;
    }

    public void setComments(Long comments) {
        this.comments = comments;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }
}
