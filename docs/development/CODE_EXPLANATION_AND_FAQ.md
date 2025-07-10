# 📚 LeEnglish TOEIC Platform - Giải Thích Code & FAQ Giáo Viên

## 📋 Tổng Quan Dự Án

**LeEnglish** là một nền tảng học TOEIC đa nền tảng bao gồm:

- **Backend**: Spring Boot (Java) - API Server
- **Frontend**: Next.js (React/TypeScript) - Web Application
- **Mobile**: Flutter (Dart) - Cross-platform Mobile App

---

## 🏗️ Chi Tiết Kiến Trúc & Giải Thích Code

### 1. 🚀 Backend (Spring Boot)

#### 📁 Cấu trúc thư mục:

```
backend/
├── src/main/java/com/           # Mã nguồn chính
├── src/main/resources/
│   ├── audio/
│   │   ├── lesson/              # Audio cho lesson
│   │   ├── exercise/            # Audio cho exercise
│   │   ├── flashcard/           # Audio cho flashcard
│   │   └── question/            # Audio cho question
│   └── images/
│       ├── lesson/              # Ảnh cho lesson
│       ├── exercise/            # Ảnh cho exercise
│       ├── flashcard/           # Ảnh cho flashcard
│       └── question/            # Ảnh cho question
├── src/routes/                  # API Routes (TypeScript)
├── pom.xml                      # Maven dependencies
└── target/                      # File đã build
```

#### 🔧 Dependencies chính (pom.xml):

**Spring Boot Starter Web**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**Giải thích**: Cung cấp các tính năng cần thiết để tạo REST API, bao gồm Spring MVC, Tomcat server nhúng.

**Spring Boot Starter Data JPA**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

**Giải thích**: ORM (Object-Relational Mapping) giúp tương tác với database thông qua Java objects thay vì SQL trực tiếp.

**Spring Security**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Giải thích**: Bảo mật ứng dụng, xác thực và phân quyền người dùng.

#### 🛤️ API Routes (TypeScript):

**Authentication Routes** (`src/routes/auth.ts`):

```typescript
// Đăng nhập, đăng ký, refresh token
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refresh", authController.refresh);
```

**Questions Routes** (`src/routes/questions.ts`):

```typescript
// CRUD operations cho câu hỏi TOEIC
router.get("/questions", questionController.getAll);
router.post("/questions", questionController.create);
router.put("/questions/:id", questionController.update);
```

### 2. 🌐 Frontend (Next.js)

#### 📁 Cấu trúc thư mục:

```
frontend/
├── src/app/                     # App Router (Next.js 13+)
│   ├── globals.css             # Global CSS
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── login/page.tsx          # Login page
├── src/components/             # Reusable components
├── src/lib/                    # Utilities
└── src/types/                  # TypeScript definitions
```

#### 🎨 Styling & UI:

**Tailwind CSS** - Utility-first CSS framework:

```json
"tailwindcss": "^3.3.6"
```

**Giải thích**: Cho phép styling nhanh chóng với các class có sẵn như `bg-blue-500`, `text-center`, `p-4`.

**Headless UI**:

```json
"@headlessui/react": "^1.7.17"
```

**Giải thích**: Component library không có styling mặc định, dễ customization.

#### ⚛️ React Components:

**QuestionCard Component**:

```tsx
// Component hiển thị câu hỏi TOEIC
export default function QuestionCard({ question, onAnswer }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold">{question.text}</h3>
      {/* Render các lựa chọn */}
    </div>
  );
}
```

### 3. 📱 Mobile (Flutter)

#### 📁 Cấu trúc thư mục:

```
mobile/
├── lib/
│   ├── main.dart               # Entry point
│   ├── models/                 # Data models
│   ├── providers/              # State management
│   ├── screens/                # UI screens
│   └── services/               # API services
├── pubspec.yaml                # Dependencies
└── assets/                     # Images, audio files
```

#### 🔄 State Management (Riverpod):

```yaml
flutter_riverpod: ^2.4.9
```

**Giải thích**: Quản lý state hiện đại cho Flutter, type-safe và performance tốt.

#### 🌐 HTTP Client:

```yaml
http: ^1.1.2
```

