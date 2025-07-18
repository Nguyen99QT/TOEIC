/**
 * ================================================================
 * MAIN APP COMPONENT - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Root component with routing, authentication, and global state
 * Provides comprehensive TOEIC learning platform features
 */

import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

// Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Components
import LoadingFallback from './components/ui/LoadingFallback';
import Navigation from './components/ui/Navigation';
import Footer from './components/ui/Footer';
import FloatingActionButton from './components/ui/FloatingActionButton';
import TokenRefreshIndicator from './components/auth/TokenRefreshIndicator';
import AuthDebug from './components/debug/AuthDebug';

// Pages
import HomePage from './pages/HomePage';
import SimpleHomePage from './pages/SimpleHomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LogoutPage from './pages/auth/LogoutPage';
import DashboardPage from './pages/DashboardPage';
import ExerciseDetailPage from './pages/exercises/ExerciseDetailPage';
import ExerciseQuestionsPage from './pages/exercises/ExerciseQuestionsPage';
import ExercisesPageClean from './pages/exercises/ExercisesPageClean';
// import QuestionPage from './pages/exercises/QuestionPage';
import FlashcardsPage from './pages/flashcards/FlashcardsPage';
import FlashcardStudyPage from './pages/flashcards/FlashcardStudyPage';
import LessonDetailPage from './pages/lessons/LessonDetailPage';
import LessonsPage from './pages/lessons/LessonsPage';
import PricingPage from './pages/PricingPage';
import UpgradePremiumPage from './pages/UpgradePremiumPage';
import ProfilePage from './pages/user/ProfilePage';
// import SettingsPage from './pages/user/SettingsPage';

// Admin Pages
import AdminUsersPage from './pages/admin/AdminUsersPage'; // Added import
import AdminContentPage from './pages/admin/AdminContentPage'; // Added import

// Enhanced UI Components
import { ToastProvider } from './components/ui/SimpleToast';

// Development utilities
import './utils/devUtils';

// ========== MAIN APP COMPONENT ==========

/**
 * The main application content component responsible for rendering the overall routing structure,
 * layout, and authentication logic of the TOEIC frontend app.
 *
 * @remarks
 * - Wraps the app in a React Router context and provides route-based rendering for public, protected,
 *   and admin pages.
 * - Handles authentication state and conditional rendering of navigation, footer, and floating actions.
 * - Includes debug logging for authentication and routing state.
 * - Uses `Suspense` for lazy-loaded routes and displays a loading fallback during async operations.
 * - Provides a consistent layout for all pages and handles 404 and unknown routes with redirection.
 *
 * @component
 * @returns {JSX.Element} The rendered application content with routing and layout.
 */
const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // Add debug logging
  console.log('🔍 App State:', { loading, isAuthenticated, currentUser });

  // Enhanced Layout component with Navigation and Footer
  const Layout: React.FC<{ children: React.ReactNode; showNavigation?: boolean; showFooter?: boolean }> = ({
    children,
    showNavigation = true,
    showFooter = true
  }) => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {showNavigation && <Navigation />}
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
        {isAuthenticated && <FloatingActionButton />}
      </div>
    );
  };

  // LocationLogger để debug routing
  const LocationLogger = () => {
    const location = useLocation();

    useEffect(() => {
      console.log('🗺️ Route changed to:', location.pathname);
      console.log('🔍 Search params:', location.search);
      console.log('🔍 Hash:', location.hash);
    }, [location]);

    return null;
  };

  return (
    <Router>
      <LocationLogger />
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              (() => {
                console.log('🏠 HomePage Route: isAuthenticated =', isAuthenticated, 'user =', currentUser?.username || 'guest');
                return (
                  <Layout showNavigation={true} showFooter={true}>
                    {isAuthenticated ? <HomePage /> : <SimpleHomePage />}
                  </Layout>
                );
              })()
            } />

            {/* ✅ FIXED: Login Route - redirect if already authenticated */}
            <Route
              path="/login"
              element={
                loading ? (
                  <LoadingFallback />
                ) : isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <ProtectedRoute requireAuth={false}>
                    <Layout showNavigation={false} showFooter={false}>
                      <LoginPage />
                    </Layout>
                  </ProtectedRoute>
                )
              }
            />

            {/* ✅ FIXED: Register Route - redirect if already authenticated */}
            <Route
              path="/register"
              element={
                loading ? (
                  <LoadingFallback />
                ) : isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <ProtectedRoute requireAuth={false}>
                    <Layout showNavigation={false} showFooter={false}>
                      <RegisterPage />
                    </Layout>
                  </ProtectedRoute>
                )
              }
            />

            <Route
              path="/logout"
              element={
                <Layout showNavigation={false} showFooter={false}>
                  <LogoutPage />
                </Layout>
              }
            />
            <Route path="/pricing" element={
              <Layout>
                <PricingPage />
              </Layout>
            } />
            <Route path="/upgrade-premium" element={
              <Layout>
                <UpgradePremiumPage />
              </Layout>
            } />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem dashboard"
                  promptMessage="Bạn cần phải đăng nhập để xem dashboard cá nhân và theo dõi tiến trình học tập"
                >
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Lessons Routes */}
            <Route
              path="/lessons"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem bài học"
                  promptMessage="Bạn cần phải đăng nhập để xem danh sách bài học và bắt đầu học tập"
                >
                  <Layout>
                    <LessonsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:lessonId"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem bài học chi tiết"
                  promptMessage="Bạn cần phải đăng nhập để xem nội dung bài học chi tiết và thực hành"
                >
                  <Layout>
                    <LessonDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Exercises Routes */}
            <Route
              path="/lessons/:lessonId/exercises"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài tập"
                  promptMessage="Bạn cần phải đăng nhập để xem và làm các bài tập trong bài học"
                >
                  <Layout>
                    <ExercisesPageClean />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:lessonId/exercises/:exerciseId"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài tập"
                  promptMessage="Bạn cần phải đăng nhập để xem chi tiết bài tập và bắt đầu làm bài"
                >
                  <Layout>
                    <ExerciseDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:lessonId/exercises/:exerciseId/questions"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài tập"
                  promptMessage="Bạn cần phải đăng nhập để xem và trả lời các câu hỏi trong bài tập"
                >
                  <Layout>
                    <ExerciseDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:lessonId/exercises/:exerciseId/questions/:questionId"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài tập"
                  promptMessage="Bạn cần phải đăng nhập để xem và trả lời câu hỏi này"
                >
                  <Layout>
                    <ExerciseQuestionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Flashcards Routes */}
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để học flashcards"
                  promptMessage="Bạn cần phải đăng nhập để xem và học các bộ flashcards"
                >
                  <Layout>
                    <FlashcardsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/:setId/study"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để học flashcards"
                  promptMessage="Bạn cần phải đăng nhập để bắt đầu học bộ flashcards này"
                >
                  <Layout>
                    <FlashcardStudyPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem profile"
                  promptMessage="Bạn cần phải đăng nhập để xem và chỉnh sửa thông tin cá nhân"
                >
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem cài đặt"
                  promptMessage="Bạn cần phải đăng nhập để truy cập vào cài đặt tài khoản"
                >
                  <Layout>
                    <div>Settings Page (Temporarily Disabled)</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminUsersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminContentPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <TokenRefreshIndicator />
        <AuthDebug />
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