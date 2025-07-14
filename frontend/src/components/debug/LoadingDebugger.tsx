import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoadingDebugger: React.FC = () => {
    const { loading, isAuthenticated, currentUser } = useAuth();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed top-0 right-0 bg-red-500 text-white p-2 text-xs z-50">
            <div>Loading: {loading ? 'YES' : 'NO'}</div>
            <div>Auth: {isAuthenticated ? 'YES' : 'NO'}</div>
            <div>User: {currentUser ? 'YES' : 'NO'}</div>
        </div>
    );
};

export default LoadingDebugger;