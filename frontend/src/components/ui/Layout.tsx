import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from './Navigation';
import Footer from './Footer';
// import FloatingActionButton from './FloatingActionButton';

// Import the original sidebar components
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true, 
  showNavigation = true,
  showFooter = true 
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if device is mobile and auto-close sidebar
  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // For unauthenticated users or when sidebar is disabled, use regular navigation
  if (!isAuthenticated || !showSidebar || !currentUser) {
    return (
      <div className="bg-gray-50 flex flex-col min-h-screen">
        {showNavigation && <Navigation />}
        <main className="flex-1">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
          {showFooter && <Footer />}
        </main>
        {/* {isAuthenticated && <FloatingActionButton />} */}
      </div>
    );
  }

  // For authenticated users with sidebar
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar spanning full width */}
      <div className="flex-shrink-0 relative z-50">
        {/* Mobile navbar */}
        <div className="lg:hidden">
          <Navbar
            currentUser={currentUser}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        
        {/* Desktop navbar */}
        <div className="hidden lg:block">
          <Navigation />
        </div>
      </div>
      
      {/* Content area with sidebar and main content - takes remaining space */}
      <div className="flex flex-1">
        {/* Sidebar - only render when authenticated and user exists */}
        {isAuthenticated && currentUser && (
          <Sidebar
            currentUser={currentUser}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content - scrollable */}
        <div className="flex-1 bg-gray-50">
          <main className="h-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
            
            {/* Footer at bottom of content */}
            {showFooter && (
              <Footer />
            )}
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      {/* <FloatingActionButton /> */}
    </div>
  );
};

export default Layout;
