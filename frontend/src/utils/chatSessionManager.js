/**
 * ================================================================
 * CHAT SESSION MANAGER - BOTPRESS INTEGRATION
 * ================================================================
 * 
 * Manages chat sessions, user context, and TOEIC-specific data for Botpress
 */

/**
 * TOEIC Learning Data for Botpress Training
 */
export const TOEIC_KNOWLEDGE_BASE = {
  // Platform Features
  features: {
    tests: "Nền tảng có các loại bài thi TOEIC: Listening, Reading, Full Test với nhiều mức độ khó",
    lessons: "Hệ thống bài học được phân chia theo chủ đề: Grammar, Vocabulary, Pronunciation",
    flashcards: "Hệ thống flashcard để học từ vựng hiệu quả",
    progress: "Theo dõi tiến trình học tập và lịch sử điểm số",
    community: "Blog và cộng đồng học viên chia sẻ kinh nghiệm"
  },

  // Test Types
  testTypes: {
    listening: {
      name: "Listening Test",
      description: "Bài thi nghe gồm 4 phần: Photos, Question-Response, Conversations, Talks",
      duration: "45 phút",
      questions: "100 câu"
    },
    reading: {
      name: "Reading Test", 
      description: "Bài thi đọc gồm 3 phần: Incomplete Sentences, Text Completion, Reading Comprehension",
      duration: "75 phút",
      questions: "100 câu"
    },
    fullTest: {
      name: "Full TOEIC Test",
      description: "Bài thi đầy đủ bao gồm cả Listening và Reading",
      duration: "2 giờ",
      questions: "200 câu"
    }
  },

  // Common User Questions & Answers
  faq: {
    "làm sao để bắt đầu": "Bạn có thể bắt đầu bằng cách đăng ký tài khoản, sau đó chọn 'Bài thi' hoặc 'Bài học' từ menu.",
    "làm bài thi như thế nào": "Vào mục 'Tests', chọn loại bài thi (Listening/Reading/Full), sau đó nhấn 'Bắt đầu làm bài'.",
    "xem điểm ở đâu": "Sau khi hoàn thành bài thi, điểm sẽ hiển thị ngay. Bạn cũng có thể xem lại trong 'Test History'.",
    "học từ vựng": "Sử dụng tính năng Flashcards hoặc các bài học Vocabulary trong mục Lessons.",
    "thay đổi thông tin": "Vào 'Profile' từ menu để cập nhật thông tin cá nhân.",
    "liên hệ hỗ trợ": "Sử dụng trang Contact hoặc chat với chúng tôi qua chatbot này."
  },

  // Navigation Help
  navigation: {
    dashboard: "Trang tổng quan hiển thị tiến trình học tập và thống kê của bạn",
    tests: "Trang làm bài thi TOEIC với nhiều dạng khác nhau",
    lessons: "Các bài học được sắp xếp theo chủ đề và mức độ",
    flashcards: "Hệ thống học từ vựng bằng thẻ ghi nhớ",
    blogs: "Bài viết và tips học TOEIC từ cộng đồng",
    profile: "Quản lý thông tin cá nhân và cài đặt tài khoản"
  },

  // Learning Tips
  tips: {
    listening: [
      "Nghe các podcast tiếng Anh hàng ngày",
      "Luyện tập với các đoạn hội thoại ngắn",
      "Chú ý đến các từ khóa trong câu hỏi",
      "Đừng bỏ qua câu hỏi nếu không nghe rõ"
    ],
    reading: [
      "Đọc skimming để nắm ý chính",
      "Scanning để tìm thông tin cụ thể",
      "Chú ý đến thì của động từ",
      "Luyện tập quản lý thời gian"
    ],
    vocabulary: [
      "Học từ vựng theo chủ đề",
      "Sử dụng flashcards thường xuyên",
      "Đọc nhiều tài liệu tiếng Anh",
      "Ghi chép từ mới mỗi ngày"
    ]
  }
};

/**
 * Enhanced Botpress Configuration with TOEIC Context
 */
