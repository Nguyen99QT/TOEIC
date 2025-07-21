import React from 'react';
import { useNavigate } from 'react-router-dom';

const TOEICDemo = () => {
  const navigate = useNavigate();

  const toeicExamples = [
    {
      part: 1,
      name: "Part 1 - Photographs",
      description: "Mô tả hình ảnh với 1 audio và nhiều câu hỏi",
      example: {
        content: "1 hình ảnh + 1 file audio",
        questions: [
          "What is the woman doing?",
          "Where is this taking place?",
          "What can you see in the background?"
        ]
      },
      features: ["Hình ảnh", "Audio", "Nhiều câu hỏi cùng content"]
    },
    {
      part: 3,
      name: "Part 3 - Conversations",
      description: "Hội thoại với 1 audio và nhiều câu hỏi",
      example: {
        content: "1 file audio hội thoại",
        questions: [
          "What are the speakers discussing?",
          "What will the man probably do next?",
          "What does the woman suggest?"
        ]
      },
      features: ["Audio dài", "3-4 câu hỏi/conversation", "Cùng 1 content"]
    },
    {
      part: 6,
      name: "Part 6 - Text Completion",
      description: "Đoạn văn với nhiều câu hỏi điền khuyết",
      example: {
        content: "1 đoạn văn bản",
        questions: [
          "Choose the best word for blank (1)",
          "Choose the best word for blank (2)", 
          "Choose the best word for blank (3)",
          "Choose the best word for blank (4)"
        ]
      },
      features: ["Đoạn văn", "4 câu hỏi điền khuyết", "Cùng 1 text"]
    },
    {
      part: 7,
      name: "Part 7 - Reading Comprehension",
      description: "Đọc hiểu với 1 bài đọc và nhiều câu hỏi",
      example: {
        content: "1 bài đọc (email, thông báo, bài báo)",
        questions: [
          "What is the main purpose?",
          "According to the passage, what is true?",
          "What is NOT mentioned?",
          "What will probably happen next?"
        ]
      },
      features: ["Bài đọc dài", "2-5 câu hỏi/passage", "Đa dạng câu hỏi"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          TOEIC Question Groups - Demo & Features
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Create standard TOEIC question groups with 1 shared content and multiple questions
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/add/toeic-group')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            🚀 Tạo TOEIC Group
          </button>
          <button
            onClick={() => navigate('/add/add-group-questions')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            📝 Form Cũ (Basic)
          </button>
          <button
            onClick={() => navigate('/questions/my')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            📋 Xem My Questions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {toeicExamples.map((item) => (
          <div key={item.part} className="bg-white rounded-lg shadow-lg p-6 border">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                Part {item.part}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.name}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">{item.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">📋 Cấu trúc:</h4>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-medium">Content:</span> {item.example.content}
              </p>
              <div>
                <span className="font-medium text-gray-900">Câu hỏi mẫu:</span>
                <ul className="text-sm text-gray-700 mt-1 space-y-1">
                  {item.example.questions.map((q, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">✨ Tính năng:</h4>
              <div className="flex flex-wrap gap-2">
                {item.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Ưu điểm của TOEIC Question Groups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-blue-600 text-2xl mb-2">🎧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Audio/Image Tái Sử Dụng</h3>
            <p className="text-sm text-gray-600">
              1 file audio/image cho nhiều câu hỏi, giống đề thi TOEIC thật
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-green-600 text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Content Chung</h3>
            <p className="text-sm text-gray-600">
              1 đoạn văn/hội thoại cho nhiều câu hỏi liên quan
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-purple-600 text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Hiệu Quả Cao</h3>
            <p className="text-sm text-gray-600">
              Tối ưu thời gian tạo câu hỏi và trải nghiệm học tập
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-red-600 text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Chuẩn TOEIC</h3>
            <p className="text-sm text-gray-600">
              Theo đúng format và cấu trúc đề thi TOEIC chính thức
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-yellow-600 text-2xl mb-2">💾</div>
            <h3 className="font-semibold text-gray-900 mb-2">Auto-Save</h3>
            <p className="text-sm text-gray-600">
              Tự động lưu draft, không lo mất dữ liệu
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-indigo-600 text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Theo dõi tiến độ tạo câu hỏi real-time
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 Hướng dẫn sử dụng
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Chọn TOEIC Part</h4>
              <p className="text-gray-600 text-sm">
                Chọn Part phù hợp (1-7), form sẽ tự động điều chỉnh các trường cần thiết
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Upload Content</h4>
              <p className="text-gray-600 text-sm">
                Upload audio (Part 1-4), image (Part 1), hoặc nhập text (Part 6-7)
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Add Questions</h4>
              <p className="text-gray-600 text-sm">
                Add multiple questions related to the uploaded content
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Submit & Enjoy</h4>
              <p className="text-gray-600 text-sm">
                Form tự động validate và tạo group question chuẩn TOEIC
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TOEICDemo;
