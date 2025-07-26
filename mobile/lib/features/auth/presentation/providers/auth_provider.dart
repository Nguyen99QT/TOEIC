import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:convert';
import '../../../../models/user.dart';
import '../../../../core/services/enhanced_api_service.dart';
import '../../../../core/services/storage_service.dart';

// Auth state
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final User? user;
  final String? errorMessage;

  const AuthState({
    this.isAuthenticated = false,
    this.isLoading = false,
    this.user,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    User? user,
    String? errorMessage,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

// Auth notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthApiService _authApiService;
  final StorageService _storageService;

  AuthNotifier(this._authApiService, this._storageService)
      : super(const AuthState()) {
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    state = state.copyWith(isLoading: true);

    try {
      // Check if user data exists in storage
      final userJson = await _storageService.getString('user_data');
      final token = await _storageService.getString('auth_token');

      if (userJson != null && token != null) {
        // Try to validate token with server
        final isValid = await _authApiService.checkAuthStatus();

        if (isValid) {
          // Reconstruct user from stored data
          try {
            final userMap = jsonDecode(userJson) as Map<String, dynamic>;
            final user = User.fromJson(userMap);

            state = state.copyWith(
              isAuthenticated: true,
              isLoading: false,
              user: user,
            );
          } catch (e) {
            debugPrint('Error parsing stored user data: $e');
            await _clearAuthData();
            state = state.copyWith(isAuthenticated: false, isLoading: false);
          }
        } else {
          // Token invalid, clear storage
          await _clearAuthData();
          state = state.copyWith(isAuthenticated: false, isLoading: false);
        }
      } else {
        state = state.copyWith(isAuthenticated: false, isLoading: false);
      }
    } catch (e) {
      debugPrint('Auth initialization error: $e');
      state = state.copyWith(
        isAuthenticated: false,
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<bool> login(String username, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final result = await _authApiService.login(username, password);

      if (result['success'] == true) {
        final userData = result['data'];

        // Create user object from response
        final user = User(
          id: userData['id']?.toString() ?? '',
          username: userData['username'] ?? username,
          email: userData['email'] ?? '',
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          role: userData['role'] ?? 'user',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          isActive: true,
        );

        // Save user data to storage
        await _storageService.saveString(
            'user_data', jsonEncode(user.toJson()));

        state = state.copyWith(
          isAuthenticated: true,
          isLoading: false,
          user: user,
        );

        return true;
      } else {
        state = state.copyWith(
          isAuthenticated: false,
          isLoading: false,
          errorMessage: result['message'] ?? 'Login failed',
        );

        return false;
      }
    } catch (e) {
      debugPrint('Login error: $e');
      state = state.copyWith(
        isAuthenticated: false,
        isLoading: false,
        errorMessage: 'Login failed: $e',
      );

      return false;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);

    try {
      await _authApiService.logout();
    } catch (e) {
      debugPrint('Logout error: $e');
    } finally {
      await _clearAuthData();
      state = const AuthState(isAuthenticated: false, isLoading: false);
    }
  }

  Future<void> checkAuthStatus() async {
    if (state.isLoading) return; // Prevent multiple simultaneous checks

    state = state.copyWith(isLoading: true);

    try {
      final isAuthenticated = await _authApiService.checkAuthStatus();

      if (!isAuthenticated && state.isAuthenticated) {
        // Token expired or invalid
        await _clearAuthData();
        state = const AuthState(isAuthenticated: false, isLoading: false);
      } else if (isAuthenticated && !state.isAuthenticated) {
        // User is authenticated but state doesn't reflect it
        await _initializeAuth();
      } else {
        state = state.copyWith(isLoading: false);
      }
    } catch (e) {
      debugPrint('Auth check error: $e');
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> _clearAuthData() async {
    await _storageService.remove('auth_token');
    await _storageService.remove('user_data');
    await _storageService.remove('refresh_token');
  }

  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}

// Providers
final authApiServiceProvider =
    Provider<AuthApiService>((ref) => AuthApiService());

final storageServiceProvider =
    Provider<StorageService>((ref) => StorageService.instance);

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authApiService = ref.watch(authApiServiceProvider);
  final storageService = ref.watch(storageServiceProvider);
  return AuthNotifier(authApiService, storageService);
});

// Helper providers
final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authProvider).user;
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isAuthenticated;
});

final isLoadingProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isLoading;
});
