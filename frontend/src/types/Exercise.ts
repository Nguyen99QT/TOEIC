export interface Exercise {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty_level: string;
  time_limit_seconds: number;
  points: number;
  order_index: number;
  question: string;
  options: string[];
  is_active: boolean;
}

export type ExerciseType = "multiple_choice" | "matching" | "fill_in_the_blank";
export type DifficultyLevel = "easy" | "medium" | "hard";
