
package com.leenglish.toeic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
<<<<<<< HEAD
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
=======
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
>>>>>>> DuyAnh
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
        @Bean
        public CorsFilter corsFilter() {
                CorsConfiguration config = new CorsConfiguration();
                config.addAllowedOrigin("http://localhost:3000");
                config.addAllowedMethod("*");
                config.addAllowedHeader("*");
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return new CorsFilter(source);
        }

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // Phục vụ file Upload
                String uploadDir = System.getProperty("user.dir") + "/Upload/";
                registry.addResourceHandler("/Upload/**")
                                .addResourceLocations("file:" + uploadDir);

                // ...existing code...
                registry.addResourceHandler("/audio/**")
                                .addResourceLocations("classpath:/static/audio/");
                registry.addResourceHandler("/images/**")
                                .addResourceLocations("classpath:/static/images/")
                                .setCachePeriod(3600);
                registry.addResourceHandler("/static/audio/**")
                                .addResourceLocations("classpath:/static/audio/");
                registry.addResourceHandler("/static/images/**")
                                .addResourceLocations("classpath:/static/images/")
                                .setCachePeriod(3600);
                registry.addResourceHandler("/static/**")
                                .addResourceLocations("classpath:/static/");
                registry.addResourceHandler("/files/images/**")
                                .addResourceLocations("classpath:/static/images/")
                                .setCachePeriod(3600);
                registry.addResourceHandler("/files/audio/**")
                                .addResourceLocations("classpath:/static/audio/")
                                .setCachePeriod(3600);
                registry.addResourceHandler("/files/**")
                                .addResourceLocations("classpath:/static/")
                                .setCachePeriod(3600);

                registry.addResourceHandler("/uploads/**")
                                .addResourceLocations("file:uploads/")
                                .setCachePeriod(3600)
                                .resourceChain(true);
        }

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                                .allowedOrigins("*")
                                .allowedMethods("GET", "POST", "PUT", "DELETE")
                                .allowedHeaders("*");
        }
}
