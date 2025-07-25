import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/lesson_model.dart';
import 'package:toeic_mobile/core/services/lesson_api_service.dart';

// Lesson API Service Provider
final lessonApiServiceProvider = Provider<LessonApiService>((ref) {
  return LessonApiService();
});

// Lessons List Provider
class LessonsNotifier extends AsyncNotifier<LessonResponse> {
  int _currentPage = 0;
  String? _currentSearch;
  String? _currentCategory;
  String? _currentDifficulty;
  bool _hasMore = true;
  List<Lesson> _allLessons = [];

  @override
  Future<LessonResponse> build() async {
    return _loadLessons();
  }

  Future<LessonResponse> _loadLessons({
    int page = 0,
    String? search,
    String? category,
    String? difficulty,
    bool isRefresh = false,
  }) async {
    final apiService = ref.read(lessonApiServiceProvider);

    if (isRefresh) {
      _currentPage = 0;
      _allLessons.clear();
      _hasMore = true;
    }

    final response = await apiService.getLessons(
      page: page,
      search: search,
      category: category,
      difficulty: difficulty,
    );

    if (isRefresh || page == 0) {
      _allLessons = response.lessons;
    } else {
      _allLessons.addAll(response.lessons);
    }

    _hasMore = response.hasNext;
    _currentPage = page;
    _currentSearch = search;
    _currentCategory = category;
    _currentDifficulty = difficulty;

    return LessonResponse(
      lessons: _allLessons,
      totalCount: response.totalCount,
      page: response.page,
      size: response.size,
      hasNext: response.hasNext,
      hasPrevious: response.hasPrevious,
    );
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    try {
      final response = await _loadLessons(
        search: _currentSearch,
        category: _currentCategory,
        difficulty: _currentDifficulty,
        isRefresh: true,
      );
      state = AsyncData(response);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
    }
  }

  Future<void> loadMore() async {
    if (!_hasMore || state.isLoading) return;

    try {
      final response = await _loadLessons(
        page: _currentPage + 1,
        search: _currentSearch,
        category: _currentCategory,
        difficulty: _currentDifficulty,
      );
      state = AsyncData(response);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
    }
  }

  Future<void> search(String query) async {
    state = const AsyncLoading();
    try {
      final response = await _loadLessons(
        search: query.isEmpty ? null : query,
        category: _currentCategory,
        difficulty: _currentDifficulty,
        isRefresh: true,
      );
      state = AsyncData(response);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
    }
  }

  Future<void> filterByCategory(String? category) async {
    state = const AsyncLoading();
    try {
      final response = await _loadLessons(
        search: _currentSearch,
        category: category,
        difficulty: _currentDifficulty,
        isRefresh: true,
      );
      state = AsyncData(response);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
    }
  }

  Future<void> filterByDifficulty(String? difficulty) async {
    state = const AsyncLoading();
    try {
      final response = await _loadLessons(
        search: _currentSearch,
        category: _currentCategory,
        difficulty: difficulty,
        isRefresh: true,
      );
      state = AsyncData(response);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
    }
  }

  Future<Lesson?> createLesson({
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
      final apiService = ref.read(lessonApiServiceProvider);
      final lesson = await apiService.createLesson(
        title: title,
        description: description,
        content: content,
        difficulty: difficulty,
        category: category,
        estimatedTime: estimatedTime,
        imageFile: imageFile,
        audioFile: audioFile,
        isPublic: isPublic,
      );

      // Refresh the list to include the new lesson
      await refresh();

      return lesson;
    } catch (error) {
      rethrow;
    }
  }

  Future<Lesson?> updateLesson({
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
      final apiService = ref.read(lessonApiServiceProvider);
      final lesson = await apiService.updateLesson(
        id: id,
        title: title,
        description: description,
        content: content,
        difficulty: difficulty,
        category: category,
        estimatedTime: estimatedTime,
        imageFile: imageFile,
        audioFile: audioFile,
        isPublic: isPublic,
      );

      // Update the lesson in the current list
      final currentState = state.value;
      if (currentState != null) {
        final updatedLessons = currentState.lessons.map((l) {
          return l.id == id ? lesson : l;
        }).toList();

        _allLessons = updatedLessons;
        state = AsyncData(currentState.copyWith(lessons: updatedLessons));
      }

      return lesson;
    } catch (error) {
      rethrow;
    }
  }

  Future<void> deleteLesson(String id) async {
    try {
      final apiService = ref.read(lessonApiServiceProvider);
      await apiService.deleteLesson(id);

      // Remove the lesson from the current list
      final currentState = state.value;
      if (currentState != null) {
        final updatedLessons =
            currentState.lessons.where((l) => l.id != id).toList();
        _allLessons = updatedLessons;
        state = AsyncData(currentState.copyWith(
          lessons: updatedLessons,
          totalCount: currentState.totalCount - 1,
        ));
      }
    } catch (error) {
      rethrow;
    }
  }
}

// Lesson Detail Provider
class LessonDetailNotifier extends FamilyAsyncNotifier<Lesson?, String> {
  @override
  Future<Lesson?> build(String id) async {
    try {
      final apiService = LessonApiService();
      final lesson = await apiService.getLessonById(id);
      return lesson;
    } catch (error) {
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    try {
      final apiService = LessonApiService();
      final lesson = await apiService.getLessonById(arg);
      state = AsyncData(lesson);
    } catch (error, stackTrace) {
      state = AsyncError(error, stackTrace);
    }
  }
}

// Providers
final lessonsProvider =
    AsyncNotifierProvider<LessonsNotifier, LessonResponse>(() {
  return LessonsNotifier();
});

final lessonDetailProvider =
    AsyncNotifierProvider.family<LessonDetailNotifier, Lesson?, String>(() {
  return LessonDetailNotifier();
});

// Helper extension
extension LessonResponseExtension on LessonResponse {
  LessonResponse copyWith({
    List<Lesson>? lessons,
    int? totalCount,
    int? page,
    int? size,
    bool? hasNext,
    bool? hasPrevious,
  }) {
    return LessonResponse(
      lessons: lessons ?? this.lessons,
      totalCount: totalCount ?? this.totalCount,
      page: page ?? this.page,
      size: size ?? this.size,
      hasNext: hasNext ?? this.hasNext,
      hasPrevious: hasPrevious ?? this.hasPrevious,
    );
  }
}
