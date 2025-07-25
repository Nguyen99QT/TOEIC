package com.leenglish.toeic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    // CORS is now handled by CorsConfig.java - removed duplicate configuration
    // @Bean
    // public CorsFilter corsFilter() {
    //     CorsConfiguration config = new CorsConfiguration();
    //     config.setAllowCredentials(true);
    //     config.addAllowedOriginPattern("*");
    //     config.addAllowedHeader("*");
    //     config.addAllowedMethod("*");
    //     
    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     source.registerCorsConfiguration("/**", config);
    //     
    //     return new CorsFilter(source);
    // }

    // @Override
    // public void addCorsMappings(@NonNull CorsRegistry registry) {
    //     registry.addMapping("/**")
    //             .allowedOriginPatterns("*")
    //             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    //             .allowedHeaders("*")
    //             .allowCredentials(true);
    // }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve static audio files
        registry.addResourceHandler("/audio/**")
                .addResourceLocations("file:audio/", "classpath:/static/audio/");
        
        // Serve static image files  
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:images/", "classpath:/static/images/");
                
        // Serve uploaded files
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
                
        // Serve Upload directory (for blog files)
        registry.addResourceHandler("/Upload/**")
                .addResourceLocations("file:Upload/");
    }
}
