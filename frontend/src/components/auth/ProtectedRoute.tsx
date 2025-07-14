import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
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
    console.log('🔒 ProtectedRoute: Authentication required, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⚡ REMOVED: Redirect logic for non-auth routes - handled in App.tsx instead

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;