import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimpleHomePage: React.FC = () => {
    const { isAuthenticated, currentUser, loading } = useAuth();
    const navigate = useNavigate();

    // Helper function to get correct dashboard path based on user role
    const getDashboardPath = () => {
        if (currentUser?.role === 'ADMIN') {
            return '/admin/dashboard';
        } else if (currentUser?.role === 'COLLABORATOR') {
            return '/collaborator/dashboard';
        } else {
            return '/dashboard';
        }
    };

    console.log('🏠 SimpleHomePage: Auth state:', { isAuthenticated, currentUser: currentUser?.username || 'guest', loading });

    // If user becomes authenticated, redirect to home to load full HomePage
    useEffect(() => {
        if (isAuthenticated && !loading) {
            console.log('🔄 SimpleHomePage: User authenticated, reloading full homepage...');
            // Force a page reload to ensure HomePage is properly loaded
            window.location.reload();
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải LeEnglish TOEIC Platform...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Master TOEIC with <span className="text-yellow-300">LeEnglish</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Comprehensive TOEIC preparation platform designed to help you achieve your target score with interactive lessons, practice tests, and personalized learning paths.
                    </p>

                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <p className="text-lg">
                                Welcome back, <span className="font-bold text-yellow-300">{currentUser?.username}</span>!
                                Ready to improve your TOEIC score?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate(getDashboardPath())}
                                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
                                >
                                    📊 Go to Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/lessons')}
                                    className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors transform hover:scale-105"
                                >
                                    📚 Continue Learning
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
                                <p className="text-lg mb-4">
                                    🎯 <strong>Start your TOEIC journey today!</strong> Join thousands of successful learners.
                                </p>
                                <p className="text-sm opacity-90 mb-4">
                                    ✨ Get access to premium lessons, practice tests, and personalized study plans
                                </p>
                                <div className="flex items-center justify-center space-x-4 text-sm opacity-80">
                                    <span>🆓 Free to start</span>
                                    <span>•</span>
                                    <span>📱 Mobile friendly</span>
                                    <span>•</span>
                                    <span>🎓 Expert designed</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    🚀 Get Started Free
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
                                >
                                    🔑 Sign In
                                </button>
                            </div>

                            <p className="text-sm opacity-75 max-w-md mx-auto">
                                Already have an account? <button
                                    onClick={() => navigate('/login')}
                                    className="underline hover:text-yellow-300 font-medium"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-yellow-300">10,053+</div>
                        <div className="text-sm opacity-80">Active Students</div>
                    </div>
                    <div className="text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-green-300">513+</div>
                        <div className="text-sm opacity-80">Practice Questions</div>
                    </div>
                    <div className="text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-purple-300">94%</div>
                        <div className="text-sm opacity-80">Success Rate</div>
                    </div>
                    <div className="text-center transform hover:scale-105 transition-transform">
                        <div className="text-3xl font-bold text-yellow-300">4.91</div>
                        <div className="text-sm opacity-80">Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white/5 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Choose LeEnglish?</h2>
                        <p className="text-lg opacity-90 max-w-2xl mx-auto">
                            Comprehensive TOEIC preparation with proven methods and cutting-edge technology
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white/10 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold mb-2">Interactive Lessons</h3>
                            <p className="opacity-80">Comprehensive lessons covering all TOEIC topics with multimedia content</p>
                            {!isAuthenticated && (
                                <button
                                    onClick={() => navigate('/register')}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                                >
                                    Try Free Lesson
                                </button>
                            )}
                        </div>

                        <div className="bg-white/10 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-2">Practice Tests</h3>
                            <p className="opacity-80">Real TOEIC-style questions and full-length mock tests</p>
                            {!isAuthenticated && (
                                <button
                                    onClick={() => navigate('/register')}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                                >
                                    Take Practice Test
                                </button>
                            )}
                        </div>

                        <div className="bg-white/10 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                            <p className="opacity-80">Monitor your improvement with detailed analytics and insights</p>
                            {!isAuthenticated && (
                                <button
                                    onClick={() => navigate('/register')}
                                    className="mt-4 bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600 transition-colors"
                                >
                                    See Your Progress
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* What Students Say Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
                        <p className="text-lg opacity-90">Real success stories from TOEIC learners</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white/10 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                                    A
                                </div>
                                <div className="ml-3">
                                    <div className="font-semibold">Anna Nguyen</div>
                                    <div className="text-sm opacity-80">Score: 450 → 850</div>
                                </div>
                            </div>
                            <p className="text-sm opacity-90">
                                "LeEnglish helped me improve my TOEIC score by 400 points in just 3 months! The practice tests were exactly like the real exam."
                            </p>
                        </div>

                        <div className="bg-white/10 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                                    D
                                </div>
                                <div className="ml-3">
                                    <div className="font-semibold">David Tran</div>
                                    <div className="text-sm opacity-80">Score: 600 → 920</div>
                                </div>
                            </div>
                            <p className="text-sm opacity-90">
                                "The interactive lessons and progress tracking kept me motivated. I achieved my target score for my dream job!"
                            </p>
                        </div>

                        <div className="bg-white/10 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                                    M
                                </div>
                                <div className="ml-3">
                                    <div className="font-semibold">Mai Pham</div>
                                    <div className="text-sm opacity-80">Score: 550 → 890</div>
                                </div>
                            </div>
                            <p className="text-sm opacity-90">
                                "Best TOEIC platform I've used! The explanations are clear and the mobile app made studying so convenient."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Your TOEIC Journey?</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of students who have achieved their target TOEIC scores with LeEnglish.
                            Start your free trial today!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors transform hover:scale-105"
                            >
                                🚀 Start Free Trial
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="border-2 border-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                        </div>

                        <p className="text-sm mt-4 opacity-80">
                            No credit card required • 7-day free trial • Cancel anytime
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleHomePage;
