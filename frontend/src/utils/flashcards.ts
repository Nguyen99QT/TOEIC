import { FlashcardSet } from "../types";

/**
 * Convert backend FlashcardSet response to frontend type
 */
export const mapBackendFlashcardSet = (backendSet: any): FlashcardSet => {
  return {
    id: backendSet.id,
    name: backendSet.name,
    description: backendSet.description || "",
    isActive: backendSet.isActive ?? true,
    isPremium: backendSet.isPremium ?? false,
    isPublic: backendSet.isPublic ?? true,
    category: backendSet.category,
    tags: backendSet.tags,
    difficultyLevel: backendSet.difficultyLevel || "BEGINNER",
    estimatedTimeMinutes: backendSet.estimatedTimeMinutes || 15,
    viewCount: backendSet.viewCount || 0,
    createdAt: backendSet.createdAt,
    updatedAt: backendSet.updatedAt,
    createdBy: backendSet.createdBy?.id || backendSet.createdBy,
    flashcards: backendSet.flashcards || [],

    // Frontend compatibility
    title: backendSet.name, // Use name as title
    totalCards: backendSet.flashcards?.length || 0,
    completedCards: 0, // Would come from user progress
    progress: 0, // Would be calculated from user progress
  };
};

/**
 * Get display name for flashcard set
 */
export const getFlashcardSetDisplayName = (set: FlashcardSet): string => {
  return set.title || set.name || "Untitled Set";
};

/**
 * Check if user can access flashcard set
 */
export const canAccessFlashcardSet = (
  set: FlashcardSet,
  user: any
): boolean => {
  // Public sets are always accessible
  if (set.isPublic && !set.isPremium) {
    return true;
  }

  // Premium sets require premium membership
  if (set.isPremium) {
    return user?.isPremium || user?.role === "ADMIN";
  }

  // Private sets require authentication
  return !!user;
};

/**
 * Create mock flashcard set for testing
 */
export const createMockFlashcardSet = (
  id: number,
  displayName: string,
  description: string,
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  isPremium: boolean = false,
  estimatedMinutes: number = 15,
  tags: string = "",
  viewCount: number = 0
): FlashcardSet => {
  return {
    id,
    name: displayName,
    title: displayName,
    description,
    difficultyLevel: difficulty,
    isPremium,
    isActive: true,
    isPublic: true,
    estimatedTimeMinutes: estimatedMinutes,
    tags,
    viewCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 1,
  };
};
