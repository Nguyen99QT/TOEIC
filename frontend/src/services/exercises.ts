/**
 * ================================================================
 * EXERCISE SERVICE
 * ================================================================
 * Service để xử lý API calls liên quan đến exercises
 */

import { Exercise } from "../types";
import { api } from "./api";

export interface ExerciseSubmissionData {
  exerciseId: number;
  lessonId: number;
  timeTaken: number;
  answers: {
    questionId: number;
    selectedAnswer: string;
    timeTaken?: number;
    isConfident?: boolean;
    userNote?: string;
  }[];
}

export const exerciseService = {
  /**
   * Lấy danh sách exercises của một lesson
   */
  getExercisesByLessonId: async (lessonId: number): Promise<Exercise[]> => {
    console.log(`🔄 Fetching exercises for lesson ${lessonId}...`);

    try {
      const response = await api.get(`/lessons/${lessonId}/exercises`);
      console.log(
        `✅ Exercises fetched for lesson ${lessonId}:`,
        response.data.length
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching exercises for lesson ${lessonId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết của một exercise
   */
  getExerciseById: async (exerciseId: number): Promise<Exercise> => {
    console.log(`🔍 Fetching exercise ${exerciseId}...`);

    try {
      const response = await api.get(`/exercises/${exerciseId}`);
      console.log("✅ Exercise loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching exercise:", error);
      throw error;
    }
  },

  /**
   * Submit kết quả exercise
   */
  submitExerciseResult: async (data: ExerciseSubmissionData): Promise<any> => {
    console.log(
      `📊 Submitting exercise result for exercise ${data.exerciseId}...`
    );
    console.log("🔍 Submission data:", data);

    try {
      const response = await api.post(
        `/exercises/${data.exerciseId}/submit`,
        data
      );
      console.log("✅ Exercise result submitted successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error submitting exercise result:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw error;
    }
  },

  /**
   * Lấy lịch sử kết quả exercises của user
   */
  getUserExerciseHistory: async (userId: number): Promise<any[]> => {
    console.log(`📚 Fetching exercise history for user ${userId}...`);

    try {
      const response = await api.get(`/users/${userId}/exercise-history`);
      console.log("✅ Exercise history loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching exercise history:", error);
      throw error;
    }
  },

  /**
   * Lấy kết quả exercises đã hoàn thành của user hiện tại
   */
  getUserExerciseResults: async (): Promise<any[]> => {
    console.log(`📊 Fetching user exercise results...`);

    try {
      const response = await api.get("/user/exercise-results");
      console.log("✅ User exercise results loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user exercise results:", error);
      throw error;
    }
  },

  /**
   * Lấy kết quả chi tiết của một exercise cụ thể
   */
  getExerciseResult: async (exerciseId: number): Promise<any> => {
    console.log(`📊 Fetching exercise result for exercise ${exerciseId}...`);

    try {
      const response = await api.get(`/exercises/${exerciseId}/result`);
      console.log("✅ Exercise result loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching exercise result:", error);
      throw error;
    }
  },
};
