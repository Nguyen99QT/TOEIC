/**
 * ================================================================
 * LESSON SERVICE - API CALLS
 * ================================================================
 *
 * Service for managing lesson-related API calls
 */

import { Exercise, Lesson } from "../types";
import api from "./api";
import apiClient from "./apiClient";

// ✅ Helper function to process media URLs
const processLessonMediaUrls = (lesson: Lesson): Lesson => {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  // Process image URL
  if (lesson.imageUrl) {
    if (!lesson.imageUrl.startsWith("http")) {
      lesson.imageUrl = `${API_BASE_URL}/files/images/${lesson.imageUrl}`;
    }
  }

  // Process audio URL
  if (lesson.audioUrl) {
    if (!lesson.audioUrl.startsWith("http")) {
      // Normalize audio URL - add lessons/ prefix if missing
      let normalizedAudioUrl = lesson.audioUrl;
      if (!normalizedAudioUrl.startsWith("lessons/")) {
        normalizedAudioUrl = `lessons/${normalizedAudioUrl}`;
        if (process.env.NODE_ENV === "development") {
          console.log(
            "🔧 Adding lessons/ prefix to audio URL:",
            lesson.audioUrl,
            "→",
            normalizedAudioUrl
          );
        }
      }
      lesson.audioUrl = `${API_BASE_URL}/files/audio/${normalizedAudioUrl}`;
    }
  }

  // Only log in development and only once per lesson
  if (process.env.NODE_ENV === "development") {
    if (!lesson.imageUrl && !lesson.audioUrl) {
      console.warn(`📋 Lesson ${lesson.id} has no media files`);
    }
  }

  return lesson;
};

export const lessonService = {
  /**
   * Get all free lessons (public access)
   */
  getFreeLessons: async (): Promise<Lesson[]> => {
    try {
      const response = await api.get("/lessons/free");
      // Only log important events in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          "✅ Free lessons loaded:",
          response.data?.length || 0,
          "lessons"
        );
      }

      // Ensure we return an array
      if (!response.data) {
        console.warn("⚠️ No data in response");
        return [];
      }

      if (!Array.isArray(response.data)) {
        console.warn("⚠️ Response data is not an array:", response.data);
        return [];
      }

      // ✅ Process media URLs for each lesson
      return response.data.map((lesson: Lesson) =>
        processLessonMediaUrls(lesson)
      );
    } catch (error: any) {
      console.error("❌ Error fetching free lessons:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  /**
   * Get all lessons (requires authentication)
   */
  getAllLessons: async (): Promise<Lesson[]> => {
    try {
      const response = await api.get("/lessons");
      // Only log important events in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          "✅ All lessons loaded:",
          response.data?.length || 0,
          "lessons"
        );
      }

      // Ensure we return an array
      if (!response.data) {
        console.warn("⚠️ No data in response");
        return [];
      }

      if (!Array.isArray(response.data)) {
        console.warn("⚠️ Response data is not an array:", response.data);
        return [];
      }

      // ✅ Process media URLs for each lesson
      return response.data.map((lesson: Lesson) =>
        processLessonMediaUrls(lesson)
      );
    } catch (error: any) {
      console.error("❌ Error fetching all lessons:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  /**
   * Get lesson by ID (free or authenticated based on lesson)
   */
  getLessonById: async (id: number): Promise<Lesson> => {
    // First, try to find the lesson in window.allLessons (cache) before making API call
    if (window && (window as any).allLessons) {
      const found = (window as any).allLessons.find((l: Lesson) => l.id === id);
      if (found) return processLessonMediaUrls(found);
    }
    // If not found in cache, try API
    try {
      const response = await api.get(`/lessons/${id}`);
      if (response.data) return processLessonMediaUrls(response.data);
    } catch (error: any) {
      // If API fails, try cache again (for robustness)
      if (window && (window as any).allLessons) {
        const found = (window as any).allLessons.find(
          (l: Lesson) => l.id === id
        );
        if (found) return processLessonMediaUrls(found);
      }
      throw error;
    }
    throw new Error("Lesson not found");
  },

  /**
   * Get exercises for a lesson
   */
  getLessonExercises: async (lessonId: number): Promise<Exercise[]> => {
    try {
      const response = await api.get(`/lessons/${lessonId}/exercises`);
      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching exercises for lesson ${lessonId}:`, error);
      throw error;
    }
  },

  /**
   * Get specific exercise
   */
  getExercise: async (
    lessonId: number,
    exerciseId: number
  ): Promise<Exercise> => {
    try {
      const response = await api.get(
        `/lessons/${lessonId}/exercises/${exerciseId}`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `Error fetching exercise ${exerciseId} for lesson ${lessonId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get public lessons for homepage (limited)
   */
  getPublicLessons: async (limit: number = 4): Promise<Lesson[]> => {
    try {
      const response = await api.get(`/lessons/public?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching public lessons:", error);
      throw error;
    }
  },

  /**
   * Get all public lessons
   */
  getAllPublicLessons: async (): Promise<Lesson[]> => {
    try {
      const response = await api.get("/lessons/public/all");
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching all public lessons:", error);
      throw error;
    }
  },

  /**
   * Get user lesson progress
   */
  getUserLessonProgress: async (userId: number): Promise<LessonProgress[]> => {
    const res = await apiClient.get(`/users/${userId}/lessons/progress`);
    return res.data;
  },
};

export default lessonService;

export interface LessonProgress {
  lessonId: number;
  lessonTitle: string;
  progress: number; // %
  score?: number;
}
