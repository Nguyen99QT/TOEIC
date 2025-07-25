import React, { useState } from "react";
import { motion } from 'framer-motion';
import PayPalButton from "./PayPalButton";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

interface Plan {
    id: string;
    name: string;
    price: number;
    duration: string;
    description: string;
    featured: boolean;
    features: string[];
}

const plans: Plan[] = [
    {
        id: "trial",
        name: "Dùng thử 7 ngày",
        price: 10,
        duration: "7 ngày",
        description: "Trải nghiệm tất cả tính năng trong 7 ngày.",
        featured: false,
        features: [
            "Unlimited practice tests",
            "Basic flashcards",
            "Progress tracking",
            "7 days access"
        ]
    },
    {
        id: "6months",
        name: "Gói 6 tháng",
        price: 280,
        duration: "6 tháng",
        description: "Tiết kiệm hơn khi đăng ký dài hạn.",
        featured: true,
        features: [
            "Unlimited practice tests",
            "Advanced flashcards with audio",
            "Detailed progress analytics",
            "Personalized study plans",
            "Priority support",
            "6 months access"
        ]
    },
    {
        id: "1year",
        name: "Gói 1 năm",
        price: 500,
        duration: "12 tháng",
        description: "Tiết kiệm tối đa và học không giới hạn.",
        featured: false,
        features: [
            "All 6-month features",
            "Exclusive study materials",
            "One-on-one sessions",
            "Certificate of completion",
            "12 months access"
        ]
    },
];

const MembershipPlans: React.FC = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paidOrder, setPaidOrder] = useState<any>(null);
    const [upgrading, setUpgrading] = useState(false);

    const handleSelect = (planId: string) => {
        const plan = plans.find((p) => p.id === planId);
        setSelectedPlan(plan || null);
        setPaidOrder(null);
    };

    const handleSuccess = async (order: any) => {
        setPaidOrder(order);

        if (!selectedPlan || !currentUser) {
            alert("❌ Lỗi: Thông tin không hợp lệ!");
            return;
        }

        setUpgrading(true);

        try {
            // Get token from localStorage
            const token = localStorage.getItem('toeic_access_token') ||
                localStorage.getItem('authToken');

            if (!token) {
                alert("❌ Bạn cần đăng nhập để nâng cấp membership!");
                return;
            }

            console.log("🚀 Upgrading membership...");

            const response = await axios.post(`${BACKEND_URL}/api/membership/upgrade`, null, {
                params: {
                    planId: selectedPlan.id,
                    paypalOrderId: order.id
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Update user context to PREMIUM
                const updatedUser = {
                    ...currentUser,
                    membershipType: 'PREMIUM' as const
                };

                updateCurrentUser(updatedUser);

                // Also update localStorage
                localStorage.setItem('toeic_current_user', JSON.stringify(updatedUser));

                alert("✅ Nâng cấp membership thành công! Chào mừng bạn đến với Premium!");
                console.log("✅ Membership upgraded successfully!");
            } else {
                throw new Error("Upgrade failed");
            }
        } catch (error: any) {
            console.error("❌ Membership upgrade error:", error);
            alert("❌ Lỗi nâng cấp membership: " + (error.response?.data || error.message));
        } finally {
            setUpgrading(false);
        }
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
                        Chọn Gói <span className="text-purple-600">Hội Viên</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Nâng cao trình độ TOEIC của bạn với các gói membership phù hợp
                    </p>
                </motion.div>

                <motion.div
                    className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            className={`bg-white rounded-xl shadow-lg p-8 relative overflow-hidden ${plan.featured
                                ? 'border-4 border-purple-500 transform scale-105'
                                : 'border-2 border-gray-200'
                                }`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index, duration: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            {plan.featured && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    ⭐ POPULAR
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-4">{plan.duration}</p>
                                <div className="text-4xl font-bold text-purple-600 mb-2">
                                    ${plan.price}
                                </div>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-gray-600">
                                        <span className="text-green-500 mr-3 text-lg">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.featured
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                onClick={() => handleSelect(plan.id)}
                            >
                                {parseFloat(paidOrder?.purchase_units?.[0]?.amount?.value) === plan.price
                                    ? "✅ Đã thanh toán"
                                    : "Chọn gói này"}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Payment Section */}
                {selectedPlan && (
                    <motion.div
                        className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Thanh toán: {selectedPlan.name}
                        </h2>
                        <p className="text-center text-gray-600 mb-6">
                            Giá: <span className="text-2xl font-bold text-purple-600">${selectedPlan.price}</span>
                        </p>
                        {upgrading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                <p className="mt-4 text-purple-600 font-semibold">
                                    Đang nâng cấp membership...
                                </p>
                                <p className="text-sm text-gray-500">
                                    Vui lòng không tắt trang này
                                </p>
                            </div>
                        ) : (
                            <PayPalButton
                                {...({
                                    amount: selectedPlan.price,
                                    onSuccess: handleSuccess
                                } as any)}
                            />
                        )}
                    </motion.div>
                )}

                {/* Success Message */}
                {paidOrder && (
                    <motion.div
                        className="max-w-md mx-auto mt-8 bg-green-50 border border-green-200 rounded-xl p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-center">
                            {upgrading ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                                    <h3 className="text-xl font-bold text-green-800 mb-2">
                                        Đang xử lý nâng cấp...
                                    </h3>
                                    <p className="text-green-600">
                                        Mã đơn hàng: <span className="font-mono font-bold">{paidOrder.id}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Đang cập nhật tài khoản của bạn...
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="text-4xl mb-4">🎉</div>
                                    <h3 className="text-xl font-bold text-green-800 mb-2">
                                        Giao dịch thành công!
                                    </h3>
                                    <p className="text-green-600">
                                        Mã đơn hàng: <span className="font-mono font-bold">{paidOrder.id}</span>
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default MembershipPlans;
