/**
 * ================================================================
 * TEST LIST PAGE COMPONENT
 * ================================================================
 * Trang hiển thị danh sách bài thi TOEIC
 * Created by: Nguyen
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testService, Test } from '../../services/tests';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TestListPage: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Load tests
  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const testsData = await testService.getAllTests();
      setTests(testsData);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách bài thi. Vui lòng thử lại.");
      console.error("Error loading tests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle generate quick test
  const handleGenerateQuickTest = async () => {
    try {
      setCreating(true);
      const result = await testService.generateQuickTest();
      
      // Reload tests to show the new one
      await loadTests();
      
      // Navigate to the new test
      navigate(`/nguyen/toeic-test/${result.testId}`);
    } catch (err) {
      setError("Không thể tạo bài thi. Vui lòng thử lại.");
      console.error("Error generating test:", err);
    } finally {
      setCreating(false);
    }
  };

  // Navigate to take test
  const handleTakeTest = (testId: number) => {
    navigate(`/nguyen/toeic-test/${testId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📋 Danh Sách Bài Thi TOEIC
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chọn bài thi phù hợp với trình độ của bạn. Mỗi bài thi được thiết kế theo chuẩn TOEIC quốc tế.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/nguyen/toeic-test/demo')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            🎯 Bài thi demo
          </button>
          
          <button
            onClick={handleGenerateQuickTest}
            disabled={creating}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "⏳ Đang tạo..." : "⚡ Tạo test nhanh"}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadTests}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              🔄 Thử lại
            </button>
          </div>
        )}

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có bài thi nào
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy tạo bài thi đầu tiên của bạn!
            </p>
            <button
              onClick={() => navigate('/nguyen/toeic-test/demo')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Làm bài thi demo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.testId} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {test.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {test.description || "Bài thi TOEIC chuẩn quốc tế"}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Tạo bởi: {test.createdBy?.username || 'System'}</span>
                    <span>{new Date(test.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <button
                    onClick={() => handleTakeTest(test.testId)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium"
                  >
                    📝 Làm bài thi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestListPage;