**Giải thích**: Thực hiện các API calls đến backend.

---

## ❓ Câu Hỏi Thường Gặp Từ Giáo Viên & Trả Lời

### 🎯 **Q1: Tại sao chọn Spring Boot cho backend?**

**Trả lời:**

- **Productivity cao**: Auto-configuration, embedded server
- **Ecosystem mạnh**: Spring Security, Spring Data JPA
- **Enterprise-ready**: Scalable, maintainable
- **Documentation tốt**: Dễ học và debug
- **Community lớn**: Nhiều tutorial và support

### 🎯 **Q2: Next.js khác gì với React thuần?**

**Trả lời:**

- **Server-Side Rendering (SSR)**: Tốt cho SEO
- **File-based routing**: Không cần config router phức tạp
- **API Routes**: Có thể tạo API endpoints trong same project
- **Performance**: Image optimization, code splitting tự động
- **Production-ready**: Built-in optimization

### 🎯 **Q3: Tại sao dùng Flutter thay vì React Native?**

**Trả lời:**

- **Performance**: Compile thành native code
- **UI Consistency**: Same look trên iOS và Android
- **Single codebase**: Một code cho cả mobile và web
- **Hot reload**: Development nhanh
- **Google support**: Backing mạnh từ Google

### 🎯 **Q4: JWT là gì và tại sao dùng nó?**

**Trả lời:**

- **JSON Web Token**: Chuẩn mở cho secure information transmission
- **Stateless**: Server không cần lưu session
- **Scalable**: Dễ scale horizontal
- **Cross-domain**: Hoạt động tốt với SPA và mobile
- **Self-contained**: Chứa thông tin user trong token

### 🎯 **Q5: REST API design principles trong project này?**

**Trả lời:**

```
GET    /api/questions          # Lấy danh sách câu hỏi
POST   /api/questions          # Tạo câu hỏi mới
GET    /api/questions/{id}     # Lấy 1 câu hỏi
PUT    /api/questions/{id}     # Cập nhật câu hỏi
DELETE /api/questions/{id}     # Xóa câu hỏi
```

- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (OK), 201 (Created), 404 (Not Found), 401 (Unauthorized)
- **JSON Format**: Consistent response structure

### 🎯 **Q6: Database design cho ứng dụng TOEIC?**

**Trả lời:**

```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id BIGINT PRIMARY KEY,
    content TEXT,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_answer CHAR(1),
    difficulty_level INT,
    section VARCHAR(20)
);

-- User_Tests table
CREATE TABLE user_tests (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    score INT,
    completed_at TIMESTAMP
);
```

### 🎯 **Q7: Làm thế nào để handle errors trong project?**

**Trả lời:**

**Backend (Spring Boot):**

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(404).body(error);
    }
}
```

**Frontend (Next.js):**

```typescript
try {
  const response = await fetch("/api/questions");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error("Failed to fetch questions:", error);
  // Show user-friendly error message
}
```

**Mobile (Flutter):**

```dart
try {
    final response = await http.get(Uri.parse('$baseUrl/questions'));
    if (response.statusCode == 200) {
        return Questions.fromJson(jsonDecode(response.body));
    } else {
        throw Exception('Failed to load questions');
    }
} catch (e) {
    // Handle network errors
    rethrow;
}
```

### 🎯 **Q8: Security measures được implement như thế nào?**

**Trả lời:**

1. **Authentication**: JWT tokens
2. **Authorization**: Role-based access control
3. **Input Validation**: Bean Validation annotations
4. **SQL Injection**: JPA/Hibernate parameterized queries
5. **XSS Protection**: Content Security Policy headers
6. **CORS**: Configured for allowed origins
7. **HTTPS**: TLS encryption in production

### 🎯 **Q9: Testing strategy cho project này?**

**Trả lời:**

**Backend Testing:**

```java
@SpringBootTest
class QuestionServiceTest {

