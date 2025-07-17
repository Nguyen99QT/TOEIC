/**
 * ================================================================
 * LOGIN PAGE COMPONENT
 * ================================================================
 * 
 * User authentication login form
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/SimpleToast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();

  // ❌ REMOVED: Redirect logic - handled by App.tsx route guard
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log('🚀 User is authenticated, redirecting to:', from);
  //     navigate(from, { replace: true });
  //   }
  // }, [isAuthenticated, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 LoginPage: Attempting login for:', formData.username);

      // Use AuthContext's login method
      await login(formData.username, formData.password);

      success('Login successful!');
      console.log('✅ LoginPage: Login successful - AuthContext & App.tsx will handle redirect');

      // ✅ REMOVED: Manual navigation - Let App.tsx handle redirect automatically
      // The useEffect in App.tsx will detect isAuthenticated change and redirect

    } catch (loginError: any) {
      console.error('❌ LoginPage: Login failed:', loginError);
      error(loginError.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">LeEnglish</div>
            <span className="text-sm text-gray-500">TOEIC Platform</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Test Accounts Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Test Accounts:</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Username: <code className="bg-blue-100 px-1 rounded">huyplum</code></span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, username: 'huyplum', password: 'password' })}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  Use Account
                </button>
              </div>
              <div className="text-xs text-blue-600">
                Password: <code className="bg-blue-100 px-1 rounded">password</code>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
