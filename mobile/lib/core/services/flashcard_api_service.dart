import 'dart:io';
import 'package:dio/dio.dart';
import 'package:toeic_mobile/core/models/flashcard_model.dart';
import 'package:toeic_mobile/core/services/api_service.dart';

/// Service xử lý API calls cho Flashcard CRUD
class FlashcardApiService {
  static const String _baseEndpoint = '/api/flashcards-crud';
  final Dio _dio = ApiService.dio;

  // ========== FLASHCARD SET OPERATIONS ==========

  /// Lấy danh sách flashcard sets
  Future<FlashcardResponse> getFlashcardSets({
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
        '$_baseEndpoint/sets',
        queryParameters: queryParams,
      );

      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy flashcard set theo ID
  Future<FlashcardResponse> getFlashcardSetById(String id) async {
    try {
      final response = await _dio.get('$_baseEndpoint/sets/$id');
      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Tạo flashcard set mới
  Future<FlashcardResponse> createFlashcardSet({
    required String title,
    required String description,
    required String category,
    required String difficulty,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final formData = FormData.fromMap({
        'title': title,
        'description': description,
        'category': category,
        'difficulty': difficulty,
      });

      if (imageFile != null) {
        formData.files.add(MapEntry(
          'image',
          await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
          ),
        ));
      }

      if (audioFile != null) {
        formData.files.add(MapEntry(
          'audio',
          await MultipartFile.fromFile(
            audioFile.path,
            filename: audioFile.path.split('/').last,
          ),
        ));
      }

      final response = await _dio.post(
        '$_baseEndpoint/sets',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );

      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Cập nhật flashcard set
  Future<FlashcardResponse> updateFlashcardSet({
    required String id,
    required String title,
    required String description,
    required String category,
    required String difficulty,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final formData = FormData.fromMap({
        'title': title,
        'description': description,
        'category': category,
        'difficulty': difficulty,
      });

      if (imageFile != null) {
        formData.files.add(MapEntry(
          'image',
          await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
          ),
        ));
      }

      if (audioFile != null) {
        formData.files.add(MapEntry(
          'audio',
          await MultipartFile.fromFile(
            audioFile.path,
            filename: audioFile.path.split('/').last,
          ),
        ));
      }

      final response = await _dio.put(
        '$_baseEndpoint/sets/$id',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );

      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Xóa flashcard set
  Future<FlashcardResponse> deleteFlashcardSet(String id) async {
    try {
      final response = await _dio.delete('$_baseEndpoint/sets/$id');
      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // ========== FLASHCARD OPERATIONS ==========

  /// Lấy flashcards trong một set
  Future<FlashcardResponse> getFlashcardsInSet({
    required String setId,
    int page = 0,
    int size = 10,
  }) async {
    try {
      final response = await _dio.get(
        '$_baseEndpoint/sets/$setId/flashcards',
        queryParameters: {
          'page': page,
          'size': size,
        },
      );

      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Lấy flashcard theo ID
  Future<FlashcardResponse> getFlashcardById(String id) async {
    try {
      final response = await _dio.get('$_baseEndpoint/flashcards/$id');
      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Tạo flashcard mới trong set
  Future<FlashcardResponse> createFlashcard({
    required String setId,
    required String front,
    required String back,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final formData = FormData.fromMap({
        'front': front,
        'back': back,
      });

      if (imageFile != null) {
        formData.files.add(MapEntry(
          'image',
          await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
          ),
        ));
      }

      if (audioFile != null) {
        formData.files.add(MapEntry(
          'audio',
          await MultipartFile.fromFile(
            audioFile.path,
            filename: audioFile.path.split('/').last,
          ),
        ));
      }

      final response = await _dio.post(
        '$_baseEndpoint/sets/$setId/flashcards',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );

      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Cập nhật flashcard
  Future<FlashcardResponse> updateFlashcard({
    required String id,
    required String front,
    required String back,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final formData = FormData.fromMap({
        'front': front,
        'back': back,
      });

      if (imageFile != null) {
        formData.files.add(MapEntry(
          'image',
          await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
          ),
        ));
      }

      if (audioFile != null) {
        formData.files.add(MapEntry(
          'audio',
          await MultipartFile.fromFile(
            audioFile.path,
            filename: audioFile.path.split('/').last,
          ),
        ));
      }

      final response = await _dio.put(
        '$_baseEndpoint/flashcards/$id',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );

      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Xóa flashcard
  Future<FlashcardResponse> deleteFlashcard(String id) async {
    try {
      final response = await _dio.delete('$_baseEndpoint/flashcards/$id');
      return FlashcardResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // ========== BULK OPERATIONS ==========

  /// Upload nhiều flashcards từ file
  Future<FlashcardResponse> uploadFlashcardsFromFile({
    required String setId,
    required File file,
  }) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          file.path,
          filename: file.path.split('/').last,
        ),
      });

      final response = await _dio.post(
        '$_baseEndpoint/sets/$setId/upload',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );

      return FlashcardResponse.fromJson(response.data);
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
