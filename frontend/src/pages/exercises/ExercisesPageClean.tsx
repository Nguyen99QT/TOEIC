import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exerciseService } from '../../services/exercises';
import { Exercise } from '../../types';

// Local interface for backend response (specific to database table structure)
interface ExerciseResponse {
    id: number;
    lessonId: number;
    title: string;
    type: string;
    question: string;
    correctAnswer: string;
    options?: string; // JSON string
    explanation?: string;
    difficultyLevel: string;
    points: number;
    timeLimitSeconds: number;
    audioUrl?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

const ExercisesPageClean: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

    // Transform backend response to frontend Exercise interface
    const transformExerciseResponse = (responseExercise: ExerciseResponse): Exercise => {
        return {
            id: responseExercise.id,
            title: responseExercise.title,
            description: responseExercise.question, // Use question as description
            type: responseExercise.type as "READING" | "LISTENING" | "VOCABULARY" | "GRAMMAR",
            difficulty: responseExercise.difficultyLevel.toUpperCase() as "EASY" | "MEDIUM" | "HARD",
            orderIndex: responseExercise.id, // Use id as order for now
            totalQuestions: 1, // Each exercise is one question
            timeLimit: Math.ceil(responseExercise.timeLimitSeconds / 60), // Convert to minutes
            isActive: true,
            lessonId: responseExercise.lessonId,
            createdAt: responseExercise.createdAt,
            updatedAt: responseExercise.updatedAt
        };
    };

    useEffect(() => {
        const fetchExercises = async () => {
            if (!lessonId) {
                setError('Lesson ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log(`🔄 Fetching exercises for lesson ${lessonId}...`);
                const exercisesData = await exerciseService.getExercisesByLessonId(Number(lessonId));
                console.log('✅ Exercises data received:', exercisesData);

                // Check if data is already in the correct format, if not transform it
                if (exercisesData.length > 0 && 'question' in exercisesData[0]) {
                    // Backend format - transform to frontend format
                    const transformedExercises = (exercisesData as unknown as ExerciseResponse[]).map(transformExerciseResponse);
                    setExercises(transformedExercises);
                } else {
                    // Already in frontend format
                    setExercises(exercisesData as Exercise[]);
                }

                // Mock some completed exercises for demonstration
                setCompletedExercises(new Set([1, 3])); // Example completed exercise IDs
            } catch (err: any) {
                console.error('❌ Error fetching exercises:', err);

                // Better error handling
                if (err.response) {
                    const statusCode = err.response.status;
                    if (statusCode === 404) {
                        setError(`No exercises found for lesson ${lessonId}.`);
                    } else if (statusCode === 401 || statusCode === 403) {
                        setError(`You don't have permission to access these exercises.`);
                    } else {
                        setError(`Server error (${statusCode}). Please try again later.`);
                    }
                } else if (err.request) {
                    setError('Could not connect to the server. Please check your internet connection.');
                } else {
                    setError(`Failed to load exercises: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [lessonId]);

    // Calculate totals
    const totalTimeMinutes = exercises.reduce((sum, ex) => sum + (ex.timeLimit || 0), 0);
    const totalQuestions = exercises.reduce((sum, ex) => sum + (ex.totalQuestions || 1), 0);

    if (loading) {
        return (
            <div className="exercises-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-8 w-24 bg-gray-300 rounded animate-pulse mr-4"></div>
                            <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Loading skeletons */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                                <div className="flex gap-2 mb-4">
                                    <div className="h-5 w-16 bg-gray-300 rounded"></div>
                                    <div className="h-5 w-20 bg-gray-300 rounded"></div>
                                </div>
                                <div className="h-9 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="exercises-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex items-center">
                        <button
                            onClick={() => navigate(`/lessons/${lessonId}`)}
                            className="mr-4 flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Lesson
                        </button>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="text-red-500 text-xl mr-3">⚠️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Exercises</h3>
                                <p className="text-red-700">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (exercises.length === 0) {
        return (
            <div className="exercises-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex items-center">
                        <button
                            onClick={() => navigate(`/lessons/${lessonId}`)}
                            className="mr-4 flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Lesson
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Lesson Exercises</h1>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Exercises Available</h2>
                        <p className="text-gray-600">No exercises found for this lesson. Check back later!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="exercises-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Back Button */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(`/lessons/${lessonId}`)}
                            className="mr-4 flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Lesson
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Lesson {lessonId} - Exercises</h1>
                    </div>
                </div>

                {/* Lesson Summary Card */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {exercises.length} exercises
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {totalTimeMinutes} minutes
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {totalQuestions} questions total
                            </span>
                        </div>
                    </div>
                </div>

                {/* Exercises Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {exercises.map((exercise) => {
                        const isCompleted = completedExercises.has(exercise.id);

                        return (
                            <div key={exercise.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-lg text-white bg-gradient-to-br from-blue-500 to-indigo-600 mr-3">
                                                {exercise.type === 'LISTENING' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5 7h4l5-5v20l-5-5H5V7z" />
                                                    </svg>
                                                ) : exercise.type === 'READING' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                ) : exercise.type === 'VOCABULARY' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">{exercise.title}</h3>
                                        </div>

                                        {isCompleted && (
                                            <span className="ml-2 bg-green-100 text-green-800 border-green-200 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                                <svg className="mr-1 h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Completed
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {exercise.description && exercise.description.length > 100 ?
                                            `${exercise.description.substring(0, 100)}...` :
                                            exercise.description || 'No description available'
                                        }
                                    </p>

                                    {/* Exercise Metadata */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                            <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {exercise.timeLimit || 0} min
                                        </span>
                                        <span className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                            <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {exercise.totalQuestions || 1} question{(exercise.totalQuestions || 1) > 1 ? 's' : ''}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${exercise.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                                exercise.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {exercise.difficulty.toLowerCase()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/lessons/${lessonId}/exercises/${exercise.id}/questions`)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{isCompleted ? 'Retry Exercise' : 'Start Exercise'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{completedExercises.size}/{exercises.length}</div>
                            <div className="text-sm text-gray-600">Exercises Completed</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {exercises.length > 0 ? Math.round((completedExercises.size / exercises.length) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{totalQuestions}</div>
                            <div className="text-sm text-gray-600">Total Questions Available</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExercisesPageClean;
