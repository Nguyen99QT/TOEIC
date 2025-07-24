/**
 * ================================================================
 * USE TOKEN VALIDATION HOOK
 * ================================================================
 * React hook for automatic token validation and authentication handling
 */

import { useEffect, useState } from "react";
import { checkAndClearInvalidTokens } from "../utils/tokenValidation";

interface UseTokenValidationOptions {
  enabled?: boolean;
  onAuthFailure?: () => void;
}

interface UseTokenValidationResult {
  isValidating: boolean;
  isAuthenticated: boolean | null;
  checkTokens: () => Promise<void>;
}

/**
 * Hook to automatically validate tokens and handle authentication state
 */
export const useTokenValidation = (
  options: UseTokenValidationOptions = {}
): UseTokenValidationResult => {
  const { enabled = true, onAuthFailure } = options;
  const [isValidating, setIsValidating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkTokens = async () => {
    if (!enabled) return;

    setIsValidating(true);

    try {
      const shouldLogout = await checkAndClearInvalidTokens();

      if (shouldLogout) {
        setIsAuthenticated(false);
        onAuthFailure?.();
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("❌ Token validation error:", error);
      setIsAuthenticated(false);
      onAuthFailure?.();
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      checkTokens();
    }
  }, [enabled]);

  return {
    isValidating,
    isAuthenticated,
    checkTokens,
  };
};

export default useTokenValidation;
