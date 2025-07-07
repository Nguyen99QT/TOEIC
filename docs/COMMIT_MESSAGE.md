# Commit Message Template

## For this fix, use:

```
🔧 Fix: Resolve backend compilation errors and circular dependency

- Add UserDto support methods to JwtService
- Fix type conversion issues in UserController
- Resolve circular dependency with @Lazy annotation
- Update method signatures and import statements
- Add proper User to UserDto mapping

Fixes: #[issue-number]
Tests: All compilation tests passing
Status: BUILD SUCCESS ✅
```

## Alternative short version:

```
fix: resolve compilation errors and circular dependency

- Add UserDto support to JwtService
- Fix type conversions with convertToDto()
- Break circular dependency using @Lazy
- Update method signatures and imports

BUILD SUCCESS ✅
```

## Files changed:

- backend/src/main/java/com/leenglish/toeic/service/JwtService.java
- backend/src/main/java/com/leenglish/toeic/controller/UserController.java
- backend/src/main/java/com/leenglish/toeic/security/JwtAuthenticationFilter.java
