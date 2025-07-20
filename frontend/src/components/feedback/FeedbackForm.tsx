import React, { useState } from 'react';
import { feedbackService, FeedbackRequest, feedbackUtils } from '../../services/feedback';
import { toast } from 'react-hot-toast';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FeedbackRequest>({
    subject: '',
    content: '',
    feedbackType: 'GENERAL',
    priority: 'MEDIUM',
    isAnonymous: false,
    contactEmail: '',
    contactPhone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.content.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await feedbackService.createFeedback(formData);
      
      if (response.success) {
        toast.success('Gửi feedback thành công!');
        setFormData({
          subject: '',
          content: '',
          feedbackType: 'GENERAL',
          priority: 'MEDIUM',
          isAnonymous: false,
          contactEmail: '',
          contactPhone: ''
        });
        onSuccess?.();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi Feedback</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề feedback..."
            required
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mô tả chi tiết vấn đề hoặc đề xuất của bạn..."
            required
          />
        </div>

        {/* Feedback Type and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
              Loại feedback
            </label>
            <select
              id="feedbackType"
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GENERAL">Chung</option>
              <option value="BUG_REPORT">Báo cáo lỗi</option>
              <option value="FEATURE_REQUEST">Yêu cầu tính năng</option>
              <option value="TECHNICAL_ISSUE">Vấn đề kỹ thuật</option>
              <option value="CONTENT_REQUEST">Yêu cầu nội dung</option>
              <option value="ACCOUNT_ISSUE">Vấn đề tài khoản</option>
              <option value="PAYMENT_ISSUE">Vấn đề thanh toán</option>
              <option value="SUGGESTION">Đề xuất</option>
              <option value="COMPLAINT">Khiếu nại</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Độ ưu tiên
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Thấp</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="HIGH">Cao</option>
              <option value="URGENT">Khẩn cấp</option>
            </select>
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
            Gửi ẩn danh
          </label>
        </div>

        {/* Contact Information */}
        {!formData.isAnonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email liên hệ (tùy chọn)
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại (tùy chọn)
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0123456789"
              />
            </div>
          </div>
        )}

        {/* Priority Indicator */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-4 h-4 rounded-full bg-${feedbackUtils.getPriorityColor(formData.priority)}-500`}
            ></div>
            <span className="text-sm text-gray-600">
              Độ ưu tiên: <span className="font-medium">{formData.priority}</span>
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm; 