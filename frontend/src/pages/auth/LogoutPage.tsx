/**
 * ================================================================
 * LOGOUT PAGE COMPONENT
 * ================================================================
 * 
 * Dedicated logout page with confirmation and proper cleanup
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/SimpleToast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LogoutPage: React.FC = () => {
    const { logout, isAuthenticated, currentUser } = useAuth();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        // If user is not authenticated, redirect to home
        if (!isAuthenticated) {
            navigate('/', { replace: true });
            return;
        }

        // Auto-logout after component mounts
        const performLogout = async () => {
            try {
                setIsLoggingOut(true);
                await logout();
                success('Successfully logged out. See you next time!');

                // Redirect to home page after successful logout
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            } catch (err: any) {
                console.error('❌ Logout failed:', err);
                error('Logout failed. Please try again.');
                // Still redirect to home even if logout failed
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 2000);
            }
        };

        performLogout();
    }, [logout, navigate, isAuthenticated, success, error]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <motion.div
                className="max-w-md w-full mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    {/* Logo */}
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">L</span>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            LeEnglish
                        </div>
                        <span className="text-sm text-gray-500">TOEIC Platform</span>
                    </div>

                    {/* Logout Status */}
                    <motion.div
                        className="mb-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        {isLoggingOut ? (
                            <>
                                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Logging you out...
                                </h2>
                                <p className="text-gray-600">
                                    Thanks for studying with us, {currentUser?.username}!
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Logged out successfully
                                </h2>
                                <p className="text-gray-600">
                                    You have been securely logged out. See you next time!
                                </p>
                            </>
                        )}
                    </motion.div>

                    {/* Loading Animation */}
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex justify-center space-x-1">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="w-2 h-2 bg-blue-600 rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: index * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            Redirecting you to home page...
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default LogoutPage;
