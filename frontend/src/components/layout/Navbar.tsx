/**
 * ================================================================
 * NAVBAR COMPONENT - Mobile Top Navigation
 * ================================================================
 * 
 * Mobile navigation bar with hamburger menu to open sidebar
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface NavbarProps {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onMenuClick }) => {
  const { logout } = useAuth();

  const handleUserLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">{/* Reduced from h-16 to h-14 and changed max-w-7xl mx-auto to w-full */}
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center space-x-4">
            {/* Hamburger menu button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">LeEnglish</span>
              <span className="text-xs text-gray-500 hidden sm:inline">TOEIC Platform</span>
            </Link>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Test Access */}
            <Link
              to="/test-selection"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1"
              title="Take a Test"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="hidden sm:inline">Tests</span>
            </Link>

            {/* User avatar */}
            <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.firstName?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-700 hidden sm:block">
                {currentUser?.firstName || currentUser?.username || 'User'}
              </span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleUserLogout}
              className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded transition-colors"
              aria-label="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
