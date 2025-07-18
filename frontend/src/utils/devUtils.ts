/**
 * ================================================================
 * DEVELOPMENT UTILITIES
 * ================================================================
 * Helper functions for development and debugging
 */

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  console.log("🧹 Clearing all authentication data...");

  const authKeys = [
    "toeic_access_token",
    "toeic_refresh_token",
    "toeic_current_user",
    "authToken",
    "accessToken",
    "currentUser",
    "refreshToken",
  ];

  authKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log("✅ Authentication data cleared");
};

/**
 * Setup development test authentication
 */
export const setupDevAuth = (): void => {
  console.log("🔧 Setting up development authentication...");

  // Clear existing data first
  clearAuthData();

  // Create test user
  const testUser = {
    id: 999,
    username: "testuser",
    email: "test@example.com",
    displayName: "Test User",
    membershipType: "FREE",
    role: "USER",
    isPremium: false,
    isActive: true,
  };

  // Create proper JWT-like token for development
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: testUser.username,
      userId: testUser.id,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
      iat: Math.floor(Date.now() / 1000),
      dev: true,
    })
  );
  const signature = btoa("dev-signature-not-verified");
  const testToken = `${header}.${payload}.${signature}`;

  // Store in localStorage
  localStorage.setItem("toeic_current_user", JSON.stringify(testUser));
  localStorage.setItem("toeic_access_token", testToken);
  localStorage.setItem(
    "toeic_refresh_token",
    `${header}.${payload}.refresh-signature`
  );

  console.log("✅ Development authentication setup complete");
  console.log("🔧 Test token created:", testToken.substring(0, 50) + "...");
};

// Make functions available globally in development
if (process.env.NODE_ENV === "development") {
  (window as any).devUtils = {
    clearAuthData,
    setupDevAuth,
  };

  console.log("🔧 Development utilities available via window.devUtils");
  console.log("🔧 Quick setup: Run devUtils.setupDevAuth() in console");

  // Auto-setup if no authentication exists
  setTimeout(() => {
    const hasAuth =
      localStorage.getItem("toeic_access_token") &&
      localStorage.getItem("toeic_current_user");
    if (!hasAuth) {
      console.log("🔧 No authentication found - auto-setting up dev auth");
      setupDevAuth();
    }
  }, 2000);
}
