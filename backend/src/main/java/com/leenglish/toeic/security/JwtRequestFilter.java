package com.leenglish.toeic.security;

import com.leenglish.toeic.service.TokenBlacklistService;
import com.leenglish.toeic.utils.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(
            @org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        final String requestPath = request.getRequestURI();
        final String method = request.getMethod();

<<<<<<< HEAD
        // Log request for debugging
        logger.debug("JWT Filter processing: {} {}", method, requestPath);

        // Skip JWT processing for public endpoints
        if (isPublicEndpoint(requestPath)) {
            logger.debug("Skipping JWT filter for public endpoint: {}", requestPath);
            chain.doFilter(request, response);
            return;
=======
        // Debug logging for blog requests
        if (requestPath.contains("/api/blog/")) {
            System.out.println("🔍 JWT Filter: " + method + " " + requestPath);
            System.out.println("🔍 Authorization Header: " + (authorizationHeader != null
                    ? authorizationHeader.substring(0, Math.min(authorizationHeader.length(), 30)) + "..."
                    : "null"));
        }

        // Only log at debug level to prevent excessive logging
        if (logger.isDebugEnabled()) {
            logger.debug("JWT Filter processing: {} {}", method, requestPath);
>>>>>>> DuyAnh
        }

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);

            // Check if token is blacklisted
            if (tokenBlacklistService.isTokenBlacklisted(jwt)) {
                logger.warn("Token is blacklisted: {}", jwt);
                chain.doFilter(request, response);
                return;
            }

            try {
                username = jwtUtils.extractUsername(jwt);
                logger.debug("JWT extracted username: {}", username);
            } catch (Exception e) {
                logger.error("Invalid JWT token: {}", e.getMessage());
            }
        } else {
            logger.debug("No Authorization header or invalid format for: {}", requestPath);
        }

<<<<<<< HEAD
=======
        // Debug for blog requests without token
        if (requestPath.contains("/api/blog/") && authorizationHeader == null) {
            System.out.println("❌ No Authorization header for blog request: " + method + " " + requestPath);
        }

        // Add cache to avoid repeated database lookups for the same user
>>>>>>> DuyAnh
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.debug("Loading user details for username: {}", username);
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            logger.debug("Loaded user details: username={}, authorities={}", 
                userDetails.getUsername(), userDetails.getAuthorities());

            if (jwtUtils.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

<<<<<<< HEAD
                logger.info("JWT Filter: Successfully authenticated user = {} with authorities = {}", 
                    username, userDetails.getAuthorities());
=======
                // Debug logging for blog requests
                if (requestPath.contains("/api/blog/")) {
                    System.out.println("✅ JWT Filter: Authentication successful for " + username);
                    System.out.println("✅ Authorities: " + userDetails.getAuthorities());
                }

                // Only log at debug level to prevent excessive logging
                if (logger.isDebugEnabled()) {
                    logger.debug("JWT Filter: Authenticated user = {}", username);
                }
>>>>>>> DuyAnh
            } else {
                logger.warn("JWT token validation failed for user: {}", username);
                if (requestPath.contains("/api/blog/")) {
                    System.out.println("❌ JWT token validation failed for user: " + username);
                }
            }
        } else if (username != null) {
            logger.debug("User {} already authenticated in SecurityContext", username);
        }

        chain.doFilter(request, response);
    }

    /**
     * Check if the request path is a public endpoint that doesn't require JWT authentication
     */
    private boolean isPublicEndpoint(String requestPath) {
        // List of public endpoints that should skip JWT processing
        String[] publicPaths = {
            "/api/auth/",
            "/api/health",
            "/api/question-bank/test",
            "/api/question-bank/test-json",
            "/api/question-group/test",
            "/api/question-group/test-json",
            "/api/test-data/",
            "/api/debug/",
            "/audio/",
            "/images/",
            "/uploads/",
            "/static/",
            "/files/",
            "/api/users/register",
            "/h2-console/",
            "/swagger-ui/",
            "/v3/api-docs/",
            "/api/lessons/free",
            "/api/questions/free",
            "/api/flashcard-sets/public",
            "/api/flashcards/free"
        };
        
        // Check exact matches first
        if (requestPath.equals("/api/health")) {
            return true;
        }
        
        // Check prefix matches
        for (String publicPath : publicPaths) {
            if (requestPath.startsWith(publicPath)) {
                logger.info("🟢 Request {} matches public path {} - skipping JWT filter", requestPath, publicPath);
                return true;
            }
        }
        
        logger.info("🔴 Request {} requires authentication", requestPath);
        return false;
    }
}
