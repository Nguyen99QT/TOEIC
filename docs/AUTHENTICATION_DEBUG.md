# Authentication Debug Guide

## Vấn đề: Lesson exercises bị redirect sang login

### 1. Kiểm tra authentication status

Mở browser console và chạy:

```javascript
// Check authentication status
const authStatus = {
  token:
    localStorage.getItem("toeic_access_token") ||
    localStorage.getItem("authToken"),
  user:
    localStorage.getItem("toeic_current_user") ||
    localStorage.getItem("currentUser"),
  allKeys: Object.keys(localStorage),
};

console.log("🔍 Auth Status:", authStatus);
```

### 2. Kiểm tra token validity

```javascript
// Check if token is valid
const token = localStorage.getItem("toeic_access_token");
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp && payload.exp < currentTime;

    console.log("🔍 Token Info:", {
      expired: isExpired,
      expiresAt: new Date(payload.exp * 1000),
      username: payload.sub || payload.username,
      roles: payload.roles || payload.authorities,
    });
  } catch (e) {
    console.error("❌ Invalid token format:", e);
  }
} else {
  console.log("❌ No token found");
}
```

### 3. Test API call

```javascript
// Test API call với current token
fetch("/api/lessons/1/exercises", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("toeic_access_token")}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    console.log("🔍 API Response:", response.status, response.statusText);
    return response.json();
  })
  .then((data) => console.log("✅ API Data:", data))
  .catch((error) => console.error("❌ API Error:", error));
```

### 4. Solutions

#### Solution 1: Clear and re-login

```javascript
// Clear all auth data
localStorage.removeItem("toeic_access_token");
localStorage.removeItem("toeic_refresh_token");
localStorage.removeItem("toeic_current_user");
localStorage.removeItem("authToken");
localStorage.removeItem("currentUser");

// Redirect to login
window.location.href = "/login";
```

#### Solution 2: Manual token refresh

```javascript
// Try to refresh token
const refreshToken = localStorage.getItem("toeic_refresh_token");
if (refreshToken) {
  fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.accessToken) {
        localStorage.setItem("toeic_access_token", data.accessToken);
        console.log("✅ Token refreshed successfully");
      }
    })
    .catch((error) => console.error("❌ Token refresh failed:", error));
}
```

### 5. Backend checks

Kiểm tra backend logs để xem:

- User có được authenticated không
- Token có valid không
- Endpoint có được gọi không

### 6. Common issues

1. **Token expired**: Token hết hạn, cần refresh hoặc login lại
2. **Invalid token**: Token bị corrupt hoặc format sai
3. **Missing token**: Token bị mất trong localStorage
4. **CORS issues**: Backend không accept request từ frontend
5. **Backend down**: Server không response

### 7. Step-by-step debugging

1. **Check auth context**:

   ```javascript
   // In React DevTools, check AuthContext values
   // isAuthenticated should be true
   // currentUser should have user data
   ```

2. **Check network tab**: Xem API calls có được gửi không, status code là gì

3. **Check backend logs**: Xem server có nhận request không

4. **Check route protection**: Xem route có được protect đúng không

### 8. Current implementation fixes

Files đã được cập nhật:

- `ExercisesPage.tsx`: Thêm authentication check
- `ExerciseQuestionsPage.tsx`: Thêm authentication check
- `exerciseProgress.ts`: User-specific completion tracking
- `useExerciseCompletion.ts`: Custom hook for completion management

### 9. Testing steps

1. Login với user account
2. Navigate to `/lessons/1/exercises`
3. Check console logs
4. Verify không bị redirect to login
5. Verify exercises load correctly
6. Test completion tracking

### 10. Emergency fixes

Nếu vẫn bị redirect, thêm vào component:

```typescript
// Temporary debug in component
useEffect(() => {
  console.log("🔍 Auth Debug:", {
    isAuthenticated,
    currentUser,
    authLoading,
    token: localStorage.getItem("toeic_access_token")?.substring(0, 10) + "...",
  });
}, [isAuthenticated, currentUser, authLoading]);
```
