package com.leenglish.toeic.blog;

import com.leenglish.toeic.dto.BlogPostWithStatsDTO;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    // Tạo blog từ JSON (không upload file)
    @PostMapping
    public BlogPost createBlogPost(@RequestBody BlogPost blogPost) {
        return blogPostService.createBlogPost(blogPost);
    }

    // Tạo blog kèm upload file
    @PostMapping("/upload")
    public ResponseEntity<?> createBlogPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf) {

        try {
            System.out.println("📝 Blog upload request received:");
            System.out.println("Title: " + title);
            System.out.println("Content length: " + (content != null ? content.length() : 0));
            System.out.println("Author: " + author);
            System.out.println("Image: "
                    + (image != null ? image.getOriginalFilename() + " (" + image.getSize() + " bytes)" : "none"));
            System.out.println("Video: "
                    + (video != null ? video.getOriginalFilename() + " (" + video.getSize() + " bytes)" : "none"));
            System.out.println(
                    "PDF: " + (pdf != null ? pdf.getOriginalFilename() + " (" + pdf.getSize() + " bytes)" : "none"));

            BlogPost blogPost = new BlogPost();
            blogPost.setTitle(title);
            blogPost.setContent(content);
            blogPost.setAuthor(author);

            String uploadDir = "Upload";
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            // Lưu file ảnh (nếu có)
            if (image != null && !image.isEmpty()) {
                String imageName = System.currentTimeMillis() + "_"
                        + StringUtils.cleanPath(image.getOriginalFilename());
                Path imagePath = Paths.get("Upload", imageName);
                Files.copy(image.getInputStream(), imagePath);
                blogPost.setImageUrl("/Upload/" + imageName);
            }

            // Lưu file video (nếu có)
            if (video != null && !video.isEmpty()) {
                String videoName = System.currentTimeMillis() + "_"
                        + StringUtils.cleanPath(video.getOriginalFilename());
                Path videoPath = Paths.get(uploadDir, videoName);
                Files.copy(video.getInputStream(), videoPath);
                blogPost.setVideoUrl("/Upload/" + videoName);
            }

            // Lưu PDF (nếu có)
            if (pdf != null && !pdf.isEmpty()) {
                String pdfName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(pdf.getOriginalFilename());
                Path pdfPath = Paths.get(uploadDir, pdfName);
                Files.copy(pdf.getInputStream(), pdfPath);
                blogPost.setPdfUrl("/Upload/" + pdfName);
            }

            BlogPost savedBlogPost = blogPostService.createBlogPost(blogPost);
            System.out.println("✅ Blog post created successfully with ID: " + savedBlogPost.getId());
            return ResponseEntity.ok(savedBlogPost);

        } catch (Exception e) {
            System.err.println("❌ Error creating blog post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error creating blog post: " + e.getMessage());
        }
    }

    // Lấy chi tiết blog
    @GetMapping("/{id}")
    public BlogPost getBlogPost(@PathVariable Long id) {
        return blogPostService.getBlogPostById(id).orElse(null);
    }

    // Lấy tất cả blog
    @GetMapping
    public List<BlogPost> getAllBlogPosts() {
        return blogPostService.getAllBlogPosts();
    }

    // Lấy tất cả blog với thống kê (cho admin)
    @GetMapping("/admin/stats")
    public List<BlogPostWithStatsDTO> getAllBlogPostsWithStats() {
        return blogPostService.getAllBlogPostsWithStats();
    }

    // Tìm kiếm blog theo tiêu đề
    @GetMapping("/search")
    public List<BlogPost> searchBlogPostsByTitle(@RequestParam("title") String title) {
        return blogPostService.searchByTitle(title);
    }

    // Sửa blog
    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updateBlogPost(@PathVariable Long id, @RequestBody BlogPost blogPost) {
        BlogPost updatedBlog = blogPostService.updateBlogPost(id, blogPost);
        if (updatedBlog != null) {
            return ResponseEntity.ok(updatedBlog);
        }
        return ResponseEntity.notFound().build();
    }

    // Ẩn blog (thay vì xóa)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> hideBlogPost(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔐 Hide Blog - User: " + auth.getName() + ", Roles: " + auth.getAuthorities());
            blogPostService.hideBlogPost(id);
            System.out.println("✅ Blog " + id + " hidden successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("❌ Error hiding blog " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // Hiện lại blog
    @PostMapping("/{id}/unhide")
    public ResponseEntity<Void> unhideBlogPost(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔐 Unhide Blog - User: " + auth.getName() + ", Roles: " + auth.getAuthorities());
            blogPostService.unhideBlogPost(id);
            System.out.println("✅ Blog " + id + " unhidden successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("❌ Error unhiding blog " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}
