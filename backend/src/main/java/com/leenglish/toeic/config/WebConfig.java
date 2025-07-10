package com.leenglish.toeic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
                // Serve audio files - legacy endpoint
                registry.addResourceHandler("/audio/**")
                                .addResourceLocations("classpath:/static/audio/");

                // Serve image files from external images directory - legacy endpoint
                registry.addResourceHandler("/images/**")
                                .addResourceLocations("file:images/")
                                .setCachePeriod(3600);

                // Serve other static resources - legacy endpoint
                registry.addResourceHandler("/static/**")
                                .addResourceLocations("classpath:/static/");

                // ✅ MEDIA FILES - Updated mapping for /files/** endpoints
                registry.addResourceHandler("/files/images/**")
                                .addResourceLocations("classpath:/static/images/")
                                .setCachePeriod(3600);

                registry.addResourceHandler("/files/audio/**")
                                .addResourceLocations("classpath:/static/audio/")
                                .setCachePeriod(3600);

                // ✅ ADDITIONAL MAPPINGS - Handle nested directory structure
                registry.addResourceHandler("/files/**")
                                .addResourceLocations("classpath:/static/")
                                .setCachePeriod(3600);
        }
}
