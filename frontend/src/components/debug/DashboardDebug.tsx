import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardDebug: React.FC = () => {
  const { currentUser, isAuthenticated, loading, refreshAuthState } = useAuth();

  const checkLocalStorage = () => {
    const token = localStorage.getItem('toeic_access_token');
    const user = localStorage.getItem('toeic_current_user');

    console.log('🔍 Current localStorage check:', {
      token: token ? `EXISTS (${token.substring(0, 30)}...)` : 'MISSING',
      user: user ? `EXISTS (${JSON.parse(user).username})` : 'MISSING',
      allKeys: Object.keys(localStorage)
    });
  };

  const manualLogin = async () => {
    console.log('🔧 Manual login from debug page...');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'teacher2', password: 'password123' })
      });

      const data = await response.json();
      console.log('🔧 API Response:', data);

      const token = data.token || data.accessToken;
      if (token) {
        // Store with all possible keys
        localStorage.setItem('toeic_access_token', token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('accessToken', token);

        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.roles[0].replace('ROLE_', ''),
          fullName: data.username,
          membershipType: 'FREE'
        };

        localStorage.setItem('toeic_current_user', JSON.stringify(userData));
        localStorage.setItem('currentUser', JSON.stringify(userData));

        console.log('✅ Data stored, refreshing auth...');
        await refreshAuthState();
      }
    } catch (error) {
      console.error('❌ Manual login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🐛 Dashboard Debug (No Auth Protection)</h1>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-medium text-blue-900">Auth State:</h3>
            <ul className="mt-2 text-sm text-blue-800">
              <li>Loading: {loading ? '✅ True' : '❌ False'}</li>
              <li>Authenticated: {isAuthenticated ? '✅ True' : '❌ False'}</li>
              <li>Current User: {currentUser ? `✅ ${currentUser.username} (${currentUser.role})` : '❌ None'}</li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={checkLocalStorage}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Check localStorage
            </button>

            <button
              onClick={refreshAuthState}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Refresh Auth State
            </button>

            <button
              onClick={manualLogin}
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
            >
              Manual Login
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium text-gray-900">Instructions:</h3>
            <ol className="mt-2 text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>Login from /login page</li>
              <li>After successful login, come here directly: /debug/dashboard</li>
              <li>Check if auth state is correct</li>
              <li>If not, click "Refresh Auth State"</li>
              <li>Then try accessing /dashboard</li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href="/login"
              className="block text-center bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Go to Login
            </a>

            <a
              href="/dashboard"
              className="block text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Try Dashboard (Protected)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDebug;
