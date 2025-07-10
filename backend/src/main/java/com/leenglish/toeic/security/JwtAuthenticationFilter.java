package com.leenglish.toeic.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.leenglish.toeic.dto.UserDto;
import com.leenglish.toeic.service.JwtService;
import com.leenglish.toeic.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Lazy
    private UserService userService;

    @Override
    protected void doFilterInternal(
            @org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String requestPath = request.getRequestURI();
        String method = request.getMethod();

        // Log request for debugging
        logger.info("JWT Filter processing: " + method + " " + requestPath);

        String username = null;
        String jwt = null;
        String role = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtService.extractUsername(jwt);
                role = jwtService.extractRole(jwt);
                logger.info("JWT extracted - Username: " + username + ", Role: " + role);
            } catch (Exception e) {
                logger.warn("JWT extraction failed: " + e.getMessage());
            }
        } else {
            logger.info("No Authorization header or invalid format for: " + requestPath);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Verify token is valid and user exists
            Optional<UserDto> userDtoOptional = userService.getUserByUsername(username);

            if (userDtoOptional.isPresent() && jwtService.isTokenValid(jwt, userDtoOptional.get())) {
                UserDto userDto = userDtoOptional.get();

                // Set authorities based on role
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userDto.getRole().name());

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, Arrays.asList(authority));
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);

                logger.info("JWT Filter: Authenticated user = " + username + ", role = " + userDto.getRole().name());
            } else {
                logger.warn("Invalid JWT token for user: " + username);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Chỉ skip JWT filter cho các endpoint public
        if ((method.equals("POST") && path.equals("/api/auth/login")) ||
                (method.equals("POST") && path.equals("/api/auth/register"))) {
            if (logger.isDebugEnabled()) {
                logger.debug("Skipping JWT filter for: " + method + " " + path);
            }
            return true;
        }

        // Log which paths are being checked
        logger.info("Checking shouldNotFilter for: " + method + " " + path);

        boolean shouldSkip =
                // Static files - SKIP JWT FILTER
                path.startsWith("/audio/") ||
                        path.startsWith("/images/") ||
                        path.startsWith("/files/") ||
                        path.startsWith("/static/") ||

                        // Basic auth endpoints
                        path.startsWith("/api/auth/") ||
                        path.equals("/api/health") ||
                        path.startsWith("/api/users/register") ||

                        // Public lesson endpoints
                        path.startsWith("/api/lessons/free") ||
                        path.startsWith("/api/exercises/free") ||

                        // PUBLIC FLASHCARD ENDPOINTS
                        (method.equals("GET") && path.equals("/api/flashcards/sets")) ||
                        (method.equals("GET") && path.equals("/api/flashcards/free")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcards/free/")) ||
                        (method.equals("GET") && path.equals("/api/flashcards/test")) ||
                        (method.equals("GET") && path.equals("/api/flashcard-sets")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcard-sets/")) ||
                        (method.equals("GET") && path.equals("/api/flashcard-sets/public")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcard-sets/public/")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcard-sets/search")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcard-sets/category/")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcard-sets/difficulty/")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcards/set/")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcards/level/")) ||
                        (method.equals("GET") && path.startsWith("/api/flashcards/category/")) ||
                        (method.equals("GET") && path.equals("/api/flashcards/search")) ||
                        (method.equals("GET") && path.equals("/api/flashcards/sets/search")) ||

                        // Test endpoints
                        path.startsWith("/api/test/") ||

                        // Development tools
                        path.startsWith("/h2-console/") ||
                        path.startsWith("/swagger-ui/") ||
                        path.startsWith("/v3/api-docs/") ||

                        // CORS preflight requests
                        method.equals("OPTIONS");

        if (shouldSkip) {
            logger.info("Skipping JWT filter for: " + method + " " + path);
        } else {
            logger.info("JWT filter will process: " + method + " " + path);
        }

        return shouldSkip;
    }
}
