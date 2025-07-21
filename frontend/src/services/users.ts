/**
 * ================================================================
 * USER SERVICE
 * ================================================================
 *
 * Handles user-related API operations
 * Implements RBAC authorization checks
 */

import {
  ApiResponse,
  DifficultyLevel,
  Gender,
  PaginatedResponse,
  Role,
  User,
} from "../types";
import apiClient, {
  buildQueryParams,
  extractData,
  handleApiError,
} from "./api";

// ========== USER CRUD OPERATIONS ==========

/**
 * Get all users with pagination and filtering (ADMIN only)
 */
export const getUsers = async (params: {
  page?: number;
  size?: number;
  search?: string;
  role?: Role;
  isActive?: boolean;
}): Promise<PaginatedResponse<User>> => {
  try {
    const queryParams = buildQueryParams(params);
    const response = await apiClient.get<PaginatedResponse<User>>(
      `/api/users${queryParams}`
    );
    // Backend returns Page object directly, not ApiResponse<Page>
    return response.data;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await apiClient.get<any>(`/api/users/${id}`);
    const userData = response.data;
    
    // Map backend properties to frontend expected properties (same as getUserProfile)
    const mappedUser: User = {
      ...userData,
      firstName: userData.firstName || userData.fullName?.split(' ')[0] || '',
      lastName: userData.lastName || userData.fullName?.split(' ').slice(1).join(' ') || '',
      phoneNumber: userData.phoneNumber || userData.phone,
      profilePicture: userData.profilePicture || userData.profilePictureUrl,
      registrationDate: userData.registrationDate || userData.createdAt,
      lastLoginDate: userData.lastLoginDate || userData.lastLogin,
      birthDate: userData.birthDate || userData.dateOfBirth
    };
    
    return mappedUser;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Update user profile with comprehensive information
 */
export const updateUserProfile = async (
  profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: Gender;
    country?: string;
    profilePictureUrl?: string;
  }
): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/profile`,
      profileData
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Change user password
 */
export const changePassword = async (
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(
      `/users/password`,
      passwordData
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Update user (legacy method for backward compatibility)
 * Users can only update their own profile, admins can update any user
 */
export const updateUser = async (
  id: number,
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: Gender;
    birthDate?: string;
    phoneNumber?: string;
    address?: string;
    targetScore?: number;
    currentLevel?: DifficultyLevel;
    profilePicture?: string;
  }
): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      userData
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Update user role (ADMIN only)
 */
export const updateUserRole = async (id: number, role: Role): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}/role`,
      { role }
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Activate/deactivate user (ADMIN only)
 */
export const toggleUserStatus = async (
  id: number,
  isActive: boolean
): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}/status`,
      { isActive }
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Delete user (ADMIN only)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== USER SEARCH AND FILTERING ==========

/**
 * Search users by name or email
 */
export const searchUsers = async (
  query: string,
  limit: number = 10
): Promise<User[]> => {
  try {
    const params = buildQueryParams({ q: query, limit });
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/users/search${params}`
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: Role): Promise<User[]> => {
  try {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/users/role/${role}`
    );
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== ENUM ENDPOINTS ==========

/**
 * Get all available enum values for dropdowns
 */
export const getEnums = async (): Promise<{
  roles: Array<{ value: Role; label: string }>;
  genders: Array<{ value: Gender; label: string }>;
  difficultyLevels: Array<{ value: DifficultyLevel; label: string }>;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>("/users/enums");
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== PROFILE PICTURE OPERATIONS ==========

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (
  id: number,
  file: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      `/api/users/${id}/profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const result = extractData(response);
    return result.url;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Delete profile picture
 */
export const deleteProfilePicture = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<void>>(`/users/${id}/profile-picture`);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== USER STATISTICS ==========

/**
 * Get user learning statistics
 */
export const getUserStats = async (
  id: number
): Promise<{
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  registrationDate: string;
  lastLoginDate: string;
  skillBreakdown: any;
  partBreakdown: any;
}> => {
  try {
    // For now, return default stats since the backend endpoint doesn't exist
    // TODO: Implement proper stats endpoint in backend
    return {
      totalLessonsCompleted: 0,
      totalExercisesCompleted: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      registrationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      skillBreakdown: {},
      partBreakdown: {}
    };
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== BULK OPERATIONS ==========

/**
 * Bulk update users (ADMIN only)
 */
export const bulkUpdateUsers = async (
  userIds: number[],
  updates: {
    role?: Role;
    isActive?: boolean;
  }
): Promise<User[]> => {
  try {
    const response = await apiClient.put<ApiResponse<User[]>>("/users/bulk", {
      userIds,
      updates,
    });
    return extractData(response);
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Bulk delete users (ADMIN only)
 */
export const bulkDeleteUsers = async (userIds: number[]): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<void>>("/users/bulk", {
      data: { userIds },
    });
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== EXPORT OPERATIONS ==========

/**
 * Export users to CSV (ADMIN only)
 */
export const exportUsers = async (filters?: {
  role?: Role;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}): Promise<Blob> => {
  try {
    const queryParams = buildQueryParams(filters || {});
    const response = await apiClient.get(`/users/export${queryParams}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

// ========== VALIDATION UTILITIES ==========

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
      `/users/check-username?username=${encodeURIComponent(username)}`
    );
    const result = extractData(response);
    return result.available;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Check if email is available
 */
export const checkEmailAvailability = async (
  email: string
): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
      `/users/check-email?email=${encodeURIComponent(email)}`
    );
    const result = extractData(response);
    return result.available;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (id: number): Promise<User> => {
  try {
    const response = await apiClient.get<any>(`/api/users/${id}`);
    const userData = response.data;
    
    // Map backend properties to frontend expected properties
    const mappedUser: User = {
      ...userData,
      // Map fullName to firstName/lastName if they don't exist
      firstName: userData.firstName || userData.fullName?.split(' ')[0] || '',
      lastName: userData.lastName || userData.fullName?.split(' ').slice(1).join(' ') || '',
      // Map other backend properties
      phoneNumber: userData.phoneNumber || userData.phone,
      profilePicture: userData.profilePicture || userData.profilePictureUrl,
      registrationDate: userData.registrationDate || userData.createdAt,
      lastLoginDate: userData.lastLoginDate || userData.lastLogin,
      birthDate: userData.birthDate || userData.dateOfBirth
    };
    
    return mappedUser;
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    throw new Error(errorInfo.message);
  }
};


