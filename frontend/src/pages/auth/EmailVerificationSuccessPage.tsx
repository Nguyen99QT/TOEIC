import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/SimpleToast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { resendVerificationEmail } from '../../services/auth';

interface EmailVerificationSuccessPageProps {
  email: string;
}

const EmailVerificationSuccessPage: React.FC<EmailVerificationSuccessPageProps> = ({ email }) => {
  const { success, error } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">TOICEnglish</div>
            <span className="text-sm text-gray-500">TOEIC Platform</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Successful!
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Check Your Email
            </h3>
            
            <p className="mt-2 text-sm text-gray-600">
              We've sent a verification email to <strong>{email}</strong>
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      Next Steps:
                    </h4>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Check your email inbox (and spam folder)</li>
                        <li>Click the verification link in the email</li>
                        <li>Return here to log in to your account</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
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

                <Link
                  to="/login"
                  className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Go to Login
                </Link>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-primary-600 hover:text-primary-500 underline"
                >
                  request a new one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSuccessPage; 