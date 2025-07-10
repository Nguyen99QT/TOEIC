/**
 * ================================================================
 * LESSON SERVICE - API CALLS
 * ================================================================
 *
 * Service for managing lesson-related API calls
 */

import { Exercise, Lesson } from "../types";
import api from "./api";

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
    try {
      console.log(`🔍 Fetching lesson ${id}...`);
      // Try free endpoint first
      const response = await api.get(`/lessons/free/${id}`);

      // ✅ Process media URLs
      const lesson = response.data;
      return processLessonMediaUrls(lesson);
    } catch (error: any) {
      // If free fails, try authenticated endpoint
      if (error.response?.status === 404 || error.response?.status === 403) {
        try {
          const response = await api.get(`/lessons/${id}`);

          // ✅ Process media URLs
          const lesson = response.data;
          return processLessonMediaUrls(lesson);
        } catch (authError: any) {
          console.error(`❌ Error fetching lesson ${id}:`, authError);
          throw authError;
        }
      }
      console.error(`❌ Error fetching lesson ${id}:`, error);
      throw error;
    }
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
};

export default lessonService;
