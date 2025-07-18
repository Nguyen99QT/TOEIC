/**
 * ================================================================
 * EXERCISE PROGRESS SERVICE
 * ================================================================
 * Service để quản lý progress của exercises cho từng user riêng biệt
 */

import { exerciseService } from "./exercises";

/**
 * Get completed exercises from API for current user
 */
export const getCompletedExercisesFromAPI = async (): Promise<Set<number>> => {
  try {
    console.log("🔄 Fetching completed exercises from API for current user...");
    const results = await exerciseService.getUserExerciseResults();
    const completedIds = new Set(results.map((result) => result.exerciseId));
    console.log("✅ User completed exercises:", completedIds);
    return completedIds;
  } catch (error) {
    console.error("❌ Error getting completed exercises from API:", error);
    return new Set();
  }
};

/**
 * Get all completed exercises for current user
 */
export const getCompletedExercises = async (): Promise<Set<number>> => {
  try {
    // Only use API - no localStorage for user-specific data
    const apiResults = await getCompletedExercisesFromAPI();
    return apiResults;
  } catch (error) {
    console.error("❌ Error getting completed exercises:", error);
    return new Set();
  }
};

/**
 * Mark exercise as completed immediately (API only)
 */
export const markExerciseCompletedImmediate = async (
  exerciseId: number
): Promise<void> => {
  try {
    console.log(
      `🔄 Marking exercise ${exerciseId} as completed for current user...`
    );

    // Dispatch event for cross-component updates
    window.dispatchEvent(
      new CustomEvent("exerciseCompletionUpdated", {
        detail: { exerciseId, isCompleted: true },
      })
    );

    console.log(`✅ Exercise ${exerciseId} completion event dispatched`);
  } catch (error) {
    console.error(
      `❌ Error marking exercise ${exerciseId} as completed:`,
      error
    );
  }
};

/**
 * Force refresh completion status for current user
 */
export const forceRefreshCompletionStatus = async (): Promise<Set<number>> => {
  try {
    console.log("🔄 Force refreshing completion status for current user...");

    // Fetch fresh data from API
    const apiResults = await getCompletedExercisesFromAPI();

    return apiResults;
  } catch (error) {
    console.error("❌ Error force refreshing:", error);
    return new Set();
  }
};

/**
 * Clear completed exercises (used in logout) - no localStorage to clear
 */
export const clearCompletedExercises = (): void => {
  try {
    console.log(
      "✅ User logout - completion data will be fetched fresh on next login"
    );

    // Dispatch event to clear in-memory data
    window.dispatchEvent(
      new CustomEvent("userLoggedOut", {
        detail: { clearCompletionData: true },
      })
    );
  } catch (error) {
    console.error("❌ Error clearing completed exercises:", error);
  }
};

/**
 * Check if exercise is completed by current user
 */
export const isExerciseCompleted = async (
  exerciseId: number
): Promise<boolean> => {
  try {
    const completedExercises = await getCompletedExercises();
    return completedExercises.has(exerciseId);
  } catch (error) {
    console.error("❌ Error checking exercise completion:", error);
    return false;
  }
};

/**
 * Get exercise result for current user
 */
export const getExerciseResult = async (exerciseId: number): Promise<any> => {
  try {
    console.log(`🔄 Fetching exercise result for exercise ${exerciseId}...`);
    const results = await exerciseService.getUserExerciseResults();
    const result = results.find((r) => r.exerciseId === exerciseId);
    return result || null;
  } catch (error) {
    console.error("❌ Error getting exercise result:", error);
    return null;
  }
};
