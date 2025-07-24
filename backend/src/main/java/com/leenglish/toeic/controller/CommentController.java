package com.leenglish.toeic.controller;

import com.leenglish.toeic.domain.Comment;
import com.leenglish.toeic.dto.CommentDTO;
import com.leenglish.toeic.service.CommentService;
import com.leenglish.toeic.security.UserDetailsImpl;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blog/{blogPostId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public CommentDTO addComment(@PathVariable Long blogPostId, @RequestBody Map<String, String> request) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Comment comment = new Comment();
        comment.setBlogPostId(blogPostId);
        comment.setUserId(userDetails.getId());
        comment.setContent(request.get("content"));

        return commentService.addComment(comment);
    }

    @GetMapping
    public List<CommentDTO> getComments(@PathVariable Long blogPostId) {
        return commentService.getCommentsByBlogPostId(blogPostId);
    }
}
