package com.leenglish.toeic.controller;

import com.leenglish.toeic.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/blog/{blogPostId}/likes")
public class LikeController {

    private static final Logger logger = LoggerFactory.getLogger(LikeController.class);

    @Autowired
    private LikeService likeService;

    @PostMapping
    public ResponseEntity<Long> toggleLike(@PathVariable Long blogPostId, @RequestParam Long userId) {
        try {
            logger.info("Toggle like for blog post {} by user {}", blogPostId, userId);

            if (likeService.isLiked(blogPostId, userId)) {
                likeService.unlikeBlogPost(blogPostId, userId);
                logger.info("User {} unliked blog post {}", userId, blogPostId);
            } else {
                likeService.likeBlogPost(blogPostId, userId);
                logger.info("User {} liked blog post {}", userId, blogPostId);
            }

            Long likeCount = likeService.countLikes(blogPostId);
            logger.info("Blog post {} now has {} likes", blogPostId, likeCount);

            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            logger.error("Error toggling like for blog post {} by user {}: {}", blogPostId, userId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(0L);
        }
    }

    @GetMapping
    public ResponseEntity<Long> countLikes(@PathVariable Long blogPostId) {
        try {
            logger.info("Getting like count for blog post {}", blogPostId);
            Long likeCount = likeService.countLikes(blogPostId);
            logger.info("Blog post {} has {} likes", blogPostId, likeCount);
            return ResponseEntity.ok(likeCount);
        } catch (Exception e) {
            logger.error("Error getting like count for blog post {}: {}", blogPostId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(0L);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkUserLikeStatus(@PathVariable Long blogPostId, @RequestParam Long userId) {
        try {
            logger.info("Checking like status for blog post {} by user {}", blogPostId, userId);
            boolean isLiked = likeService.isLiked(blogPostId, userId);
            logger.info("User {} like status for blog post {}: {}", userId, blogPostId, isLiked);
            return ResponseEntity.ok(isLiked);
        } catch (Exception e) {
            logger.error("Error checking like status for blog post {} by user {}: {}", blogPostId, userId,
                    e.getMessage(), e);
            return ResponseEntity.internalServerError().body(false);
        }
    }
}
