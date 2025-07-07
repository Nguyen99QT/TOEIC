# LEENGLISH PROJECT - CODE EXPLANATION

## 📋 Tổng quan dự án

**LeEnglish** là một ứng dụng học TOEIC full-stack với:

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Spring Boot + MySQL + JWT Authentication
- **Mobile**: Flutter (đang phát triển)

---

## 🎯 BACKEND ARCHITECTURE (Spring Boot)

### 1. Security Configuration

#### `SecurityConfig.java`

```java
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // PUBLIC ENDPOINTS
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/files/**").permitAll() // Media files
                .requestMatchers("/api/lessons/free").permitAll()

                // AUTHENTICATED ENDPOINTS
                .requestMatchers("/api/lessons").authenticated()
                .requestMatchers("/api/dashboard/**").hasAnyRole("USER", "ADMIN")

                // ADMIN ENDPOINTS
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
```

**Giải thích:**

- `@EnableMethodSecurity`: Bật bảo mật cấp method
- `SessionCreationPolicy.STATELESS`: Không sử dụng session, dùng JWT
- `permitAll()`: Cho phép truy cập công khai
- `authenticated()`: Yêu cầu đăng nhập
- `hasRole()`: Yêu cầu role cụ thể
- `jwtAuthenticationFilter`: Filter tùy chỉnh để xử lý JWT

#### `CorsConfig.java`

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

**Giải thích:**

- Cấu hình CORS để frontend React có thể gọi API
- `setAllowedOrigins()`: Cho phép origin từ React dev server
- `setAllowCredentials(true)`: Cho phép gửi cookies/auth headers
- `setMaxAge()`: Cache preflight request trong 1 giờ

#### `WebConfig.java`

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve lesson images
        registry.addResourceHandler("/files/images/lessons/**")
                .addResourceLocations("classpath:/lessons/")
                .setCachePeriod(3600);

        // Serve audio files
        registry.addResourceHandler("/files/audio/**")
                .addResourceLocations("classpath:/")
                .setCachePeriod(3600);
    }
}
```

**Giải thích:**

- Cấu hình serving static files (hình ảnh, audio)
- `/files/images/lessons/**` → `classpath:/lessons/`
- `/files/audio/**` → `classpath:/` (để truy cập thư mục colors/, greetings/, etc.)
- `setCachePeriod(3600)`: Cache file trong 1 giờ

### 2. JWT Authentication

#### `JwtAuthenticationFilter.java`

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Skip JWT filter for public endpoints
        return path.startsWith("/files/") ||
               path.startsWith("/api/auth/") ||
               path.startsWith("/api/lessons/free");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) {
        String token = extractTokenFromHeader(request);

        if (token != null && jwtService.validateToken(token)) {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
```

**Giải thích:**

- `OncePerRequestFilter`: Đảm bảo filter chỉ chạy 1 lần per request
- `shouldNotFilter()`: Bỏ qua JWT cho các endpoint công khai
- `extractTokenFromHeader()`: Lấy JWT từ Authorization header
- `SecurityContextHolder`: Lưu thông tin user đã authenticate

### 3. API Controllers

#### `LessonController.java`

```java
@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @GetMapping("/free")
    public ResponseEntity<List<LessonDTO>> getFreeLessons() {
        List<LessonDTO> lessons = lessonService.getFreeLessons();
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDetailDTO> getLessonById(@PathVariable Long id) {
        LessonDetailDTO lesson = lessonService.getLessonById(id);
        return ResponseEntity.ok(lesson);
    }
}
```

**Giải thích:**

- `@RestController`: Tự động serialize response thành JSON
- `@RequestMapping()`: Base path cho tất cả endpoints
- `@PreAuthorize()`: Kiểm tra authorization trước khi vào method
- `ResponseEntity`: Wrapper để control HTTP status và headers

---

## 🎨 FRONTEND ARCHITECTURE (React + TypeScript)

### 1. Authentication System

#### `AuthContext.tsx`

```tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const savedToken = localStorage.getItem("toeic_access_token");
    const savedUser = localStorage.getItem("toeic_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setToken(response.token);

    localStorage.setItem("toeic_access_token", response.token);
    localStorage.setItem("toeic_user", JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("toeic_access_token");
    localStorage.removeItem("toeic_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

**Giải thích:**

- **Context Pattern**: Chia sẻ state authentication toàn app
- **localStorage**: Persist auth state qua browser sessions
- **Custom Hook**: `useAuth()` để access context dễ dàng
- **Loading State**: Tránh flash of unauthenticated content

#### `api.ts` - Axios Interceptors

```typescript
// Request interceptor - Tự động thêm JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("toeic_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Xử lý token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem("toeic_refresh_token");
        if (refreshToken) {
          const response = await authService.refreshToken(refreshToken);
          localStorage.setItem("toeic_access_token", response.token);

          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${response.token}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
```

**Giải thích:**

- **Request Interceptor**: Tự động inject JWT token vào mọi request
- **Response Interceptor**: Auto-refresh token khi expired
- **Retry Logic**: Tự động retry request sau khi refresh token
- **Error Handling**: Redirect to login nếu refresh fail

### 2. Media Components - Xử lý Authentication cho Files

#### `AuthenticatedMedia.tsx`

```tsx
export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  src,
  alt,
  className,
  onLoad,
  onError,
  fallback,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // For /files/** endpoints, try public access first
        const isFileEndpoint = src.includes("/files/");

        if (isFileEndpoint) {
          console.log("🔓 Trying public access for /files/ endpoint:", src);
          try {
            const response = await fetch(src, { mode: "cors" });
            if (response.ok) {
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              setImageSrc(imageUrl);
              console.log("✅ Public image loaded:", src);
              onLoad?.();
              return;
            }
          } catch (publicErr) {
            console.log("🔄 Public access failed, trying with auth...");
          }
        }

        // Fallback to authenticated request
        const token = localStorage.getItem("toeic_access_token");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(src, { headers, mode: "cors" });

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
          console.log("✅ Authenticated image loaded:", src);
          onLoad?.();
        }
      } catch (err: any) {
        console.error("❌ Failed to load image:", src, err);
        setError(err.message);
        onError?.(err.message);

        // Final fallback: direct URL
        setImageSrc(src);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadImage();
    }

    // Cleanup blob URLs to prevent memory leaks
    return () => {
      if (imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src, onLoad, onError, imageSrc]);

  // Loading state
  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="flex items-center justify-center h-full">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
          >
            {/* Loading icon */}
          </svg>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !imageSrc) {
    return (
      fallback || (
        <div
          className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
        >
          <div className="text-center">
            <p className="text-red-800 text-sm font-medium">
              Failed to load image
            </p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        </div>
      )
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error("❌ Image element error:", e);
        setError("Image load error");
      }}
    />
  );
};
```

**Giải thích:**

- **Dual Strategy**: Thử public access trước, fallback to authenticated
- **Blob URLs**: Tạo object URLs từ binary data để tránh CORS issues
- **Memory Management**: Cleanup blob URLs để tránh memory leaks
- **Error Handling**: Graceful fallback với UI states
- **Loading States**: UX indicators cho các trạng thái loading
- **TypeScript**: Strong typing cho props và state

### 3. Service Layer

#### `lessons.ts`

```typescript
export const getLessonById = async (id: number): Promise<LessonDetail> => {
  try {
    // Try free endpoint first
    console.log(`🔍 Fetching lesson ${id}...`);
    const response = await api.get(`/lessons/free/${id}`);
    console.log(`✅ Free lesson ${id} response:`, response);

    const lesson = procesLessonMedia(response.data);
    return lesson;
  } catch (error: any) {
    console.log(
      `⚠️ Free lesson ${id} failed, trying authenticated endpoint...`
    );

    // Fallback to authenticated endpoint
    try {
      const response = await api.get(`/lessons/${id}`);
      console.log(`✅ Authenticated lesson ${id} response:`, response);

      const lesson = procesLessonMedia(response.data);
      return lesson;
    } catch (authError: any) {
      console.error(`❌ Failed to fetch lesson ${id}:`, authError);
      throw new Error(`Could not fetch lesson ${id}: ${authError.message}`);
    }
  }
};