    @Test
    void shouldCreateQuestionSuccessfully() {
        // Arrange
        QuestionDto questionDto = new QuestionDto("What is...", "A", "B", "C", "D", "A");

        // Act
        Question created = questionService.create(questionDto);

        // Assert
        assertThat(created.getId()).isNotNull();
        assertThat(created.getContent()).isEqualTo("What is...");
    }
}
```

**Frontend Testing:**

```typescript
// Jest + React Testing Library
test("renders question card correctly", () => {
  const mockQuestion = {
    id: 1,
    content: "Sample question",
    options: ["A", "B", "C", "D"],
  };

  render(<QuestionCard question={mockQuestion} />);
  expect(screen.getByText("Sample question")).toBeInTheDocument();
});
```

### 🎯 **Q10: Deployment strategy là gì?**

**Trả lời:**

1. **Backend**: JAR file deploy lên cloud (AWS, Heroku)
2. **Frontend**: Static build deploy lên Vercel/Netlify
3. **Mobile**: Build APK/IPA upload lên Play Store/App Store
4. **Database**: Cloud database (AWS RDS, MongoDB Atlas)
5. **CI/CD**: GitHub Actions cho automated testing và deployment

### 🎯 **Q11: Performance optimization techniques?**

**Trả lời:**

**Backend:**

- Database indexing trên các trường tìm kiếm thường xuyên
- Caching với Redis cho data ít thay đổi
- Connection pooling cho database
- Pagination cho large datasets

**Frontend:**

- Code splitting và lazy loading
- Image optimization với Next.js
- Memoization với React.memo
- Service Worker cho offline support

**Mobile:**

- Image caching
- Lazy loading cho lists
- State management optimization
- Bundle size reduction

---

## 🚀 Cách Chạy Project

### 1. **Backend (Spring Boot):**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 2. **Frontend (Next.js):**

```bash
cd frontend
npm install
npm run dev
```

### 3. **Mobile (Flutter):**

```bash
cd mobile
flutter pub get
flutter run
```

---

## 📝 Kết Luận

Project LeEnglish TOEIC Platform được thiết kế với:

- **Modern Tech Stack**: Spring Boot + Next.js + Flutter
- **Best Practices**: Clean architecture, RESTful APIs, responsive design
- **Scalability**: Microservices-ready, cloud-compatible
- **Security**: JWT authentication, input validation
- **User Experience**: Cross-platform, offline support

**Skill Sets Demonstrates:**

- Full-stack development
- Multi-platform development
- API design and implementation
- Database design
- Security implementation
- Modern frontend frameworks
- Mobile app development
- DevOps practices

---

## 🧮 Câu Hỏi Thuật Toán & Giải Thích Code Quan Trọng

### 🔍 **Các Thuật Toán Chính Trong Project**

#### 1. **Thuật Toán Tính Điểm TOEIC**

```java
// Backend - ScoreCalculationService.java
public class ScoreCalculationService {

    // Công thức tính điểm TOEIC chuẩn
    public int calculateToeicScore(List<UserAnswer> answers, List<Question> questions) {
        int correctAnswers = 0;
        int totalQuestions = questions.size();

        // Đếm số câu đúng
        for (int i = 0; i < answers.size(); i++) {
            if (answers.get(i).getSelectedOption().equals(questions.get(i).getCorrectAnswer())) {
                correctAnswers++;
            }
        }

        // Công thức chuyển đổi điểm TOEIC (10-990)
        double percentage = (double) correctAnswers / totalQuestions;
        int score = (int) Math.round(10 + (percentage * 980));

        return Math.min(score, 990); // Cap tối đa 990
    }
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Tại sao dùng Math.round() và Math.min()?
- **A**: Math.round() để làm tròn số thập phân, Math.min() để đảm bảo điểm không vượt quá 990.

#### 2. **Thuật Toán Shuffle Questions (Fisher-Yates)**

```java
// Xáo trộn câu hỏi để tránh gian lận
public List<Question> shuffleQuestions(List<Question> questions) {
    List<Question> shuffled = new ArrayList<>(questions);
    Random random = new Random();

    // Fisher-Yates shuffle algorithm - O(n)
    for (int i = shuffled.size() - 1; i > 0; i--) {
        int j = random.nextInt(i + 1);
        Collections.swap(shuffled, i, j);
    }

    return shuffled;
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Tại sao dùng Fisher-Yates thay vì Collections.shuffle()?
- **A**: Fisher-Yates đảm bảo distribution đều và có thể control seed cho reproducible results.

#### 3. **Thuật Toán Tìm Kiếm Questions (Binary Search)**

```java
// Tìm kiếm câu hỏi theo độ khó (đã sort)
public List<Question> findQuestionsByDifficulty(List<Question> sortedQuestions, int targetDifficulty) {
    int left = 0, right = sortedQuestions.size() - 1;
    int firstIndex = -1, lastIndex = -1;

    // Tìm first occurrence - O(log n)
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (sortedQuestions.get(mid).getDifficulty() == targetDifficulty) {
            firstIndex = mid;
            right = mid - 1; // Tiếp tục tìm bên trái
        } else if (sortedQuestions.get(mid).getDifficulty() < targetDifficulty) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // Tìm last occurrence
    left = 0; right = sortedQuestions.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (sortedQuestions.get(mid).getDifficulty() == targetDifficulty) {
            lastIndex = mid;
            left = mid + 1; // Tiếp tục tìm bên phải
        } else if (sortedQuestions.get(mid).getDifficulty() < targetDifficulty) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return firstIndex != -1 ?
        sortedQuestions.subList(firstIndex, lastIndex + 1) :
        new ArrayList<>();
}
```

#### 4. **Thuật Toán Caching với LRU (Least Recently Used)**

```java
// Cache cho frequently accessed questions
public class QuestionCache {
    private final LinkedHashMap<Long, Question> cache;
    private final int maxSize;

