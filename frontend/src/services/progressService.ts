/**
 * ================================================================
 * USER PROGRESS SERVICE
 * ================================================================
 * Service để quản lý progress của user cho lessons và exercises
 */

import { UserProgressDto } from "../types";
import api from "./api";

export interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  overallProgress: number;
  completionRate: number;
  currentStreak: number;
  averageStudyTimeMinutes: number;
  totalTimeSpent: number;
  lastActivity: string;
}

class ProgressService {
  /**
   * Lấy tất cả progress của user
   */
  async getUserProgress(userId: number): Promise<UserProgressDto[]> {
    try {
      const response = await api.get(`/api/progress/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user progress:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách lessons đã completed
   */
  async getCompletedLessons(userId: number): Promise<UserProgressDto[]> {
    try {
      const response = await api.get(`/api/progress/user/${userId}/completed`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching completed lessons:", error);
      throw error;
    }
  }

  /**
   * Cập nhật progress cho một lesson
   */
  async updateProgress(
    userId: number,
    lessonId: number,
    progressPercentage: number,
    timeSpent: number
  ): Promise<UserProgressDto> {
    try {
      const formData = new URLSearchParams({
        userId: userId.toString(),
        lessonId: lessonId.toString(),
        progressPercentage: progressPercentage.toString(),
        timeSpent: timeSpent.toString(),
      });

      const response = await api.post("/api/progress/update", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error updating progress:", error);
      throw error;
    }
  }

  /**
   * Đánh dấu lesson là hoàn thành (100% progress)
   */
  async markLessonCompleted(
    userId: number,
    lessonId: number,
    timeSpent: number = 0
  ): Promise<UserProgressDto> {
    console.group("🎯 MARK LESSON COMPLETED - DETAILED DEBUG");
    console.log("Input parameters:", { userId, lessonId, timeSpent });

    // Check authentication state before making request
    const token =
      localStorage.getItem("toeic_access_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

    console.log("Auth token exists:", !!token);
    if (token) {
      console.log("Token preview:", token.substring(0, 20) + "...");

      // Check token expiry
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        console.log("Token payload user:", payload.username);
        console.log("Token expired:", payload.exp < now);
        console.log("Time remaining:", payload.exp - now, "seconds");

        // If token is expired, try to refresh or fail early
        if (payload.exp < now) {
          console.error(
            "🚨 TOKEN EXPIRED - Cannot proceed with lesson completion"
          );
          throw new Error(
            "Authentication token has expired. Please log in again."
          );
        }
      } catch (e) {
        console.error("Failed to parse token:", e);
        throw new Error("Invalid authentication token. Please log in again.");
      }
    } else {
      console.error("❌ NO AUTH TOKEN FOUND");
      throw new Error("No authentication token found. Please log in first.");
    }

    try {
      console.log(
        `🎯 Marking lesson ${lessonId} as completed for user ${userId}`
      );

      console.log(
        "🚀 Making API request to:",
        `/api/lessons/${lessonId}/complete?timeSpent=${timeSpent}`
      );

      const response = await api.post(
        `/api/lessons/${lessonId}/complete?timeSpent=${timeSpent}`,
        {} // Empty body since we're using query params
      );

      const result = response.data;
      console.log(
        `✅ Lesson ${lessonId} marked as completed successfully:`,
        result
      );
      console.groupEnd();

      return result.progress; // Backend returns progress in result.progress
    } catch (error: any) {
      console.error("❌ Error marking lesson as completed:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      // Check if this is an auth error
      if (error.response?.status === 401) {
        console.error("🚨 401 UNAUTHORIZED - AUTH FAILURE DETECTED");
        console.error("This will trigger redirect to login page");

        // Clear potentially invalid tokens
        localStorage.removeItem("toeic_access_token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");

        throw new Error("Authentication failed. Please log in again.");
      }

      console.groupEnd();
      throw error;
    }
  }

  /**
   * Lấy số lượng lessons đã hoàn thành
   */
  async getCompletedLessonsCount(userId: number): Promise<number> {
    try {
      const response = await api.get(
        `/api/progress/user/${userId}/stats/completed-count`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching completed lessons count:", error);
      throw error;
    }
  }

  /**
   * Lấy progress trung bình
   */
  async getAverageProgress(userId: number): Promise<number> {
    try {
      const response = await api.get(
        `/api/progress/user/${userId}/stats/average-progress`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching average progress:", error);
      throw error;
    }
  }

  /**
   * Lấy tổng thời gian học
   */
  async getTotalTimeSpent(userId: number): Promise<number> {
    try {
      const response = await api.get(
        `/api/progress/user/${userId}/stats/total-time`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching total time spent:", error);
      throw error;
    }
  }

  /**
   * Tạo map lesson ID -> progress percentage từ user progress data
   */
  createLessonProgressMap(
    userProgress: UserProgressDto[]
  ): Map<number, number> {
    const progressMap = new Map<number, number>();

    userProgress.forEach((progress) => {
      if (progress.lessonId && progress.progressPercentage) {
        progressMap.set(progress.lessonId, progress.progressPercentage);
      }
    });

    return progressMap;
  }

  /**
   * Tạo set các lesson IDs đã hoàn thành
   */
  createCompletedLessonsSet(userProgress: UserProgressDto[]): Set<number> {
    const completedSet = new Set<number>();

    userProgress.forEach((progress) => {
      if (progress.lessonId && progress.status === "COMPLETED") {
        completedSet.add(progress.lessonId);
      }
    });

    return completedSet;
  }
}

const progressService = new ProgressService();
export default progressService;
