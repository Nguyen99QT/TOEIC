import React, { useState } from 'react';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import FeedbackList from '../../components/feedback/FeedbackList';
import { useAuth } from '../../hooks/useAuth';

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshList(!refreshList); // Trigger refresh
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h1>
          <p className="text-gray-600">
            Chia sẻ ý kiến, báo cáo lỗi hoặc đề xuất cải tiến cho chúng tôi
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Gửi Feedback Mới
            </button>
          </div>
        </div>

        {/* Feedback Form */}
        {showForm && (
          <div className="mb-8">
            <FeedbackForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        )}

        {/* Feedback List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback của bạn</h2>
          <FeedbackList showUserFeedback={true} />
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin về Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Các loại feedback chúng tôi nhận:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Báo cáo lỗi:</strong> Khi bạn gặp vấn đề với ứng dụng</li>
                <li>• <strong>Yêu cầu tính năng:</strong> Đề xuất tính năng mới</li>
                <li>• <strong>Vấn đề kỹ thuật:</strong> Lỗi kỹ thuật hoặc hiệu suất</li>
                <li>• <strong>Yêu cầu nội dung:</strong> Thêm bài học hoặc tài liệu</li>
                <li>• <strong>Vấn đề tài khoản:</strong> Đăng nhập, đăng ký, thanh toán</li>
                <li>• <strong>Đề xuất:</strong> Ý tưởng cải tiến chung</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Độ ưu tiên:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <span className="text-red-600 font-medium">Khẩn cấp:</span> Lỗi nghiêm trọng ảnh hưởng đến việc học</li>
                <li>• <span className="text-orange-600 font-medium">Cao:</span> Vấn đề quan trọng cần xử lý sớm</li>
                <li>• <span className="text-yellow-600 font-medium">Trung bình:</span> Vấn đề thông thường</li>
                <li>• <span className="text-green-600 font-medium">Thấp:</span> Đề xuất cải tiến nhỏ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage; 