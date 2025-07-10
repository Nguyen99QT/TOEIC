import { FlashcardSet } from "../types";
import api from "./api";

export const flashcardService = {
  async getAllFlashcardSets(): Promise<FlashcardSet[]> {
    try {
      const response = await api.get("/flashcards/sets/all");
      // Only log important events in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          "✅ Flashcard sets loaded:",
          response.data?.length || 0,
          "sets"
        );
      }
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching flashcard sets:", error);
      throw error;
    }
  },
  // ...bạn có thể bổ sung thêm các hàm khác nếu cần...
};
