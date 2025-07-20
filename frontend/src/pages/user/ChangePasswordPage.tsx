import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/users';
import { toast } from 'react-hot-toast';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength for new password
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const messages: string[] = [];

    if (password.length >= 8) score++;
    else messages.push('Ít nhất 8 ký tự');

    if (/[A-Z]/.test(password)) score++;
    else messages.push('Một chữ hoa');

    if (/[a-z]/.test(password)) score++;
    else messages.push('Một chữ thường');

    if (/\d/.test(password)) score++;
    else messages.push('Một số');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else messages.push('Một ký tự đặc biệt');

    setPasswordStrength({
      score,
      message: messages.join(', ')
    });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'text-red-600';
    if (passwordStrength.score <= 2) return 'text-orange-600';
    if (passwordStrength.score <= 3) return 'text-yellow-600';
    if (passwordStrength.score <= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 1) return 'Rất yếu';
    if (passwordStrength.score <= 2) return 'Yếu';
    if (passwordStrength.score <= 3) return 'Trung bình';
    if (passwordStrength.score <= 4) return 'Mạnh';
    return 'Rất mạnh';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error('Mật khẩu không đủ mạnh');
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Đổi mật khẩu thành công!');
      navigate('/user/profile');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Đổi Mật Khẩu</h1>
            <p className="text-gray-600 mt-2">Cập nhật mật khẩu tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu mới"
                required
              />
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Độ mạnh:</span>
                    <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  {passwordStrength.message && (
                    <p className="text-xs text-gray-500 mt-1">
                      Cần: {passwordStrength.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.newPassword === formData.confirmPassword ? (
                    <span className="text-sm text-green-600">✓ Mật khẩu khớp</span>
                  ) : (
                    <span className="text-sm text-red-600">✗ Mật khẩu không khớp</span>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/user/profile')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Quay lại Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage; 