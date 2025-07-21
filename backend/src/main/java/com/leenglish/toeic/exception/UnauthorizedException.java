package com.leenglish.toeic.exception;

/**
 * ================================================================
 * UNAUTHORIZED EXCEPTION
 * ================================================================
 * 
 * Exception thrown when user is not authorized to perform an action
 * Used for 401 Unauthorized responses
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public UnauthorizedException(String action, String resource) {
        super(String.format("Unauthorized to %s %s", action, resource));
    }
} 