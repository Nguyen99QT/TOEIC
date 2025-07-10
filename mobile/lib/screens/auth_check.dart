import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import 'auth/login_screen.dart';
import 'auth/splash_screen.dart';
import 'main_navigation_screen.dart';

class AuthCheck extends ConsumerWidget {
  const AuthCheck({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    // Show splash screen while checking auth
    if (authState.isLoading) {
      return const SplashScreen();
    }

    // If authenticated, show main app
    if (authState.isAuthenticated) {
      return const MainNavigationScreen();
    }

    // Otherwise show login screen
    return const LoginScreen();
  }
}
