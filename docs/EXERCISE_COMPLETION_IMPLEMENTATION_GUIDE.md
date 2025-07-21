# Implementation Guide: Exercise Completion Auto-Update

## Bước 1: Cập nhật ExerciseQuestionsPage

```bash
# Tìm và sửa file ExerciseQuestionsPage.tsx
find . -name "ExerciseQuestionsPage.tsx" -type f
```

Thêm import:

```typescript
import {
  markExerciseCompletedImmediate,
  getCompletedExercises,
} from "../services/exerciseProgress";
```

Sửa function `submitExercise()`:

```typescript
const submitExercise = async () => {
  try {
    setIsSubmitting(true);

    // Existing submit logic...
    const response = await exerciseService.submitExercise(
      exerciseId,
      submissionData
    );

    // 🔄 THÊM: Auto-refresh completion
    await markExerciseCompletedImmediate(exerciseId);

    // Navigate với completion info
    navigate(`/lessons/${exercise.lessonId}/exercises`, {
      state: {
        refreshCompleted: true,
        completedExerciseId: exerciseId,
        score: response.earnedPoints || response.score,
      },
    });
  } catch (error) {
    console.error("❌ Error submitting exercise:", error);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Bước 2: Cập nhật ExercisesPage

```bash
# Tìm và sửa file ExercisesPage.tsx
find . -name "ExercisesPage.tsx" -type f
```

Thêm state và effects:

```typescript
const [exerciseResults, setExerciseResults] = useState<Map<number, any>>(
  new Map()
);

// Handle completion updates
useEffect(() => {
  if (location.state?.refreshCompleted) {
    console.log("🔄 Detected completion update");

    const completedExerciseId = location.state.completedExerciseId;
    const score = location.state.score;

    // Update completion status
    fetchCompletionStatus();

    // Update results
    if (completedExerciseId && score !== undefined) {
      setExerciseResults((prev) =>
        new Map(prev).set(completedExerciseId, { score })
      );
    }

    // Clear navigation state
    window.history.replaceState({}, document.title);
  }
}, [location.state]);
```

## Bước 3: Tạo Enhanced Exercise Service

```bash
# Tạo file mới hoặc cập nhật existing
touch frontend/src/services/exerciseProgress.ts
```

Thêm functions:

```typescript
export const markExerciseCompletedImmediate = async (
  exerciseId: number
): Promise<void> => {
  try {
    console.log(
      `🔄 Marking exercise ${exerciseId} as completed immediately...`
    );

    // Update localStorage immediately
    markExerciseCompletedInStorage(exerciseId);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("exerciseCompletionUpdated", {
        detail: { exerciseId, isCompleted: true },
      })
    );
  } catch (error) {
    console.error(
      `❌ Error marking exercise ${exerciseId} as completed:`,
      error
    );
  }
};

export const forceRefreshCompletionStatus = async (): Promise<Set<number>> => {
  try {
    console.log("🔄 Force refreshing completion status...");

    // Clear cache
    localStorage.removeItem("completed_exercises");

    // Fetch fresh data
    const apiResults = await getCompletedExercisesFromAPI();

    // Update cache
    if (apiResults.size > 0) {
      localStorage.setItem(
        "completed_exercises",
        JSON.stringify(Array.from(apiResults))
      );
    }

    return apiResults;
  } catch (error) {
    console.error("❌ Error force refreshing:", error);
    return new Set();
  }
};
```

## Bước 4: Tạo Custom Hook

```bash
# Tạo file hook mới
touch frontend/src/hooks/useExerciseCompletion.ts
```

```typescript
import { useEffect, useState } from "react";
import { getCompletedExercises } from "../services/exerciseProgress";

