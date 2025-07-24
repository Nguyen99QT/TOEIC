/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.repository;

import aptech.fpt.toeic_backend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByBlogPostIdAndUserId(Long blogPostId, Long userId);
    Like findByBlogPostIdAndUserId(Long blogPostId, Long userId);
    Long countByBlogPostId(Long blogPostId);
}

