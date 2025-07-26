import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Get current user ID for header
 */
const getCurrentUserId = (): number | null => {
  console.log("🔍 [apiClient] Getting current user ID...");
  
  // Try multiple possible keys for user data
  const keys = ["toeic_current_user", "currentUser", "user"];
  
  for (const key of keys) {
    const userData = localStorage.getItem(key);
    console.log(`   📋 [apiClient] Checking key '${key}': ${userData ? "✓ Found data" : "✗ No data"}`);
    
    if (!userData) continue;

    try {
      const user = JSON.parse(userData);
      console.log(`   📝 [apiClient] Parsed user data for '${key}':`, { id: user?.id, username: user?.username });
      
      if (user && user.id) {
        console.log(`✅ [apiClient] Found user ID: ${user.id} from key '${key}'`);
        return user.id;
      }
    } catch (error) {
      console.warn(`   ⚠️ [apiClient] Failed to parse user data from key '${key}':`, error);
      continue;
    }
  }

  console.warn("❌ [apiClient] Could not find user ID in any localStorage key");
  return null;
};

// Đảm bảo interceptor chỉ khai báo 1 lần ở đây
apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("toeic_access_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // Add Current-User-Id header for backend compatibility
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      config.headers["Current-User-Id"] = currentUserId.toString();
      console.log("🔑 [apiClient.ts] Added Current-User-Id header:", currentUserId);
    } else {
      console.warn("⚠️ [apiClient.ts] No current user ID found for Current-User-Id header");
    }
  }
  return config;
});

export default apiClient;
