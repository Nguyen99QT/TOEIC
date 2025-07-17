import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isAuthenticated, getToken } from '../../services/auth';
import { diagnoseAuthIssues, autoFixAuthIssues, showAuthErrorToUser } from '../../utils/authRecovery';

const AuthFixButton: React.FC = () => {
    const { currentUser, isAuthenticated: contextAuth, logout } = useAuth();
    const [result, setResult] = useState<string>('');

    const diagnoseAuth = () => {
        const diagnosis = diagnoseAuthIssues();
        setResult(`${diagnosis.severity.toUpperCase()}: ${diagnosis.issue}`);

        if (diagnosis.severity === 'high') {
            showAuthErrorToUser(diagnosis.solution);
        }
    };

    const fixAuth = async () => {
        setResult('🔄 Fixing...');

        const fixed = autoFixAuthIssues();
        if (fixed) {
            setResult('✅ Fixed! Please log in again.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            setResult('❌ Cannot auto-fix - manual login required');
        }
    };

    const forceLogout = async () => {
        try {
            await logout();
            setResult('✅ Logged out successfully');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } catch (e) {
            // Force logout even if service fails
            localStorage.clear();
            window.location.reload();
        }
    };

    const testAuth = async () => {
        try {
            const response = await fetch('/api/auth/validate-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                setResult(`✅ Token valid: ${JSON.stringify(result)}`);
            } else {
                const error = await response.text();
                setResult(`❌ Token invalid: ${response.status} - ${error}`);
            }
        } catch (e: any) {
            setResult(`❌ Test failed: ${e.message}`);
        }
    };

    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    return (
        <div className="fixed bottom-20 left-4 bg-indigo-600 text-white p-3 rounded-lg z-50 text-sm max-w-sm shadow-lg">
            <div className="font-bold mb-3 flex items-center gap-2">
                🔧 Auth Recovery Panel
                <div className={`w-3 h-3 rounded-full ${contextAuth ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                    onClick={diagnoseAuth}
                    className="bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded text-xs transition-colors"
                >
                    🔍 Diagnose
                </button>
                <button
                    onClick={testAuth}
                    className="bg-purple-700 hover:bg-purple-800 px-2 py-1 rounded text-xs transition-colors"
                >
                    🧪 Test API
                </button>
                <button
                    onClick={fixAuth}
                    className="bg-green-700 hover:bg-green-800 px-2 py-1 rounded text-xs transition-colors"
                >
                    🔧 Auto Fix
                </button>
                <button
                    onClick={forceLogout}
                    className="bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs transition-colors"
                >
                    🚪 Logout
                </button>
            </div>
            <div className="text-xs opacity-75 mb-2">
                Context: {contextAuth ? '✅' : '❌'} |
                Service: {isAuthenticated() ? '✅' : '❌'} |
                User: {currentUser?.username || 'none'}
            </div>
            {result && (
                <div className="mt-2 text-xs bg-black/20 p-2 rounded max-h-20 overflow-y-auto">
                    {result}
                </div>
            )}
        </div>
    );
};

export default AuthFixButton;
