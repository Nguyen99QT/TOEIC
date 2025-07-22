package com.leenglish.toeic.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_like")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long blogPostId;
    private Long userId;
    // Getter và Setter
    public Long getBlogPostId() { return blogPostId; }
    public void setBlogPostId(Long blogPostId) { this.blogPostId = blogPostId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
