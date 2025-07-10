/**
 * ================================================================
 * AUTHENTICATION SERVICE
 * ================================================================
 * Handles user authentication, registration, and session management
 * Integrates with Spring Boot backend auth endpoints
 */

import { LoginRequest, RegisterRequest, User } from "../types";
import { api } from "./api";
import apiClient from "./apiRequest";

// CONSTANTS
// ================================================================

const TOKEN_KEY = "toeic_access_token";
const REFRESH_TOKEN_KEY = "toeic_refresh_token";
const USER_KEY = "toeic_current_user";

// ================================================================
// TYPES
// ================================================================

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

// ================================================================
// GLOBAL VARIABLES
// ================================================================

let refreshInterval: NodeJS.Timeout | null = null;

// ================================================================
// TOKEN MANAGEMENT
// ================================================================

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("authToken", token); // For backward compatibility
    console.log("✅ Token stored with keys:", TOKEN_KEY, "authToken");
  } catch (error) {
    console.error("❌ Failed to store token in localStorage:", error);
    // Try to diagnose localStorage issues
    try {
      const testKey = "localStorage_test";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      console.log("✅ localStorage is working properly");
    } catch (storageError) {
      console.error("❌ localStorage is not available:", storageError);
    }
  }
};

export const getToken = (): string | null => {
  // Try new key first, then fallback to old keys
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  if (token) {
    console.log(
      "🎫 Retrieved token from localStorage:",
      token.substring(0, 15) + "..."
    );
    // Basic JWT format check (header.payload.signature)
    if (token.split(".").length !== 3) {
      console.warn("⚠️ Retrieved token is not in valid JWT format");
      return null; // Return null for invalid token format
    }

    // Check for token expiration
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        console.warn("⚠️ Token has expired, returning null");
        return null;
      }
    } catch (e) {
      console.warn("⚠️ Could not parse token payload:", e);
      // Continue and return token anyway, let the API handle invalid tokens
    }
  } else {
    console.log(
      "⚠️ No token found in localStorage with keys:",
      TOKEN_KEY,
      "authToken",
      "accessToken"
    );
    // Hiển thị tất cả các keys trong localStorage để debug
    console.log(
      "🔍 All localStorage keys:",
      Object.keys(localStorage).join(", ")
    );
  }
  return token;
};

export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem("refreshToken", refreshToken); // For compatibility
};

export const getRefreshToken = (): string | null => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    localStorage.getItem("refreshToken")
  );
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("authToken"); // For backward compatibility
  localStorage.removeItem("currentUser"); // For backward compatibility
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("tokenExpiry"); // For backward compatibility
};

// ================================================================
// USER MANAGEMENT
// ================================================================

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem("currentUser", JSON.stringify(user)); // For backward compatibility
};

export const getCurrentUser = (): User | null => {
  try {
    // Try new key first, then fallback to old key
    const userStr =
      localStorage.getItem(USER_KEY) || localStorage.getItem("currentUser");

    if (!userStr) return null;

    const user = JSON.parse(userStr);
    console.log("📱 Retrieved user from localStorage:", user);

    // Add computed isPremium property
    return {
      ...user,
      isPremium: user.membershipType === "PREMIUM" || user.role === "ADMIN",
    };
  } catch (error) {
    console.error("❌ Error parsing user from localStorage:", error);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("currentUser");
    return null;
  }
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("currentUser"); // For backward compatibility
};

// ================================================================
// AUTHENTICATION STATUS
// ================================================================

export const isAuthenticated = (): boolean => {
  console.log("🔍 Checking authentication status...");

  const token = getToken();
  const user = getCurrentUser();

  if (!token) {
    console.log("❌ Authentication check failed: No valid token found");
    return false;
  }

  if (!user) {
    console.log("❌ Authentication check failed: No user data found");
    return false;
  }

  // Check if token is expired (basic check)
  try {
    // Use the debug function for detailed token info in development
    if (process.env.NODE_ENV !== "production") {
      debugJwtToken(token);
    }

    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (tokenPayload.exp && tokenPayload.exp < currentTime) {
      console.warn("🔑 Token expired, removing authentication");
      removeToken();
      return false;
    }

    console.log(
      "✅ Authentication check passed: User is authenticated as",
      user.username || user.email
    );
    return true;
  } catch (error) {
    console.error("🔑 Error checking token validity:", error);

    // Don't clear token on parse error, just return true if we have token and user
    // But log it clearly for debugging
    console.log(
      `Token parse failed, but token exists. Token starts with: ${token.substring(
        0,
        15
      )}...`
    );
    return !!(token && user);
  }
};

export const isTokenExpiringSoon = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const fiveMinutesFromNow = currentTime + 5 * 60; // 5 minutes

    return tokenPayload.exp && tokenPayload.exp <= fiveMinutesFromNow;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return false;
  }
};

// ================================================================
// AUTO REFRESH MECHANISM
// ================================================================