    public QuestionCache(int maxSize) {
        this.maxSize = maxSize;
        // LinkedHashMap với access-order = true cho LRU
        this.cache = new LinkedHashMap<Long, Question>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Long, Question> eldest) {
                return size() > maxSize;
            }
        };
    }

    public synchronized Question get(Long questionId) {
        return cache.get(questionId); // Tự động move to end
    }

    public synchronized void put(Long questionId, Question question) {
        cache.put(questionId, question); // Tự động remove eldest nếu cần
    }
}
```

### 🔧 **Code Quan Trọng Cần Giải Thích**

#### 1. **JWT Token Generation & Validation (Backend)**

```java
@Service
public class JwtService {

    private final String SECRET_KEY = "mySecretKey";
    private final long JWT_EXPIRATION = 86400000; // 24 hours

    // Tạo JWT token
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    // Validate token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Extract claims với error handling
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT token has expired");
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }
}
```

**🎯 Tại sao quan trọng:**

- **Security**: Stateless authentication
- **Scalability**: Không cần lưu session server-side
- **Performance**: Token self-contained, không cần database lookup

#### 2. **React Hook để Manage State (Frontend)**

```typescript
// Custom hook cho quiz state management
import { useState, useEffect, useCallback } from "react";

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  timeRemaining: number;
  isCompleted: boolean;
}

export const useQuizState = (initialQuestions: Question[]) => {
  const [state, setState] = useState<QuizState>({
    questions: initialQuestions,
    currentIndex: 0,
    answers: [],
    timeRemaining: 7200, // 2 hours in seconds
    isCompleted: false,
  });

  // Timer effect với cleanup
  useEffect(() => {
    if (state.timeRemaining <= 0 || state.isCompleted) return;

    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, [state.timeRemaining, state.isCompleted]);

  // Memoized function để tránh re-render không cần thiết
  const submitAnswer = useCallback(
    (questionId: number, selectedOption: string) => {
      setState((prev) => {
        const newAnswers = [...prev.answers];
        const existingIndex = newAnswers.findIndex(
          (a) => a.questionId === questionId
        );

        if (existingIndex >= 0) {
          newAnswers[existingIndex] = { questionId, selectedOption };
        } else {
          newAnswers.push({ questionId, selectedOption });
        }

        return {
          ...prev,
          answers: newAnswers,
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.questions.length - 1),
    }));
  }, []);

  return {
    ...state,
    submitAnswer,
    nextQuestion,
    progress: ((state.currentIndex + 1) / state.questions.length) * 100,
  };
};
```

**🎯 Tại sao quan trọng:**

- **Reusability**: Hook có thể dùng ở nhiều components
- **Performance**: useCallback tránh re-render
- **Separation of Concerns**: Logic tách khỏi UI

#### 3. **Flutter Provider Pattern (Mobile)**

```dart
// State management với Riverpod
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Question service provider
final questionServiceProvider = Provider<QuestionService>((ref) {
  return QuestionService(ref.read(httpClientProvider));
});

