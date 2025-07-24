export interface Lesson {
  id?: number;
  title: string;
  description: string;
  content: string;
  level: string;
  imageUrl?: string;
  audioUrl?: string;
  isPremium?: boolean;
  isActive?: boolean;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  difficulty?: string;
  duration?: number;
  isPublic?: boolean;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  content: string;
  level: string;
  imageUrl?: string;
  audioUrl?: string;
  isPremium?: boolean;
  type?: string;
  difficulty?: string;
  duration?: number;
  isPublic?: boolean;
}

export interface UpdateLessonRequest {
  id: number;
  title?: string;
  description?: string;
  content?: string;
  level?: string;
  imageUrl?: string;
  audioUrl?: string;
  isPremium?: boolean;
  isActive?: boolean;
  type?: string;
  difficulty?: string;
  duration?: number;
  isPublic?: boolean;
}

export interface LessonResponse {
  success: boolean;
  message: string;
  data?: Lesson;
  lessons?: Lesson[];
}

export type LessonLevel =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "ALL_LEVELS";
export type LessonDifficulty = "EASY" | "MEDIUM" | "HARD";
export type LessonType =
  | "GENERAL"
  | "VOCABULARY"
  | "GRAMMAR"
  | "LISTENING"
  | "READING";
