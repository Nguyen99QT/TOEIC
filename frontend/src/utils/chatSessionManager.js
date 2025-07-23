// User-specific chatbot session manager
export class ChatSessionManager {
  constructor() {
    this.sessions = new Map();
  }

  // Generate unique session ID for user
  generateSessionId(user) {
    if (user) {
      return `toeic_user_${user.id}_${Date.now()}`;
    }
    return `toeic_guest_${Math.random()
      .toString(36)
      .substr(2, 9)}_${Date.now()}`;
  }

  // Get or create session for user
  getSession(user) {
    const userId = user ? user.id : "guest";

    if (!this.sessions.has(userId)) {
      const session = {
        id: this.generateSessionId(user),
        userId: userId,
        user: user,
        startTime: new Date().toISOString(),
        messages: [],
        context: this.buildUserContext(user),
      };
      this.sessions.set(userId, session);
    }

    return this.sessions.get(userId);
  }

  // Build user context for chatbot
  buildUserContext(user) {
    if (!user) {
      return {
        isGuest: true,
        permissions: ["basic_help"],
        membershipLevel: "free",
      };
    }

    return {
      isGuest: false,
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      membershipType: user.membershipType,
      permissions: this.getUserPermissions(user),
      membershipLevel: this.getMembershipLevel(user),
      joinedDate: user.createdAt,
      preferredLanguage: "vi",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  // Determine user permissions for chatbot features
  getUserPermissions(user) {
    const basePermissions = ["basic_help", "toeic_guidance"];

    if (user.role === "ADMIN") {
      return [
        ...basePermissions,
        "admin_tools",
        "system_info",
        "user_management",
      ];
    }

    if (user.membershipType === "PREMIUM") {
      return [
        ...basePermissions,
        "premium_content",
        "detailed_explanations",
        "priority_support",
      ];
    }

    return basePermissions;
  }

  // Get membership level for UI customization
  getMembershipLevel(user) {
    if (user?.role === "ADMIN") return "admin";
    if (user?.membershipType === "PREMIUM") return "premium";
    return "free";
  }

  // Save message to session history
  saveMessage(userId, message, sender = "user") {
    const session = this.sessions.get(userId);
    if (session) {
      session.messages.push({
        id: Date.now(),
        sender: sender,
        message: message,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 50 messages to avoid memory issues
      if (session.messages.length > 50) {
        session.messages = session.messages.slice(-50);
      }
    }
  }

  // Get chat configuration for specific user
  getChatConfig(user) {
    const session = this.getSession(user);
    const context = session.context;

    return {
      sessionId: session.id,
      userId: context.userId || "guest",
      userInfo: context,
      botName: user
        ? `TOEIC Assistant for ${user.username}`
        : "TOEIC Learning Assistant",
      botAvatar: this.getBotAvatar(context.membershipLevel),
      welcomeMessage: this.getWelcomeMessage(user, context),
      theme: this.getTheme(context.membershipLevel),
      features: this.getFeatures(context.permissions),
      language: context.preferredLanguage || "vi",
    };
  }

  // Get bot avatar based on membership
  getBotAvatar(membershipLevel) {
    switch (membershipLevel) {
      case "admin":
        return "https://via.placeholder.com/40x40/DC2626/white?text=A";
      case "premium":
        return "https://via.placeholder.com/40x40/FFD700/black?text=P";
      default:
        return "https://via.placeholder.com/40x40/4F46E5/white?text=T";
    }
  }

  // Get welcome message
  getWelcomeMessage(user, context) {
    if (!user) {
      return "Xin chào! Tôi là trợ lý TOEIC của LeEnglish. Đăng nhập để được hỗ trợ tốt hơn!";
    }

    const timeOfDay = this.getTimeOfDay();
    let greeting = `${timeOfDay} ${user.username}! `;

    if (context.membershipLevel === "premium") {
      greeting += "⭐ Cảm ơn bạn là thành viên Premium! ";
    } else if (context.membershipLevel === "admin") {
      greeting += "🛡️ Xin chào Admin! ";
    }

    return greeting + "Tôi có thể giúp gì cho bạn về TOEIC hôm nay?";
  }

  // Get theme based on membership
  getTheme(membershipLevel) {
    switch (membershipLevel) {
      case "admin":
        return {
          primaryColor: "#DC2626",
          backgroundColor: "#ffffff",
          textColor: "#1F2937",
          headerColor: "#FEF2F2",
        };
      case "premium":
        return {
          primaryColor: "#FFD700",
          backgroundColor: "#ffffff",
          textColor: "#1F2937",
          headerColor: "#FFFBEB",
        };
      default:
        return {
          primaryColor: "#4F46E5",
          backgroundColor: "#ffffff",
          textColor: "#1F2937",
          headerColor: "#F0F9FF",
        };
    }
  }

  // Get features based on permissions
  getFeatures(permissions) {
    return {
      fileUpload: permissions.includes("admin_tools"),
      voiceInput: permissions.includes("premium_content"),
      history: !permissions.includes("basic_help") || permissions.length > 2,
      typing: true,
      fullscreen: permissions.includes("premium_content"),
      downloadChat: permissions.includes("admin_tools"),
    };
  }

  // Utility to get time of day
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }

  // Clear session (on logout)
  clearSession(userId) {
    this.sessions.delete(userId);
  }

  // Clear all sessions
  clearAllSessions() {
    this.sessions.clear();
  }
}

// Export singleton instance
export const chatSessionManager = new ChatSessionManager();
