/**
 * ================================================================
 * AUTH DEBUG COMPONENT
 * ================================================================
 * Component để debug authentication state
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthDebug.css';

const AuthDebug: React.FC = () => {
    const { currentUser, isAuthenticated, loading } = useAuth();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="auth-debug">
            <h4>🔍 Auth Debug</h4>
            <div><strong>Loading:</strong> {loading ? 'YES' : 'NO'}</div>
            <div><strong>Authenticated:</strong> {isAuthenticated ? 'YES' : 'NO'}</div>
            <div><strong>User:</strong> {currentUser ? currentUser.username : 'None'}</div>
            <div><strong>Token:</strong> {localStorage.getItem('toeic_access_token') ? 'EXISTS' : 'MISSING'}</div>
            <div><strong>Refresh:</strong> {localStorage.getItem('toeic_refresh_token') ? 'EXISTS' : 'MISSING'}</div>
            <details>
                <summary style={{ cursor: 'pointer', fontSize: '12px' }}>🔍 Debug Details</summary>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>
                    <div><strong>Token Value:</strong> {localStorage.getItem('toeic_access_token')?.substring(0, 30) + '...' || 'N/A'}</div>
                    <div><strong>User JSON:</strong> {localStorage.getItem('toeic_current_user')?.substring(0, 50) + '...' || 'N/A'}</div>
                    <div><strong>All Storage Keys:</strong> {Object.keys(localStorage).join(', ')}</div>
                </div>
            </details>
        </div>
    );
};

export default AuthDebug;
