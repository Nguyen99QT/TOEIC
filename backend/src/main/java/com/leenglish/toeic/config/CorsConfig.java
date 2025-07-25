package com.leenglish.toeic.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

        @Value("${cors.allowed-origins}")
        private String allowedOrigins;

        @Value("${cors.allowed-methods}")
        private String allowedMethods;

        @Value("${cors.allowed-headers}")
        private String allowedHeaders;

        @Value("${cors.exposed-headers}")
        private String exposedHeaders;

        @Value("${cors.allow-credentials}")
        private boolean allowCredentials;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Set allowed origins using allowedOriginPatterns for compatibility with
                // allowCredentials
                List<String> origins = Arrays.asList(allowedOrigins.split(","));
                configuration.setAllowedOriginPatterns(origins);
                configuration.setAllowCredentials(allowCredentials);

                // Set allowed methods
                List<String> methods = Arrays.asList(allowedMethods.split(","));
                configuration.setAllowedMethods(methods);

                // Set allowed headers
                List<String> headers = Arrays.asList(allowedHeaders.split(","));
                configuration.setAllowedHeaders(headers);

                // Set exposed headers
                List<String> exposed = Arrays.asList(exposedHeaders.split(","));
                configuration.setExposedHeaders(exposed);

                // Register the configuration for all paths
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}
