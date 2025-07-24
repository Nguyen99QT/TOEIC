import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CollaboratorLayoutProps {
  children: React.ReactNode;
}

const CollaboratorLayout: React.FC<CollaboratorLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/collaborator/dashboard',
      icon: '🏠',
      current: location.pathname === '/collaborator/dashboard'
    },
    {
      name: 'Content Management',
      href: '/collaborator/content',
      icon: '📝',
      current: location.pathname === '/collaborator/content'
    },
    {
      name: 'Flashcard Sets',
      href: '/collaborator/flashcards',
      icon: '📚',
      current: location.pathname.startsWith('/collaborator/flashcards')
    },
    {
      name: 'Lessons',
      href: '/collaborator/lessons',
      icon: '📖',
      current: location.pathname.startsWith('/collaborator/lessons')
    },
    {
      name: 'Analytics',
      href: '/collaborator/analytics',
      icon: '📊',
      current: location.pathname === '/collaborator/analytics'
    },
    {
      name: 'User Feedback',
      href: '/collaborator/feedback',
      icon: '💬',
      current: location.pathname === '/collaborator/feedback'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <Link to="/collaborator/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-white">LeEnglish Pro</span>
          </Link>
        </div>

        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                item.current
                  ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser && typeof currentUser === 'object' ? currentUser.username?.[0]?.toUpperCase() : 'C'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {currentUser && typeof currentUser === 'object' ? currentUser.username : 'Collaborator'}
              </p>
              <p className="text-xs text-gray-500">Collaborator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full text-left text-sm text-red-600 hover:text-red-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar for mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-900"
            >
              <span className="sr-only">Open sidebar</span>
              ☰
            </button>
            <h1 className="text-lg font-semibold">LeEnglish Pro</h1>
            <div></div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CollaboratorLayout;