/**
 * ================================================================
 * MEDIA SERVICE
 * ================================================================
 * Utilities for handling media files (images, audio)
 */

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export class MediaService {
  /**
   * Xử lý và validate image URL
   */
  static processImageUrl(imageUrl?: string): string | null {
    if (!imageUrl) {
      console.log("🖼️ No image URL provided");
      return null;
    }

    // Nếu đã là absolute URL
    if (imageUrl.startsWith("http")) {
      console.log("✅ Using absolute image URL:", imageUrl);
      return imageUrl;
    }

    // Xử lý relative URL - sử dụng /files/ thay vì /api/files/
    const processedUrl = `${API_BASE_URL}/files/images/${imageUrl}`;
    console.log(
      "🔄 Processing relative image URL:",
      imageUrl,
      "→",
      processedUrl
    );
    return processedUrl;
  }

  /**
   * Xử lý và validate audio URL
   */
  static processAudioUrl(audioUrl: string): string {
    if (!audioUrl) return "";

    // Convert to absolute URL if relative
    let processedUrl = audioUrl.startsWith("http")
      ? audioUrl
      : `${API_BASE_URL}/files/audio/${audioUrl}`;

    // Normalize audio path to include lessons/ prefix if missing
    if (
      processedUrl.includes("/files/audio/") &&
      !processedUrl.includes("/files/audio/lessons/")
    ) {
      // Extract the filename part after /files/audio/
      const audioPathMatch = processedUrl.match(/\/files\/audio\/(.+)$/);
      if (audioPathMatch) {
        const audioPath = audioPathMatch[1];

        // Special handling for common audio categories
        if (
          audioPath.startsWith("number/") ||
          audioPath.startsWith("numbers/")
        ) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/numbers/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("colors/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/colors/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("greetings/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/greetings/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("family/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/family/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("food/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/food/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("hobbies/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/hobbies/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("travel/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/travel/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("work/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/work/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("routine/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/routine/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("weather/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/weather/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("sports/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/sports/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("music/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/music/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("movies/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/movies/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("books/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/books/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("art/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/art/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("nature/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/nature/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("technology/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/technology/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("health/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/health/" + audioPath.split("/").pop()
          );
        } else if (audioPath.startsWith("education/")) {
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/education/" + audioPath.split("/").pop()
          );
        } else if (!audioPath.includes("/")) {
          // Single file without category, add lessons/ prefix
          processedUrl = processedUrl.replace(
            "/files/audio/" + audioPath,
            "/files/audio/lessons/" + audioPath
          );
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Using absolute audio URL:", processedUrl);
    }

    return processedUrl;
  }

  /**
   * Test xem media URL có accessible không với auth headers
   */
  static async testMediaUrl(
    url: string,
    type: "image" | "audio"
  ): Promise<boolean> {
    try {
      console.log(`🧪 Testing ${type} URL:`, url);

      // Get auth token
      const token =
        localStorage.getItem("toeic_access_token") ||
        localStorage.getItem("authToken");

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log(`🔑 Adding auth token for ${type} test`);
      }

      const response = await fetch(url, {
        method: "HEAD",
        headers,
        mode: "cors",
      });

      const success = response.ok;

      if (success) {
        console.log(`✅ ${type} URL is accessible:`, url);
      } else {
        console.warn(`❌ ${type} URL failed (${response.status}):`, url);
        console.warn(`Response details:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }

      return success;
    } catch (error) {
      console.error(`❌ ${type} URL test failed:`, url, error);
      return false;
    }
  }

  /**
   * Tạo fallback image data URL
   */
  static createFallbackImage(text: string, bgColor = "#3B82F6"): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return "";

    canvas.width = 400;
    canvas.height = 300;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 400, 300);

    // Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 200, 150);

    return canvas.toDataURL();
  }

  /**
   * Debug media info from API response
   */
  static debugMediaInfo(data: any, context: string = "Unknown") {
    console.group(`🔍 Media Debug - ${context}`);

    if (Array.isArray(data)) {
      console.log(`📦 Array with ${data.length} items`);
      data.forEach((item, index) => {
        if (item.imageUrl || item.audioUrl) {
          console.log(`Item ${index}:`, {
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            audioUrl: item.audioUrl,
          });
        }
      });
    } else if (data && typeof data === "object") {
      console.log("📦 Single object:", {
        id: data.id,
        title: data.title,
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
      });
    }

    console.groupEnd();
  }

  /**
   * Preload media để improve performance
   */
  static preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log("✅ Image preloaded:", url);
        resolve();
      };
      img.onerror = () => {
        console.warn("❌ Image preload failed:", url);
        reject(new Error("Image preload failed"));
      };
      img.src = url;
    });
  }

  /**
   * Preload audio để improve performance
   */
  static preloadAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        console.log("✅ Audio preloaded:", url);
        resolve();
      };
      audio.onerror = () => {
        console.warn("❌ Audio preload failed:", url);
        reject(new Error("Audio preload failed"));
      };
      audio.src = url;
    });
  }

  /**
   * Batch preload multiple media files
   */
  static async preloadMediaBatch(lessons: any[]): Promise<void> {
    console.log("🚀 Starting media preload batch...");

    const imagePromises = lessons
      .map((lesson) => this.processImageUrl(lesson.imageUrl))
      .filter(Boolean)
      .map((url) => this.preloadImage(url!).catch(() => {})); // Ignore failures

    const audioPromises = lessons
      .map((lesson) => this.processAudioUrl(lesson.audioUrl))
      .filter(Boolean)
      .map((url) => this.preloadAudio(url!).catch(() => {})); // Ignore failures

    await Promise.all([...imagePromises, ...audioPromises]);
    console.log("✅ Media preload batch completed");
  }
}

export default MediaService;
