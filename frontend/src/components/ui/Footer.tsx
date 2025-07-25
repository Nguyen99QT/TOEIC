import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Compact Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Logo and Copyright */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="text-xl font-bold">LeEnglish</span>
                        </div>
                        <span className="text-gray-400 text-sm">© {currentYear} All rights reserved.</span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center space-x-6 text-sm">
                        <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                            Contact
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <span className="text-lg">📧</span>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <span className="text-lg">📱</span>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <span className="text-lg">🌐</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
