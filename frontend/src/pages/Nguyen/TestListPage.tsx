/**
 * ================================================================
 * TEST LIST PAGE COMPONENT
 * ================================================================
 * Trang hiển thị danh sách bài thi TOEIC
 * Created by: Nguyen
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { testService, Test, TestGenerateRequest } from '../../services/tests';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TestListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State management
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create test form state
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    partQuestionCount: {
      1: 6,   // Part 1: Photographs
      2: 25,  // Part 2: Question-Response  
      3: 39,  // Part 3: Conversations
      4: 30,  // Part 4: Talks
      5: 30,  // Part 5: Incomplete Sentences
      6: 16,  // Part 6: Text Completion
      7: 54   // Part 7: Reading Comprehension
    }
  });

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

  // Handle create test
  const handleCreateTest = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để tạo bài thi");
      return;
    }

    if (!newTest.title.trim()) {
      alert("Vui lòng nhập tên bài thi");
      return;
    }

    try {
      setCreating(true);
      
      const request: TestGenerateRequest = {
        userId: currentUser.id,
        title: newTest.title,
        description: newTest.description,
        partQuestionCount: newTest.partQuestionCount
      };

      const result = await testService.generateTest(request);
      
      // Reload tests
      await loadTests();
      
      // Close modal and reset form
      setShowCreateModal(false);
      setNewTest({
        title: '',
        description: '',
        partQuestionCount: {
          1: 6, 2: 25, 3: 39, 4: 30, 5: 30, 6: 16, 7: 54
        }
      });

      alert("Tạo bài thi thành công!");
      
      // Navigate to the new test
      navigate(`/tests/${result.testId}`);
    } catch (err) {
      console.error("Error creating test:", err);
      alert("Có lỗi xảy ra khi tạo bài thi. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  // Handle generate quick test
  const handleGenerateQuickTest = async () => {
    try {
      setCreating(true);
      const result = await testService.generateQuickTest();
      
      // Reload tests to show the new one
      await loadTests();
      
      alert("Tạo test nhanh thành công!");
      
      // Navigate to the new test
      navigate(`/tests/${result.testId}`);
    } catch (err) {
      console.error("Error generating quick test:", err);
      alert("Có lỗi xảy ra khi tạo test nhanh. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  // Handle take test
  const handleTakeTest = (testId: number) => {
    navigate(`/tests/${testId}`);
  };

  // Handle start demo test
  const handleStartDemoTest = () => {
    // Navigate to demo test with mock questions
    navigate('/tests/demo');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bài Thi TOEIC
          </h1>
          <p className="text-gray-600">
            Luyện tập với các bài thi TOEIC chuẩn quốc tế
          </p>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={handleStartDemoTest}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            🚀 Làm bài thi demo
          </button>

          <button
            onClick={handleGenerateQuickTest}
            disabled={creating}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
          >
            {creating ? "⏳ Đang tạo..." : "⚡ Tạo test nhanh"}
          </button>
          
          {currentUser && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              ➕ Tạo bài thi tùy chỉnh
            </button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadTests}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* TOEIC Test Format Info */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            📋 Cấu trúc bài thi TOEIC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🎧 LISTENING (45 phút)</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>Part 1: Photographs (6 câu)</li>
                <li>Part 2: Question-Response (25 câu)</li>
                <li>Part 3: Conversations (39 câu)</li>
                <li>Part 4: Talks (30 câu)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">📖 READING (75 phút)</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>Part 5: Incomplete Sentences (30 câu)</li>
                <li>Part 6: Text Completion (16 câu)</li>
                <li>Part 7: Reading Comprehension (54 câu)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-600">
            <strong>Tổng cộng:</strong> 200 câu hỏi trong 2 giờ (120 phút)
          </div>
        </div>

        {/* Tests list */}
        {tests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có bài thi nào
            </h3>
            <p className="text-gray-500 mb-4">
              Hãy tạo bài thi đầu tiên hoặc thử bài thi demo
            </p>
            <button
              onClick={handleStartDemoTest}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
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
                    Làm bài thi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Test Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">Tạo bài thi mới</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên bài thi *
                  </label>
                  <input
                    type="text"
                    value={newTest.title}
                    onChange={(e) => setNewTest(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên bài thi..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={newTest.description}
                    onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả về bài thi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số câu hỏi theo Part
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(newTest.partQuestionCount).map(([part, count]) => (
                      <div key={part} className="flex justify-between items-center">
                        <span>Part {part}:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={count}
                          onChange={(e) => setNewTest(prev => ({
                            ...prev,
                            partQuestionCount: {
                              ...prev.partQuestionCount,
                              [parseInt(part)]: parseInt(e.target.value) || 0
                            }
                          }))}
                          className="w-16 border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={creating}
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateTest}
                  disabled={creating}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Đang tạo...' : 'Tạo bài thi'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestListPage;
