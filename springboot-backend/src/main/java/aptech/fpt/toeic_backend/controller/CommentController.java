/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.controller;

import aptech.fpt.toeic_backend.entity.Comment;
import aptech.fpt.toeic_backend.service.CommentService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Comment addComment(@PathVariable Long blogPostId, @RequestBody Comment comment) {
        comment.setBlogPostId(blogPostId);
        return commentService.addComment(comment);
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long blogPostId) {
        return commentService.getCommentsByBlogPostId(blogPostId);
    }
}

