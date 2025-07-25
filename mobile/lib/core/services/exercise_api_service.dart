import 'dart:io';
import 'package:dio/dio.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/core/services/api_service.dart';

/// Service xử lý API calls cho Exercise CRUD
class ExerciseApiService {
  static const String _baseEndpoint = '/api/exercises-crud';
  final Dio _dio = ApiService.dio;

  /// Lấy danh sách exercises với pagination và filter
  Future<ExerciseResponse> getExercises({
    int page = 0,
    int size = 10,
    String? search,
    String? difficulty,
    String? category,
    String? sortBy,
    String? sortDir,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'size': size,
      };

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (difficulty != null && difficulty.isNotEmpty) {
        queryParams['difficulty'] = difficulty;
      }
      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }
      if (sortBy != null && sortBy.isNotEmpty) {
        queryParams['sortBy'] = sortBy;
      }
      if (sortDir != null && sortDir.isNotEmpty) {
        queryParams['sortDir'] = sortDir;
      }

      final response = await _dio.get(
        _baseEndpoint,
        queryParameters: queryParams,
      );

      return ExerciseResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
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
    required String difficulty,
    required String category,
    required int timeLimit,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final formData = FormData.fromMap({
        'title': title,
        'description': description,
        'difficulty': difficulty,
        'category': category,
        'timeLimit': timeLimit,
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
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Cập nhật exercise
  Future<ExerciseResponse> updateExercise({
    required String id,
    required String title,
    required String description,
    required String difficulty,
    required String category,
    required int timeLimit,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final formData = FormData.fromMap({
        'title': title,
        'description': description,
        'difficulty': difficulty,
        'category': category,
        'timeLimit': timeLimit,
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
