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
                // Only log at trace level to prevent excessive logging
                if (logger.isTraceEnabled()) {
                    logger.trace("JWT extracted username: {}", username);
                }
            } catch (Exception e) {
                logger.error("Invalid JWT token: {}", e.getMessage());
            }
        } else if (logger.isDebugEnabled()) {
            logger.debug("No Authorization header or invalid format for: {}", requestPath);
        }

        // Debug for blog requests without token
        if (requestPath.contains("/api/blog/") && authorizationHeader == null) {
            System.out.println("❌ No Authorization header for blog request: " + method + " " + requestPath);
        }

        // Add cache to avoid repeated database lookups for the same user
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Use an in-memory cache or session attribute to avoid repeated lookups
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtils.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // Debug logging for blog requests
                if (requestPath.contains("/api/blog/")) {
                    System.out.println("✅ JWT Filter: Authentication successful for " + username);
                    System.out.println("✅ Authorities: " + userDetails.getAuthorities());
                }

                // Only log at debug level to prevent excessive logging
                if (logger.isDebugEnabled()) {
                    logger.debug("JWT Filter: Authenticated user = {}", username);
                }
            } else {
                logger.warn("JWT token validation failed for user: {}", username);
                if (requestPath.contains("/api/blog/")) {
                    System.out.println("❌ JWT token validation failed for user: " + username);
                }
            }
        }

        chain.doFilter(request, response);
    }
}
