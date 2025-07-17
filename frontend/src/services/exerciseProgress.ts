import api from "./api";

interface ExerciseProgress {
  exerciseId: number;
  isCompleted: boolean;
  score?: number;
  completedAt?: string;
  attempts?: number;
}

interface UserProgress {
  userId: number;
  lessonId: number;
  exercises: ExerciseProgress[];
}

/**
 * Get user's progress for all exercises in a lesson
 */
export const getLessonExerciseProgress = async (
  lessonId: number
): Promise<UserProgress | null> => {
  try {
    console.log(`🔍 Fetching exercise progress for lesson ${lessonId}`);

    const response = await api.get(`/api/lessons/${lessonId}/progress`);

    console.log(`✅ Exercise progress loaded:`, response.data);
    return response.data;
  } catch (error: any) {
    console.warn(
      `⚠️ Could not fetch exercise progress for lesson ${lessonId}:`,
      error.response?.status || error.message
    );

    // Return null instead of throwing, so UI can still work without progress data
    return null;
  }
};

/**
 * Get user's progress for a specific exercise
 */
export const getExerciseProgress = async (
  exerciseId: number
): Promise<ExerciseProgress | null> => {
  try {
    console.log(`🔍 Fetching progress for exercise ${exerciseId}`);

    const response = await api.get(`/api/exercises/${exerciseId}/progress`);

    console.log(`✅ Exercise progress loaded:`, response.data);
    return response.data;
  } catch (error: any) {
    console.warn(
      `⚠️ Could not fetch progress for exercise ${exerciseId}:`,
      error.response?.status || error.message
    );
    return null;
  }
};

/**
 * Check if user has completed any exercises based on localStorage results
 */
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

/**
 * Mark exercise as completed in localStorage (backup method)
 */
export const markExerciseCompletedInStorage = (exerciseId: number): void => {
  try {
    const completed = getCompletedExercisesFromStorage();
    completed.add(exerciseId);
    localStorage.setItem(
      "completed_exercises",
      JSON.stringify(Array.from(completed))
    );
    console.log(
      `✅ Exercise ${exerciseId} marked as completed in localStorage`
    );

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("exerciseCompleted", {
        detail: { exerciseId },
      })
    );
  } catch (error) {
    console.warn("Could not save completed exercise to localStorage:", error);
  }
};

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
 * Check if specific exercise is completed via API
 */
export const isExerciseCompletedAPI = async (
  exerciseId: number
): Promise<boolean> => {
  try {
    const response = await api.get(
      `/exercises/${exerciseId}/completion-status`
    );
    return response.data;
  } catch (error: any) {
    console.warn(
      `Could not check exercise ${exerciseId} completion:`,
      error.response?.status || error.message
    );
    return false;
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
