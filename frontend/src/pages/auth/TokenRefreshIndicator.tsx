import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TokenRefreshIndicator: React.FC = () => {
  const { isRefreshing, refreshToken } = useAuth();

  useEffect(() => {
    // Automatically refresh token on initial load
    if (isRefreshing) {
      refreshToken();
    }
  }, [isRefreshing, refreshToken]);

  if (!isRefreshing) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-2">
      <LoadingSpinner />
      <span className="text-sm text-gray-600">Refreshing token...</span>
    </div>
  );
};

export default TokenRefreshIndicator;
