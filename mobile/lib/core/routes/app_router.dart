import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';
import 'package:toeic_mobile/features/auth/pages/login_page.dart';
import 'package:toeic_mobile/features/auth/pages/register_page.dart';
import 'package:toeic_mobile/features/home/pages/home_page.dart';
import 'package:toeic_mobile/features/dashboard/pages/dashboard_page.dart';
import 'package:toeic_mobile/features/lessons/pages/lessons_page.dart';
import 'package:toeic_mobile/features/lessons/pages/lesson_detail_page.dart';
import 'package:toeic_mobile/features/exercises/pages/exercises_page.dart';
import 'package:toeic_mobile/features/exercises/pages/exercise_detail_page.dart';
import 'package:toeic_mobile/features/flashcards/pages/flashcards_page.dart';
import 'package:toeic_mobile/features/flashcards/pages/flashcard_study_page.dart';
import 'package:toeic_mobile/features/profile/pages/profile_page.dart';
import 'package:toeic_mobile/features/settings/pages/settings_page.dart';
import 'package:toeic_mobile/shared/widgets/layout/main_layout.dart';
import 'package:toeic_mobile/shared/widgets/layout/auth_layout.dart' as auth;

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final authService = AuthService.instance;
      final isAuthenticated = authService.isAuthenticated;
      final location = state.uri.toString();

      // Public routes
      final publicRoutes = [
        '/',
        '/login',
        '/register',
      ];

      // If user is not authenticated and trying to access protected route
      if (!isAuthenticated && !publicRoutes.contains(location)) {
        return '/login';
      }

      // If user is authenticated and trying to access auth routes
      if (isAuthenticated &&
          (location == '/login' || location == '/register')) {
        return '/dashboard';
      }

      return null;
    },
    routes: [
      // Home route
      GoRoute(
        path: '/',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: HomePage(),
          ),
        ),
      ),

      // Auth routes
      GoRoute(
        path: '/login',
        pageBuilder: (context, state) => const MaterialPage(
          child: auth.AuthLayout(
            child: LoginPage(),
          ),
        ),
      ),
      GoRoute(
        path: '/register',
        pageBuilder: (context, state) => const MaterialPage(
          child: auth.AuthLayout(
            child: RegisterPage(),
          ),
        ),
      ),

      // Dashboard route
      GoRoute(
        path: '/dashboard',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: DashboardPage(),
          ),
        ),
      ),

      // Lessons routes
      GoRoute(
        path: '/lessons',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: LessonsPage(),
          ),
        ),
      ),
      GoRoute(
        path: '/lessons/:id',
        pageBuilder: (context, state) => MaterialPage(
          child: MainLayout(
            child: LessonDetailPage(
              lessonId: state.pathParameters['id']!,
            ),
          ),
        ),
      ),

      // Exercises routes
      GoRoute(
        path: '/exercises',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: ExercisesPage(),
          ),
        ),
      ),
      GoRoute(
        path: '/exercises/:id',
        pageBuilder: (context, state) => MaterialPage(
          child: MainLayout(
            child: ExerciseDetailPage(
              exerciseId: state.pathParameters['id']!,
            ),
          ),
        ),
      ),

      // Flashcards routes
      GoRoute(
        path: '/flashcards',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: FlashcardsPage(),
          ),
        ),
      ),
      GoRoute(
        path: '/flashcards/:id/study',
        pageBuilder: (context, state) => MaterialPage(
          child: MainLayout(
            child: FlashcardStudyPage(
              flashcardSetId: state.pathParameters['id']!,
            ),
          ),
        ),
      ),

      // Profile routes
      GoRoute(
        path: '/profile',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: ProfilePage(),
          ),
        ),
      ),
      GoRoute(
        path: '/settings',
        pageBuilder: (context, state) => const MaterialPage(
          child: MainLayout(
            child: SettingsPage(),
          ),
        ),
      ),
    ],
  );
}
