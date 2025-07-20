import React, { useState, useEffect } from 'react';
import { updateUserProfile, changePassword } from '../../services/users';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Gender } from '../../types';

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSuccess, onCancel }) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    country: user?.country || '',
    profilePictureUrl: user?.profilePictureUrl || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Loading states
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Validation states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  useEffect(() => {
    // Update form data when user changes
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        country: user.country || '',
        profilePictureUrl: user.profilePictureUrl || ''
      });
    }
  }, [user]);

  // Password strength checker
  useEffect(() => {
    const checkPasswordStrength = (password: string) => {
      let score = 0;
      const messages: string[] = [];

      if (password.length >= 8) score++;
      else messages.push('At least 8 characters');

      if (/[A-Z]/.test(password)) score++;
      else messages.push('One uppercase letter');

      if (/[a-z]/.test(password)) score++;
      else messages.push('One lowercase letter');

      if (/\d/.test(password)) score++;
      else messages.push('One number');

      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
      else messages.push('One special character');

      setPasswordStrength({
        score,
        message: messages.join(', ')
      });
    };

    if (passwordData.newPassword) {
      checkPasswordStrength(passwordData.newPassword);
    } else {
      setPasswordStrength({ score: 0, message: '' });
    }
  }, [passwordData.newPassword]);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.fullName.trim()) {
      toast.error('Họ tên không được để trống');
      return;
    }

    setIsSubmittingProfile(true);
    try {
      const updatedUser = await updateUserProfile({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender as Gender,
        country: profileData.country,
        profilePictureUrl: profileData.profilePictureUrl
      });

      // Update auth context
      updateUser(updatedUser);
      
      toast.success('Cập nhật thông tin thành công!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error('Mật khẩu không đủ mạnh');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Đổi mật khẩu thành công!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsSubmittingPassword(false);
    }
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa thông tin cá nhân</h2>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đổi mật khẩu
          </button>
        </nav>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                id="gender"
                name="gender"
                value={profileData.gender}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Quốc gia
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={profileData.country}
                onChange={handleProfileInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL ảnh đại diện
            </label>
            <input
              type="url"
              id="profilePictureUrl"
              name="profilePictureUrl"
              value={profileData.profilePictureUrl}
              onChange={handleProfileInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmittingProfile}
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmittingProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingProfile ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </div>
        </form>
      )}

      {/* Password Form */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {passwordData.newPassword && (
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">Mật khẩu không khớp</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Lưu ý về mật khẩu:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mật khẩu phải có ít nhất 8 ký tự</li>
              <li>• Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
              <li>• Không được trùng với mật khẩu hiện tại</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmittingPassword}
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmittingPassword || passwordStrength.score < 3}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfileForm; 