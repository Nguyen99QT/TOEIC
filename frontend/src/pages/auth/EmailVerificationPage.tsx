import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useToast } from '../../components/ui/SimpleToast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { verifyEmail, resendVerificationEmail } from '../../services/auth';

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const status = searchParams.get('status');
  const statusMessage = searchParams.get('message');
  const registeredEmail = searchParams.get('email');

  useEffect(() => {
    // Set email if provided from registration
    if (registeredEmail) {
      setEmail(registeredEmail);
    }

    // Check if we have status from redirect
    if (status && statusMessage) {
      if (status === 'success') {
        setVerificationStatus('success');
        setMessage(statusMessage);
        success(statusMessage);
      } else if (status === 'error') {
        setVerificationStatus('error');
        setMessage(statusMessage);
        error(statusMessage);
      }
    } else if (status === 'registered') {
      // User just registered, show registration success message
      setVerificationStatus('pending');
      setMessage('Registration successful! Please check your email for verification link.');
      success('Registration successful! Please check your email for verification link.');
    } else if (token) {
      // If we have token but no status, verify the token
      handleEmailVerification(token);
    }
  }, [token, status, statusMessage, registeredEmail]);

  const handleEmailVerification = async (verificationToken: string) => {
    setIsLoading(true);
    try {
      const isVerified = await verifyEmail(verificationToken);
      if (isVerified) {
        setVerificationStatus('success');
        setMessage('Email verified successfully! You can now log in to your account.');
        success('Email verified successfully! You can now log in to your account.');
      } else {
        setVerificationStatus('error');
        setMessage('Email verification failed. Please try again.');
        error('Email verification failed. Please try again.');
      }
    } catch (err: any) {
      setVerificationStatus('error');
      setMessage(err.message || 'Email verification failed');
      error(err.message || 'Email verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      success('Verification email sent successfully. Please check your inbox.');
    } catch (err: any) {
      error(err.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Email Verified!</h3>
          <p className="mt-2 text-sm text-gray-600">
            {message || 'Your email has been successfully verified. You can now log in to your account.'}
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Failed</h3>
          <p className="mt-2 text-sm text-gray-600">
            {message || 'The verification link is invalid or has expired. Please request a new verification email.'}
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Sending...</span>
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>
          </div>
        </div>
      );
    }

    // Default state when no token is provided
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Email Verification</h3>
        <p className="mt-2 text-sm text-gray-600">
          {message || 'Please check your email for the verification link, or enter your email to resend the verification.'}
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {isResending ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Sending...</span>
              </>
            ) : (
              'Resend Verification Email'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">TOICEnglish</div>
            <span className="text-sm text-gray-500">TOEIC Platform</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderContent()}
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;