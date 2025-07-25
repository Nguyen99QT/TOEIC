// Quick authentication test utilities
// Run these in browser console for debugging

console.log('🔧 Loading auth test utilities...');

window.authTest = {
  // Test current authentication state
  checkState: () => {
    const tokens = {
      toeic_access_token: localStorage.getItem('toeic_access_token'),
      authToken: localStorage.getItem('authToken'),
      accessToken: localStorage.getItem('accessToken'),
      token: localStorage.getItem('token')
    };
    
    const users = {
      toeic_current_user: localStorage.getItem('toeic_current_user'),
      currentUser: localStorage.getItem('currentUser'),
      user: localStorage.getItem('user')
    };
    
    const flags = {
      auth_just_logged_in: localStorage.getItem('auth_just_logged_in'),
      toeic_login_success: localStorage.getItem('toeic_login_success'),
      auth_login_timestamp: localStorage.getItem('auth_login_timestamp')
    };
    
    console.log('🔍 Auth Test - Current State:', {
      tokens: Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, v ? `${v.substring(0, 30)}...` : 'MISSING'])),
      users: Object.fromEntries(Object.entries(users).map(([k, v]) => [k, v ? JSON.parse(v).username : 'MISSING'])),
      flags,
      hasAnyToken: Object.values(tokens).some(v => v),
      hasAnyUser: Object.values(users).some(v => v)
    });
    
    return { tokens, users, flags };
  },
  
  // Quick login test
  quickLogin: async (username = 'admin', password = 'password') => {
    console.log(`🧪 Quick login test: ${username}`);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Login API response:', data);
      
      // Store with all possible keys
      const token = data.token || data.accessToken;
      if (token) {
        localStorage.setItem('toeic_access_token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('token', token);
      }
      
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.username,
        role: data.roles?.[0]?.replace('ROLE_', '') || 'USER',
        membershipType: 'FREE'
      };
      
      localStorage.setItem('toeic_current_user', JSON.stringify(userData));
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set navigation flags
      localStorage.setItem('auth_just_logged_in', 'true');
      localStorage.setItem('toeic_login_success', 'true');
      localStorage.setItem('auth_login_timestamp', Date.now().toString());
      
      console.log('✅ All auth data stored successfully');
      console.log('🔄 Reloading page in 2 seconds...');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Quick login failed:', error);
    }
  },
  
  // Force navigation to dashboard
  goToDashboard: () => {
    console.log('🔄 Navigating to dashboard...');
    window.location.href = '/dashboard';
  },
  
  // Clear all auth data
  clearAll: () => {
    const keys = [
      'toeic_access_token', 'authToken', 'accessToken', 'token',
      'toeic_current_user', 'currentUser', 'user',
      'toeic_refresh_token', 'refreshToken',
      'auth_just_logged_in', 'toeic_login_success', 'auth_login_timestamp'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🧹 Cleared all auth data');
  }
};

console.log('✅ Auth test utilities loaded!');
console.log('📋 Available commands:');
console.log('  - authTest.checkState() - Check current auth state');
console.log('  - authTest.quickLogin() - Quick login as admin');
console.log('  - authTest.quickLogin("teacher2", "password123") - Login as teacher2');
console.log('  - authTest.goToDashboard() - Navigate to dashboard');
console.log('  - authTest.clearAll() - Clear all auth data');
