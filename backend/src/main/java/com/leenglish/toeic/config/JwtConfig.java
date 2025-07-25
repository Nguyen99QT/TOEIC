package com.leenglish.toeic.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:mySecretKey123456789012345678901234567890123456789012345678901234567890}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400}")
    private int jwtExpirationInSeconds;

    // FIX: Use consistent property name with hyphen to match application.properties
    @Value("${jwt.refresh-expiration:604800}")
    private int jwtRefreshExpirationInSeconds;

    /**
     * Tạo signing key từ secret string
     * Ensure the key is at least 256 bits (32 bytes) for HS256
     */
    @Bean
    public SecretKey jwtSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

        // Ensure minimum key length for security
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 characters (256 bits) long for HS256 algorithm");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Get JWT secret
     */
    public String getJwtSecret() {
        return jwtSecret;
    }

    /**
     * Get JWT expiration time in seconds
     */
    public int getJwtExpirationInSeconds() {
        return jwtExpirationInSeconds;
    }

    /**
     * Get JWT expiration time in milliseconds
     */
    public long getJwtExpirationInMs() {
        return jwtExpirationInSeconds * 1000L;
    }

    /**
     * Get JWT refresh token expiration time in seconds
     */
    public int getJwtRefreshExpirationInSeconds() {
        return jwtRefreshExpirationInSeconds;
    }

    /**
     * Get JWT refresh token expiration time in milliseconds
     */
    public long getJwtRefreshExpirationInMs() {
        return jwtRefreshExpirationInSeconds * 1000L;
    }

    // Setters for testing
    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public void setJwtExpirationInSeconds(int jwtExpirationInSeconds) {
        this.jwtExpirationInSeconds = jwtExpirationInSeconds;
    }

    public void setJwtRefreshExpirationInSeconds(int jwtRefreshExpirationInSeconds) {
        this.jwtRefreshExpirationInSeconds = jwtRefreshExpirationInSeconds;
    }
}