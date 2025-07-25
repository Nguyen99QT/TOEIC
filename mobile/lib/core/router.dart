import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/features/auth/pages/login_page.dart';
import 'package:toeic_mobile/features/auth/pages/register_page.dart';
import 'package:toeic_mobile/features/home/pages/home_page.dart';
import 'package:toeic_mobile/features/dashboard/pages/modern_dashboard_page.dart';
import 'package:toeic_mobile/features/lessons/pages/lessons_page.dart';
import 'package:toeic_mobile/features/lessons/pages/lesson_detail_page.dart';
import 'package:toeic_mobile/features/exercises/pages/exercises_page.dart';
import 'package:toeic_mobile/features/exercises/pages/exercise_detail_page.dart';
import 'package:toeic_mobile/features/flashcards/pages/flashcards_page.dart';
import 'package:toeic_mobile/features/flashcards/pages/flashcard_study_page.dart';
import 'package:toeic_mobile/features/profile/pages/profile_page.dart';
import 'package:toeic_mobile/features/settings/pages/settings_page.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';

// CRUD screens
import 'package:toeic_mobile/features/exercise/screens/exercise_list_screen.dart';
import 'package:toeic_mobile/features/exercise/screens/exercise_form_screen.dart';
import 'package:toeic_mobile/features/flashcard/screens/flashcard_set_list_screen.dart';
import 'package:toeic_mobile/features/lessons/screens/lesson_manage_screen.dart';
import 'package:toeic_mobile/features/lessons/screens/lesson_form_screen.dart';

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
      builder: (context, state) => const ModernDashboardPage(),
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
      path: '/exercises/:id',
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
      path: '/flashcards/:id/study',
      builder: (context, state) {
        final setId = state.pathParameters['id']!;
        return FlashcardStudyPage(flashcardSetId: setId);
      },
    ),
    GoRoute(
      path: '/flashcard-study/:setId',
      builder: (context, state) {
        final setId = state.pathParameters['setId']!;
        return FlashcardStudyPage(flashcardSetId: setId);
      },
    ),
    // CRUD Routes - Exercise Management
    GoRoute(
      path: '/exercises-crud',
      builder: (context, state) => const ExerciseListScreen(),
    ),
    GoRoute(
      path: '/exercises/create',
      builder: (context, state) => const ExerciseFormScreen(),
    ),
    GoRoute(
      path: '/exercises/:id/edit',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ExerciseFormScreen(exerciseId: id);
      },
    ),
    // CRUD Routes - Lesson Management
    GoRoute(
      path: '/lessons-manage',
      builder: (context, state) => const LessonManageScreen(),
    ),
    GoRoute(
      path: '/lessons/create',
      builder: (context, state) => const LessonFormScreen(),
    ),
    GoRoute(
      path: '/lessons/:id/edit',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return LessonFormScreen(lessonId: id);
      },
    ),
    // CRUD Routes - Flashcard Management
    GoRoute(
      path: '/flashcards-crud',
      builder: (context, state) => const FlashcardSetListScreen(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfilePage(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsPage(),
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
