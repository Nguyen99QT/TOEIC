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
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const { logout, isAuthenticated, currentUser } = useAuth();

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
    { name: 'Blog', href: '/blogs', icon: DocumentTextIcon },
    { name: 'Feedback', href: '/feedback', icon: CogIcon },
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
        {!isCollapsed && item.name}
      </Link>
    );
  };

  return (
    <div
      className={clsx(
        'fixed left-0 top-16 z-30 bg-white shadow-xl transform transition-all duration-300 ease-in-out border-r border-gray-200 flex flex-col',
        isCollapsed ? 'w-16' : 'w-72'
      )}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Toggle button */}
      {onToggle && (
        <div className="flex justify-end p-2 border-b border-gray-200">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className={clsx('h-5 w-5 text-gray-600', isCollapsed && 'rotate-180')} />
          </button>
        </div>
      )}

      {/* Sidebar content */}
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* User info */}
          {!isCollapsed && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <Link to="/user/profile" className="flex items-center hover:opacity-80 transition-opacity">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {currentUser.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Main navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavItem
                key={item.name}
                item={item}
              />
            ))}

            {/* Admin/Collaborator section */}
            {(currentUser.role === 'ADMIN' || currentUser.role === 'COLLABORATOR') && (
              <>
                <div className="pt-6">
                  {!isCollapsed && (
                    <div className="px-2 mb-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {currentUser.role === 'ADMIN' ? 'Administration' : 'Content Management'}
                      </h3>
                    </div>
                  )}
                  {(currentUser.role === 'ADMIN' ? adminNavigation : collaboratorNavigation).map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
