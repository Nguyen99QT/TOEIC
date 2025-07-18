import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ExerciseHeaderProps {
    lessonId: string;
    exerciseCount: number;
    totalTime: number;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ lessonId, exerciseCount, totalTime }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-8">
            <button
                onClick={() => navigate('/lessons')}
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-all duration-200 hover:gap-3"
            >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Lessons</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lesson {lessonId} Exercises</h1>
                        <p className="text-gray-600 mt-2">Choose an exercise to start practicing</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Total time: {totalTime} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{exerciseCount} exercises available</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseHeader;
