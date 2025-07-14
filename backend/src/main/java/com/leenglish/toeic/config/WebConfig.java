package com.leenglish.toeic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
                // Serve audio files from static directory
                registry.addResourceHandler("/audio/**")
                                .addResourceLocations("classpath:/static/audio/");

                // Serve image files from static directory
                registry.addResourceHandler("/images/**")
                                .addResourceLocations("classpath:/static/images/")
                                .setCachePeriod(3600);

                // Serve static resources directly
                registry.addResourceHandler("/static/audio/**")
                                .addResourceLocations("classpath:/static/audio/");

                registry.addResourceHandler("/static/images/**")
                                .addResourceLocations("classpath:/static/images/")
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
