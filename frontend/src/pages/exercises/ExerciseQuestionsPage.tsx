/**
 * ================================================================
 * EXERCISE QUESTIONS PAGE COMPONENT
 * ================================================================
 * Hiển thị và xử lý questions cho một exercise cụ thể
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { exerciseService } from '../../services/exercises';
import { questionService } from '../../services/questions';
import { Exercise, Question, QuestionAnswer } from '../../types';

interface UserAnswer {
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
    points: number;
}

interface ExerciseResult {
    totalQuestions: number;
    correctAnswers: number;
    totalPoints: number;
    earnedPoints: number;
    percentage: number;
    answers: UserAnswer[];
}

const ExerciseQuestionsPage: React.FC = () => {
    const { lessonId, exerciseId } = useParams<{ lessonId: string; exerciseId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // State management
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [exerciseResult, setExerciseResult] = useState<ExerciseResult | null>(null);
    const [showDetailedResults, setShowDetailedResults] = useState(false);

    // Fetch exercise and questions
    useEffect(() => {
        const fetchData = async () => {
            if (!lessonId || !exerciseId) {
                setError('Invalid exercise parameters');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log(`🔍 Fetching exercise ${exerciseId} and questions...`);

                // Fetch exercise details
                const exerciseData = await exerciseService.getExerciseById(parseInt(exerciseId));
                console.log('✅ Exercise data:', exerciseData);
                setExercise(exerciseData);

                // Fetch questions for this exercise
                const questionsData = await questionService.getQuestionsByExerciseId(parseInt(exerciseId));
                console.log('✅ Questions data:', questionsData);
                setQuestions(questionsData.sort((a, b) => a.questionOrder - b.questionOrder));

                setError(null);
            } catch (err: any) {
                console.error('❌ Error fetching exercise/questions:', err);
                setError(err.message || 'Failed to load exercise');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [lessonId, exerciseId]);

    // Handle answer selection
    const handleAnswerSelect = (questionId: number, answer: string) => {
        if (isSubmitted) return; // Không cho phép thay đổi sau khi submit
        
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Calculate exercise results
    const calculateResults = (): ExerciseResult => {
        const results: UserAnswer[] = [];
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        questions.forEach(question => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const points = isCorrect ? question.points : 0;

            results.push({
                questionId: question.id,
                selectedAnswer: userAnswer || '',
                isCorrect,
                points
            });

            if (isCorrect) correctCount++;
            totalPoints += question.points;
            earnedPoints += points;
        });

        const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

        return {
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            totalPoints,
            earnedPoints,
            percentage,
            answers: results
        };
    };

    // Handle exercise submission
    const handleSubmit = async () => {
        if (isSubmitted) return;

        // Validate all questions are answered
        const unansweredQuestions = questions.filter(q => !userAnswers[q.id]);
        if (unansweredQuestions.length > 0) {
            alert(`Please answer all questions. You have ${unansweredQuestions.length} unanswered questions.`);
            return;
        }

        try {
            setLoading(true);
            const result = calculateResults();
            
            // Submit to backend (if needed)
            try {
                await exerciseService.submitExerciseResult({
                    exerciseId: parseInt(exerciseId!),
                    answers: Object.entries(userAnswers).map(([questionId, answer]) => ({
                        questionId: parseInt(questionId),
                        selectedAnswer: answer
                    })),
                    score: result.percentage,
                    completedAt: new Date().toISOString()
                });
                console.log('✅ Exercise result submitted successfully');
            } catch (submitError) {
                console.warn('⚠️ Could not submit to backend:', submitError);
                // Continue with local results even if backend fails
            }

            setExerciseResult(result);
            setIsSubmitted(true);
            console.log('📊 Exercise Results:', result);
            
        } catch (error) {
            console.error('❌ Error submitting exercise:', error);
            alert('Failed to submit exercise. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get answer label (A, B, C, D)
    const getAnswerLabel = (answer: string): string => {
        switch (answer) {
            case 'A': return 'A';
            case 'B': return 'B';
            case 'C': return 'C';
            case 'D': return 'D';
            default: return answer;
        }
    };

    // Get answer text by option
    const getAnswerText = (question: Question, option: string): string => {
        switch (option) {
            case 'A': return question.optionA;
            case 'B': return question.optionB;
            case 'C': return question.optionC;
            case 'D': return question.optionD;
            default: return '';
        }
    };

    // Navigation functions
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Loading state
    if (loading && !isSubmitted) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Exercise Questions</h1>
                    <p className="mt-2 text-red-600">Error: {error}</p>
                </div>
                <button
                    onClick={() => navigate(`/lessons/${lessonId}/exercises`)}
                    className="btn btn-secondary"
                >
                    Back to Exercises
                </button>
            </div>
        );
    }

    // Results view
    if (isSubmitted && exerciseResult) {
        return (
            <div className="space-y-6">
                {/* Results Header */}
                <div className="text-center">
                    <div className="text-6xl mb-4">
                        {exerciseResult.percentage >= 80 ? '🎉' : 
                         exerciseResult.percentage >= 60 ? '👍' : '💪'}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Completed!</h1>
                    <p className="text-gray-600">{exercise?.title}</p>
                </div>

                {/* Score Summary */}
                <div className="card">
                    <div className="card-body text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Score</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{exerciseResult.percentage}%</div>
                                <div className="text-sm text-gray-600">Overall Score</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{exerciseResult.correctAnswers}</div>
                                <div className="text-sm text-gray-600">Correct Answers</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{exerciseResult.totalQuestions}</div>
                                <div className="text-sm text-gray-600">Total Questions</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{exerciseResult.earnedPoints}</div>
                                <div className="text-sm text-gray-600">Points Earned</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Message */}
                <div className={`card ${exerciseResult.percentage >= 80 ? 'bg-green-50 border-green-200' : 
                                    exerciseResult.percentage >= 60 ? 'bg-yellow-50 border-yellow-200' : 
                                    'bg-red-50 border-red-200'}`}>
                    <div className="card-body">
                        <h3 className="text-lg font-semibold mb-2">
                            {exerciseResult.percentage >= 80 ? '🌟 Excellent Work!' : 
                             exerciseResult.percentage >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
                        </h3>
                        <p className="text-gray-700">
                            {exerciseResult.percentage >= 80 ? 'You have mastered this exercise! Great understanding of the material.' : 
                             exerciseResult.percentage >= 60 ? 'Good progress! Review the incorrect answers to improve further.' : 
                             'Don\'t give up! Review the material and try again. Practice makes perfect!'}
                        </p>
                    </div>
                </div>

                {/* Detailed Results Toggle */}
                <div className="card">
                    <div className="card-body">
                        <button
                            onClick={() => setShowDetailedResults(!showDetailedResults)}
                            className="btn btn-outline w-full"
                        >
                            {showDetailedResults ? 'Hide' : 'Show'} Detailed Results
                        </button>
                        
                        {showDetailedResults && (
                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-semibold">Question Review</h3>
                                {questions.map((question, index) => {
                                    const userAnswer = exerciseResult.answers.find(a => a.questionId === question.id);
                                    const isCorrect = userAnswer?.isCorrect || false;
                                    
                                    return (
                                        <div key={question.id} className={`border rounded-lg p-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium">Question {index + 1}</h4>
                                                <span className={`text-sm px-2 py-1 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-700 mb-3">{question.questionText}</p>
                                            
                                            <div className="space-y-2">
                                                {['A', 'B', 'C', 'D'].map(option => (
                                                    <div key={option} className={`flex items-center p-2 rounded ${
                                                        option === question.correctAnswer ? 'bg-green-100 text-green-800' : 
                                                        option === userAnswer?.selectedAnswer && !isCorrect ? 'bg-red-100 text-red-800' : 
                                                        'bg-gray-50'
                                                    }`}>
                                                        <span className="font-medium mr-2">{option}.</span>
                                                        <span>{getAnswerText(question, option)}</span>
                                                        {option === question.correctAnswer && (
                                                            <span className="ml-auto text-green-600">✓</span>
                                                        )}
                                                        {option === userAnswer?.selectedAnswer && !isCorrect && (
                                                            <span className="ml-auto text-red-600">✗</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {question.explanation && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Explanation:</strong> {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(`/lessons/${lessonId}`)}
                        className="btn btn-primary"
                    >
                        📖 Review Lesson
                    </button>
                    <button
                        onClick={() => navigate(`/lessons/${lessonId}/exercises`)}
                        className="btn btn-secondary"
                    >
                        🔄 Back to Exercises
                    </button>
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setExerciseResult(null);
                            setUserAnswers({});
                            setCurrentQuestionIndex(0);
                        }}
                        className="btn btn-outline"
                    >
                        🔄 Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Questions view
    if (!exercise || questions.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">No Questions Available</h1>
                    <p className="mt-2 text-gray-600">This exercise doesn't have any questions yet.</p>
                </div>
                <button
                    onClick={() => navigate(`/lessons/${lessonId}/exercises`)}
                    className="btn btn-secondary"
                >
                    Back to Exercises
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <button
                        onClick={() => navigate('/lessons')}
                        className="hover:text-blue-600"
                    >
                        Lessons
                    </button>
                    <span>›</span>
                    <button
                        onClick={() => navigate(`/lessons/${lessonId}`)}
                        className="hover:text-blue-600"
                    >
                        Lesson {lessonId}
                    </button>
                    <span>›</span>
                    <button
                        onClick={() => navigate(`/lessons/${lessonId}/exercises`)}
                        className="hover:text-blue-600"
                    >
                        Exercises
                    </button>
                    <span>›</span>
                    <span>{exercise.title}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{exercise.title}</h1>
                <p className="mt-2 text-gray-600">{exercise.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="card">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="card">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            Question {currentQuestionIndex + 1}
                        </h2>
                        <span className="text-sm text-gray-500">
                            {currentQuestion.points} points
                        </span>
                    </div>
                    
                    <p className="text-lg text-gray-900 mb-6">
                        {currentQuestion.questionText}
                    </p>

                    {/* Answer Options */}
                    <div className="space-y-3">
                        {['A', 'B', 'C', 'D'].map(option => (
                            <label 
                                key={option}
                                className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                    userAnswers[currentQuestion.id] === option ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    value={option}
                                    checked={userAnswers[currentQuestion.id] === option}
                                    onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                                    className="mr-3"
                                />
                                <span className="font-medium mr-2">{option}.</span>
                                <span>{getAnswerText(currentQuestion, option)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="btn btn-outline"
                >
                    ← Previous
                </button>

                {/* Question Numbers */}
                <div className="flex gap-2">
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToQuestion(index)}
                            className={`w-8 h-8 rounded text-sm ${
                                index === currentQuestionIndex ? 'bg-blue-600 text-white' :
                                userAnswers[questions[index].id] ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="btn btn-outline"
                >
                    Next →
                </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    disabled={Object.keys(userAnswers).length !== questions.length}
                    className="btn btn-primary btn-lg"
                >
                    {Object.keys(userAnswers).length === questions.length ? 
                        'Submit Exercise' : 
                        `Answer ${questions.length - Object.keys(userAnswers).length} more questions`
                    }
                </button>
            </div>
        </div>
    );
};

export default ExerciseQuestionsPage;