export const useExerciseCompletion = () => {
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshCompletionStatus = async () => {
    try {
      setIsLoading(true);
      const completed = await getCompletedExercises();
      setCompletedExercises(completed);
    } catch (error) {
      console.error("❌ Error refreshing completion status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCompletionStatus();

    const handleCompletionUpdate = () => {
      console.log("🔄 Received completion update event");
      refreshCompletionStatus();
    };

    window.addEventListener(
      "exerciseCompletionUpdated",
      handleCompletionUpdate
    );
    window.addEventListener("exerciseCompleted", handleCompletionUpdate);

    return () => {
      window.removeEventListener(
        "exerciseCompletionUpdated",
        handleCompletionUpdate
      );
      window.removeEventListener("exerciseCompleted", handleCompletionUpdate);
    };
  }, []);

  return {
    completedExercises,
    isLoading,
    refreshCompletionStatus,
  };
};
```

## Bước 5: Cập nhật ExerciseCard Component

```bash
# Tìm và sửa ExerciseCard component
find . -name "*ExerciseCard*" -type f
```

Thêm completion display:

```typescript
const ExerciseCard = ({
  exercise,
  isCompleted,
  result,
  onRefreshCompletion,
}) => {
  const [exerciseResult, setExerciseResult] = useState(result);

  useEffect(() => {
    if (isCompleted && !exerciseResult) {
      fetchExerciseResult();
    }
  }, [isCompleted, exerciseResult]);

  const fetchExerciseResult = async () => {
    try {
      const result = await exerciseService.getExerciseResult(exercise.id);
      setExerciseResult(result);
    } catch (error) {
      console.error("❌ Error fetching exercise result:", error);
    }
  };

  return (
    <div className={`exercise-card ${isCompleted ? "completed" : ""}`}>
      <div className="exercise-header">
        <h3>{exercise.title}</h3>

        {isCompleted && (
          <div className="completion-badge">
            <span className="text-green-600 font-medium">✅ Completed</span>
            {exerciseResult && (
              <span className="text-blue-600 ml-2">
                Score: {exerciseResult.score || exerciseResult.earnedPoints}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="exercise-actions">
        {isCompleted ? (
          <button className="btn-secondary">📖 Review Exercise</button>
        ) : (
          <button className="btn-primary">🚀 Start Exercise</button>
        )}

        <button className="btn-ghost" onClick={onRefreshCompletion}>
          🔄
        </button>
      </div>
    </div>
  );
};
```

## Bước 6: Thêm CSS Styling

```bash
# Tạo hoặc cập nhật CSS file
touch frontend/src/styles/exercises.css
```

```css
.exercise-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.exercise-card.completed {
  border-color: #10b981;
  background-color: #f0fdf4;
  position: relative;
}

.exercise-card.completed::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #10b981;
  border-radius: 4px 0 0 4px;
}

.completion-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: #dcfce7;
  border-radius: 4px;
  font-size: 14px;
}

.exercise-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-ghost {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.btn-ghost:hover {
  background-color: #f3f4f6;
}
```

## Bước 7: Testing Commands

```bash
# Build and test
cd frontend
npm run build

# Start development server
npm run dev

# Check for compilation errors
npm run type-check

# Run tests if available
npm test
```

## Bước 8: Verification Checklist

- [ ] ✅ Exercise completion auto-updates after submit
- [ ] ✅ Completion badge appears immediately
- [ ] ✅ Score is displayed correctly
- [ ] ✅ Button changes from "Start" to "Review"
- [ ] ✅ Navigation state works properly
- [ ] ✅ LocalStorage is updated immediately
- [ ] ✅ Event system works for cross-component updates
- [ ] ✅ Error handling is robust
- [ ] ✅ CSS styling is applied correctly
- [ ] ✅ Performance is optimized

## Debugging Tips

1. **Check console logs** cho completion updates
2. **Verify localStorage** có chứa completion data
3. **Check network requests** để đảm bảo API calls thành công
4. **Test navigation state** bằng React DevTools
5. **Verify event system** bằng browser DevTools

## Troubleshooting

| Issue                     | Solution                            |
| ------------------------- | ----------------------------------- |
| Completion không hiển thị | Check localStorage và API response  |
| Score không hiển thị      | Verify exercise result API endpoint |
| Navigation state bị mất   | Check window.history.replaceState   |
| Event không fire          | Verify event listener setup         |
| CSS không apply           | Check import và class names         |

## Performance Optimization

1. **Debounce refresh calls** để tránh spam API
2. **Cache results** để giảm network requests
3. **Lazy load** exercise results khi cần
4. **Cleanup event listeners** để tránh memory leaks
5. **Use React.memo** cho ExerciseCard component
