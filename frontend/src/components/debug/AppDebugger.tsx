import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const AppDebugger: React.FC = () => {
    const { loading, isAuthenticated, currentUser } = useAuth();
    const location = useLocation();
    const [componentStates, setComponentStates] = useState<Record<string, any>>({});

    useEffect(() => {
        // Log every state change
        const debugInfo = {
            timestamp: new Date().toISOString(),
            location: location.pathname,
            authLoading: loading,
            isAuthenticated,
            currentUser: currentUser?.username || 'none',
            localStorage: {
                token: !!localStorage.getItem('toeic_access_token'),
                user: !!localStorage.getItem('toeic_current_user'),
            }
        };

        console.log('🔍 App Debug State:', debugInfo);
        setComponentStates(prev => ({
            ...prev,
            [Date.now()]: debugInfo
        }));
    }, [loading, isAuthenticated, currentUser, location]);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 bg-black bg-opacity-75 text-white p-4 text-xs z-50 max-w-md">
            <div className="mb-2">
                <strong>🔍 App Debug Info</strong>
            </div>
            <div className="space-y-1">
                <div>Route: {location.pathname}</div>
                <div>Auth Loading: {loading ? '🔄 YES' : '✅ NO'}</div>
                <div>Authenticated: {isAuthenticated ? '✅ YES' : '❌ NO'}</div>
                <div>User: {currentUser?.username || 'none'}</div>
                <div>Token: {localStorage.getItem('toeic_access_token') ? '✅' : '❌'}</div>
                <div>User Data: {localStorage.getItem('toeic_current_user') ? '✅' : '❌'}</div>
            </div>
            <button 
                onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }}
                className="mt-2 bg-red-500 px-2 py-1 rounded text-xs"
            >
                Emergency Reset
            </button>
        </div>
    );
};

export default AppDebugger;