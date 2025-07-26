import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';

/// Service xử lý API calls cho Exercise CRUD
class ExerciseApiService {
  static const String _baseEndpoint = '/api/exercises-crud';

  // Create Dio instance directly
  static final Dio _dio = Dio();

  /// Provider cho ExerciseApiService
  static final exerciseApiServiceProvider = Provider<ExerciseApiService>((ref) {
    return ExerciseApiService();
  });

  /// Lấy danh sách exercises với phân trang
  Future<ExerciseResponse> getExercises({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _dio.get(
        _baseEndpoint,
        queryParameters: {
          'page': page,
          'limit': limit,
        },
      );
      return ExerciseResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    } catch (e) {
      print('Error fetching exercises: $e');
      throw Exception('Failed to fetch exercises: $e');
    }
  }

  /// Lấy exercise theo ID
  Future<ExerciseResponse> getExerciseById(String id) async {
    try {
      final response = await _dio.get('$_baseEndpoint/$id');
      return ExerciseResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Tạo exercise mới với file upload
  Future<ExerciseResponse> createExercise({
    required String title,
    required String description,
    required String question,
    required String type,
    required String difficulty,
    required String level,
    required List<String> options,
    required String correctAnswer,
    String? explanation,
    int? timeLimit,
    required int points,
    int orderIndex = 0,
    String? lessonId,
    bool isActive = true,
    bool isPremium = false,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      // Platform-specific handling
      if (kIsWeb) {
        // Web: Use JSON
        final data = {
          'title': title,
          'description': description,
          'question': question,
          'type': type,
          'difficulty': difficulty,
          'level': level,
          'options': jsonEncode(options),
          'correct_answer': correctAnswer,
          if (explanation != null) 'explanation': explanation,
          if (timeLimit != null) 'time_limit': timeLimit,
          'points': points,
          'order_index': orderIndex,
          if (lessonId != null) 'lesson_id': lessonId,
          'is_active': isActive,
          'is_premium': isPremium,
        };

        final response = await _dio.post(
          _baseEndpoint,
          data: data,
          options: Options(
            contentType: 'application/json',
          ),
        );

        return ExerciseResponse.fromJson(response.data);
      } else {
        // Mobile: Use FormData
        final formData = FormData.fromMap({
          'title': title,
          'description': description,
          'question': question,
          'type': type,
          'difficulty': difficulty,
          'level': level,
          'options': jsonEncode(options),
          'correct_answer': correctAnswer,
          if (explanation != null) 'explanation': explanation,
          if (timeLimit != null) 'time_limit': timeLimit,
          'points': points,
          'order_index': orderIndex,
          if (lessonId != null) 'lesson_id': lessonId,
          'is_active': isActive,
          'is_premium': isPremium,
        });

        if (imageFile != null) {
          formData.files.add(MapEntry(
            'imageFile',
            await MultipartFile.fromFile(
              imageFile.path,
              filename: imageFile.path.split('/').last,
            ),
          ));
        }

        if (audioFile != null) {
          formData.files.add(MapEntry(
            'audioFile',
            await MultipartFile.fromFile(
              audioFile.path,
              filename: audioFile.path.split('/').last,
            ),
          ));
        }

        final response = await _dio.post(
          _baseEndpoint,
          data: formData,
          options: Options(
            contentType: 'multipart/form-data',
          ),
        );

        return ExerciseResponse.fromJson(response.data);
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Cập nhật exercise
  Future<ExerciseResponse> updateExercise({
    required String id,
    required String title,
    required String description,
    required String question,
    required String type,
    required String difficulty,
    required String level,
    required List<String> options,
    required String correctAnswer,
    String? explanation,
    int? timeLimit,
    required int points,
    int orderIndex = 0,
    String? lessonId,
    bool isActive = true,
    bool isPremium = false,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      // Platform-specific handling
      if (kIsWeb) {
        // Web: Use JSON
        final data = {
          'title': title,
          'description': description,
          'question': question,
          'type': type,
          'difficulty': difficulty,
          'level': level,
          'options': jsonEncode(options),
          'correct_answer': correctAnswer,
          if (explanation != null) 'explanation': explanation,
          if (timeLimit != null) 'time_limit': timeLimit,
          'points': points,
          'order_index': orderIndex,
          if (lessonId != null) 'lesson_id': lessonId,
          'is_active': isActive,
          'is_premium': isPremium,
        };

        final response = await _dio.put(
          '$_baseEndpoint/$id',
          data: data,
          options: Options(
            contentType: 'application/json',
          ),
        );

        return ExerciseResponse.fromJson(response.data);
      } else {
        // Mobile: Use FormData
        final formData = FormData.fromMap({
          'title': title,
          'description': description,
          'question': question,
          'type': type,
          'difficulty': difficulty,
          'level': level,
          'options': jsonEncode(options),
          'correct_answer': correctAnswer,
          if (explanation != null) 'explanation': explanation,
          if (timeLimit != null) 'time_limit': timeLimit,
          'points': points,
          'order_index': orderIndex,
          if (lessonId != null) 'lesson_id': lessonId,
          'is_active': isActive,
          'is_premium': isPremium,
        });

        if (imageFile != null) {
          formData.files.add(MapEntry(
            'imageFile',
            await MultipartFile.fromFile(
              imageFile.path,
              filename: imageFile.path.split('/').last,
            ),
          ));
        }

        if (audioFile != null) {
          formData.files.add(MapEntry(
            'audioFile',
            await MultipartFile.fromFile(
              audioFile.path,
              filename: audioFile.path.split('/').last,
            ),
          ));
        }

        final response = await _dio.put(
          '$_baseEndpoint/$id',
          data: formData,
          options: Options(
            contentType: 'multipart/form-data',
          ),
        );

        return ExerciseResponse.fromJson(response.data);
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Xóa exercise
  Future<ExerciseResponse> deleteExercise(String id) async {
    try {
      final response = await _dio.delete('$_baseEndpoint/$id');
      return ExerciseResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy exercises theo lesson ID
  Future<List<Exercise>> getExercisesByLesson(String lessonId) async {
    try {
      final response = await _dio.get('$_baseEndpoint/lesson/$lessonId');
      final List<dynamic> exercisesJson = response.data['data'];
      return exercisesJson.map((json) => Exercise.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy exercises theo type
  Future<List<Exercise>> getExercisesByType(String type) async {
    try {
      final response = await _dio.get('$_baseEndpoint/type/$type');
      final List<dynamic> exercisesJson = response.data['data'];
      return exercisesJson.map((json) => Exercise.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy exercises theo difficulty
  Future<List<Exercise>> getExercisesByDifficulty(String difficulty) async {
    try {
      final response = await _dio.get('$_baseEndpoint/difficulty/$difficulty');
      final List<dynamic> exercisesJson = response.data['data'];
      return exercisesJson.map((json) => Exercise.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy exercises theo level
  Future<List<Exercise>> getExercisesByLevel(String level) async {
    try {
      final response = await _dio.get('$_baseEndpoint/level/$level');
      final List<dynamic> exercisesJson = response.data['data'];
      return exercisesJson.map((json) => Exercise.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy exercises với phân trang và filter
  Future<ExerciseResponse> getExercisesWithFilter({
    int page = 1,
    int limit = 10,
    String? type,
    String? difficulty,
    String? level,
    String? lessonId,
    bool? isActive,
    bool? isPremium,
    String? sortBy = 'created_at',
    String? sortOrder = 'desc',
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
        if (type != null) 'type': type,
        if (difficulty != null) 'difficulty': difficulty,
        if (level != null) 'level': level,
        if (lessonId != null) 'lesson_id': lessonId,
        if (isActive != null) 'is_active': isActive,
        if (isPremium != null) 'is_premium': isPremium,
        'sort_by': sortBy,
        'sort_order': sortOrder,
      };

      final response = await _dio.get(
        _baseEndpoint,
        queryParameters: queryParams,
      );

      return ExerciseResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Tìm kiếm exercises
  Future<List<Exercise>> searchExercises(String query) async {
    try {
      final response = await _dio.get(
        '$_baseEndpoint/search',
        queryParameters: {'q': query},
      );
      final List<dynamic> exercisesJson = response.data['data'];
      return exercisesJson.map((json) => Exercise.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Submit exercise answer
  Future<Map<String, dynamic>> submitAnswer({
    required String exerciseId,
    required String userAnswer,
    String? userId,
  }) async {
    try {
      final data = {
        'exercise_id': exerciseId,
        'user_answer': userAnswer,
        if (userId != null) 'user_id': userId,
      };

      final response = await _dio.post(
        '$_baseEndpoint/$exerciseId/submit',
        data: data,
      );

      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy thống kê exercise progress
  Future<Map<String, dynamic>> getExerciseProgress(String userId) async {
    try {
      final response = await _dio.get('$_baseEndpoint/progress/$userId');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Xử lý lỗi từ API
  String _handleError(DioException e) {
    if (e.response != null) {
      final data = e.response!.data;
      if (data is Map<String, dynamic> && data.containsKey('message')) {
        return data['message'];
      }
      return 'Server error: ${e.response!.statusCode}';
    }

    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return 'Connection timeout. Please check your internet connection.';
    }

    if (e.type == DioExceptionType.connectionError) {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    return 'An unexpected error occurred: ${e.message}';
  }
}
