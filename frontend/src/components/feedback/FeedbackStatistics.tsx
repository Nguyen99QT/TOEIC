import React, { useState, useEffect } from 'react';
import { feedbackService, FeedbackDto } from '../../services/feedback';
import { toast } from 'react-hot-toast';

const FeedbackStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<Map<string, number> | null>(null);
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [statsData, recentData] = await Promise.all([
        feedbackService.getFeedbackStatistics(),
        feedbackService.getRecentFeedback(5)
      ]);
      
      setStatistics(statsData);
      setRecentFeedbacks(recentData);
    } catch (error) {
      toast.error('Không thể tải thống kê feedback');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return <div className="text-center py-8 text-gray-500">Không có dữ liệu thống kê</div>;
  }

  const getStatusPercentage = (count: number) => {
    return statistics.total > 0 ? Math.round((count / statistics.total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng cộng</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.pending}</p>
              <p className="text-sm text-gray-500">{getStatusPercentage(statistics.pending)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khẩn cấp</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.urgent}</p>
              <p className="text-sm text-gray-500">{getStatusPercentage(statistics.urgent)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.resolved}</p>
              <p className="text-sm text-gray-500">{getStatusPercentage(statistics.resolved)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố độ ưu tiên</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Khẩn cấp</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${getStatusPercentage(statistics.urgentPriority)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{statistics.urgentPriority}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cao</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${getStatusPercentage(statistics.highPriority)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{statistics.highPriority}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Trung bình</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${getStatusPercentage(statistics.mediumPriority)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{statistics.mediumPriority}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Thấp</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${getStatusPercentage(statistics.lowPriority)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{statistics.lowPriority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố loại feedback</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Báo cáo lỗi</span>
              <span className="text-sm font-medium">{statistics.bugReportCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Yêu cầu tính năng</span>
              <span className="text-sm font-medium">{statistics.featureRequestCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vấn đề kỹ thuật</span>
              <span className="text-sm font-medium">{statistics.technicalIssueCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Chung</span>
              <span className="text-sm font-medium">{statistics.generalCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedbacks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback gần đây</h3>
        {recentFeedbacks.length === 0 ? (
          <p className="text-gray-500">Không có feedback gần đây</p>
        ) : (
          <div className="space-y-3">
            {recentFeedbacks.map((feedback) => (
              <div key={feedback.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{feedback.subject}</p>
                  <p className="text-sm text-gray-600">
                    {feedback.userName} • {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full bg-${feedback.priority === 'URGENT' ? 'red' : feedback.priority === 'HIGH' ? 'orange' : feedback.priority === 'MEDIUM' ? 'yellow' : 'green'}-100 text-${feedback.priority === 'URGENT' ? 'red' : feedback.priority === 'HIGH' ? 'orange' : feedback.priority === 'MEDIUM' ? 'yellow' : 'green'}-800`}>
                    {feedback.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full bg-${feedback.status === 'PENDING' ? 'orange' : feedback.status === 'IN_PROGRESS' ? 'blue' : feedback.status === 'RESOLVED' ? 'green' : 'gray'}-100 text-${feedback.status === 'PENDING' ? 'orange' : feedback.status === 'IN_PROGRESS' ? 'blue' : feedback.status === 'RESOLVED' ? 'green' : 'gray'}-800`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackStatistics; 