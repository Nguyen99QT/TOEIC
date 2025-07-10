# TOEIC Platform Authentication System - Bug Fixes & Explanation

## Tóm tắt vấn đề

Hệ thống xác thực (Authentication) của TOEIC Platform đã gặp một số vấn đề:

1. Frontend không thể lưu trữ và truy xuất token đăng nhập
2. Đường dẫn (endpoints) cho login trong frontend và backend không khớp nhau
3. Debug logging không đủ chi tiết để xác định vấn đề
4. Health check endpoint không được sử dụng đúng cách

## Giải pháp đã thực hiện

### 1. Sửa đường dẫn API trong frontend để khớp với backend

Backend đang có endpoint là `/api/auth/login`, nhưng frontend đang gọi tới `/auth/login`:

```typescript
// ❌ Trước: Sai endpoint
const response = await api.post("/auth/login", credentials);

// ✅ Sau: Endpoint đúng khớp với backend
const response = await api.post("/api/auth/login", credentials);
```

Tương tự cho các endpoint khác như refresh và logout.

### 2. Cải thiện lưu trữ và truy xuất token

Đã thêm nhiều log chi tiết và kiểm tra tính hợp lệ của token:

```typescript
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
```

### 3. Cải thiện hàm kiểm tra xác thực

Đã thêm kiểm tra JWT format và thông báo chi tiết:

```typescript
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
    // Log token format for debugging
    console.log(
      `Token parse failed, but token exists. Token starts with: ${token.substring(
        0,
        15
      )}...`
    );
    return !!(token && user);
  }
};
```

### 4. Cải thiện login function để kiểm tra server health và xử lý lỗi

Thêm kiểm tra health check trước khi login và xử lý lỗi chi tiết:

```typescript
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
    const response = await api.post("/api/auth/login", credentials);

    // ... phần còn lại của function
```

### 5. Cải thiện việc lưu trữ dữ liệu sau đăng nhập thành công

Kiểm tra xác nhận token và user data đã lưu trữ thành công:

```typescript
// Store tokens and user data with explicit success checks
try {
  setToken(accessToken);
  console.log("✅ Token stored successfully");

  if (refreshToken) {
    setRefreshToken(refreshToken);
    console.log("✅ Refresh token stored successfully");
  }

  setCurrentUser(user);
  console.log("✅ User data stored successfully:", user.username || user.email);

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
```

### 6. Thêm debug logging trong AuthContext

Thêm hàm debug để hiển thị đầy đủ thông tin về localStorage và trạng thái authentication:

```typescript
// Thêm hàm này vào AuthProvider để debug
const debugAuthState = () => {
  console.group("🔍 Auth Debug Info");
  // Kiểm tra tất cả các key có thể chứa token
  console.log(
    "toeic_access_token:",
    localStorage.getItem("toeic_access_token") ? "✅ Exists" : "❌ Missing"
  );
  console.log(
    "authToken:",
    localStorage.getItem("authToken") ? "✅ Exists" : "❌ Missing"
  );

  // Kiểm tra tất cả các key có thể chứa user data
  console.log(
    "toeic_current_user:",
    localStorage.getItem("toeic_current_user") ? "✅ Exists" : "❌ Missing"
  );
  console.log(
    "currentUser:",
    localStorage.getItem("currentUser") ? "✅ Exists" : "❌ Missing"
  );

  // Kiểm tra trạng thái auth trong React component
  console.log("isAuthenticated state:", isAuthenticated);
  console.log("currentUser state:", currentUser ? "✅ Exists" : "❌ Missing");
  console.groupEnd();
};
```

### 7. Cải thiện hàm login trong AuthContext

Thêm xử lý lỗi chi tiết và không yêu cầu email:

```typescript
const login = async (
  usernameOrEmail: string,
  password: string
): Promise<void> => {
  try {
    console.log("🔑 AuthContext: Attempting login for:", usernameOrEmail);

    // Thêm kiểm tra tính hợp lệ của thông tin đăng nhập
    if (!usernameOrEmail || !password) {
      throw new Error("Tên đăng nhập và mật khẩu không được để trống");
    }

    // Log chi tiết hơn để debug
    console.log(
      `🔍 Login attempt with: ${
        usernameOrEmail.length > 3
          ? usernameOrEmail.substring(0, 3) + "..."
          : usernameOrEmail
      } / ${password ? "********" : "empty"}`
    );

    // ✅ Import the login function from auth service
    const { login: authLogin } = await import("../services/auth");

    // Thêm logic để kiểm tra xem đang nhập email hay username
    const isEmail = usernameOrEmail.includes("@");

    // ✅ Call with proper LoginRequest format, gửi đúng kiểu thông tin
    const response = await authLogin({
      username: usernameOrEmail,
      // Không truyền email nữa
      password: password,
    });

    if (response && response.user && response.accessToken) {
      console.log("✅ Login successful, storing auth data...");
      // Don't need to duplicate storage since login function already handles it
      // Just update the local state
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      startAutoRefresh();
      console.log("✅ AuthContext: Login completed successfully");
    } else {
      throw new Error("Invalid login response - missing user or accessToken");
    }
  } catch (error: any) {
    console.error("❌ AuthContext login error:", error);

    // Cải thiện thông báo lỗi cụ thể về vấn đề mật khẩu
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Sai tên đăng nhập hoặc mật khẩu");
      } else if (
        error.response.data?.message?.toLowerCase().includes("password")
      ) {
        throw new Error(
          "Mật khẩu không hợp lệ: " + error.response.data.message
        );
      }
    }

    throw error; // Re-throw so components can handle the error
  }
};
```

