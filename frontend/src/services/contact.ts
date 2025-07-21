import apiClient from './apiClient';

// ========================================
// CONTACT TYPES AND INTERFACES
// ========================================

export interface ContactRequest {
  subject: string;
  content: string;
  contactType: 'GENERAL' | 'BUG_REPORT' | 'FEATURE_REQUEST' | 'TECHNICAL_ISSUE' | 'CONTENT_REQUEST' | 'ACCOUNT_ISSUE' | 'PAYMENT_ISSUE' | 'SUGGESTION' | 'COMPLAINT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isAnonymous?: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ContactDto {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  subject: string;
  content: string;
  contactType: string;
  priority: string;
  status: string;
  isAnonymous: boolean;
  contactEmail?: string;
  contactPhone?: string;
  adminResponse?: string;
  respondedBy?: number;
  respondedByUserName?: string;
  respondedAt?: string;
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canRespond?: boolean;
}

export interface AdminResponseRequest {
  adminResponse: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export interface ContactResponse {
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
// EXERCISE FEEDBACK TYPES (Keep existing)
// ========================================

export interface ExerciseFeedbackData {
  lessonId: number;
  exerciseId: number;
  rating: number;
  comment?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ========================================
// CONTACT UTILITIES
// ========================================

export const contactUtils = {
  /**
   * Get color class for priority
   */
  getPriorityColor: (priority: string): string => {
    switch (priority.toUpperCase()) {
      case 'URGENT': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  },

  /**
   * Get badge color for status
   */
  getStatusColor: (status: string): string => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'yellow';
      case 'IN_PROGRESS': return 'blue';
      case 'RESOLVED': return 'green';
      case 'CLOSED': return 'gray';
      default: return 'gray';
    }
  },

  /**
   * Format contact type for display
   */
  formatContactType: (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'GENERAL': 'Chung',
      'BUG_REPORT': 'Báo cáo lỗi',
      'FEATURE_REQUEST': 'Yêu cầu tính năng',
      'TECHNICAL_ISSUE': 'Vấn đề kỹ thuật',
      'CONTENT_REQUEST': 'Yêu cầu nội dung',
      'ACCOUNT_ISSUE': 'Vấn đề tài khoản',
      'PAYMENT_ISSUE': 'Vấn đề thanh toán',
      'SUGGESTION': 'Đề xuất',
      'COMPLAINT': 'Khiếu nại',
      'OTHER': 'Khác'
    };
    return typeMap[type.toUpperCase()] || type;
  },

  /**
   * Format priority for display
   */
  formatPriority: (priority: string): string => {
    const priorityMap: { [key: string]: string } = {
      'LOW': 'Thấp',
      'MEDIUM': 'Trung bình',
      'HIGH': 'Cao',
      'URGENT': 'Khẩn cấp'
    };
    return priorityMap[priority.toUpperCase()] || priority;
  },

  /**
   * Format status for display
   */
  formatStatus: (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Đang chờ',
      'IN_PROGRESS': 'Đang xử lý',
      'RESOLVED': 'Đã giải quyết',
      'CLOSED': 'Đã đóng'
    };
    return statusMap[status.toUpperCase()] || status;
  }
};

// ========================================
// SERVICE IMPLEMENTATION
// ========================================

