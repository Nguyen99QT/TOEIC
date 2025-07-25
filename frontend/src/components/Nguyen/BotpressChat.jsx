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
      // Close existing chat and clear data
      if (window.botpressWebChat) {
        // Force close and destroy previous instance
        window.botpressWebChat.close();
        window.botpressWebChat.destroy?.();
        
        // Clear any cached data
        if (window.botpressWebChat.store) {
          window.botpressWebChat.store.clear?.();
        }
        
        // Remove from DOM
        const chatContainer = document.querySelector('#bp-web-widget');
        if (chatContainer) {
          chatContainer.remove();
        }
        
        // Clear window reference
        delete window.botpressWebChat;
        
        console.log('🧹 Previous chat instance cleared');
      }

      // Wait a moment before reinitializing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create user-specific configuration with unique session
      const botpressConfig = {
        botId: 'UA3DI17D',
        hostUrl: 'https://cdn.botpress.cloud/webchat/v0/inject.js',
        messagingUrl: 'https://messaging.botpress.cloud',
        clientId: 'UA3DI17D',
        sessionId: config.sessionId + '_' + Date.now(), // Make session unique
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

      // Reinitialize with new config
      if (window.botpressWebChat && typeof window.botpressWebChat.init === 'function') {
        window.botpressWebChat.init(botpressConfig);
      } else {
        // If botpress not loaded yet, reload scripts
        await reloadBotpressScripts();
        if (window.botpressWebChat) {
          window.botpressWebChat.init(botpressConfig);
        }
      }
      
      console.log('✅ Chat reinitialized with fresh user data:', {
        sessionId: config.sessionId,
        userId: currentUser?.id || 'guest',
        username: currentUser?.username || 'Guest',
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
    if (currentUser && chatInitialized) {
      // User logged in or switched
      configureBotpressForUser();
    } else if (!currentUser && chatInitialized) {
      // User logged out - cleanup chatbot immediately
      console.log('🔄 User logged out, cleaning up chatbot...');
      
      // Clear chat session
      if (window.botpressWebChat) {
        try {
          window.botpressWebChat.close();
          window.botpressWebChat.destroy?.();
          
          // Clear any cached data
          if (window.botpressWebChat.store) {
            window.botpressWebChat.store.clear?.();
          }
          
          // Remove from DOM
          const chatContainer = document.querySelector('#bp-web-widget');
          if (chatContainer) {
            chatContainer.remove();
          }
          
          // Clear window reference
          delete window.botpressWebChat;
          
          console.log('🧹 Chatbot cleaned up after logout');
        } catch (error) {
          console.warn('⚠️ Error cleaning up chatbot:', error);
        }
      }
      
      // Reset component state
      setChatInitialized(false);
      setLoading(false);
      setError(null);
      
      // Clear session manager data
      chatSessionManager.clearAllSessions();
    }
  }, [currentUser, location.pathname, chatInitialized, configureBotpressForUser]); // Re-run when user or path changes

  // Load Botpress scripts and initialize
  useEffect(() => {
    // Chỉ load khi user đã đăng nhập
    if (!currentUser) {
      return;
    }

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
  }, [currentUser]); // Run when currentUser changes

  // Cleanup session when component unmounts or user logs out
  useEffect(() => {
    return () => {
      if (currentUser) {
        chatSessionManager.clearSession(currentUser.id);
      }
    };
  }, [currentUser]);

  // Cleanup chatbot when user logs out
  useEffect(() => {
    if (!currentUser && window.botpressWebChat) {
      try {
        window.botpressWebChat.close();
        window.botpressWebChat.destroy?.();
        
        // Remove from DOM
        const chatContainer = document.querySelector('#bp-web-widget');
        if (chatContainer) {
          chatContainer.remove();
        }
        
        // Clear window reference
        delete window.botpressWebChat;
        
        console.log('🧹 Chatbot cleaned up - no user');
      } catch (error) {
        console.warn('⚠️ Error cleaning up chatbot on logout:', error);
      }
    }
  }, [currentUser]);

  // Chỉ hiển thị chatbot khi user đã đăng nhập
  if (!currentUser) {
    return null;
  }

  // Function to reload Botpress scripts
  const reloadBotpressScripts = async () => {
    try {
      // Remove existing scripts
      const existingInject = document.getElementById('botpress-inject');
      const existingConfig = document.getElementById('botpress-config');
      
      if (existingInject) {
        existingInject.remove();
      }
      if (existingConfig) {
        existingConfig.remove();
      }

      // Load inject script
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'botpress-inject';
        script.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      // Load config script
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'botpress-config';
        script.src = 'https://files.bpcontent.cloud/2025/06/27/05/20250627051442-UA3DI17D.js';
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      console.log('🔄 Botpress scripts reloaded');
    } catch (error) {
      console.error('Error reloading Botpress scripts:', error);
      throw error;
    }
  };

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
