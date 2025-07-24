/**
 * ================================================================
 * UPGRADE PREMIUM PAGE COMPONENT
 * ================================================================
 * Trang nâng cấp tài khoản lên Premium/VIP
 * Created by: Nguyen
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UpgradePremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const membershipPlans = [
    {
      name: "BASIC",
      price: "Miễn phí",
      color: "bg-gray-100 border-gray-300",
      features: [
        "✅ Truy cập bài thi demo",
        "❌ Tạo test nhanh",
        "❌ Tạo full test",
        "❌ Phân tích chi tiết",
        "❌ Lịch sử bài thi"
      ],
      isCurrent: currentUser?.membershipType?.toLowerCase() === 'basic' || !currentUser?.membershipType
    },
    {
      name: "VIP",
      price: "199,000đ/tháng",
      color: "bg-yellow-50 border-yellow-300",
      features: [
        "✅ Tất cả tính năng BASIC",
        "✅ Tạo test nhanh không giới hạn",
        "✅ Tạo full test TOEIC (200 câu)",
        "✅ Phân tích kết quả chi tiết",
        "✅ Lịch sử bài thi đầy đủ",
        "✅ Hỗ trợ ưu tiên"
      ],
      isCurrent: currentUser?.membershipType?.toLowerCase() === 'vip',
      recommended: true
    },
    {
      name: "PREMIUM",
      price: "399,000đ/tháng",
      color: "bg-purple-50 border-purple-300",
      features: [
        "✅ Tất cả tính năng VIP",
        "✅ Truy cập tất cả ngân hàng câu hỏi",
        "✅ Tạo test tùy chỉnh theo part",
        "✅ Xuất báo cáo PDF",
        "✅ Chia sẻ bài thi với bạn bè",
        "✅ Hỗ trợ 24/7"
      ],
      isCurrent: currentUser?.membershipType?.toLowerCase() === 'premium'
    }
  ];

  const handleUpgrade = (planName: string) => {
    // TODO: Implement payment integration
    alert(`Tính năng thanh toán cho gói ${planName} sẽ được phát triển trong tương lai!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 Nâng cấp tài khoản
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Mở khóa tất cả tính năng để nâng cao kỹ năng TOEIC của bạn
          </p>
          <div className="bg-white rounded-lg p-4 inline-block shadow">
            <p className="text-gray-700">
              Tài khoản hiện tại: <span className="font-semibold text-blue-600">
                {currentUser?.username || 'Guest'} 
              </span>
              {' '}(<span className="font-semibold">
                {currentUser?.membershipType || 'BASIC'}
              </span>)
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {membershipPlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`${plan.color} rounded-lg p-6 relative ${plan.recommended ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                  KHUYẾN NGHỊ
                </div>
              )}
              
              {plan.isCurrent && (
                <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ĐANG SỬ DỤNG
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.isCurrent || plan.name === 'BASIC'}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.isCurrent 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : plan.name === 'BASIC'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.isCurrent 
                  ? 'Đang sử dụng' 
                  : plan.name === 'BASIC' 
                    ? 'Gói hiện tại' 
                    : `Nâng cấp lên ${plan.name}`
                }
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 So sánh tính năng chi tiết
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 font-semibold text-gray-800">Tính năng</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-800">BASIC</th>
                  <th className="py-3 px-4 text-center font-semibold text-yellow-600">VIP</th>
                  <th className="py-3 px-4 text-center font-semibold text-purple-600">PREMIUM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Bài thi demo</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Tạo test nhanh</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Tạo full test TOEIC (200 câu)</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Phân tích kết quả chi tiết</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Lịch sử bài thi</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Tạo test tùy chỉnh theo part</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Xuất báo cáo PDF</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/tests')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
          >
            ⬅️ Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePremiumPage;
