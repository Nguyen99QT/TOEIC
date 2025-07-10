# Circular Dependency Issue Fix

## Problem Description

**Lỗi:** `BeanCurrentlyInCreationException: Error creating bean with name 'jwtAuthenticationFilter': Requested bean is currently in creation: Is there an unresolvable circular reference?`

## Root Cause Analysis

Circular dependency cycle được phát hiện:

```
jwtAuthenticationFilter
└── userService (via @Autowired)
    └── passwordEncoder (via @Autowired)
        └── securityConfig
            └── jwtAuthenticationFilter (được inject vào SecurityFilterChain)
```

### Chi tiết vòng phụ thuộc:

1. **JwtAuthenticationFilter** cần **UserService** để validate user
2. **UserService** cần **PasswordEncoder** để hash passwords
3. **PasswordEncoder** được define trong **SecurityConfig**
4. **SecurityConfig** cần **JwtAuthenticationFilter** để setup security filter chain

## Solution Applied

### Fix #1: Lazy Injection

Thêm `@Lazy` annotation vào UserService injection trong JwtAuthenticationFilter:

```java
@Autowired
@Lazy
private UserService userService;
```

**Cách hoạt động:**

- `@Lazy` sẽ tạo proxy cho UserService
- UserService chỉ được khởi tạo thực sự khi cần sử dụng
- Break the circular dependency cycle

### Alternative Solutions (nếu @Lazy không work)

#### Option 1: Constructor Injection với @Lazy

```java
public JwtAuthenticationFilter(@Lazy UserService userService, JwtService jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
}
```

#### Option 2: ApplicationContextAware

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    private UserService getUserService() {
        return applicationContext.getBean(UserService.class);
    }
}
```

#### Option 3: Restructure Dependencies

- Move PasswordEncoder to separate Configuration class
- Remove direct dependency between SecurityConfig and JwtAuthenticationFilter

## Best Practices để tránh Circular Dependencies

1. **Minimize dependencies** giữa các service classes
2. **Use events** thay vì direct method calls khi có thể
3. **Separate concerns** properly (authentication vs business logic)
4. **Lazy initialization** cho non-critical dependencies
5. **Constructor injection** + **@Lazy** cho critical dependencies

## Verification

Sau khi apply fix:

- ✅ Application starts successfully
- ✅ No circular dependency errors
- ✅ JWT authentication works normally
- ✅ User service functions properly

## Notes

- `@Lazy` là temporary fix, consider refactoring nếu có thời gian
- Monitor performance impact (nếu có) của lazy loading
- Document any side effects nếu phát hiện
