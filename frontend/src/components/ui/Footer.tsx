import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'LEARN',
            links: [
                { name: 'Lessons', href: '/lessons' },
                { name: 'Practice Tests', href: '/exercises' },
                { name: 'Flashcards', href: '/flashcards' },
                { name: 'Grammar Guide', href: '/grammar' },
            ]
        },
        {
            title: 'SUPPORT',
            links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Community', href: '/community' },
            ]
        },
        {
            title: 'COMPANY',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Blog', href: '/blog' },
                { name: 'Press', href: '/press' },
            ]
        },
        {
            title: 'LEGAL',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'GDPR', href: '/gdpr' },
            ]
        }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: '📘', href: '#' },
        { name: 'Twitter', icon: '🐦', href: '#' },
        { name: 'Instagram', icon: '📷', href: '#' },
        { name: 'LinkedIn', icon: '💼', href: '#' },
        { name: 'YouTube', icon: '📺', href: '#' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Logo and Description */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">L</span>
                            </div>
                            <span className="text-2xl font-bold">LeEnglish</span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Comprehensive TOEIC learning platform designed to help you achieve
                            your target score with interactive lessons, practice exercises, and
                            personalized learning paths.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-lg">Stay Updated</h4>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="font-semibold text-lg text-blue-400">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 hover-lift inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-blue-400">10K+</div>
                            <div className="text-gray-400">Active Students</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-green-400">500+</div>
                            <div className="text-gray-400">Practice Questions</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-purple-400">95%</div>
                            <div className="text-gray-400">Success Rate</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-yellow-400">4.9</div>
                            <div className="text-gray-400">Average Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-gray-400 text-sm">
                            © {currentYear} LeEnglish TOEIC Platform. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110"
                                    title={social.name}
                                >
                                    <span className="text-xl">{social.icon}</span>
                                </a>
                            ))}
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">🌐</span>
                            <label htmlFor="footer-language-select" className="sr-only">
                                Select language
                            </label>
                            <select
                                id="footer-language-select"
                                aria-label="Select language"
                                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="en">English</option>
                                <option value="vi">Tiếng Việt</option>
                                <option value="ja">日本語</option>
                                <option value="ko">한국어</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
