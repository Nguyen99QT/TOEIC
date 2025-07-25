/**
 * Authentication Helper Utilities
 * 
 * Utilities to manage authentication flags and debugging
 */

export const clearAuthFlags = () => {
  const flagsToRemove = [
    'auth_just_logged_in',
    'toeic_login_success',
    'auth_login_timestamp'
  ];
  
  flagsToRemove.forEach(flag => {
    localStorage.removeItem(flag);
  });
  
  console.log('🧹 Cleared authentication flags:', flagsToRemove);
};

export const setLoginFlags = () => {
  localStorage.setItem('auth_just_logged_in', 'true');
  localStorage.setItem('toeic_login_success', 'true');
  localStorage.setItem('auth_login_timestamp', Date.now().toString());
  
  console.log('🏁 Set login flags for navigation protection');
};

export const checkAuthState = () => {
  const authState = {
    hasToken: !!localStorage.getItem('toeic_access_token'),
    hasUser: !!localStorage.getItem('toeic_current_user'),
    hasRefreshToken: !!localStorage.getItem('toeic_refresh_token'),
    justLoggedIn: !!localStorage.getItem('auth_just_logged_in'),
    loginSuccess: !!localStorage.getItem('toeic_login_success'),
    loginTimestamp: localStorage.getItem('auth_login_timestamp'),
    isRecentLogin: false
  };
  
  if (authState.loginTimestamp) {
    const timestamp = parseInt(authState.loginTimestamp);
    authState.isRecentLogin = (Date.now() - timestamp) < 15000; // 15 seconds
  }
  
  return authState;
};

export const debugAuthState = () => {
  const state = checkAuthState();
  console.log('🔍 Current Auth State:', state);
  return state;
};

// Make functions available globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).authHelpers = {
    clearAuthFlags,
    setLoginFlags,
    checkAuthState,
    debugAuthState
  };
}
