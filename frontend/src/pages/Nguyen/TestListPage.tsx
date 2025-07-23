/**
 * ================================================================
 * TEST LIST PAGE COMPONENT
 * ================================================================
 * Trang hiển thị danh sách bài thi TOEIC
 * Created by: Nguyen
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { Test, testService } from '../../services/tests';
import { debugAuthState } from '../../utils/debugAuth';

const TestListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State management
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Load tests
  useEffect(() => {
    loadTests();
    // Debug auth state when component mounts
    setTimeout(() => debugAuthState(), 1000);
  }, []);

  // Check if user can create quick test
  const canCreateQuickTest = () => {
    if (!currentUser) {
      console.log('❌ canCreateQuickTest: No currentUser');
      return false;
    }

    const role = currentUser.role?.toLowerCase();
    const membershipType = currentUser.membershipType?.toLowerCase();

    console.log('🔍 canCreateQuickTest debug:', {
      username: currentUser.username,
      role: currentUser.role,
      roleLower: role,
      membershipType: currentUser.membershipType,
      membershipTypeLower: membershipType,
      isAdmin: role === 'admin',
      isCollaborator: role === 'collaborator',
      isVip: membershipType === 'vip',
      isPremium: membershipType === 'premium'
    });

    const canCreate = (
      role === 'admin' ||
      role === 'collaborator' ||
      membershipType === 'vip' ||
      membershipType === 'premium'
    );

    console.log('🔍 Final permission result:', canCreate);
    return canCreate;
  };

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
    console.log('🚀 handleGenerateQuickTest called');

    // Check permissions first
    if (!canCreateQuickTest()) {
      const message = currentUser
        ? `Tính năng tạo test nhanh chỉ dành cho Admin/Collaborator hoặc thành viên VIP/Premium. Hiện tại: Role=${currentUser.role}, MembershipType=${currentUser.membershipType}`
        : "Vui lòng đăng nhập để sử dụng tính năng này!";
      setError(message);
      return;
    }

    try {
      setCreating(true);
      setError(null); // Clear previous errors
      console.log('🎯 Calling testService.generateQuickTest()...');

      const result = await testService.generateQuickTest();
      console.log('✅ Quick test generated successfully:', result);

      // Reload tests to show the new one
      console.log('🔄 Reloading tests...');
      await loadTests();

      // Navigate to the new test
      console.log(`🎯 Navigating to test ${result.testId}...`);
      navigate(`/tests/${result.testId}`);
    } catch (err: any) {
      console.error('❌ Error generating quick test:', err);
      const errorMessage = err?.response?.data?.message || err?.message || "Không thể tạo bài thi. Vui lòng thử lại.";
      setError(`Lỗi tạo test: ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  // Navigate to take test
  const handleTakeTest = (testId: number) => {
    navigate(`/tests/${testId}`);
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
            onClick={() => navigate('/tests/1')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            🎯 Bài thi demo
          </button>

          <button
            onClick={handleGenerateQuickTest}
            disabled={creating || !currentUser}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title={!canCreateQuickTest() ? "Chỉ dành cho VIP/Premium/Cộng tác viên/Admin" : ""}
          >
            {creating ? "⏳ Đang tạo..." : "⚡ Tạo test nhanh"}
            {!canCreateQuickTest() && currentUser && (
              <span className="ml-1">🔒</span>
            )}
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
              onClick={() => navigate('/tests/1')}
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
