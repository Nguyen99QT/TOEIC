package com.leenglish.toeic.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = {"http://localhost:3000"}, 
             methods = {RequestMethod.GET, RequestMethod.HEAD, RequestMethod.OPTIONS},
             allowedHeaders = "*",
             allowCredentials = "false")
public class FileController {

    @GetMapping(value = "/audio/**", produces = "audio/mpeg")
    @ResponseBody
    public ResponseEntity<Resource> getAudio(HttpServletRequest request) {
        try {
            // Extract the file path from request URI
            String requestURI = request.getRequestURI();
            String filePath = requestURI.substring("/uploads/".length());
            Path file = Paths.get("uploads").resolve(filePath);
            Resource resource = new FileSystemResource(file);
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(value = "/audio/**", method = RequestMethod.HEAD)
    public ResponseEntity<Void> headAudio(HttpServletRequest request) {
        try {
            // Extract the file path from request URI
            String requestURI = request.getRequestURI();
            String filePath = requestURI.substring("/uploads/".length());
            Path file = Paths.get("uploads").resolve(filePath);
            File audioFile = file.toFile();
            
            if (audioFile.exists() && audioFile.canRead()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(audioFile.length()))
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/images/**", produces = {"image/jpeg", "image/png", "image/gif"})
    @ResponseBody
    public ResponseEntity<Resource> getImage(HttpServletRequest request) {
        try {
            // Extract the file path from request URI
            String requestURI = request.getRequestURI();
            String filePath = requestURI.substring("/uploads/".length());
            Path file = Paths.get("uploads").resolve(filePath);
            Resource resource = new FileSystemResource(file);
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type based on file extension
                String contentType = "image/png"; // default
                String fileName = file.getFileName().toString().toLowerCase();
                if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (fileName.endsWith(".gif")) {
                    contentType = "image/gif";
                }
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(value = "/images/**", method = RequestMethod.HEAD)
    public ResponseEntity<Void> headImage(HttpServletRequest request) {
        try {
            // Extract the file path from request URI
            String requestURI = request.getRequestURI();
            String filePath = requestURI.substring("/uploads/".length());
            Path file = Paths.get("uploads").resolve(filePath);
            File imageFile = file.toFile();
            
            if (imageFile.exists() && imageFile.canRead()) {
                // Determine content type based on file extension
                String contentType = "image/png"; // default
                String fileName = file.getFileName().toString().toLowerCase();
                if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (fileName.endsWith(".gif")) {
                    contentType = "image/gif";
                }
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(imageFile.length()))
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                        .build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
