import React from 'react';
import { motion } from 'framer-motion';
import PayPalButton from '../components/blog/PayPalButton';

const MembershipPage: React.FC = () => {
    const handlePaymentSuccess = (order: any) => {
        console.log('Payment successful:', order);
        // Có thể thêm logic xử lý sau khi thanh toán thành công
        alert('Thanh toán thành công! Chào mừng bạn đến với Premium!');
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Upgrade to <span className="text-purple-600">Premium</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock all features and accelerate your TOEIC preparation journey
                    </p>
                </motion.div>

                <motion.div
                    className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {/* Free Plan */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Plan</h3>
                        <div className="text-3xl font-bold text-gray-600 mb-6">$0<span className="text-lg font-normal">/month</span></div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-600">
                                <span className="text-green-500 mr-3">✓</span>
                                5 practice tests per month
                            </li>
                            <li className="flex items-center text-gray-600">
                                <span className="text-green-500 mr-3">✓</span>
                                Basic flashcards
                            </li>
                            <li className="flex items-center text-gray-600">
                                <span className="text-red-500 mr-3">✗</span>
                                Limited progress tracking
                            </li>
                            <li className="flex items-center text-gray-600">
                                <span className="text-red-500 mr-3">✗</span>
                                No detailed analytics
                            </li>
                        </ul>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-yellow-400 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                            POPULAR
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
                        <div className="text-3xl font-bold mb-6">$10<span className="text-lg font-normal">/month</span></div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Unlimited practice tests
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Advanced flashcards with audio
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Detailed progress analytics
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Personalized study plans
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Priority customer support
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-400 mr-3">✓</span>
                                Exclusive study materials
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Payment Section */}
                <motion.div
                    className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Start Your Premium Journey
                    </h2>
                    <PayPalButton
                        amount={10}
                        onSuccess={handlePaymentSuccess}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default MembershipPage;
