import 'package:toeic_mobile/core/models/user_model.dart';
import 'package:toeic_mobile/core/services/api_service.dart';
import 'package:toeic_mobile/core/services/storage_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  static AuthService get instance => _instance;
  AuthService._internal();

  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService.instance;

  User? _currentUser;
  String? _token;

  bool get isAuthenticated => _token != null && _currentUser != null;
  User? get currentUser => _currentUser;
  String? get token => _token;

  Future<void> init() async {
    // Load saved authentication data
    _token = await _storageService.getString('auth_token');
    final userData = await _storageService.getString('user_data');

    if (userData != null) {
      _currentUser = User.fromJson(userData);
    }
  }

  Future<LoginResult> login(String username, String password) async {
    try {
      final response = await _apiService.post('/auth/login', {
        'username': username,
        'password': password,
      });

      if (response.success) {
        final data = response.data;
        _token = data['accessToken'] ?? data['token'];
        _currentUser = User.fromMap(data['user'] ?? data);

        // Save authentication data
        await _storageService.saveString('auth_token', _token!);
        await _storageService.saveString('user_data', _currentUser!.toJson());

        return LoginResult(success: true, user: _currentUser);
      } else {
        return LoginResult(success: false, error: response.message);
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
      final response = await _apiService.post('/api/auth/register', {
        'username': username,
        'email': email,
        'password': password,
        'fullName': fullName,
        'firstName': firstName,
        'lastName': lastName,
        'gender': gender,
        'phoneNumber': phoneNumber,
      });

      if (response.success) {
        final data = response.data;
        final user = User.fromMap(data['user'] ?? data);

        return RegisterResult(success: true, user: user);
      } else {
        return RegisterResult(success: false, error: response.message);
      }
    } catch (e) {
      return RegisterResult(success: false, error: e.toString());
    }
  }

  Future<void> logout() async {
    try {
      if (_token != null) {
        await _apiService.post('/api/auth/logout', {});
      }
    } catch (e) {
      print('Error during logout: $e');
    } finally {
      _token = null;
      _currentUser = null;
      await _storageService.remove('auth_token');
      await _storageService.remove('user_data');
    }
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = await _storageService.getString('refresh_token');
      if (refreshToken == null) return false;

      final response = await _apiService.post('/api/auth/refresh', {
        'refreshToken': refreshToken,
      });

      if (response.success) {
        final data = response.data;
        _token = data['accessToken'] ?? data['token'];
        await _storageService.saveString('auth_token', _token!);
        return true;
      }
      return false;
    } catch (e) {
      print('Error refreshing token: $e');
      return false;
    }
  }

  Future<bool> validateToken() async {
    try {
      if (_token == null) return false;

      final response = await _apiService.get('/api/auth/validate');
      return response.success;
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
