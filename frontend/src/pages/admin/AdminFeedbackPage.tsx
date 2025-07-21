import React, { useState } from 'react';
import FeedbackList from '../../components/feedback/FeedbackList';
import FeedbackStatistics from '../../components/feedback/FeedbackStatistics';
import { useAuth } from '../../hooks/useAuth';

const AdminFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'statistics'>('list');

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-600">Bạn cần quyền admin để truy cập trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Feedback</h1>
          <p className="text-gray-600">
            Xem và quản lý tất cả feedback từ người dùng
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Danh sách Feedback
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thống kê
            </button>
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'list' ? (
            <FeedbackList isAdmin={true} />
          ) : (
            <FeedbackStatistics />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hướng dẫn quản lý</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Trạng thái feedback:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <span className="text-orange-600 font-medium">Chờ xử lý:</span> Feedback mới cần xem xét</li>
                <li>• <span className="text-blue-600 font-medium">Đang xử lý:</span> Đang trong quá trình xử lý</li>
                <li>• <span className="text-green-600 font-medium">Đã giải quyết:</span> Đã xử lý xong</li>
                <li>• <span className="text-gray-600 font-medium">Đã đóng:</span> Đã đóng feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Độ ưu tiên:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <span className="text-red-600 font-medium">Khẩn cấp:</span> Cần xử lý ngay lập tức</li>
                <li>• <span className="text-orange-600 font-medium">Cao:</span> Cần xử lý trong thời gian ngắn</li>
                <li>• <span className="text-yellow-600 font-medium">Trung bình:</span> Có thể xử lý trong thời gian bình thường</li>
                <li>• <span className="text-green-600 font-medium">Thấp:</span> Có thể xử lý khi có thời gian</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackPage; 