import { Question } from '../types';
import { normalizeQuestion, validateQuestionData } from '../utils/questionHelpers';
import apiClient from './apiClient'; // Default import instead of named import

export const questionService = {
  async getQuestionsByExercise(exerciseId: number): Promise<Question[]> {
    try {
      console.log(`🔍 Fetching questions for exercise ${exerciseId}...`);
      
      const response = await apiClient.get(`/exercises/${exerciseId}/questions`);
      console.log('✅ Raw questions response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid questions data format');
      } 
      
      // Normalize and validate questions with proper typing
      const normalizedQuestions = response.data
        .map((rawQuestion: any) => normalizeQuestion(rawQuestion))
        .filter((question: Question) => validateQuestionData(question))
        .sort((a: Question, b: Question) => (a.questionOrder || 0) - (b.questionOrder || 0));
      
      console.log(`✅ Loaded ${normalizedQuestions.length} valid questions`);
      return normalizedQuestions;
      
    } catch (error: any) {
      console.error('❌ Error fetching questions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
  },

  

  async getQuestionById(questionId: number): Promise<Question> {
    try {
      const response = await apiClient.get(`/questions/${questionId}`);
      const normalizedQuestion = normalizeQuestion(response.data);
      
      if (!validateQuestionData(normalizedQuestion)) {
        throw new Error('Invalid question data');
      }
      
      return normalizedQuestion;
    } catch (error: any) {
      console.error('❌ Error fetching question:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch question');
    }
  }
};