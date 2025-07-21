import { FlashcardSet } from "../types";
import api from "./api";

// Add cache for flashcard sets
let flashcardSetsCache: FlashcardSet[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

export const flashcardService = {
  async getAllFlashcardSets(): Promise<FlashcardSet[]> {
    try {
      const now = Date.now();

      // Return cached data if available and not expired
      if (flashcardSetsCache && now - cacheTimestamp < CACHE_TTL) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "📦 Using cached flashcard sets:",
            flashcardSetsCache.length
          );
        }
        return flashcardSetsCache;
      }

      // Fetch fresh data if cache expired or not available
      const response = await api.get("/flashcards/sets/all");

      // Only log important events in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          "✅ Flashcard sets loaded:",
          response.data?.length || 0,
          "sets"
        );
      }

      // Update cache
      flashcardSetsCache = response.data;
      cacheTimestamp = now;

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching flashcard sets:", error);

      // If we have cached data, return it even if expired as fallback
      if (flashcardSetsCache) {
        console.log("📦 Using expired cache as fallback");
        return flashcardSetsCache;
      }

      throw error;
    }
  },

  // Clear cache (useful when data is modified)
  clearCache() {
    flashcardSetsCache = null;
    cacheTimestamp = 0;
    if (process.env.NODE_ENV === "development") {
      console.log("🗑️ Flashcard sets cache cleared");
    }
  },
};
