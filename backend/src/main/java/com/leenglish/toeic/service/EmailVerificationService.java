package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leenglish.toeic.domain.EmailVerifyToken;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.VerificationType;
import com.leenglish.toeic.repository.EmailVerifyTokenRepository;
import com.leenglish.toeic.repository.UserRepository;

/**
 * ================================================================
 * EMAIL VERIFICATION SERVICE - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Handles email verification token management and validation
 */

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerifyTokenRepository emailVerifyTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Create verification token for user registration
     */
    public EmailVerifyToken createVerificationToken(User user) {
        // Delete any existing tokens for this user
        emailVerifyTokenRepository.findByUserId(user.getId())
                .ifPresent(token -> emailVerifyTokenRepository.delete(token));

        // Generate new token
        String token = UUID.randomUUID().toString();
        EmailVerifyToken verificationToken = new EmailVerifyToken(token, user, VerificationType.ACCOUNT_CREATION.name());
        
        EmailVerifyToken savedToken = emailVerifyTokenRepository.save(verificationToken);
        
        // Send verification email
        emailService.sendVerificationEmail(user, token);
        
        return savedToken;
    }

    /**
     * Create password reset token
     */
    public EmailVerifyToken createPasswordResetToken(User user) {
        // Delete any existing tokens for this user
        emailVerifyTokenRepository.findByUserId(user.getId())
                .ifPresent(token -> emailVerifyTokenRepository.delete(token));

        // Generate new token
        String token = UUID.randomUUID().toString();
        EmailVerifyToken resetToken = new EmailVerifyToken(token, user, VerificationType.PASSWORD_RESET.name());
        
        EmailVerifyToken savedToken = emailVerifyTokenRepository.save(resetToken);
        
        // Send password reset email
        emailService.sendPasswordResetEmail(user, token);
        
        return savedToken;
    }

    /**
     * Verify email token
     */
    public boolean verifyEmailToken(String token) {
        Optional<EmailVerifyToken> tokenOpt = emailVerifyTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            System.out.println("❌ Token not found: " + token);
            return false;
        }

        EmailVerifyToken verificationToken = tokenOpt.get();
        
        // Check if token is expired
        if (verificationToken.isExpired()) {
            System.out.println("❌ Token expired: " + token);
            emailVerifyTokenRepository.delete(verificationToken);
            return false;
        }

        // Check if token is for account creation
        if (verificationToken.getVerificationType() != VerificationType.ACCOUNT_CREATION) {
            System.out.println("❌ Invalid token type: " + verificationToken.getVerificationType());
            return false;
        }

        // Verify user's email
        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        userRepository.save(user);

        // Delete the token after successful verification
        emailVerifyTokenRepository.delete(verificationToken);
        
        System.out.println("✅ Email verified successfully for user: " + user.getEmail());
        return true;
    }

    /**
     * Verify password reset token
     */
    public Optional<User> verifyPasswordResetToken(String token) {
        Optional<EmailVerifyToken> tokenOpt = emailVerifyTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            System.out.println("❌ Password reset token not found: " + token);
            return Optional.empty();
        }

        EmailVerifyToken resetToken = tokenOpt.get();
        
        // Check if token is expired
        if (resetToken.isExpired()) {
            System.out.println("❌ Password reset token expired: " + token);
            emailVerifyTokenRepository.delete(resetToken);
            return Optional.empty();
        }

        // Check if token is for password reset
        if (resetToken.getVerificationType() != VerificationType.PASSWORD_RESET) {
            System.out.println("❌ Invalid token type for password reset: " + resetToken.getVerificationType());
            return Optional.empty();
        }

        return Optional.of(resetToken.getUser());
    }

    /**
     * Delete expired tokens
     */
    public void deleteExpiredTokens() {
        Iterable<EmailVerifyToken> allTokens = emailVerifyTokenRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        
        for (EmailVerifyToken token : allTokens) {
            if (token.getExpiresAt().isBefore(now)) {
                emailVerifyTokenRepository.delete(token);
                System.out.println("🗑️ Deleted expired token: " + token.getToken());
            }
        }
    }

    /**
     * Resend verification email
     */
    public boolean resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            System.out.println("❌ User not found for email: " + email);
            return false;
        }

        User user = userOpt.get();
        
        if (user.getIsEmailVerified()) {
            System.out.println("❌ Email already verified for: " + email);
            return false;
        }

        try {
            createVerificationToken(user);
            System.out.println("✅ Verification email resent to: " + email);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Failed to resend verification email to: " + email);
            System.err.println("Error: " + e.getMessage());
            return false;
        }
    }
} 