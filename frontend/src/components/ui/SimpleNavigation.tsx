import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SimpleNavigation: React.FC = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const location = useLocation();

    console.log('🔍 SimpleNavigation: Auth state:', { isAuthenticated, currentUser: currentUser?.username });

    if (!isAuthenticated) {
        console.log('❌ SimpleNavigation: Not authenticated, not showing navigation');
        return null;
    }

    const getDashboardPath = () => {
        if (currentUser?.role === 'ADMIN') {
            return '/admin/dashboard';
        } else if (currentUser?.role === 'COLLABORATOR') {
            return '/collaborator/dashboard';
        } else {
            return '/dashboard';
        }
    };

    const navLinks = [
        { path: getDashboardPath(), label: 'Dashboard', icon: '📊' },
        { path: '/lessons', label: 'Lessons', icon: '📚' },
        { path: '/test-selection', label: 'Tests', icon: '📝' },
        { path: '/questions', label: 'Questions', icon: '❓' },
        { path: '/user/profile', label: 'Profile', icon: '👤' },
    ];

    const isActivePath = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">L</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">LeEnglish</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                                    ${isActivePath(link.path)
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        
                        {/* User Info */}
                        <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {currentUser?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-gray-700">{currentUser?.username}</span>
                            <Link 
                                to="/logout" 
                                className="text-red-600 hover:text-red-700 px-2 py-1 rounded"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SimpleNavigation;
