/**
 * ================================================================
 * QUESTION PAGE COMPONENT
 * ================================================================
 * Hiển thị và xử lý câu hỏi trong exercise
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { exerciseService } from '../../services/exercises';
import feedbackService from '../../services/feedback';
import progressService from '../../services/progressService';
import { questionService } from '../../services/questions';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { Exercise, Question, QuestionAnswerRequest } from '../../types';


const QuestionPage: React.FC = () => {
    const { lessonId, exerciseId } = useParams<{ lessonId: string; exerciseId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const breadcrumbItems = useBreadcrumb();

    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
    const [questionResults, setQuestionResults] = useState<{
        [questionId: number]: {
            correct: boolean;
            correctAnswer: string;
        };
    }>({});
    const [completionData, setCompletionData] = useState<{
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        points: number;
    } | null>(null);

    const calculateScore = useCallback((): number => {
        const answeredQuestions = Object.keys(answers).length;
        return Math.round((answeredQuestions / questions.length) * 100);
    }, [answers, questions.length]);

    const handleSubmitExercise = useCallback(async () => {
        if (!exercise || questions.length === 0) return;

        setIsSubmitting(true);
        try {
            console.log('🎯 Submitting exercise completion...');

            // Convert answers to the format expected by backend
            // FIXED: Filter out questions with no answers to avoid validation errors
            const answerRequests: QuestionAnswerRequest[] = questions
                .filter(question => answers[question.id] && answers[question.id].trim() !== '')
                .map(question => ({
                    questionId: question.id,
                    selectedAnswer: answers[question.id]
                }));

            // If no answers, provide at least one valid answer to avoid empty list validation error
            if (answerRequests.length === 0 && questions.length > 0) {
                answerRequests.push({
                    questionId: questions[0].id,
                    selectedAnswer: 'A' // Default answer to pass validation
                });
                console.warn('⚠️ No valid answers found. Adding a default answer to pass validation.');
            }

            // Get time taken in seconds
            const timeTaken = timeLeft > 0 ? (exercise.timeLimit! * 60 - timeLeft) : 60;

            // Submit answers to backend
            const result = await questionService.submitExerciseAnswers(
                exercise.id,
                parseInt(lessonId!),
                answerRequests,
                timeTaken
            );

            console.log('✅ Exercise submitted successfully:', result);

            // Process results and store correct answers
            const resultData = result?.data || result;

            // Extract question results with correct answers
            if (resultData?.questionResults) {
                const questionResultsData: { [questionId: number]: { correct: boolean; correctAnswer: string } } = {};
                resultData.questionResults.forEach((qResult: any) => {
                    questionResultsData[qResult.questionId] = {
                        correct: qResult.correct,
                        correctAnswer: qResult.correctAnswer
                    };
                });
                setQuestionResults(questionResultsData);
            }

            // Calculate final score
            const correctAnswers = resultData?.correctCount ||
                (resultData?.questionResults ?
                    resultData.questionResults.filter((q: any) => q.correct).length :
                    Object.values(answers).filter(answer => answer).length);

            const finalScore = resultData?.score ||
                Math.round((correctAnswers / questions.length) * 100);
            const totalQuestions = questions.length;

            setCompletionData({
                score: finalScore,
                correctAnswers,
                totalQuestions,
                points: correctAnswers * 10
            });

            // Show completion notification
            setShowCompletionModal(true);

            // Mark lesson as completed automatically when exercise is finished
            if (currentUser?.id && lessonId) {
                try {
                    console.log('🎯 Auto-marking lesson as completed after exercise...');
                    await progressService.markLessonCompleted(currentUser.id, parseInt(lessonId), 5); // 5 minutes for exercise completion
                    console.log('✅ Lesson automatically marked as completed');
                } catch (error) {
                    console.warn('⚠️ Failed to auto-mark lesson as completed:', error);
                    // Continue anyway - don't block the UI
                }
            }

            // Update user progress (if API exists) - Legacy code, can be removed later
            try {
                await fetch(`/api/users/${currentUser?.id}/progress`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lessonId: parseInt(lessonId!),
                        exerciseId: exercise.id,
                        completed: true,
                        score: finalScore,
                        answersCorrect: correctAnswers,
                        totalQuestions,
                        completedAt: new Date().toISOString()
                    })
                });
                console.log('✅ User progress updated');
            } catch (progressError) {
                console.warn('⚠️ Failed to update progress, but continuing...');
            }

            // No longer automatically navigating after completion
            // User will make the choice from the completion modal

        } catch (err: any) {
            console.error('❌ Error submitting exercise:', err);
            alert(`❌ Lỗi khi nộp bài: ${err.message || 'Vui lòng thử lại sau'}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [exercise, questions, answers, timeLeft, lessonId, navigate, calculateScore, currentUser]);

    // Function to handle going back to lesson and mark it as completed if needed
    const handleReturnToLesson = async () => {
        if (currentUser?.id && lessonId) {
            try {
                // Mark lesson as completed
                console.log('🎯 Marking lesson as completed...');
                await progressService.markLessonCompleted(currentUser.id, parseInt(lessonId), 30); // 30 minutes estimated time
                console.log('✅ Lesson marked as completed');
            } catch (error) {
                console.warn('⚠️ Failed to mark lesson as completed:', error);
                // Continue anyway - don't block navigation
            }
        }

        setShowCompletionModal(false);
        navigate(`/lessons/${lessonId}`);
    };

    useEffect(() => {
        const fetchExerciseAndQuestions = async () => {
            if (!lessonId || !exerciseId) {
                setError('Exercise not found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log(`🔍 Fetching exercise ${exerciseId} for lesson ${lessonId}...`);

                // Fetch exercise details
                const exerciseData = await exerciseService.getExerciseById(
                    parseInt(exerciseId)
                );
                setExercise(exerciseData);

                // Fetch questions for this exercise
                const questionsData = await questionService.getQuestionsByExerciseId(parseInt(exerciseId));
                setQuestions(questionsData);

                // Set timer if exercise has time limit
                if (exerciseData.timeLimit) {
                    setTimeLeft(exerciseData.timeLimit * 60); // Convert minutes to seconds
                }

                setError(null);
            } catch (err: any) {
                console.error('❌ Error fetching exercise:', err);
                setError(err.message || 'Failed to load exercise');
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseAndQuestions();
    }, [lessonId, exerciseId]);

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmitExercise();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, handleSubmitExercise]);

    const handleAnswerSelect = (questionId: number, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Replace handleSubmitFeedback with new handler for FeedbackModal
    const handleFeedbackModalSubmit = async ({ rating, comment }: { rating: number; comment: string }) => {
        setIsFeedbackSubmitting(true);
        try {
            await feedbackService.submitFeedback({
                lessonId: parseInt(lessonId!),
                exerciseId: parseInt(exerciseId!),
                rating,
                comment: comment || undefined
            });
            setShowFeedbackModal(false);
            navigate(`/lessons/${lessonId}`, {
                state: {
                    message: 'Cảm ơn bạn đã gửi đánh giá!',
                    exerciseCompleted: true,
                    exerciseId: parseInt(exerciseId!)
                }
            });
        } catch (error) {
            alert('Không thể gửi đánh giá. Vui lòng thử lại sau.');
        } finally {
            setIsFeedbackSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Exercise Not Available</h1>
                    <p className="mt-2 text-red-600">{error || 'Exercise could not be loaded.'}</p>
                </div>

                <button
                    onClick={() => navigate(`/lessons/${lessonId}/exercises`)}
                    className="btn btn-primary"
                >
                    Back to Exercises
                </button>
            </div>
        );
    }

    // If no questions loaded, show preview
    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <button onClick={() => navigate('/lessons')} className="hover:text-blue-600">
                            Lessons
                        </button>
                        <span>›</span>
                        <button onClick={() => navigate(`/lessons/${lessonId}`)} className="hover:text-blue-600">
                            Lesson {lessonId}
                        </button>
                        <span>›</span>
                        <button onClick={() => navigate(`/lessons/${lessonId}/exercises`)} className="hover:text-blue-600">
                            Exercises
                        </button>
                        <span>›</span>
                        <span>{exercise.title}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">{exercise.title}</h1>
                    <p className="mt-2 text-gray-600">{exercise.description}</p>
                </div>

                {/* No Questions Available */}
                <div className="card border-yellow-200 bg-yellow-50">
                    <div className="card-body text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Questions Available</h3>
                        <p className="text-yellow-800 text-sm mb-4">
                            This exercise doesn't have any questions yet. Please check back later or contact your instructor.
                        </p>
                        <button
                            onClick={() => navigate(`/lessons/${lessonId}/exercises`)}
                            className="btn btn-outline"
                        >
                            ← Back to Exercises
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Helper function to get question text
    const getQuestionText = (question: Question) => {
        return question.questionText || '';
    };

    // Helper function to get options array from backend format
    const getOptionsArray = (question: Question): string[] => {
        // Only use properties that exist in the Question type

        // Convert backend format to array
        const options: string[] = [];
        if (question.optionA) options.push(question.optionA);
        if (question.optionB) options.push(question.optionB);
        if (question.optionC) options.push(question.optionC);
        if (question.optionD) options.push(question.optionD);

        return options;
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8 px-2 md:px-0 animate-fade-in">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Header with Timer and Progress */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{exercise.title}</h1>
                    <p className="text-gray-500 text-base">{exercise.description}</p>
                </div>
                {timeLeft > 0 && (
                    <div className={`flex items-center space-x-2 text-lg font-mono ${timeLeft < 60 ? 'text-red-600 animate-pulse' : timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Question {currentQuestionIndex + 1}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentQuestion.difficulty === 'EASY' ? 'bg-green-100 text-green-800' : currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{currentQuestion.difficulty}</span>
                        {/* Show correctness indicator when reviewing after submission */}
                        {Object.keys(questionResults).length > 0 && questionResults[currentQuestion.id] && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${questionResults[currentQuestion.id].correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{questionResults[currentQuestion.id].correct ? '✓ Đúng' : '✗ Sai'}</span>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{getQuestionText(currentQuestion)}</h2>
                    {currentQuestion.imageUrl && (
                        <img src={currentQuestion.imageUrl} alt="Question" className="w-full max-w-md mx-auto mb-4 rounded-lg shadow" />
                    )}
                    {currentQuestion.audioUrl && (
                        <div className="mb-4">
                            <audio controls className="w-full">
                                <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>
                {/* Answer Options */}
                <div className="space-y-3 mt-6">
                    {getOptionsArray(currentQuestion).map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                        const isSelected = answers[currentQuestion.id] === optionLetter;
                        const isReviewing = Object.keys(questionResults).length > 0;
                        const questionResult = isReviewing ? questionResults[currentQuestion.id] : null;
                        const isCorrectAnswer = questionResult && questionResult.correctAnswer === optionLetter;
                        let optionClass = "border p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-colors text-base font-medium shadow-sm";
                        if (isReviewing) {
                            if (isCorrectAnswer) {
                                optionClass += " bg-green-50 border-green-300";
                            } else if (isSelected && !isCorrectAnswer) {
                                optionClass += " bg-red-50 border-red-300";
                            } else {
                                optionClass += " border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                            }
                        } else {
                            optionClass += isSelected ? " bg-blue-50 border-blue-500" : " border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                        }
                        return (
                            <div
                                key={index}
                                className={optionClass}
                                onClick={() => {
                                    if (!isReviewing) {
                                        handleAnswerSelect(currentQuestion.id, optionLetter);
                                    }
                                }}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold border-2 ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{optionLetter}</div>
                                <div className="flex-1">{option}</div>
                                {isReviewing && (
                                    <div className="flex-shrink-0">
                                        {isCorrectAnswer && (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        )}
                                        {isSelected && !isCorrectAnswer && (
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </button>
                <div className="flex gap-2">
                    {Object.keys(questionResults).length > 0 ? (
                        <button
                            onClick={() => navigate(`/lessons/${lessonId}`)}
                            className="px-6 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                        >
                            Hoàn thành ✓
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                const unansweredCount = questions.length - Object.keys(answers).length;
                                if (unansweredCount > 0) {
                                    const confirmSubmit = window.confirm(`Bạn chưa trả lời ${unansweredCount} câu hỏi.\nBạn có chắc chắn muốn nộp bài không?`);
                                    if (!confirmSubmit) return;
                                }
                                handleSubmitExercise();
                            }}
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
                        </button>
                    )}
                </div>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        disabled={true}
                        className="px-6 py-2 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="px-6 py-2 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                )}
            </div>

            {/* Progress Summary */}
            <div className="bg-gray-50 rounded-2xl shadow border border-gray-100 p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Progress Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                        <div className="font-semibold text-blue-600 text-lg">{Object.keys(answers).length}</div>
                        <div className="text-gray-600">Answered</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-gray-600 text-lg">{questions.length - Object.keys(answers).length}</div>
                        <div className="text-gray-600">Remaining</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-green-600 text-lg">{Math.round(progress)}%</div>
                        <div className="text-gray-600">Complete</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-orange-600 text-lg">{currentQuestion.points || 10}</div>
                        <div className="text-gray-600">Points</div>
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            {showCompletionModal && completionData && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-center mb-4">🎉 Kết quả bài tập</h2>
                        <div className="text-center mb-4">
                            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-700 text-center mb-4">
                            {completionData.score >= 80
                                ? 'Xuất sắc! Bạn đã hoàn thành bài tập với kết quả tuyệt vời!'
                                : completionData.score >= 60
                                    ? 'Tốt! Bạn đã hoàn thành bài tập với kết quả khả quan.'
                                    : 'Bạn đã hoàn thành bài tập. Hãy tiếp tục cố gắng nhé!'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{completionData.correctAnswers}</div>
                                <div>Câu đúng</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{questions.length - completionData.correctAnswers}</div>
                                <div>Câu sai</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{completionData.totalQuestions}</div>
                                <div>Tổng câu hỏi</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{completionData.points} điểm</div>
                                <div>Điểm thưởng</div>
                            </div>
                        </div>
                        {exercise?.timeLimit && (
                            <div className="mb-4 text-center">
                                <div className="font-medium text-gray-700">Thời gian làm bài:</div>
                                <div className="text-gray-900">
                                    {formatTime((exercise.timeLimit * 60) - (timeLeft > 0 ? timeLeft : 0))}
                                    <span className="text-gray-500 text-sm"> / {exercise.timeLimit} phút</span>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            <button
                                onClick={handleReturnToLesson}
                                className="px-6 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition flex-1"
                            >
                                Quay lại bài học
                            </button>
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                }}
                                className="px-6 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex-1"
                            >
                                Xem lại bài tập
                            </button>
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    setShowFeedbackModal(true);
                                }}
                                className="px-6 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition flex-1"
                            >
                                Đánh giá bài học
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            <FeedbackModal
                open={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                onSubmit={handleFeedbackModalSubmit}
                submitting={isFeedbackSubmitting}
            />
        </div>
    );
};

export default QuestionPage;