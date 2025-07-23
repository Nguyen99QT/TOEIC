import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatSessionManager } from '../../utils/chatSessionManager';

export default function BotpressChat() {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  useEffect(() => {
    // Check if scripts are already loaded
    if (document.querySelector('script[src*="botpress"]')) {
      console.log('Botpress already loaded');
      return;
    }

    setLoading(true);
    setError(null);

    // Configure Botpress for specific user
    const configureBotpressForUser = () => {
      if (window.botpressWebChat) {
        // Use ChatSessionManager to get user-specific config
        const config = chatSessionManager.getChatConfig(currentUser);

        // Initialize chat with user config
        window.botpressWebChat.init(config);
        setChatInitialized(true);
        console.log('🤖 Botpress configured for user:', currentUser?.username || 'Guest');
        console.log('📊 Session ID:', config.sessionId);
        console.log('🎨 Theme:', config.theme.primaryColor);
        console.log('⚙️ Features:', Object.keys(config.features).filter(key => config.features[key]));
      }
    };

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

        // Configure for current user after loading
        setTimeout(() => {
          configureBotpressForUser();
        }, 500); // Small delay to ensure scripts are fully initialized

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
  }, [currentUser, isAuthenticated]); // Re-run when user changes

  // Separate effect to reconfigure chat when user login status changes
  useEffect(() => {
    if (chatInitialized && window.botpressWebChat) {
      // Get new configuration for current user
      const newConfig = chatSessionManager.getChatConfig(currentUser);

      // Update chat configuration
      if (window.botpressWebChat.updateConfig) {
        window.botpressWebChat.updateConfig(newConfig);
        console.log('🔄 Botpress reconfigured for user:', currentUser?.username || 'Guest');
        console.log('🆔 New Session ID:', newConfig.sessionId);
      } else {
        // Fallback: reinitialize if update not available
        window.botpressWebChat.init(newConfig);
        console.log('🔄 Botpress reinitialized for user:', currentUser?.username || 'Guest');
      }
    }
  }, [currentUser, isAuthenticated, chatInitialized]);

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