export const startAutoRefresh = (): void => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  console.log("🔄 Starting auto-refresh timer");

  // Refresh token every 55 minutes (tokens usually expire in 1 hour)
  refreshInterval = setInterval(async () => {
    try {
      console.log("🔄 Auto-refreshing token...");
      await refreshAuthToken();
    } catch (error) {
      console.error("❌ Auto-refresh failed:", error);
      // If refresh fails, user will be logged out on next API call
    }
  }, 55 * 60 * 1000); // 55 minutes
};

export const stopAutoRefresh = (): void => {
  if (refreshInterval) {
    console.log("⏹️ Stopping auto-refresh timer");
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// ================================================================
// TOKEN REFRESH
// ================================================================

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Refreshing auth token...");

    const response = await apiClient.post("/api/auth/refresh", {
      refreshToken: refreshToken,
    });

    if (response.data && response.data.accessToken) {
      // Update stored tokens
      setToken(response.data.accessToken);

      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }

      console.log("✅ Token refreshed successfully");
      return response.data.accessToken;
    } else {
      throw new Error("Invalid refresh response - missing accessToken");
    }
  } catch (error: any) {
    console.error("❌ Token refresh error:", error);
    removeToken(); // Clear invalid tokens
    throw error;
  }
};

// ================================================================
// SERVER HEALTH CHECK
// ================================================================

// Sửa hàm checkServerStatus
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    console.log("🩺 Checking server health...");
    // Sử dụng endpoint chính xác /api/health
    const response = await api.get("/api/health");
    console.log("✅ Server health check passed:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Server health check failed:", error);
    return false;
  }
};

// ================================================================
// AUTH ACTIONS
// ================================================================

