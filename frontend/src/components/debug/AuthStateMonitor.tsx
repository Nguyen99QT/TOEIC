import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const AuthStateMonitor: React.FC = () => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();
  const [authEvents, setAuthEvents] = useState<string[]>([]);

  useEffect(() => {
    const event = `${new Date().toISOString()}: Route=${location.pathname} Auth=${isAuthenticated} Loading=${loading} User=${currentUser?.username || 'none'}`;
    
    setAuthEvents(prev => [...prev.slice(-4), event]); // Keep last 5 events
    console.log('🔄 Auth State Change:', event);
  }, [isAuthenticated, loading, currentUser, location.pathname]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-md z-50">
      <div className="font-bold mb-2">🔍 Auth Monitor</div>
      <div className="space-y-1">
        <div>Route: {location.pathname}</div>
        <div>Auth: {isAuthenticated ? '✅' : '❌'} | Loading: {loading ? '⏳' : '✅'}</div>
        <div>User: {currentUser?.username || 'none'}</div>
        <div>Token: {(localStorage.getItem('toeic_access_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token')) ? '✅' : '❌'}</div>
        <div>UserData: {(localStorage.getItem('toeic_current_user') || localStorage.getItem('currentUser')) ? '✅' : '❌'}</div>
        <div>Flags: JustLogin={!!localStorage.getItem('auth_just_logged_in')} Success={!!localStorage.getItem('toeic_login_success')}</div>
      </div>
      
      <details className="mt-2">
        <summary className="cursor-pointer text-gray-300">Recent Events</summary>
        <div className="mt-1 text-xs space-y-1">
          {authEvents.map((event, index) => (
            <div key={index} className="break-all">{event}</div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default AuthStateMonitor;
