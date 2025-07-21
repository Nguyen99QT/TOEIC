/**
 * ================================================================
 * USE EXERCISE COMPLETION HOOK
 * ================================================================
 * Custom hook để quản lý exercise completion cho từng user riêng biệt
 */

import { useEffect, useState, useCallback } from "react";
import { getCompletedExercises } from "../services/exerciseProgress";
import { useAuth } from "../contexts/AuthContext";

export const useExerciseCompletion = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshCompletionStatus = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      console.log("🔍 User not authenticated - clearing completion data");
      setCompletedExercises(new Set());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(
        `🔄 Refreshing completion status for user: ${currentUser.username}`
      );

      const completed = await getCompletedExercises();
      setCompletedExercises(completed);

      console.log(
        `✅ Completion status updated for ${currentUser.username}:`,
        completed
      );
    } catch (error) {
      console.error("❌ Error refreshing completion status:", error);
      setCompletedExercises(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // Refresh when user changes
  useEffect(() => {
    refreshCompletionStatus();
  }, [refreshCompletionStatus]);

  // Listen for completion events
  useEffect(() => {
    const handleCompletionUpdate = (event: CustomEvent) => {
      if (!isAuthenticated || !currentUser) return;

      console.log(
        `🔄 Received completion update for user ${currentUser.username}:`,
        event.detail
      );
      const { exerciseId, isCompleted } = event.detail;

      if (isCompleted) {
        setCompletedExercises((prev) => new Set(prev).add(exerciseId));
      }
    };

    const handleUserLogout = () => {
      console.log("🔄 User logged out - clearing completion data");
      setCompletedExercises(new Set());
    };

    window.addEventListener(
      "exerciseCompletionUpdated",
      handleCompletionUpdate as EventListener
    );
    window.addEventListener("userLoggedOut", handleUserLogout as EventListener);

    return () => {
      window.removeEventListener(
        "exerciseCompletionUpdated",
        handleCompletionUpdate as EventListener
      );
      window.removeEventListener(
        "userLoggedOut",
        handleUserLogout as EventListener
      );
    };
  }, [isAuthenticated, currentUser]);

  const isExerciseCompleted = useCallback(
    (exerciseId: number): boolean => {
      return completedExercises.has(exerciseId);
    },
    [completedExercises]
  );

  return {
    completedExercises,
    isLoading,
    refreshCompletionStatus,
    isExerciseCompleted,
    currentUser: currentUser?.username || null,
  };
};
