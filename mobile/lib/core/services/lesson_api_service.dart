import 'dart:io';
import 'package:dio/dio.dart';
import 'package:toeic_mobile/core/models/lesson_model.dart';
import 'package:toeic_mobile/core/services/dio_service.dart';

class LessonApiService {
  static final Dio _dio = DioApiService.dio;

  // Get all lessons with pagination and filters
  Future<LessonResponse> getLessons({
    int page = 0,
    int size = 10,
    String? search,
    String? category,
    String? difficulty,
    bool? isPublic,
  }) async {
    try {
      print('Fetching lessons: page=$page, size=$size, search=$search');

      final queryParams = <String, dynamic>{
        'page': page,
        'size': size,
      };

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }
      if (difficulty != null && difficulty.isNotEmpty) {
        queryParams['difficulty'] = difficulty;
      }
      if (isPublic != null) {
        queryParams['isPublic'] = isPublic;
      }

      final response =
          await _dio.get('/api/lessons', queryParameters: queryParams);
      print('Lessons response: ${response.data}');

      return LessonResponse.fromJson(response.data);
    } catch (e) {
      print('Error fetching lessons: $e');
      throw Exception('Failed to fetch lessons: $e');
    }
  }

  // Get lesson by ID
  Future<Lesson> getLessonById(String id) async {
    try {
      print('Fetching lesson by ID: $id');

      final response = await _dio.get('/api/lessons/$id');
      print('Lesson detail response: ${response.data}');

      return Lesson.fromJson(response.data);
    } catch (e) {
      print('Error fetching lesson by ID: $e');
      throw Exception('Failed to fetch lesson: $e');
    }
  }

  // Create new lesson
  Future<Lesson> createLesson({
    required String title,
    required String description,
    required String content,
    required String difficulty,
    required String category,
    required int estimatedTime,
    File? imageFile,
    File? audioFile,
    bool isPublic = true,
  }) async {
    try {
      print('Creating lesson: $title');

      final formData = FormData();

      // Add text fields
      formData.fields.addAll([
        MapEntry('title', title),
        MapEntry('description', description),
        MapEntry('content', content),
        MapEntry('difficulty', difficulty),
        MapEntry('category', category),
        MapEntry('estimatedTime', estimatedTime.toString()),
        MapEntry('isPublic', isPublic.toString()),
      ]);

      // Add image file if provided
      if (imageFile != null) {
        String fileName = imageFile.path.split('/').last;
        formData.files.add(MapEntry(
          'imageFile',
          await MultipartFile.fromFile(imageFile.path, filename: fileName),
        ));
      }

      // Add audio file if provided
      if (audioFile != null) {
        String fileName = audioFile.path.split('/').last;
        formData.files.add(MapEntry(
          'audioFile',
          await MultipartFile.fromFile(audioFile.path, filename: fileName),
        ));
      }

      final response = await _dio.post('/api/lessons', data: formData);
      print('Create lesson response: ${response.data}');

      return Lesson.fromJson(response.data);
    } catch (e) {
      print('Error creating lesson: $e');
      throw Exception('Failed to create lesson: $e');
    }
  }

  // Update existing lesson
  Future<Lesson> updateLesson({
    required String id,
    required String title,
    required String description,
    required String content,
    required String difficulty,
    required String category,
    required int estimatedTime,
    File? imageFile,
    File? audioFile,
    bool isPublic = true,
  }) async {
    try {
      print('Updating lesson: $id');

      final formData = FormData();

      // Add text fields
      formData.fields.addAll([
        MapEntry('title', title),
        MapEntry('description', description),
        MapEntry('content', content),
        MapEntry('difficulty', difficulty),
        MapEntry('category', category),
        MapEntry('estimatedTime', estimatedTime.toString()),
        MapEntry('isPublic', isPublic.toString()),
      ]);

      // Add image file if provided
      if (imageFile != null) {
        String fileName = imageFile.path.split('/').last;
        formData.files.add(MapEntry(
          'imageFile',
          await MultipartFile.fromFile(imageFile.path, filename: fileName),
        ));
      }

      // Add audio file if provided
      if (audioFile != null) {
        String fileName = audioFile.path.split('/').last;
        formData.files.add(MapEntry(
          'audioFile',
          await MultipartFile.fromFile(audioFile.path, filename: fileName),
        ));
      }

      final response = await _dio.put('/api/lessons/$id', data: formData);
      print('Update lesson response: ${response.data}');

      return Lesson.fromJson(response.data);
    } catch (e) {
      print('Error updating lesson: $e');
      throw Exception('Failed to update lesson: $e');
    }
  }

  // Delete lesson
  Future<void> deleteLesson(String id) async {
    try {
      print('Deleting lesson: $id');

      await _dio.delete('/api/lessons/$id');
      print('Delete lesson successful');
    } catch (e) {
      print('Error deleting lesson: $e');
      throw Exception('Failed to delete lesson: $e');
    }
  }

  // Get lessons by category
  Future<LessonResponse> getLessonsByCategory(
    String category, {
    int page = 0,
    int size = 10,
  }) async {
    return getLessons(
      page: page,
      size: size,
      category: category,
    );
  }

  // Get lessons by difficulty
  Future<LessonResponse> getLessonsByDifficulty(
    String difficulty, {
    int page = 0,
    int size = 10,
  }) async {
    return getLessons(
      page: page,
      size: size,
      difficulty: difficulty,
    );
  }

  // Search lessons
  Future<LessonResponse> searchLessons(
    String query, {
    int page = 0,
    int size = 10,
  }) async {
    return getLessons(
      page: page,
      size: size,
      search: query,
    );
  }
}
