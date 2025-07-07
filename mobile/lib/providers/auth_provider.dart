import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/toeic_models.dart';
import '../services/api_service.dart';

// Auth State
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;
  final bool isInitialized;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
    this.isInitialized = false,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
    bool? isInitialized,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isInitialized: isInitialized ?? this.isInitialized,
    );
  }

  bool get isAuthenticated => user != null;
}

// Auth Provider
class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService = ApiService();

  AuthNotifier() : super(const AuthState()) {
    // Initialize auth state as soon as provider is created
    checkAuthStatus();
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final result = await _apiService.login(email, password);
      final user = result['user'] as User;

      debugPrint('📱 AUTH: Login successful for ${user.username}');
      state = state.copyWith(user: user, isLoading: false, isInitialized: true);
    } catch (e) {
      debugPrint('📱 AUTH: Login failed - $e');
      state = state.copyWith(
        error: 'Login failed: ${e.toString()}',
        isLoading: false,
        isInitialized: true,
      );
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final success = await _apiService.logout();

      if (success) {
        debugPrint('📱 AUTH: Logout successful');
        // Reset state to unauthenticated
        state = const AuthState(isInitialized: true);
      } else {
        debugPrint('📱 AUTH: Logout failed');
        state = state.copyWith(
          error: 'Logout failed',
          isLoading: false,
          isInitialized: true,
        );
      }
    } catch (e) {
      debugPrint('📱 AUTH: Logout error - $e');
      // Even if server-side logout fails, we should clear local state
      state = const AuthState(isInitialized: true);
    }
  }

  // Check authentication status - for splash screen and app initialization
  Future<void> checkAuthStatus() async {
    debugPrint('📱 AUTH: Checking authentication status...');
    state = state.copyWith(isLoading: true, error: null);

    try {
      final isAuthenticated = await _apiService.isAuthenticated();

      if (isAuthenticated) {
        debugPrint('📱 AUTH: User is authenticated');
        try {
          // Get the current user profile
          // In a real app, we'd get the user profile from the API
          // For now, we'll create a placeholder user
          final userData = User(
            id: 1,
            username: "current_user",
            email: "user@example.com",
            role: UserRole.USER,
            currentLevel: 1,
            totalScore: 0,
            testsCompleted: 0,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          );
          state = state.copyWith(
            user: userData,
            isLoading: false,
            isInitialized: true,
          );
          debugPrint('📱 AUTH: User profile loaded - ${userData.username}');
        } catch (e) {
          debugPrint('📱 AUTH: Failed to get user profile - $e');
          // Failed to get user profile, clear authentication
          await _apiService.logout();
          state = state.copyWith(isLoading: false, isInitialized: true);
        }
      } else {
        debugPrint('📱 AUTH: User is not authenticated');
        state = state.copyWith(isLoading: false, isInitialized: true);
      }
    } catch (e) {
      debugPrint('📱 AUTH: Authentication check failed - $e');
      state = state.copyWith(
        error: 'Authentication check failed: ${e.toString()}',
        isLoading: false,
        isInitialized: true,
      );
    }
  }

  Future<void> register(String name, String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final result = await _apiService.register(name, email, password);
      final user = result['user'] as User;

      debugPrint('📱 AUTH: Registration successful for ${user.username}');
      state = state.copyWith(user: user, isLoading: false, isInitialized: true);
    } catch (e) {
      debugPrint('📱 AUTH: Registration failed - $e');
      state = state.copyWith(
        error: 'Registration failed: ${e.toString()}',
        isLoading: false,
        isInitialized: true,
      );
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
