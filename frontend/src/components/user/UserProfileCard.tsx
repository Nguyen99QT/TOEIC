import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const UserProfileCard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <p className="text-gray-500">Vui lòng đăng nhập để xem thông tin cá nhân</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case 'MALE': return 'Nam';
      case 'FEMALE': return 'Nữ';
      case 'OTHER': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'USER': return 'Người dùng';
      case 'COLLABORATOR': return 'Cộng tác viên';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      case 'COLLABORATOR': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            {user.profilePictureUrl ? (
              <img 
                src={user.profilePictureUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-600">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              {user.fullName || user.username}
            </h2>
            <p className="text-blue-100">@{user.username}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
          <Link
            to="/user/edit-profile"
            className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
          >
            Chỉnh sửa
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Họ và tên:</span>
                <span className="font-medium">{user.fullName || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{user.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày sinh:</span>
                <span className="font-medium">{formatDate(user.dateOfBirth || null)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giới tính:</span>
                <span className="font-medium">{getGenderLabel(user.gender || null)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quốc gia:</span>
                <span className="font-medium">{user.country || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin tài khoản</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên đăng nhập:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vai trò:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Premium:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Xác thực email:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Điểm số:</span>
                <span className="font-medium">{user.totalScore || 0} điểm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Dates */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin thời gian</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tạo tài khoản:</span>
                <span className="font-medium">{formatDate(user.createdAt || null)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cập nhật lần cuối:</span>
                <span className="font-medium">{formatDate(user.updatedAt || null)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Đăng nhập lần cuối:</span>
                <span className="font-medium">{formatDate(user.lastLoginDate || null)}</span>
              </div>
              {user.premiumExpiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium hết hạn:</span>
                  <span className="font-medium">{formatDate(user.premiumExpiresAt || null)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/user/edit-profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Chỉnh sửa thông tin
            </Link>
            <Link
              to="/feedback"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Gửi feedback
            </Link>
            {user.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard; 