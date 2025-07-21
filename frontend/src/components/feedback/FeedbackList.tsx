import React, { useState, useEffect } from 'react';
import { feedbackService, FeedbackDto, PaginatedResponse, feedbackUtils } from '../../services/feedback';
import { toast } from 'react-hot-toast';
import AdminResponseModal from './AdminResponseModal';

interface FeedbackListProps {
  isAdmin?: boolean;
  showUserFeedback?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ isAdmin = false, showUserFeedback = false }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDto | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Filter states for admin
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadFeedbacks();
  }, [currentPage, statusFilter, priorityFilter, typeFilter, searchTerm]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      let response: PaginatedResponse<FeedbackDto>;

      if (isAdmin) {
        if (searchTerm) {
          response = await feedbackService.searchFeedback(searchTerm, currentPage, pageSize);
        } else if (statusFilter || priorityFilter || typeFilter) {
          response = await feedbackService.filterFeedback(statusFilter, priorityFilter, typeFilter, currentPage, pageSize);
        } else {
          response = await feedbackService.getAllFeedback(currentPage, pageSize);
        }
      } else {
        response = await feedbackService.getMyFeedback(currentPage, pageSize);
      }

      setFeedbacks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Không thể tải danh sách feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) {
      return;
    }

    try {
      const response = await feedbackService.deleteFeedback(feedbackId);
      if (response.success) {
        toast.success('Xóa feedback thành công');
        loadFeedbacks();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa feedback');
    }
  };

  const handleStatusChange = async (feedbackId: number, newStatus: string) => {
    try {
      const response = await feedbackService.updateFeedbackStatus(feedbackId, newStatus);
      if (response.success) {
        toast.success('Cập nhật trạng thái thành công');
        loadFeedbacks();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setTypeFilter('');
    setSearchTerm('');
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Filters */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="CLOSED">Đã đóng</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="URGENT">Khẩn cấp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có feedback nào</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{feedback.subject}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full bg-${feedbackUtils.getPriorityColor(feedback.priority)}-100 text-${feedbackUtils.getPriorityColor(feedback.priority)}-800`}>
                      {feedback.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full bg-${feedbackUtils.getStatusColor(feedback.status)}-100 text-${feedbackUtils.getStatusColor(feedback.status)}-800`}>
                      {feedback.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>Loại: {feedbackUtils.getFeedbackTypeLabel(feedback.feedbackType)}</span>
                    <span>Ngày tạo: {feedbackUtils.formatDate(feedback.createdAt)}</span>
                    {feedback.isAnonymous && <span className="text-orange-600">Ẩn danh</span>}
                  </div>

                  <p className="text-gray-700 mb-4">{feedback.content}</p>

                  {feedback.adminResponse && (
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">Phản hồi từ Admin:</h4>
                      <p className="text-blue-700">{feedback.adminResponse}</p>
                      {feedback.respondedAt && (
                        <p className="text-sm text-blue-600 mt-2">
                          Phản hồi lúc: {feedbackUtils.formatDate(feedback.respondedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {!feedback.isAnonymous && (feedback.contactEmail || feedback.contactPhone) && (
                    <div className="text-sm text-gray-600">
                      <p>Liên hệ: {feedback.contactEmail} {feedback.contactPhone}</p>
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <select
                      value={feedback.status}
                      onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="IN_PROGRESS">Đang xử lý</option>
                      <option value="RESOLVED">Đã giải quyết</option>
                      <option value="CLOSED">Đã đóng</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedFeedback(feedback);
                        setShowResponseModal(true);
                      }}
                      className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Phản hồi
                    </button>

                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                {/* User Actions */}
                {!isAdmin && (feedback.canEdit || feedback.canDelete) && (
                  <div className="flex flex-col space-y-2 ml-4">
                    {feedback.canEdit && (
                      <button className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                        Sửa
                      </button>
                    )}
                    {feedback.canDelete && (
                      <button
                        onClick={() => handleDelete(feedback.id)}
                        className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Trang {currentPage + 1} / {totalPages} ({totalElements} feedback)
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}

      {/* Admin Response Modal */}
      {selectedFeedback && (
        <AdminResponseModal
          feedback={selectedFeedback}
          isOpen={showResponseModal}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedFeedback(null);
          }}
          onSuccess={loadFeedbacks}
        />
      )}
    </div>
  );
};

export default FeedbackList; 