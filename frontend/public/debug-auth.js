/**
 * DEBUG SCRIPT - Chạy trong browser console để kiểm tra auth status
 * Copy đoạn code này và paste vào browser console để debug
 */

console.group("🔍 TOEIC AUTH DEBUG ANALYSIS");

// 1. Kiểm tra localStorage
console.log("=== LOCALSTORAGE ANALYSIS ===");
const allKeys = Object.keys(localStorage);
console.log("All localStorage keys:", allKeys);

const tokenKeys = ["toeic_access_token", "authToken", "accessToken"];
const userKeys = ["toeic_current_user", "currentUser"];

tokenKeys.forEach((key) => {
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value ? `EXISTS (${value.length} chars)` : "MISSING");
});

userKeys.forEach((key) => {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      const parsed = JSON.parse(value);
      console.log(`${key}:`, parsed);
    } catch (e) {
      console.log(`${key}:`, "INVALID JSON");
    }
  } else {
    console.log(`${key}:`, "MISSING");
  }
});

// 2. Kiểm tra token validity
const token =
  localStorage.getItem("toeic_access_token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("accessToken");

if (token) {
  console.log("=== TOKEN ANALYSIS ===");
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      console.log("Token payload:", payload);
      console.log("Current time:", now);
      console.log("Token exp:", payload.exp);
      console.log("Is expired:", payload.exp < now);
      console.log("Time remaining:", payload.exp - now, "seconds");
    } else {
      console.log("❌ Invalid JWT format");
    }
  } catch (e) {
    console.log("❌ Failed to parse token:", e);
  }
} else {
  console.log("❌ No token found");
}

// 3. Test API call
console.log("=== API TEST ===");
fetch("/api/auth/validate-token", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    console.log("Validate token response status:", response.status);
    return response.json();
  })
  .then((data) => {
    console.log("Validate token response:", data);
  })
  .catch((error) => {
    console.error("Validate token error:", error);
  });

// 4. Manual login test
const testLogin = () => {
  console.log("=== MANUAL LOGIN TEST ===");
  const username = prompt("Enter username:");
  const password = prompt("Enter password:");

  if (username && password) {
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        console.log("Login response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Login response:", data);
        if (data.accessToken || data.token) {
          localStorage.setItem(
            "toeic_access_token",
            data.accessToken || data.token
          );
          localStorage.setItem(
            "toeic_current_user",
            JSON.stringify(data.user || data)
          );
          console.log("✅ Login successful, tokens stored");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }
};

console.log("Run testLogin() to test manual login");
window.testLogin = testLogin;

console.groupEnd();
