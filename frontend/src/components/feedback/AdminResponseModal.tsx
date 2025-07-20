import React, { useState } from 'react';
import { feedbackService, AdminResponseRequest, FeedbackDto } from '../../services/feedback';
import { toast } from 'react-hot-toast';

interface AdminResponseModalProps {
  feedback: FeedbackDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminResponseModal: React.FC<AdminResponseModalProps> = ({
  feedback,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [responseData, setResponseData] = useState<AdminResponseRequest>({
    adminResponse: '',
    status: 'IN_PROGRESS'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setResponseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responseData.adminResponse.trim()) {
      toast.error('Vui lòng nhập phản hồi');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await feedbackService.respondToFeedback(feedback.id, responseData);
      
      if (response.success) {
        toast.success('Phản hồi đã được gửi thành công!');
        onSuccess();
        onClose();
        setResponseData({
          adminResponse: '',
          status: 'IN_PROGRESS'
        });
      } else {
        toast.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Phản hồi Feedback</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Feedback Info */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-gray-800 mb-2">{feedback.subject}</h3>
            <p className="text-gray-600 text-sm mb-2">{feedback.content}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Từ: {feedback.userName}</span>
              <span>Loại: {feedback.feedbackType}</span>
              <span>Ưu tiên: {feedback.priority}</span>
              <span>Trạng thái: {feedback.status}</span>
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Cập nhật trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={responseData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Chờ xử lý</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="CLOSED">Đã đóng</option>
              </select>
            </div>

            <div>
              <label htmlFor="adminResponse" className="block text-sm font-medium text-gray-700 mb-2">
                Phản hồi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="adminResponse"
                name="adminResponse"
                value={responseData.adminResponse}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập phản hồi của bạn..."
                required
              />
            </div>

            {/* Quick Response Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mẫu phản hồi nhanh
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResponseData(prev => ({
                    ...prev,
                    adminResponse: 'Cảm ơn bạn đã báo cáo vấn đề này. Chúng tôi đang xem xét và sẽ xử lý sớm nhất có thể.'
                  }))}
                  className="text-left p-2 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  Cảm ơn báo cáo
                </button>
                <button
                  type="button"
                  onClick={() => setResponseData(prev => ({
                    ...prev,
                    adminResponse: 'Vấn đề này đã được ghi nhận và đang được xử lý. Chúng tôi sẽ cập nhật khi có tiến triển.'
                  }))}
                  className="text-left p-2 text-xs bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition-colors"
                >
                  Đang xử lý
                </button>
                <button
                  type="button"
                  onClick={() => setResponseData(prev => ({
                    ...prev,
                    adminResponse: 'Vấn đề đã được giải quyết. Cảm ơn bạn đã kiên nhẫn chờ đợi.'
                  }))}
                  className="text-left p-2 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                >
                  Đã giải quyết
                </button>
                <button
                  type="button"
                  onClick={() => setResponseData(prev => ({
                    ...prev,
                    adminResponse: 'Cảm ơn đề xuất của bạn. Chúng tôi sẽ xem xét và cân nhắc thêm tính năng này.'
                  }))}
                  className="text-left p-2 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                >
                  Cảm ơn đề xuất
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminResponseModal; 