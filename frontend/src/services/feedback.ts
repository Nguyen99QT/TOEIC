/**
 * ================================================================
 * FEEDBACK SERVICE
 * ================================================================
 * Service để xử lý API calls liên quan đến user feedback
 */

import { api } from "./api";

export interface FeedbackSubmission {
  lessonId: number;
  exerciseId?: number;
  rating: number;
  comment?: string;
}

export const feedbackService = {
  /**
   * Submit user feedback for a lesson or exercise
   */
  submitFeedback: async (feedback: FeedbackSubmission): Promise<any> => {
    console.log(`📝 Submitting feedback...`, feedback);

    try {
      const response = await api.post(`/exercises/feedback`, feedback);
      console.log("✅ Feedback submitted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      throw error;
    }
  },

  /**
   * Get feedback statistics for a lesson or exercise
   */
  getFeedbackStats: async (
    lessonId: number,
    exerciseId?: number
  ): Promise<any> => {
    console.log(`🔍 Fetching feedback stats...`);

    const endpoint = exerciseId
      ? `/feedback/stats?lessonId=${lessonId}&exerciseId=${exerciseId}`
      : `/feedback/stats?lessonId=${lessonId}`;

    try {
      const response = await api.get(endpoint);
      console.log("✅ Feedback stats loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching feedback stats:", error);
      throw error;
    }
  },
};

export default feedbackService;
