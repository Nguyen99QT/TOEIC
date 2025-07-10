/**
 * ================================================================
 * EXERCISE SERVICE
 * ================================================================
 * Service để xử lý API calls liên quan đến exercises
 */

import { Exercise } from '../types';
import { api } from './api';

export interface ExerciseSubmissionData {
    exerciseId: number;
    answers: {
        questionId: number;
        selectedAnswer: string;
    }[];
    score: number;
    completedAt: string;
}

export const exerciseService = {
    /**
     * Lấy thông tin chi tiết của một exercise
     */
    getExerciseById: async (exerciseId: number): Promise<Exercise> => {
        console.log(`🔍 Fetching exercise ${exerciseId}...`);
        
        try {
            const response = await api.get(`/exercises/${exerciseId}`);
            console.log('✅ Exercise loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching exercise:', error);
            throw error;
        }
    },

    /**
     * Submit kết quả exercise
     */
    submitExerciseResult: async (data: ExerciseSubmissionData): Promise<any> => {
        console.log(`📊 Submitting exercise result for exercise ${data.exerciseId}...`);
        
        try {
            const response = await api.post('/exercises/submit', data);
            console.log('✅ Exercise result submitted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error submitting exercise result:', error);
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
            console.log('✅ Exercise history loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching exercise history:', error);
            throw error;
        }
    }
};
