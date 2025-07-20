package com.leenglish.toeic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * ================================================================
 * TOKEN CLEANUP SERVICE - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Scheduled service to clean up expired email verification tokens
 */

@Service
public class TokenCleanupService {

    @Autowired
    private EmailVerificationService emailVerificationService;

    /**
     * Clean up expired tokens every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void cleanupExpiredTokens() {
        try {
            System.out.println("🧹 Starting token cleanup...");
            emailVerificationService.deleteExpiredTokens();
            System.out.println("✅ Token cleanup completed");
        } catch (Exception e) {
            System.err.println("❌ Token cleanup failed: " + e.getMessage());
        }
    }
} 