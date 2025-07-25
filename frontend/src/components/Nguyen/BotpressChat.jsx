import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { chatSessionManager } from '../../utils/chatSessionManager';

export default function BotpressChat() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  // Function to reinitialize chat with new user data
  const reinitializeChatWithUserData = useCallback(async (config) => {
    try {
      // Close existing chat
      if (window.botpressWebChat) {
        window.botpressWebChat.close();
      }

      // Create user-specific configuration
      const botpressConfig = {
        botId: 'UA3DI17D',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v0/inject.js',
        messagingUrl: 'https://messaging.botpress.cloud',
        clientId: 'UA3DI17D',
        sessionId: config.sessionId,
        userContext: config.userContext,
        theme: {
          primaryColor: '#2563eb',
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        // Pass user data to bot context
        payload: {
          userId: currentUser?.id || 'guest',
          userName: currentUser?.username || 'Guest User',
          userRole: currentUser?.role || 'USER',
          userEmail: currentUser?.email || '',
          welcomeMessage: config.welcomeMessage,
          suggestions: config.suggestions,
          userData: config.userContext.userData,
          platform: 'LeEnglish TOEIC',
          timestamp: new Date().toISOString()
        }
      };

      // Initialize with new config
      window.botpressWebChat.init(botpressConfig);
      
      console.log('✅ Chat reinitialized with user data:', {
        sessionId: config.sessionId,
        hasTestHistory: !!config.userContext.userData?.testHistory?.length,
        averageScore: config.userContext.userData?.progress?.averageScore,
        testCount: config.userContext.userData?.testHistory?.length || 0
      });
      
      setChatInitialized(true);
    } catch (error) {
      console.error('Error reinitializing chat:', error);
      setError('Failed to reinitialize chat');
    }
  }, [currentUser]);

  // Configure chat for current user
  const configureBotpressForUser = useCallback(async () => {
    try {
      if (!window.botpressWebChat) {
        console.warn('⚠️ Botpress not yet loaded, retrying...');
        setTimeout(configureBotpressForUser, 1000);
        return;
      }

      // Get user-specific configuration
      const config = chatSessionManager.getEnhancedConfig(currentUser, location.pathname);
      
      console.log('🔄 Configuring chat for user:', {
        user: currentUser?.username || 'Guest',
        sessionId: config.sessionId,
        path: location.pathname
      });

      // Initialize with user configuration
      await reinitializeChatWithUserData(config);
      
    } catch (error) {
      console.error('Error configuring chat for user:', error);
      setError('Failed to configure chat');
    }
  }, [currentUser, location.pathname, reinitializeChatWithUserData]);

  // Initialize or switch user session when user changes
  useEffect(() => {
    if (chatInitialized) {
      configureBotpressForUser();
    }
  }, [currentUser, location.pathname, chatInitialized, configureBotpressForUser]); // Re-run when user or path changes

  // Load Botpress scripts and initialize
  useEffect(() => {
    setLoading(true);

    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.getElementById(id)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.defer = true;
        script.onload = () => {
          console.log(`✅ ${id} loaded successfully`);
          resolve();
        };
        script.onerror = () => {
          console.error(`❌ Failed to load ${id}`);
          reject(new Error(`Failed to load ${id}`));
        };
        document.body.appendChild(script);
      });
    };

    const loadBotpress = async () => {
      try {
        // Load inject script first
        await loadScript(
          'https://cdn.botpress.cloud/webchat/v3.0/inject.js',
          'botpress-inject'
        );

        // Then load config script
        await loadScript(
          'https://files.bpcontent.cloud/2025/06/27/05/20250627051442-UA3DI17D.js',
          'botpress-config'
        );

        console.log('🤖 Botpress chatbot loaded successfully');
        setChatInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to load Botpress:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadBotpress, 1000);

    return () => {
      clearTimeout(timer);
      // Cleanup function - remove scripts if needed
      try {
        const injectScript = document.getElementById('botpress-inject');
        const configScript = document.getElementById('botpress-config');

        if (injectScript && document.body.contains(injectScript)) {
          document.body.removeChild(injectScript);
        }
        if (configScript && document.body.contains(configScript)) {
          document.body.removeChild(configScript);
        }
      } catch (error) {
        console.warn('⚠️ Error cleaning up Botpress scripts:', error);
      }
    };
  }, []); // Only run once on mount

  // Cleanup session when component unmounts or user logs out
  useEffect(() => {
    return () => {
      if (currentUser) {
        chatSessionManager.clearSession(currentUser.id);
      } else {
        chatSessionManager.clearSession('guest');
      }
    };
  }, [currentUser]);

  // Optional: Show loading state or error
  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-800">Loading chatbot...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg max-w-sm">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">⚠️</span>
          <span className="text-sm text-red-800">Chatbot unavailable</span>
        </div>
      </div>
    );
  }

  return null;
}
