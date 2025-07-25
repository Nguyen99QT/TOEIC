import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/SimpleToast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { requestPasswordReset } from '../../services/auth';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      error('Vui lòng nhập địa chỉ email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      error('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      setEmailSent(true);
      success('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (err: any) {
      console.error('Password reset request failed:', err);
      error(err.message || 'Không thể gửi email khôi phục. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email đã được gửi!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi link khôi phục mật khẩu đến địa chỉ:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <span className="font-medium text-indigo-600">{email}</span>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Vui lòng kiểm tra email (kể cả thư mục spam) và làm theo hướng dẫn để đặt lại mật khẩu. 
                Link sẽ hết hạn sau 15 phút.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleRetry}
                  className="w-full flex justify-center py-3 px-4 border border-indigo-300 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Gửi lại email khác
                </button>
                
                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div>
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.143-8.586z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quên mật khẩu?
              </h2>
              
              <p className="text-gray-600">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link khôi phục mật khẩu
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Nhập email của bạn"
                  disabled={isLoading}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Đang gửi...</span>
                    </>
                  ) : (
                    'Gửi email khôi phục'
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                >
                  ← Quay lại đăng nhập
                </Link>
                
                <Link
                  to="/register"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                >
                  Chưa có tài khoản?
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Bạn nhớ ra mật khẩu?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;