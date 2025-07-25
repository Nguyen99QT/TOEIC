package com.leenglish.toeic.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl {

    // FIX: Make sure the property name matches what's in application.properties
    @Value("${jwt.refresh-expiration:604800}") // Add default value as fallback
    private long jwtRefreshExpiration;

    // NOT: @Value("${jwt.refresh-expiration}") // Wrong property name

    // ...rest of your service code...
}