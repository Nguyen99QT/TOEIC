# Code Snippets: Exercise Completion Fix

## 1. exerciseProgress.ts - clearCompletedExercises Function

```typescript
/**
 * Clear all exercise completion data from localStorage
 * Used when user logs out to prevent cross-user contamination
 */
export const clearCompletedExercises = (): void => {
  try {
    console.log("🧹 Clearing exercise completion data from localStorage");
    localStorage.removeItem("completed_exercises"); // ✅ Correct key with underscore
    localStorage.removeItem("completedExercises"); // Also remove this variant
    localStorage.removeItem("exerciseProgress");
    console.log("✅ Exercise completion data cleared");
  } catch (error) {
    console.error("❌ Error clearing exercise completion data:", error);
  }
};
```

## 2. exerciseProgress.ts - API Integration

```typescript
/**
 * Get completed exercise IDs from API
 */
export const getCompletedExercisesFromAPI = async (): Promise<Set<number>> => {
  try {
    const response = await api.get("/exercises/completion-status");
    const completedIds: number[] = response.data;
    return new Set(completedIds);
  } catch (error: any) {
    console.warn(
      "Could not fetch completed exercises from API:",
      error.response?.status || error.message
    );
    return new Set();
  }
};

/**
 * Get completed exercises (try API first, fallback to localStorage)
 */
export const getCompletedExercises = async (): Promise<Set<number>> => {
  try {
    // Try API first
    const apiResults = await getCompletedExercisesFromAPI();

    // If we have API results, return them
    if (apiResults.size > 0) {
      return apiResults;
    }

    // Fallback to localStorage for immediate UI response
    return getCompletedExercisesFromStorage();
  } catch (error) {
    console.error("Error getting completed exercises:", error);
    // Fallback to localStorage
    return getCompletedExercisesFromStorage();
  }
};
```

## 3. AuthContext.tsx - Enhanced Logout

```typescript
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { User } from "../types";
import { clearCompletedExercises } from "../services/exerciseProgress";

// ... other code ...

const logout = useCallback(async () => {
  try {
    const { removeToken, stopAutoRefresh } = await import("../services/auth");
    removeToken();
    stopAutoRefresh();
  } catch (error) {
    console.error("Error during logout:", error);
    // Fallback to manual cleanup
    const keys = [
      "toeic_current_user",
      "toeic_access_token",
      "toeic_refresh_token",
      "currentUser",
      "authToken",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
  }

  // Clear exercise completion data from localStorage
  try {
    clearCompletedExercises();
    console.log("✅ Exercise completion data cleared");
  } catch (error) {
    console.warn("⚠️ Could not clear exercise completion data:", error);
    // Fallback to manual cleanup
    localStorage.removeItem("completed_exercises");
    localStorage.removeItem("completedExercises");
  }

  setCurrentUser(null);
  setIsAuthenticated(false);
  console.log("✅ User logged out successfully");
}, []);
```

## 4. ExerciseResultService.java - Database Methods

```java
/**
 * Check if user has completed a specific exercise
 */
public boolean isExerciseCompleted(Long userId, Long exerciseId) {
    return userExerciseResultRepository.existsByUserIdAndExerciseIdAndScore(userId, exerciseId);
}

/**
 * Get all completed exercise IDs for a user
 */
public Set<Long> getCompletedExerciseIds(Long userId) {
    List<UserExerciseResult> results = userExerciseResultRepository.findByUserId(userId);
    return results.stream()
        .filter(result -> result.getScore() != null && result.getScore() > 0)
        .map(result -> result.getExercise().getId())
        .collect(Collectors.toSet());
}
```

## 5. ExerciseController.java - API Endpoints

```java
/**
 * Get completion status for all exercises for current user
 */
@GetMapping("/completion-status")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Set<Long>> getCompletionStatus() {
    User user = getUserFromAuthentication();
    Set<Long> completedIds = exerciseResultService.getCompletedExerciseIds(user.getId());
    return ResponseEntity.ok(completedIds);
}

/**
 * Check if specific exercise is completed for current user
 */
@GetMapping("/{exerciseId}/completion-status")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Boolean> isExerciseCompleted(@PathVariable Long exerciseId) {
    User user = getUserFromAuthentication();
    boolean isCompleted = exerciseResultService.isExerciseCompleted(user.getId(), exerciseId);
    return ResponseEntity.ok(isCompleted);
}

/**
 * Helper method to get authenticated user
 */
private User getUserFromAuthentication() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return (User) authentication.getPrincipal();
}
```

## 6. Browser Console Debug Commands

```javascript
// Check current localStorage state
console.log("=== localStorage Exercise Data ===");
console.log(
  "completed_exercises:",
  localStorage.getItem("completed_exercises")
);
console.log("completedExercises:", localStorage.getItem("completedExercises"));
console.log("exerciseProgress:", localStorage.getItem("exerciseProgress"));
console.log("All keys:", Object.keys(localStorage));

// Manual cleanup test
console.log("=== Manual localStorage Cleanup ===");
localStorage.removeItem("completed_exercises");
localStorage.removeItem("completedExercises");
localStorage.removeItem("exerciseProgress");
console.log("✅ Exercise data cleared manually");
console.log("Remaining keys:", Object.keys(localStorage));

// Check authentication state
console.log("=== Auth State ===");
console.log("Token exists:", !!localStorage.getItem("toeic_access_token"));
console.log("User exists:", !!localStorage.getItem("toeic_current_user"));
```

## 7. Testing Workflow

```bash
# Test sequence for cross-user isolation
1. Login as user 'huyplum'
2. Complete exercises 2 and 4
3. Verify localStorage contains: ["2", "4"]
4. Logout (should clear exercise data)
5. Login as user 'hihi'
6. Verify localStorage is clean (no completed_exercises)
7. Check API returns empty set for 'hihi'
8. Complete exercise 1 as 'hihi'
9. Logout and login as 'huyplum'
10. Verify 'huyplum' still sees exercises 2,4 (not exercise 1)
```

## 8. Error Handling

```typescript
// In exerciseProgress.ts - Robust error handling
export const getCompletedExercisesFromStorage = (): Set<number> => {
  try {
    const completedExercises = localStorage.getItem("completed_exercises");
    if (completedExercises) {
      const parsed = JSON.parse(completedExercises);
      return new Set(parsed);
    }
  } catch (error) {
    console.warn(
      "Could not parse completed exercises from localStorage:",
      error
    );
  }
  return new Set();
};

// Fallback cleanup in AuthContext.tsx
try {
  clearCompletedExercises();
  console.log("✅ Exercise completion data cleared");
} catch (error) {
  console.warn("⚠️ Could not clear exercise completion data:", error);
  // Fallback to manual cleanup
  localStorage.removeItem("completed_exercises");
  localStorage.removeItem("completedExercises");
}
```
