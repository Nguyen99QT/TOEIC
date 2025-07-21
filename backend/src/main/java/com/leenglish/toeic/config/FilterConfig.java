package com.leenglish.toeic.config;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.core.Ordered;

import com.leenglish.toeic.security.JwtAuthenticationFilter;

/**
 * This configuration disables the auto-registration of JwtAuthenticationFilter
 * because we already have JwtRequestFilter configured in SecurityConfig.
 * Having both filters active causes duplicate authentication processing and
 * database lookups.
 */
@Configuration
public class FilterConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Explicitly register the JwtAuthenticationFilter as a Spring Bean with
     * registration disabled to prevent duplicate JWT processing
     */
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtAuthenticationFilterRegistration() {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(
                jwtAuthenticationFilter);
        // Set to false to disable auto-registration of this filter
        registration.setEnabled(false);
        return registration;
    }
}
