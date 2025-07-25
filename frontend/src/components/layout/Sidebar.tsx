/**
 * ================================================================
 * SIDEBAR COMPONENT
 * ================================================================
 * 
 * Navigation sidebar with menu items based on user role
 */

import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onMenuClick?: () => void; // Make it optional
}

const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  isOpen,
  onClose,
  onMenuClick
}) => {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  // Don't render sidebar if user is not authenticated or currentUser is null
  if (!currentUser || !isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Lessons', href: '/lessons', icon: BookOpenIcon },
    { name: 'Exercises', href: '/exercises', icon: AcademicCapIcon },
    { name: 'Test Selection', href: '/test-selection', icon: DocumentTextIcon },
    { name: 'Test History', href: '/test-history', icon: ChartBarIcon },
    { name: 'Flashcards', href: '/flashcards', icon: CreditCardIcon },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Content Management', href: '/admin/content', icon: ChartBarIcon },
    { name: 'Blog Management', href: '/admin/blog', icon: DocumentTextIcon },
    { name: 'Add Questions', href: '/questions/add', icon: AcademicCapIcon },
    { name: 'Add Question Groups', href: '/questions/add-group', icon: AcademicCapIcon },
  ];

  const collaboratorNavigation = [
    { name: 'Add Questions', href: '/questions/add', icon: AcademicCapIcon },
    { name: 'Add Question Groups', href: '/questions/add-group', icon: AcademicCapIcon },
    { name: 'My Questions & Groups', href: '/questions', icon: ChartBarIcon },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: CogIcon },
    { name: 'Logout', href: '#', icon: ArrowRightOnRectangleIcon, action: 'logout' },
  ];

  const NavItem: React.FC<{
    item: { name: string; href: string; icon: React.ElementType; action?: string };
    onClick?: () => void;
  }> = ({ item, onClick }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    const handleClick = (e: React.MouseEvent) => {
      if (item.action === 'logout') {
        e.preventDefault();
        logout();
        if (onClick) onClick();
        return;
      }
      if (onClick) onClick();
    };

    return (
      <Link
        to={item.href}
        onClick={handleClick}
        className={clsx(
          'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          item.action === 'logout' && 'hover:bg-red-50 hover:text-red-700'
        )}
      >
        <Icon
          className={clsx(
            'mr-3 flex-shrink-0 h-6 w-6 transition-colors',
            isActive
              ? 'text-blue-500'
              : 'text-gray-400 group-hover:text-gray-500',
            item.action === 'logout' && 'group-hover:text-red-500'
          )}
        />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 lg:flex-shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar header - only show on mobile */}
        <div className="flex items-center justify-between h-14 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 lg:hidden">
          <div className="flex items-center">
            <div className="text-lg font-semibold text-gray-700">
              Navigation
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex flex-col h-full lg:pt-0">
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* User info */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <Link to="/profile" className="flex items-center hover:opacity-80 transition-opacity">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {currentUser.firstName?.[0] || ''}{currentUser.lastName?.[0] || ''}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                </div>
              </Link>
            </div>

            {/* Main navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                />
              ))}

              {/* Admin/Collaborator section */}
              {(currentUser.role === 'ADMIN' || currentUser.role === 'COLLABORATOR') && (
                <>
                  <div className="pt-6">
                    <div className="px-2 mb-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {currentUser.role === 'ADMIN' ? 'Administration' : 'Content Management'}
                      </h3>
                    </div>
                    {(currentUser.role === 'ADMIN' ? adminNavigation : collaboratorNavigation).map((item) => (
                      <NavItem
                        key={item.name}
                        item={item}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                      />
                    ))}
                  </div>
                </>
              )}
            </nav>

            {/* Bottom navigation */}
            <div className="border-t border-gray-200 p-2">
              {bottomNavigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
