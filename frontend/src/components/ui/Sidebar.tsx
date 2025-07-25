import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  PencilSquareIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: string;
  children?: NavItem[];
}

// Navigation items - định nghĩa bên ngoài để tránh re-render
const NAV_ITEMS: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    roles: ['USER', 'ADMIN', 'COLLABORATOR'],
  },
  {
    path: '/lessons',
    label: 'Lessons',
    icon: BookOpenIcon,
    children: [
      { path: '/lessons', label: 'All Lessons', icon: BookOpenIcon },
      { path: '/lessons/my-progress', label: 'My Progress', icon: ChartBarIcon },
    ],
  },
  {
    path: '/exercises',
    label: 'Exercises',
    icon: PencilSquareIcon,
    children: [
      { path: '/exercises', label: 'All Exercises', icon: PencilSquareIcon },
      { path: '/exercises/practice', label: 'Practice Mode', icon: AcademicCapIcon },
    ],
  },
  {
    path: '/flashcards',
    label: 'Flashcards',
    icon: RectangleStackIcon,
    children: [
      { path: '/flashcards', label: 'Study Sets', icon: RectangleStackIcon },
      { path: '/flashcards/my-sets', label: 'My Sets', icon: UserIcon },
    ],
  },
  {
    path: '/tests',
    label: 'Tests',
    icon: ClipboardDocumentListIcon,
    badge: 'New',
    children: [
      { path: '/test-selection', label: 'Test Selection', icon: ClipboardDocumentListIcon },
      { path: '/test-history', label: 'Test History', icon: TrophyIcon },
      { path: '/tests/simple', label: 'Simple Test', icon: BeakerIcon },
    ],
  },
  {
    path: '/blogs',
    label: 'Blog',
    icon: DocumentTextIcon,
  },
  {
    path: '/feedback',
    label: 'Feedback',
    icon: ChatBubbleLeftRightIcon,
  },
];

// Admin specific items
const ADMIN_ITEMS: NavItem[] = [
  {
    path: '/admin',
    label: 'Admin Panel',
    icon: ShieldCheckIcon,
    roles: ['ADMIN'],
    children: [
      { path: '/admin/dashboard', label: 'Admin Dashboard', icon: ChartBarIcon },
      { path: '/admin/users', label: 'User Management', icon: UserIcon },
      { path: '/admin/feedback', label: 'Feedback Management', icon: ChatBubbleLeftRightIcon },
    ],
  },
];

// Collaborator specific items
const COLLABORATOR_ITEMS: NavItem[] = [
  {
    path: '/questions',
    label: 'Question Bank',
    icon: ClipboardDocumentListIcon,
    roles: ['COLLABORATOR', 'ADMIN'],
    children: [
      { path: '/questions/add', label: 'Add Questions', icon: PencilSquareIcon },
      { path: '/questions/my', label: 'My Questions', icon: UserIcon },
      { path: '/questions/groups', label: 'Question Groups', icon: RectangleStackIcon },
      { path: '/questions/test', label: 'API Testing', icon: BeakerIcon },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Check if user has permission
  const hasPermission = (roles?: string[]) => {
    if (!roles) return true;
    return roles.includes(currentUser?.role || '');
  };

  // Check if path is active
  const isActivePath = useCallback((path: string) => {
    if (path === '/dashboard') {
      if (currentUser?.role === 'ADMIN') {
        return location.pathname === '/admin/dashboard';
      } else if (currentUser?.role === 'COLLABORATOR') {
        return location.pathname === '/collaborator/dashboard';
      } else {
        return location.pathname === '/dashboard';
      }
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }, [location.pathname, currentUser?.role]);

  // Toggle expanded items
  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  // Auto-expand parent if child is active
  useEffect(() => {
    const allItems = [...NAV_ITEMS, ...ADMIN_ITEMS, ...COLLABORATOR_ITEMS];
    allItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => isActivePath(child.path));
        if (hasActiveChild && !expandedItems.includes(item.path)) {
          setExpandedItems(prev => [...prev, item.path]);
        }
      }
    });
  }, [location.pathname, isActivePath, expandedItems]);

  // Render navigation item
  const renderNavItem = (item: NavItem, level = 0) => {
    if (!hasPermission(item.roles)) return null;

    const isActive = isActivePath(item.path);
    const isExpanded = expandedItems.includes(item.path);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.path}>
        <div
          className={`
            group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200
            ${level > 0 ? 'ml-4 pl-8' : ''}
            ${isActive 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-500' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          onClick={() => hasChildren ? toggleExpanded(item.path) : null}
        >
          <Link
            to={item.path}
            className="flex items-center flex-1"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            <item.icon
              className={`
                flex-shrink-0 w-5 h-5 transition-colors duration-200
                ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
              `}
            />
            {!isCollapsed && (
              <>
                <span className="ml-3 flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
          
          {!isCollapsed && hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.path);
              }}
              className={`
                ml-2 p-1 rounded transition-transform duration-200
                ${isExpanded ? 'rotate-90' : ''}
              `}
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Children items */}
        {!isCollapsed && hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className={`
        bg-white shadow-lg h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        border-r border-gray-200
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LeEnglish
              </span>
              <div className="text-xs text-gray-500">TOEIC Platform</div>
            </div>
          </Link>
        )}
        
        <button
          onClick={onToggle}
          className={`
            p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200
            ${isCollapsed ? 'mx-auto' : ''}
          `}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {/* Main navigation */}
          {NAV_ITEMS.map((item: NavItem) => renderNavItem(item))}
          
          {/* Collaborator items */}
          {hasPermission(['COLLABORATOR', 'ADMIN']) && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className={`${isCollapsed ? 'hidden' : 'px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'}`}>
                Content Management
              </div>
              {COLLABORATOR_ITEMS.map((item: NavItem) => renderNavItem(item))}
            </>
          )}
          
          {/* Admin items */}
          {hasPermission(['ADMIN']) && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className={`${isCollapsed ? 'hidden' : 'px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'}`}>
                Administration
              </div>
              {ADMIN_ITEMS.map((item: NavItem) => renderNavItem(item))}
            </>
          )}
        </nav>
      </div>

      {/* User info at bottom */}
      {!isCollapsed && currentUser && (
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/profile"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentUser.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.role}
              </p>
            </div>
            <CogIcon className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
