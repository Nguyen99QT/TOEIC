import React from 'react';
import { useParams } from 'react-router-dom';

const ExercisesPageSimple: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Exercises for Lesson {lessonId}
                </h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <p className="text-gray-600">
                        This is a simplified version of the ExercisesPage to test for import/export issues.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExercisesPageSimple;
