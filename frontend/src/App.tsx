/**
 * ================================================================
 * MAIN APP COMPONENT - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Root component with routing, authentication, and global state
 * Provides comprehensive TOEIC learning platform features
 */

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Toast Provider
import { ToastProvider } from './components/ui/SimpleToast';

// Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout Components
// import TokenRefreshIndicator from './components/auth/TokenRefreshIndicator';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Page Components
import AdminRoute from './components/auth/AdminRoute';
import AdminPanel from './pages/admin/AdminPanel';
import { ContentPage as AdminContentPage } from './pages/admin/content-page';
import { UsersPage as AdminUsersPage } from './pages/admin/users-page';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ExerciseDetailPage from './pages/exercises/ExerciseDetailPage';
import ExerciseQuestionsPage from './pages/exercises/ExerciseQuestionsPage';
import ExercisesPage from './pages/exercises/ExercisesPage';
import QuestionPage from './pages/exercises/QuestionPage';
import FlashcardsPage from './pages/flashcards/FlashcardsPage';
import HomePage from './pages/HomePage';
import LessonDetailPage from './pages/lessons/LessonDetailPage';
import LessonsPage from './pages/lessons/LessonsPage';
import NotFoundPage from './pages/NotFoundPage';
import PricingPage from './pages/PricingPage';
import UpgradePremiumPage from './pages/UpgradePremiumPage';
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';

// Loading Component
import AddQuestionGroupForm from './components/Nguyen/AddQuestionGroupForm';
import BotpressChat from './components/Nguyen/BotpressChat';
import ChatbotManager from './components/Nguyen/ChatbotManager';
import GenerateTestForm from './components/Nguyen/GenerateTestForm';
import TOEICDemo from './components/Nguyen/TOEICDemo';
import TOEICQuestionGroupForm from './components/Nguyen/TOEICQuestionGroupForm';
import HelpButton from './components/ui/HelpButton';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './contexts/ProtectRoute';
import FlashcardStudyPage from './pages/flashcards/FlashcardStudyPage';
import EditIndividualQuestionPage from './pages/questions/EditIndividualQuestionPage';
import EditQuestionGroupPage from './pages/questions/EditQuestionGroupPage';
import ModernAddQuestionPage from './pages/questions/ModernAddQuestionPage';
import MyQuestionsPage from './pages/questions/MyQuestionsPage';
import SimpleMyQuestionsPage from './pages/questions/SimpleMyQuestionsPage';
import ViewQuestionGroupPage from './pages/questions/ViewQuestionGroupPage';

// Nguyen's Test Pages
import AudioTest from './components/Nguyen/AudioTest';
import SimpleTOEICTest from './components/Nguyen/SimpleTOEICTest';
import Test from './components/Nguyen/Test';
import TestSelectionPage from './components/TestSelectionPage';
import { TestListPage } from './pages/Nguyen';
import TestHistoryPage from './pages/test-results/TestHistoryPage';
import TestResultDetailPage from './pages/test-results/TestResultDetailPage';