// Questions state provider
final questionsProvider = StateNotifierProvider<QuestionsNotifier, AsyncValue<List<Question>>>((ref) {
  return QuestionsNotifier(ref.read(questionServiceProvider));
});

class QuestionsNotifier extends StateNotifier<AsyncValue<List<Question>>> {
  final QuestionService _questionService;

  QuestionsNotifier(this._questionService) : super(const AsyncValue.loading());

  // Load questions với error handling
  Future<void> loadQuestions({int? difficulty, String? section}) async {
    state = const AsyncValue.loading();

    try {
      final questions = await _questionService.getQuestions(
        difficulty: difficulty,
        section: section,
      );

      state = AsyncValue.data(questions);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  // Shuffle questions
  void shuffleQuestions() {
    state.whenData((questions) {
      final shuffled = List<Question>.from(questions);
      shuffled.shuffle();
      state = AsyncValue.data(shuffled);
    });
  }
}

// Widget sử dụng provider
class QuestionListWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final questionsAsync = ref.watch(questionsProvider);

    return questionsAsync.when(
      data: (questions) => ListView.builder(
        itemCount: questions.length,
        itemBuilder: (context, index) => QuestionCard(question: questions[index]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => ErrorWidget(error.toString()),
    );
  }
}
```

#### 4. **Database Query Optimization (Backend)**

```java
// Repository với custom queries
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Query với pagination và sorting
    @Query("SELECT q FROM Question q WHERE q.difficulty = :difficulty AND q.section = :section")
    Page<Question> findByDifficultyAndSection(
        @Param("difficulty") int difficulty,
        @Param("section") String section,
        Pageable pageable
    );

    // Native query cho performance tốt hơn
    @Query(value = "SELECT * FROM questions q WHERE q.created_at >= :startDate " +
                   "ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomRecentQuestions(
        @Param("startDate") LocalDateTime startDate,
        @Param("limit") int limit
    );

    // Batch insert để improve performance
    @Modifying
    @Query("UPDATE Question q SET q.difficulty = :newDifficulty WHERE q.id IN :ids")
    int updateDifficultyBatch(@Param("ids") List<Long> ids, @Param("newDifficulty") int newDifficulty);
}

// Service với caching
@Service
@Transactional
public class QuestionService {

    @Cacheable(value = "questions", key = "#difficulty + '_' + #section")
    public Page<Question> getQuestionsByDifficultyAndSection(int difficulty, String section, Pageable pageable) {
        return questionRepository.findByDifficultyAndSection(difficulty, section, pageable);
    }

