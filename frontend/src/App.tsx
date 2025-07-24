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
import { Toaster } from 'react-hot-toast';

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

// Routes
import CollaboratorRoutes from './routes/CollaboratorRoutes';

// Pages - Public
import HomePage from './pages/HomePage';
import SimpleHomePage from './pages/SimpleHomePage';
import PricingPage from './pages/PricingPage';
import UpgradePremiumPage from './pages/UpgradePremiumPage';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LogoutPage from './pages/auth/LogoutPage';

// Pages - User
import DashboardPage from './pages/DashboardPageNew';
import ProfilePage from './pages/user/ProfilePage';

// Pages - Lessons
import LessonsPage from './pages/lessons/LessonsPage';
import LessonDetailPage from './pages/lessons/LessonDetailPage';

// Pages - Exercises
import ExercisesPageClean from './pages/exercises/ExercisesPageClean';
import ExerciseDetailPage from './pages/exercises/ExerciseDetailPage';
import ExerciseQuestionsPage from './pages/exercises/ExerciseQuestionsPage';

// Pages - Flashcards
import FlashcardsPage from './pages/flashcards/FlashcardsPage';
import FlashcardStudyPage from './pages/flashcards/FlashcardStudyPage';

// Pages - Admin
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminContentPage from './pages/admin/AdminContentPage';

// Enhanced UI Components
import { ToastProvider } from './components/ui/SimpleToast';

// Development utilities
import './utils/devUtils';

// ========== LAYOUT COMPONENT ==========
interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showNavigation = true,
  showFooter = true
}) => {
  const { isAuthenticated } = useAuth();

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

// ========== LOCATION LOGGER ==========
const LocationLogger: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('🗺️ Route changed to:', location.pathname);
    console.log('🔍 Search params:', location.search);
    console.log('🔍 Hash:', location.hash);
  }, [location]);

  return null;
};

// ========== APP CONTENT COMPONENT ==========
const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // Debug logging
  console.log('🔍 App State:', { loading, isAuthenticated, currentUser });

  // Role-based redirect function
  const getRoleBasedRedirect = () => {
    if (!isAuthenticated || !currentUser || typeof currentUser === 'string') {
      return '/';
    }

    const userRole = currentUser.role || 'USER';

    switch (userRole) {
      case 'ADMIN':
        return '/admin/users';
      case 'COLLABORATOR':
        return '/collaborator/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <Router>
      <LocationLogger />
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route
              path="/"
              element={
                <Layout>
                  {(() => {
                    console.log('🏠 HomePage Route: isAuthenticated =', isAuthenticated, 'user =', currentUser?.username || 'guest');

                    // Role-based routing
                    if (isAuthenticated && currentUser && typeof currentUser === 'object') {
                      const userRole = currentUser.role || 'USER';

                      if (userRole === 'COLLABORATOR') {
                        return <Navigate to="/collaborator/dashboard" replace />;
                      }
                      if (userRole === 'ADMIN') {
                        return <Navigate to="/admin/users" replace />;
                      }
                      return <HomePage />;
                    } return <SimpleHomePage />;
                  })()}
                </Layout>
              }
            />

            <Route
              path="/pricing"
              element={
                <Layout>
                  <PricingPage />
                </Layout>
              }
            />

            <Route
              path="/upgrade-premium"
              element={
                <Layout>
                  <UpgradePremiumPage />
                </Layout>
              }
            />

            {/* ========== AUTH ROUTES ========== */}
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

            {/* ========== USER DASHBOARD ========== */}
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

            {/* ========== LESSONS ROUTES ========== */}
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

            {/* ========== EXERCISES ROUTES ========== */}
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

            {/* ========== FLASHCARDS ROUTES ========== */}
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

            {/* ========== ADMIN ROUTES ========== */}
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

            {/* ========== COLLABORATOR ROUTES ========== */}
            <Route
              path="/collaborator/*"
              element={
                <ProtectedRoute
                  promptTitle="Truy cập dành cho Collaborator"
                  promptMessage="Bạn cần có quyền Collaborator để truy cập tính năng này"
                >
                  <Layout>
                    <CollaboratorRoutes />
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
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;