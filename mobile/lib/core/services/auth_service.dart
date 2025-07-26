import 'package:toeic_mobile/core/models/user_model.dart';
import 'package:toeic_mobile/core/services/api_service.dart' as legacy_api;
import 'package:toeic_mobile/core/services/storage_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  static AuthService get instance => _instance;
  AuthService._internal();

  final StorageService _storageService = StorageService.instance;

  User? _currentUser;
  String? _token;

  bool get isAuthenticated => _token != null && _currentUser != null;
  User? get currentUser => _currentUser;
  String? get token => _token;

  Future<void> init() async {
    // Load saved authentication data using secure storage
    _token = await _storageService.getAuthToken();
    final userData = await _storageService.getUserData();

    if (userData != null) {
      _currentUser = User.fromMap(userData);
    }

    // Ensure token is also available for interceptor
    if (_token != null) {
      await _storageService.saveString('auth_token', _token!);
      print('🔄 Token loaded and synced: ${_token!.substring(0, 20)}...');
    }
  }

  Future<LoginResult> login(String username, String password) async {
    try {
      // Use the static login method from ApiService extension
      final response = await legacy_api.ApiServiceStatic.login(
        username: username,
        password: password,
      );

      // Legacy ApiService wraps response in {success, data, message} format
      // Extract the actual backend data
      Map<String, dynamic> backendData;
      if (response['success'] == true && response['data'] != null) {
        backendData = response['data'];
        print('✅ Using wrapped response data');
      } else {
        backendData = response;
        print('✅ Using direct response data');
      }

      if (backendData['token'] != null || backendData['accessToken'] != null) {
        _token = backendData['accessToken'] ?? backendData['token'];

        try {
          // Create user object from response data using fromMap to handle roles properly
          _currentUser = User.fromMap({
            'id': backendData['id'],
            'username': backendData['username'] ?? username,
            'email': backendData['email'] ?? '',
            'fullName':
                backendData['fullName'] ?? backendData['username'] ?? username,
            'roles': backendData[
                'roles'], // This will handle the roles array properly
            'membershipType': backendData['membershipType'] ?? 'free',
          });

          print('✅ User created successfully: ${_currentUser!.username}');
        } catch (userError) {
          print('❌ Error creating user: $userError');
          return LoginResult(
              success: false, error: 'Failed to create user: $userError');
        }

        // Save authentication data securely - CRITICAL for interceptor
        await _storageService.saveAuthToken(_token!);
        await _storageService.saveUserData(_currentUser!.toMap());

        // Also save with the key that interceptor expects
        await _storageService.saveString('auth_token', _token!);

        print('💾 Token saved to storage: ${_token!.substring(0, 20)}...');
        print('✅ Login successful for user: ${_currentUser!.username}');

        // Save refresh token if available
        if (backendData['refreshToken'] != null) {
          await _storageService.saveRefreshToken(backendData['refreshToken']);
        }

        return LoginResult(success: true, user: _currentUser);
      } else {
        return LoginResult(
            success: false,
            error: response['message'] ??
                backendData['message'] ??
                'Invalid login response');
      }
    } catch (e) {
      print('❌ Login error: $e');
      return LoginResult(success: false, error: e.toString());
    }
  }

  Future<RegisterResult> register({
    required String username,
    required String email,
    required String password,
    required String fullName,
    String? firstName,
    String? lastName,
    String? gender,
    String? phoneNumber,
  }) async {
    try {
      // Use the static register method from ApiService extension
      final response = await legacy_api.ApiServiceStatic.register(
        username: username,
        email: email,
        password: password,
      );

      if (response['success'] == true) {
        final data = response['data'];
        final user = User.fromMap(data['user'] ?? data);

        return RegisterResult(success: true, user: user);
      } else {
        return RegisterResult(
            success: false,
            error: response['message'] ?? 'Registration failed');
      }
    } catch (e) {
      return RegisterResult(success: false, error: e.toString());
    }
  }

  Future<void> logout() async {
    try {
      if (_token != null) {
        // Call logout endpoint if available
        // await ApiService.logout(_token!);
      }
    } catch (e) {
      print('Error during logout: $e');
    } finally {
      _token = null;
      _currentUser = null;
      await _storageService.clearAuthData();
      // Also clear the token that interceptor uses
      await _storageService.remove('auth_token');
      print('✅ Logout successful - all tokens cleared');
    }
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = await _storageService.getRefreshToken();
      if (refreshToken == null) return false;

      // You'll need to add a refresh token method to ApiService
      // For now, return false
      return false;
    } catch (e) {
      print('Error refreshing token: $e');
      return false;
    }
  }

  Future<bool> validateToken() async {
    try {
      if (_token == null) return false;

      // You'll need to add a validate token method to ApiService
      // For now, return true if token exists
      return _token != null;
    } catch (e) {
      print('Error validating token: $e');
      return false;
    }
  }
}

class LoginResult {
  final bool success;
  final User? user;
  final String? error;

  LoginResult({required this.success, this.user, this.error});
}

class RegisterResult {
  final bool success;
  final User? user;
  final String? error;

  RegisterResult({required this.success, this.user, this.error});
}
