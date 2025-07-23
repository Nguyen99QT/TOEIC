import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ChatbotManager = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    // Auto-show chat for new users or when they need help
    const hasSeenChat = localStorage.getItem('botpress_chat_seen');

    if (!hasSeenChat && isAuthenticated) {
      // Show chat hint for new users
      const timer = setTimeout(() => {
        setIsChatVisible(true);
        localStorage.setItem('botpress_chat_seen', 'true');
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Send user context to chatbot when user logs in
  useEffect(() => {
    if (currentUser && window.bp && window.bp.sendEvent) {
      try {
        window.bp.sendEvent({
          type: 'user-context',
          payload: {
            userId: currentUser.id,
            username: currentUser.username,
            membershipType: currentUser.membershipType,
            role: currentUser.role
          }
        });
        console.log('🤖 User context sent to chatbot');
      } catch (error) {
        console.warn('⚠️ Failed to send user context to chatbot:', error);
      }
    }
  }, [currentUser]);

  // Chatbot hint notification
  if (isChatVisible && isAuthenticated) {
    return (
      <div className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 shadow-2xl max-w-sm animate-bounce">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-1">
              👋 Xin chào {currentUser?.username}!
            </h3>
            <p className="text-xs opacity-90">
              Tôi là trợ lý AI của LeEnglish. Có thể giúp gì cho bạn?
            </p>
          </div>
          <button
            onClick={() => setIsChatVisible(false)}
            className="text-white/70 hover:text-white ml-2"
          >
            ×
          </button>
        </div>
        <div className="mt-2">
          <button
            onClick={() => {
              setIsChatVisible(false);
              // Programmatically open chatbot if possible
              if (window.bp && window.bp.showWidget) {
                window.bp.showWidget();
              }
            }}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
          >
            Bắt đầu trò chuyện 💬
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatbotManager;
