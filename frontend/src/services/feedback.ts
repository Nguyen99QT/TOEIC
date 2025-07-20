/**
 * ================================================================
 * FEEDBACK SERVICE
 * ================================================================
 * Service để xử lý API calls liên quan đến user feedback và admin feedback
 */

import apiClient from './apiClient';

// ========================================
// EXERCISE FEEDBACK (Existing)
// ========================================

export interface ExerciseFeedbackData {
  exerciseId: number;
  rating: number;
  difficulty: string;
  comment: string;
  isHelpful: boolean;
}

// ========================================
// ADMIN FEEDBACK SYSTEM (New)
// ========================================

export interface FeedbackRequest {
  subject: string;
  content: string;
  feedbackType: 'GENERAL' | 'BUG_REPORT' | 'FEATURE_REQUEST' | 'TECHNICAL_ISSUE' | 'CONTENT_REQUEST' | 'ACCOUNT_ISSUE' | 'PAYMENT_ISSUE' | 'SUGGESTION' | 'COMPLAINT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isAnonymous?: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

export interface AdminResponseRequest {
  adminResponse: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export interface FeedbackDto {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  subject: string;
  content: string;
  feedbackType: string;
  priority: string;
  status: string;
  isAnonymous: boolean;
  contactEmail?: string;
  contactPhone?: string;
  adminResponse?: string;
  respondedBy?: number;
  respondedAt?: string;
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  isPositiveFeedback?: boolean;
  isNegativeFeedback?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canRespond: boolean;
}

export interface FeedbackStatistics {
  total: number;
  pending: number;
  urgent: number;
  resolved: number;
  closed: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  urgentPriority: number;
  bugReportCount: number;
  featureRequestCount: number;
  technicalIssueCount: number;
  generalCount: number;
  [key: string]: number;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ========================================
// SERVICE IMPLEMENTATION
// ========================================

export const feedbackService = {
  // ========================================
  // EXERCISE FEEDBACK (Existing)
  // ========================================

  /**
   * Submit feedback for an exercise
   */
  submitExerciseFeedback: async (feedbackData: ExerciseFeedbackData): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.post('/api/exercises/feedback', feedbackData);
      return {
        success: true,
        message: 'Feedback submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data || 'Failed to submit feedback'
      };
    }
  },

