import React, { useState } from 'react';
import { contactService, ContactDto, AdminResponseRequest } from '../../services/contact';
import { toast } from 'react-hot-toast';

interface ContactResponseModalProps {
  contact: ContactDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ContactResponseModal: React.FC<ContactResponseModalProps> = ({
  contact,
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
      const response = await contactService.respondToContact(contact.id, responseData);
      
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Respond to Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">{contact.subject}</h3>
          <div className="text-sm text-gray-600 mb-2">
            <span>Từ: {contact.isAnonymous ? 'Ẩn danh' : contact.userName}</span>
            <span className="mx-2">•</span>
            <span>{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <p className="text-gray-700 text-sm">{contact.content}</p>
          
          {/* Contact Details */}
          {!contact.isAnonymous && (contact.contactEmail || contact.contactPhone) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <strong>Contact Information:</strong>
              </div>
              {contact.contactEmail && (
                <div className="text-sm text-gray-600">Email: {contact.contactEmail}</div>
              )}
              {contact.contactPhone && (
                <div className="text-sm text-gray-600">SĐT: {contact.contactPhone}</div>
              )}
            </div>
          )}
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Response */}
          <div>
            <label htmlFor="adminResponse" className="block text-sm font-medium text-gray-700 mb-2">
              Phản hồi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="adminResponse"
              name="adminResponse"
              value={responseData.adminResponse}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập phản hồi cho khách hàng..."
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái sau khi phản hồi
            </label>
            <select
              id="status"
              name="status"
              value={responseData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="CLOSED">Đã đóng</option>
            </select>
          </div>

          {/* Action Buttons */}
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
  );
};

export default ContactResponseModal; 