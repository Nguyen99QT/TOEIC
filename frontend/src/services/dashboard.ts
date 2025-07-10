/**
 * ================================================================
 * DASHBOARD SERVICE - Tích hợp với Backend UserStats & UserActivity
 * ================================================================
 */

import { ApiResponse } from "../types";
import apiClient, { extractData, handleApiError } from "./api";

// ================================================================
// DASHBOARD TYPES - Khớp với Backend UserStats & UserActivity
// ================================================================

export interface UserStats {
  id: number;
  userId: number;
  lessonsCompleted: number;
  practiceTests: number;
  averageScore: number;
  studyStreak: number;
  totalStudyTime: number; // in minutes
  totalFlashcardsStudied: number;
  highestScore: number;
  lastStudyDate: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface UserActivity {
  id: number;
  userId: number;
  type:
    | "LESSON_COMPLETED"
    | "PRACTICE_TEST"
    | "FLASHCARD_STUDY"
    | "EXERCISE_COMPLETED"
    | "ACHIEVEMENT_EARNED"
    | "LOGIN"
    | "STREAK_MILESTONE"
    | "SCORE_IMPROVEMENT"
    | "QUESTION_ANSWERED";
  title: string;
  description: string;
  score?: number;
  durationMinutes?: number;
  pointsEarned: number;
  lessonId?: number;
  flashcardSetId?: number;
  exerciseId?: number;
  createdAt: string;
  isActive: boolean;
}

export interface DashboardData {
  userStats: UserStats;
  recentActivities: {
    activities: UserActivity[];
  };
  weeklyProgress: {
    weeklyProgress: {
      day: string;
      score: number;
      activitiesCount: number;
    }[];
  };
}

// Legacy interfaces for compatibility
export interface DashboardStats {
  lessonsCompleted: number;
  practiceTests: number;
  averageScore: number;
  weeklyProgress: {
    lessonsThisWeek: number;
    testsThisWeek: number;
    scoreImprovement: number;
  };
  recentActivity: RecentActivity[];
  studyStreak: number;
  totalStudyTime: number;
}

export interface RecentActivity {
  id: number;
  type: "lesson" | "test" | "flashcard" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  duration?: number;
}

export interface LearningProgress {
  totalLessons: number;
  completedLessons: number;
  totalTests: number;
  completedTests: number;
  averageTestScore: number;
  bestScore: number;
  progressPercentage: number;
}

export interface StudyTimeAnalytics {
  dailyStudyTime: { date: string; minutes: number }[];
  weeklyTotal: number;
  monthlyTotal: number;
  averageDailyTime: number;
}

// ================================================================
// MAIN DASHBOARD API METHODS
// ================================================================

/**
 * Get complete dashboard data for current user
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      "/dashboard"
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    console.warn(
      "Dashboard API error, using fallback data:",
      errorInfo.message
    );

    // Fallback data matching backend structure
    return {
      userStats: {
        id: 1,
        userId: 1,
        lessonsCompleted: 25,
        practiceTests: 8,
        averageScore: 78.5,
        studyStreak: 12,
        totalStudyTime: 1250,
        totalFlashcardsStudied: 180,
        highestScore: 92,
        lastStudyDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      recentActivities: {
        activities: [
          {
            id: 1,
            userId: 1,
            type: "EXERCISE_COMPLETED",
            title: "Completed: Business English Exercise",
            description: "Score: 8/10 (80.0%)",
            score: 80,
            durationMinutes: 15,
            pointsEarned: 40,
            exerciseId: 1,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
          {
            id: 2,
            userId: 1,
            type: "LESSON_COMPLETED",
            title: "Completed: Grammar Fundamentals",
            description: "Score: 9/10 (90.0%)",
            score: 90,
            durationMinutes: 25,
            pointsEarned: 50,
            lessonId: 1,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
          {
            id: 3,
            userId: 1,
            type: "FLASHCARD_STUDY",
            title: "Studied TOEIC Vocabulary",
            description: "Reviewed 20 flashcards",
            durationMinutes: 10,
            pointsEarned: 20,
            flashcardSetId: 1,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
        ],
      },
      weeklyProgress: {
        weeklyProgress: [
          { day: "Mon", score: 75, activitiesCount: 3 },
          { day: "Tue", score: 82, activitiesCount: 2 },
          { day: "Wed", score: 78, activitiesCount: 4 },
          { day: "Thu", score: 85, activitiesCount: 1 },
          { day: "Fri", score: 90, activitiesCount: 3 },
          { day: "Sat", score: 88, activitiesCount: 2 },
          { day: "Sun", score: 92, activitiesCount: 1 },
        ],
      },
    };
  }
};

/**
 * Get dashboard statistics for current user - Updated to use new backend
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const dashboardData = await getDashboardData();

    // Convert new format to legacy format for compatibility
    return {
      lessonsCompleted: dashboardData.userStats.lessonsCompleted,
      practiceTests: dashboardData.userStats.practiceTests,
      averageScore: dashboardData.userStats.averageScore,
      weeklyProgress: {
        lessonsThisWeek: dashboardData.weeklyProgress.weeklyProgress.reduce(
          (sum: number, day: any) => sum + day.activitiesCount,
          0
        ),
        testsThisWeek: dashboardData.userStats.practiceTests,
        scoreImprovement: Math.max(
          0,
          dashboardData.userStats.averageScore - 70
        ),
      },
      recentActivity: dashboardData.recentActivities.activities.map(
        (activity: UserActivity) => ({
          id: activity.id,
          type:
            activity.type === "LESSON_COMPLETED"
              ? "lesson"
              : activity.type === "PRACTICE_TEST"
              ? "test"
              : activity.type === "FLASHCARD_STUDY"
              ? "flashcard"
              : "achievement",
          title: activity.title,
          description: activity.description,
          timestamp: activity.createdAt,
          score: activity.score,
          duration: activity.durationMinutes,
        })
      ),
      studyStreak: dashboardData.userStats.studyStreak,
      totalStudyTime: dashboardData.userStats.totalStudyTime,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);

    // Fallback data
    return {
      lessonsCompleted: 12,
      practiceTests: 8,
      averageScore: 825,
      weeklyProgress: {
        lessonsThisWeek: 2,
        testsThisWeek: 1,
        scoreImprovement: 15,
      },
      recentActivity: [
        {
          id: 1,
          type: "lesson",
          title: "TOEIC Listening Part 1",
          description: "Completed lesson with 95% accuracy",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          score: 95,
          duration: 25,
        },
        {
          id: 2,
          type: "test",
          title: "Practice Test 3",
          description: "Scored 850 points",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          score: 850,
          duration: 120,
        },
      ],
      studyStreak: 7,
      totalStudyTime: 320,
    };
  }
};

/**
 * Get detailed learning progress
 */
export const getLearningProgress = async (): Promise<LearningProgress> => {
  try {
    const response = await apiClient.get<ApiResponse<LearningProgress>>(
      "/dashboard/progress"
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    console.error("Failed to fetch learning progress:", errorInfo.message);

    return {
      totalLessons: 50,
      completedLessons: 12,
      totalTests: 20,
      completedTests: 8,
      averageTestScore: 825,
      bestScore: 890,
      progressPercentage: 24,
    };
  }
};

/**
 * Get study time analytics
 */
export const getStudyTimeAnalytics = async (): Promise<StudyTimeAnalytics> => {
  try {
    const response = await apiClient.get<ApiResponse<StudyTimeAnalytics>>(
      "/dashboard/analytics/study-time"
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    console.error("Failed to fetch study time analytics:", errorInfo.message);

    const today = new Date();
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dailyData.push({
        date: date.toISOString().split("T")[0],
        minutes: Math.floor(Math.random() * 120) + 30,
      });
    }

    return {
      dailyStudyTime: dailyData,
      weeklyTotal: dailyData.reduce((sum, day) => sum + day.minutes, 0),
      monthlyTotal: 2500,
      averageDailyTime: 85,
    };
  }
};

/**
 * Get recent activities with pagination
 */
export const getRecentActivities = async (
  limit: number = 10
): Promise<RecentActivity[]> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ activities: UserActivity[] }>
    >(`/dashboard/activities?limit=${limit}`);
    const data = extractData(response);

