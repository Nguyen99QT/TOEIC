import { api } from "../utils/api";

export interface FlashcardSet {
  id?: number;
  title: string;
  description?: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  flashcardCount?: number;
  flashcards?: Flashcard[];
}

export interface Flashcard {
  id?: number;
  frontContent: string;
  backContent: string;
  example?: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  flashcardSetId?: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFlashcardSetRequest {
  title: string;
  description?: string;
  difficultyLevel: string;
  category?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
}

class CollaboratorService {
  // ========== FLASHCARD SET CRUD ==========

  /**
   * Get all flashcard sets for management
   */
  async getAllFlashcardSets(): Promise<FlashcardSet[]> {
    console.log("🔄 Fetching all flashcard sets for collaborator...");

    try {
      const response = await api.get("/flashcard-sets/collaborator/all");
      console.log("✅ Flashcard sets fetched:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error fetching flashcard sets:", error);
      throw error;
    }
  }

  /**
   * Create new flashcard set
   */
  async createFlashcardSet(
    data: CreateFlashcardSetRequest
  ): Promise<FlashcardSet> {
    console.log("🔄 Creating flashcard set:", data);

    try {
      const response = await api.post(
        "/flashcard-sets/collaborator/create",
        data
      );
      console.log("✅ Flashcard set created:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error creating flashcard set:", error);
      throw error;
    }
  }

  /**
   * Update flashcard set
   */
  async updateFlashcardSet(
    id: number,
    data: Partial<FlashcardSet>
  ): Promise<FlashcardSet> {
    console.log("🔄 Updating flashcard set:", id, data);

    try {
      const response = await api.put(
        `/flashcard-sets/collaborator/${id}`,
        data
      );
      console.log("✅ Flashcard set updated:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error updating flashcard set:", error);
      throw error;
    }
  }

  /**
   * Delete flashcard set
   */
  async deleteFlashcardSet(id: number): Promise<void> {
    console.log("🔄 Deleting flashcard set:", id);

    try {
      await api.delete(`/flashcard-sets/collaborator/${id}`);
      console.log("✅ Flashcard set deleted:", id);
    } catch (error) {
      console.error("❌ Error deleting flashcard set:", error);
      throw error;
    }
  }

  /**
   * Get flashcard set for editing
   */
  async getFlashcardSetForEdit(id: number): Promise<FlashcardSet> {
    console.log("🔄 Fetching flashcard set for edit:", id);

    try {
      const response = await api.get(`/flashcard-sets/collaborator/${id}`);
      console.log("✅ Flashcard set fetched for edit:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching flashcard set for edit:", error);
      throw error;
    }
  }

  // ========== FLASHCARD CRUD ==========

  /**
   * Get flashcards in a set
   */
  async getFlashcardsInSet(setId: number): Promise<Flashcard[]> {
    console.log("🔄 Fetching flashcards in set:", setId);

    try {
      const response = await api.get(`/flashcard-sets/${setId}/flashcards`);
      console.log("✅ Flashcards fetched:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error fetching flashcards:", error);
      throw error;
    }
  }

  /**
   * Add flashcard to set
   */
  async addFlashcardToSet(
    setId: number,
    flashcard: Omit<Flashcard, "id">
  ): Promise<Flashcard> {
    console.log("🔄 Adding flashcard to set:", setId, flashcard);

    try {
      const response = await api.post(
        `/flashcard-sets/${setId}/flashcards`,
        flashcard
      );
      console.log("✅ Flashcard added:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error adding flashcard:", error);
      throw error;
    }
  }

  /**
   * Update flashcard
   */
  async updateFlashcard(
    setId: number,
    flashcardId: number,
    flashcard: Partial<Flashcard>
  ): Promise<Flashcard> {
    console.log("🔄 Updating flashcard:", setId, flashcardId, flashcard);

    try {
      const response = await api.put(
        `/flashcard-sets/${setId}/flashcards/${flashcardId}`,
        flashcard
      );
      console.log("✅ Flashcard updated:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error updating flashcard:", error);
      throw error;
    }
  }

  /**
   * Delete flashcard
   */
  async deleteFlashcard(setId: number, flashcardId: number): Promise<void> {
    console.log("🔄 Deleting flashcard:", setId, flashcardId);

    try {
      await api.delete(`/flashcard-sets/${setId}/flashcards/${flashcardId}`);
      console.log("✅ Flashcard deleted:", flashcardId);
    } catch (error) {
      console.error("❌ Error deleting flashcard:", error);
      throw error;
    }
  }

  // ========== DASHBOARD STATS ==========

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    console.log("🔄 Fetching dashboard stats...");

    try {
      // Get all flashcard sets to calculate stats
      const flashcardSets = await this.getAllFlashcardSets();

      const stats = {
        totalFlashcardSets: flashcardSets.length,
        totalFlashcards: flashcardSets.reduce(
          (sum, set) => sum + (set.flashcardCount || 0),
          0
        ),
        totalLessons: 0, // TODO: Implement lessons API
        totalUsers: 0, // TODO: Implement users count
        recentActivities: [], // TODO: Implement activity tracking
      };

      console.log("✅ Dashboard stats calculated:", stats);
      return stats;
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      throw error;
    }
  }
}

export const collaboratorService = new CollaboratorService();
export default collaboratorService;
