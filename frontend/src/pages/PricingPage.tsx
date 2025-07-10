/**
 * ================================================================
 * PRICING PAGE COMPONENT
 * ================================================================
 * 
 * Detailed pricing plans with upgrade functionality
 */

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
    const plans = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for getting started',
            features: [
                '2 free lessons',
                'Basic progress tracking',
                'Community support',
                'Limited flashcards'
            ],
            limitations: [
                'No premium content',
                'No offline access',
                'Limited support'
            ],
            popular: false
        },
        {
            name: 'Premium',
            price: '29',
            description: 'Unlock all content and features',
            features: [
                'All lessons & exercises',
                'Premium flashcard sets',
                'Advanced analytics',
                'Personalized study plans',
                'Expert instructor support',
                'Download for offline study',
                'Priority customer support',
                'Progress certificates',
                'Ad-free experience'
            ],
            limitations: [],
            popular: true
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Learning Path
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Start free and upgrade when you're ready for unlimited access to all TOEIC content
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${plan.popular
                                    ? 'ring-2 ring-blue-600 transform scale-105 relative'
                                    : 'border border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="bg-blue-600 text-white text-center py-3 text-sm font-semibold">
                                    ⭐ Most Popular Choice
                                </div>
                            )}

                            <div className="p-8">
                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {plan.description}
                                    </p>

                                    <div className="mb-6">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ${plan.price}
                                        </span>
                                        <span className="text-lg text-gray-600">/month</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-4 text-center">
                                        What's Included:
                                    </h4>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Limitations (if any) */}
                                {plan.limitations.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-center">
                                            Limitations:
                                        </h4>
                                        <ul className="space-y-3">
                                            {plan.limitations.map((limitation, index) => (
                                                <li key={index} className="flex items-center">
                                                    <XMarkIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                                    <span className="text-gray-700">{limitation}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* CTA Button */}
                                <Link
                                    to={plan.name === 'Free' ? '/register' : '/upgrade'}
                                    className={`w-full block text-center py-4 px-6 rounded-lg font-semibold text-lg transition-all ${plan.popular
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {plan.name === 'Free' ? 'Get Started Free' : 'Upgrade to Premium'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Can I upgrade anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade to Premium at any time. Your subscription will start immediately with full access to all premium content.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Is there a refund policy?
                            </h3>
                            <p className="text-gray-600">
                                We offer a 30-day money-back guarantee. If you're not satisfied with Premium, contact us for a full refund.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                How many devices can I use?
                            </h3>
                            <p className="text-gray-600">
                                Premium accounts can be used on unlimited devices. Your progress syncs automatically across all platforms.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                What happens if I cancel?
                            </h3>
                            <p className="text-gray-600">
                                You'll keep Premium access until your billing period ends, then automatically switch to the free plan with access to 2 lessons.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Achieve Your TOEIC Goals?
                        </h2>
                        <p className="text-xl text-blue-100 mb-6">
                            Join thousands of successful learners who improved their scores with Premium
                        </p>
                        <Link
                            to="/upgrade"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all inline-block"
                        >
                            Start Premium Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
