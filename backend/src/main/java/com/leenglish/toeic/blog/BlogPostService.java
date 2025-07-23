package com.leenglish.toeic.blog;

import com.leenglish.toeic.dto.BlogPostWithStatsDTO;
import com.leenglish.toeic.repository.LikeRepository;
import com.leenglish.toeic.repository.CommentRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    public BlogPost createBlogPost(BlogPost blogPost) {
        blogPost.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        return blogPostRepository.save(blogPost);
    }

    public List<BlogPost> getAllBlogPosts() {
        // For public access, only return non-hidden posts ordered by creation date
        return blogPostRepository.findByHiddenFalseOrHiddenIsNullOrderByCreatedAtDesc();
    }

    public List<BlogPost> getAllBlogPostsIncludingHidden() {
        // For admin access, return all posts including hidden ones ordered by creation
        // date
        return blogPostRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<BlogPost> getBlogPostById(Long id) {
        return blogPostRepository.findById(id);
    }

    public List<BlogPost> searchByTitle(String title) {
        // For public search, only return non-hidden posts
        return blogPostRepository.findByTitleContainingIgnoreCaseAndHiddenFalseOrHiddenIsNull(title);
    }

    public BlogPost updateBlogPost(Long id, BlogPost updatedBlogPost) {
        Optional<BlogPost> existingPost = blogPostRepository.findById(id);
        if (existingPost.isPresent()) {
            BlogPost post = existingPost.get();
            post.setTitle(updatedBlogPost.getTitle());
            post.setContent(updatedBlogPost.getContent());
            post.setAuthor(updatedBlogPost.getAuthor());
            if (updatedBlogPost.getImageUrl() != null) {
                post.setImageUrl(updatedBlogPost.getImageUrl());
            }
            if (updatedBlogPost.getVideoUrl() != null) {
                post.setVideoUrl(updatedBlogPost.getVideoUrl());
            }
            if (updatedBlogPost.getPdfUrl() != null) {
                post.setPdfUrl(updatedBlogPost.getPdfUrl());
            }
            return blogPostRepository.save(post);
        }
        return null;
    }

    public void hideBlogPost(Long id) {
        try {
            System.out.println("🔍 Hiding blog post with ID: " + id);
            Optional<BlogPost> existingPost = blogPostRepository.findById(id);
            if (existingPost.isPresent()) {
                BlogPost post = existingPost.get();
                System.out.println(
                        "🔍 Found blog post: " + post.getTitle() + ", current hidden status: " + post.getHidden());
                post.setHidden(true);
                System.out.println("🔍 Setting hidden to true, about to save...");
                blogPostRepository.save(post);
                System.out.println("✅ Blog post hidden successfully");
            } else {
                System.out.println("❌ Blog post with ID " + id + " not found");
                throw new RuntimeException("Blog post not found with id: " + id);
            }
        } catch (Exception e) {
            System.err.println("❌ Error hiding blog post: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void unhideBlogPost(Long id) {
        try {
            System.out.println("🔍 Unhiding blog post with ID: " + id);
            Optional<BlogPost> existingPost = blogPostRepository.findById(id);
            if (existingPost.isPresent()) {
                BlogPost post = existingPost.get();
                System.out.println(
                        "🔍 Found blog post: " + post.getTitle() + ", current hidden status: " + post.getHidden());
                post.setHidden(false);
                System.out.println("🔍 Setting hidden to false, about to save...");
                blogPostRepository.save(post);
                System.out.println("✅ Blog post unhidden successfully");
            } else {
                System.out.println("❌ Blog post with ID " + id + " not found");
                throw new RuntimeException("Blog post not found with id: " + id);
            }
        } catch (Exception e) {
            System.err.println("❌ Error unhiding blog post: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteBlogPost(Long id) {
        blogPostRepository.deleteById(id);
    }

    public List<BlogPostWithStatsDTO> getAllBlogPostsWithStats() {
        List<BlogPost> blogs = blogPostRepository.findAllByOrderByCreatedAtDesc();
        return blogs.stream().map(blog -> {
            Long likesCount = likeRepository.countByBlogPostId(blog.getId());
            Long commentsCount = commentRepository.countByBlogPostId(blog.getId());

            return new BlogPostWithStatsDTO(
                    blog.getId(),
                    blog.getTitle(),
                    blog.getContent(),
                    blog.getAuthor(),
                    blog.getCreatedAt().toLocalDateTime(),
                    blog.getImageUrl(),
                    blog.getVideoUrl(),
                    blog.getPdfUrl(),
                    likesCount,
                    commentsCount,
                    blog.getHidden());
        }).collect(Collectors.toList());
    }

}