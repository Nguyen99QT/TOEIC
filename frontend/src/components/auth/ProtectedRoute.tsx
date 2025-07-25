import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import LoginPrompt from './LoginPrompt';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showLoginPrompt?: boolean;
  promptTitle?: string;
  promptMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  showLoginPrompt = true,
  promptTitle,
  promptMessage
}) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('🛡️ ProtectedRoute Check:', {
      isAuthenticated,
      loading,
      requireAuth,
      currentPath: location.pathname,
      currentUser: currentUser?.username || 'none'
    });

    // Debug localStorage authentication data with actual checks
    const actualToken = localStorage.getItem('toeic_access_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
    const actualUser = localStorage.getItem('toeic_current_user') || localStorage.getItem('currentUser');
    
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debug localStorage auth data:', {
        token: actualToken ? 'EXISTS' : 'MISSING',
        tokenPreview: actualToken ? actualToken.substring(0, 30) + '...' : 'NONE',
        refreshToken: localStorage.getItem('toeic_refresh_token') ? 'EXISTS' : 'MISSING',
        user: actualUser ? 'EXISTS' : 'MISSING',
        userPreview: actualUser ? JSON.parse(actualUser).username : 'NONE',
        legacyToken: localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING',
        legacyUser: localStorage.getItem('currentUser') ? 'EXISTS' : 'MISSING',
        justLoggedIn: localStorage.getItem('auth_just_logged_in') ? 'EXISTS' : 'MISSING',
        loginSuccess: localStorage.getItem('toeic_login_success') ? 'EXISTS' : 'MISSING',
        loginTimestamp: localStorage.getItem('auth_login_timestamp') ? 'EXISTS' : 'MISSING'
      });
    }
  }, [isAuthenticated, loading, requireAuth, location.pathname, currentUser]);

  // Check for recent login flags - use more robust token/user detection
  const actualToken = localStorage.getItem('toeic_access_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
  const actualUser = localStorage.getItem('toeic_current_user') || localStorage.getItem('currentUser');
  const justLoggedIn = localStorage.getItem('auth_just_logged_in');
  const loginSuccess = localStorage.getItem('toeic_login_success');
  const loginTimestamp = localStorage.getItem('auth_login_timestamp');
  const hasValidTokens = actualToken && actualUser;
  
  // Check if login was very recent (within last 15 seconds)
  const isVeryRecentLogin = loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 15000;

  // Show loading while auth is being determined
  if (loading) {
    console.log('⏳ ProtectedRoute: Waiting for auth...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user just logged in with valid tokens, allow access temporarily while AuthContext catches up
  if ((justLoggedIn || loginSuccess || isVeryRecentLogin) && hasValidTokens && !isAuthenticated) {
    console.log('🔧 ProtectedRoute: Recent login detected with valid tokens, allowing temporary access');
    
    // Clean up flags after a delay
    setTimeout(() => {
      localStorage.removeItem('auth_just_logged_in');
      localStorage.removeItem('toeic_login_success');
    }, 10000);
    
    return <>{children}</>;
  }

  // TEMPORARY DEBUG: Show authentication bypass button in development
  if (process.env.NODE_ENV === 'development' && requireAuth && !isAuthenticated) {
    console.log('🔧 Development mode: Showing auth bypass option');

    const handleBypassAuth = () => {
      console.log('🔧 Bypassing authentication for development');
      // Create a temporary test user
      const testUser = {
        id: 999,
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        membershipType: 'FREE',
        role: 'USER',
        isPremium: false,
        isActive: true
      };

      // Create a proper JWT-like token for development
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: testUser.username,
        userId: testUser.id,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
        iat: Math.floor(Date.now() / 1000),
        dev: true
      }));
      const signature = btoa('dev-signature-not-verified');
      const testToken = `${header}.${payload}.${signature}`;

      // Store in localStorage
      localStorage.setItem('toeic_current_user', JSON.stringify(testUser));
      localStorage.setItem('toeic_access_token', testToken);
      localStorage.setItem('toeic_refresh_token', `${header}.${payload}.refresh-signature`);

      console.log('🔧 Created development token:', testToken.substring(0, 50) + '...');

      // Reload page to trigger auth check
      window.location.reload();
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
            🔧 Development Mode
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Authentication required to access this page
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBypassAuth}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              🔧 Bypass Auth (Dev Only)
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              🔐 Go to Login
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              🗑️ Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle routes that require authentication
  if (requireAuth && !isAuthenticated) {
    console.log('🔒 ProtectedRoute: Authentication required, redirecting to login');
    console.log('🔍 Current auth state:', { 
      isAuthenticated, 
      loading, 
      hasCurrentUser: !!currentUser,
      currentPath: location.pathname 
    });

    // Show login prompt for better UX
    if (showLoginPrompt) {
      return (
        <LoginPrompt
          title={promptTitle}
          message={promptMessage}
        />
      );
    }

    // Fallback to direct redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle routes that don't require authentication (like login page)
  if (!requireAuth) {
    console.log('🔓 ProtectedRoute: Public route, access granted');
    return <>{children}</>;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;