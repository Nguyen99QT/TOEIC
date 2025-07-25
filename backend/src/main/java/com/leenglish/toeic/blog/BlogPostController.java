package com.leenglish.toeic.blog;

import com.leenglish.toeic.dto.BlogPostWithStatsDTO;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.leenglish.toeic.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    // Tạo blog từ JSON (không upload file) - Chỉ cho phép COLLABORATOR và ADMIN
    @PostMapping
    public ResponseEntity<?> createBlogPost(@RequestBody BlogPost blogPost) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Bạn cần đăng nhập để tạo blog");
            }
            
            // Kiểm tra role - chỉ COLLABORATOR và ADMIN mới được tạo blog
            boolean hasPermission = auth.getAuthorities().stream()
                .anyMatch(authority -> 
                    authority.getAuthority().equals("ROLE_COLLABORATOR") || 
                    authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!hasPermission) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Chỉ cộng tác viên và admin mới có thể tạo blog");
            }
            
            // Set author từ user đang đăng nhập
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            if (blogPost.getAuthor() == null || blogPost.getAuthor().trim().isEmpty()) {
                blogPost.setAuthor(userDetails.getUsername());
            }
            
            System.out.println("🔐 Create Blog - User: " + auth.getName() + 
                             ", Roles: " + auth.getAuthorities() + 
                             ", Title: " + blogPost.getTitle());
            
            BlogPost createdPost = blogPostService.createBlogPost(blogPost);
            return ResponseEntity.ok(createdPost);
            
        } catch (Exception e) {
            System.err.println("❌ Error creating blog: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi tạo blog: " + e.getMessage());
        }
    }

    // Tạo blog kèm upload file - Chỉ cho phép COLLABORATOR và ADMIN
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

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Bạn cần đăng nhập để tạo blog");
            }
            
            // Kiểm tra role - chỉ COLLABORATOR và ADMIN mới được tạo blog
            boolean hasPermission = auth.getAuthorities().stream()
                .anyMatch(authority -> 
                    authority.getAuthority().equals("ROLE_COLLABORATOR") || 
                    authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (!hasPermission) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Chỉ cộng tác viên và admin mới có thể tạo blog");
            }
            
            BlogPost blogPost = new BlogPost();
            blogPost.setTitle(title);
            blogPost.setContent(content);
            
            // Set author từ user đang đăng nhập nếu không được cung cấp
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            if (author == null || author.trim().isEmpty()) {
                blogPost.setAuthor(userDetails.getUsername());
            } else {
                blogPost.setAuthor(author);
            }
            
            System.out.println("🔐 Create Blog with Upload - User: " + auth.getName() + 
                             ", Roles: " + auth.getAuthorities() + 
                             ", Title: " + title);
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

            BlogPost createdPost = blogPostService.createBlogPost(blogPost);
            System.out.println("✅ Blog post created successfully with ID: " + createdPost.getId());
            return ResponseEntity.ok(createdPost);
            
        } catch (IOException e) {
            System.err.println("❌ Error uploading files: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi upload file: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error creating blog with upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi tạo blog: " + e.getMessage());
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

    // Sửa blog (JSON only - không có file)
    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updateBlogPost(@PathVariable Long id, @RequestBody BlogPost blogPost) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Kiểm tra quyền: ADMIN có thể sửa tất cả, COLLABORATOR chỉ sửa blog của mình
            boolean canEdit = false;
            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (isAdmin) {
                canEdit = true;
            } else {
                boolean isCollaborator = auth.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_COLLABORATOR"));
                
                if (isCollaborator) {
                    // Kiểm tra xem blog có phải của user này không
                    Optional<BlogPost> existingBlogOpt = blogPostService.getBlogPostById(id);
                    if (existingBlogOpt.isPresent() && existingBlogOpt.get().getAuthor().equals(auth.getName())) {
                        canEdit = true;
                    }
                }
            }
            
            if (!canEdit) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            BlogPost updatedBlog = blogPostService.updateBlogPost(id, blogPost);
            if (updatedBlog != null) {
                return ResponseEntity.ok(updatedBlog);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("❌ Error updating blog " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Sửa blog với file upload (multipart) - Endpoint mới cho EditBlog component
    @PutMapping("/{id}/upload")
    public ResponseEntity<?> updateBlogPostWithFiles(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf) {
        
        System.out.println("🔄 UPDATE BLOG REQUEST - ID: " + id + ", Title: " + title);
        System.out.println("🔄 Content length: " + (content != null ? content.length() : 0));
        System.out.println("🔄 Files received - Image: " + (image != null ? image.getOriginalFilename() : "null") + 
                         ", Video: " + (video != null ? video.getOriginalFilename() : "null") + 
                         ", PDF: " + (pdf != null ? pdf.getOriginalFilename() : "null"));
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Bạn cần đăng nhập để sửa blog");
            }
            
            // Kiểm tra quyền: ADMIN có thể sửa tất cả, COLLABORATOR chỉ sửa blog của mình
            boolean canEdit = false;
            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            
            if (isAdmin) {
                canEdit = true;
            } else {
                boolean isCollaborator = auth.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_COLLABORATOR"));
                
                if (isCollaborator) {
                    // Kiểm tra xem blog có phải của user này không
                    Optional<BlogPost> existingBlogOpt = blogPostService.getBlogPostById(id);
                    if (existingBlogOpt.isPresent() && existingBlogOpt.get().getAuthor().equals(auth.getName())) {
                        canEdit = true;
                    }
                }
            }
            
            if (!canEdit) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Bạn không có quyền sửa blog này");
            }

            // Lấy blog hiện tại
            Optional<BlogPost> existingBlogOpt = blogPostService.getBlogPostById(id);
            if (!existingBlogOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            BlogPost existingBlog = existingBlogOpt.get();

            // Cập nhật thông tin cơ bản
            existingBlog.setTitle(title);
            existingBlog.setContent(content);

            // Xử lý upload file mới (nếu có)
            String uploadDir = "Upload";  // Nhất quán với create
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
                System.out.println("📁 Created upload directory: " + uploadDirFile.getAbsolutePath());
            }

            // Upload image mới nếu có
            if (image != null && !image.isEmpty()) {
                System.out.println("📸 Processing image upload: " + image.getOriginalFilename());
                String imageFileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
                Path imagePath = Paths.get(uploadDir, imageFileName);
                Files.copy(image.getInputStream(), imagePath);
                existingBlog.setImageUrl("/Upload/" + imageFileName);
                System.out.println("✅ Image saved: " + imagePath.toAbsolutePath());
            }

            // Upload video mới nếu có
            if (video != null && !video.isEmpty()) {
                System.out.println("🎬 Processing video upload: " + video.getOriginalFilename());
                String videoFileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(video.getOriginalFilename());
                Path videoPath = Paths.get(uploadDir, videoFileName);
                Files.copy(video.getInputStream(), videoPath);
                existingBlog.setVideoUrl("/Upload/" + videoFileName);
                System.out.println("✅ Video saved: " + videoPath.toAbsolutePath());
            }

            // Upload PDF mới nếu có
            if (pdf != null && !pdf.isEmpty()) {
                System.out.println("📄 Processing PDF upload: " + pdf.getOriginalFilename());
                String pdfFileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(pdf.getOriginalFilename());
                Path pdfPath = Paths.get(uploadDir, pdfFileName);
                Files.copy(pdf.getInputStream(), pdfPath);
                existingBlog.setPdfUrl("/Upload/" + pdfFileName);
                System.out.println("✅ PDF saved: " + pdfPath.toAbsolutePath());
            }

            // Lưu blog đã cập nhật
            BlogPost updatedBlog = blogPostService.updateBlogPost(id, existingBlog);
            
            if (updatedBlog != null) {
                System.out.println("✅ Blog updated successfully: " + updatedBlog.getTitle());
                System.out.println("✅ Updated URLs - Image: " + updatedBlog.getImageUrl() + 
                                 ", Video: " + updatedBlog.getVideoUrl() + 
                                 ", PDF: " + updatedBlog.getPdfUrl());
                return ResponseEntity.ok(updatedBlog);
            } else {
                System.err.println("❌ BlogPostService returned null");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Không thể cập nhật blog");
            }

        } catch (IOException e) {
            System.err.println("❌ File upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi upload file: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error updating blog: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi cập nhật blog: " + e.getMessage());
        }
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
