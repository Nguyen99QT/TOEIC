import React, { useEffect, useState } from 'react';

const LoadingFallback: React.FC = () => {
    const [showReset, setShowReset] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowReset(true);
        }, 3000); // Show reset after 3 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleEmergencyReset = () => {
        console.log('🚨 Emergency reset triggered');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Loading your learning journey...</h3>
                <p className="mt-2 text-sm text-gray-600">Please wait while we prepare your content</p>
                
                {showReset && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800 mb-3">
                            Still loading? This might help:
                        </p>
                        <button
                            onClick={handleEmergencyReset}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                            🚨 Emergency Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingFallback;