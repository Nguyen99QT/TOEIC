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

import BlogList from './components/blog/BlogList';
import BlogDetail from './components/blog/BlogDetail';
import CreateBlog from './components/blog/CreateBlog';
// Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Components
import LoadingFallback from './components/ui/LoadingFallback';
import Navigation from './components/ui/Navigation';
import Footer from './components/ui/Footer';
import FloatingActionButton from './components/ui/FloatingActionButton';
import TokenRefreshIndicator from './components/auth/TokenRefreshIndicator';

// Pages
import HomePage from './pages/HomePage';
import SimpleHomePage from './pages/SimpleHomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LogoutPage from './pages/auth/LogoutPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import ExerciseDetailPage from './pages/exercises/ExerciseDetailPage';
import ExerciseQuestionsPage from './pages/exercises/ExerciseQuestionsPage';
import ExercisesPage from './pages/exercises/ExercisesPage';
// import QuestionPage from './pages/exercises/QuestionPage';
import FlashcardsPage from './pages/flashcards/FlashcardsPage';
import FlashcardStudyPage from './pages/flashcards/FlashcardStudyPage';
import LessonDetailPage from './pages/lessons/LessonDetailPage';
import LessonsPage from './pages/lessons/LessonsPage';
import PricingPage from './pages/PricingPage';
import UpgradePremiumPage from './pages/UpgradePremiumPage';
import UserProfile from './pages/user/UserProfile';
import EditProfilePage from './pages/user/EditProfilePage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';
import FeedbackPage from './pages/user/FeedbackPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
// import SettingsPage from './pages/user/SettingsPage';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';
import AdminRoute from './components/auth/AdminRoute';

// Enhanced UI Components
import { ToastProvider } from './components/ui/SimpleToast';
import MembershipPlans from './components/blog/MembershipPlans';

// Nguyen's Test Pages
import AudioTest from './components/Nguyen/AudioTest';
import SimpleTOEICTest from './components/Nguyen/SimpleTOEICTest';
import Test from './components/Nguyen/Test';
import TestSelectionPage from './components/TestSelectionPage';
import { TestListPage } from './pages/Nguyen';
import TestHistoryPage from './pages/test-results/TestHistoryPage';
import TestResultDetailPage from './pages/test-results/TestResultDetailPage';

// Question Management Components
import ModernAddQuestionPage from './pages/questions/ModernAddQuestionPage';
import MyQuestionsPage from './pages/questions/MyQuestionsPage';
import SimpleMyQuestionsPage from './pages/questions/SimpleMyQuestionsPage';
import ViewQuestionGroupPage from './pages/questions/ViewQuestionGroupPage';
import EditQuestionGroupPage from './pages/questions/EditQuestionGroupPage';
import EditIndividualQuestionPage from './pages/questions/EditIndividualQuestionPage';

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
    <>
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

            {/* Email Verification Route */}
            <Route
              path="/verify-email"
              element={
                <Layout showNavigation={false} showFooter={false}>
                  <EmailVerificationPage />
                </Layout>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem Blog"
                  promptMessage="Bạn cần phải đăng nhập để xem chi tiết bài viết Blog"
                >
                  <Layout>
                    <BlogDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-blog"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để đăng bài Blog"
                  promptMessage="Bạn cần phải đăng nhập để đăng bài viết Blog mới"
                >
                  <Layout>
                    <CreateBlog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={
              <Layout>
                <PricingPage />
              </Layout>
            } />
            <Route path="/membership" element={
              <Layout>
                <MembershipPlans />
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
            <Route
              path="/blogs"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem Blog"
                  promptMessage="Bạn cần phải đăng nhập để xem các bài viết Blog"
                >
                  <Layout>
                    <BlogList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem Blog"
                  promptMessage="Bạn cần phải đăng nhập để xem chi tiết bài viết Blog"
                >
                  <Layout>
                    <BlogDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Test Routes */}
            <Route
              path="/tests"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem bài thi"
                  promptMessage="Bạn cần phải đăng nhập để xem danh sách bài thi và tạo bài thi mới"
                >
                  <Layout>
                    <TestListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests/:testId"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài thi"
                  promptMessage="Bạn cần phải đăng nhập để làm bài thi TOEIC"
                >
                  <Layout>
                    <Test />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-selection"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để chọn bài thi"
                  promptMessage="Bạn cần phải đăng nhập để chọn loại bài thi TOEIC"
                >
                  <Layout>
                    <TestSelectionPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audio-test"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài thi nghe"
                  promptMessage="Bạn cần phải đăng nhập để làm bài thi nghe TOEIC"
                >
                  <Layout>
                    <AudioTest />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/simple-toeic-test"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để làm bài thi đơn giản"
                  promptMessage="Bạn cần phải đăng nhập để làm bài thi TOEIC đơn giản"
                >
                  <Layout>
                    <SimpleTOEICTest />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-history"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem lịch sử bài thi"
                  promptMessage="Bạn cần phải đăng nhập để xem lịch sử và kết quả các bài thi đã làm"
                >
                  <Layout>
                    <TestHistoryPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-results/:resultId"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem chi tiết kết quả"
                  promptMessage="Bạn cần phải đăng nhập để xem chi tiết kết quả bài thi"
                >
                  <Layout>
                    <TestResultDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Question Management Routes */}
            <Route
              path="/questions"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để quản lý câu hỏi"
                  promptMessage="Bạn cần phải đăng nhập để xem và quản lý câu hỏi"
                >
                  <Layout>
                    <MyQuestionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/simple"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SimpleMyQuestionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/add"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ModernAddQuestionPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/groups/:groupId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ViewQuestionGroupPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/groups/:groupId/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditQuestionGroupPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/:questionId/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditIndividualQuestionPage />
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
                    <ExercisesPage />
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
              path="/user/profile"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để xem profile"
                  promptMessage="Bạn cần phải đăng nhập để xem và chỉnh sửa thông tin cá nhân"
                >
                  <Layout>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/edit-profile"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để chỉnh sửa profile"
                  promptMessage="Bạn cần phải đăng nhập để chỉnh sửa thông tin cá nhân"
                >
                  <Layout>
                    <EditProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/change-password"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để đổi mật khẩu"
                  promptMessage="Bạn cần phải đăng nhập để đổi mật khẩu tài khoản"
                >
                  <Layout>
                    <ChangePasswordPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để gửi feedback"
                  promptMessage="Bạn cần phải đăng nhập để gửi feedback"
                >
                  <Layout>
                    <FeedbackPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback/:exerciseId"
              element={
                <ProtectedRoute
                  promptTitle="Đăng nhập để gửi feedback"
                  promptMessage="Bạn cần phải đăng nhập để gửi feedback về bài tập"
                >
                  <Layout>
                    <FeedbackPage />
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
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/comments"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <AdminRoute>
                  <AdminFeedbackPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blog/create"
              element={
                <AdminRoute>
                  <Layout showNavigation={false} showFooter={false}>
                    <CreateBlog />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <TokenRefreshIndicator />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;