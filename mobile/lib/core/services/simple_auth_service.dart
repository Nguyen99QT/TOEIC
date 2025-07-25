import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'dart:convert';

class User {
  final String id;
  final String username;
  final String email;
  final String? fullName;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.fullName,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id']?.toString() ?? '',
      username: map['username'] ?? '',
      email: map['email'] ?? '',
      fullName: map['fullName'],
    );
  }

  factory User.fromJson(String json) {
    return User.fromMap(jsonDecode(json));
  }

  String toJson() {
    return jsonEncode({
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
    });
  }
}

class AuthService extends ChangeNotifier {
  final SharedPreferences _prefs;
  final Dio _dio = Dio();

  // Backend URL - adjust as needed
  static const String baseUrl = 'http://localhost:8080/api';

  User? _currentUser;
  String? _token;
  bool _isLoading = false;

  AuthService(this._prefs) {
    _loadUserFromStorage();
    _setupDioInterceptors();
  }

  // Getters
  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _currentUser != null && _token != null;

  void _setupDioInterceptors() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        handler.next(options);
      },
    ));
  }

  Future<void> _loadUserFromStorage() async {
    final token = _prefs.getString('auth_token');
    final userJson = _prefs.getString('current_user');

    if (token != null && userJson != null) {
      _token = token;
      try {
        _currentUser = User.fromJson(userJson);
        notifyListeners();
      } catch (e) {
        debugPrint('Error loading user from storage: $e');
        await _clearStorage();
      }
    }
  }

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _dio.post(
        '$baseUrl/auth/login',
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        _token = data['accessToken'];
        _currentUser = User.fromMap(data);

        // Save to storage
        await _prefs.setString('auth_token', _token!);
        await _prefs.setString('current_user', _currentUser!.toJson());

        _isLoading = false;
        notifyListeners();
        return true;
      }
    } on DioException catch (e) {
      debugPrint('Login error: ${e.message}');
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      debugPrint('Unexpected login error: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _clearStorage();
    _currentUser = null;
    _token = null;
    notifyListeners();
  }

  Future<void> _clearStorage() async {
    await _prefs.remove('auth_token');
    await _prefs.remove('current_user');
  }
}
