# Backend (Java Spring Boot) to Frontend (Flutter) Integration Guide

This document outlines the process of integrating the Java Spring Boot backend with the Flutter mobile frontend for the TOEIC Learning Platform.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints](#api-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Data Models](#data-models)
5. [Integration Implementation](#integration-implementation)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

The TOEIC Learning Platform follows a client-server architecture:

- **Backend**: Java Spring Boot REST API with JWT authentication
- **Frontend**:
  - Web: React with TypeScript
  - Mobile: Flutter

The mobile application communicates with the backend through RESTful APIs, sending and receiving JSON data.

```
┌─────────────────┐        ┌──────────────────┐
│                 │  HTTP  │                  │
│  Flutter Mobile ├────────►  Spring Boot     │
│  Application    │ JSON   │  Backend API     │
│                 │        │                  │
└─────────────────┘        └──────────────────┘
```

## API Endpoints

The backend provides the following key endpoints:

### Authentication

- `POST /api/auth/login`: Authenticate a user and receive JWT token
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/logout`: Invalidate JWT token
- `GET /api/auth/validate`: Validate JWT token
- `POST /api/auth/refresh`: Refresh an expired JWT token

### Users

- `GET /api/users`: Get all users (admin only)
- `GET /api/users/{id}`: Get user by ID
- `GET /api/users/me`: Get current user profile
- `GET /api/users/username/{username}`: Get user by username
- `POST /api/users`: Create user
- `PUT /api/users/{id}`: Update user
- `DELETE /api/users/{id}`: Delete user
- `GET /api/users/leaderboard`: Get user leaderboard

### Lessons

- `GET /api/lessons`: Get all lessons (authenticated)
- `GET /api/lessons/free`: Get free lessons (public)
- `GET /api/lessons/{id}`: Get a specific lesson

### Flashcards

- `GET /api/flashcard-sets`: Get all flashcard sets
- `GET /api/flashcard-sets/public`: Get public flashcard sets
- `GET /api/flashcard-sets/{id}`: Get specific flashcard set
- `GET /api/flashcards/set/{id}`: Get flashcards for a set

## Authentication Flow

1. **User Registration**:

   - User enters registration details
   - Flutter app sends POST request to `/api/auth/register`
   - Backend creates user and returns JWT token + user data
   - Flutter app stores token securely using Flutter Secure Storage

2. **User Login**:

   - User enters credentials
   - Flutter app sends POST request to `/api/auth/login`
   - Backend validates credentials and returns JWT token
   - Flutter app stores token securely using Flutter Secure Storage

3. **Authenticated Requests**:

   - Flutter app includes JWT token in Authorization header
   - Backend validates token and processes request
   - If token is expired, Flutter app uses refresh token to get a new JWT

4. **User Logout**:
   - User initiates logout
   - Flutter app sends request to `/api/auth/logout` for token invalidation
   - Flutter app clears stored tokens
   - User is redirected to login screen

## Data Models

The key data models that are shared between backend and frontend:

### User

```dart
class User {
  final int id;
  final String username;
  final String email;
  final String? fullName;
  final UserRole role;
  final int currentLevel;
  final int totalScore;
  final int testsCompleted;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Constructor, fromJson, toJson methods...
}

enum UserRole { USER, ADMIN }
```

### Lesson

```dart
class Lesson {
  final int id;
  final String title;
  final String description;
  final LessonLevel level;
  final LessonCategory category;
  final String? imageUrl;
  final String? contentUrl;
  final bool isPremium;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Constructor, fromJson, toJson methods...
}

enum LessonLevel { BEGINNER, INTERMEDIATE, ADVANCED }
enum LessonCategory { GENERAL, CONVERSATION, GRAMMAR, VOCABULARY, BUSINESS, TRAVEL }
```

### Flashcard

```dart
class FlashcardSet {
  final int id;
  final String title;
  final String description;
  final FlashcardLevel level;
  final FlashcardCategory category;
  final bool isPublic;
  final int creatorId;
  final List<Flashcard>? flashcards;

  // Constructor, fromJson, toJson methods...
}

class Flashcard {
  final int id;
  final String front;
  final String back;
  final String? example;
  final int setId;
  final String? imageUrl;
  final String? audioUrl;

  // Constructor, fromJson, toJson methods...
}
```

## Integration Implementation

### 1. CORS Configuration

Backend configuration to allow Flutter app access:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns(
                // Web app origins
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                // Flutter app running on emulators
                "http://10.0.2.2:*",     // Android emulator
                "capacitor://localhost", // Capacitor
                "ionic://localhost"      // Ionic
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Authorization", "Content-Type", ...)
            .exposedHeaders("Authorization")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### 2. Flutter API Service

A robust ApiService class to handle all API communications:

```dart
class ApiService {
  // Base URL configuration for different environments
  static String get baseUrl {
    if (kReleaseMode) {
      return 'https://production-api.example.com/api';
    } else {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:8080/api'; // Android emulator
      } else if (Platform.isIOS) {
        return 'http://localhost:8080/api'; // iOS simulator
      } else {
        return 'http://localhost:8080/api';
      }
    }
  }

  final FlutterSecureStorage secureStorage = FlutterSecureStorage();

  // Make authenticated requests with JWT token
  Future<dynamic> _makeRequest(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? body,
    Map<String, String>? queryParams,
    bool requireAuth = false,
    bool retryOnUnauthorized = true,
  }) async {
    // Implementation...
  }

  // Authentication methods
  Future<Map<String, dynamic>> login(String email, String password) async {
    // Implementation...
  }

  Future<bool> logout() async {
    // Implementation...
  }

  Future<bool> refreshToken() async {
    // Implementation...
  }

  // API methods for users, lessons, flashcards, etc.
}
```

### 3. Authentication Provider

State management for authentication using Riverpod:

```dart
class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService = ApiService();

  AuthNotifier() : super(const AuthState()) {
    // Initialize auth state
    checkAuthStatus();
  }

  Future<void> login(String email, String password) async {
    // Implementation...
  }

  Future<void> logout() async {
    // Implementation...
  }

  Future<void> checkAuthStatus() async {
    // Implementation...
  }

  Future<void> register(String name, String email, String password) async {
    // Implementation...
  }
}
```

### 4. JWT Authentication Filter

Backend JWT validation and authentication:

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);

            // Extract username from token
            String username = jwtService.extractUsername(jwt);

            // Validate token and set authentication
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDto userDto = userService.getUserByUsername(username).get();

                if (jwtService.isTokenValid(jwt, userDto)) {
                    // Set authentication in security context
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, Arrays.asList(new SimpleGrantedAuthority("ROLE_" + userDto.getRole().name())));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

## Testing

1. **Authentication Testing**:

   - Login with valid credentials
   - Login with invalid credentials
   - Token refresh mechanism
   - Protected endpoint access
   - Logout functionality

2. **API Testing**:

   - Test all endpoints with valid/invalid inputs
   - Verify response formats match expected models
   - Test error handling and status codes

3. **Edge Cases**:
   - Network connectivity issues
   - Token expiration during app use
   - Server errors and client-side error handling

## Troubleshooting

### Common Issues

1. **CORS Errors**:

   - Check that backend CORS configuration includes the correct origins
   - For Android emulator, use `10.0.2.2` to connect to localhost
   - For iOS simulator, use `localhost`

2. **Authentication Issues**:

   - Ensure JWT token format is correct
   - Check token expiration and refresh mechanism
   - Verify proper token storage in secure storage

3. **Connection Issues**:
   - Debug API service to see request/response details
   - Verify correct base URL for different environments
   - Check for network connectivity before making requests

### Debugging

1. **Enable API Logging**:

   ```dart
   void _logDebug(String message) {
     if (_debugMode) {
       debugPrint('📡 API: $message');
     }
   }
   ```

2. **Backend Logging**:

   ```java
   logger.info("JWT Filter processing: " + method + " " + requestPath);
   ```

3. **Check JWT Token Validity**:
   - Use JWT.io to decode tokens and check claims
   - Verify token expiration times
   - Ensure signature verification is working correctly
