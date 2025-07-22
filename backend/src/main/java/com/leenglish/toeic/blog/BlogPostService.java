package com.leenglish.toeic.blog;

import com.leenglish.toeic.blog.BlogPost;
import com.leenglish.toeic.blog.BlogPostRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    public BlogPost createBlogPost(BlogPost blogPost) {
        blogPost.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        return blogPostRepository.save(blogPost);
    }

    public List<BlogPost> getAllBlogPosts() {
        return blogPostRepository.findAll();
    }

    public Optional<BlogPost> getBlogPostById(Long id) {
        return blogPostRepository.findById(id);
    }

    public List<BlogPost> searchByTitle(String title) {
        return blogPostRepository.findByTitleContainingIgnoreCase(title);
    }

}