// ========== MAIN APP COMPONENT ==========

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, isAuthenticated, loading } = useAuth();

  // ========== LOADING STATE ========== 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading LeEnglish TOEIC Platform...</p>
        </div>
      </div>
    );
  }

  // ========== LAYOUT COMPONENT ========== 
  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex">
          <Sidebar
            currentUser={currentUser}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className={`flex-1 transition-all duration-300 ${currentUser ? 'lg:ml-64' : ''}`}>
            <div className="p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                © 2025 LeEnglish TOEIC Platform. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        {/* Token refresh indicator for authenticated users */}
        {/* <TokenRefreshIndicator /> */}

        {/* Botpress Chat Widget */}
        <BotpressChat />

        {/* Chatbot Manager for user interactions */}
        <ChatbotManager />

        {/* Help Button - only show if user doesn't see chatbot widget */}
        <HelpButton />
      </div>
    );
  };

  // ========== MAIN RENDER ========== 
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="App">
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Layout><LoginPage /></Layout>} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Layout><RegisterPage /></Layout>} />
          <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
          <Route path="/upgrade-premium" element={<Layout><UpgradePremiumPage /></Layout>} />

          {/* ========== PUBLIC TEST ROUTE FOR DEBUGGING ========== */}
          <Route path="/test-selection" element={<Layout><TestSelectionPage /></Layout>} />
          <Route path="/test/:testId" element={<Layout><SimpleTOEICTest /></Layout>} />
          <Route path="/test-full/:testId" element={<Layout><Test /></Layout>} />
          <Route path="/toeic-test/:testId" element={<Layout><SimpleTOEICTest /></Layout>} />
          <Route path="/simple-toeic-test/:testId" element={<Layout><SimpleTOEICTest /></Layout>} />
          <Route path="/audio-test" element={<Layout><AudioTest /></Layout>} />

          {/* ========== PROTECTED ROUTES ========== */}
          <Route path="/dashboard" element={<ProtectedRoute>
            <Layout><TestListPage /></Layout>
          </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
          <Route path="/lessons" element={<ProtectedRoute><Layout><LessonsPage /></Layout></ProtectedRoute>} />
          <Route path="/lessons/:id" element={<ProtectedRoute><Layout><LessonDetailPage /></Layout></ProtectedRoute>} />
          <Route path="/lessons/:lessonId/exercises" element={<ProtectedRoute><Layout><ExercisesPage /></Layout></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><Layout><ExercisesPage /></Layout></ProtectedRoute>} />
          <Route path="/exercises/:id" element={<ProtectedRoute><Layout><ExerciseDetailPage /></Layout></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><Layout><FlashcardsPage /></Layout></ProtectedRoute>} />
          <Route path="/flashcards/study/:setId" element={<ProtectedRoute><Layout><FlashcardStudyPage /></Layout></ProtectedRoute>} />
          <Route path="/lessons/:lessonId/exercises/:exerciseId/questions" element={<ProtectedRoute><Layout><QuestionPage /></Layout></ProtectedRoute>} />
          <Route path="/lessons/:lessonId/exercises/:exerciseId" element={<ProtectedRoute><Layout><ExerciseQuestionsPage /></Layout></ProtectedRoute>} />

          {/* ========== TEST ROUTES BY NGUYEN ========== */}
          <Route path="/tests" element={<ProtectedRoute><Layout><TestListPage /></Layout></ProtectedRoute>} />
          <Route path="/tests/:testId" element={<ProtectedRoute><Layout><Test /></Layout></ProtectedRoute>} />
          <Route path="/tests/demo" element={<ProtectedRoute><Layout><Test /></Layout></ProtectedRoute>} />

          {/* ========== TEST RESULTS AND HISTORY ========== */}
          <Route path="/test-history" element={<ProtectedRoute><Layout><TestHistoryPage /></Layout></ProtectedRoute>} />
          <Route path="/test-results/:resultId" element={<ProtectedRoute><Layout><TestResultDetailPage /></Layout></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Layout><TestHistoryPage /></Layout></ProtectedRoute>} />

          {/* ========== ADMIN ROUTES ========== */}
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><Layout><AdminUsersPage /></Layout></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><Layout><AdminContentPage /></Layout></ProtectedRoute>} />

          {/* ========== QUESTION MANAGEMENT ROUTES ========== */}
          <Route path="/add/add-questions" element={<ProtectedRoute><Layout><ModernAddQuestionPage /></Layout></ProtectedRoute>} />
          <Route path="/add/add-group-questions" element={<ProtectedRoute><Layout><AddQuestionGroupForm /></Layout></ProtectedRoute>} />
          <Route path="/add/toeic-group" element={<ProtectedRoute><Layout><TOEICQuestionGroupForm /></Layout></ProtectedRoute>} />
          <Route path="/tests/generate" element={<ProtectedRoute><Layout><GenerateTestForm /></Layout></ProtectedRoute>} />
          <Route path="/demo/toeic" element={<Layout><TOEICDemo /></Layout>} />
          <Route path="/questions/my" element={<ProtectedRoute><Layout><MyQuestionsPage /></Layout></ProtectedRoute>} />
          <Route path="/questions/simple" element={<ProtectedRoute><Layout><SimpleMyQuestionsPage /></Layout></ProtectedRoute>} />
          <Route path="/questions/view/:groupId" element={<ProtectedRoute><Layout><ViewQuestionGroupPage /></Layout></ProtectedRoute>} />
          <Route path="/questions/edit/:groupId" element={<ProtectedRoute><Layout><EditQuestionGroupPage /></Layout></ProtectedRoute>} />
          <Route path="/questions/edit-individual/:id" element={<EditIndividualQuestionPage />} />

          {/* 404 Route */}
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