export const ENHANCED_BOTPRESS_CONFIG = {
  // Initial messages based on user authentication
  getWelcomeMessage: (user) => {
    if (user) {
      return `Xin chào ${user.username}! 👋 Tôi là trợ lý AI của LeEnglish TOEIC. Tôi có thể giúp bạn:
      
📚 Hướng dẫn sử dụng platform
📝 Giải đáp về các loại bài thi TOEIC  
💡 Chia sẻ tips học tập hiệu quả
🎯 Theo dõi tiến trình học tập

Bạn cần hỗ trợ gì hôm nay?`;
    } else {
      return `Chào mừng đến với LeEnglish TOEIC! 🎓

Tôi là trợ lý AI, có thể giúp bạn:
• Tìm hiểu về platform học TOEIC
• Hướng dẫn đăng ký tài khoản
• Giải thích các tính năng học tập
• Chia sẻ kinh nghiệm luyện thi TOEIC

Hãy đăng ký để trải nghiệm đầy đủ các tính năng! 🚀`;
    }
  },

  // Context-aware suggestions
  getContextSuggestions: (currentPath, user) => {
    const suggestions = [];
    
    switch (currentPath) {
      case '/':
        suggestions.push("Làm sao để bắt đầu học TOEIC?", "Các loại bài thi có gì?");
        break;
      case '/tests':
        suggestions.push("Nên làm bài thi nào trước?", "Mỗi phần thi có bao nhiêu câu?");
        break;
      case '/lessons':
        suggestions.push("Nên học từ bài nào?", "Cách học từ vựng hiệu quả?");
        break;
      case '/dashboard':
        suggestions.push("Làm sao cải thiện điểm số?", "Xem lại kết quả bài thi?");
        break;
      default:
        suggestions.push("Hướng dẫn sử dụng", "Tips học TOEIC");
    }
    
    return suggestions;
  },

  // User context for personalization
  getUserContext: (user) => ({
    userId: user?.id || 'guest',
    username: user?.username || 'Guest',
    role: user?.role || 'USER',
    isAuthenticated: !!user,
    timestamp: new Date().toISOString()
  }),

  // Dynamic user-specific messages
  getPersonalizedMessage: (user, messageType) => {
    if (!user) return null;
    
    const messages = {
      welcome_back: `Chào mừng ${user.username} quay lại! 🎉 Bạn đã hoàn thành bao nhiêu bài thi tuần này?`,
      motivation: `Chào ${user.username}! 💪 Hãy tiếp tục phấn đấu với mục tiêu TOEIC của bạn!`,
      progress_check: `Hi ${user.username}! 📊 Muốn xem tiến trình học tập của bạn không?`,
      study_reminder: `${user.username}, đã đến giờ ôn tập rồi! 📚 Bạn muốn học gì hôm nay?`
    };
    
    return messages[messageType] || messages.welcome_back;
  },

  // Role-specific suggestions
  getRoleBasedSuggestions: (user) => {
    if (!user) return ["Đăng ký tài khoản", "Xem demo"];
    
    switch (user.role) {
      case 'ADMIN':
        return [
          "Quản lý người dùng",
          "Xem thống kê hệ thống", 
          "Tạo câu hỏi mới",
          "Quản lý bài học"
        ];
      case 'COLLABORATOR':
        return [
          "Tạo bài thi mới",
          "Quản lý câu hỏi",
          "Xem báo cáo học viên",
          "Tạo nội dung bài học"
        ];
      case 'USER':
      default:
        return [
          "Làm bài thi mới",
          "Xem điểm số",
          "Học từ vựng",
          "Xem tiến trình"
        ];
    }
  },

  // Get user-specific data for chatbot payload
  getUserSpecificData: (user) => {
    if (!user) {
      return {
        userData: null,
        suggestions: ["Đăng ký", "Đăng nhập", "Tìm hiểu platform"],
        context: "guest_user"
      };
    }

    return {
      userData: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        registrationDate: user.createdAt
      },
      suggestions: ENHANCED_BOTPRESS_CONFIG.getRoleBasedSuggestions(user),
      context: `authenticated_${user.role.toLowerCase()}`
    };
  }
};

/**
 * Chat Session Manager
 */
class ChatSessionManager {
  constructor() {
    this.sessions = new Map();
    this.userContexts = new Map();
    this.currentUserId = null;
  }

