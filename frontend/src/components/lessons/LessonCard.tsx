/**
 * ================================================================
 * LESSON CARD COMPONENT
 * ================================================================
 * Card component hiển thị lesson với image và audio support
 */

import React, { useState } from 'react';
import MediaService from '../../services/mediaService';
import { Lesson } from '../../types';
import './LessonCard.css';

interface LessonCardProps {
    lesson: Lesson;
    onClick?: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleImageError = () => {
        console.warn('❌ Failed to load image:', lesson.imageUrl);
        setImageError(true);
    };

    const handleAudioError = () => {
        console.warn('❌ Failed to load audio:', lesson.audioUrl);
        setAudioError(true);
    };

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lesson.audioUrl && !audioError) {
            setIsPlaying(true);
            const audio = new Audio(lesson.audioUrl);

            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => {
                console.error('❌ Audio play failed');
                setAudioError(true);
                setIsPlaying(false);
            };

            audio.play().catch(err => {
                console.error('❌ Audio play failed:', err);
                setAudioError(true);
                setIsPlaying(false);
            });
        }
    };

    // Xử lý image URL - sử dụng MediaService
    const getImageUrl = () => {
        const processedUrl = MediaService.processImageUrl(lesson.imageUrl);
        if (processedUrl) {
            // Test URL accessibility in development
            if (process.env.NODE_ENV === 'development') {
                MediaService.testMediaUrl(processedUrl, 'image').catch(() => {
                    console.warn('Image URL test failed, but continuing...');
                });
            }
        }
        return processedUrl;
    };

    // Xử lý audio URL - sử dụng MediaService
    const getAudioUrl = () => {
        const processedUrl = MediaService.processAudioUrl(lesson.audioUrl);
        if (processedUrl) {
            // Test URL accessibility in development
            if (process.env.NODE_ENV === 'development') {
                MediaService.testMediaUrl(processedUrl, 'audio').catch(() => {
                    console.warn('Audio URL test failed, but continuing...');
                });
            }
        }
        return processedUrl;
    };

    const finalImageUrl = getImageUrl();
    const finalAudioUrl = getAudioUrl();

    return (
        <div
            className="lesson-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={onClick}
        >
            {/* Lesson Image */}
            <div className="relative h-48 bg-gray-200">
                {finalImageUrl && !imageError ? (
                    <img
                        src={finalImageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        onLoad={() => console.log('✅ Image loaded:', finalImageUrl)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600">
                        <div className="text-white text-center">
                            <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium">{lesson.title}</p>
                            <p className="text-xs opacity-75">No Image Available</p>
                        </div>
                    </div>
                )}

                {/* Audio Play Button Overlay */}
                {finalAudioUrl && !audioError && (
                    <button
                        onClick={playAudio}
                        disabled={isPlaying}
                        className="absolute top-3 right-3 bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
                        title="Play Audio"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Difficulty Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${lesson.level === 'A1' || lesson.level === 'A2' ? 'bg-green-100 text-green-800' :
                            lesson.level === 'B1' || lesson.level === 'B2' ? 'bg-yellow-100 text-yellow-800' :
                                lesson.level === 'C1' || lesson.level === 'C2' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                        }`}>
                        {lesson.level || 'A1'}
                    </span>
                </div>
            </div>

            {/* Lesson Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {lesson.title}
                    </h3>
                    {lesson.isPremium && (
                        <span className="flex-shrink-0 ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                            ⭐ PREMIUM
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {lesson.description || 'Improve your English skills with this comprehensive lesson'}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {lesson.duration || '15'} min
                        </span>
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {(lesson as any).exercisesCount || lesson.totalExercises || 0} exercises
                        </span>
                    </div>

                    {/* Media indicators */}
                    <div className="flex items-center space-x-2">
                        {finalImageUrl && !imageError && (
                            <div className="flex items-center text-green-600 text-xs">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Image
                            </div>
                        )}
                        {finalAudioUrl && !audioError && (
                            <div className="flex items-center text-blue-600 text-xs">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793l-4.146-3.317a1 1 0 01-.37-.793V7.247a1 1 0 01.37-.793l4.146-3.317a1 1 0 011.617.793z" clipRule="evenodd" />
                                </svg>
                                Audio
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar if user has started this lesson */}
                {lesson.progress && lesson.progress > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(lesson.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 lesson-progress-bar"
                                data-progress={lesson.progress}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonCard;
