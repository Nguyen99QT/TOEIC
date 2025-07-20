package com.leenglish.toeic.exception;

/**
 * ================================================================
 * RESOURCE NOT FOUND EXCEPTION
 * ================================================================
 * 
 * Exception thrown when a requested resource is not found
 * Used for 404 Not Found responses
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }
} 