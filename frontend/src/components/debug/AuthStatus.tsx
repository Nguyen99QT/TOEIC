import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const [testCredentials, setTestCredentials] = useState({
    username: 'admin',
    password: 'password123'
  });
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);

  useEffect(() => {
    // Load persistent error log from localStorage
    const savedErrors = localStorage.getItem('debug_error_log');
    if (savedErrors) {
      try {
        setErrorLog(JSON.parse(savedErrors));
      } catch (e) {
        console.error('Failed to parse saved errors');
      }
    }

    const savedAttempts = localStorage.getItem('debug_login_attempts');
    if (savedAttempts) {
      try {
        setLoginAttempts(JSON.parse(savedAttempts));
      } catch (e) {
        console.error('Failed to parse saved login attempts');
      }
    }
  }, []);

  const logError = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    const newErrorLog = [...errorLog, logEntry];
    setErrorLog(newErrorLog);
    localStorage.setItem('debug_error_log', JSON.stringify(newErrorLog));
    console.error(logEntry);
  };

  const logLoginAttempt = (attempt: any) => {
    const newAttempts = [...loginAttempts, { ...attempt, timestamp: new Date().toISOString() }];
    setLoginAttempts(newAttempts);
    localStorage.setItem('debug_login_attempts', JSON.stringify(newAttempts));
  };

  const handleManualLogin = async () => {
    try {
      logError('🔍 Starting manual login test...');
      console.log('🔍 Starting manual login test...');

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: testCredentials.username,
          password: testCredentials.password
        })
      });

      logError(`🔍 Response status: ${response.status}`);
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        logError('🔍 Manual login response received');
        logLoginAttempt({
          status: 'SUCCESS',
          credentials: testCredentials,
          response: data
        });
        console.log('🔍 Manual login response:', data);

        // Check what we actually received
        const token = data.token || data.accessToken;
        logError(token ? `🔍 Token received: ${token.substring(0, 20)}...` : '❌ NO TOKEN IN RESPONSE');
        console.log('🔍 Token received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
        console.log('🔍 User data received:', {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          roles: data.roles
        });

        if (token) {
          // Store the tokens manually with detailed logging
          logError('🔍 Storing token...');
          console.log('🔍 Storing token...');
          localStorage.setItem('toeic_access_token', token);
          const tokenStored = localStorage.getItem('toeic_access_token');
          logError(tokenStored ? '✅ Token stored: SUCCESS' : '❌ Token stored: FAILED');
          console.log('✅ Token stored:', tokenStored ? 'SUCCESS' : 'FAILED');

          logError('🔍 Storing user data...');
          console.log('🔍 Storing user data...');
          const userData = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role || 'USER',
            membershipType: 'FREE'
          };
          localStorage.setItem('toeic_current_user', JSON.stringify(userData));
          const userStored = localStorage.getItem('toeic_current_user');
          logError(userStored ? '✅ User data stored: SUCCESS' : '❌ User data stored: FAILED');
          console.log('✅ User data stored:', userStored ? 'SUCCESS' : 'FAILED');

          localStorage.setItem('auth_just_logged_in', 'true');
          logError('✅ Auth flag set');
          console.log('✅ Auth flag set');

          logError('✅ Manual auth setup complete - redirecting...');
          console.log('✅ Manual auth setup complete - redirecting...');

          // Add delay before redirect to see logs
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          logError('❌ No token in response');
          console.error('❌ No token in response:', data);
        }
      } else {
        const errorText = await response.text();
        logError(`❌ Login failed: ${response.status} ${errorText}`);
        logLoginAttempt({
          status: 'FAILED',
          credentials: testCredentials,
          error: `${response.status}: ${errorText}`
        });
        console.error('❌ Login failed:', response.status, errorText);
      }
    } catch (error: any) {
      logError(`❌ Manual login failed: ${error.message}`);
      logLoginAttempt({
        status: 'ERROR',
        credentials: testCredentials,
        error: error.message
      });
      console.error('❌ Manual login failed:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Auth Status Debug</h2>

      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </div>
        <div>
          <strong>Is Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}
        </div>
        <div>
          <strong>Current User:</strong> {currentUser ? currentUser.username : 'null'}
        </div>
        <div>
          <strong>Token in LocalStorage:</strong> {localStorage.getItem('toeic_access_token') ? 'exists' : 'missing'}
        </div>
        <div>
          <strong>User in LocalStorage:</strong> {localStorage.getItem('toeic_current_user') ? 'exists' : 'missing'}
        </div>
        <div>
          <strong>Just Logged In Flag:</strong> {localStorage.getItem('auth_just_logged_in') ? 'true' : 'false'}
        </div>
      </div>

      {/* Error Log Section */}
      {errorLog.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 rounded">
          <h3 className="font-semibold mb-2 text-red-800">Persistent Error Log:</h3>
          <div className="max-h-32 overflow-y-auto text-sm text-red-700 space-y-1">
            {errorLog.slice(-10).map((error, index) => (
              <div key={index} className="font-mono text-xs">{error}</div>
            ))}
          </div>
          <button
            onClick={() => {
              setErrorLog([]);
              localStorage.removeItem('debug_error_log');
            }}
            className="mt-2 text-xs bg-red-200 px-2 py-1 rounded"
          >
            Clear Error Log
          </button>
        </div>
      )}

      {/* Login Attempts Section */}
      {loginAttempts.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2 text-blue-800">Login Attempts History:</h3>
          <div className="max-h-32 overflow-y-auto text-sm space-y-2">
            {loginAttempts.slice(-5).map((attempt, index) => (
              <div key={index} className="border-l-2 border-blue-300 pl-2">
                <div className="font-mono text-xs text-gray-600">{attempt.timestamp}</div>
                <div className={`text-sm ${attempt.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                  {attempt.status}: {attempt.credentials?.username}
                </div>
                {attempt.error && <div className="text-xs text-red-500">{attempt.error}</div>}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setLoginAttempts([]);
              localStorage.removeItem('debug_login_attempts');
            }}
            className="mt-2 text-xs bg-blue-200 px-2 py-1 rounded"
          >
            Clear Login History
          </button>
        </div>
      )}

      <div className="mt-6 space-x-4">
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Test Credentials:</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Username"
              value={testCredentials.username}
              onChange={(e) => setTestCredentials({ ...testCredentials, username: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={testCredentials.password}
              onChange={(e) => setTestCredentials({ ...testCredentials, password: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleManualLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Manual Login with Above Credentials
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear All & Reload
        </button>
      </div>
    </div>
  );
};

export default AuthStatus;
