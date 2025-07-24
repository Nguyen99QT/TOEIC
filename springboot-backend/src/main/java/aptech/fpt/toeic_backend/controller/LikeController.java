/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.controller;


import aptech.fpt.toeic_backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/blog/{blogPostId}/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping
public Long likeBlogPost(@PathVariable Long blogPostId, @RequestParam Long userId) {
    System.out.println("blogPostId: " + blogPostId + ", userId: " + userId);
    likeService.likeBlogPost(blogPostId, userId);
    return likeService.countLikes(blogPostId);
}


    // (Nếu muốn bỏ like thì thêm endpoint delete)
    @PostMapping("/unlike")
    public Long unlikeBlogPost(@PathVariable Long blogPostId, @RequestParam Long userId) {
        likeService.unlikeBlogPost(blogPostId, userId);
        return likeService.countLikes(blogPostId);
    }

    @GetMapping
    public Long countLikes(@PathVariable Long blogPostId) {
        return likeService.countLikes(blogPostId);
    }
}

