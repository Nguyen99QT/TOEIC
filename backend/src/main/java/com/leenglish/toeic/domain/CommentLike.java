package com.leenglish.toeic.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "comment_likes", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"user_id", "comment_id"}),
           @UniqueConstraint(columnNames = {"user_id", "reply_id"})
       })
public class CommentLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private LessonComment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_id")
    private CommentReply reply;

    @Enumerated(EnumType.STRING)
    @Column(name = "like_type", length = 10, nullable = false)
    private LikeType likeType = LikeType.LIKE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public CommentLike() {
    }

    public CommentLike(User user, LessonComment comment, LikeType likeType) {
        this.user = user;
        this.comment = comment;
        this.likeType = likeType;
    }

    public CommentLike(User user, CommentReply reply, LikeType likeType) {
        this.user = user;
        this.reply = reply;
        this.likeType = likeType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LessonComment getComment() {
        return comment;
    }

    public void setComment(LessonComment comment) {
        this.comment = comment;
    }

    public CommentReply getReply() {
        return reply;
    }

    public void setReply(CommentReply reply) {
        this.reply = reply;
    }

    public LikeType getLikeType() {
        return likeType;
    }

    public void setLikeType(LikeType likeType) {
        this.likeType = likeType;
        this.updatedAt = LocalDateTime.now();
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

    // Business Logic Methods
    public boolean isLike() {
        return likeType == LikeType.LIKE;
    }

    public boolean isDislike() {
        return likeType == LikeType.DISLIKE;
    }

    public boolean isForComment() {
        return comment != null;
    }

    public boolean isForReply() {
        return reply != null;
    }

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        if (likeType == null) {
            likeType = LikeType.LIKE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enum for Like Types
    public enum LikeType {
        LIKE,
        DISLIKE
    }
} 