import { Lesson } from "../types";
import api from "./api";

/**
 * ================================================================
 * LESSON SERVICE
 * ================================================================
 * Handles all lesson-related API calls
 */

const lessonService = {
  /**
   * Get public lessons for homepage (limited)
   */
  getPublicLessons: async (limit: number = 4): Promise<Lesson[]> => {
    try {
      console.log(`🔄 Fetching public lessons with limit: ${limit}...`);
      const response = await api.get(`/lessons/public?limit=${limit}`);
      console.log("✅ Public lessons API response:", response.data);
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
      console.log("🔄 Fetching all public lessons...");
      const response = await api.get("/lessons/public/all");
      console.log("✅ All public lessons API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching all public lessons:", error);
      throw error;
    }
  },

  /**
   * Get lesson by ID
   */
  getLessonById: async (id: number): Promise<Lesson> => {
    try {
      console.log(`🔄 Fetching lesson with id: ${id}...`);
      const response = await api.get(`/lessons/${id}`);
      console.log("✅ Lesson by ID API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error fetching lesson ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all lessons (for authenticated users)
   */
  getAllLessons: async (): Promise<Lesson[]> => {
    try {
      console.log("🔄 Fetching all lessons...");
      const response = await api.get("/lessons");
      console.log("✅ All lessons API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching all lessons:", error);
      throw error;
    }
  },
};

export default lessonService;
