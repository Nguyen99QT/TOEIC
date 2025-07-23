package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.Comment;
import com.leenglish.toeic.dto.CommentDTO;
import com.leenglish.toeic.repository.CommentRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.domain.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentDTO addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // Get username for response
        User user = userRepository.findById(savedComment.getUserId()).orElse(null);
        String username = user != null ? user.getUsername() : "Unknown User";

        return new CommentDTO(
                savedComment.getId(),
                savedComment.getBlogPostId(),
                savedComment.getUserId(),
                username,
                savedComment.getContent(),
                savedComment.getCreatedAt());
    }

    public List<CommentDTO> getCommentsByBlogPostId(Long blogPostId) {
        List<Comment> comments = commentRepository.findByBlogPostIdOrderByCreatedAtDesc(blogPostId);

        return comments.stream().map(comment -> {
            User user = userRepository.findById(comment.getUserId()).orElse(null);
            String username = user != null ? user.getUsername() : "Unknown User";

            return new CommentDTO(
                    comment.getId(),
                    comment.getBlogPostId(),
                    comment.getUserId(),
                    username,
                    comment.getContent(),
                    comment.getCreatedAt());
        }).collect(Collectors.toList());
    }
}
