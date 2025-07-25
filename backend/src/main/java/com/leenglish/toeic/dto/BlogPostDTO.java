package com.leenglish.toeic.dto;

import com.leenglish.toeic.blog.BlogPost;
import jakarta.servlet.http.HttpServletRequest;

public class BlogPostDTO {
    private Long id;
    private String author;
    private String content;
    private String title;
    private String imageUrl;
    private String pdfUrl;
    private String videoUrl;
    private Boolean hidden;
    private java.sql.Timestamp createdAt;

    public BlogPostDTO(BlogPost blog, String absoluteImageUrl, String absoluteVideoUrl, String absolutePdfUrl) {
        this.id = blog.getId();
        this.author = blog.getAuthor();
        this.content = blog.getContent();
        this.title = blog.getTitle();
        this.pdfUrl = absolutePdfUrl;
        this.videoUrl = absoluteVideoUrl;
        this.hidden = blog.getHidden();
        this.createdAt = blog.getCreatedAt();
        this.imageUrl = absoluteImageUrl;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
