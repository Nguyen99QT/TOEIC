import 'package:go_router/go_router.dart';
import '../features/auth/pages/login_page.dart';
import '../features/auth/pages/register_page.dart';
import '../features/home/pages/home_page.dart';
import '../features/dashboard/pages/dashboard_page.dart';
import '../features/lessons/pages/lessons_page.dart';
import '../features/lessons/pages/lesson_detail_page.dart';
import '../features/exercises/pages/exercises_page.dart';
import '../features/exercises/pages/exercise_detail_page.dart';
import '../features/flashcards/pages/flashcards_page.dart';
import '../features/flashcards/pages/flashcard_study_page.dart';
import '../features/profile/pages/profile_page.dart';
import '../features/settings/pages/settings_page.dart';
import '../screens/tests_screen.dart';
import '../screens/test_details_screen.dart';
import '../screens/test_session_screen.dart';
import '../screens/test_result_screen.dart';
import '../screens/test_history_screen.dart';
import '../core/services/auth_service.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardPage(),
    ),
    GoRoute(
      path: '/lessons',
      builder: (context, state) => const LessonsPage(),
    ),
    GoRoute(
      path: '/lesson/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return LessonDetailPage(lessonId: id);
      },
    ),
    GoRoute(
      path: '/exercises',
      builder: (context, state) => const ExercisesPage(),
    ),
    GoRoute(
      path: '/exercise/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ExerciseDetailPage(exerciseId: id);
      },
    ),
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
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfilePage(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsPage(),
    ),
    GoRoute(
      path: '/tests',
      builder: (context, state) => const TestsScreen(),
    ),
    GoRoute(
      path: '/test-details/:testId',
      builder: (context, state) {
        final testId = int.parse(state.pathParameters['testId']!);
        return TestDetailsScreen(testId: testId);
      },
    ),
    GoRoute(
      path: '/test-session/:testId',
      builder: (context, state) {
        final testId = int.parse(state.pathParameters['testId']!);
        return TestSessionScreen(testId: testId);
      },
    ),
    GoRoute(
      path: '/test-result',
      builder: (context, state) {
        final result = state.extra as Map<String, dynamic>;
        return TestResultScreen(result: result);
      },
    ),
    GoRoute(
      path: '/test-history',
      builder: (context, state) => const TestHistoryScreen(),
    ),
  ],
  redirect: (context, state) {
    final isAuthenticated = AuthService.instance.isAuthenticated;
    final currentPath = state.uri.path;

    // Public routes that don't require authentication
    final publicRoutes = ['/', '/home', '/login', '/register'];

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !publicRoutes.contains(currentPath)) {
      return '/login';
    }

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthenticated &&
        (currentPath == '/login' || currentPath == '/register')) {
      return '/dashboard';
    }

    return null;
  },
);
