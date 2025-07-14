package com.leenglish.toeic.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex,
            HttpServletRequest request) {

        System.err.println("❌ HTTP METHOD NOT SUPPORTED ERROR:");
        System.err.println("  🌐 URL: " + request.getRequestURL().toString());
        System.err.println("  📝 Method: " + request.getMethod());
        System.err.println("  📋 Query String: " + request.getQueryString());
        System.err.println("  🎯 Supported Methods: " + String.join(", ", ex.getSupportedMethods()));
        System.err.println("  📊 Headers: ");
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            System.err.println("    " + headerName + ": " + request.getHeader(headerName));
        });

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Method Not Supported");
        errorResponse.put("url", request.getRequestURL().toString());
        errorResponse.put("method", request.getMethod());
        errorResponse.put("supportedMethods", ex.getSupportedMethods());
        errorResponse.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }
}
