package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByBlogPostIdAndUserId(Long blogPostId, Long userId);
    Like findByBlogPostIdAndUserId(Long blogPostId, Long userId);
    Long countByBlogPostId(Long blogPostId);
}
