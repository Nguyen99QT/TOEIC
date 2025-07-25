import 'package:toeic_mobile/core/models/user_model.dart';
import 'package:toeic_mobile/core/services/api_service.dart';
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
  }

  Future<LoginResult> login(String username, String password) async {
    try {
      // Use the static login method from ApiService extension
      final response = await ApiServiceStatic.login(
        username: username,
        password: password,
      );

      // Check if login was successful
      if (response['success'] == true) {
        final data = response['data'];
        _token = data['accessToken'] ?? data['token'];

        // Create user object from response data using fromMap to handle roles properly
        _currentUser = User.fromMap({
          'id': data['id'],
          'username': data['username'] ?? username,
          'email': data['email'] ?? '',
          'fullName': data['fullName'] ?? data['username'] ?? username,
          'roles': data['roles'], // This will handle the roles array properly
          'membershipType': data['membershipType'] ?? 'free',
        });

        // Save authentication data securely
        await _storageService.saveAuthToken(_token!);
        await _storageService.saveUserData(_currentUser!.toMap());

        // Save refresh token if available
        if (data['refreshToken'] != null) {
          await _storageService.saveRefreshToken(data['refreshToken']);
        }

        return LoginResult(success: true, user: _currentUser);
      } else {
        return LoginResult(
            success: false,
            error: response['message'] ?? 'Invalid login response');
      }
    } catch (e) {
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
      final response = await ApiServiceStatic.register(
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
