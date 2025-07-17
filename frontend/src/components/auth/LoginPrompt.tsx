/**
 * ================================================================
 * LOGIN PROMPT COMPONENT
 * ================================================================
 * 
 * Displays a friendly login prompt for guest users trying to access protected content
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LoginPromptProps {
    title?: string;
    message?: string;
    showTimer?: boolean;
    redirectDelay?: number;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
    title = "Đăng nhập để tiếp tục",
    message = "Bạn cần phải đăng nhập để xem bài học chi tiết",
    showTimer = true,
    redirectDelay = 3000
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = React.useState(redirectDelay / 1000);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let countdownTimer: NodeJS.Timeout;

        if (showTimer) {
            countdownTimer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        timer = setTimeout(() => {
            // Redirect to login page with current location as "from" state
            navigate('/login', {
                state: { from: location },
                replace: true
            });
        }, redirectDelay);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownTimer);
        };
    }, [navigate, location, redirectDelay, showTimer]);

    const handleLoginNow = () => {
        navigate('/login', {
            state: { from: location },
            replace: true
        });
    };

    const handleGoHome = () => {
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Icon */}
                <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </motion.div>

                {/* Title */}
                <motion.h2
                    className="text-2xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                    className="text-gray-600 mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {message}
                </motion.p>

                {/* Countdown Timer */}
                {showTimer && (
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Tự động chuyển đến trang đăng nhập sau {countdown}s</span>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        onClick={handleLoginNow}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Đăng nhập ngay
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300"
                    >
                        Trở về trang chủ
                    </button>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    className="mt-6 pt-4 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <p className="text-xs text-gray-400">
                        Chưa có tài khoản?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Đăng ký ngay
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPrompt;
