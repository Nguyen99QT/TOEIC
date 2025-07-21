import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TestSelectionPage = () => {
  const navigate = useNavigate();
  const [availableTests, setAvailableTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRandomForm, setShowRandomForm] = useState(false);
  const [randomTestConfig, setRandomTestConfig] = useState({
    title: '',
    description: '',
    useFullTOEICStructure: false
  });

  // Load available tests on component mount
  useEffect(() => {
    loadAvailableTests();
  }, []);

  const loadAvailableTests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/api/tests/selection/available');
      setAvailableTests(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading available tests:', error);
      setError('Không thể tải danh sách bài test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExistingTest = (testId) => {
    // Navigate to the selected test
    navigate(`/tests/${testId}`);
  };

  const handleGenerateRandomTest = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/api/tests/selection/generate-random', randomTestConfig);
      const testData = response.data;
      
      // Navigate to the newly generated test
      navigate(`/tests/${testData.testId}`);
    } catch (error) {
      console.error('Error generating random test:', error);
      setError('Không thể tạo đề test ngẫu nhiên');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuickTest = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/api/tests/selection/generate-quick');
      const testData = response.data;
      
      // Navigate to the newly generated quick test
      navigate(`/tests/${testData.testId}`);
    } catch (error) {
      console.error('Error generating quick test:', error);
      setError('Không thể tạo đề test nhanh');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomConfigChange = (field, value) => {
    setRandomTestConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Chọn Bài Test TOEIC</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Quick Random Test */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🚀 Test Nhanh</h2>
          <p className="text-gray-600 mb-4">
            Tạo ngay một đề test với số lượng câu hỏi ít để luyện tập nhanh (~45 câu)
          </p>
          <button
            onClick={handleGenerateQuickTest}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tạo Test Nhanh
          </button>
        </div>

        {/* Custom Random Test */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">🎯 Test Tùy Chỉnh</h2>
          <p className="text-gray-600 mb-4">
            Tạo đề test ngẫu nhiên với cấu hình theo ý muốn
          </p>
          <button
            onClick={() => setShowRandomForm(!showRandomForm)}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            {showRandomForm ? 'Ẩn Form' : 'Tùy Chỉnh Test'}
          </button>
        </div>
      </div>

      {/* Random Test Configuration Form */}
      {showRandomForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Cấu Hình Test Ngẫu Nhiên</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề:
              </label>
              <input
                type="text"
                value={randomTestConfig.title}
                onChange={(e) => handleRandomConfigChange('title', e.target.value)}
                placeholder="Nhập tiêu đề cho đề test..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả:
              </label>
              <textarea
                value={randomTestConfig.description}
                onChange={(e) => handleRandomConfigChange('description', e.target.value)}
                placeholder="Nhập mô tả cho đề test..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={randomTestConfig.useFullTOEICStructure}
                  onChange={(e) => handleRandomConfigChange('useFullTOEICStructure', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Sử dụng cấu trúc TOEIC đầy đủ (200 câu)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {randomTestConfig.useFullTOEICStructure 
                  ? 'Test đầy đủ với 200 câu hỏi như kỳ thi TOEIC thật' 
                  : 'Test rút gọn với ~45 câu hỏi cho luyện tập'}
              </p>
            </div>
            
            <button
              onClick={handleGenerateRandomTest}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Tạo Test Ngẫu Nhiên
            </button>
          </div>
        </div>
      )}

      {/* Available Tests */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Bài Test Có Sẵn</h2>
        
        {availableTests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có bài test nào. Hãy tạo test ngẫu nhiên để bắt đầu!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTests.map((test) => (
              <div
                key={test.testId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectExistingTest(test.testId)}
              >
                <h3 className="font-semibold text-lg mb-2">{test.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📊 {test.totalQuestions} câu hỏi</div>
                  <div>🏷️ {test.testType === 'EXISTING' ? 'Có sẵn' : 'Được tạo'}</div>
                  {test.createdAt && (
                    <div>📅 {new Date(test.createdAt).toLocaleDateString('vi-VN')}</div>
                  )}
                </div>
                
                {test.isNewlyCreated && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                    Mới tạo
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={loadAvailableTests}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
        >
          🔄 Tải lại danh sách
        </button>
      </div>
    </div>
  );
};

export default TestSelectionPage;