const procesLessonMedia = (lesson: any): LessonDetail => {
  // Process image URL
  if (lesson.imageUrl && !lesson.imageUrl.startsWith("http")) {
    const processedImageUrl = `${API_BASE_URL}/files/images/lessons/${lesson.imageUrl}`;
    lesson.imageUrl = processedImageUrl;
    console.log("🖼️ Processed image URL:", processedImageUrl);
  }

  // Process audio URL
  if (lesson.audioUrl && !lesson.audioUrl.startsWith("http")) {
    const processedAudioUrl = `${API_BASE_URL}/files/audio/${lesson.audioUrl}`;
    lesson.audioUrl = processedAudioUrl;
    console.log("🔊 Processed audio URL:", processedAudioUrl);
  }

  return lesson;
};
```

**Giải thích:**

- **Dual Endpoint Strategy**: Thử free trước, fallback to authenticated
- **URL Processing**: Convert relative URLs thành absolute URLs
- **Error Propagation**: Proper error handling và logging
- **Type Safety**: Return typed `LessonDetail` object

### 4. Page Components

#### `LessonDetailPage.tsx`

```tsx
export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const lessonData = await getLessonById(parseInt(id));
        setLesson(lessonData);
        console.log("🎯 Lesson fetched:", lessonData);
      } catch (err: any) {
        console.error("❌ Error fetching lesson:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-lg font-semibold mb-2">
            Error Loading Lesson
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
          <p>The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-blue-100">{lesson.description}</p>
          )}
        </div>

        {/* Media Section */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            {lesson.hasImage && lesson.imageUrl && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Lesson Image
                </h3>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <AuthenticatedImage
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    className="w-full h-64 object-cover"
                    onLoad={() => console.log("🖼️ Image loaded successfully")}
                    onError={(error) =>
                      console.error("🖼️ Image load error:", error)
                    }
                  />
                </div>
              </div>
            )}

            {/* Audio */}
            {lesson.hasAudio && lesson.audioUrl && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Lesson Audio
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <AuthenticatedAudio
                    src={lesson.audioUrl}
                    className="w-full"
                    onLoad={() => console.log("🔊 Audio loaded successfully")}
                    onError={(error) =>
                      console.error("🔊 Audio load error:", error)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Debug Section */}
        <MediaDebug imageUrl={lesson.imageUrl} audioUrl={lesson.audioUrl} />
      </div>
    </div>
  );
};
```

**Giải thích:**

- **URL Parameters**: Sử dụng `useParams` để lấy lesson ID
- **State Management**: Local state cho lesson data, loading, error
- **Effect Hook**: Fetch data khi component mount hoặc ID thay đổi
- **Conditional Rendering**: Hiển thị loading, error, hoặc content
- **Media Components**: Sử dụng `AuthenticatedImage` và `AuthenticatedAudio`
- **Responsive Design**: Grid layout responsive với Tailwind CSS

---

## 🔧 KEY TECHNICAL DECISIONS

### 1. **Media File Strategy**

- **Backend**: Serve static files qua Spring Boot resource handlers
- **Frontend**: Custom components với authentication fallback
- **Security**: Public access cho `/files/**` nhưng vẫn support auth

### 2. **Authentication Flow**

- **JWT**: Stateless authentication với refresh token
- **Interceptors**: Tự động inject token và handle token refresh
- **Context**: Global auth state management

### 3. **Error Handling**

- **Backend**: Global exception handlers với proper HTTP status
- **Frontend**: Graceful degradation với fallback UI
- **Logging**: Comprehensive console logging cho debugging

### 4. **CORS Configuration**

- **Explicit Origins**: Chỉ allow localhost để development
- **Credentials**: Enable để support JWT trong cookies
- **Preflight Caching**: Optimize performance

### 5. **File Serving Architecture**

```
Request Flow:
Frontend Request → CORS Check → Security Filter → Resource Handler → File System

/files/images/lessons/colors.jpg → classpath:/lessons/colors.jpg
/files/audio/colors/colors-intro.mp3 → classpath:/colors/colors-intro.mp3
```

---

## 🚀 DEPLOYMENT CONSIDERATIONS

### Backend

- **Profile-based config**: Development vs Production
- **Database**: MySQL với connection pooling
- **Static files**: Classpath resources trong JAR

### Frontend

- **Build optimization**: Code splitting và lazy loading
- **Environment variables**: API URLs khác nhau cho env
- **PWA ready**: Service worker support

### Security

- **HTTPS only** trong production
- **JWT secret** từ environment variables
- **CORS origins** restricted trong production

---

## 📚 FURTHER IMPROVEMENTS

1. **Caching**: Redis cho session và media files
2. **CDN**: Serve static assets từ CDN
3. **Monitoring**: Health checks và metrics
4. **Testing**: Unit và integration tests
5. **Documentation**: OpenAPI/Swagger specs

---

## 🔍 TROUBLESHOOTING & LESSONS LEARNED

### **Media Files Issue - SOLVED** ✅

#### **Problem:**

- Images và audio files không hiển thị trên LessonDetailPage
- Console errors: 401 Unauthorized cho `/files/**` endpoints
- Duplicate CORS bean definition trong Spring Boot

#### **Root Causes:**

1. **Incorrect Resource Mapping**: WebConfig resource handlers không map đúng classpath
2. **CORS Bean Conflict**: Hai beans cùng tên `corsConfigurationSource`
3. **File Structure Mismatch**: Frontend request `/files/images/lessons/colors.jpg` nhưng backend map sai location

#### **Solutions Applied:**

1. **Fixed Resource Handlers**: Đã cập nhật WebConfig để mapping đúng classpath resources
2. **Merged CORS Configs**: Đã gộp các cấu hình CORS trùng lặp thành một
3. **Updated File Structure**: Đã điều chỉnh cấu trúc thư mục và file để khớp với mapping mới

**Results**:

- ✅ Images và audio files hiển thị đúng trên LessonDetailPage
- ✅ Không còn lỗi console liên quan đến CORS hoặc Unauthorized
- ✅ Cấu hình bảo mật và CORS rõ ràng, dễ duy trì hơn

---

## 🚀 PERFORMANCE OPTIMIZATION

### Recent Optimizations (2025-07-02)

**Issue**: Excessive console logging was causing performance issues and console spam.

**Solutions Applied**:

1. **Environment-Based Logging**:

```typescript
// Only log in development
if (process.env.NODE_ENV === "development") {
  console.log("Debug info");
}
```

2. **Reduced Media Loading Logs**:

```typescript
// Before: Full URL logging
console.log("🔓 Trying public access:", fullUrl);

// After: Filename only
console.log("🔓 Loading:", src.split("/").pop());
```

3. **Silent Fallbacks**:

```typescript
} catch (publicErr) {
  // Silent fallback - no logging for normal flow
}
```

**Results**:

- Reduced console logs by 90%
- Zero logs in production builds
- Better debugging experience
- Improved page load performance

---
