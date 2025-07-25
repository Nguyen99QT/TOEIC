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
    print('🔐 Initializing AuthService...');
    
    // Load saved authentication data
    _token = await _storageService.getString('auth_token');
    final userData = await _storageService.getString('user_data');

    print('🔐 Loaded token: ${_token?.substring(0, 20)}...');
    print('🔐 Loaded user data: $userData');

    if (userData != null) {
      _currentUser = User.fromJson(userData);
      print('🔐 Current user: ${_currentUser?.fullName}');
    }
    
    print('🔐 AuthService initialized - isAuthenticated: $isAuthenticated');
  }

  Future<LoginResult> login(String username, String password) async {
    try {
      print('🔐 Attempting login for user: $username');
      
      final response = await _apiService.post('/auth/login', {
        'username': username,
        'password': password,
      });

      print('🔐 Login response: ${response.success} - ${response.message}');
      print('🔐 Response data: ${response.data}');

      if (response.success) {
        final data = response.data;
        _token = data['accessToken'] ?? data['token'];
        _currentUser = User.fromMap(data['user'] ?? data);

        print('🔐 Token received: ${_token?.substring(0, 20)}...');
        print('🔐 User data: ${_currentUser?.toJson()}');

        // Save authentication data
        await _storageService.saveString('auth_token', _token!);
        await _storageService.saveString('user_data', _currentUser!.toJson());

        print('🔐 Token saved to storage');
        
        // Verify token was saved
        final savedToken = await _storageService.getString('auth_token');
        print('🔐 Token from storage: ${savedToken?.substring(0, 20)}...');

        return LoginResult(success: true, user: _currentUser);
      } else {
        return LoginResult(success: false, error: response.message);
      }
    } catch (e) {
      print('🔐 Login error: $e');
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
      final response = await _apiService.post('/auth/register', {
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
        await _apiService.post('/auth/logout', {});
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

      final response = await _apiService.post('/auth/refresh', {
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
      print('🔍 Validating token...');
      print('🔍 Current token: ${_token?.substring(0, 20)}...');
      
      if (_token == null) {
        print('🔍 No token found');
        return false;
      }

      final response = await _apiService.post('/auth/validate-token', {});
      print('🔍 Validate response: ${response.success} - ${response.message}');
      print('🔍 Response data: ${response.data}');
      
      return response.success;
    } catch (e) {
      print('🔍 Error validating token: $e');
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
