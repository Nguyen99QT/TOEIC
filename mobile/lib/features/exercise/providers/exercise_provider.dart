import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/core/services/exercise_api_service.dart';

/// Provider cho ExerciseApiService
final exerciseApiServiceProvider = Provider<ExerciseApiService>((ref) {
  return ExerciseApiService();
});

/// State cho exercises list
class ExercisesState {
  final List<Exercise> exercises;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final int totalPages;
  final bool hasNextPage;

  ExercisesState({
    this.exercises = const [],
    this.isLoading = false,
    this.error,
    this.currentPage = 0,
    this.totalPages = 0,
    this.hasNextPage = false,
  });

  ExercisesState copyWith({
    List<Exercise>? exercises,
    bool? isLoading,
    String? error,
    int? currentPage,
    int? totalPages,
    bool? hasNextPage,
  }) {
    return ExercisesState(
      exercises: exercises ?? this.exercises,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasNextPage: hasNextPage ?? this.hasNextPage,
    );
  }
}

/// Notifier cho exercises list
class ExercisesNotifier extends StateNotifier<ExercisesState> {
  final ExerciseApiService _apiService;

  ExercisesNotifier(this._apiService) : super(ExercisesState());

  /// Load exercises với pagination
  Future<void> loadExercises({
    int page = 0,
    String? search,
    String? difficulty,
    String? category,
    bool refresh = false,
  }) async {
    if (refresh || page == 0) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final response = await _apiService.getExercises(
        page: page,
        search: search,
        difficulty: difficulty,
        category: category,
      );

      if (response.success && response.exercises != null) {
        final exercises = refresh || page == 0
            ? response.exercises!
            : [...state.exercises, ...response.exercises!];

        state = state.copyWith(
          exercises: exercises,
          isLoading: false,
          currentPage: response.currentPage ?? page,
          totalPages: response.totalPages ?? 0,
          hasNextPage:
              (response.currentPage ?? page) < (response.totalPages ?? 0) - 1,
          error: null,
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          error: response.message ?? 'Failed to load exercises',
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Refresh exercises
  Future<void> refresh({
    String? search,
    String? difficulty,
    String? category,
  }) async {
    await loadExercises(
      page: 0,
      search: search,
      difficulty: difficulty,
      category: category,
      refresh: true,
    );
  }

  /// Load more exercises
  Future<void> loadMore({
    String? search,
    String? difficulty,
    String? category,
  }) async {
    if (state.hasNextPage && !state.isLoading) {
      await loadExercises(
        page: state.currentPage + 1,
        search: search,
        difficulty: difficulty,
        category: category,
      );
    }
  }

  /// Tạo exercise mới
  Future<Exercise?> createExercise({
    required String title,
    required String description,
    required String difficulty,
    required String category,
    required int timeLimit,
    File? imageFile,
    File? audioFile,
  }) async {
    try {
      final response = await _apiService.createExercise(
        title: title,
        description: description,
        difficulty: difficulty,
        category: category,
        timeLimit: timeLimit,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      if (response.success && response.data != null) {
        // Add to current list
        state = state.copyWith(
          exercises: [response.data!, ...state.exercises],
        );
        return response.data;
      } else {
        throw response.message ?? 'Failed to create exercise';
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Cập nhật exercise
  Future<Exercise?> updateExercise({
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
      final response = await _apiService.updateExercise(
        id: id,
        title: title,
        description: description,
        difficulty: difficulty,
        category: category,
        timeLimit: timeLimit,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      if (response.success && response.data != null) {
        // Update in current list
        final updatedExercises = state.exercises.map((exercise) {
          return exercise.id == id ? response.data! : exercise;
        }).toList();

        state = state.copyWith(exercises: updatedExercises);
        return response.data;
      } else {
        throw response.message ?? 'Failed to update exercise';
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Xóa exercise
  Future<bool> deleteExercise(String id) async {
    try {
      final response = await _apiService.deleteExercise(id);

      if (response.success) {
        // Remove from current list
        final updatedExercises = state.exercises.where((exercise) {
          return exercise.id != id;
        }).toList();

        state = state.copyWith(exercises: updatedExercises);
        return true;
      } else {
        throw response.message ?? 'Failed to delete exercise';
      }
    } catch (e) {
      rethrow;
    }
  }
}

/// Provider cho exercises list
final exercisesProvider =
    StateNotifierProvider<ExercisesNotifier, ExercisesState>((ref) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return ExercisesNotifier(apiService);
});

/// Provider cho single exercise detail
final exerciseDetailProvider =
    FutureProvider.family<Exercise?, String>((ref, id) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  try {
    final response = await apiService.getExerciseById(id);
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  } catch (e) {
    throw e.toString();
  }
});
