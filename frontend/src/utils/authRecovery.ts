/**
 * ================================================================
 * AUTH RECOVERY UTILITY
 * ================================================================
 * Utility to help recover from authentication issues
 */

import {
  getCurrentUser,
  getToken,
  isAuthenticated,
  removeToken,
} from "../services/auth";

export const diagnoseAuthIssues = (): {
  issue: string;
  solution: string;
  canAutoFix: boolean;
  severity: "low" | "medium" | "high";
} => {
  const token = getToken();
  const user = getCurrentUser();
  const authStatus = isAuthenticated();

  console.group("🔍 AUTH DIAGNOSIS");
  console.log("Token exists:", !!token);
  console.log("User exists:", !!user);
  console.log("Auth status:", authStatus);

  if (!token && !user) {
    console.groupEnd();
    return {
      issue: "No authentication data found",
      solution: "User needs to log in",
      canAutoFix: false,
      severity: "high",
    };
  }

  if (token && user && !authStatus) {
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      const expired = payload.exp < now;

      console.log("Token expired:", expired);
      console.log("Time remaining:", payload.exp - now, "seconds");

      if (expired) {
        console.groupEnd();
        return {
          issue: "Authentication token has expired",
          solution: "Clear expired tokens and require fresh login",
          canAutoFix: true,
          severity: "high",
        };
      }
    } catch (e) {
      console.error("Failed to parse token:", e);
      console.groupEnd();
      return {
        issue: "Invalid token format",
        solution: "Clear invalid tokens and require fresh login",
        canAutoFix: true,
        severity: "high",
      };
    }
  }

  if (token && !user) {
    console.groupEnd();
    return {
      issue: "Token exists but user data missing",
      solution: "Clear partial auth data and require fresh login",
      canAutoFix: true,
      severity: "medium",
    };
  }

  if (!token && user) {
    console.groupEnd();
    return {
      issue: "User data exists but token missing",
      solution: "Clear partial auth data and require fresh login",
      canAutoFix: true,
      severity: "medium",
    };
  }

  console.groupEnd();
  return {
    issue: "Authentication appears valid",
    solution: "No action needed",
    canAutoFix: false,
    severity: "low",
  };
};

export const autoFixAuthIssues = (): boolean => {
  const diagnosis = diagnoseAuthIssues();

  if (!diagnosis.canAutoFix) {
    console.log("❌ Cannot auto-fix:", diagnosis.issue);
    return false;
  }

  console.log("🔧 Auto-fixing auth issue:", diagnosis.issue);

  // Clear all potentially corrupted auth data
  removeToken();

  console.log("✅ Auth data cleared, user needs to re-login");
  return true;
};

export const showAuthErrorToUser = (message: string) => {
  // Create a user-friendly notification
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  `;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 18px;">⚠️</span>
      <div>
        <div style="font-weight: 600; margin-bottom: 4px;">Session Expired</div>
        <div style="font-size: 14px; opacity: 0.9;">${message}</div>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
};
