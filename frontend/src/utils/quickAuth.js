// Quick auth setup for browser console
window.setupQuickAuth = function () {
  console.log("🔧 Setting up quick authentication...");

  // Clear all existing auth data
  localStorage.clear();

  // Create test user
  const testUser = {
    id: 999,
    username: "huyplum",
    email: "huy@example.com",
    displayName: "Huy Plum",
    membershipType: "PREMIUM",
    role: "USER",
    isPremium: true,
    isActive: true,
  };

  // Create proper JWT token
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: testUser.username,
      userId: testUser.id,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      iat: Math.floor(Date.now() / 1000),
      dev: true,
      role: "USER",
    })
  );
  const signature = btoa("dev-signature-verified");
  const testToken = `${header}.${payload}.${signature}`;

  // Store in localStorage
  localStorage.setItem("toeic_current_user", JSON.stringify(testUser));
  localStorage.setItem("toeic_access_token", testToken);
  localStorage.setItem(
    "toeic_refresh_token",
    `${header}.${payload}.refresh-sig`
  );

  console.log("✅ Quick authentication setup complete!");
  console.log("User:", testUser.username);
  console.log("Token preview:", testToken.substring(0, 50) + "...");

  // Force reload to apply changes
  window.location.reload();
};

console.log("🔧 Quick auth function loaded. Run: setupQuickAuth()");
