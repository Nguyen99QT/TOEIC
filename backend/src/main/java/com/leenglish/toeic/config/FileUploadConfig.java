

package com.leenglish.toeic.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuration cho file upload
 * Tạo các thư mục cần thiết khi ứng dụng khởi động
 */
@Configuration
public class FileUploadConfig {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostConstruct
    public void createUploadDirectories() {
        try {
            // Tạo thư mục upload chính
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory: " + uploadPath);
            }

            // Tạo thư mục con cho images và audio
            Path imagesPath = uploadPath.resolve("images");
            if (!Files.exists(imagesPath)) {
                Files.createDirectories(imagesPath);
                System.out.println("Created images directory: " + imagesPath);
            }

            Path audioPath = uploadPath.resolve("audio");
            if (!Files.exists(audioPath)) {
                Files.createDirectories(audioPath);
                System.out.println("Created audio directory: " + audioPath);
            }

        } catch (IOException e) {
            System.err.println("Error creating upload directories: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