  /**
   * Generate unique session ID for user
   */
  generateSessionId(userId = 'guest') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const userHash = userId.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `toeic_${userId}_${userHash}_${timestamp}_${random}`;
  }

  /**
   * Switch user and create new session
   */
  switchUser(user, currentPath = '/') {
    // Clear previous session if different user
    if (this.currentUserId && this.currentUserId !== (user?.id || 'guest')) {
      this.clearSession(this.currentUserId);
      console.log('🔄 Cleared previous user session:', this.currentUserId);
    }

    // Clear all sessions to force fresh start
    this.sessions.clear();
    this.userContexts.clear();
    console.log('🧹 All sessions cleared for user switch');

    // Set new current user
    this.currentUserId = user?.id || 'guest';
    
    // Create completely new session for user
    const newSessionId = this.generateSessionId(this.currentUserId);
    console.log('🆔 Generated new session for user:', {
      userId: this.currentUserId,
      sessionId: newSessionId,
      username: user?.username || 'Guest'
    });
    
    return newSessionId;
  }

  /**
   * Generate user-specific test data (mock data for demonstration)
   */
  generateUserTestData(user) {
    if (!user) {
      return {
        testHistory: [],
        progress: {
          averageScore: 0,
          totalTests: 0,
          strongAreas: [],
          weakAreas: []
        },
        recommendations: [
          "Đăng ký tài khoản để bắt đầu hành trình học TOEIC",
          "Làm bài test đầu tiên để đánh giá trình độ",
          "Khám phá các bài học từ cơ bản đến nâng cao"
        ]
      };
    }

    // Generate mock data based on user ID (in real app, fetch from API)
    const mockTestHistory = [
      {
        id: 1,
        type: 'Listening',
        score: 350 + (user.id % 100),
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: '45 mins'
      },
      {
        id: 2,
        type: 'Reading',
        score: 380 + (user.id % 80),
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: '75 mins'
      }
    ];

    const averageScore = mockTestHistory.reduce((sum, test) => sum + test.score, 0) / mockTestHistory.length;
    
    return {
      testHistory: mockTestHistory,
      progress: {
        averageScore: Math.round(averageScore),
        totalTests: mockTestHistory.length,
        strongAreas: averageScore > 400 ? ['Vocabulary', 'Grammar'] : ['Basic Grammar'],
        weakAreas: averageScore < 400 ? ['Listening Comprehension', 'Reading Speed'] : []
      },
      recommendations: this.getUserRecommendations(user, averageScore)
    };
  }

  /**
   * Get personalized recommendations based on user performance
   */
  getUserRecommendations(user, averageScore) {
    if (averageScore >= 450) {
      return [
        `Xuất sắc ${user.username}! Hãy thử các bài test nâng cao`,
        "Luyện tập với đề thi thực tế để duy trì phorm",
        "Chia sẻ kinh nghiệm với cộng đồng học viên"
      ];
    } else if (averageScore >= 350) {
      return [
        `Tiến bộ tốt ${user.username}! Tập trung vào điểm yếu`,
        "Luyện nghe 30 phút mỗi ngày",
        "Đọc các bài văn ngắn để cải thiện tốc độ"
      ];
    } else {
      return [
        `Chào ${user.username}! Hãy bắt đầu với các bài cơ bản`,
        "Học từ vựng cơ bản 20 từ/ngày",
        "Luyện nghe với đoạn hội thoại đơn giản"
      ];
    }
  }

  /**
   * Create or get existing session for user
   */
  getOrCreateSession(user, currentPath = '/') {
    const userId = user?.id || 'guest';
    const existingSessionId = this.sessions.get(userId);
    
    if (existingSessionId) {
      return existingSessionId;
    }

    const newSessionId = this.generateSessionId(userId);
    this.sessions.set(userId, newSessionId);
    
    // Store user context
    this.userContexts.set(newSessionId, {
      ...ENHANCED_BOTPRESS_CONFIG.getUserContext(user),
      currentPath,
      sessionStartTime: new Date().toISOString(),
      interactionCount: 0
    });

    return newSessionId;
  }

  /**
   * Update user context for session
   */
  updateContext(sessionId, updates) {
    const context = this.userContexts.get(sessionId);
    if (context) {
      this.userContexts.set(sessionId, {
        ...context,
        ...updates,
        lastUpdated: new Date().toISOString()
      });
    }
  }

  /**
   * Get session context
   */
  getSessionContext(sessionId) {
    return this.userContexts.get(sessionId) || {};
  }

  /**
   * Clear session for user
   */
  clearSession(userId) {
    const sessionId = this.sessions.get(userId);
    if (sessionId) {
      this.sessions.delete(userId);
      this.userContexts.delete(sessionId);
    }
  }

  /**
   * Clear all sessions (called on logout)
   */
  clearAllSessions() {
    console.log('🧹 Clearing all chat sessions...');
    this.sessions.clear();
    this.userContexts.clear();
    this.currentUserId = null;
    console.log('✅ All chat sessions cleared');
  }

  /**
   * Get user-specific data from backend/local storage
   */
  async getUserData(userId) {
    try {
      // Get user's test history, preferences, etc.
      const userData = {
        testHistory: await this.getTestHistory(userId),
        preferences: await this.getUserPreferences(userId),
        progress: await this.getUserProgress(userId),
        recentActivity: await this.getRecentActivity(userId)
      };
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Get test history for user
   */
  async getTestHistory(userId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/test-history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching test history:', error);
    }
    return [];
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId) {
    try {
      const preferences = localStorage.getItem(`user_preferences_${userId}`);
      return preferences ? JSON.parse(preferences) : {
        difficulty: 'medium',
        preferredTestType: 'full',
        studyGoal: 'improve_score',
        dailyTarget: 30
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return {};
    }
  }

  /**
   * Get user progress
   */
  async getUserProgress(userId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/user-progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
    return {};
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(userId) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/recent-activity/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
    return [];
  }

  /**
   * Get enhanced configuration with current context
   */
  getEnhancedConfig(user, currentPath = '/') {
    // Use switchUser to ensure fresh session
    const sessionId = this.switchUser(user, currentPath);
    
    // Create fresh context for new session
    const context = {
      userId: user?.id || 'guest',
      username: user?.username || 'Guest',
      role: user?.role || 'USER',
      isAuthenticated: !!user,
      currentPath,
      sessionStartTime: new Date().toISOString(),
      interactionCount: 0
    };

    // Get user-specific data (using mock data for demo)
    const userData = this.generateUserTestData(user);
    
    // Create personalized welcome message
    const personalizedWelcomeMessage = this.getPersonalizedWelcomeMessage(user, userData);
    
    // Get context-aware suggestions
    const contextSuggestions = this.getPersonalizedSuggestions(currentPath, user, userData);
    
    // Store context with fresh user data
    this.userContexts.set(sessionId, {
      ...context,
      userData,
      lastConfigUpdate: new Date().toISOString()
    });
    
    console.log('🎯 Enhanced config created:', {
      sessionId,
      userId: user?.id || 'guest',
      username: user?.username || 'Guest',
      hasTestHistory: !!userData?.testHistory?.length,
      averageScore: userData?.progress?.averageScore
    });
    
    return {
      sessionId,
      welcomeMessage: personalizedWelcomeMessage,
      suggestions: contextSuggestions,
      userContext: {
        ...context,
        userData
      },
      knowledgeBase: TOEIC_KNOWLEDGE_BASE
    };
  }

  /**
   * Get personalized welcome message based on user data
   */
  getPersonalizedWelcomeMessage(user, userData) {
    if (!user) {
      return ENHANCED_BOTPRESS_CONFIG.getWelcomeMessage(null);
    }

    const recentTests = userData?.testHistory?.slice(0, 3) || [];
    const averageScore = userData?.progress?.averageScore || 0;
    const testCount = userData?.testHistory?.length || 0;

    let message = `Xin chào ${user.username}! 👋\n\n`;

    if (testCount > 0) {
      message += `📊 Thống kê của bạn:\n`;
      message += `• Đã làm ${testCount} bài thi\n`;
      if (averageScore > 0) {
        message += `• Điểm trung bình: ${averageScore}/990\n`;
      }
      
      if (recentTests.length > 0) {
        const latestTest = recentTests[0];
        message += `• Bài thi gần nhất: ${latestTest.testType} - ${latestTest.score}/990\n`;
      }
      message += `\n`;
    }

    message += `🤖 Tôi có thể giúp bạn:\n`;
    message += `📚 Hướng dẫn học tập cá nhân hóa\n`;
    message += `📊 Phân tích kết quả và đề xuất cải thiện\n`;
    message += `🎯 Lên kế hoạch luyện thi hiệu quả\n`;
    message += `💡 Tips và tricks dựa trên điểm yếu của bạn\n\n`;
    message += `Bạn muốn làm gì hôm nay? 🚀`;

    return message;
  }

  /**
   * Get personalized suggestions based on user data
   */
  getPersonalizedSuggestions(currentPath, user, userData) {
    const baseSuggestions = ENHANCED_BOTPRESS_CONFIG.getContextSuggestions(currentPath, user);
    
    if (!user || !userData) {
      return baseSuggestions;
    }

    const personalizedSuggestions = [];

    // Suggestions based on test history
    if (userData.testHistory && userData.testHistory.length > 0) {
      const latestTest = userData.testHistory[0];
      if (latestTest.score < 500) {
        personalizedSuggestions.push("Tips cải thiện điểm số cơ bản");
      } else if (latestTest.score < 750) {
        personalizedSuggestions.push("Chiến lược đạt 750+ điểm");
      } else {
        personalizedSuggestions.push("Làm sao đạt 900+ điểm?");
      }

      // Suggest based on weak areas
      if (latestTest.listeningScore < latestTest.readingScore) {
        personalizedSuggestions.push("Cải thiện Listening");
      } else {
        personalizedSuggestions.push("Cải thiện Reading");
      }
    }

    // Suggestions based on preferences
    if (userData.preferences?.difficulty === 'easy') {
      personalizedSuggestions.push("Bài thi dễ cho người mới");
    } else if (userData.preferences?.difficulty === 'hard') {
      personalizedSuggestions.push("Thử thách với bài thi khó");
    }

    // Recent activity based suggestions
    if (userData.recentActivity) {
      const hasRecentTest = userData.recentActivity.some(activity => 
        activity.type === 'test_completed' && 
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      if (!hasRecentTest) {
        personalizedSuggestions.push("Làm bài thi để duy trì phong độ");
      }
    }

    return [...personalizedSuggestions.slice(0, 3), ...baseSuggestions.slice(0, 2)];
  }

  /**
   * Log interaction for analytics
   */
  logInteraction(sessionId, interaction) {
    const context = this.getSessionContext(sessionId);
    if (context) {
      context.interactionCount = (context.interactionCount || 0) + 1;
      context.lastInteraction = {
        timestamp: new Date().toISOString(),
        type: interaction.type || 'message',
        content: interaction.content || ''
      };
      this.updateContext(sessionId, context);
    }
  }
}

// Export singleton instance
export const chatSessionManager = new ChatSessionManager();

/**
 * Utility functions for Botpress integration
 */
export const BotpressUtils = {
  /**
   * Format user data for Botpress payload
   */
  formatUserPayload: (user) => ({
    userId: user?.id?.toString() || 'guest',
    userName: user?.username || 'Guest User',
    userRole: user?.role || 'USER',
    userEmail: user?.email || '',
    platform: 'LeEnglish TOEIC',
    timestamp: new Date().toISOString()
  }),

  /**
   * Get quick reply suggestions based on context
   */
  getQuickReplies: (currentPath) => {
    const commonReplies = [
      { title: "🏠 Về trang chủ", payload: "navigate_home" },
      { title: "📞 Liên hệ hỗ trợ", payload: "contact_support" },
      { title: "❓ FAQ", payload: "show_faq" }
    ];

    const contextReplies = {
      '/tests': [
        { title: "📝 Làm bài thi", payload: "start_test" },
        { title: "📊 Xem kết quả", payload: "view_results" }
      ],
      '/lessons': [
        { title: "📚 Chọn bài học", payload: "select_lesson" },
        { title: "🎯 Học từ vựng", payload: "learn_vocabulary" }
      ],
      '/dashboard': [
        { title: "📈 Xem tiến trình", payload: "view_progress" },
        { title: "🎯 Đề xuất học tập", payload: "study_recommendations" }
      ]
    };

    return [...(contextReplies[currentPath] || []), ...commonReplies];
  },

  /**
   * Handle specific TOEIC queries
   */
  handleTOEICQuery: (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Test-related queries
    if (lowerQuery.includes('bài thi') || lowerQuery.includes('test')) {
      return {
        type: 'test_info',
        content: TOEIC_KNOWLEDGE_BASE.testTypes,
        suggestions: ["Listening Test là gì?", "Reading Test khó không?", "Full Test mất bao lâu?"]
      };
    }
    
    // Learning tips
    if (lowerQuery.includes('học') || lowerQuery.includes('tips')) {
      return {
        type: 'learning_tips',
        content: TOEIC_KNOWLEDGE_BASE.tips,
        suggestions: ["Tips học Listening", "Cách học Reading", "Học từ vựng hiệu quả"]
      };
    }
    
    // Navigation help
    if (lowerQuery.includes('làm sao') || lowerQuery.includes('hướng dẫn')) {
      return {
        type: 'navigation_help',
        content: TOEIC_KNOWLEDGE_BASE.navigation,
        suggestions: ["Vào Dashboard", "Làm bài thi", "Xem Profile"]
      };
    }
    
    return null;
  }
};

// Default export
export default chatSessionManager;