## Giải thích về Health Check

Health check trong ứng dụng có các ý nghĩa quan trọng sau:

### 1. Vai trò của Health Check

Health check trong ứng dụng có những mục đích sau:

- **Kiểm tra server còn sống không**: Xác định server còn hoạt động trước khi thực hiện các thao tác quan trọng như đăng nhập
- **Endpoint không cần xác thực**: Là một trong số ít các endpoint không yêu cầu token xác thực
- **Theo dõi hệ thống**: Cung cấp thông tin chi tiết về trạng thái hệ thống (endpoint `/api/health/details`)

### 2. Triển khai Health Check

**Frontend**:

```typescript
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
```

**Backend**:

```java
@GetMapping("/health")
public ResponseEntity<Map<String, Object>> healthCheck() {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "UP");
    response.put("timestamp", LocalDateTime.now().toString());
    response.put("service", "TOEIC Platform API");

    return ResponseEntity.ok(response);
}
```

## Vấn đề còn tồn đọng và hướng giải quyết

### ✅ ĐÃ GIẢI QUYẾT:

1. **Lỗi MySQL Connection Timeout**:

   - ✅ Tạo DatabaseConfig với failsafe connection
   - ✅ Cập nhật application.properties với timeout tối ưu
   - ✅ Health check không phụ thuộc vào database connection
   - ✅ Script tự động khởi động và kiểm tra MySQL

2. **Lỗi CORS Policy**:

   - ✅ Cập nhật CorsConfig với @CrossOrigin annotations
   - ✅ Thêm WebMvcConfigurer cho CORS mapping
   - ✅ Expose required headers cho authentication

3. **Health Check Endpoint**:
   - ✅ Always return 200 OK ngay cả khi database down
   - ✅ Detailed database status reporting
   - ✅ Memory và application info

### 🔧 CÔNG CỤ MỚI:

1. **start-backend.bat**: Script tự động khởi động với MySQL check
2. **health-check.bat**: Kiểm tra nhanh tất cả services
3. **DatabaseConfig.java**: Configuration linh hoạt cho database
4. **Enhanced application.properties**: Cấu hình tối ưu cho production

### 🚀 HƯỚNG DẪN SỬ DỤNG:

1. **Khởi động tự động**:

   ```bash
   # Chạy script tự động
   start-backend.bat
   ```

2. **Kiểm tra health**:

   ```bash
   # Kiểm tra nhanh tất cả services
   health-check.bat
   ```

3. **Khởi động manual**:

   ```bash
   # Khởi động MySQL trước
   net start mysql80

   # Sau đó khởi động Spring Boot
   cd backend
   mvn spring-boot:run
   ```

## Kết luận - Phiên bản cập nhật

Các vấn đề chính về xác thực đã được giải quyết hoàn toàn:

1. **✅ Đồng bộ endpoints**: Frontend và backend đã có cùng endpoint format (`/api/auth/login`)
2. **✅ Cải thiện token handling**: Kiểm tra format JWT, expiry, và lưu trữ token
3. **✅ Debug logging**: Đã thêm nhiều log chi tiết để dễ dàng phát hiện vấn đề
4. **✅ Health check**: Triển khai đúng cách để kiểm tra server status trước khi đăng nhập
5. **✅ Database resilience**: Ứng dụng khởi động được ngay cả khi MySQL chưa sẵn sàng
6. **✅ CORS handling**: Xử lý đầy đủ CORS cho frontend communication
7. **✅ Automated tools**: Scripts tự động giúp khởi động và kiểm tra hệ thống

### 🎯 Lưu ý quan trọng:

- Ứng dụng sẽ khởi động thành công ngay cả khi MySQL chưa chạy
- Health endpoint sẽ báo cáo trạng thái database nhưng vẫn trả về 200 OK
- CORS đã được cấu hình để hỗ trợ development từ localhost:3000
- Authentication sẽ hoạt động bình thường sau khi MySQL được khởi động
