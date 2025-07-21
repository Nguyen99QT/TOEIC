/**
 * ================================================================
 * TEST PAGE COMPONENT
 * ================================================================
 * Trang làm bài thi TOEIC với đầy đủ tính năng
 * Created by: Nguyen
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { testService, TestQuestion, TestResult } from '../../services/tests';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface TestPageProps {}

interface UserAnswers {
  [questionId: number]: string;
}

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

const TestPage: React.FC<TestPageProps> = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State management
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Timer state
  const [timer, setTimer] = useState<TimerState>({
    hours: 2,
    minutes: 0,
    seconds: 0,
    totalSeconds: 2 * 60 * 60 // 2 hours for TOEIC test
  });
  const [timerActive, setTimerActive] = useState(false);

  // Load test questions
  useEffect(() => {
    const loadTestQuestions = async () => {
      if (!testId) {
        setError("Test ID không tìm thấy");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const testQuestions = await testService.getTestQuestions(parseInt(testId));
        setQuestions(testQuestions);
        setError(null);
      } catch (err) {
        setError("Không thể tải câu hỏi. Vui lòng thử lại.");
        console.error("Error loading test questions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTestQuestions();
  }, [testId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timer.totalSeconds > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTotalSeconds = prev.totalSeconds - 1;
          
          if (newTotalSeconds <= 0) {
            // Time's up - auto submit
            handleSubmitTest();
            return prev;
          }

          return {
            totalSeconds: newTotalSeconds,
            hours: Math.floor(newTotalSeconds / 3600),
            minutes: Math.floor((newTotalSeconds % 3600) / 60),
            seconds: newTotalSeconds % 60
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, timer.totalSeconds, isSubmitted]);

  // Start timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !timerActive) {
      setTimerActive(true);
    }
  }, [questions, timerActive]);

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, selectedAnswer: string) => {
    if (isSubmitted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  // Navigate to question
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Navigate previous/next
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Submit test
  const handleSubmitTest = useCallback(async () => {
    if (isSubmitting || !currentUser || !testId) return;

    // Confirm submission
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `Bạn chưa trả lời ${unansweredCount} câu hỏi. Bạn có chắc chắn muốn nộp bài không?`
      );
      if (!confirmed) return;
    }

    try {
      setIsSubmitting(true);
      setTimerActive(false);

      // Prepare submission data
      const submission = {
        userId: currentUser.id,
        testId: parseInt(testId),
        answers: Object.entries(userAnswers).map(([questionId, selectedAnswer]) => ({
          questionId: parseInt(questionId),
          selectedOption: selectedAnswer
        }))
      };

      const result = await testService.submitTest(submission);
      setTestResult(result);
      setIsSubmitted(true);
      setShowResults(true);

    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, currentUser, testId, questions.length, userAnswers]);

  // Format timer display
  const formatTimer = () => {
    const { hours, minutes, seconds } = timer;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timer.totalSeconds < 300) return 'text-red-600'; // < 5 minutes
    if (timer.totalSeconds < 1800) return 'text-orange-600'; // < 30 minutes
    return 'text-green-600';
  };

  // Calculate progress
  const getProgress = () => {
    return Math.round((Object.keys(userAnswers).length / questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Lỗi</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/tests')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Không có câu hỏi</h2>
          <p className="text-yellow-600 mb-4">Bài thi này chưa có câu hỏi.</p>
          <button
            onClick={() => navigate('/tests')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && testResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Kết quả bài thi
          </h1>
          
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{testResult.testTitle}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {testResult.scoreListen}
                  </div>
                  <div className="text-sm text-gray-600">Listening</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResult.scoreRead}
                  </div>
                  <div className="text-sm text-gray-600">Reading</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-3xl font-bold text-purple-600">
                  {testResult.scoreListen + testResult.scoreRead}
                </div>
                <div className="text-sm text-gray-600">Tổng điểm</div>
              </div>
            </div>
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={() => setShowResults(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Xem chi tiết
            </button>
            <button
              onClick={() => navigate('/tests')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Làm bài khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer and progress */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                TOEIC Practice Test #{testId}
              </h1>
              <div className="text-sm text-gray-600">
                Câu {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Progress */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Tiến độ:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {getProgress()}%
                </span>
              </div>
              
              {/* Timer */}
              <div className={`text-xl font-mono font-bold ${getTimerColor()}`}>
                ⏰ {formatTimer()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question navigation sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Danh sách câu hỏi</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-8 h-8 text-xs rounded ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : userAnswers[questions[index].questionId]
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                  Câu hiện tại
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  Đã trả lời
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
                  Chưa trả lời
                </div>
              </div>

              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
              </button>
            </div>
          </div>

          {/* Main question area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Part indicator */}
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  Part {currentQuestion.partNumber}
                </span>
              </div>

              {/* Question content */}
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
                      {currentQuestionIndex + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    {/* Audio player if available */}
                    {currentQuestion.audioUrl && (
                      <div className="mb-4">
                        <audio controls className="w-full">
                          <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                          Trình duyệt của bạn không hỗ trợ audio.
                        </audio>
                      </div>
                    )}

                    {/* Image if available */}
                    {currentQuestion.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={currentQuestion.imageUrl} 
                          alt="Question illustration"
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    )}

                    {/* Question text */}
                    <div className="text-lg text-gray-800 mb-6">
                      {currentQuestion.questionText}
                    </div>

                    {/* Answer options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <label 
                          key={option.label}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.questionId}`}
                            value={option.label}
                            checked={userAnswers[currentQuestion.questionId] === option.label}
                            onChange={(e) => handleAnswerSelect(currentQuestion.questionId, e.target.value)}
                            className="mt-1"
                            disabled={isSubmitted}
                          />
                          <div className="flex-1">
                            <span className="font-medium text-gray-700 mr-2">
                              {option.label}.
                            </span>
                            <span className="text-gray-800">
                              {option.content}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Câu trước
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu sau →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
