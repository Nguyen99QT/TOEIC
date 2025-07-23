import React, { useState } from 'react';

const TestLogin: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setResult('Testing login...');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'teacher2',
          password: 'password123'
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.token || data.accessToken) {
        const token = data.token || data.accessToken;
        localStorage.setItem('toeic_access_token', token);
        localStorage.setItem('toeic_current_user', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.roles[0].replace('ROLE_', ''),
          fullName: data.username,
          membershipType: 'FREE'
        }));

        setResult(`✅ Login successful! Token: ${token.substring(0, 30)}... User: ${data.username} Role: ${data.roles[0]}`);
      } else {
        setResult('❌ Login failed: No token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setResult(`❌ Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('toeic_access_token');
    const user = localStorage.getItem('toeic_current_user');

    const tokenStatus = token ? `✅ Present (${token.substring(0, 30)}...)` : '❌ Missing';
    const userStatus = user ? `✅ Present (${JSON.parse(user).username})` : '❌ Missing';
    const allKeys = Object.keys(localStorage).join(', ');

    setResult(`Auth Status:\nToken: ${tokenStatus}\nUser: ${userStatus}\nAll localStorage keys: ${allKeys}`);
  };

  const showErrorLogs = () => {
    const logs = localStorage.getItem('error_logs');
    if (logs) {
      const parsedLogs = JSON.parse(logs);
      setResult(`Recent Error Logs:\n\n${parsedLogs.slice(-5).join('\n\n')}`);
    } else {
      setResult('No error logs found');
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    setResult('🧹 Storage cleared!');
  };

  const forceRefreshAuth = () => {
    setResult('Forcing auth refresh...');
    // Trigger a page reload to re-initialize AuthContext
    window.location.reload();
  };

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Login for TOEIC Platform</h1>

        <div className="space-y-4">
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login with teacher2'}
          </button>

          <button
            onClick={checkAuth}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Check Auth Status
          </button>

          <button
            onClick={forceRefreshAuth}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
          >
            Force Refresh Auth
          </button>

          <button
            onClick={goToDashboard}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Go to Dashboard
          </button>

          <button
            onClick={showErrorLogs}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Show Error Logs
          </button>

          <button
            onClick={clearStorage}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Clear Storage
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLogin;
