/**
 * ================================================================
 * TOKEN VALIDATION UTILITY
 * ================================================================
 * Utility to handle JWT token validation and automatic refresh
 */

import apiClient from "../services/apiRequest";

export interface TokenValidationResult {
  isValid: boolean;
  needsRefresh: boolean;
  shouldLogout: boolean;
}

/**
 * Validate current JWT token and handle automatic refresh
 */
export const validateAndRefreshToken =
  async (): Promise<TokenValidationResult> => {
    const token =
      localStorage.getItem("toeic_access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken");

    if (!token) {
      return {
        isValid: false,
        needsRefresh: false,
        shouldLogout: true,
      };
    }

    try {
      // First, try to validate the token with the validate-token endpoint
      const response = await apiClient.post("/auth/validate-token");

      if (response.status === 200 && response.data.valid) {
        console.log("✅ Token is valid");
        return {
          isValid: true,
          needsRefresh: false,
          shouldLogout: false,
        };
      }
    } catch (error: any) {
      console.log("❌ Token validation failed:", error.response?.status);

      // If validation fails with 401, the token is invalid/expired
      if (error.response?.status === 401) {
        console.log("🔄 Token invalid - user needs to re-login");
        return {
          isValid: false,
          needsRefresh: false,
          shouldLogout: true,
        };
      }

      // For other errors, logout
      return {
        isValid: false,
        needsRefresh: false,
        shouldLogout: true,
      };
    }

    return {
      isValid: false,
      needsRefresh: false,
      shouldLogout: true,
    };
  };

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  const authKeys = [
    "toeic_access_token",
    "toeic_refresh_token",
    "toeic_current_user",
    "accessToken",
    "authToken",
    "refreshToken",
    "user",
    "currentUser",
  ];

  authKeys.forEach((key) => localStorage.removeItem(key));
  console.log("🧹 Cleared all authentication data");
};

/**
 * Handle authentication failure - redirect to login
 */
export const handleAuthFailure = (): void => {
  clearAuthData();

  // Set flag to prevent redirect loops
  sessionStorage.setItem("authFailed", "true");
  sessionStorage.setItem("authFailureReason", "token_invalid");

  // Redirect after a brief delay
  setTimeout(() => {
    console.log("🔄 Redirecting to login due to authentication failure");
    window.location.href = "/login";
  }, 100);
};

/**
 * Check if tokens need to be cleared and user needs to re-login
 */
export const checkAndClearInvalidTokens = async (): Promise<boolean> => {
  try {
    const result = await validateAndRefreshToken();

    if (result.shouldLogout) {
      console.log(
        "🔄 Invalid tokens detected, clearing and redirecting to login"
      );
      handleAuthFailure();
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Error checking tokens:", error);
    handleAuthFailure();
    return true;
  }
};
