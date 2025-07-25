import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../../services/auth';

const TOEICTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [testParts, setTestParts] = useState([]);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Timer state (2 hours = 7200 seconds total)
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  
  // Audio management
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Test structure - TOEIC has 7 parts
  // Parts 1-4: Listening (audio required)
  // Parts 5-7: Reading (no audio)
  const isListeningPart = (partNumber) => partNumber <= 4;
  const isReadingSection = () => currentPartIndex >= 4;

  // Auth headers helper
  const getAuthHeaders = useCallback(() => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Initialize test data
  const loadTestData = useCallback(async () => {
    try {
      console.log('Loading test data for testId:', testId);
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/tests/${testId}/parts`, {
        headers: getAuthHeaders()
      });
      console.log('Test parts loaded:', response.data);
      setTestParts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading test data:', error);
      setError('Không thể tải dữ liệu bài test');
    } finally {
      setIsLoading(false);
    }
  }, [testId, getAuthHeaders]);

  useEffect(() => {
    loadTestData();
  }, [loadTestData]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTestStarted && !isTestCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, timeRemaining]);

  const loadQuestionsForCurrentPart = async () => {
    if (!testParts[currentPartIndex]) {
      console.log('❌ No part at index:', currentPartIndex, 'testParts:', testParts);
      return;
    }
    
    try {
      const partNumber = testParts[currentPartIndex].partNumber;
      console.log('🔄 Loading questions for part:', partNumber, 'testId:', testId);
      console.log('🔄 Making request to:', `http://localhost:8080/api/tests/${testId}/part/${partNumber}/questions`);
      
      setCurrentQuestions([]); // Clear previous questions
      console.log('🧹 Cleared previous questions');
      
      const response = await axios.get(
        `http://localhost:8080/api/tests/${testId}/part/${partNumber}/questions`,
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('✅ Raw response:', response);
      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', response.data);
      console.log('✅ Response data type:', typeof response.data);
      console.log('✅ Response data length:', response.data ? response.data.length : 'N/A');
      
      if (response.data && Array.isArray(response.data)) {
        console.log('🎯 Setting questions state with:', response.data.length, 'questions');
        setCurrentQuestions(response.data);
        console.log('🎯 State update completed');
        
        // Force re-render check
        setTimeout(() => {
          console.log('⏰ After timeout check - currentQuestions should be updated');
        }, 100);
      } else {
        console.log('❌ Invalid response data format:', response.data);
      }
      
      // Auto-play audio for listening parts
      if (isListeningPart(partNumber) && response.data.length > 0) {
        setTimeout(() => {
          playPartAudio();
        }, 1000); // Small delay to ensure audio element is ready
      }
    } catch (error) {
      console.error('❌ Error loading questions:', error);
      console.error('❌ Error details:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      setError('Không thể tải câu hỏi');
    }
  };

  // Load questions when part changes
  useEffect(() => {
    console.log('📍 useEffect triggered - testParts.length:', testParts.length, 'currentPartIndex:', currentPartIndex);
    if (testParts.length > 0 && currentPartIndex < testParts.length) {
      console.log('📍 About to load questions for current part');
      loadQuestionsForCurrentPart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testParts, currentPartIndex]);

  // Monitor currentQuestions changes
  useEffect(() => {
    console.log('🔥 currentQuestions changed:', currentQuestions.length, 'questions');
    console.log('🔥 currentQuestions content:', currentQuestions);
  }, [currentQuestions]);

  const playPartAudio = () => {
    if (audioRef.current && currentQuestions.length > 0) {
      const firstQuestion = currentQuestions[0];
      if (firstQuestion.audioUrl) {
        audioRef.current.src = `http://localhost:8080${firstQuestion.audioUrl}`;
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getCurrentPartAnswers = () => {
    return currentQuestions.filter(q => userAnswers[q.questionId]).length;
  };

  const isCurrentPartComplete = () => {
    return getCurrentPartAnswers() === currentQuestions.length;
  };

  const handleNextPart = () => {
    if (currentPartIndex < testParts.length - 1) {
      setCurrentPartIndex(prev => prev + 1);
      setIsAudioPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      handleTestSubmit();
    }
  };

  const handleTestSubmit = async () => {
    try {
      const submissionData = {
        testId: parseInt(testId),
        answers: Object.entries(userAnswers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          selectedAnswer: answer
        }))
      };

      await axios.post(`http://localhost:8080/api/tests/${testId}/submit`, submissionData, {
        headers: getAuthHeaders()
      });
      setIsTestCompleted(true);
      alert('Bài test đã được nộp thành công!');
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Có lỗi khi nộp bài test');
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Đang tải bài test...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  // Debug information
  if (testParts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-gray-600">Debug: Không có test parts</div>
          <div className="text-sm text-gray-500 mt-2">TestId: {testId}</div>
          <div className="text-sm text-gray-500">Test Parts Length: {testParts.length}</div>
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-6">TOEIC Practice Test</h1>
          <div className="mb-6">
            <p className="text-lg mb-2">Thời gian làm bài: 2 giờ (120 phút)</p>
            <p className="text-lg mb-2">Tổng số câu hỏi: 200 câu</p>
            <p className="text-lg mb-4">Cấu trúc bài test:</p>
            <div className="text-left max-w-2xl mx-auto">
              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-2">Phần Listening (45 phút):</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Part 1: Mô tả tranh (6 câu)</li>
                  <li>Part 2: Hỏi - đáp (25 câu)</li>
                  <li>Part 3: Đối thoại (39 câu)</li>
                  <li>Part 4: Bài nói chuyện (30 câu)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Phần Reading (75 phút):</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Part 5: Hoàn thành câu (30 câu)</li>
                  <li>Part 6: Hoàn thành đoạn văn (16 câu)</li>
                  <li>Part 7: Đọc hiểu (54 câu)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p className="font-bold">Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Audio sẽ tự động phát và không thể phát lại</li>
                <li>Bạn cần hoàn thành tất cả câu hỏi trong part trước khi chuyển sang part tiếp theo</li>
                <li>Phần Reading sẽ hiển thị toàn bộ sau khi hoàn thành Listening</li>
                <li>Thời gian đếm ngược và tự động nộp bài khi hết giờ</li>
              </ul>
            </div>
          </div>
          <button
            onClick={startTest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  if (isTestCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-green-600">Hoàn thành bài test!</h1>
          <p className="text-xl mb-4">Cảm ơn bạn đã hoàn thành bài test TOEIC</p>
          <p className="text-lg">Kết quả sẽ được xử lý và thông báo sớm nhất có thể.</p>
          <button
            onClick={() => navigate('/tests')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Quay về danh sách bài test
          </button>
        </div>
      </div>
    );
  }

  const currentPart = testParts[currentPartIndex];
  if (!currentPart) return null;

  // Debug rendering
  console.log('RENDER: currentQuestions.length =', currentQuestions.length);
  console.log('RENDER: currentQuestions =', currentQuestions);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer and Progress Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">TOEIC Test</h1>
              <div className="text-sm text-gray-600">
                Part {currentPart.partNumber}/7: {currentPart.title}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                Đã trả lời: {getCurrentPartAnswers()}/{currentQuestions.length}
              </div>
              <div className={`text-xl font-mono ${timeRemaining < 600 ? 'text-red-600' : 'text-gray-900'}`}>
                ⏰ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          {/* Progress indicator */}
          <div className="mt-2">
            <div className="flex space-x-1">
              {testParts.map((part, index) => (
                <div
                  key={part.partId}
                  className={`flex-1 h-2 rounded ${
                    index < currentPartIndex
                      ? 'bg-green-500'
                      : index === currentPartIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Current Part Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentPart.title}
              </h2>
              <p className="text-gray-600 mb-4">{currentPart.description}</p>
              
              {isListeningPart(currentPart.partNumber) && (
                <div className="mb-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">🎧</span>
                      <span className="text-blue-800 font-medium">
                        {isAudioPlaying ? 'Đang phát audio...' : 'Chuẩn bị phát audio'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {isReadingSection() && (
              <div className="text-sm text-gray-500">
                📖 Reading Section
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {/* Debug Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-gray-600">
              <strong>Debug:</strong> Current Part: {currentPart.partNumber}, 
              Questions Count: {currentQuestions.length},
              Part Index: {currentPartIndex}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Token:</strong> {getToken() ? 'Available' : 'Missing'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Questions Array:</strong> {JSON.stringify(currentQuestions.map(q => ({ id: q.questionId, text: q.questionText })))}
            </p>
            <div className="mt-2 space-x-2">
              <button
                onClick={loadQuestionsForCurrentPart}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                🔄 Reload Questions
              </button>
              <button
                onClick={() => {
                  console.log('🔍 Manual State Check:');
                  console.log('testParts:', testParts);
                  console.log('currentPartIndex:', currentPartIndex);
                  console.log('currentQuestions:', currentQuestions);
                  console.log('currentPart:', currentPart);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                � Check State
              </button>
            </div>
            {currentQuestions.length === 0 && (
              <p className="text-red-500 text-sm mt-2">⚠️ Không có câu hỏi nào được load!</p>
            )}
            {currentQuestions.length > 0 && (
              <p className="text-green-600 text-sm mt-2">✅ Có {currentQuestions.length} câu hỏi được load</p>
            )}
          </div>
          
          {/* Reading Passage Content for Part 6 & 7 */}
          {(currentPart.partNumber === 6 || currentPart.partNumber === 7) && 
           currentQuestions.length > 0 && currentQuestions[0].content && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-2">📖</span>
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentPart.partNumber === 6 ? 'Text Completion Passage' : 'Reading Passage'}
                </h3>
              </div>
              <div className="prose max-w-none">
                <div className="text-gray-900 leading-relaxed whitespace-pre-line">
                  {currentQuestions[0].content}
                </div>
              </div>
            </div>
          )}
          
          {/* Questions List */}
          {(() => {
            console.log('QUESTIONS RENDER CHECK: length =', currentQuestions.length);
            if (currentQuestions.length === 0) {
              return (
                <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
                  <p className="text-red-600">Không có câu hỏi nào để hiển thị</p>
                </div>
              );
            } else {
              console.log('RENDERING QUESTIONS:', currentQuestions.length, 'questions');
              return currentQuestions.map((question, questionIndex) => {
                console.log('MAPPING QUESTION:', questionIndex, question.questionId);
                return (
            <div key={question.questionId} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {questionIndex + 1}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-lg text-gray-900 mb-3">{question.questionText}</p>
                    
                    {/* Image display */}
                    {question.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={`http://localhost:8080${question.imageUrl}`}
                          alt="Question"
                          className="max-w-md rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Answer options */}
                  <div className="space-y-2">
                    {question.options && question.options.map((option) => (
                      <label
                        key={option.optionId}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          userAnswers[question.questionId] === option.label
                            ? 'bg-blue-50 border-blue-500'
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.questionId}`}
                          value={option.label}
                          checked={userAnswers[question.questionId] === option.label}
                          onChange={() => handleAnswerChange(question.questionId, option.label)}
                          className="mr-3"
                        />
                        <span className="font-medium text-gray-700 mr-2">{option.label}.</span>
                        <span className="text-gray-900">{option.content}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
                );
              });
            }
          })()}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <div>
            {currentPartIndex > 0 && (
              <span className="text-gray-500">
                ✅ Đã hoàn thành {currentPartIndex} phần
              </span>
            )}
          </div>
          
          <div className="space-x-4">
            {currentPartIndex < testParts.length - 1 ? (
              <button
                onClick={handleNextPart}
                disabled={!isCurrentPartComplete()}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isCurrentPartComplete()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isListeningPart(currentPart.partNumber) && currentPartIndex === 3
                  ? 'Chuyển sang phần Reading →'
                  : 'Part tiếp theo →'
                }
              </button>
            ) : (
              <button
                onClick={handleTestSubmit}
                disabled={!isCurrentPartComplete()}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isCurrentPartComplete()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Nộp bài test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden audio element for listening parts */}
      {isListeningPart(currentPart.partNumber) && (
        <audio
          ref={audioRef}
          onPlay={() => setIsAudioPlaying(true)}
          onPause={() => setIsAudioPlaying(false)}
          onEnded={() => setIsAudioPlaying(false)}
          preload="metadata"
        />
      )}
    </div>
  );
};

export default TOEICTest;
