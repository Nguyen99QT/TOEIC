import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

import '../models/toeic_models.dart';
import '../models/toeic_study_models.dart' as study;

class ApiService {
  // Base URL configuration for different environments
  static const String _localhost =
      'http://10.0.2.2:8080/api'; // Android emulator
  static const String _iOSLocalhost =
      'http://localhost:8080/api'; // iOS simulator
  static const String _productionUrl =
      'https://your-production-domain.com/api'; // Production

  // Use the correct base URL based on platform
  static String get baseUrl {
    if (kReleaseMode) {
      return _productionUrl;
    } else {
      if (Platform.isAndroid) {
        return _localhost;
      } else if (Platform.isIOS) {
        return _iOSLocalhost;
      } else {
        return _localhost;
      }
    }
  }

  final FlutterSecureStorage secureStorage = FlutterSecureStorage();

  // Debug logs
  bool _debugMode = true;

  void _logDebug(String message) {
    if (_debugMode) {
      debugPrint('📡 API: $message');
    }
  }

  // Headers with authentication
  Future<Map<String, String>> getHeaders({bool requireAuth = false}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requireAuth) {
      final token = await secureStorage.read(key: 'token');
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
        _logDebug('Adding auth token to request');
      } else {
        _logDebug('No auth token available');
      }
    }

    return headers;
  }

  // Generic request method with error handling and logging
  Future<dynamic> _makeRequest(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? body,
    Map<String, String>? queryParams,
    bool requireAuth = false,
    bool retryOnUnauthorized = true,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final uriWithParams =
          queryParams != null ? uri.replace(queryParameters: queryParams) : uri;

      final headers = await getHeaders(requireAuth: requireAuth);

      _logDebug('${method.toUpperCase()} $uriWithParams');
      if (body != null) {
        _logDebug('Request body: ${jsonEncode(body)}');
      }

      late http.Response response;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await http.get(uriWithParams, headers: headers);
          break;
        case 'POST':
          response = await http.post(
            uriWithParams,
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          );
          break;
        case 'PUT':
          response = await http.put(
            uriWithParams,
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          );
          break;
        case 'DELETE':
          response = await http.delete(uriWithParams, headers: headers);
          break;
        default:
          throw Exception('Unsupported HTTP method: $method');
      }

      _logDebug('Response status: ${response.statusCode}');

      if (response.body.isNotEmpty) {
        _logDebug(
          'Response body: ${response.body.substring(0, response.body.length > 500 ? 500 : response.body.length)}${response.body.length > 500 ? "..." : ""}',
        );
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.body.isEmpty) return null;
        return jsonDecode(response.body);
      } else if (response.statusCode == 401 &&
          requireAuth &&
          retryOnUnauthorized) {
        // Token may have expired, try to refresh
        _logDebug('Unauthorized error - attempting token refresh');
        final refreshed = await refreshToken();
        if (refreshed) {
          _logDebug('Token refresh successful - retrying request');
          // Retry with new token
          return _makeRequest(
            endpoint,
            method: method,
            body: body,
            queryParams: queryParams,
            requireAuth: requireAuth,
            retryOnUnauthorized: false, // Prevent infinite loop
          );
        } else {
          _logDebug('Token refresh failed');
          throw UnauthorizedException(
            'Authentication failed: Token refresh unsuccessful',
          );
        }
      } else {
        String errorMessage = 'HTTP Error ${response.statusCode}';
        try {
          final errorData = jsonDecode(response.body);
          if (errorData['message'] != null) {
            errorMessage = errorData['message'];
          } else if (errorData['error'] != null) {
            errorMessage = errorData['error'];
          }
        } catch (e) {
          // Ignore JSON parse errors in error handling
        }

        _logDebug('API Error: $errorMessage');

        switch (response.statusCode) {
          case 400:
            throw BadRequestException(errorMessage);
          case 401:
            throw UnauthorizedException(errorMessage);
          case 403:
            throw ForbiddenException(errorMessage);
          case 404:
            throw NotFoundException(errorMessage);
          case 500:
            throw ServerException(errorMessage);
          default:
            throw ApiException('$errorMessage (${response.statusCode})');
        }
      }
    } on SocketException {
      _logDebug('Network error: No internet connection');
      throw NetworkException('No internet connection');
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      _logDebug('Unexpected error: $e');
      throw ApiException('Network error: $e');
    }
  }

  // Authentication API methods
  Future<Map<String, dynamic>> login(String email, String password) async {
    final data = await _makeRequest(
      '/auth/login',
      method: 'POST',
      body: {'email': email, 'password': password},
    );

    // Store tokens securely
    if (data['token'] != null) {
      await secureStorage.write(key: 'token', value: data['token']);
      _logDebug('JWT token stored securely');
    }

    if (data['refreshToken'] != null) {
      await secureStorage.write(
        key: 'refreshToken',
        value: data['refreshToken'],
      );
      _logDebug('Refresh token stored securely');
    }

    return {'user': User.fromJson(data['user']), 'token': data['token']};
  }

  Future<Map<String, dynamic>> register(
    String name,
    String email,
    String password,
  ) async {
    final data = await _makeRequest(
      '/auth/register',
      method: 'POST',
      body: {'name': name, 'email': email, 'password': password},
    );

    // Store tokens securely if registration also returns tokens
    if (data['token'] != null) {
      await secureStorage.write(key: 'token', value: data['token']);
      _logDebug('JWT token stored securely');
    }

    if (data['refreshToken'] != null) {
      await secureStorage.write(
        key: 'refreshToken',
        value: data['refreshToken'],
      );
      _logDebug('Refresh token stored securely');
    }

    return {'user': User.fromJson(data['user']), 'token': data['token']};
  }

  Future<bool> logout() async {
    try {
      final token = await secureStorage.read(key: 'token');
      if (token == null) {
        _logDebug('Already logged out (no token)');
        return true;
      }

      await _makeRequest('/auth/logout', method: 'POST', requireAuth: true);
      _logDebug('Logout successful - server side');

      // Clear stored tokens
      await secureStorage.delete(key: 'token');
      await secureStorage.delete(key: 'refreshToken');
      _logDebug('Tokens cleared from secure storage');

      return true;
    } catch (e) {
      _logDebug('Logout error: $e - clearing tokens anyway');
      // Clear tokens anyway on error
      await secureStorage.delete(key: 'token');
      await secureStorage.delete(key: 'refreshToken');
      return false;
    }
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = await secureStorage.read(key: 'refreshToken');
      if (refreshToken == null) {
        _logDebug('No refresh token available');
        return false;
      }

      _logDebug('Attempting to refresh token');
      final data = await _makeRequest(
        '/auth/refresh',
        method: 'POST',
        body: {'refreshToken': refreshToken},
      );

      if (data != null && data['token'] != null) {
        await secureStorage.write(key: 'token', value: data['token']);
        _logDebug('New JWT token stored');

        if (data['refreshToken'] != null) {
          await secureStorage.write(
            key: 'refreshToken',
            value: data['refreshToken'],
          );
          _logDebug('New refresh token stored');
        }

        return true;
      }

      _logDebug('Token refresh failed - no token in response');
      return false;
    } catch (e) {
      _logDebug('Token refresh error: $e');
      return false;
    }
  }

  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    try {
      final token = await secureStorage.read(key: 'token');
      if (token == null) {
        return false;
      }

      // Validate token with server
      final result = await _makeRequest(
        '/auth/validate',
        requireAuth: true,
        retryOnUnauthorized: false, // Don't try to refresh on validate
      );

      return result != null && result['valid'] == true;
    } catch (e) {
      _logDebug('Authentication check error: $e');
      return false;
    }
  }

  // User API methods
  Future<List<User>> getAllUsers() async {
    final data = await _makeRequest('/users', requireAuth: true);
    return (data as List).map((json) => User.fromJson(json)).toList();
  }

  Future<User> getUserById(int id) async {
    final data = await _makeRequest('/users/$id', requireAuth: true);
    return User.fromJson(data);
  }

  Future<User> getUserByUsername(String username) async {
    final data = await _makeRequest(
      '/users/username/$username',
      requireAuth: true,
    );
    return User.fromJson(data);
  }

  Future<User> createUser(Map<String, dynamic> userData) async {
    final data = await _makeRequest('/users', method: 'POST', body: userData);
    return User.fromJson(data);
  }

  Future<User> updateUser(int id, Map<String, dynamic> userData) async {
    final data = await _makeRequest(
      '/users/$id',
      method: 'PUT',
      body: userData,
      requireAuth: true,
    );
    return User.fromJson(data);
  }

  // Get the current user profile
  Future<User> getCurrentUser() async {
    final data = await _makeRequest('/users/me', requireAuth: true);
    return User.fromJson(data);
  }

  // Lesson API methods
  Future<List<Lesson>> getAllLessons({bool requireAuth = true}) async {
    final data = await _makeRequest('/lessons', requireAuth: requireAuth);
    return (data as List).map((json) => Lesson.fromJson(json)).toList();
  }

  Future<List<Lesson>> getFreeLessons() async {
    final data = await _makeRequest('/lessons/free');
    return (data as List).map((json) => Lesson.fromJson(json)).toList();
  }

  Future<Lesson> getLessonById(int id, {bool requireAuth = true}) async {
    final data = await _makeRequest('/lessons/$id', requireAuth: requireAuth);
    return Lesson.fromJson(data);
  }

  // Flashcard API methods
  Future<List<FlashcardSet>> getAllFlashcardSets({
    bool requireAuth = true,
  }) async {
    final data = await _makeRequest(
      '/flashcard-sets',
      requireAuth: requireAuth,
    );
    return (data as List).map((json) => FlashcardSet.fromJson(json)).toList();
  }

  Future<List<FlashcardSet>> getPublicFlashcardSets() async {
    final data = await _makeRequest('/flashcard-sets/public');
    return (data as List).map((json) => FlashcardSet.fromJson(json)).toList();
  }

  Future<FlashcardSet> getFlashcardSetById(
    int id, {
    bool requireAuth = true,
  }) async {
    final data = await _makeRequest(
      '/flashcard-sets/$id',
      requireAuth: requireAuth,
    );
    return FlashcardSet.fromJson(data);
  }

  Future<List<FlashcardSet>> searchFlashcardSets(String query) async {
    final data = await _makeRequest(
      '/flashcard-sets/search',
      queryParams: {'query': query},
    );
    return (data as List).map((json) => FlashcardSet.fromJson(json)).toList();
  }

  Future<List<Flashcard>> getFlashcardsForSet(int setId) async {
    final data = await _makeRequest('/flashcards/set/$setId');
    return (data as List).map((json) => Flashcard.fromJson(json)).toList();
  }

  // TOEIC Study API methods
  Future<List<study.Lesson>> getLessons({
    String? level,
    bool? isPremium,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (level != null) {
        queryParams['level'] = level;
      }
      if (isPremium != null) {
        queryParams['isPremium'] = isPremium.toString();
      }

      final data = await _makeRequest(
        '/lessons',
        queryParams: queryParams,
        requireAuth: true,
      );

      if (data == null) return [];

      return (data as List).map((item) => study.Lesson.fromJson(item)).toList();
    } catch (e) {
      _logDebug('Error fetching lessons: $e');
      rethrow;
    }
  }

  Future<List<study.Exercise>> getExercisesByLessonId(int lessonId) async {
    try {
      final data = await _makeRequest(
        '/lessons/$lessonId/exercises',
        requireAuth: true,
      );

      if (data == null) return [];

      return (data as List)
          .map((item) => study.Exercise.fromJson(item))
          .toList();
    } catch (e) {
      _logDebug('Error fetching exercises for lesson $lessonId: $e');
      rethrow;
    }
  }

  Future<List<study.Question>> getQuestionsByExerciseId(int exerciseId) async {
    try {
      final data = await _makeRequest(
        '/exercises/$exerciseId/questions',
        requireAuth: true,
      );

      if (data == null) return [];

      return (data as List)
          .map((item) => study.Question.fromJson(item))
          .toList();
    } catch (e) {
      _logDebug('Error fetching questions for exercise $exerciseId: $e');
      rethrow;
    }
  }

  Future<bool> submitExerciseResult({
    required int exerciseId,
    required int score,
    required int totalQuestions,
    required Map<int, study.Answer> answers,
  }) async {
    try {
      final Map<String, dynamic> resultData = {
        'exerciseId': exerciseId,
        'score': score,
        'totalQuestions': totalQuestions,
        'answers':
            answers.entries
                .map(
                  (entry) => {
                    'questionId': entry.key,
                    'answerId': entry.value.id,
                    'isCorrect': entry.value.isCorrect,
                  },
                )
                .toList(),
        'completedAt': DateTime.now().toIso8601String(),
      };

      final data = await _makeRequest(
        '/exercise-results',
        method: 'POST',
        body: resultData,
        requireAuth: true,
      );

      return data != null;
    } catch (e) {
      _logDebug('Error submitting exercise result: $e');
      rethrow;
    }
  }

  // Constructor with debug mode parameter
  ApiService({bool debugMode = true}) {
    _debugMode = debugMode;
    _logDebug(
      'Initializing API Service for ${kReleaseMode ? 'PRODUCTION' : 'DEVELOPMENT'}',
    );
    _logDebug('Base URL: $baseUrl');
  }
}

// Custom exceptions for better error handling
class ApiException implements Exception {
  final String message;
  ApiException(this.message);

  @override
  String toString() => message;
}

class NetworkException extends ApiException {
  NetworkException(super.message);
}

class UnauthorizedException extends ApiException {
  UnauthorizedException(super.message);
}

class BadRequestException extends ApiException {
  BadRequestException(super.message);
}

class NotFoundException extends ApiException {
  NotFoundException(super.message);
}

class ForbiddenException extends ApiException {
  ForbiddenException(super.message);
}

class ServerException extends ApiException {
  ServerException(super.message);
}
