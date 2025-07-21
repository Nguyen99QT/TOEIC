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
                        // ================================================================
                        // BASIC PUBLIC ENDPOINTS
                        // ================================================================
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        // Specific TOEIC test endpoints - ORDER MATTERS!
                        .requestMatchers(HttpMethod.POST, "/api/tests/*/review").authenticated() // Test review endpoint requires auth
                        .requestMatchers(HttpMethod.GET, "/api/tests/**").permitAll() // Test generation endpoints (for testing)
                        .requestMatchers("/api/question-bank/**").hasAnyRole("COLLABORATOR", "ADMIN") // Question bank endpoints require COLLABORATOR or ADMIN
                        .requestMatchers("/api/question-group/**").hasAnyRole("COLLABORATOR", "ADMIN") // Question group endpoints require COLLABORATOR or ADMIN
                        .requestMatchers("/api/test-data/**").permitAll() // Test data generation endpoints
                        .requestMatchers("/api/debug/**").permitAll() // Debug endpoints (for testing)
                        .requestMatchers("/audio/**").permitAll() // Audio files
                        .requestMatchers("/images/**").permitAll() // Image files
                        .requestMatchers("/uploads/**").permitAll() // Upload files (audio/images)
                        .requestMatchers("/static/**").permitAll() // Static files
                        // ✅ MEDIA FILES - Make them public
                        .requestMatchers(HttpMethod.GET, "/files/**").permitAll()
                        .requestMatchers(HttpMethod.HEAD, "/files/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/files/**").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/user-results/**").permitAll() // User test results
                        .requestMatchers("/api/test-results/**").permitAll() // Test results and history
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        
                        // ================================================================
                        // PUBLIC LESSON ENDPOINTS
                        // ================================================================
                        .requestMatchers(HttpMethod.GET, "/api/lessons/free").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lessons/free/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lessons/*/exercises/*/questions/free").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/questions/free").permitAll()

                        // ================================================================
                        // PUBLIC FLASHCARD ENDPOINTS (UPDATED)
                        // ================================================================
                        // Public flashcard set endpoints
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/*/public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/category/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/difficulty/**").permitAll()

                        // Public flashcards endpoints
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/free").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/free/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/sets").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/sets/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/test").permitAll()

                        // Public flashcard-sets endpoints - OPEN FOR PUBLIC ACCESS
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcard-sets/**").permitAll()

                        // Legacy public endpoints (for backward compatibility)
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/sets").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/sets/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/set/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/level/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flashcards/category/**").permitAll()

                        // ================================================================
                        // AUTHENTICATED LESSON ENDPOINTS
                        // ================================================================
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

                        // Submit answers
                        .requestMatchers(HttpMethod.POST,
                                "/api/lessons/{lessonId}/exercises/{exerciseId}/questions/submit")
                        .authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/lessons/{lessonId}/exercises/{exerciseId}/submit")
                        .authenticated()

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
                        .requestMatchers(HttpMethod.POST, "/api/question-bank/add-test").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/question-bank/**").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/question-bank/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-bank/list").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-bank/my").hasAnyRole("COLLABORATOR", "ADMIN")
                        
                        .requestMatchers(HttpMethod.POST, "/api/question-group/create-with-questions").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/question-group/**").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/question-group/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-group/list").hasAnyRole("COLLABORATOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/question-group/my").hasAnyRole("COLLABORATOR", "ADMIN")

                        // Public question endpoints (for taking tests)
                        .requestMatchers(HttpMethod.GET, "/api/question-bank/test").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/question-bank/test-json").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/question-group/test").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/question-group/test-json").permitAll()

                        // ================================================================
                        // PREMIUM CONTENT ENDPOINTS
                        // ================================================================
                        .requestMatchers("/api/lessons/premium/**").hasAnyRole("PREMIUM", "ADMIN")
                        .requestMatchers("/api/exercises/premium/**").hasAnyRole("PREMIUM", "ADMIN")
                        .requestMatchers("/api/flashcard-sets/premium/**").hasAnyRole("PREMIUM", "ADMIN")

                        // ================================================================
                        // ADMIN ENDPOINTS
                        // ================================================================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/admin/**").hasRole("ADMIN")

                        // Admin content management
                        .requestMatchers("/api/admin/lessons/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/exercises/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/flashcard-sets/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/flashcards/**").hasRole("ADMIN")

                        // ================================================================
                        // OTHER PROTECTED ENDPOINTS
                        // ================================================================
                        .requestMatchers("/api/users/profile").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/progress/**").hasAnyRole("USER", "ADMIN")

                        // Exercise submission and feedback endpoints
                        .requestMatchers(HttpMethod.POST, "/api/exercises/{id}/submit").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/exercises/feedback").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/exercises/{id}/results").authenticated()

                        // Legacy catch-all patterns (maintain backward compatibility)
                        // .requestMatchers("/api/lessons/**").hasAnyRole("USER", "ADMIN")
                        // .requestMatchers("/api/exercises/**").hasAnyRole("USER", "ADMIN")
                        // .requestMatchers("/api/questions/**").hasAnyRole("USER", "ADMIN")
                        // .requestMatchers("/api/flashcards/**").hasAnyRole("USER", "ADMIN")

                        // All other requests require authentication
                        .anyRequest().permitAll())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
