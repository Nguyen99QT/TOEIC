package com.leenglish.toeic.security;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    // Simple in-memory cache to prevent constant database lookups
    // Note: In production, consider using Spring Cache or a distributed cache
    private final Map<String, UserDetails> userCache = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by username with caching to prevent repeated database calls
     * This resolves the loop issue with JWT filters performing too many DB queries
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check cache first
        if (userCache.containsKey(username)) {
            if (logger.isDebugEnabled()) {
                logger.debug("Cache hit for user: {}", username);
            }
            return userCache.get(username);
        }

        if (logger.isDebugEnabled()) {
            logger.debug("Cache miss for user: {}, loading from database", username);
        }

        // Not in cache, load from database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        UserDetails userDetails = UserDetailsImpl.build(user);

        // Cache the result
        userCache.put(username, userDetails);

        return userDetails;
    }

    /**
     * Clear the cache for a specific user
     * Call this when user data is updated
     */
    public void evictUserFromCache(String username) {
        userCache.remove(username);
        if (logger.isDebugEnabled()) {
            logger.debug("Evicted user from cache: {}", username);
        }
    }

    /**
     * Clear the entire cache
     * Call this when a system-wide reset is needed
     */
    public void clearCache() {
        userCache.clear();
        if (logger.isDebugEnabled()) {
            logger.debug("Cleared entire user cache");
        }
    }
}