export const contactService = {
  // ========================================
  // EXERCISE FEEDBACK (Keep existing)
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
   * Legacy method for backward compatibility
   */
  submitFeedback: async (feedbackData: ExerciseFeedbackData): Promise<FeedbackResponse> => {
    return contactService.submitExerciseFeedback(feedbackData);
  },

  // ========================================
  // CONTACT SYSTEM (New)
  // ========================================

  /**
   * Create new contact
   */
  createContact: async (contactData: ContactRequest): Promise<ContactResponse> => {
    try {
      const response = await apiClient.post('/api/contact', contactData);
      return {
        success: true,
        message: 'Contact submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit contact'
      };
    }
  },

  /**
   * Update contact
   */
  updateContact: async (contactId: number, contactData: ContactRequest): Promise<ContactResponse> => {
    try {
      const response = await apiClient.put(`/api/contact/${contactId}`, contactData);
      return {
        success: true,
        message: 'Contact updated successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contact'
      };
    }
  },

  /**
   * Delete contact
   */
  deleteContact: async (contactId: number): Promise<ContactResponse> => {
    try {
      await apiClient.delete(`/api/contact/${contactId}`);
      return {
        success: true,
        message: 'Contact deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contact'
      };
    }
  },

  /**
   * Get contact by ID
   */
  getContactById: async (contactId: number): Promise<ContactDto> => {
    try {
      const response = await apiClient.get(`/api/contact/${contactId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contact');
    }
  },

  /**
   * Get my contacts
   */
  getMyContacts: async (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc'): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/my', {
        params: { page, size, sortBy, sortDirection }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contacts');
    }
  },

  // ========================================
  // ADMIN CONTACT OPERATIONS
  // ========================================

  /**
   * Get all contacts (admin only)
   */
  getAllContacts: async (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc'): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/admin/all', {
        params: { page, size, sortBy, sortDirection }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get all contacts');
    }
  },

  /**
   * Get contacts by status (admin only)
   */
  getContactsByStatus: async (status: string, page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get(`/api/contact/admin/status/${status}`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contacts by status');
    }
  },

  /**
   * Get contacts by priority (admin only)
   */
  getContactsByPriority: async (priority: string, page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get(`/api/contact/admin/priority/${priority}`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contacts by priority');
    }
  },

  /**
   * Get contacts by type (admin only)
   */
  getContactsByType: async (contactType: string, page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get(`/api/contact/admin/type/${contactType}`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contacts by type');
    }
  },

  /**
   * Get pending contacts (admin only)
   */
  getPendingContacts: async (page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/admin/pending', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pending contacts');
    }
  },

  /**
   * Get urgent contacts (admin only)
   */
  getUrgentContacts: async (page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/admin/urgent', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get urgent contacts');
    }
  },

  /**
   * Get contacts needing response (admin only)
   */
  getContactsNeedingResponse: async (page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/admin/needing-response', {
        params: { page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contacts needing response');
    }
  },

  /**
   * Respond to contact (admin only)
   */
  respondToContact: async (contactId: number, responseData: AdminResponseRequest): Promise<ContactResponse> => {
    try {
      const response = await apiClient.post(`/api/contact/admin/${contactId}/respond`, responseData);
      return {
        success: true,
        message: 'Response submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to respond to contact'
      };
    }
  },

  /**
   * Update contact status (admin only)
   */
  updateContactStatus: async (contactId: number, status: string): Promise<ContactResponse> => {
    try {
      const response = await apiClient.put(`/api/contact/admin/${contactId}/status`, null, {
        params: { status }
      });
      return {
        success: true,
        message: 'Contact status updated successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contact status'
      };
    }
  },

  /**
   * Search contacts (admin only)
   */
  searchContacts: async (searchTerm: string, page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/admin/search', {
        params: { searchTerm, page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search contacts');
    }
  },

  /**
   * Filter contacts (admin only)
   */
  filterContacts: async (status?: string, priority?: string, contactType?: string, page = 0, size = 10): Promise<PaginatedResponse<ContactDto>> => {
    try {
      const response = await apiClient.get('/api/contact/admin/filter', {
        params: { status, priority, contactType, page, size }
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to filter contacts');
    }
  },

  /**
   * Get contact statistics (admin only)
   */
  getContactStatistics: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/api/contact/admin/statistics');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get contact statistics');
    }
  }
};

// Legacy exports for backward compatibility
export const feedbackService = contactService;
export type FeedbackRequest = ContactRequest;
export type FeedbackDto = ContactDto;
export const feedbackUtils = contactUtils; 