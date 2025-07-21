import React, { useState } from 'react';
import ContactForm from '../../components/contact/ContactForm';
import ContactList from '../../components/contact/ContactList';
import { useAuth } from '../../hooks/useAuth';

const ContactPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">
            Gửi câu hỏi, báo cáo lỗi hoặc đề xuất cải tiến cho chúng tôi
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Send New Contact
            </button>
          </div>
        </div>

        {/* Contact Form */}
        {showForm && (
          <div className="mb-8">
            <ContactForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        )}

        {/* Contact List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Contacts</h2>
          <ContactList showUserContacts={true} key={refreshList.toString()} />
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 Contact Information</h3>
            <div className="space-y-3 text-gray-600">
              <div>
                <strong>Email hỗ trợ:</strong> support@toeicapp.com
              </div>
              <div>
                <strong>Hotline:</strong> 1900-xxxx (8:00 - 22:00 hàng ngày)
              </div>
              <div>
                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HCM
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">❓ Câu hỏi thường gặp</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Làm sao để nâng cấp tài khoản Premium?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Vào trang hồ sơ người dùng và chọn "Nâng cấp Premium" để xem các gói dịch vụ.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Tôi không thể nghe được âm thanh?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Kiểm tra âm lượng thiết bị và đảm bảo trình duyệt cho phép phát âm thanh.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Làm sao để theo dõi tiến độ học tập?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Truy cập trang Dashboard để xem chi tiết tiến độ và thống kê học tập của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Contact Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Mô tả rõ ràng vấn đề bạn gặp phải</li>
            <li>• Cung cấp thông tin chi tiết về thiết bị và trình duyệt bạn đang sử dụng</li>
            <li>• Đính kèm ảnh chụp màn hình nếu có thể (qua email)</li>
            <li>• Chọn mức độ ưu tiên phù hợp để chúng tôi xử lý kịp thời</li>
            <li>• Kiểm tra email định kỳ để nhận phản hồi từ chúng tôi</li>
          </ul>
        </div>

        {/* Response Time */}
        <div className="mt-6 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Thời gian phản hồi</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>• <strong>Khẩn cấp:</strong> Trong vòng 2-4 giờ</p>
                <p>• <strong>Cao:</strong> Trong vòng 24 giờ</p>
                <p>• <strong>Trung bình:</strong> Trong vòng 48 giờ</p>
                <p>• <strong>Thấp:</strong> Trong vòng 3-5 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 