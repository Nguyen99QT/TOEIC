# Authentication Debug Guide

## Vấn đề: Lesson Exercises bị redirect sang login

### Các bước debug:

1. **Kiểm tra Authentication State**

   - Mở DevTools Console
   - Chạy `testAuth()` để kiểm tra tokens
   - Xem AuthDebug component ở góc phải màn hình

2. **Kiểm tra localStorage**

   ```javascript
   // Check tokens
   localStorage.getItem("toeic_access_token");
   localStorage.getItem("toeic_refresh_token");
   localStorage.getItem("toeic_user");
   ```

3. **Kiểm tra API requests**

   - Mở Network tab
   - Xem có request nào bị 401 không
   - Kiểm tra Authorization headers

4. **Kiểm tra AuthContext**
   - Xem `isAuthenticated` có true không
   - Xem `loading` có false không
   - Xem `currentUser` có data không

### Các nguyên nhân thường gặp:

1. **Token hết hạn**

   - Solution: Refresh token hoặc login lại

2. **AuthContext chưa khởi tạo**

   - Solution: Đảm bảo AuthProvider wrap component

3. **API endpoint trả về 401**

   - Solution: Kiểm tra backend authentication

4. **Race condition trong auth check**
   - Solution: Đợi auth loading complete

### Cách fix:

1. **Temporary fix - Bỏ auth check**

   ```typescript
   // Comment out auth check trong ExercisesPage
   // useEffect(() => {
   //   if (!authLoading && !isAuthenticated) {
   //     navigate('/login');
   //   }
   // }, [authLoading, isAuthenticated]);
   ```

2. **Proper fix - Kiểm tra auth state**

   ```typescript
   useEffect(() => {
     console.log("Auth state:", { authLoading, isAuthenticated, currentUser });

     // Only redirect if definitely not authenticated
     if (!authLoading && !isAuthenticated && !currentUser) {
       navigate("/login");
     }
   }, [authLoading, isAuthenticated, currentUser]);
   ```

3. **Debug với timeout**
   ```typescript
   useEffect(() => {
     const timer = setTimeout(() => {
       if (!isAuthenticated) {
         console.log("Auth timeout, redirecting...");
         navigate("/login");
       }
     }, 5000); // Wait 5 seconds

     return () => clearTimeout(timer);
   }, []);
   ```

### Testing Commands:

```bash
# Start frontend with debug
npm run dev

# Check console for auth logs
# Look for:
# - "🔍 Auth check"
# - "❌ User not authenticated"
# - "⏳ Auth still loading"
```

### Expected behavior:

- User should be able to access exercises without login redirect
- AuthDebug should show user info when authenticated
- API calls should include Bearer token
- No 401 errors in Network tab
