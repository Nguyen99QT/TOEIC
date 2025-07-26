/**
 * ================================================================
 * API SERVICE CONFIGURATION
 * ================================================================
 *
 * Central configuration for all API calls to the Spring Boot backend
 * Base URL and common headers setup
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

// ========== DEBUG UTILITIES ==========

/**
 * Debug function to test Current-User-Id header
 */
export const debugCurrentUserId = (): void => {
  console.log("🔍 DEBUG: Testing Current-User-Id detection...");
  
  const userId = getCurrentUserId();
  console.log("🔑 Current User ID:", userId);
  
  // Log all user-related localStorage entries
  const userKeys = Object.keys(localStorage).filter(key => 
    key.includes('user') || key.includes('User') || key.includes('auth')
  );
  
  console.log("📂 User-related localStorage entries:");
  userKeys.forEach(key => {
    const value = localStorage.getItem(key);
    try {
      const parsed = JSON.parse(value || '{}');
      console.log(`  ${key}:`, parsed);
    } catch {
      console.log(`  ${key}: "${value}"`);
    }
  });
};

// ========== REQUEST INTERCEPTOR ==========

apiClient.interceptors.request.use(
  (config) => {
    // Get token with fallback options
    const token =
      localStorage.getItem("toeic_access_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

    // Always add token if available
    if (token) {
      // In development, check if it's a test token and skip sending it to backend
      if (process.env.NODE_ENV === "development") {
        try {
          // Check if it's a development test token
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.dev === true) {
              console.log(
                "🔧 Development mode: Skipping test token for API request"
              );
              // Don't send the test token to the backend
              return config;
            }
          }
        } catch (error) {
          // If token parsing fails, check for legacy test tokens
          if (
            token.includes("test_token_for_development_only") ||
            token.includes("dev-signature")
          ) {
            console.log(
              "🔧 Development mode: Skipping legacy test token for API request"
            );
            return config;
          }
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔒 Added token to request headers");
      
      // Add Current-User-Id header for backend compatibility
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        config.headers["Current-User-Id"] = currentUserId.toString();
        console.log("🔑 Added Current-User-Id header:", currentUserId);
      } else {
        console.warn("⚠️ No current user ID found for Current-User-Id header");
        // Log available localStorage keys for debugging
        const availableKeys = Object.keys(localStorage).filter(key => 
          key.includes('user') || key.includes('User')
        );
        console.log("🔍 Available user-related localStorage keys:", availableKeys);
      }
    } else {
      console.log("⚠️ No auth token available for request");
    }

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

    const original = error.config as ExtendedAxiosRequestConfig;

    // Handle JWT token refresh on 401 errors
    if (error.response?.status === 401 && original && !original._retry) {
      console.warn("🔐 Unauthorized error detected:", error.config?.url);

      // Check if this is a login request - don't try to refresh for login failures
      if (error.config?.url?.includes('/auth/login')) {
        console.log("🔐 Login request failed, not attempting token refresh");
        return Promise.reject(error);
      }

      // Check if user just logged in recently - be more lenient
      const loginTimestamp = localStorage.getItem('auth_login_timestamp');
      const isVeryRecentLogin = loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 30000; // 30 seconds grace period
      
      if (isVeryRecentLogin) {
        console.log("🔧 Recent login detected, will be more patient with 401 errors");
      }

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
              timeout: 100000,
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

          // Only trigger auth failure if it's not a very recent login
          if (!isVeryRecentLogin) {
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
          } else {
            console.log("🔧 Recent login detected, not triggering auth failure on refresh error");
          }
          
          return Promise.reject(error);
        }
      } else {
        console.log("🚫 No refresh token available");
        
        // Only trigger auth failure if it's not a very recent login
        if (!isVeryRecentLogin) {
          console.log("🔄 Redirecting to login");
          handleAuthFailure();
        } else {
          console.log("🔧 Recent login detected, not triggering auth failure immediately");
        }
        
        return Promise.reject(error);
      }
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
 * Handle authentication failure gracefully
 */
const handleAuthFailure = () => {
  console.warn('⚠️ Authentication failure detected in API interceptor');
  
  // Check if user just logged in recently - don't logout immediately
  const loginTimestamp = localStorage.getItem('auth_login_timestamp');
  const isVeryRecentLogin = loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 60000; // 1 minute grace period
  
  if (isVeryRecentLogin) {
    console.log('🔧 Recent login detected, not clearing auth data immediately');
    return; // Don't clear auth data for recent logins
  }

  // Clear all auth data - all possible keys
  localStorage.removeItem("toeic_access_token");
  localStorage.removeItem("toeic_refresh_token");
  localStorage.removeItem("toeic_current_user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("currentUser");
  
  // Clear auth flags
  localStorage.removeItem('auth_just_logged_in');
  localStorage.removeItem('toeic_login_success');
  localStorage.removeItem('auth_login_timestamp');

  // Set a flag to prevent immediate redirect loops
  sessionStorage.setItem("authFailed", "true");

  // Use setTimeout to allow current operations to complete
  setTimeout(() => {
    console.log("🔄 Redirecting to login due to authentication failure");
    window.location.href = "/login";
  }, 100);
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
 * Check if current user has admin privileges
 */
export const isAdmin = (): boolean => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return false;

  try {
    const user = JSON.parse(currentUser);
    return user.role === "ADMIN";
  } catch {
    return false;
  }
};

/**
 * Check if current user has collaborator or admin privileges
 */
export const canEditContent = (): boolean => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return false;

  try {
    const user = JSON.parse(currentUser);
    return user.role === "ADMIN" || user.role === "COLLABORATOR";
  } catch {
    return false;
  }
};

/**
 * Get current user ID
 */
export const getCurrentUserId = (): number | null => {
  console.log("🔍 Getting current user ID...");
  
  // Try multiple possible keys for user data
  const keys = ["toeic_current_user", "currentUser", "user"];
  
  for (const key of keys) {
    const userData = localStorage.getItem(key);
    console.log(`   📋 Checking key '${key}': ${userData ? "✓ Found data" : "✗ No data"}`);
    
    if (!userData) continue;

    try {
      const user = JSON.parse(userData);
      console.log(`   📝 Parsed user data for '${key}':`, { id: user?.id, username: user?.username });
      
      if (user && user.id) {
        console.log(`✅ Found user ID: ${user.id} from key '${key}'`);
        return user.id;
      }
    } catch (error) {
      console.warn(`   ⚠️ Failed to parse user data from key '${key}':`, error);
      continue;
    }
  }

  console.warn("❌ Could not find user ID in any localStorage key");
  return null;
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
