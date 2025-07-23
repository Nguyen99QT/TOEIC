package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.Like;
import com.leenglish.toeic.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class LikeService {

    private static final Logger logger = LoggerFactory.getLogger(LikeService.class);

    @Autowired
    private LikeRepository likeRepository;

    public void likeBlogPost(Long blogPostId, Long userId) {
        try {
            if (!likeRepository.existsByBlogPostIdAndUserId(blogPostId, userId)) {
                Like like = new Like(blogPostId, userId);
                likeRepository.save(like);
                logger.info("User {} successfully liked blog post {}", userId, blogPostId);
            } else {
                logger.info("User {} already liked blog post {}", userId, blogPostId);
            }
        } catch (Exception e) {
            logger.error("Error liking blog post {} by user {}: {}", blogPostId, userId, e.getMessage(), e);
            throw e;
        }
    }

    public void unlikeBlogPost(Long blogPostId, Long userId) {
        try {
            Like like = likeRepository.findByBlogPostIdAndUserId(blogPostId, userId);
            if (like != null) {
                likeRepository.delete(like);
                logger.info("User {} successfully unliked blog post {}", userId, blogPostId);
            } else {
                logger.info("User {} hasn't liked blog post {} yet", userId, blogPostId);
            }
        } catch (Exception e) {
            logger.error("Error unliking blog post {} by user {}: {}", blogPostId, userId, e.getMessage(), e);
            throw e;
        }
    }

    public Long countLikes(Long blogPostId) {
        try {
            Long count = likeRepository.countByBlogPostId(blogPostId);
            logger.debug("Blog post {} has {} likes", blogPostId, count);
            return count;
        } catch (Exception e) {
            logger.error("Error counting likes for blog post {}: {}", blogPostId, e.getMessage(), e);
            return 0L;
        }
    }

    public boolean isLiked(Long blogPostId, Long userId) {
        try {
            boolean liked = likeRepository.existsByBlogPostIdAndUserId(blogPostId, userId);
            logger.debug("User {} like status for blog post {}: {}", userId, blogPostId, liked);
            return liked;
        } catch (Exception e) {
            logger.error("Error checking like status for blog post {} by user {}: {}", blogPostId, userId,
                    e.getMessage(), e);
            return false;
        }
    }
}
