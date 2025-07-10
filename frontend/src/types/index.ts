/**
 * ================================================================
 * TYPESCRIPT TYPES FOR LEENGLISH TOEIC PLATFORM
 * ================================================================
 *
 * These types match the backend Java entities and enums
 * Synchronized with backend/src/main/java/com/leenglish/toeic/
 */

// ========== ENUMS ==========

export enum Role {
  USER = "USER",
  COLLABORATOR = "COLLABORATOR",
  ADMIN = "ADMIN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum Skill {
  LISTENING = "LISTENING",
  READING = "READING",
  SPEAKING = "SPEAKING",
  WRITING = "WRITING",
}

export enum ToeicPart {
  PART1 = "PART1", // Pictures
  PART2 = "PART2", // Question-Response
  PART3 = "PART3", // Conversations
  PART4 = "PART4", // Short Talks
  PART5 = "PART5", // Incomplete Sentences
  PART6 = "PART6", // Text Completion
  PART7 = "PART7", // Reading Comprehension
}

export enum Difficult {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",

}

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_IN_BLANK = "FILL_IN_BLANK",
  LISTENING = "LISTENING",
  READING_COMPREHENSION = "READING_COMPREHENSION",
}

export enum ExerciseType {
  PRACTICE = "PRACTICE",
  MOCK_TEST = "MOCK_TEST",
  QUICK_QUIZ = "QUICK_QUIZ",
  FULL_TEST = "FULL_TEST",
}

export enum LessonType {
  GRAMMAR = "GRAMMAR",
  VOCABULARY = "VOCABULARY",
  LISTENING = "LISTENING",
  READING = "READING",
  SPEAKING = "SPEAKING",
  WRITING = "WRITING",
}
// Consolidated Question interface to avoid duplication and ensure compatibility with backend structure
export interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string; // 'A', 'B', 'C', or 'D'
  explanation?: string;
  points: number;
  questionOrder: number;
  exerciseId: number;
  audioUrl?: string; // URL to audio file if applicable
  imageUrl?: string; // URL to image file if applicable
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  difficulty?: Difficult | "EASY" | "MEDIUM" | "HARD"; // Use the Difficult enum or string for compatibility
  questionType?: QuestionType | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK" | "LISTENING" | "READING_COMPREHENSION"; // Use the QuestionType enum or string for compatibility
  questiontext?: string; // For compatibility with legacy backend property
}

export enum ProgressType {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// ========== DOMAIN ENTITIES ==========

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "USER" | "COLLABORATOR";
  membershipType: "FREE" | "PREMIUM";
  gender?: Gender;
  birthDate?: string;
  phoneNumber?: string;
  address?: string;
  targetScore?: number;
  currentLevel?: DifficultyLevel;
  registrationDate?: string;
  lastLoginDate?: string;
  isActive?: boolean;
  profilePicture?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string;
  redirectUrl?: string;
}
export interface DifficultyLevel {
  id: number;
  name: string; // e.g., "A1", "A2", "B1", "B2", "C1", "C2"
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content?: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; // CEFR levels
  isPremium: boolean;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Navigation properties
  exercises?: Exercise[];
  totalExercises?: number;
  completedExercises?: number;
  progress?: number;
}

// (Removed duplicate Question interface. See consolidated definition above.)

export interface QuestionAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  type: "READING" | "LISTENING" | "VOCABULARY" | "GRAMMAR";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  orderIndex: number;
  totalQuestions?: number;
  timeLimit?: number;
  isActive: boolean;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

export interface ExerciseSubmission {
  exerciseId: number;
  userId: number;
  answers: UserAnswer[];
  score: number;
  timeSpent: number;
  isCompleted: boolean;
  submittedAt: Date;
}

export interface ExerciseQuestion {
  id: number;
  exercise: Exercise;
  question: Question;
  orderIndex: number;
}

