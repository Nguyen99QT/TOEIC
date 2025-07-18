import React from 'react';

interface DevelopmentInfoProps {
    lessonId: string;
    exerciseCount: number;
}

const DevelopmentInfo: React.FC<DevelopmentInfoProps> = ({ lessonId, exerciseCount }) => {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="font-bold text-yellow-800">Development Mode</h4>
            </div>
            <p className="text-sm text-yellow-700">
                <strong>Lesson ID:</strong> {lessonId} | <strong>Exercises Loaded:</strong> {exerciseCount} | <strong>Database Integration:</strong> ✅ Ready
            </p>
        </div>
    );
};

export default DevelopmentInfo;
