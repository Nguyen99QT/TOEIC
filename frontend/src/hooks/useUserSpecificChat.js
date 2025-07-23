import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { chatSessionManager } from "../utils/chatSessionManager";

export const useUserSpecificChat = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Get current user's chat session
  const getUserSession = useCallback(() => {
    return chatSessionManager.getSession(currentUser);
  }, [currentUser]);

  // Send message with user context
  const sendMessageWithContext = useCallback(
    (message, type = "text") => {
      const session = getUserSession();

      if (window.botpressWebChat && window.botpressWebChat.sendEvent) {
        window.botpressWebChat.sendEvent({
          type: type,
          sessionId: session.id,
          payload: {
            text: message,
            userContext: session.context,
          },
        });

        // Save to session history
        chatSessionManager.saveMessage(
          currentUser ? currentUser.id : "guest",
          message,
          "user"
        );
      }
    },
    [currentUser, getUserSession]
  );

  // Open chat with user-specific greeting
  const openChatWithGreeting = useCallback(() => {
    const session = getUserSession();

    if (window.botpressWebChat) {
      if (window.botpressWebChat.showWidget) {
        window.botpressWebChat.showWidget();
      }

      // Send personalized greeting based on user context
      setTimeout(() => {
        const greeting = getPersonalizedGreeting(session.context);
        if (greeting && window.botpressWebChat.sendEvent) {
          window.botpressWebChat.sendEvent({
            type: "greeting",
            sessionId: session.id,
            payload: { text: greeting },
          });
        }
      }, 1000);
    }
  }, [getUserSession]);

  // Get personalized help topics based on user
  const getHelpTopics = useCallback(() => {
    const context = getUserSession().context;
    const baseTopics = [
      "TOEIC Test Structure",
      "Study Tips",
      "Practice Questions",
    ];

    if (context.membershipLevel === "premium") {
      return [
        ...baseTopics,
        "Advanced Strategies",
        "Detailed Explanations",
        "Progress Analytics",
      ];
    }

    if (context.membershipLevel === "admin") {
      return [
        ...baseTopics,
        "Content Management",
        "User Analytics",
        "System Settings",
      ];
    }

    return baseTopics;
  }, [getUserSession]);

  // Clear chat history (privacy feature)
  const clearChatHistory = useCallback(() => {
    const userId = currentUser ? currentUser.id : "guest";
    chatSessionManager.clearSession(userId);

    if (window.botpressWebChat && window.botpressWebChat.clearHistory) {
      window.botpressWebChat.clearHistory();
    }
  }, [currentUser]);

  // Get chat statistics
  const getChatStats = useCallback(() => {
    const session = getUserSession();
    return {
      sessionId: session.id,
      messageCount: session.messages.length,
      sessionDuration: Date.now() - new Date(session.startTime).getTime(),
      userType: session.context.membershipLevel,
      permissions: session.context.permissions,
    };
  }, [getUserSession]);

  return {
    getUserSession,
    sendMessageWithContext,
    openChatWithGreeting,
    getHelpTopics,
    clearChatHistory,
    getChatStats,
    isAuthenticated,
    currentUser,
  };
};

// Helper function for personalized greetings
const getPersonalizedGreeting = (context) => {
  if (!context || context.isGuest) {
    return "Xin chào! Hãy đăng nhập để được trợ giúp tốt hơn về TOEIC.";
  }

  const timeOfDay = getTimeOfDay();
  const { username, membershipLevel, role } = context;

  let greeting = `${timeOfDay} ${username}! `;

  if (membershipLevel === "admin") {
    greeting +=
      "🛡️ Bạn có thể hỏi tôi về quản lý hệ thống hoặc nội dung TOEIC.";
  } else if (membershipLevel === "premium") {
    greeting +=
      "⭐ Với tài khoản Premium, bạn có quyền truy cập tất cả tính năng cao cấp!";
  } else {
    greeting += "Tôi có thể giúp bạn với các câu hỏi cơ bản về TOEIC.";
  }

  return greeting;
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};
