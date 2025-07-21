/**
 * ================================================================
 * API SERVICE CONFIGURATION - DEVELOPMENT MODE
 * ================================================================
 *
 * Central configuration for all API calls to the Spring Boot backend
 * Base URL and common headers setup
 * 🧪 MOCK MODE: Authentication bypassed for development
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResponse, ErrorResponse } from "../types";
import apiClient from "./apiRequest";

// ========== TYPE EXTENSIONS ==========

// Extend Axios request config to include our custom properties
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ========== MOCK TOKEN FOR DEVELOPMENT ==========

/**
 * Get auth token - MOCKED for development
 */
export const getToken = (): string | null => {
  // console.log('🧪 MOCK: Using student token');
  // return 'mock_student_token_12345';
  console.log('🧪 MOCK: Using student token for protected endpoint');
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg4OCwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE2MDAwMDAwMDB9.mockSignature';
  // ❌ REAL LOGIC COMMENTED OUT:
  /*
  return localStorage.getItem("toeic_access_token") ||
         localStorage.getItem("authToken") ||
         localStorage.getItem("accessToken");
  */
};

// ========== REQUEST INTERCEPTOR ==========

apiClient.interceptors.request.use(
  (config) => {
    // ✅ USE MOCK TOKEN instead of localStorage
    const token = getToken(); // Always returns mock token
    // ✅ FIXED - Only add Authorization if token is valid
    if (token && token.trim() && token.length > 5) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔒 Added valid token to request headers");
    } else {
      console.log("⚠️ Anonymous request - no Authorization header");
      // ✅ Explicitly remove Authorization header
      delete config.headers.Authorization;
    }

    // Always add token if available
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   console.log("🔒 Added MOCK token to request headers");
    // } else {
    //   console.log("⚠️ No auth token available for request");
    // }

    // Completely revamped URL handling logic
    if (config.url) {
      // First, fix any double slash issues (except for http:// or https://)
      config.url = config.url.replace(/([^:])\/\//g, "$1/");

      // Handle missing and duplicate /api prefixes
      if (config.url.startsWith("/api/api/")) {
        // Fix double api prefix
        config.url = config.url.replace("/api/api/", "/api/");
        console.log(`🛠️ Fixed double /api prefix: ${config.url}`);
      } else if (config.url.startsWith("api/")) {
        // Add missing slash
        config.url = `/${config.url}`;
        console.log(`🛠️ Added leading slash: ${config.url}`);
      } else if (
        !config.url.startsWith("/api/") &&
        !config.url.startsWith("http")
      ) {
        // Add missing /api/ prefix for relative URLs
        if (config.url.startsWith("/")) {
          config.url = `/api${config.url}`;
        } else {
          config.url = `/api/${config.url}`;
        }
        console.log(`🛠️ Added /api prefix: ${config.url}`);
      }
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - ${response.status}`
    );
    return response;
  },
  async (error: AxiosError) => {
    console.error(
      `❌ API Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      } - ${error.response?.status}`,
      error.response?.data
    );

    // ✅ BYPASS TOKEN REFRESH LOGIC - Comment out 401 handling to prevent loops:
    /*
    const original = error.config as ExtendedAxiosRequestConfig;

    // Handle JWT token refresh on 401 errors
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      const refreshToken =
        localStorage.getItem("toeic_refresh_token") ||
        localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          console.log("🔄 Attempting to refresh token...");

          // Use a separate axios instance to avoid infinite loops
          const refreshResponse = await axios
            .create({
              baseURL: "http://localhost:8080/api",
              timeout: 10000,
            })
            .post("/auth/refresh", {
              refreshToken,
            });

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          // Update tokens using the same keys as auth service
          localStorage.setItem("toeic_access_token", accessToken);
          localStorage.setItem("authToken", accessToken); // For backward compatibility

          if (newRefreshToken) {
            localStorage.setItem("toeic_refresh_token", newRefreshToken);
            localStorage.setItem("refreshToken", newRefreshToken); // For backward compatibility
          }

          console.log("✅ Token refreshed successfully");

          // Retry original request with new token
          if (original.headers) {
            original.headers["Authorization"] = `Bearer ${accessToken}`;
          }

          return apiClient(original);
        } catch (refreshError: any) {
          console.error("❌ Token refresh failed:", refreshError);

          // Check if refresh endpoint exists and user session is valid
          if (refreshError.response?.status === 404) {
            console.log("🔄 Refresh endpoint not found, redirecting to login");
          } else if (refreshError.response?.status === 401) {
            console.log("🔄 Refresh token invalid, redirecting to login");
          } else {
            console.log(
              "🔄 Refresh failed for unknown reason, redirecting to login"
            );
          }

          // Clear tokens and redirect gracefully
          handleAuthFailure();
          return Promise.reject(error);
        }
      } else {
        console.log("🚫 No refresh token available, redirecting to login");
        handleAuthFailure();
        return Promise.reject(error);
      }
    }
    */

    // ✅ SIMPLE ERROR HANDLING - No redirects:
    if (error.response?.status === 401) {
      console.log('🧪 MOCK: 401 error ignored - using mock auth');
      // Don't redirect, just log the error
    }

    // Handle other common error scenarios
    if (error.response?.status === 403) {
      console.warn("🚫 Access Denied: Insufficient permissions");
    }

    return Promise.reject(error);
  }
);

// ========== AUTH FAILURE HANDLER ==========

/**
 * Handle authentication failure gracefully - MOCK MODE
 */
const handleAuthFailure = () => {
  console.log('🧪 MOCK: handleAuthFailure called - no action taken');
  
  // ❌ COMMENTED OUT ALL AUTH CLEARING AND REDIRECTS:
  /*
  // Clear all auth data - all possible keys
  localStorage.removeItem("toeic_access_token");
  localStorage.removeItem("toeic_refresh_token");
  localStorage.removeItem("toeic_current_user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("currentUser");

  // Set a flag to prevent immediate redirect loops
  sessionStorage.setItem("authFailed", "true");

  // Use setTimeout to allow current operations to complete
  setTimeout(() => {
    console.log("🔄 Redirecting to login due to authentication failure");
    window.location.href = "/login"; // ← THIS WAS CAUSING THE LOOP
  }, 100);
  */
};

// ========== HELPER FUNCTIONS ==========

/**
 * Extract data from API response
 */
export const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: AxiosError): ErrorResponse => {
  if (error.response?.data) {
    return error.response.data as ErrorResponse;
  }

  return {
    success: false,
    message: error.message || "An unexpected error occurred",
    details: error.code,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check if current user has admin privileges - MOCKED
 */
export const isAdmin = (): boolean => {
  console.log('🧪 MOCK: isAdmin() - returning false for student user');
  return false; // Student user is not admin
  
  // ❌ REAL LOGIC COMMENTED OUT:
  /*
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return false;

  try {
    const user = JSON.parse(currentUser);
    return user.role === "ADMIN";
  } catch {
    return false;
  }
  */
};

/**
 * Check if current user has collaborator or admin privileges - MOCKED
 */
export const canEditContent = (): boolean => {
  console.log('🧪 MOCK: canEditContent() - returning false for student user');
  return false; // Student user cannot edit content
  
  // ❌ REAL LOGIC COMMENTED OUT:
  /*
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return false;

  try {
    const user = JSON.parse(currentUser);
    return user.role === "ADMIN" || user.role === "COLLABORATOR";
  } catch {
    return false;
  }
  */
};

/**
 * Get current user ID - MOCKED
 */
export const getCurrentUserId = (): number | null => {
  console.log('🧪 MOCK: getCurrentUserId() - returning 888');
  return 888; // Mock student user ID
  
  // ❌ REAL LOGIC COMMENTED OUT:
  /*
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return null;

  try {
    const user = JSON.parse(currentUser);
    return user.id;
  } catch {
    return null;
  }
  */
};

/**
 * Build query parameters string
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Generic API request wrapper
 */
export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any
): Promise<T> => {
  try {
    let response;

    switch (method) {
      case "GET":
        response = await apiClient.get(url);
        break;
      case "POST":
        response = await apiClient.post(url, data);
        break;
      case "PUT":
        response = await apiClient.put(url, data);
        break;
      case "DELETE":
        response = await apiClient.delete(url);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error: any) {
    console.log('🧪 MOCK: API request failed, returning mock data or error');
    throw handleApiError(error);
  }
};

// Check your API base URL configuration:
const apiInstance = axios.create({
  baseURL: "http://localhost:8080", // Removed /api to prevent double prefixing
  timeout: 10000,
  // ...other config
});

// Export the instance with a more descriptive name to avoid confusion with the file name
export { apiClient as api, apiInstance };
export default apiClient;