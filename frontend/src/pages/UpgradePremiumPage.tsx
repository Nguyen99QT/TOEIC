import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UpgradePremiumPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {  currentUser } = useAuth();

    const state = location.state as { from?: string; requestedLesson?: any };

    const handleUpgrade = async () => {
        // Implement upgrade logic here
        alert('Upgrade functionality will be implemented with payment gateway integration.');

        // For now, redirect back
        if (state?.from) {
            navigate(state.from);
        } else {
            navigate('/lessons');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to PRE Membership</h1>
                <p className="text-xl text-gray-600">
                    Unlock all advanced lessons and premium features
                </p>
            </div>

            {/* Comparison Table */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className="card border-2 border-gray-200">
                    <div className="card-body">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">FREE</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">$0<span className="text-sm text-gray-500">/month</span></p>
                        </div>

                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span>Access to A1-A2 lessons</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span>Basic exercises</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span>Progress tracking</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-red-500 mr-3">✗</span>
                                <span className="text-gray-400">B1-C2 advanced lessons</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-red-500 mr-3">✗</span>
                                <span className="text-gray-400">Advanced exercises</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-red-500 mr-3">✗</span>
                                <span className="text-gray-400">Certificate</span>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <p className="text-center text-gray-500 text-sm">Current Plan</p>
                        </div>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="card border-2 border-purple-500 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            RECOMMENDED
                        </span>
                    </div>

                    <div className="card-body">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">PRE MEMBERSHIP</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">$9.99<span className="text-sm text-gray-500">/month</span></p>
                        </div>

                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span>Everything in FREE</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="font-medium">B1-C2 advanced lessons</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="font-medium">Advanced exercises & tests</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="font-medium">Detailed progress analytics</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="font-medium">Completion certificates</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="font-medium">Priority support</span>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <button
                                onClick={handleUpgrade}
                                className="btn btn-primary w-full text-lg py-3"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Detail */}
            <div className="card">
                <div className="card-body">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Get with PRE Membership</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">📚 Advanced Content</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• B1 (Intermediate) lessons</li>
                                <li>• B2 (Upper Intermediate) lessons</li>
                                <li>• C1 (Advanced) lessons</li>
                                <li>• C2 (Proficient) lessons</li>
                                <li>• Business English modules</li>
                                <li>• TOEIC test preparation</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">🎯 Premium Features</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Listening exercises with audio</li>
                                <li>• Speaking practice sessions</li>
                                <li>• Grammar deep-dive lessons</li>
                                <li>• Vocabulary building tools</li>
                                <li>• Mock TOEIC tests</li>
                                <li>• Performance analytics</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
                <button
                    onClick={() => navigate('/lessons')}
                    className="btn btn-outline"
                >
                    Maybe Later - Back to Lessons
                </button>
            </div>
        </div>
    );
};

export default UpgradePremiumPage;