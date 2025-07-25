import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/core/services/exercise_api_service.dart';

/// Provider for exercise list
final exerciseListProvider =
    StateNotifierProvider<ExerciseListNotifier, AsyncValue<List<Exercise>>>(
        (ref) {
  return ExerciseListNotifier();
});

/// Provider for exercise search/filter parameters
final exerciseSearchProvider = StateProvider<ExerciseSearchParams>((ref) {
  return const ExerciseSearchParams();
});

/// Notifier for managing exercise list state
class ExerciseListNotifier extends StateNotifier<AsyncValue<List<Exercise>>> {
  ExerciseListNotifier() : super(const AsyncValue.loading()) {
    loadExercises();
  }

  final ExerciseApiService _exerciseService = ExerciseApiService();

  /// Load exercises from API
  Future<void> loadExercises({
    String? search,
    String? difficulty,
    String? category,
    String? sortBy,
    String? sortDir,
  }) async {
    try {
      state = const AsyncValue.loading();

      final response = await _exerciseService.getExercises(
        page: 0,
        size: 50, // Load more exercises for better UX
        search: search,
        difficulty: difficulty,
        category: category,
        sortBy: sortBy,
        sortDir: sortDir,
      );

      state = AsyncValue.data(response.exercises ?? []);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  /// Refresh exercises
  Future<void> refresh() async {
    await loadExercises();
  }

  /// Search exercises
  Future<void> searchExercises(String query) async {
    await loadExercises(search: query);
  }

  /// Filter exercises by difficulty
  Future<void> filterByDifficulty(String? difficulty) async {
    await loadExercises(difficulty: difficulty);
  }

  /// Filter exercises by category
  Future<void> filterByCategory(String? category) async {
    await loadExercises(category: category);
  }
}

/// Search parameters for exercises
class ExerciseSearchParams {
  final String? search;
  final String? difficulty;
  final String? category;
  final String? sortBy;
  final String? sortDir;

  const ExerciseSearchParams({
    this.search,
    this.difficulty,
    this.category,
    this.sortBy,
    this.sortDir,
  });

  ExerciseSearchParams copyWith({
    String? search,
    String? difficulty,
    String? category,
    String? sortBy,
    String? sortDir,
  }) {
    return ExerciseSearchParams(
      search: search ?? this.search,
      difficulty: difficulty ?? this.difficulty,
      category: category ?? this.category,
      sortBy: sortBy ?? this.sortBy,
      sortDir: sortDir ?? this.sortDir,
    );
  }
}
