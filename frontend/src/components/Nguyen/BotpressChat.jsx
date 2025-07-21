import { useEffect } from 'react';

export default function BotpressChat() {
  useEffect(() => {
    // Check if scripts are already loaded
    if (document.querySelector('script[src*="botpress"]')) {
      return;
    }

    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
    injectScript.defer = true;
    injectScript.onload = () => {
      console.log('Botpress inject script loaded');
    };
    injectScript.onerror = () => {
      console.warn('Failed to load Botpress inject script');
    };
    document.body.appendChild(injectScript);

    const configScript = document.createElement('script');
    configScript.src = 'https://files.bpcontent.cloud/2025/06/27/05/20250627051442-UA3DI17D.js';
    configScript.defer = true;
    configScript.onload = () => {
      console.log('Botpress config script loaded');
    };
    configScript.onerror = () => {
      console.warn('Failed to load Botpress config script');
    };
    document.body.appendChild(configScript);

    return () => {
      // Cleanup function
      try {
        if (document.body.contains(injectScript)) {
          document.body.removeChild(injectScript);
        }
        if (document.body.contains(configScript)) {
          document.body.removeChild(configScript);
        }
      } catch (error) {
        console.warn('Error cleaning up Botpress scripts:', error);
      }
    };
  }, []);

  return null;
}
