// Enhanced Botpress Configuration for TOEIC Platform
// File: enhanced-botpress-config.js

/**
 * Enhanced configuration with TOEIC-specific data and intents
 */
export const enhancedBotpressConfig = {
  // Bot personality and knowledge
  botPersonality: {
    name: "TOEIC Assistant",
    role: "English Learning Companion",
    personality: "Friendly, encouraging, knowledgeable about TOEIC",
    languages: ["vi", "en"],
    expertise: ["TOEIC preparation", "English learning", "Platform navigation"]
  },

  // TOEIC-specific intents and responses
  customIntents: {
    // Test-related intents
    "start.test": {
      keywords: ["bài thi", "test", "làm bài", "thi thử", "practice test"],
      responses: [
        "Tôi có thể giúp bạn chọn loại bài thi phù hợp! Bạn muốn:",
        "🎧 Bài thi Listening (nghe)",
        "📖 Bài thi Reading (đọc)", 
        "🎯 Bài thi đầy đủ (990 điểm)",
        "⚡ Bài thi nhanh (30 phút)"
      ],
      actions: ["show_test_options", "track_user_intent"]
    },

    "check.score": {
      keywords: ["điểm", "score", "kết quả", "result", "xem điểm"],
      responses: [
        "Để xem điểm số và lịch sử thi, bạn có thể:",
        "📊 Vào Dashboard để xem tổng quan",
        "🏆 Vào Test History để xem chi tiết",
        "📈 So sánh tiến bộ qua từng lần thi"
      ],
      actions: ["get_user_scores", "show_progress"]
    },

    "lesson.help": {
      keywords: ["bài học", "lesson", "học", "study", "grammar", "vocabulary"],
      responses: [
        "Tôi có thể hướng dẫn bạn chọn bài học phù hợp:",
        "📚 Bài học cơ bản (Grammar, Vocabulary)",
        "🎯 Bài học theo chủ đề (Business, Travel)",
        "🔥 Bài học nâng cao (Advanced Skills)"
      ],
      actions: ["recommend_lessons", "track_learning_path"]
    },

    "navigation.help": {
      keywords: ["làm sao", "how to", "hướng dẫn", "guide", "help", "giúp"],
      responses: [
        "Tôi có thể hướng dẫn bạn sử dụng platform:",
        "🏠 Dashboard - Xem tiến trình học tập",
        "📚 Lessons - Học theo chương trình",
        "🎯 Tests - Luyện thi và đánh giá",
        "💳 Flashcards - Học từ vựng hiệu quả"
      ],
      actions: ["show_navigation_guide"]
    },

    "technical.support": {
      keywords: ["lỗi", "error", "bug", "không hoạt động", "not working", "problem"],
      responses: [
        "Tôi sẽ giúp bạn giải quyết vấn đề:",
        "🔧 Thử refresh trang web",
        "🎧 Kiểm tra âm thanh và microphone", 
        "📱 Thử đăng nhập lại",
        "💬 Gửi feedback chi tiết qua trang Contact"
      ],
      actions: ["diagnostic_check", "escalate_to_support"]
    }
  },

  // Context-aware responses based on user state
  contextualResponses: {
    // For users on specific pages
    "/tests": "Tôi thấy bạn đang ở trang Tests! Bạn cần giúp gì về việc làm bài thi?",
    "/lessons": "Đang xem bài học đây! Tôi có thể giúp bạn hiểu nội dung hoặc tìm bài học phù hợp.",
    "/dashboard": "Dashboard cho thấy tiến trình của bạn! Bạn muốn tôi phân tích kết quả học tập?",
    "/flashcards": "Flashcards là cách tuyệt vời để học từ vựng! Bạn cần tips gì không?",

    // For different user roles
    "USER": "Chào bạn! Tôi là trợ lý TOEIC, sẵn sàng giúp bạn học hiệu quả.",
    "COLLABORATOR": "Xin chào Collaborator! Tôi có thể hỗ trợ về việc tạo nội dung và câu hỏi.",
    "ADMIN": "Chào Admin! Tôi có thể hỗ trợ về quản lý platform và user support."
  },

  // Quick action buttons
  quickActions: [
    {
      title: "🎯 Làm bài thi ngay",
      action: "redirect_to_tests",
      url: "/test-selection"
    },
    {
      title: "📚 Xem bài học",
      action: "redirect_to_lessons", 
      url: "/lessons"
    },
    {
      title: "📊 Xem tiến trình",
      action: "redirect_to_dashboard",
      url: "/dashboard"
    },
    {
      title: "💡 Tips học TOEIC",
      action: "show_study_tips",
      content: "study_tips_carousel"
    }
  ],

  // Learning tips and motivational content
  studyTips: [
    {
      title: "🎧 Luyện nghe hiệu quả",
      content: "Nghe 15-30 phút mỗi ngày, tập trung vào accent Mỹ và Canada"
    },
    {
      title: "📖 Đọc hiểu nhanh",
      content: "Skim reading trước, sau đó scan để tìm thông tin cụ thể"
    },
    {
      title: "⏰ Quản lý thời gian",
      content: "Part 5,6: 30 phút | Part 7: 55 phút. Luyện tập với timer!"
    },
    {
      title: "💪 Luyện tập đều đặn",
      content: "30 phút/ngày tốt hơn 3 giờ/tuần. Consistency is key!"
    }
  ],

  // Integration with backend APIs
  apiIntegration: {
    baseUrl: "http://localhost:8080/api",
    endpoints: {
      userStats: "/users/{userId}/stats",
      testHistory: "/test-results/user/{userId}",
      recommendations: "/lessons/recommended/{userId}",
      progress: "/users/{userId}/progress"
    }
  },

  // Advanced features
  features: {
    voiceInput: true,
    fileUpload: false,
    emoticons: true,
    quickReplies: true,
    carousel: true,
    persistence: true,
    typing: true,
    uploads: false,
    resetSession: true
  }
};

/**
 * Generate dynamic responses based on user context
 */
export const generateContextualResponse = (userContext) => {
  const { currentPage, userRole, recentActivity, strugglingAreas } = userContext;
  
  let response = "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?";
  
  // Personalize based on struggling areas
  if (strugglingAreas?.includes('listening')) {
    response += "\n🎧 Tôi thấy bạn cần cải thiện kỹ năng nghe. Muốn thử một số bài tập listening?";
  }
  
  if (strugglingAreas?.includes('reading')) {
    response += "\n📖 Có vẻ reading là điểm cần cải thiện. Tôi có thể gợi ý chiến lược đọc hiệu quả!";
  }
  
  // Suggest based on recent activity
  if (recentActivity === 'completed_test') {
    response += "\n🎉 Chúc mừng bạn đã hoàn thành bài thi! Muốn xem phân tích kết quả?";
  }
  
  return response;
};

export default enhancedBotpressConfig;
