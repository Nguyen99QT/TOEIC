import React from 'react';

interface ProgressSectionProps {
    exerciseCount: number;
    totalPoints: number;
    completedCount?: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ exerciseCount, totalPoints, completedCount = 0 }) => {
    return (
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                    <p className="text-gray-600">Track your learning journey</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{completedCount}/{exerciseCount}</div>
                    <div className="text-sm text-gray-600">Exercises Completed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                        {exerciseCount > 0 ? Math.round((completedCount / exerciseCount) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{totalPoints}</div>
                    <div className="text-sm text-gray-600">Total Points Available</div>
                </div>
            </div>
        </div>
    );
};

export default ProgressSection;
