/**
 * ================================================================
 * LESSON EXERCISES PAGE COMPONENT
 * ================================================================
 * Hiển thị danh sách exercises cho một lesson cụ thể
 */

// Import các dependencies và components cần thiết
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { lessonService } from '../../services/lessons';
import { Exercise, Lesson } from '../../types';

const LessonExercisesPage: React.FC = () => {
    // Lấy lesson ID từ URL parameter (route: /lessons/:id/exercises)
    const { id } = useParams<{ id: string }>();

    // Hook điều hướng từ React Router
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    // Get success message from state if available
    const successMessage = location.state?.message;

    // State management - dùng useState hooks để quản lý local state
    const [lesson, setLesson] = useState<Lesson | null>(null); // Lưu dữ liệu bài học
    const [exercises, setExercises] = useState<Exercise[]>([]); // Danh sách bài tập của lesson
    const [loading, setLoading] = useState(true); // Trạng thái loading khi fetch data
    const [error, setError] = useState<string | null>(null); // Lưu thông báo lỗi nếu có

    // useEffect hook cho data fetching và initialization
    // Chạy khi component mount và khi id thay đổi
    useEffect(() => {
        const fetchData = async () => {
            // Validate lesson ID từ URL params
            if (!id) {
                setError('Lesson ID not found'); // Set error nếu không có ID
                setLoading(false); // Tắt loading state
                return;
            }

            try {
                // Bắt đầu loading
                setLoading(true);
                console.log(`🔍 Fetching lesson ${id} and its exercises...`);

                // Fetch lesson details
                const lessonData = await lessonService.getLessonById(parseInt(id));
                console.log('✅ Lesson data:', lessonData);
                setLesson(lessonData);

                // Check access permissions
                if (lessonData.isPremium && (!currentUser || !currentUser.isPremium)) {
                    setError('This is a premium lesson. Please upgrade your account to access premium content.');
                    setLoading(false);
                    return;
                }

                if (!currentUser && lessonData.orderIndex > 2) {
                    setError('Please register and log in to access more lessons. Free users can only access the first 2 basic lessons.');
                    setLoading(false);
                    return;
                }

                // Fetch exercises for this lesson
                try {
                    const exercisesData = await lessonService.getLessonExercises(parseInt(id));
                    console.log('✅ Exercises data:', exercisesData);
                    setExercises(exercisesData || []);
                } catch (exerciseError) {
                    console.warn('⚠️ Could not fetch exercises, using empty array');
                    setExercises([]);
                }

                setError(null);
            } catch (err: any) {
                console.error('❌ Error fetching lesson/exercises:', err);

                if (err.response?.status === 404) {
                    setError('Lesson not found');
                } else {
                    setError(err.message || 'Failed to load lesson');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser]);

    // Hàm định dạng loại bài tập cho dễ đọc
    const formatExerciseType = (type: string): string => {
        switch (type) {
            case 'READING': return 'Reading';
            case 'LISTENING': return 'Listening';
            case 'VOCABULARY': return 'Vocabulary';
            case 'GRAMMAR': return 'Grammar';
            default: return type;
        }
    };

    // Hàm định dạng độ khó của bài tập cho dễ đọc
    const formatDifficulty = (difficulty: string): string => {
        switch (difficulty) {
            case 'EASY': return 'Easy';
            case 'MEDIUM': return 'Medium';
            case 'HARD': return 'Hard';
            default: return difficulty;
        }
    };

    // Cập nhật hàm handleStartExercise
    const handleStartExercise = (exercise: Exercise) => {
        console.log(`🎯 Starting exercise ${exercise.id}: ${exercise.title}`);

        // Navigate to exercise questions page
        navigate(`/lessons/${id}/exercises/${exercise.id}/questions`);
    };

    // Hàm mở exercise trong modal
    const openExerciseModal = (exercise: Exercise) => {
        // Tạo modal content dựa trên exercise type
        const modalContent = generateExerciseContent(exercise);

        // Show modal với exercise content
        alert(`🎯 Exercise: ${exercise.title}\n\nType: ${formatExerciseType(exercise.type)}\nDifficulty: ${formatDifficulty(exercise.difficulty)}\n\nThis will open the exercise interface.\n\n(Implementation coming soon...)`);
    };

    // Hàm generate content cho từng loại exercise
    const generateExerciseContent = (exercise: Exercise) => {
        switch (exercise.type) {
            case 'READING':
                return {
                    title: `📖 Reading Exercise: ${exercise.title}`,
                    description: 'Read the passage and answer the questions.',
                    instruction: 'Take your time to read carefully before answering.',
                };
            case 'LISTENING':
                return {
                    title: `🎧 Listening Exercise: ${exercise.title}`,
                    description: 'Listen to the audio and answer the questions.',
                    instruction: 'You can play the audio multiple times.',
                };
            case 'VOCABULARY':
                return {
                    title: `📝 Vocabulary Exercise: ${exercise.title}`,
                    description: 'Choose the correct word or definition.',
                    instruction: 'Build your vocabulary step by step.',
                };
            case 'GRAMMAR':
                return {
                    title: `📚 Grammar Exercise: ${exercise.title}`,
                    description: 'Complete the sentences with correct grammar.',
                    instruction: 'Focus on grammar rules and patterns.',
                };
            default:
                return {
                    title: `✏️ Exercise: ${exercise.title}`,
                    description: exercise.description,
                    instruction: 'Follow the instructions carefully.',
                };
        }
    };

    // CONDITIONAL RENDERING - Loading state
    // Hiển thị spinner khi đang fetch data
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // CONDITIONAL RENDERING - Error state
    // Hiển thị thông báo lỗi khi fetch data thất bại
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lesson Exercises</h1>
                    <p className="mt-2 text-red-600">Error: {error}</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/lessons')}
                        className="btn btn-secondary"
                    >
                        Back to Lessons
                    </button>

                    {lesson && (
                        <button
                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                            className="btn btn-outline"
                        >
                            View Lesson Details
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // CONDITIONAL RENDERING - Not found state
    // Hiển thị thông báo khi không tìm thấy bài học
    if (!lesson) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lesson Not Found</h1>
                    <p className="mt-2 text-gray-600">The requested lesson could not be found.</p>
                </div>

                <button
                    onClick={() => navigate('/lessons')}
                    className="btn btn-primary"
                >
                    Back to Lessons
                </button>
            </div>
        );
    }

    // MAIN UI RENDERING - Success state
    // Chỉ render UI chính khi đã fetch data thành công
    return (
        <div className="space-y-6">
            {/* Success message if redirected from completed exercise */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4" role="alert">
                    <div className="flex items-center">
                        <span className="text-green-600 text-xl mr-3">✅</span>
                        <p className="text-green-800">{successMessage}</p>
                    </div>
                </div>
            )}

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
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                        className="hover:text-blue-600"
                    >
                        {lesson.title}
                    </button>
                    <span>›</span>
                    <span>Exercises</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">{lesson.title} - Exercises</h1>
                <p className="mt-2 text-gray-600">{lesson.description}</p>
            </div>

            {/* Audio URL - New Section */}
            {lesson.audioUrl && (
                <audio controls className="w-full">
                    <source src={lesson.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}

            {/* Main Content */}
            <div className="grid gap-6">
                {/* Exercises List */}
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Exercises</h2>

                        {exercises.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-6xl mb-4">📝</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises available</h3>
                                <p className="text-gray-600 mb-4">
                                    This lesson doesn't have any exercises yet. Check back later or view the lesson content.
                                </p>
                                <button
                                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                                    className="btn btn-primary"
                                >
                                    View Lesson Content
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {exercises
                                    .sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map((exercise, index) => (
                                        <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Exercise {index + 1}: {exercise.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded ${exercise.type === 'READING' ? 'bg-blue-100 text-blue-800' :
                                                        exercise.type === 'LISTENING' ? 'bg-purple-100 text-purple-800' :
                                                            exercise.type === 'VOCABULARY' ? 'bg-green-100 text-green-800' :
                                                                'bg-orange-100 text-orange-800'
                                                        }`}>
                                                        {formatExerciseType(exercise.type)}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${exercise.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                                                        exercise.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {formatDifficulty(exercise.difficulty)}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-3">{exercise.description}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    {exercise.totalQuestions && (
                                                        <span>{exercise.totalQuestions} questions</span>
                                                    )}
                                                    {exercise.timeLimit && (
                                                        <span> • {exercise.timeLimit} minutes</span>
                                                    )}
                                                </div>

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleStartExercise(exercise)}
                                                >
                                                    Start Exercise
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Tracking Section */}
                <div className="card">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Your Progress</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Overall Progress</span>
                                <span className="text-gray-900 font-medium">
                                    {lesson.progress !== undefined ? `${lesson.progress}%` : '0%'}
                                </span>
                            </div>

                            {lesson.progress !== undefined && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${lesson.progress}%` }}
                                    ></div>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Exercises Completed</span>
                                <span>
                                    {lesson.completedExercises || 0} / {lesson.totalExercises || exercises.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
                <button
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                    className="btn btn-secondary"
                >
                    View Lesson Details
                </button>
                <button
                    onClick={() => navigate('/lessons')}
                    className="btn btn-outline"
                >
                    Back to Lessons
                </button>
            </div>
        </div>
    );
};

// Export component để sử dụng ở nơi khác (thường trong router)
export default LessonExercisesPage;
