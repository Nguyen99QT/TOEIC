/**
 * ================================================================
 * LOGIN PAGE COMPONENT
 * ================================================================
 * 
 * User authentication login form
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/SimpleToast';
import { useAuth } from '../../contexts/AuthContext';
import { resendVerificationEmail } from '../../services/auth';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const { login, refreshAuthState } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNeedsVerification(false);

    try {
      console.log('🔍 LoginPage: Attempting login for:', formData.username);

      // Use AuthContext's login method
      await login(formData.username, formData.password);

      // Set flag to indicate successful login for ProtectedRoute
      localStorage.setItem('auth_just_logged_in', 'true');

      // Wait for auth state to properly update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Refresh auth state to ensure consistency
      await refreshAuthState();

      console.log('🔍 LoginPage: Login successful, checking redirect logic');

      // Get current user from auth context to check role
      const { getCurrentUser } = await import('../../services/auth');
      const currentUser = getCurrentUser();

      console.log('🔍 LoginPage: Post-login user data:', currentUser);

      if (currentUser && currentUser.role === 'ADMIN') {
        success('Login successful! Redirecting to admin dashboard...');
        navigate('/admin/dashboard', { replace: true });
      } else {
        success('Login successful! Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }

    } catch (loginError: any) {
      console.error('❌ LoginPage: Login failed:', loginError);
      console.error('❌ Full error object:', JSON.stringify(loginError, null, 2));

      // Clean up the just logged in flag on error
      localStorage.removeItem('auth_just_logged_in');

      // Log more details about the error
      if (loginError.response) {
        console.error('❌ Error response status:', loginError.response.status);
        console.error('❌ Error response data:', loginError.response.data);
        console.error('❌ Error response headers:', loginError.response.headers);
      }

      // Check if it's an email verification error
      if (loginError.response?.status === 403 && loginError.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(loginError.response.data.email);
        error('Please verify your email before logging in');
      } else {
        const errorMessage = loginError.message || 'Login failed';
        console.error('❌ Showing error message:', errorMessage);
        error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    setIsResending(true);
    try {
      await resendVerificationEmail(unverifiedEmail);
      success('Verification email sent successfully. Please check your inbox.');
    } catch (err: any) {
      error(err.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  // Show email verification message if needed
  if (needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">LeEnglish</div>
              <span className="text-sm text-gray-500">TOEIC Platform</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Verification Required
            </h2>
          </div>

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Verify Your Email
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Please verify your email address before logging in.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Email: <strong>{unverifiedEmail}</strong>
              </p>

              <div className="mt-6 space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <LoadingSpinner size="sm" color="primary" />
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>

                <button
                  onClick={() => setNeedsVerification(false)}
                  className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Quick Login for Testing */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <button
              type="button"
              onClick={async () => {
                console.log('🔧 Quick login test starting...');
                setFormData({ username: 'teacher2', password: 'password123' });

                // Manually call the same login process
                try {
                  const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'teacher2', password: 'password123' })
                  });

                  const data = await response.json();
                  console.log('🔧 Direct API response:', data);
                  console.log('🔧 Response details:', {
                    hasToken: !!data.token,
                    hasAccessToken: !!data.accessToken,
                    hasId: !!data.id,
                    hasUsername: !!data.username,
                    hasRoles: !!data.roles,
                    roles: data.roles,
                    fullData: data
                  });

                  const token = data.token || data.accessToken;
                  if (token) {
                    console.log('🔧 Storing token:', token.substring(0, 30) + '...');

                    // Store manually with explicit verification
                    localStorage.setItem('toeic_access_token', token);
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('accessToken', token);

                    // Verify token was stored
                    const storedToken = localStorage.getItem('toeic_access_token');
                    console.log('🔧 Token verification:', {
                      stored: !!storedToken,
                      matches: storedToken === token,
                      length: storedToken?.length
                    });

                    const userData = {
                      id: data.id,
                      username: data.username,
                      email: data.email,
                      role: data.roles[0].replace('ROLE_', ''),
                      fullName: data.username,
                      membershipType: 'FREE'
                    };

                    console.log('🔧 Storing user data:', userData);
                    localStorage.setItem('toeic_current_user', JSON.stringify(userData));
                    localStorage.setItem('currentUser', JSON.stringify(userData));

                    // Verify user data was stored
                    const storedUser = localStorage.getItem('toeic_current_user');
                    console.log('🔧 User data verification:', {
                      stored: !!storedUser,
                      parsed: storedUser ? JSON.parse(storedUser) : null
                    });

                    // Set flag to prevent immediate auth check failure
                    localStorage.setItem('auth_just_logged_in', 'true');

                    console.log('🔧 Final localStorage check:');
                    console.log('  - toeic_access_token:', localStorage.getItem('toeic_access_token') ? 'EXISTS' : 'MISSING');
                    console.log('  - toeic_current_user:', localStorage.getItem('toeic_current_user') ? 'EXISTS' : 'MISSING');
                    console.log('  - All keys:', Object.keys(localStorage));

                    success('Manual login successful! Refreshing auth state...');

                    // Force refresh auth state
                    setTimeout(async () => {
                      await refreshAuthState();
                      console.log('🔧 Auth state refreshed, redirecting...');
                      window.location.href = '/dashboard';
                    }, 500);
                  }
                } catch (err) {
                  console.error('🔧 Manual login failed:', err);
                  error('Manual login failed');
                }
              }}
              className="w-full text-sm bg-yellow-200 text-yellow-800 py-2 px-3 rounded hover:bg-yellow-300"
            >
              🔧 Quick Test Login (teacher2)
            </button>
          </div>

          {/* Test Accounts Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Test Accounts:</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Username: <code className="bg-blue-100 px-1 rounded">teacher2</code></span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, username: 'teacher2', password: 'password123' })}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  Use Account
                </button>
              </div>
              <div className="text-xs text-blue-600">
                Password: <code className="bg-blue-100 px-1 rounded">password123</code>
              </div>

              <div className="flex justify-between items-center mt-2">
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
