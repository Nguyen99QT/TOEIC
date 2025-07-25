import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const TestSelectionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user info including membership and role
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
    const loadTests = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/api/tests/selection/available', {
          headers: getAuthHeaders()
        });
        setAvailableTests(response.data);
        setError(null);
      } catch (error) {
        console.error('Error loading available tests:', error);
        setError('Không thể tải danh sách bài test');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTests();
  }, []);

  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Check if user can access premium features
  const canAccessPremiumFeatures = () => {
    if (!user) return false;
    
    // Admin and collaborator roles always have access
    if (user.role === 'ADMIN' || user.role === 'COLLABORATOR') {
      return true;
    }
    
    // Premium and VIP memberships have access
    if (user.membershipType === 'PREMIUM' || user.membershipType === 'VIP') {
      return true;
    }
    
    return false;
  };

  // Check if user can only access demo
  const isBasicUser = () => {
    if (!user) return true; // Default to basic if no user info
    return user.membershipType === 'BASIC' && user.role !== 'ADMIN' && user.role !== 'COLLABORATOR';
  };

  // Handle locked feature click - redirect to upgrade page
  const handleLockedFeatureClick = () => {
    navigate('/membership');
  };

  const loadAvailableTests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/api/tests/selection/available', {
        headers: getAuthHeaders()
      });
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
      const response = await axios.post('http://localhost:8080/api/tests/selection/generate-random', randomTestConfig, {
        headers: getAuthHeaders()
      });
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
      const response = await axios.post('http://localhost:8080/api/tests/selection/generate-quick', {}, {
        headers: getAuthHeaders()
      });
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

  // Tạo test full format với cấu trúc TOEIC đầy đủ
  const handleGenerateFullTest = () => {
    setRandomTestConfig({
      title: 'Test TOEIC Full Format',
      description: 'Test đầy đủ theo cấu trúc TOEIC với 200 câu hỏi',
      useFullTOEICStructure: true
    });
    setShowRandomForm(true);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Lựa Chọn Bài Test TOEIC</h1>

      {/* User Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${
        canAccessPremiumFeatures() 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">
              {canAccessPremiumFeatures() ? '👑' : '🔒'}
            </span>
            <div>
              <h3 className={`font-semibold ${
                canAccessPremiumFeatures() ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {canAccessPremiumFeatures() 
                  ? `Chào mừng ${user?.membership || 'Premium'} Member!` 
                  : 'Tài khoản Basic'}
              </h3>
              <p className={`text-sm ${
                canAccessPremiumFeatures() ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {canAccessPremiumFeatures() 
                  ? 'Bạn có quyền truy cập tất cả tính năng test' 
                  : 'Nâng cấp lên Premium để truy cập tất cả bài test và tính năng'}
              </p>
            </div>
          </div>
          {!canAccessPremiumFeatures() && (
            <button
              onClick={handleLockedFeatureClick}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-medium"
            >
              Nâng cấp ngay
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Demo Test - Always available */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">🎯</span>
            <h2 className="text-xl font-semibold text-purple-800">Test Demo MIỄN PHÍ</h2>
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">FREE</span>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            ✨ Trải nghiệm ngay bài test TOEIC với giao diện thân thiện<br/>
            🎧 Đầy đủ audio cho phần Listening<br/>
            📊 Kết quả chi tiết sau khi hoàn thành<br/>
            ⏱️ Thời gian làm bài: ~30 phút
          </p>
          <button
            onClick={() => navigate('/tests/1')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            🚀 Bắt đầu Test Demo ngay!
          </button>
          <p className="text-xs text-purple-600 text-center mt-2 font-medium">
            Không cần đăng ký Premium • Hoàn toàn miễn phí
          </p>
        </div>

        {/* Quick Random Test - Premium only */}
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 relative ${!canAccessPremiumFeatures() ? 'opacity-60' : ''}`}>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🚀 Test Nhanh</h2>
          <p className="text-gray-600 mb-4">
            Tạo ngay một đề test với số lượng câu hỏi ít để luyện tập nhanh (~45 câu)
          </p>
          {canAccessPremiumFeatures() ? (
            <button
              onClick={handleGenerateQuickTest}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Tạo Test Nhanh
            </button>
          ) : (
            <div>
              <button
                onClick={handleLockedFeatureClick}
                className="w-full bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 cursor-pointer mb-2"
              >
                🔒 Cần Premium
              </button>
              <p className="text-xs text-gray-500 text-center">
                Nâng cấp lên Premium để sử dụng tính năng này
              </p>
            </div>
          )}
          {!canAccessPremiumFeatures() && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
              PREMIUM
            </div>
          )}
        </div>

        {/* Custom Random Test - Premium only */}
        <div className={`bg-green-50 border border-green-200 rounded-lg p-6 relative ${!canAccessPremiumFeatures() ? 'opacity-60' : ''}`}>
          <h2 className="text-xl font-semibold mb-4 text-green-800">🎯 Test Full Format</h2>
          <p className="text-gray-600 mb-4">
            Tạo đề test đầy đủ 200 câu như kỳ thi TOEIC thật
          </p>
          {canAccessPremiumFeatures() ? (
            <button
              onClick={handleGenerateFullTest}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Tạo Test Full
            </button>
          ) : (
            <div>
              <button
                onClick={handleLockedFeatureClick}
                className="w-full bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 cursor-pointer mb-2"
              >
                🔒 Cần Premium
              </button>
              <p className="text-xs text-gray-500 text-center">
                Nâng cấp lên Premium để sử dụng tính năng này
              </p>
            </div>
          )}
          {!canAccessPremiumFeatures() && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
              PREMIUM
            </div>
          )}
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">📝 Bài Test Có Sẵn</h2>
        
        {!canAccessPremiumFeatures() && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
            PREMIUM
          </div>
        )}
        
        {availableTests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {canAccessPremiumFeatures() ? (
              <p>Chưa có bài test nào. Hãy tạo test ngẫu nhiên để bắt đầu!</p>
            ) : (
              <div>
                <p className="mb-4">Bài test có sẵn chỉ dành cho thành viên Premium</p>
                <button
                  onClick={handleLockedFeatureClick}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  🔒 Nâng cấp để truy cập
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${!canAccessPremiumFeatures() ? 'opacity-60 pointer-events-none' : ''}`}>
            {availableTests.map((test) => (
              <div
                key={test.testId}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative ${
                  canAccessPremiumFeatures() ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                onClick={() => canAccessPremiumFeatures() ? handleSelectExistingTest(test.testId) : handleLockedFeatureClick()}
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
                
                {!canAccessPremiumFeatures() && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <span className="text-2xl">🔒</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!canAccessPremiumFeatures() && availableTests.length === 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Hiện có {availableTests.length || '0'} bài test có sẵn
            </p>
          </div>
        )}
        
        <button
          onClick={canAccessPremiumFeatures() ? loadAvailableTests : handleLockedFeatureClick}
          className={`mt-4 text-sm ${
            canAccessPremiumFeatures() 
              ? 'text-blue-600 hover:text-blue-800' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {canAccessPremiumFeatures() ? '🔄 Tải lại danh sách' : '🔒 Tải lại danh sách (Premium)'}
        </button>
      </div>
    </div>
  );
};

export default TestSelectionPage;
