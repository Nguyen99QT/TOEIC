import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '../../types/Exercise';
import { getDifficultyColor, getExerciseGradient, getButtonGradient, formatTimeLimit } from '../../utils/exerciseUtils';
import ExerciseIcon from './ExerciseIcon';

interface ExerciseCardProps {
    exercise: Exercise;
    index: number;
    lessonId: string;
    isCompleted?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index, lessonId, isCompleted = false }) => {
    const navigate = useNavigate();

    const handleStartExercise = () => {
        navigate(`/lessons/${lessonId}/exercises/${exercise.id}/questions`);
    };

    return (
        <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-blue-200'
            }`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg text-white ${getExerciseGradient(index)} relative`}>
                        <ExerciseIcon type={exercise.type} />
                        {isCompleted && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                ✓
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isCompleted && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Completed
                            </span>
                        )}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
                            {exercise.difficulty_level.toUpperCase()}
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatTimeLimit(exercise.time_limit_seconds)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exercise.options.length} questions</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span>{exercise.points} points</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                            </svg>
                            <span>{exercise.type.replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                </div>

                <button
                    className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105 ${isCompleted
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                            : `${getButtonGradient(index)} text-white`
                        }`}
                    onClick={handleStartExercise}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            isCompleted
                                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                : "M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        } />
                    </svg>
                    <span>{isCompleted ? 'Review Exercise' : 'Start Exercise'}</span>
                </button>
            </div>
        </div>
    );
};

export default ExerciseCard;
