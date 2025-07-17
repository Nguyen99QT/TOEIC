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
  }, [isAuthenticated, loading, requireAuth, location.pathname, currentUser]);

  // Show loading while auth is being determined
  if (loading) {
    console.log('⏳ ProtectedRoute: Waiting for auth...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Handle routes that require authentication
  if (requireAuth && !isAuthenticated) {
    console.log('🔒 ProtectedRoute: Authentication required');

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