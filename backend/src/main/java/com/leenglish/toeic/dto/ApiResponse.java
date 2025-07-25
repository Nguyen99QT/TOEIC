package com.leenglish.toeic.dto;

import java.util.Map;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Map<String, Object> metadata;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, String message, T data) {
        this(success, message, data, null);
    }

    public ApiResponse(boolean success, String message, T data, Map<String, Object> metadata) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.metadata = metadata;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    // Static factory methods for convenience
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data);
    }
}
