package com.leenglish.toeic.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Service để xử lý upload và quản lý files
 * Hỗ trợ upload image và audio cho Exercise và Flashcard
 */
@Service
public class FileUploadService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // Định nghĩa các định dạng file được phép
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");

    private static final List<String> ALLOWED_AUDIO_TYPES = Arrays.asList(
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg");

    // Giới hạn kích thước file
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Upload image file
     */
    public String uploadImage(MultipartFile file) throws IOException {
        validateImageFile(file);
        return saveFile(file, "images");
    }

    /**
     * Upload audio file
     */
    public String uploadAudio(MultipartFile file) throws IOException {
        validateAudioFile(file);
        return saveFile(file, "audio");
    }

    /**
     * Validate image file
     */
    private void validateImageFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Image file is empty");
        }

        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid image format. Allowed formats: JPEG, JPG, PNG, GIF, WebP");
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Image file size exceeds maximum limit of 5MB");
        }
    }

    /**
     * Validate audio file
     */
    private void validateAudioFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Audio file is empty");
        }

        if (!ALLOWED_AUDIO_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid audio format. Allowed formats: MP3, WAV, OGG");
        }

        if (file.getSize() > MAX_AUDIO_SIZE) {
            throw new IllegalArgumentException("Audio file size exceeds maximum limit of 10MB");
        }
    }

    /**
     * Save file to specified directory
     */
    private String saveFile(MultipartFile file, String subDir) throws IOException {
        // Tạo tên file unique
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Tạo path đến thư mục lưu file
        Path uploadPath = Paths.get(uploadDir, subDir);
        Files.createDirectories(uploadPath);

        // Đường dẫn đầy đủ đến file
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Copy file vào thư mục đích
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Trả về URL để access file
        return "/" + subDir + "/" + uniqueFilename;
    }

    /**
     * Delete file by URL
     */
    public boolean deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return false;
        }

        try {
            // Remove leading slash nếu có
            String relativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
            Path filePath = Paths.get(uploadDir, relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
        } catch (IOException e) {
            System.err.println("Error deleting file: " + fileUrl + " - " + e.getMessage());
        }

        return false;
    }

    /**
     * Generate URL for accessing uploaded file
     */
    public String generateFileUrl(String relativePath) {
        return "/api/files" + relativePath;
    }
}
