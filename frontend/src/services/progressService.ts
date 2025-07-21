/**
 * ================================================================
 * USER PROGRESS SERVICE
 * ================================================================
 * Service để quản lý progress của user cho lessons và exercises
 */

import { UserProgressDto } from "../types";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

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
  private getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  /**
   * Lấy tất cả progress của user
   */
  async getUserProgress(userId: number): Promise<UserProgressDto[]> {
    try {
      const response = await fetch(`${API_BASE}/api/progress/user/${userId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user progress: ${response.statusText}`
        );
      }

      return await response.json();
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
      const response = await fetch(
        `${API_BASE}/api/progress/user/${userId}/completed`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch completed lessons: ${response.statusText}`
        );
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE}/api/progress/update`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: new URLSearchParams({
          userId: userId.toString(),
          lessonId: lessonId.toString(),
          progressPercentage: progressPercentage.toString(),
          timeSpent: timeSpent.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.statusText}`);
      }

      return await response.json();
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
    try {
      console.log(`🎯 Marking lesson ${lessonId} as completed for user ${userId}`);
      
      const response = await fetch(`${API_BASE}/api/lessons/${lessonId}/complete?timeSpent=${timeSpent}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to mark lesson as completed: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log(`✅ Lesson ${lessonId} marked as completed successfully`);
      
      return result.progress; // Backend returns progress in result.progress
    } catch (error) {
      console.error("❌ Error marking lesson as completed:", error);
      throw error;
    }
  }

  /**
   * Lấy số lượng lessons đã hoàn thành
   */
  async getCompletedLessonsCount(userId: number): Promise<number> {
    try {
      const response = await fetch(
        `${API_BASE}/api/progress/user/${userId}/stats/completed-count`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch completed lessons count: ${response.statusText}`
        );
      }

      return await response.json();
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
      const response = await fetch(
        `${API_BASE}/api/progress/user/${userId}/stats/average-progress`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch average progress: ${response.statusText}`
        );
      }

      return await response.json();
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
      const response = await fetch(
        `${API_BASE}/api/progress/user/${userId}/stats/total-time`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch total time spent: ${response.statusText}`
        );
      }

      return await response.json();
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
