import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'package:toeic_mobile/core/services/storage_service.dart';

class ApiService {
  // Base URL - Improved network configuration
  static String get _baseUrl {
    if (kIsWeb) {
      // For Flutter Web
      return 'http://localhost:8080/api';
    } else if (Platform.isAndroid) {
      // For Android Emulator
      return 'http://10.0.2.2:8080/api';
    } else if (Platform.isIOS) {
      // For iOS Simulator
      return 'http://localhost:8080/api';
    } else {
      // Default fallback
      return 'http://localhost:8080/api';
    }
  }

  final StorageService _storageService = StorageService.instance;

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storageService.getString('auth_token');
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  Future<ApiResponse> get(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$_baseUrl$endpoint'),
        headers: headers,
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
        data: null,
      );
    }
  }

  Future<ApiResponse> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$_baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(data),
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
        data: null,
      );
    }
  }

  Future<ApiResponse> put(String endpoint, Map<String, dynamic> data) async {
    try {
      final headers = await _getHeaders();
      final response = await http.put(
        Uri.parse('$_baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(data),
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
        data: null,
      );
    }
  }

  Future<ApiResponse> delete(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final response = await http.delete(
        Uri.parse('$_baseUrl$endpoint'),
        headers: headers,
      );

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
        data: null,
      );
    }
  }

  ApiResponse _handleResponse(http.Response response) {
    try {
      final Map<String, dynamic> data = jsonDecode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse(
          success: true,
          message: data['message'] ?? 'Success',
          data: data['data'] ?? data,
        );
      } else {
        return ApiResponse(
          success: false,
          message: data['message'] ?? 'Request failed',
          data: data,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to parse response: ${e.toString()}',
        data: null,
      );
    }
  }
}

class ApiResponse {
  final bool success;
  final String message;
  final dynamic data;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
  });

  @override
  String toString() {
    return 'ApiResponse(success: $success, message: $message, data: $data)';
  }
}

// Static methods for common API operations
extension ApiServiceStatic on ApiService {
  // Auth endpoints
  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    try {
      final baseUrl = kIsWeb
          ? 'http://localhost:8080/api'
          : Platform.isAndroid
              ? 'http://10.0.2.2:8080/api'
              : 'http://localhost:8080/api';

      print('Attempting login to: $baseUrl/auth/login');

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/login'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode({
              'username': username,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 30));

      print('Login response status: ${response.statusCode}');
      print('Login response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {'success': true, 'data': data, 'message': 'Login successful'};
      } else {
        return {
          'success': false,
          'message': 'Login failed: ${response.statusCode}'
        };
      }
    } catch (e) {
      print('Login error: $e');
      return {
        'success': false,
        'message': 'An error occurred: ${e.toString()}'
      };
    }
  }

  static Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
  }) async {
    try {
      final baseUrl = kIsWeb
          ? 'http://localhost:8080/api'
          : Platform.isAndroid
              ? 'http://10.0.2.2:8080/api'
              : 'http://localhost:8080/api';

      print('Attempting register to: $baseUrl/auth/register');

      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/register'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode({
              'username': username,
              'email': email,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 30));

      print('Register response status: ${response.statusCode}');
      print('Register response body: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
          'message': 'Registration successful'
        };
      } else {
        return {
          'success': false,
          'message': 'Registration failed: ${response.statusCode}'
        };
      }
    } catch (e) {
      print('Registration error: $e');
      return {
        'success': false,
        'message': 'An error occurred: ${e.toString()}'
      };
    }
  }

  // Exercise endpoints
  static Future<Map<String, dynamic>> getExercises(String token) async {
    try {
      final baseUrl = kIsWeb
          ? 'http://localhost:8080/api'
          : Platform.isAndroid
              ? 'http://10.0.2.2:8080/api'
              : 'http://localhost:8080/api';

      print('Fetching exercises from: $baseUrl/exercises');

      final response = await http.get(
        Uri.parse('$baseUrl/exercises'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 30));

      print('Exercises response status: ${response.statusCode}');
      print('Exercises response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
          'message': 'Exercises loaded successfully'
        };
      } else {
        return {
          'success': false,
          'message': 'Failed to load exercises: ${response.statusCode}'
        };
      }
    } catch (e) {
      print('Exercises error: $e');
      return {
        'success': false,
        'message': 'An error occurred: ${e.toString()}'
      };
    }
  }

  static Future<Map<String, dynamic>> getExerciseById(
      String exerciseId, String token) async {
    try {
      final baseUrl = kIsWeb
          ? 'http://localhost:8080/api'
          : Platform.isAndroid
              ? 'http://10.0.2.2:8080/api'
              : 'http://localhost:8080/api';

      print('Fetching exercise by ID from: $baseUrl/exercises/$exerciseId');

      final response = await http.get(
        Uri.parse('$baseUrl/exercises/$exerciseId'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 30));

      print('Exercise detail response status: ${response.statusCode}');
      print('Exercise detail response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
          'message': 'Exercise loaded successfully'
        };
      } else {
        return {
          'success': false,
          'message': 'Failed to load exercise: ${response.statusCode}'
        };
      }
    } catch (e) {
      print('Exercise detail error: $e');
      return {
        'success': false,
        'message': 'An error occurred: ${e.toString()}'
      };
    }
  }

  // Error handling helper
  static String getErrorMessage(dynamic error) {
    if (error is SocketException) {
      return 'No internet connection. Please check your network.';
    } else if (error.toString().contains('TimeoutException')) {
      return 'Connection timeout. Please try again.';
    } else if (error.toString().contains('FormatException')) {
      return 'Invalid response format.';
    } else {
      return error.toString();
    }
  }
}
