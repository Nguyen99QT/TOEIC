import React, { useState } from 'react';
import EditProfileForm from '../../components/user/EditProfileForm';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);

  const handleSuccess = () => {
    setShowForm(false);
    // Redirect to profile page after successful update
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h1>
          <p className="text-gray-600">Bạn cần đăng nhập để chỉnh sửa thông tin cá nhân</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa thông tin cá nhân</h1>
          <p className="text-gray-600">
            Cập nhật thông tin cá nhân và bảo mật tài khoản của bạn
          </p>
        </div>

        {/* Success Message */}
        {!showForm && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Cập nhật thành công!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Thông tin của bạn đã được cập nhật. Đang chuyển hướng về trang cá nhân...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showForm && (
          <EditProfileForm onSuccess={handleSuccess} onCancel={handleCancel} />
        )}

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin về bảo mật</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Bảo mật thông tin:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Thông tin cá nhân được mã hóa và bảo vệ</li>
                <li>• Email sẽ được xác thực lại nếu thay đổi</li>
                <li>• Mật khẩu được mã hóa bằng thuật toán an toàn</li>
                <li>• Chỉ bạn mới có thể thay đổi thông tin cá nhân</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Lưu ý:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Cập nhật email sẽ yêu cầu xác thực lại</li>
                <li>• Mật khẩu mới phải đủ mạnh và khác mật khẩu cũ</li>
                <li>• Thông tin sẽ được cập nhật ngay lập tức</li>
                <li>• Có thể hủy thay đổi bất cứ lúc nào</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage; 