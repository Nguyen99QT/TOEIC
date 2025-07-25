/**
 * ================================================================
 * API UTILITY FOR LEENGLISH TOEIC PLATFORM
 * ================================================================
 *
 * Centralized HTTP client for API communication
 * Handles authentication, base URL, and error responses
 */

import axios, { AxiosResponse, AxiosError } from "axios";

// Base configuration
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      {
        data: config.data,
        params: config.params,
      }
    );

    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ API Error: ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      // Forbidden - show access denied message
      console.warn("🚫 Access denied to resource");
    }

    return Promise.reject(error);
  }
);

// Export default api instance
export default api;
