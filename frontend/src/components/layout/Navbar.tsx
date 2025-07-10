/**
 * ================================================================
 * NAVBAR COMPONENT
 * ================================================================
 * 
 * Main navigation bar with user profile, search, and menu
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { handleLogout } from '../../services/auth';
import { User } from '../../types';

interface NavbarProps {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, isOpen, onClose, onMenuClick }) => {
  const location = useLocation();

  // Nếu muốn sử dụng handleLogout trong component, cần tạo handler
  const handleUserLogout = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isQuestionPage = location.pathname.includes('/questions');

  if (isQuestionPage) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">

            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">LeEnglish</span>
              <span className="text-xs text-gray-500">TOEIC Platform</span>
            </Link>

            {/* Quick actions */}
            <div className="flex items-center space-x-3">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* User menu - Compact */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {currentUser?.username || currentUser?.email || 'User'}
                </span>
                <button
                  onClick={handleUserLogout} // Thay thế handleLogout bằng handleUserLogout
                  className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Regular navbar for other pages
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">LeEnglish</span>
            </div>
            <span className="text-sm text-gray-500">TOEIC Platform</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-600 bg-blue-50' : ''
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/lessons"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/lessons') ? 'text-blue-600 bg-blue-50' : ''
                }`}
            >
              Lessons
            </Link>
            <Link
              to="/flashcards"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/flashcards') ? 'text-blue-600 bg-blue-50' : ''
                }`}
            >
              Flashcards
            </Link>
            <Link
              to="/progress"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/progress') ? 'text-blue-600 bg-blue-50' : ''
                }`}
            >
              Progress
            </Link>
          </div>

          {/* Search and user menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lessons, exercises..."
                  className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Notifications */}
            <button
              className="relative text-gray-600 hover:text-gray-900 p-2"
              aria-label="View notifications"
              title="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5v-5a3 3 0 00-6 0v5l-5 5h5a3 3 0 006 0z" />
              </svg>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              {/* User avatar */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 hidden sm:block">
                  {currentUser?.username || currentUser?.email || 'User'}
                </span>
              </div>

              <button
                onClick={handleUserLogout} // Thay thế handleLogout bằng handleUserLogout
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                aria-label="Logout from account"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
