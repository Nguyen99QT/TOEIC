// Debug utility to check authentication state
export const debugAuthState = () => {
  console.log('=== AUTH DEBUG STATE ===');

  const token = localStorage.getItem('toeic_access_token');
  const userStr = localStorage.getItem('toeic_current_user');

  console.log('LocalStorage:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
    hasUser: !!userStr,
    userStr: userStr
  });

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('Parsed User:', {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        roles: user.roles,
        membershipType: user.membershipType,
        isPremium: user.isPremium
      });
    } catch (error) {
      console.error('Failed to parse user:', error);
    }
  }

  if (token) {
    try {
      // Decode JWT payload (basic decode without verification)
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        // Add padding if needed
        const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decoded = JSON.parse(atob(padded));
        console.log('JWT Payload:', decoded);
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }

  console.log('=== END AUTH DEBUG ===');
};

// Make it available globally for browser console
(window as any).debugAuthState = debugAuthState;
