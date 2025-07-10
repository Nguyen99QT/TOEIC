import { FlashcardSet, User } from "../types";

/**
 * Check if user can access flashcard set
 */
export const canAccessFlashcardSet = (
  set: FlashcardSet,
  user: User | null
): boolean => {
  // Public and free sets are always accessible
  if (set.isPublic && !set.isPremium) {
    return true;
  }

  // Premium sets require premium membership or admin role
  if (set.isPremium) {
    if (!user) return false;
    return user.isPremium || user.role === "ADMIN";
  }

  // Private sets require authentication
  return !!user;
};

/**
 * Get access restriction message
 */
export const getAccessRestrictionMessage = (
  set: FlashcardSet,
  user: User | null
): string | null => {
  if (canAccessFlashcardSet(set, user)) {
    return null;
  }

  if (set.isPremium && !user?.isPremium) {
    return "Premium membership required";
  }

  if (!user) {
    return "Login required";
  }

  return "Access denied";
};
