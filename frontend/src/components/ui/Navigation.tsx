import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedButton from './EnhancedButton';

const Navigation: React.FC = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActivePath = (path: string) => {
        // Special handling for dashboard routes
        if (path === '/dashboard' || path === '/admin/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/admin/dashboard';
        }
        return location.pathname === path;
    };

    // Dynamic navigation based on user role
    const getDashboardPath = () => {
        return currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
    };

    const navLinks = [
        { path: getDashboardPath(), label: 'Dashboard', icon: '📊' },
        { path: '/lessons', label: 'Lessons', icon: '📚' },
        { path: '/exercises', label: 'Exercises', icon: '✏️' },
        { path: '/flashcards', label: 'Flashcards', icon: '🎴' },
        { path: '/blogs', label: 'Blog', icon: '📈' },
        { path: '/feedback', label: 'Feedback', icon: '💬' },
    ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 hover-grow"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <span className="text-xl font-bold gradient-text">LeEnglish</span>
                        <span className="text-sm text-gray-500 hidden md:inline">TOEIC Platform</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover-lift
                    ${isActivePath(link.path)
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                        }
                  `}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search lessons, exercises..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && currentUser ? (
                            <>
                                {/* Notifications */}
                                <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM21 9l-4-4H7l-4 4v5l4 4h10l4-4V9z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                        3
                                    </span>
                                </button>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {currentUser.username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="font-medium text-gray-700">
                                                {currentUser.username}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {currentUser.membershipType === 'PREMIUM' ? (
                                                    <span className="text-yellow-600 font-medium">👑 Premium</span>
                                                ) : (
                                                    <span className="text-gray-500">Free Member</span>
                                                )}
                                            </div>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slideInRight">
                                            <Link
                                                to="/user/profile"
                                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span>👤</span>
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                to="/user/change-password"
                                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span>🔒</span>
                                                <span>Change Password</span>
                                            </Link>
                                            <Link
                                                to="/feedback"
                                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span>💬</span>
                                                <span>Feedback</span>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span>⚙️</span>
                                                <span>Settings</span>
                                            </Link>
                                            {currentUser.role === 'ADMIN' && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <span>👑</span>
                                                    <span>Admin Panel</span>
                                                </Link>
                                            )}
                                            <hr className="my-2" />
                                            <Link
                                                to="/logout"
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span>🚪</span>
                                                <span>Logout</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <EnhancedButton variant="ghost" size="sm">
                                        Login
                                    </EnhancedButton>
                                </Link>
                                <Link to="/register">
                                    <EnhancedButton variant="primary" size="sm">
                                        Sign Up
                                    </EnhancedButton>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            title="Open navigation menu"
                            aria-label="Open navigation menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 animate-slideInLeft">
                        {isAuthenticated && navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                  flex items-center space-x-3 px-4 py-3 transition-colors duration-200
                  ${isActivePath(link.path)
                                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }
                `}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