// ✅ SỬA: Hàm login chính - sử dụng LoginRequest interface
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  console.log(`🔑 Login attempt for: ${credentials.username}`);

  try {
    // First check if the server is available
    const isServerUp = await checkServerStatus().catch(() => false);
    if (!isServerUp) {
      throw new Error("Server is not responding. Please try again later.");
    }

    console.log("🔐 Using correct endpoint: /api/auth/login");
    // Use the correct endpoint /api/auth/login that matches the backend
    const response = await api.post("/api/auth/login", credentials);

    if (!response.data || !response.data.accessToken) {
      console.error("❌ Invalid login response:", response.data);
      throw new Error("Server returned invalid login data");
    }

    const { accessToken, refreshToken, user } = response.data;

    // Add explicit console logs for debugging
    console.log("🔐 Received login response:", {
      accessToken: response.data.accessToken ? "✓ Present" : "✗ Missing",
      refreshToken: response.data.refreshToken ? "✓ Present" : "✗ Missing",
      user: response.data.user ? "✓ Present" : "✗ Missing",
      tokenLength: response.data.accessToken?.length,
    });

    // Store tokens and user data with explicit success checks
    try {
      setToken(accessToken);
      console.log("✅ Token stored successfully");

      if (refreshToken) {
        setRefreshToken(refreshToken);
        console.log("✅ Refresh token stored successfully");
      }

      setCurrentUser(user);
      console.log(
        "✅ User data stored successfully:",
        user.username || user.email
      );

      // Verify the token was actually stored
      const storedToken = getToken();
      if (!storedToken) {
        console.error("⚠️ Failed to store token in localStorage");
        throw new Error("Failed to store authentication data");
      }

      // Verify user data was actually stored
      const storedUser = getCurrentUser();
      if (!storedUser) {
        console.error("⚠️ Failed to store user data in localStorage");
        throw new Error("Failed to store user data");
      }
    } catch (storageError) {
      console.error("❌ Error storing auth data:", storageError);
      throw new Error("Failed to save authentication data");
    }

    // Start auto-refresh timer to keep the session alive
    startAutoRefresh();

    console.log("✅ Login successful:", user.username);

    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error);

    // Add better error handling with detailed messages
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        `Server responded with ${error.response.status}: ${JSON.stringify(
          error.response.data
        )}`
      );

      // Special handling for common authentication errors
      if (error.response.status === 401) {
        throw new Error("Invalid username or password. Please try again.");
      } else if (error.response.status === 404) {
        throw new Error(
          "Authentication service not found. Please contact support."
        );
      }

      throw new Error(
        error.response.data?.message || `Server error ${error.response.status}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
      throw new Error(
        "Server not responding. Please check your connection or try again later."
      );
    } else {
      // Something happened in setting up the request
      throw new Error("Login request failed: " + error.message);
    }
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    console.log("📝 Attempting registration for:", userData.username);

    const response = await api.post("/auth/register", userData);
    const registrationData = response.data;

    console.log("✅ Registration successful:", registrationData);
    return registrationData.user || registrationData;
  } catch (error: any) {
    console.error("❌ Registration failed:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
};
//handleLogout
// ===============================================================
// ================================================================
// HANDLE LOGOUT FUNCTION
// ================================================================

/**
 * Handles the logout process with proper cleanup
 * Can be used directly in components with error handling
 */
export const handleLogout = async (): Promise<void> => {
  try {
    await logout();
    console.log("✅ Logout completed successfully");
  } catch (error) {
    console.error("❌ Error during logout:", error);
    // Even if logout fails, ensure local data is cleared
    clearAuthData();
    // Redirect to login page
    window.location.href = "/auth/login";
  }
};

export const logout = async (): Promise<void> => {
  try {
    console.log("🚪 Logging out...");

    // Try to call logout endpoint (if available)
    try {
      await apiClient.post("/api/auth/logout");
      console.log("✅ Server logout successful");
    } catch (error) {
      console.warn("⚠️ Server logout failed, but clearing local data anyway");
    }
  } finally {
    // Always clear local storage
    removeToken();
    removeCurrentUser();
    stopAutoRefresh();
    // Force reload to reset app state and AuthContext
    window.location.href = "/auth/login";
    console.log("✅ Local data cleared and redirected to login");
  }
};

// ================================================================
// INITIALIZATION
// ================================================================

export function initializeAuth() {
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

// ================================================================
// ROLE-BASED UTILITIES
// ================================================================

export const isCurrentUserAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
};

export const canCurrentUserEditContent = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "ADMIN" || user?.role === "COLLABORATOR";
};

export const canEditUserProfile = (targetUserId: number): boolean => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return false;
  }

  // Admin can edit anyone
  if (currentUser.role === "ADMIN") {
    return true;
  }

  // Users can only edit their own profile
  return currentUser.id === targetUserId;
};

// ================================================================
// PASSWORD MANAGEMENT
// ================================================================

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    console.log("✅ Password changed successfully");
  } catch (error: any) {
    console.error("❌ Password change failed:", error);
    throw new Error(error.response?.data?.message || "Password change failed");
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", { email });
    console.log("✅ Password reset requested");
  } catch (error: any) {
    console.error("❌ Password reset request failed:", error);
    throw new Error(
      error.response?.data?.message || "Password reset request failed"
    );
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    console.log("✅ Password reset successful");
  } catch (error: any) {
    console.error("❌ Password reset failed:", error);
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

// Logout helper
export const clearAuthData = () => {
  console.log("🧹 Clearing auth data...");
  removeToken();
  removeCurrentUser();
  stopAutoRefresh();
};

// Add this to the UTILITY FUNCTIONS section
export const debugJwtToken = (token: string | null): void => {
  if (!token) {
    console.log("❌ No token provided for debugging");
    return;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Invalid JWT token format (should have 3 parts)");
      return;
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    console.group("🔍 JWT Token Debug");
    console.log("Header:", header);
    console.log("Payload:", payload);
    console.log("Issuer:", payload.iss || "Not specified");
    console.log("Subject:", payload.sub || "Not specified");
    console.log(
      "Issued At:",
      payload.iat
        ? new Date(payload.iat * 1000).toLocaleString()
        : "Not specified"
    );
    console.log(
      "Expiration:",
      payload.exp
        ? new Date(payload.exp * 1000).toLocaleString()
        : "Not specified"
    );
    console.log(
      "Roles:",
      payload.role || payload.roles || payload.authorities || "Not specified"
    );
    console.groupEnd();

    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = payload.exp - now;

      if (timeLeft <= 0) {
        console.error(`❌ Token expired ${Math.abs(timeLeft)} seconds ago`);
      } else {
        console.log(
          `✅ Token valid for ${timeLeft} more seconds (${Math.floor(
            timeLeft / 60
          )} minutes)`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error parsing JWT token:", error);
  }
};

// Add this to your utility functions section
export const diagnosePossibleAuthIssues = (): void => {
  console.group("🔍 Authentication Diagnostic Check");

  // Check if localStorage is available and working
  try {
    const testKey = "test_storage";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    console.log("✅ localStorage is accessible");
  } catch (e) {
    console.error("❌ localStorage is not accessible:", e);
    console.log(
      "⚠️ Possible causes: Private browsing mode, storage quota exceeded"
    );
  }

  // Check for existing tokens
  const token = getToken();
  console.log(token ? "✅ Token exists" : "❌ No token found");

  // Check for existing user data
  const user = getCurrentUser();
  console.log(user ? "✅ User data exists" : "❌ No user data found");

  // Check for cookie settings
  console.log("ℹ️ Document cookie settings:", {
    cookieEnabled: navigator.cookieEnabled,
    cookieLength: document.cookie.length,
  });

  // Check for CORS issues
  console.log("ℹ️ Check network tab for CORS errors during API calls");

  // Check if we're running in an iframe (may affect storage)
  const isInIframe = window !== window.top;
  console.log(
    isInIframe
      ? "⚠️ Application is running in an iframe (may affect storage)"
      : "✅ Application is not in an iframe"
  );

  console.groupEnd();
};

// Export commonly used functions for backward compatibility
export {
  // Main auth functions
  login as authenticateUser,
  // Token functions
  getToken as getAuthToken,
  // User functions
  getCurrentUser as getUser,
  setToken as setAuthToken,
  setCurrentUser as setUser,
  logout as signOut,
};
