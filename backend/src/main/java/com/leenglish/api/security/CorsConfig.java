package com.leenglish.api.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@Primary // Ensures this is the primary CORS config when multiple are present
public class CorsConfig {

    @Value("#{'${spring.web.cors.allowed-origins}'.split(',')}")
    private List<String> allowedOrigins;

    @Value("#{'${spring.web.cors.allowed-methods}'.split(',')}")
    private List<String> allowedMethods;

    @Value("#{'${spring.web.cors.allowed-headers}'.split(',')}")
    private List<String> allowedHeaders;

    @Value("#{'${spring.web.cors.exposed-headers}'.split(',')}")
    private List<String> exposedHeaders;

    @Value("${spring.web.cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${spring.web.cors.max-age:3600}")
    private long maxAge;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        System.out.println("🌐 Initializing primary CORS configuration in com.leenglish.api.security.CorsConfig");
        
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
        // IMPORTANT: When allowCredentials is true, we CANNOT use wildcards for origins
        // Instead, we use allowedOriginPatterns if we need pattern matching
        if (allowCredentials) {
            corsConfiguration.setAllowedOriginPatterns(allowedOrigins);
            System.out.println("✅ Setting specific allowed origin patterns: " + allowedOrigins);
        } else {
            corsConfiguration.setAllowedOrigins(allowedOrigins);
            System.out.println("✅ Setting allowed origins: " + allowedOrigins);
        }
        
        corsConfiguration.setAllowedMethods(allowedMethods);
        corsConfiguration.setAllowedHeaders(allowedHeaders);
        corsConfiguration.setExposedHeaders(exposedHeaders);
        corsConfiguration.setAllowCredentials(allowCredentials);
        corsConfiguration.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        System.out.println("✅ CORS configuration completed successfully");
        return source;
    }
}
