import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Auth
import '../../features/auth/pages/login_page.dart';
import '../../features/auth/pages/register_page.dart';

// Dashboard
import '../../features/dashboard/pages/dashboard_page.dart';

// Tests
import '../../features/tests/pages/test_page.dart';
import '../../features/tests/pages/test_list_page.dart';
import '../../features/tests/pages/test_history_page.dart';
import '../../features/tests/pages/test_result_page.dart';
import '../../features/tests/pages/test_result_detail_page.dart';
import '../../features/tests/pages/test_result_simple_page.dart';

// Exercises  
import '../../features/exercises/pages/exercises_page.dart';
import '../../features/exercises/pages/exercise_detail_page.dart';

// Flashcards
import '../../features/flashcards/pages/flashcards_page.dart';
import '../../features/flashcards/pages/flashcard_study_page.dart';

// Lessons
import '../../features/lessons/pages/lessons_page.dart';
import '../../features/lessons/pages/lesson_detail_page.dart';

// Profile
import '../../features/profile/pages/profile_page.dart';

// Home
import '../../features/home/presentation/pages/home_page.dart';

// Blog (From DuyAnh branch)
import '../../features/blog/presentation/pages/blog_list_page.dart';
import '../../features/blogs/pages/blogs_page.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  
  static final router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/dashboard',
    routes: [
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterPage(),
      ),
      
      // Main App Routes
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
      
      // Test Routes
      GoRoute(
        path: '/test-list',
        builder: (context, state) => const TestListPage(),
      ),
      GoRoute(
        path: '/test/:testId',
        builder: (context, state) {
          final testId = int.parse(state.pathParameters['testId']!);
          return TestPage(testId: testId);
        },
      ),
      GoRoute(
        path: '/test-history',
        builder: (context, state) => const TestHistoryPage(),
      ),
      GoRoute(
        path: '/test-result/:submissionId',
        builder: (context, state) {
          final submissionId = int.parse(state.pathParameters['submissionId']!);
          return TestResultPage(submissionId: submissionId);
        },
      ),
      GoRoute(
        path: '/test-result-detail/:submissionId',
        builder: (context, state) {
          final submissionId = int.parse(state.pathParameters['submissionId']!);
          return TestResultDetailPage(resultId: submissionId);
        },
      ),
      GoRoute(
        path: '/test-result-simple',
        builder: (context, state) => const TestResultSimplePage(),
      ),
      
      // Exercise Routes
      GoRoute(
        path: '/exercises',
        builder: (context, state) => const ExercisesPage(),
      ),
      GoRoute(
        path: '/exercise/:exerciseId',
        builder: (context, state) {
          final exerciseId = state.pathParameters['exerciseId']!;
          return ExerciseDetailPage(exerciseId: exerciseId);
        },
      ),
      
      // Flashcard Routes
      GoRoute(
        path: '/flashcards',
        builder: (context, state) => const FlashcardsPage(),
      ),
      GoRoute(
        path: '/flashcard-study/:setId',
        builder: (context, state) {
          final setId = state.pathParameters['setId']!;
          return FlashcardStudyPage(flashcardSetId: setId);
        },
      ),
      
      // Lesson Routes
      GoRoute(
        path: '/lessons',
        builder: (context, state) => const LessonsPage(),
      ),
      GoRoute(
        path: '/lesson/:lessonId',
        builder: (context, state) {
          final lessonId = state.pathParameters['lessonId']!;
          return LessonDetailPage(lessonId: lessonId);
        },
      ),
      
      // Profile Route
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      
      // Blog Routes (From DuyAnh branch)
      GoRoute(
        path: '/blogs',
        builder: (context, state) => const BlogsPage(),
      ),
      GoRoute(
        path: '/blog-list',
        builder: (context, state) => const BlogListPage(),
      ),
    ],
  );
}