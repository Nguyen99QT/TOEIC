import React from 'react';
import { Lesson } from '../../types';

interface LessonCardProps {
    lesson: Lesson;
    onClick?: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
    const formatDuration = (minutes?: number) => {
        if (!minutes) return 'Duration not specified';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
            onClick={onClick}
        >
            {/* Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {lesson.imageUrl ? (
                    <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-white text-6xl">📖</div>
                )}

                {/* Premium badge */}
                {lesson.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                        Premium
                    </div>
                )}

                {/* Difficulty badge */}
                {lesson.difficulty && (
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {lesson.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {lesson.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        {lesson.duration && (
                            <span className="flex items-center">
                                ⏱️ {formatDuration(lesson.duration)}
                            </span>
                        )}

                        {lesson.level && (
                            <span className="flex items-center">
                                📊 {lesson.level}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-1">
                        {lesson.audioUrl && (
                            <span title="Has audio">🔊</span>
                        )}
                        {lesson.isPublic ? (
                            <span title="Public" className="text-green-600">🌐</span>
                        ) : (
                            <span title="Private" className="text-gray-400">🔒</span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    <div className="flex justify-between items-center">
                        <span>{lesson.type || 'Lesson'}</span>
                        <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
