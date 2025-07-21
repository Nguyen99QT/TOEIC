/**
 * ================================================================
 * TEST SERVICE
 * ================================================================
 * Service để xử lý API calls liên quan đến TOEIC tests
 */

import { api } from "./api";

export interface TestGenerateRequest {
  userId: number;
  title: string;
  description: string;
  partQuestionCount: { [key: number]: number }; // Part number -> question count
}

export interface Test {
  testId: number;
  title: string;
  description: string;
  createdAt: string;
  createdBy: {
    id: number;
    username: string;
  };
}

export interface TestQuestion {
  questionId: number;
  questionText: string;
  partNumber: number;
  questionOrder: number;
  audioUrl?: string;
  imageUrl?: string;
  options: {
    label: string;
    content: string;
  }[];
}

export interface TestSubmission {
  userId: number;
  testId: number;
  answers: {
    questionId: number;
    selectedOption: string;
  }[];
}

export interface TestResult {
  resultId: number;
  testTitle: string;
  user: string;
  scoreListen: number;
  scoreRead: number;
  questions: {
    id: number;
    part: number;
    questionText: string;
    imageUrl?: string;
    audioUrl?: string;
    correctOption: string;
    userOption: string;
    isCorrect: boolean;
    options: {
      label: string;
      text: string;
    }[];
  }[];
}

export const testService = {
  /**
   * Lấy danh sách tests có sẵn
   */
  getAllTests: async (): Promise<Test[]> => {
    console.log("🔍 Fetching all tests...");
    
    try {
      const response = await api.get("/tests/selection/available");
      console.log("✅ Tests loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching tests:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết của một test
   */
  getTestById: async (testId: number): Promise<Test> => {
    console.log(`🔍 Fetching test ${testId}...`);
    
    try {
      const response = await api.get(`/tests/${testId}`);
      console.log("✅ Test loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching test:", error);
      throw error;
    }
  },

  /**
   * Tạo test mới từ question bank
   */
  generateTest: async (request: TestGenerateRequest): Promise<{ testId: number }> => {
    console.log("🎯 Generating new test...", request);
    
    try {
      const response = await api.post("/tests/generate", request);
      console.log("✅ Test generated:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error generating test:", error);
      throw error;
    }
  },

  /**
   * Lấy questions của một test
   */
  getTestQuestions: async (testId: number): Promise<TestQuestion[]> => {
    console.log(`🔍 Fetching questions for test ${testId}...`);
    
    try {
      // Sử dụng question-group API để lấy questions
      const response = await api.get(`/question-group/all`);
      console.log("✅ Test questions loaded:", response.data);
      
      // Transform data to match TestQuestion interface
      const questions: TestQuestion[] = [];
      let questionOrder = 1;
      
      response.data.forEach((group: any) => {
        group.questions?.forEach((question: any) => {
          questions.push({
            questionId: question.id,
            questionText: question.questionText,
            partNumber: group.partId || 1,
            questionOrder: questionOrder++,
            audioUrl: group.audioUrl,
            imageUrl: group.imageUrl,
            options: question.options?.map((opt: any) => ({
              label: opt.optionLabel,
              content: opt.optionText
            })) || []
          });
        });
      });
      
      return questions;
    } catch (error) {
      console.error("❌ Error fetching test questions:", error);
      throw error;
    }
  },

  /**
   * Submit test answers
   */
  submitTest: async (submission: TestSubmission): Promise<TestResult> => {
    console.log("📝 Submitting test answers...", submission);
    
    try {
      const response = await api.post("/submit", submission);
      console.log("✅ Test submitted:", response.data);
      
      // Get detailed result
      const resultResponse = await api.get(`/submit/result/${response.data.resultId || 1}`);
      return resultResponse.data;
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      throw error;
    }
  },

  /**
   * Lấy kết quả test chi tiết
   */
  getTestResult: async (resultId: number): Promise<TestResult> => {
    console.log(`🔍 Fetching test result ${resultId}...`);
    
    try {
      const response = await api.get(`/submit/result/${resultId}`);
      console.log("✅ Test result loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching test result:", error);
      throw error;
    }
  },

  /**
   * Tạo test nhanh ngẫu nhiên
   */
  generateQuickTest: async (): Promise<Test> => {
    console.log("🎲 Generating quick random test...");
    
    try {
      const response = await api.post("/tests/selection/generate-quick");
      console.log("✅ Quick test generated:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error generating quick test:", error);
      throw error;
    }
  },

  /**
   * Tạo test ngẫu nhiên tùy chỉnh
   */
  generateRandomTest: async (config: {
    title?: string;
    description?: string;
    useFullTOEICStructure?: boolean;
  }): Promise<Test> => {
    console.log("🎲 Generating random test with config:", config);
    
    try {
      const response = await api.post("/tests/selection/generate-random", config);
      console.log("✅ Random test generated:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error generating random test:", error);
      throw error;
    }
  }
};