  /**
   * Get feedback statistics for an exercise (admin only)
   */
  getExerciseFeedbackStats: async (exerciseId: number): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/exercises/${exerciseId}/feedback/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to get feedback statistics');
    }
  },

  /**
   * Get all feedback for an exercise (admin only)
   */
  getExerciseFeedback: async (exerciseId: number, page = 0, size = 10): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/exercises/${exerciseId}/feedback`, {
        params: { page, size }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Failed to get exercise feedback');
    }
  },

  // ========================================
  // ADMIN FEEDBACK SYSTEM (New)
  // ========================================

  /**
   * Create new feedback
   */
  createFeedback: async (feedbackData: FeedbackRequest): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.post('/api/feedback', feedbackData);
      return {
        success: true,
        message: 'Feedback submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit feedback'
      };
    }
  },

  /**
   * Update feedback
   */
  updateFeedback: async (feedbackId: number, feedbackData: FeedbackRequest): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.put(`/api/feedback/${feedbackId}`, feedbackData);
      return {
        success: true,
        message: 'Feedback updated successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update feedback'
      };
    }
  },

  /**
   * Delete feedback
   */
  deleteFeedback: async (feedbackId: number): Promise<FeedbackResponse> => {
    try {
      await apiClient.delete(`/api/feedback/${feedbackId}`);
      return {
        success: true,
        message: 'Feedback deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete feedback'
      };
    }
  },

  /**
   * Get feedback by ID
   */
  getFeedbackById: async (feedbackId: number): Promise<FeedbackDto> => {
    try {
      const response = await apiClient.get(`/api/feedback/${feedbackId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback');
    }
  },

  /**
   * Get user's own feedback
   */
  getMyFeedback: async (page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/my', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get your feedback');
    }
  },

  // ========================================
  // ADMIN OPERATIONS
  // ========================================

  /**
   * Get all feedback (admin only)
   */
  getAllFeedback: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/all', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get all feedback');
    }
  },

  /**
   * Get feedback by status (admin only)
   */
  getFeedbackByStatus: async (status: string, page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get(`/api/feedback/admin/status/${status}`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback by status');
    }
  },

  /**
   * Get feedback by priority (admin only)
   */
  getFeedbackByPriority: async (priority: string, page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get(`/api/feedback/admin/priority/${priority}`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback by priority');
    }
  },

  /**
   * Get feedback by type (admin only)
   */
  getFeedbackByType: async (feedbackType: string, page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get(`/api/feedback/admin/type/${feedbackType}`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback by type');
    }
  },

  /**
   * Get pending feedback (admin only)
   */
  getPendingFeedback: async (page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/pending', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pending feedback');
    }
  },

  /**
   * Get urgent feedback (admin only)
   */
  getUrgentFeedback: async (page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/urgent', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get urgent feedback');
    }
  },

  /**
   * Get feedback needing response (admin only)
   */
  getFeedbackNeedingResponse: async (page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/needing-response', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback needing response');
    }
  },

  /**
   * Respond to feedback (admin only)
   */
  respondToFeedback: async (feedbackId: number, responseData: AdminResponseRequest): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.put(`/api/feedback/admin/${feedbackId}/respond`, responseData);
      return {
        success: true,
        message: 'Response sent successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to respond to feedback'
      };
    }
  },

  /**
   * Update feedback status (admin only)
   */
  updateFeedbackStatus: async (feedbackId: number, status: string): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.put(`/api/feedback/admin/${feedbackId}/status`, null, {
        params: { status }
      });
      return {
        success: true,
        message: 'Feedback status updated successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update feedback status'
      };
    }
  },

  /**
   * Search feedback (admin only)
   */
  searchFeedback: async (searchTerm: string, page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/search', {
        params: { searchTerm, page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search feedback');
    }
  },

  /**
   * Filter feedback by criteria (admin only)
   */
  filterFeedback: async (status?: string, priority?: string, feedbackType?: string, page = 0, size = 10): Promise<PaginatedResponse<FeedbackDto>> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/filter', {
        params: { status, priority, feedbackType, page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to filter feedback');
    }
  },

  // ========================================
  // STATISTICS
  // ========================================

  /**
   * Get feedback statistics (admin only)
   */
  getFeedbackStatistics: async (): Promise<FeedbackStatistics> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/statistics');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback statistics');
    }
  },

  /**
   * Get recent feedback (admin only)
   */
  getRecentFeedback: async (limit = 5): Promise<FeedbackDto[]> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/recent', {
        params: { limit }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get recent feedback');
    }
  },

  /**
   * Get feedback count by status (admin only)
   */
  getFeedbackCountByStatus: async (status: string): Promise<number> => {
    try {
      const response = await apiClient.get(`/api/feedback/admin/count/status/${status}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get feedback count by status');
    }
  },

  /**
   * Get urgent feedback count (admin only)
   */
  getUrgentFeedbackCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/count/urgent');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get urgent feedback count');
    }
  },

  /**
   * Get pending feedback count (admin only)
   */
  getPendingFeedbackCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/api/feedback/admin/count/pending');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pending feedback count');
    }
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

export const feedbackUtils = {
  /**
   * Get priority color for UI
   */
  getPriorityColor: (priority: string): string => {
    switch (priority) {
      case 'URGENT': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  },

  /**
   * Get status color for UI
   */
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'IN_PROGRESS': return 'blue';
      case 'RESOLVED': return 'green';
      case 'CLOSED': return 'gray';
      default: return 'gray';
    }
  },

  /**
   * Get feedback type label
   */
  getFeedbackTypeLabel: (type: string): string => {
    switch (type) {
      case 'GENERAL': return 'General';
      case 'BUG_REPORT': return 'Bug Report';
      case 'FEATURE_REQUEST': return 'Feature Request';
      case 'TECHNICAL_ISSUE': return 'Technical Issue';
      case 'CONTENT_REQUEST': return 'Content Request';
      case 'ACCOUNT_ISSUE': return 'Account Issue';
      case 'PAYMENT_ISSUE': return 'Payment Issue';
      case 'SUGGESTION': return 'Suggestion';
      case 'COMPLAINT': return 'Complaint';
      case 'OTHER': return 'Other';
      default: return type;
    }
  },

  /**
   * Format date for display
   */
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