    // Convert UserActivity[] to RecentActivity[]
    return data.activities.map((activity: UserActivity) => ({
      id: activity.id,
      type:
        activity.type === "LESSON_COMPLETED"
          ? "lesson"
          : activity.type === "PRACTICE_TEST"
          ? "test"
          : activity.type === "FLASHCARD_STUDY"
          ? "flashcard"
          : "achievement",
      title: activity.title,
      description: activity.description,
      timestamp: activity.createdAt,
      score: activity.score,
      duration: activity.durationMinutes,
    }));
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    console.error("Failed to fetch recent activities:", errorInfo.message);

    return [
      {
        id: 1,
        type: "lesson",
        title: "TOEIC Listening Part 1",
        description: "Completed lesson with 95% accuracy",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        score: 95,
        duration: 25,
      },
      {
        id: 2,
        type: "test",
        title: "Practice Test 3",
        description: "Scored 850 points",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        score: 850,
        duration: 120,
      },
      {
        id: 3,
        type: "flashcard",
        title: "Business Vocabulary",
        description: "Studied 50 cards",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 15,
      },
    ];
  }
};

const dashboardService = {
  getDashboardData,
  getDashboardStats,
  getLearningProgress,
  getStudyTimeAnalytics,
  getRecentActivities,
};

export default dashboardService;
