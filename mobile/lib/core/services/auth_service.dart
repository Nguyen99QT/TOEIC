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
        // Handle specific error messages from backend
        String errorMessage = response.message.isNotEmpty ? response.message : 'Đăng nhập thất bại';
        if (errorMessage.toLowerCase().contains('invalid credentials') || 
            errorMessage.toLowerCase().contains('unauthorized')) {
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else if (errorMessage.toLowerCase().contains('user not found')) {
          errorMessage = 'Tài khoản không tồn tại';
        } else if (errorMessage.toLowerCase().contains('password')) {
          errorMessage = 'Mật khẩu không chính xác';
        } else if (errorMessage.toLowerCase().contains('disabled') || 
                   errorMessage.toLowerCase().contains('blocked')) {
          errorMessage = 'Tài khoản đã bị khóa';
        }
        return LoginResult(success: false, error: errorMessage);
      }
    } catch (e) {
      String errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại';
      if (e.toString().contains('Connection refused') || 
          e.toString().contains('No route to host')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau';
      } else if (e.toString().contains('timeout')) {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại';
      } else if (e.toString().contains('SocketException')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet';
      }
      return LoginResult(success: false, error: errorMessage);
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
        // Handle specific error messages from backend
        String errorMessage = response.message.isNotEmpty ? response.message : 'Đăng ký thất bại';
        if (errorMessage.toLowerCase().contains('username already exists') || 
            errorMessage.toLowerCase().contains('username') && errorMessage.toLowerCase().contains('taken')) {
          errorMessage = 'Tên đăng nhập đã tồn tại';
        } else if (errorMessage.toLowerCase().contains('email already exists') || 
                   errorMessage.toLowerCase().contains('email') && errorMessage.toLowerCase().contains('taken')) {
          errorMessage = 'Email đã được sử dụng';
        } else if (errorMessage.toLowerCase().contains('password') && errorMessage.toLowerCase().contains('weak')) {
          errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn';
        } else if (errorMessage.toLowerCase().contains('validation')) {
          errorMessage = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại';
        }
        return RegisterResult(success: false, error: errorMessage);
      }
    } catch (e) {
      String errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại';
      if (e.toString().contains('Connection refused') || 
          e.toString().contains('No route to host')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau';
      } else if (e.toString().contains('timeout')) {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại';
      } else if (e.toString().contains('SocketException')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet';
      }
      return RegisterResult(success: false, error: errorMessage);
    }
  }

  Future<void> logout() async {
    try {
      if (_token != null) {
        await _apiService.post('/api/auth/logout', {});
      }
    } catch (e) {
      // Error during logout: $e (replaced print for production)
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
      // Error refreshing token: $e (replaced print for production)
      return false;
    }
  }

  Future<bool> validateToken() async {
    try {
      if (_token == null) return false;

      final response = await _apiService.get('/api/auth/validate');
      return response.success;
    } catch (e) {
      // Error validating token: $e (replaced print for production)
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
