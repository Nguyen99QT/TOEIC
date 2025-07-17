/**
 * ================================================================
 * AUTH DEBUG CHECKER
 * ================================================================
 * Kiểm tra và hiển thị detailed authentication status
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebugChecker: React.FC = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [debugInfo, setDebugInfo] = useState<any>({});

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('toeic_access_token') ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('accessToken');

            const user = localStorage.getItem('toeic_current_user') ||
                localStorage.getItem('currentUser');

            const allKeys = Object.keys(localStorage);

            setDebugInfo({
                contextUser: currentUser,
                contextAuth: isAuthenticated,
                localStorageToken: token ? `${token.substring(0, 20)}...` : 'MISSING',
                localStorageUser: user ? JSON.parse(user) : 'MISSING',
                allLocalStorageKeys: allKeys,
                timestamp: new Date().toLocaleTimeString()
            });

            console.group('🔍 AUTHENTICATION DEBUG CHECK');
            console.log('React Context User:', currentUser);
            console.log('React Context Authenticated:', isAuthenticated);
            console.log('LocalStorage Token exists:', !!token);
            console.log('LocalStorage User exists:', !!user);
            console.log('All localStorage keys:', allKeys);

            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const now = Math.floor(Date.now() / 1000);
                    console.log('Token payload:', payload);
                    console.log('Token expired:', payload.exp < now);
                    console.log('Time remaining:', payload.exp - now, 'seconds');
                } catch (e) {
                    console.error('Failed to parse token:', e);
                }
            }
            console.groupEnd();
        };

        checkAuth();
        // Check every 5 seconds
        const interval = setInterval(checkAuth, 5000);
        return () => clearInterval(interval);
    }, [currentUser, isAuthenticated]);

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div style={{
            position: 'fixed',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 9999
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                🔍 Auth Debug ({debugInfo.timestamp})
            </div>
            <div>Context User: {currentUser ? `✅ ${currentUser.username}` : '❌ null'}</div>
            <div>Context Auth: {isAuthenticated ? '✅ true' : '❌ false'}</div>
            <div>Token: {debugInfo.localStorageToken !== 'MISSING' ? '✅ exists' : '❌ missing'}</div>
            <div>User Data: {debugInfo.localStorageUser !== 'MISSING' ? '✅ exists' : '❌ missing'}</div>
            <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
                Keys: {debugInfo.allLocalStorageKeys?.length || 0}
            </div>
        </div>
    );
};

export default AuthDebugChecker;
