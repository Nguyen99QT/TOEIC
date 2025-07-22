package com.leenglish.toeic.controller;

import com.leenglish.toeic.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blog/{blogPostId}/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping
    public Long toggleLike(@PathVariable Long blogPostId, @RequestParam Long userId) {
        if (likeService.isLiked(blogPostId, userId)) {
            likeService.unlikeBlogPost(blogPostId, userId);
        } else {
            likeService.likeBlogPost(blogPostId, userId);
        }
        return likeService.countLikes(blogPostId);
    }

    @GetMapping
    public Long countLikes(@PathVariable Long blogPostId) {
        return likeService.countLikes(blogPostId);
    }
}
