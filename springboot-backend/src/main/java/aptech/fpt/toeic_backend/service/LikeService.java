/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.service;

import aptech.fpt.toeic_backend.entity.Like;
import aptech.fpt.toeic_backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author HP
 */
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
        // Nếu đã like thì thôi, không làm gì thêm
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
}

