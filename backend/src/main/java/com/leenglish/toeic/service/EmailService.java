package com.leenglish.toeic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.leenglish.toeic.domain.User;

/**
 * ================================================================
 * EMAIL SERVICE - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Handles email sending functionality for user verification
 */

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Value("${server.port:8080}")
    private String serverPort;

    /**
     * Send verification email to user
     */
    public void sendVerificationEmail(User user, String token) {
        // Check if mail service is available
        if (mailSender == null) {
            System.out.println("⚠️ Email service not configured - verification email not sent to: " + user.getEmail());
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Xác thực tài khoản - LeEnglish TOEIC Platform");
            
            // Build URL properly handling context path
            String baseUrl = String.format("http://localhost:%s", serverPort);
            String path = contextPath.isEmpty() ? "api/auth/verify-email" : contextPath + "api/auth/verify-email";
            String verificationUrl = String.format("%s%s?token=%s", baseUrl, path, token);
        
            String emailContent = String.format(
                "Xin chào %s,\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản tại LeEnglish TOEIC Platform!\n\n" +
                "Để hoàn tất quá trình đăng ký, vui lòng nhấp vào liên kết bên dưới để xác thực email của bạn:\n\n" +
                "%s\n\n" +
                "Liên kết này sẽ hết hạn sau 15 phút.\n\n" +
                "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ LeEnglish TOEIC Platform",
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                verificationUrl
            );
            
            message.setText(emailContent);
            
            mailSender.send(message);
            System.out.println("✅ Verification email sent to: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to: " + user.getEmail());
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(User user, String token) {
        // Check if mail service is available
        if (mailSender == null) {
            System.out.println("⚠️ Email service not configured - password reset email not sent to: " + user.getEmail());
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Đặt lại mật khẩu - LeEnglish TOEIC Platform");
        
            // Build frontend URL for password reset
            String frontendUrl = "http://localhost:3000";
            String resetUrl = String.format("%s/reset-password?token=%s", frontendUrl, token);
            
            String emailContent = String.format(
                "Xin chào %s,\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản LeEnglish TOEIC Platform.\n\n" +
                "Nhấp vào liên kết bên dưới để đặt lại mật khẩu:\n\n" +
                "%s\n\n" +
                "Liên kết này sẽ hết hạn sau 15 phút.\n\n" +
                "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ LeEnglish TOEIC Platform",
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                resetUrl
            );
            
            message.setText(emailContent);
            
            mailSender.send(message);
            System.out.println("✅ Password reset email sent to: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email to: " + user.getEmail());
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
} 