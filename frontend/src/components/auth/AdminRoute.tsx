import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();

  console.log('🔍 AdminRoute Debug:', {
    loading,
    isAuthenticated,
    currentUser: currentUser ? {
      id: currentUser.id,
      username: currentUser.username,
      role: currentUser.role
    } : null,
    pathname: location.pathname
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ AdminRoute: Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 AdminRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (!currentUser || currentUser.role !== 'ADMIN') {
    console.log('🚫 AdminRoute: Access denied - User role is', currentUser?.role, 'Expected: ADMIN');
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has admin role
  console.log('✅ AdminRoute: Access granted for admin user:', currentUser.username);
  return <>{children}</>;
};

export default AdminRoute; 