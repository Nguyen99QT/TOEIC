/**
 * ================================================================
 * MOCK DATA SERVICE
 * ================================================================
 * Provides mock data for development and testing
 */

// Mock exercises data
export const mockExercises = [
  {
    id: 1,
    title: "Exercise 1: Choose the correct number",
    description: "Choose the correct number.",
    lessonId: 2,
    type: "MULTIPLE_CHOICE",
    difficulty: "EASY",
    totalPoints: 10,
    estimatedTime: "1 min",
    questions: [
      {
        id: 1,
        questionText: "What number is this?",
        type: "MULTIPLE_CHOICE",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "One",
      },
    ],
  },
  {
    id: 2,
    title: "Exercise 2: Match the number with the word",
    description: "Match the number with the word.",
    lessonId: 2,
    type: "MATCHING",
    difficulty: "MEDIUM",
    totalPoints: 15,
    estimatedTime: "2 min",
    questions: [],
  },
  {
    id: 3,
    title: "Exercise 3: Fill in the blank",
    description: "Fill in the blank: 'I have ___ apples.'",
    lessonId: 2,
    type: "FILL_BLANK",
    difficulty: "MEDIUM",
    totalPoints: 12,
    estimatedTime: "0 min",
    questions: [],
  },
];

// Mock lessons data
export const mockLessons = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Learn essential greeting phrases",
    level: "A1",
    duration: "15",
    imageUrl: null,
    audioUrl: null,
    isPremium: false,
    progress: 0,
  },
  {
    id: 2,
    title: "Numbers 1-10",
    description: "Learn numbers from 1 to 10",
    level: "A1",
    duration: "10",
    imageUrl: null,
    audioUrl: null,
    isPremium: false,
    progress: 0,
  },
];

// Mock completed exercises
export const mockCompletedExercises = new Set<number>([]);

// Mock user data
export const mockUser = {
  id: 999,
  username: "testuser",
  email: "test@example.com",
  displayName: "Test User",
  membershipType: "FREE",
  role: "USER",
  isPremium: false,
  isActive: true,
};
