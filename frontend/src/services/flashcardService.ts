import { Flashcard, FlashcardSet } from "../types";
import {
  mapBackendFlashcardSet,
  mapBackendFlashcard,
} from "../utils/flashcards";
import api from "./api";

/**
 * ================================================================
 * FLASHCARD SERVICE
 * ================================================================
 * Handles all flashcard-related API calls
 */

// Add cache management
interface Cache<T = any> {
  data: T | null;
  timestamp: number;
}

type CacheMap = {
  [key: string]: Cache;
};

const cache: {
  allSets: Cache<FlashcardSet[]>;
  publicSets: Cache<FlashcardSet[]>;
  sets: CacheMap;
} = {
  allSets: { data: null, timestamp: 0 },
  publicSets: { data: null, timestamp: 0 },
  sets: {} as CacheMap,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

const isCacheValid = (cacheKey: string): boolean => {
  if (cacheKey === "allSets") {
    return (
      cache.allSets.data !== null &&
      Date.now() - cache.allSets.timestamp < CACHE_TTL
    );
  }
  if (cacheKey === "publicSets") {
    return (
      cache.publicSets.data !== null &&
      Date.now() - cache.publicSets.timestamp < CACHE_TTL
    );
  }
  if (cacheKey.startsWith("set_") || cacheKey.startsWith("flashcards_")) {
    const entry = cache.sets[cacheKey];
    return (
      entry && entry.data !== null && Date.now() - entry.timestamp < CACHE_TTL
    );
  }
  return false;
};

const flashcardService = {
  /**
   * Get all flashcard sets (for authenticated users)
   */
  getAllSets: async (): Promise<FlashcardSet[]> => {
    try {
      console.log("🔄 Fetching all flashcard sets...");

      // Use cache if available and not expired
      if (isCacheValid("allSets")) {
        console.log("📦 Using cached all flashcard sets");
        return cache.allSets.data!;
      }

      const response = await api.get("/api/flashcard-sets");
      console.log("✅ Raw all sets API response:", response.data);

      // Map backend response to frontend type
      const mappedSets = response.data.map(mapBackendFlashcardSet);
      console.log("✅ Mapped flashcard sets:", mappedSets.length);

      // Update cache
      cache.allSets = {
        data: mappedSets,
        timestamp: Date.now(),
      };

      return mappedSets;
    } catch (error: any) {
      console.error("❌ Error fetching all flashcard sets:", error);

      // If 401/403, user might not be authenticated
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("🔄 Authentication failed, falling back to public sets...");
        return flashcardService.getPublicSets();
      }

      throw error;
    }
  },

  /**
   * Get public flashcard sets (for guests)
   */
  getPublicSets: async (): Promise<FlashcardSet[]> => {
    try {
      // Use cache if available and not expired
      if (isCacheValid("publicSets")) {
        console.log("📦 Using cached public flashcard sets");
        return cache.publicSets.data!;
      }

      console.log("🌐 Fetching public flashcard sets...");
      console.log(
        "🔗 API URL will be:",
        `${api.defaults.baseURL}/api/flashcard-sets/public`
      );
      const response = await api.get("/api/flashcard-sets/public");
      console.log("✅ Raw public sets API response:", response.data);

      // Extract data from ApiResponse format
      const setsData = response.data.data || response.data;
      const mappedSets = setsData.map(mapBackendFlashcardSet);
      console.log("✅ Mapped public flashcard sets:", mappedSets.length);

      // Update cache
      cache.publicSets = {
        data: mappedSets,
        timestamp: Date.now(),
      };

      return mappedSets;
    } catch (error: any) {
      console.error("❌ Error fetching public flashcard sets:", error);
      throw error;
    }
  },

  /**
   * Get flashcard set by ID
   */
  getSetById: async (id: number): Promise<FlashcardSet> => {
    const cacheKey = `set_${id}`;

    try {
      // Use cache if available and not expired
      if (cache.sets[cacheKey] && isCacheValid(cacheKey)) {
        console.log(`📦 Using cached flashcard set ${id}`);
        return cache.sets[cacheKey].data!;
      }

      console.log(`🔄 Fetching flashcard set ${id}...`);
      const response = await api.get(`/api/flashcard-sets/${id}`);
      console.log("✅ Raw flashcard set API response:", response.data);

      const mappedSet = mapBackendFlashcardSet(response.data);

      // Update cache
      cache.sets[cacheKey] = {
        data: mappedSet,
        timestamp: Date.now(),
      };

      return mappedSet;
    } catch (error: any) {
      console.error(`❌ Error fetching flashcard set ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get flashcards in a set
   */
  getFlashcards: async (setId: number): Promise<Flashcard[]> => {
    const cacheKey = `flashcards_${setId}`;

    try {
      // Use cache if available and not expired
      if (cache.sets[cacheKey] && isCacheValid(cacheKey)) {
        console.log(`📦 Using cached flashcards for set ${setId}`);
        return cache.sets[cacheKey].data!;
      }

      console.log(`🔄 Fetching flashcards for set ${setId}...`);
      const response = await api.get(`/api/flashcards/set/${setId}`);
      console.log("✅ Raw flashcards API response:", response.data);

      // Map backend format to frontend format
      const mappedFlashcards = response.data.map(mapBackendFlashcard);
      console.log("🔄 Mapped flashcards:", mappedFlashcards);

      // Update cache
      cache.sets[cacheKey] = {
        data: mappedFlashcards,
        timestamp: Date.now(),
      };

      return mappedFlashcards;
    } catch (error: any) {
      console.error(`❌ Error fetching flashcards for set ${setId}:`, error);
      throw error;
    }
  },

  /**
   * Clear all caches - call this after mutations
   */
  clearCache: () => {
    cache.allSets = { data: null, timestamp: 0 };
    cache.publicSets = { data: null, timestamp: 0 };
    cache.sets = {} as CacheMap;
    console.log("🗑️ Flashcard cache cleared");
  },

  /**
   * Get user's own flashcard sets
   */
  getMySet: async (): Promise<FlashcardSet[]> => {
    try {
      console.log("🔄 Fetching user's flashcard sets...");
      const response = await api.get("/flashcard-sets/my");
      console.log("✅ Raw my sets API response:", response.data);

      const mappedSets = response.data.map(mapBackendFlashcardSet);
      console.log("✅ Mapped user flashcard sets:", mappedSets.length);

      return mappedSets;
    } catch (error: any) {
      console.error("❌ Error fetching user's flashcard sets:", error);
      throw error;
    }
  },

  /**
   * Get flashcard sets user can access (based on membership)
   */
  getAccessibleSets: async (): Promise<FlashcardSet[]> => {
    try {
      console.log("🔄 Fetching accessible flashcard sets...");
      const response = await api.get("/flashcard-sets/accessible");
      console.log("✅ Raw accessible sets API response:", response.data);

      const mappedSets = response.data.map(mapBackendFlashcardSet);
      console.log("✅ Mapped accessible flashcard sets:", mappedSets.length);

      return mappedSets;
    } catch (error: any) {
      console.error("❌ Error fetching accessible flashcard sets:", error);
      throw error;
    }
  },

  /**
   * Search flashcard sets
   */
  searchSets: async (
    query: string,
    filters?: {
      difficulty?: string;
      category?: string;
      isPremium?: boolean;
    }
  ): Promise<FlashcardSet[]> => {
    try {
      console.log(`🔍 Searching flashcard sets with query: "${query}"`);

      const params = new URLSearchParams();
      params.append("q", query);

      if (filters?.difficulty) params.append("difficulty", filters.difficulty);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.isPremium !== undefined)
        params.append("isPremium", filters.isPremium.toString());

      const response = await api.get(
        `/flashcard-sets/search?${params.toString()}`
      );
      console.log("✅ Search results:", response.data);

      const mappedSets = response.data.map(mapBackendFlashcardSet);
      console.log("✅ Mapped search results:", mappedSets.length);

      return mappedSets;
    } catch (error: any) {
      console.error("❌ Error searching flashcard sets:", error);
      throw error;
    }
  },

  /**
   * Track view count for a flashcard set
   */
  trackView: async (setId: number): Promise<void> => {
    try {
      console.log(`👁️ Tracking view for set ${setId}...`);
      await api.post(`/flashcard-sets/${setId}/view`);
      console.log("✅ View tracked successfully");
    } catch (error: any) {
      console.warn("⚠️ Failed to track view for set", setId, error);
      // Don't throw error for view tracking failures
    }
  },

  /**
   * Start study session for a flashcard set
   */
  startStudySession: async (
    setId: number
  ): Promise<{
    sessionId: string;
    flashcards: Flashcard[];
    progress: any;
  }> => {
    try {
      console.log(`📚 Starting study session for set ${setId}...`);

      // Track view when starting study
      await flashcardService.trackView(setId);

      const response = await api.get(`/flashcards/study/${setId}`);
      console.log("✅ Study session started:", response.data);

      return response.data;
    } catch (error: any) {
      console.error(`❌ Error starting study session for set ${setId}:`, error);
      throw error;
    }
  },

  /**
   * Submit answer for flashcard
   */
  submitAnswer: async (
    setId: number,
    flashcardId: number,
    isCorrect: boolean,
    timeSpent: number
  ): Promise<{
    correct: boolean;
    nextCard?: Flashcard;
    progress: any;
  }> => {
    try {
      console.log(
        `✍️ Submitting answer for flashcard ${flashcardId} in set ${setId}...`
      );

      const response = await api.post(`/flashcards/study/${setId}/answer`, {
        flashcardId,
        isCorrect,
        timeSpent,
      });

      console.log("✅ Answer submitted:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Error submitting answer for flashcard ${flashcardId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get study progress for a set
   */
  getStudyProgress: async (
    setId: number
  ): Promise<{
    totalCards: number;
    studiedCards: number;
    masteredCards: number;
    accuracy: number;
    timeSpent: number;
  }> => {
    try {
      console.log(`📊 Fetching study progress for set ${setId}...`);
      const response = await api.get(`/flashcards/study/${setId}/progress`);
      console.log("✅ Study progress:", response.data);

      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Error fetching study progress for set ${setId}:`,
        error
      );
      throw error;
    }
  },

  // ================================================================
  // CONTENT CREATION METHODS (for collaborators/admins)
  // ================================================================

  /**
   * Create new flashcard set
   */
  createSet: async (setData: Partial<FlashcardSet>): Promise<FlashcardSet> => {
    try {
      console.log("🆕 Creating new flashcard set:", setData);
      const response = await api.post("/flashcard-sets", setData);
      console.log("✅ Flashcard set created:", response.data);

      return mapBackendFlashcardSet(response.data);
    } catch (error: any) {
      console.error("❌ Error creating flashcard set:", error);
      throw error;
    }
  },

  /**
   * Update flashcard set
   */
  updateSet: async (
    id: number,
    setData: Partial<FlashcardSet>
  ): Promise<FlashcardSet> => {
    try {
      console.log(`🔄 Updating flashcard set ${id}:`, setData);
      const response = await api.put(`/flashcard-sets/${id}`, setData);
      console.log("✅ Flashcard set updated:", response.data);

      return mapBackendFlashcardSet(response.data);
    } catch (error: any) {
      console.error(`❌ Error updating flashcard set ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete flashcard set
   */
  deleteSet: async (id: number): Promise<void> => {
    try {
      console.log(`🗑️ Deleting flashcard set ${id}...`);
      await api.delete(`/flashcard-sets/${id}`);
      console.log("✅ Flashcard set deleted");
    } catch (error: any) {
      console.error(`❌ Error deleting flashcard set ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create flashcard in a set
   */
  createFlashcard: async (
    setId: number,
    flashcardData: Partial<Flashcard>
  ): Promise<Flashcard> => {
    try {
      console.log(`🆕 Creating flashcard in set ${setId}:`, flashcardData);
      const response = await api.post("/flashcards", {
        ...flashcardData,
        setId,
      });
      console.log("✅ Flashcard created:", response.data);

      return response.data;
    } catch (error: any) {
      console.error(`❌ Error creating flashcard in set ${setId}:`, error);
      throw error;
    }
  },

  /**
   * Update flashcard
   */
  updateFlashcard: async (
    id: number,
    flashcardData: Partial<Flashcard>
  ): Promise<Flashcard> => {
    try {
      console.log(`🔄 Updating flashcard ${id}:`, flashcardData);
      const response = await api.put(`/flashcards/${id}`, flashcardData);
      console.log("✅ Flashcard updated:", response.data);

      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating flashcard ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete flashcard
   */
  deleteFlashcard: async (id: number): Promise<void> => {
    try {
      console.log(`🗑️ Deleting flashcard ${id}...`);
      await api.delete(`/flashcards/${id}`);
      console.log("✅ Flashcard deleted");
    } catch (error: any) {
      console.error(`❌ Error deleting flashcard ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get featured public flashcard sets (limited for homepage)
   */
  getFeaturedSets: async (limit: number = 4): Promise<FlashcardSet[]> => {
    try {
      console.log(
        `🔄 Fetching featured flashcard sets with limit: ${limit}...`
      );
      const response = await api.get(
        `/flashcard-sets/public/featured?limit=${limit}`
      );
      console.log("✅ Featured sets API response:", response.data);

      // Extract data from ApiResponse format
      const setsData = response.data.data || response.data;
      const mappedSets = setsData.map(mapBackendFlashcardSet);
      console.log("✅ Mapped featured flashcard sets:", mappedSets.length);

      return mappedSets;
    } catch (error: any) {
      console.error("❌ Error fetching featured flashcard sets:", error);
      throw error;
    }
  },
};

export default flashcardService;
