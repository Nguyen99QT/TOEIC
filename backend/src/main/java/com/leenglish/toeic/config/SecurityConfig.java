package com.leenglish.toeic.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.leenglish.toeic.security.JwtAuthenticationEntryPoint;
import com.leenglish.toeic.security.JwtRequestFilter;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Autowired
    public SecurityConfig(JwtRequestFilter jwtRequestFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            UserDetailsService userDetailsService,
            CorsConfigurationSource corsConfigurationSource) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean("securityConfigAuthManager")
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
<<<<<<< HEAD
                        // Specific TOEIC test endpoints - ORDER MATTERS!
                        .requestMatchers(HttpMethod.POST, "/api/tests/*/review").authenticated() // Test review endpoint
                                                                                                 // requires auth
                                                .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/api/tests/debug/**").permitAll() // Debug endpoints first
                        
                        // Test generation endpoints
                        .requestMatchers(HttpMethod.GET, "/api/tests/**").permitAll() // Test generation endpoints (for
                                                                                      // testing)

                        // Question group public endpoints (must be before the general rule)
                        .requestMatchers(HttpMethod.GET, "/api/question-group/test").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/question-group/debug-endpoint").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/question-group/test-json").permitAll()

                        // Question group endpoints for COLLABORATOR testing
                        .requestMatchers(HttpMethod.GET, "/api/question-group/test-collaborator")
                        .hasAnyRole("COLLABORATOR", "ADMIN")

                        .requestMatchers("/api/question-bank/**").hasAnyRole("COLLABORATOR", "ADMIN") // Question bank
                                                                                                      // endpoints
                                                                                                      // require
                                                                                                      // COLLABORATOR or
                                                                                                      // ADMIN
                        .requestMatchers("/api/question-group/**").hasAnyRole("COLLABORATOR", "ADMIN") // Question group
                                                                                                       // endpoints
                                                                                                       // require
                                                                                                       // COLLABORATOR
                                                                                                       // or ADMIN
                        .requestMatchers("/api/test-data/**").permitAll() // Test data generation endpoints
                        .requestMatchers("/api/debug/**").permitAll() // Debug endpoints (for testing)
                        .requestMatchers("/audio/**").permitAll() // Audio files
                        .requestMatchers("/images/**").permitAll() // Image files
                        .requestMatchers("/uploads/**").permitAll() // Upload files (audio/images)
                        .requestMatchers("/static/**").permitAll() // Static files
                        // ✅ MEDIA FILES - Make them public
=======
                        .requestMatchers("/audio/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/static/**").permitAll()
>>>>>>> DuyAnh
                        .requestMatchers(HttpMethod.GET, "/files/**").permitAll()
                        .requestMatchers(HttpMethod.HEAD, "/files/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/files/**").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/user-results/**").permitAll() // User test results
                        .requestMatchers("/api/test-results/**").permitAll() // Test results and history
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/Upload/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blog/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blog/admin/stats").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/blog/upload").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/blog/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/blog/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/blog/{id}/unhide").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/blog/{id}/likes").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/blog/{id}/likes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blog/{id}/likes/check").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/blog/{id}/comments").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/blog/{id}/comments").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lessons").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/lessons/{lessonId}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/lessons/{lessonId}/exercises").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/lessons/{lessonId}/exercises/{exerciseId}")
                        .authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/lessons/{lessonId}/exercises/{exerciseId}/questions")
                        .authenticated()
                        .requestMatchers(HttpMethod.GET,
                                "/api/lessons/{lessonId}/exercises/{exerciseId}/questions/{questionId}")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST,
                                "/api/lessons/{lessonId}/exercises/{exerciseId}/questions/submit")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/lessons/{lessonId}/exercises/{exerciseId}/submit")
                        .authenticated()
<<<<<<< HEAD

                        // ================================================================
                        // AUTHENTICATED FLASHCARD ENDPOINTS (SPECIFIC ACTIONS ONLY)
                        // ================================================================
                        // Only specific actions that require authentication
                        .requestMatchers(HttpMethod.POST, "/api/flashcard-sets/{id}/view").authenticated() // Track
                                                                                                           // views
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/my").authenticated() // User's own sets
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/accessible").authenticated() // Accessible
                                                                                                           // sets

                        // Flashcard study endpoints (require authentication)
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/study/{setId}").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/flashcards/study/{setId}/answer").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/study/{setId}/progress").authenticated()

                        // ================================================================
                        // DASHBOARD & USER ACTIVITY ENDPOINTS
                        // ================================================================
                        .requestMatchers("/api/dashboard/test").permitAll() // TEMPORARY FOR TESTING
                        .requestMatchers("/api/dashboard/debug").permitAll() // TEMPORARY FOR TESTING
                        .requestMatchers("/api/dashboard/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/user-activities/my/**").authenticated()
                        .requestMatchers("/api/user-activities/admin/**").hasRole("ADMIN")

                        // ================================================================
                        // CONTENT CREATION ENDPOINTS (COLLABORATORS + ADMINS)
                        // ================================================================
                        .requestMatchers(HttpMethod.POST, "/api/flashcard-sets").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/flashcard-sets/**").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/flashcard-sets/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/flashcards").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/flashcards/**").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/flashcards/**").hasRole("ADMIN")

                        // ================================================================
                        // QUESTION BANK ENDPOINTS (COLLABORATORS + ADMINS)
                        // ================================================================
                        .requestMatchers(HttpMethod.POST, "/api/question-bank/add").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/question-bank/add-test")
                        .hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/question-bank/**").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/question-bank/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-bank/list").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-bank/my").hasAnyRole("COLLABORATOR", "ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/question-group").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/question-group/create-with-questions")
                        .hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/question-group/**").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/question-group/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-group/list").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-group/my").hasAnyRole("COLLABORATOR", "ADMIN")

                        // ================================================================
                        // PREMIUM CONTENT ENDPOINTS
                        // ================================================================
                        .requestMatchers("/api/lessons/premium/**").hasAnyRole("PREMIUM", "ADMIN")
                        .requestMatchers("/api/exercises/premium/**").hasAnyRole("PREMIUM", "ADMIN")
                        .requestMatchers("/api/flashcard-sets/premium/**").hasAnyRole("PREMIUM", "ADMIN")

                        // ================================================================
                        // ADMIN ENDPOINTS
                        // ================================================================
=======
                        .requestMatchers("/api/dashboard").authenticated()
                        .requestMatchers("/api/users/{userId}/lessons/progress").authenticated()
                        .requestMatchers("/api/users/{userId}/**").authenticated()
>>>>>>> DuyAnh
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