export interface UserLessonProgress {
  id: number;
  user: User;
  lesson: Lesson;
  progress: ProgressType;
  completionPercentage: number;
  startDate: string;
  completionDate?: string;
  lastAccessDate: string;
  timeSpent: number; // in minutes
}

export interface UserExerciseAttempt {
  id: number;
  user: User;
  exercise: Exercise;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  startTime: string;
  endTime: string;
  isPassed: boolean;
}

export interface UserQuestionAnswer {
  id: number;
  user: User;
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  answeredAt: string;
  exercise?: Exercise;
}

export interface Flashcard {
  id: number;
  setId: number; // flashcardSet ID (match với backend)
  frontText: string;
  backText: string;
  hint?: string; // ✅ Add hint property
  imageUrl?: string;
  audioUrl?: string;
  orderIndex: number;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  difficultyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"; // ✅ Add for compatibility
  tags?: string; // ✅ Add tags as comma-separated string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Legacy support (might be used in some places)
  flashcardSetId?: number; // Alias for setId
}

export interface FlashcardSet {
  id: number;
  name: string;
  title?: string; // Alias for name
  description: string;
  isActive: boolean;
  isPremium: boolean;
  isPublic: boolean; // ✅ Required property
  category?: string;
  tags?: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTimeMinutes: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  flashcards?: Flashcard[];

  // Computed properties
  totalCards?: number;
  completedCards?: number;
  progress?: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  lessonId?: number;
  exerciseId?: number;
  user?: User;
}

// ========== API RESPONSE TYPES ==========

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
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

export interface ErrorResponse {
  success: false;
  message: string;
  details?: string;
  timestamp: string;
}

// ========== AUTH TYPES ==========

export interface LoginRequest {
  username: string;
  password: string;
  email?: string; // Optional for flexibility
  rememberMe?: boolean; // Optional for "Remember Me" functionality

}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  birthDate?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ========== STATS AND ANALYTICS ==========

export interface UserStats {
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  skillBreakdown: {
    [key in Skill]: {
      lessonsCompleted: number;
      averageScore: number;
      timeSpent: number;
    };
  };
  partBreakdown: {
    [key in ToeicPart]: {
      questionsAnswered: number;
      correctAnswers: number;
      averageScore: number;
    };
  };
}


export interface DashboardData {
  user: User;
  stats: UserStats;
  recentLessons: UserLessonProgress[];
  recentExercises: UserExerciseAttempt[];
  recommendations: {
    lessons: Lesson[];
    exercises: Exercise[];
  };
  upcomingDeadlines: any[]; // For future membership or challenge features
}

// ========== FORM TYPES ==========

export interface LessonFormData {
  title: string;
  description: string;
  lessonType: LessonType;
  difficulty: DifficultyLevel;
  skill: Skill;
  toeicPart?: ToeicPart;
  content: string;
  duration: number;
  orderIndex: number;
}

export interface ExerciseFormData {
  title: string;
  description: string;
  exerciseType: ExerciseType;
  difficulty: DifficultyLevel;
  skill: Skill;
  toeicPart?: ToeicPart;
  timeLimit: number;
  passingScore: number;
  lessonId?: number;
}

export interface QuestionFormData {
  questionText: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  skill: Skill;
  toeicPart?: ToeicPart;
  audioUrl?: string;
  imageUrl?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation?: string;
  orderIndex: number;
}

// ========== REQUEST/RESPONSE TYPES ==========

export interface QuestionAnswerRequest {
  questionId: number;
  selectedAnswer: string; // A, B, C, or D
  timeTaken?: number; // in seconds
  isConfident?: boolean;
  userNote?: string;
}

// ========== UTILITY TYPES ==========

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  skill?: Skill;
  difficulty?: DifficultyLevel;
  toeicPart?: ToeicPart;
  lessonType?: LessonType;
  exerciseType?: ExerciseType;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationOptions {
  page: number;
  size: number;
}