    @CacheEvict(value = "questions", allEntries = true)
    public Question createQuestion(QuestionDto questionDto) {
        Question question = mapToEntity(questionDto);
        return questionRepository.save(question);
    }
}
```

### 🎯 **Câu Hỏi Thuật Toán Từ Dự Án Thực Tế**

### 🔍 **Các Implementation Thuật Toán Trong Code Hiện Tại**

#### **Q1: JWT Token Authentication Algorithm**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/service/JwtService.java`
**📁 File:** `learning2/leenglish-back/englishback/src/main/java/com/eleng/englishback/service/JwtService.java`

```java
// Thuật toán mã hóa JWT với HMAC SHA-256
public String generateToken(String username, String role) {
    Key key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8),
                               SignatureAlgorithm.HS256.getJcaName());
    return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(Date.from(Instant.now().plus(7, ChronoUnit.DAYS)))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Tại sao dùng HMAC SHA-256 cho JWT signing?
- **A**: HMAC SHA-256 đảm bảo integrity và authenticity. Nhanh hơn RSA, phù hợp cho stateless authentication.

#### **Q2: JWT Authentication Filter Algorithm**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/security/JwtAuthenticationFilter.java`
**📁 File:** `learning2/leenglish/backend/src/main/java/com/eleng/englishback/security/JwtAuthenticationFilter.java`

```java
// Thuật toán xác thực token trong mỗi request
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

    final String authorizationHeader = request.getHeader("Authorization");
    String username = null;
    String jwt = null;
    String role = null;

    // Extract JWT from Bearer token
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        jwt = authorizationHeader.substring(7);
        try {
            username = jwtService.extractUsername(jwt);
            role = jwtService.extractRole(jwt);
        } catch (Exception e) {
            logger.warn("JWT extraction failed: " + e.getMessage());
        }
    }

    // Validate và set authentication context
    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        if (jwtService.isTokenValid(jwt, userOptional.get())) {
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(username, null, Arrays.asList(authority));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    filterChain.doFilter(request, response);
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Time complexity của authentication filter?
- **A**: O(1) cho token extraction, O(1) cho validation (nếu không query database), overall O(1) per request.

#### **Q3: Password Hashing Algorithm (BCrypt)**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/config/SecurityConfig.java`
**📁 File:** `learning2/leenglish-back/englishback/src/main/java/com/eleng/englishback/config/SecurityConfig.java`

```java
// BCrypt password encoding với strength 12
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // Stronger encoding
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Tại sao dùng BCrypt strength 12?
- **A**: BCrypt với cost factor 12 cần ~250ms để hash, balance giữa security và performance. Chống rainbow table attacks.

#### **Q4: Role-Based Access Control Algorithm**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/config/SecurityConfig.java`
**📁 File:** `learning2/leenglish/backend/src/main/java/com/eleng/englishback/config/SecurityConfig.java`

```java
// Thuật toán phân quyền theo role
.authorizeHttpRequests(authz -> authz
    // Public endpoints
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/health").permitAll()

    // User endpoints
    .requestMatchers("/api/users/profile").hasAnyRole("USER", "ADMIN")
    .requestMatchers("/api/flashcards/**").hasAnyRole("USER", "COLLABORATOR", "ADMIN")

    // Admin only
    .requestMatchers("/api/users/**").hasRole("ADMIN")
    .anyRequest().authenticated()
)
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Complexity của role checking?
- **A**: O(1) lookup trong Set của authorities. Spring Security cache authorities để optimize performance.

#### **Q5: Authentication Entry Point Error Handling**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/security/JwtAuthenticationEntryPoint.java`

```java
// Thuật toán xử lý unauthorized access
@Override
public void commence(HttpServletRequest request, HttpServletResponse response,
        AuthenticationException authException) throws IOException, ServletException {

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setStatus(HttpStatus.UNAUTHORIZED.value());

    Map<String, Object> responseBody = new HashMap<>();
    responseBody.put("timestamp", LocalDateTime.now().toString());
    responseBody.put("status", HttpStatus.UNAUTHORIZED.value());
    responseBody.put("error", "Unauthorized");
    responseBody.put("message", "Authentication is required to access this resource");
    responseBody.put("path", request.getRequestURI());

    String jsonResponse = objectMapper.writeValueAsString(responseBody);
    response.getWriter().write(jsonResponse);
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Tại sao cần custom AuthenticationEntryPoint?
- **A**: Đảm bảo consistent JSON error response format, không expose sensitive information, better UX for frontend.

#### **Q6: Flashcard Search Algorithm**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/controller/FlashcardController.java`
**📁 File:** `learning2/leenglish-back/englishback/src/main/java/com/eleng/englishback/controller/LessonSetController.java`

```java
// Search endpoint với pagination
@GetMapping("/sets/search")
public ResponseEntity<List<FlashcardSetDto>> searchFlashcardSets(
    @RequestParam String query,
    Authentication authentication) {

    List<FlashcardSetDto> results = flashcardSetService.searchFlashcardSets(query);
    return ResponseEntity.ok(results);
}

// Advanced filtering
@GetMapping("/filter")
public ResponseEntity<Map<String, Object>> filterLessonSets(
        @RequestParam(required = false) String level,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Boolean isPremium,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    // Implementation với multiple criteria
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Optimize search performance như thế nào?
- **A**: Full-text search indexing, pagination để limit results, caching frequent queries, database indexing trên search fields.

#### **Q7: User Authentication Flow Algorithm**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/controller/AuthController.java`

```java
// Login algorithm với multiple validation steps
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
    String username = loginRequest.get("username");
    String email = loginRequest.get("email");
    String password = loginRequest.get("password");

    // Step 1: Input validation
    String loginIdentifier = username != null ? username : email;
    if (loginIdentifier == null || password == null) {
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Step 2: Authentication
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginIdentifier, password));

    // Step 3: User lookup
    Optional<User> userOptional = username != null
            ? userService.findUserByUsername(username)
            : userService.findUserByEmail(email);

    // Step 4: User status validation
    if (userOptional.isPresent()) {
        User user = userOptional.get();
        if (!user.isActiveUser()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }

        // Step 5: Token generation
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(successResponse);
    }
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Tại sao cần multi-step validation?
- **A**: Defense in depth - mỗi step validate different aspects, early exit giảm processing time, better error handling.

#### **Q8: Flutter State Management Algorithm (Riverpod)**

**📁 File:** `mobile/lib/providers/auth_provider.dart`

```dart
// Async state management với error handling
Future<void> login(String email, String password) async {
  state = state.copyWith(isLoading: true, error: null);

  try {
    // Simulate API call with exponential backoff
    await Future.delayed(const Duration(seconds: 1));

    final user = User(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      email: email,
      name: email.split('@')[0],
      currentLevel: 3,
      totalScore: 850,
    );

    state = state.copyWith(user: user, isLoading: false);
  } catch (e) {
    state = state.copyWith(
      error: 'Login failed: ${e.toString()}',
      isLoading: false,
    );
  }
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Immutable state management benefits?
- **A**: No side effects, predictable state changes, easy debugging, time travel debugging, thread-safe.

#### **Q9: CORS Configuration Algorithm**

**📁 File:** `backend/src/main/java/com/leenglish/toeic/config/SecurityConfig.java`

```java
// CORS configuration cho cross-origin requests
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Security implications của wildcard CORS?
- **A**: Development convenience vs security risk. Production nên restrict origins, use allowCredentials=false cho public APIs.

#### **Q10: Circular Dependency Resolution Algorithm**

**📁 File:** `backend/CIRCULAR_DEPENDENCY_FIX.md`

```java
// Lazy injection để break circular dependency
@Autowired
@Lazy
private UserService userService;
```

**🎯 Câu hỏi thuật toán:**

- **Q**: @Lazy annotation hoạt động như thế nào?
- **A**: Creates proxy object thay vì inject actual bean, actual bean chỉ được created khi cần sử dụng, breaks initialization cycle.

#### **Q11: Data Structure Choices trong Project**

**HashMap cho User Sessions:**

```java
// O(1) average case lookup
Map<String, UserSession> activeSessions = new ConcurrentHashMap<>();
```

**LinkedHashMap cho LRU Cache:**

```java
// O(1) access + insertion order maintenance
new LinkedHashMap<Long, Question>(16, 0.75f, true)
```

**ArrayList cho Questions:**

```java
// O(1) random access, O(n) search
List<Question> questions = new ArrayList<>();
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Trade-offs của các data structures?
- **A**:
  - HashMap: Fast lookup nhưng no ordering
  - LinkedHashMap: Ordering + fast access nhưng higher memory
  - ArrayList: Fast random access nhưng slow insertion/deletion in middle

---

## 🧪 **Testing Algorithms trong Project**

#### **Q12: Unit Testing Strategy Algorithm**

**📁 File:** `backend/src/test/java/` (implied from structure)

```java
// Testing JWT service
@SpringBootTest
class JwtServiceTest {

    @Test
    void shouldGenerateValidToken() {
        // Arrange
        String username = "testuser";
        String role = "USER";

        // Act
        String token = jwtService.generateToken(username, role);

        // Assert
        assertThat(token).isNotNull();
        assertThat(jwtService.extractUsername(token)).isEqualTo(username);
        assertThat(jwtService.extractRole(token)).isEqualTo(role);
    }

    @Test
    void shouldValidateTokenCorrectly() {
        // Test token validation logic
    }
}
```

**🎯 Câu hỏi thuật toán:**

- **Q**: Test coverage strategy cho security components?
- **A**: Test happy path, edge cases, error conditions, malicious inputs, token expiration, invalid signatures.

---

_🧮 Algorithm complexity analysis updated: June 18, 2025_
