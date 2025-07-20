import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feedbackService, FeedbackDto } from '../../services/feedback';
import { toast } from 'react-hot-toast';

interface FeedbackWidgetProps {
  isAdmin?: boolean;
  limit?: number;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ isAdmin = false, limit = 5 }) => {
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    urgent: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [recentData, statsData] = await Promise.all([
          feedbackService.getRecentFeedback(limit),
          feedbackService.getFeedbackStatistics()
        ]);
        setRecentFeedbacks(recentData);
        setStats({
          total: statsData.total,
          pending: statsData.pending,
          urgent: statsData.urgent
        });
      } else {
        const response = await feedbackService.getMyFeedback(0, limit);
        setRecentFeedbacks(response.content);
        setStats({
          total: response.totalElements,
          pending: 0,
          urgent: 0
        });
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu feedback');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-600 bg-orange-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      case 'RESOLVED': return 'text-green-600 bg-green-100';
      case 'CLOSED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {isAdmin ? 'Feedback Gần Đây' : 'Feedback Của Bạn'}
        </h3>
        <Link
          to={isAdmin ? '/admin/feedback' : '/feedback'}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Stats for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-600">Tổng cộng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Chờ xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-xs text-gray-600">Khẩn cấp</div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-3">
        {recentFeedbacks.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              {isAdmin ? 'Không có feedback nào' : 'Bạn chưa có feedback nào'}
            </p>
          </div>
        ) : (
          recentFeedbacks.map((feedback) => (
            <div key={feedback.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                  {feedback.subject}
                </h4>
                <div className="flex space-x-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(feedback.priority)}`}>
                    {feedback.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                {feedback.content}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {isAdmin ? feedback.userName : 'Bạn'} • {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                </span>
                {feedback.adminResponse && (
                  <span className="text-green-600">✓ Đã phản hồi</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Button */}
      {!isAdmin && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/feedback"
            className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Gửi Feedback Mới
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget; 