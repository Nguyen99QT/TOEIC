package aptech.fpt.toeic_backend.controller;

import aptech.fpt.toeic_backend.entity.BlogPost;
import aptech.fpt.toeic_backend.service.BlogPostService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    @PostMapping
    public BlogPost createBlogPost(@RequestBody BlogPost blogPost) {
        return blogPostService.createBlogPost(blogPost);
    }

    @PostMapping("/upload")
    public BlogPost createBlogPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf // <--- Thêm trường này

    ) throws IOException {
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(title);
        blogPost.setContent(content);
        blogPost.setAuthor(author);

        // Lưu file ảnh (nếu có)
        if (image != null && !image.isEmpty()) {
            String imageName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
            String uploadDir = "Upload";
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }
            Path imagePath = Paths.get(uploadDir, imageName);
            Files.copy(image.getInputStream(), imagePath);
            blogPost.setImageUrl("/Upload/" + imageName); // Đường dẫn để truy cập
        }

        // Lưu file video (nếu có)
        if (video != null && !video.isEmpty()) {
            String videoName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(video.getOriginalFilename());
            String uploadDir = "Upload";
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }
            Path videoPath = Paths.get(uploadDir, videoName);
            Files.copy(video.getInputStream(), videoPath);
            blogPost.setVideoUrl("/Upload/" + videoName);
        }
        // Lưu PDF (nếu có)
        if (pdf != null && !pdf.isEmpty()) {
            String pdfName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(pdf.getOriginalFilename());
            String uploadDir = "Upload";
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }
            Path pdfPath = Paths.get(uploadDir, pdfName);
            Files.copy(pdf.getInputStream(), pdfPath);
            blogPost.setPdfUrl("/Upload/" + pdfName);
        }

        return blogPostService.createBlogPost(blogPost);
    }

    @GetMapping("/{id}")
    public Optional<BlogPost> getBlogPost(@PathVariable Long id) {
        return blogPostService.getBlogPostById(id);
    }

    @GetMapping
    public List<BlogPost> getAllBlogPosts() {
        return blogPostService.getAllBlogPosts();
    }

    @GetMapping("/search")
    public List<BlogPost> searchBlogPostsByTitle(@RequestParam("title") String title) {
        return blogPostService.searchByTitle(title);
    }

}
