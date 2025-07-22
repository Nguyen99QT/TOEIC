package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.Like;
import com.leenglish.toeic.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
    @Autowired
    private LikeRepository likeRepository;

    public void likeBlogPost(Long blogPostId, Long userId) {
        if (!likeRepository.existsByBlogPostIdAndUserId(blogPostId, userId)) {
            Like like = new Like();
            like.setBlogPostId(blogPostId);
            like.setUserId(userId);
            likeRepository.save(like);
        }
    }

    public void unlikeBlogPost(Long blogPostId, Long userId) {
        Like like = likeRepository.findByBlogPostIdAndUserId(blogPostId, userId);
        if (like != null) {
            likeRepository.delete(like);
        }
    }

    public Long countLikes(Long blogPostId) {
        return likeRepository.countByBlogPostId(blogPostId);
    }

    public boolean isLiked(Long blogPostId, Long userId) {
        return likeRepository.existsByBlogPostIdAndUserId(blogPostId, userId);
    }
}
