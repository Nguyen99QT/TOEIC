/**
 * ================================================================
 * LAYOUT COMPONENT 
 * ================================================================
 * 
 * Main layout with sidebar navigation for authenticated users
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AppRoutes from '../routing/AppRoutes';

const Layout: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // For authenticated users, show sidebar layout
  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar
          currentUser={currentUser}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 lg:ml-0">
          {/* Top navbar for mobile */}
          <div className="lg:hidden">
            <Navbar
              currentUser={currentUser}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AppRoutes />
            </div>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    );
  }

  // For unauthenticated users, show regular layout
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;