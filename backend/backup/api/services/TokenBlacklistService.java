package com.leenglish.api.services;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service để quản lý blacklist token - sử dụng Map trong bộ nhớ để lưu trữ
 * token đã bị vô hiệu hóa.
 * Trong môi trường production thực tế, nên sử dụng Redis hoặc database để lưu
 * trữ.
 */
@Service
public class TokenBlacklistService {

    private final Map<String, Date> tokenBlacklist = new ConcurrentHashMap<>();

    /**
     * Định kỳ xóa các token hết hạn khỏi blacklist
     */
    public void cleanupExpiredTokens() {
        Date now = new Date();
        tokenBlacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }

    /**
     * Thêm token vào blacklist
     * 
     * @param token      Token JWT cần đưa vào blacklist
     * @param expiration Thời gian hết hạn của token
     */
    public void blacklistToken(String token, Date expiration) {
        tokenBlacklist.put(token, expiration);
        cleanupExpiredTokens();
    }

    /**
     * Kiểm tra xem token có trong blacklist không
     * 
     * @param token Token JWT cần kiểm tra
     * @return true nếu token đã bị blacklist, false nếu không
     */
    public boolean isTokenBlacklisted(String token) {
        cleanupExpiredTokens();
        return tokenBlacklist.containsKey(token);
    }
}
