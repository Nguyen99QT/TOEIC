import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useBotpress = () => {
  const { currentUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Send user context to chatbot
  const sendUserContext = useCallback(() => {
    if (currentUser && window.bp && isLoaded) {
      try {
        window.bp.sendEvent({
          type: "user-context",
          payload: {
            userId: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            membershipType: currentUser.membershipType,
            role: currentUser.role,
            isAuthenticated: true,
          },
        });
        console.log("🤖 User context sent to Botpress");
      } catch (error) {
        console.warn("⚠️ Failed to send user context:", error);
      }
    }
  }, [currentUser, isLoaded]);

  // Open chatbot programmatically
  const openChat = useCallback(() => {
    if (window.bp && window.bp.showWidget) {
      window.bp.showWidget();
    } else {
      console.warn("⚠️ Botpress widget not available");
    }
  }, []);

  // Close chatbot programmatically
  const closeChat = useCallback(() => {
    if (window.bp && window.bp.hideWidget) {
      window.bp.hideWidget();
    }
  }, []);

  // Send custom message/event to chatbot
  const sendMessage = useCallback((message, type = "text") => {
    if (window.bp && window.bp.sendEvent) {
      window.bp.sendEvent({
        type: type,
        payload: { text: message },
      });
    }
  }, []);

  // Listen for Botpress events
  useEffect(() => {
    const handleBotpressReady = () => {
      setIsLoaded(true);
      setError(null);
      console.log("🤖 Botpress is ready");
    };

    const handleBotpressError = (error) => {
      setError(error);
      console.error("❌ Botpress error:", error);
    };

    // Listen for Botpress ready event
    window.addEventListener("bp:ready", handleBotpressReady);
    window.addEventListener("bp:error", handleBotpressError);

    return () => {
      window.removeEventListener("bp:ready", handleBotpressReady);
      window.removeEventListener("bp:error", handleBotpressError);
    };
  }, []);

  // Send user context when user changes or chatbot loads
  useEffect(() => {
    if (isLoaded && currentUser) {
      sendUserContext();
    }
  }, [isLoaded, currentUser, sendUserContext]);

  return {
    isLoaded,
    error,
    openChat,
    closeChat,
    sendMessage,
    sendUserContext,
  };
};
