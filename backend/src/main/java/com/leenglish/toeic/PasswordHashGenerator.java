package com.leenglish.toeic;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "password123";
        String hash = encoder.encode(password);
        System.out.println("BCrypt hash for '" + password + "': " + hash);
        
        // Test if hash matches
        boolean matches = encoder.matches(password, hash);
        System.out.println("Hash verification: " + matches);
        
        // Test with existing hash
        String existingHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqfqvVVUpPe.JhDe8xjOO8K";
        boolean existingMatches = encoder.matches(password, existingHash);
        System.out.println("Existing hash verification: " + existingMatches);
    }
}
