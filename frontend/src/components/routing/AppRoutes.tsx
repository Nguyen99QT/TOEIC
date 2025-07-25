/**
 * ================================================================
 * APP ROUTES COMPONENT
 * ================================================================
 * 
 * Main routing logic for the application
 * Used within Layout to provide proper routing with Sidebar
 */

import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import BlogList from '../blog/BlogList';
import BlogDetail from '../blog/BlogDetail';
import CreateBlog from '../blog/CreateBlog';
import CollaboratorBlogList from '../blog/CollaboratorBlogList';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoadingFallback from '../ui/LoadingFallback';
import { useAuth } from '../../contexts/AuthContext';

// Pages
import HomePage from '../../pages/HomePage';
import SimpleHomePage from '../../pages/SimpleHomePage';
import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import LogoutPage from '../../pages/auth/LogoutPage';
import EmailVerificationPage from '../../pages/auth/EmailVerificationPage';
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage';
import CollaboratorDashboard from '../../pages/CollaboratorDashboard';
import ExerciseDetailPage from '../../pages/exercises/ExerciseDetailPage';
import ExerciseQuestionsPage from '../../pages/exercises/ExerciseQuestionsPage';
import ExercisesPage from '../../pages/exercises/ExercisesPage';
import FlashcardsPage from '../../pages/flashcards/FlashcardsPage';
import FlashcardStudyPage from '../../pages/flashcards/FlashcardStudyPage';
import LessonDetailPage from '../../pages/lessons/LessonDetailPage';
import LessonsPage from '../../pages/lessons/LessonsPage';
import PricingPage from '../../pages/PricingPage';
import UpgradePremiumPage from '../../pages/UpgradePremiumPage';
import UserProfile from '../../pages/user/UserProfile';
import EditProfilePage from '../../pages/user/EditProfilePage';
import ChangePasswordPage from '../../pages/user/ChangePasswordPage';
import FeedbackPage from '../../pages/user/FeedbackPage';
import ContactPage from '../../pages/contact/ContactPage';
import DashboardPage from '../../pages/DashboardPage';

// Admin Pages
import AdminPanel from '../../pages/admin/AdminPanel';
import AdminRoute from '../auth/AdminRoute';

// Enhanced UI Components
import MembershipPlans from '../blog/MembershipPlans';

// Nguyen's Test Pages
import AudioTest from '../Nguyen/AudioTest';
import SimpleTOEICTest from '../Nguyen/SimpleTOEICTest';
import Test from '../Nguyen/Test';
import TestSelectionPage from '../TestSelectionPage';
import { TestListPage } from '../../pages/Nguyen';
import TestHistoryPage from '../../pages/test-results/TestHistoryPage';
import TestResultDetailPage from '../../pages/test-results/TestResultDetailPage';

// Question Management Components
import ModernAddQuestionPage from '../../pages/questions/ModernAddQuestionPage';
import MyQuestionsPage from '../../pages/questions/MyQuestionsPage';
import SimpleMyQuestionsPage from '../../pages/questions/SimpleMyQuestionsPage';
import TOEICQuestionGroupForm from '../Nguyen/TOEICQuestionGroupForm';
import QuestionGroupsPage from '../../pages/questions/QuestionGroupsPage';
import ViewQuestionGroupPage from '../../pages/questions/ViewQuestionGroupPage';
import EditQuestionGroupPage from '../../pages/questions/EditQuestionGroupPage';
import EditIndividualQuestionPage from '../../pages/questions/EditIndividualQuestionPage';

// Test Components
import TestIndividualQuestions from '../test/TestIndividualQuestions';

const AppRoutes: React.FC = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          isAuthenticated ? <HomePage /> : <SimpleHomePage />
        } />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            loading ? (
              <LoadingFallback />
            ) : isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
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
              <RegisterPage />
            )
          }
        />

        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            loading ? (
              <LoadingFallback />
            ) : isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />
        <Route
          path="/reset-password"
          element={
            loading ? (
              <LoadingFallback />
            ) : isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <ResetPasswordPage />
            )
          }
        />

        {/* Public content routes */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/membership" element={<MembershipPlans />} />
        <Route path="/upgrade-premium" element={<UpgradePremiumPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              promptTitle="Đăng nhập để xem dashboard"
              promptMessage="Bạn cần phải đăng nhập để xem dashboard cá nhân và theo dõi tiến trình học tập"
            >
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Collaborator Dashboard */}
        <Route
          path="/collaborator/dashboard"
          element={
            <ProtectedRoute
              promptTitle="Đăng nhập với tài khoản cộng tác viên"
              promptMessage="Bạn cần phải đăng nhập với tài khoản cộng tác viên để xem dashboard"
            >
              <CollaboratorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Collaborator Blog List */}
        <Route
          path="/collaborator/blogs"
          element={
            <ProtectedRoute
              promptTitle="Đăng nhập với tài khoản cộng tác viên"
              promptMessage="Bạn cần phải đăng nhập với tài khoản cộng tác viên để quản lý blog"
            >
              <CollaboratorBlogList />
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
              <LessonsPage />
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
              <LessonDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Blog Routes */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute
              promptTitle="Đăng nhập để xem Blog"
              promptMessage="Bạn cần phải đăng nhập để xem các bài viết Blog"
            >
              <BlogList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute
              promptTitle="Đăng nhập để tạo Blog"
              promptMessage="Bạn cần phải đăng nhập để tạo bài viết Blog mới"
            >
              <CreateBlog />
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
              <BlogDetail />
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
              <TestListPage />
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
              <Test />
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
              <TestSelectionPage />
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
              <AudioTest />
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
              <SimpleTOEICTest />
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
              <TestHistoryPage />
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
              <TestResultDetailPage />
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
              <MyQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/simple"
          element={
            <ProtectedRoute>
              <SimpleMyQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/add"
          element={
            <ProtectedRoute>
              <ModernAddQuestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/add-group"
          element={
            <ProtectedRoute>
              <TOEICQuestionGroupForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/groups"
          element={
            <ProtectedRoute>
              <QuestionGroupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/groups/:groupId"
          element={
            <ProtectedRoute>
              <ViewQuestionGroupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/groups/:groupId/edit"
          element={
            <ProtectedRoute>
              <EditQuestionGroupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:questionId/edit"
          element={
            <ProtectedRoute>
              <EditIndividualQuestionPage />
            </ProtectedRoute>
          }
        />
        
        {/* Test Route for Individual Questions API */}
        <Route
          path="/questions/test"
          element={
            <ProtectedRoute>
              <TestIndividualQuestions />
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
              <ExercisesPage />
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
              <ExerciseDetailPage />
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
              <ExerciseDetailPage />
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
              <ExerciseQuestionsPage />
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
              <FlashcardsPage />
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
              <FlashcardStudyPage />
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
              <UserProfile />
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
              <EditProfilePage />
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
              <ChangePasswordPage />
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
              <FeedbackPage />
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
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute
              promptTitle="Login to Contact"
              promptMessage="You need to login to send contact to us"
            >
              <ContactPage />
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
              <div>Settings Page (Temporarily Disabled)</div>
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
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <AdminRoute>
              <AdminPanel />
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
              <CreateBlog />
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
  );
};

export default AppRoutes;
