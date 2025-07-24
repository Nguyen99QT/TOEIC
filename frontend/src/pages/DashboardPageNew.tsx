/**
 * ================================================================
 * DASHBOARD PAGE COMPONENT
 * ================================================================
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to your Dashboard!
                </h1>
                <p className="text-gray-600 mb-6">
                    Hello {currentUser && typeof currentUser === 'object' ? currentUser.username : 'User'}!
                    Here you can track your learning progress and manage your studies.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900">Flashcards</h3>
                        <p className="text-blue-700">Study vocabulary with interactive flashcards</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-900">Lessons</h3>
                        <p className="text-green-700">Learn TOEIC skills through structured lessons</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-900">Progress</h3>
                        <p className="text-purple-700">Track your learning achievements</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
