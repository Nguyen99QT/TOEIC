/**
 * ================================================================
 * AUTHENTICATION DEBUG TEST
 * ================================================================
 * Test script để debug authentication issue
 */

export const testAuth = () => {
  console.log("=== AUTH DEBUG TEST ===");

  // Check tokens
  const accessToken =
    localStorage.getItem("toeic_access_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  const refreshToken =
    localStorage.getItem("toeic_refresh_token") ||
    localStorage.getItem("refreshToken");

  console.log("🔍 Access Token:", accessToken ? "EXISTS" : "MISSING");
  console.log("🔍 Refresh Token:", refreshToken ? "EXISTS" : "MISSING");

  // Check user data
  const userData =
    localStorage.getItem("toeic_user") || localStorage.getItem("user");

  console.log("🔍 User Data:", userData ? "EXISTS" : "MISSING");

  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("👤 User:", user.username || user.email);
    } catch (e) {
      console.error("❌ Invalid user data format");
    }
  }

  // Check auth state
  const isAuthenticated = !!accessToken && !!userData;
  console.log("🔍 Authenticated:", isAuthenticated);

  return {
    accessToken,
    refreshToken,
    userData,
    isAuthenticated,
  };
};

// Add to window for easy access
if (typeof window !== "undefined") {
  (window as any).testAuth = testAuth;
}
