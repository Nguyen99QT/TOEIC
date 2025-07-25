/**
 * ================================================================
 * MAIN APP COMPONENT - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Root component with routing, authentication, and global state
 * Provides comprehensive TOEIC learning platform features
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/SimpleToast';
import Layout from './components/layout/Layout';
import TokenRefreshIndicator from './components/auth/TokenRefreshIndicator';

// Global CSS to prevent overflow
import './index.css';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Layout />
          <TokenRefreshIndicator />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
