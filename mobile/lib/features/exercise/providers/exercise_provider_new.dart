import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/core/services/exercise_api_service.dart';

/// State cho Exercise List
class ExerciseListState {
  final List<Exercise> exercises;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final int totalPages;
  final bool hasMore;

  const ExerciseListState({
    this.exercises = const [],
    this.isLoading = false,
    this.error,
    this.currentPage = 0,
    this.totalPages = 0,
    this.hasMore = false,
  });

  ExerciseListState copyWith({
    List<Exercise>? exercises,
    bool? isLoading,
    String? error,
    int? currentPage,
    int? totalPages,
    bool? hasMore,
  }) {
    return ExerciseListState(
      exercises: exercises ?? this.exercises,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

/// Provider cho Exercise API Service
final exerciseApiServiceProvider = Provider<ExerciseApiService>((ref) {
  return ExerciseApiService();
});

/// Exercise List Provider
class ExerciseListNotifier extends StateNotifier<ExerciseListState> {
  final ExerciseApiService _apiService;
  static const int _pageSize = 10;

  ExerciseListNotifier(this._apiService) : super(const ExerciseListState());

  /// Load exercises với phân trang và filter
  Future<void> loadExercises({
    bool refresh = false,
    String? difficulty,
    String? type,
    String? level,
    String? lessonId,
  }) async {
    if (state.isLoading && !refresh) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final int page = refresh ? 1 : state.currentPage + 1;
      final response = await _apiService.getExercisesWithFilter(
        page: page,
        limit: _pageSize,
        difficulty: difficulty,
        type: type,
        level: level,
        lessonId: lessonId,
      );

      final updatedExercises = refresh
          ? response.exercises
          : [...state.exercises, ...response.exercises];

      state = state.copyWith(
        isLoading: false,
        exercises: updatedExercises,
        currentPage: response.page,
        totalPages: (response.totalCount / _pageSize).ceil(),
        hasMore: response.hasNext,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Tìm kiếm exercises
  Future<void> searchExercises(String query) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final exercises = await _apiService.searchExercises(query);
      state = state.copyWith(
        isLoading: false,
        exercises: exercises,
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Reset state
  void reset() {
    state = const ExerciseListState();
  }

  /// Refresh data
  Future<void> refresh() async {
    await loadExercises(refresh: true);
  }

  /// Load more data
  Future<void> loadMore({
    String? difficulty,
    String? type,
    String? level,
    String? lessonId,
  }) async {
    if (!state.hasMore || state.isLoading) return;

    await loadExercises(
      refresh: false,
      difficulty: difficulty,
      type: type,
      level: level,
      lessonId: lessonId,
    );
  }

  /// Tạo exercise mới
  Future<Exercise?> createExercise({
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
      final response = await _apiService.createExercise(
        title: title,
        description: description,
        question: question,
        type: type,
        difficulty: difficulty,
        level: level,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation,
        timeLimit: timeLimit,
        points: points,
        orderIndex: orderIndex,
        lessonId: lessonId,
        isActive: isActive,
        isPremium: isPremium,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      // Add to state if successful
      if (response.exercises.isNotEmpty) {
        final newExercise = response.exercises.first;
        state = state.copyWith(
          exercises: [newExercise, ...state.exercises],
        );
        return newExercise;
      }

      return null;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return null;
    }
  }

  /// Cập nhật exercise
  Future<Exercise?> updateExercise({
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
      final response = await _apiService.updateExercise(
        id: id,
        title: title,
        description: description,
        question: question,
        type: type,
        difficulty: difficulty,
        level: level,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation,
        timeLimit: timeLimit,
        points: points,
        orderIndex: orderIndex,
        lessonId: lessonId,
        isActive: isActive,
        isPremium: isPremium,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      // Update in state if successful
      if (response.exercises.isNotEmpty) {
        final updatedExercise = response.exercises.first;
        final updatedExercises = state.exercises.map((exercise) {
          return exercise.id == id ? updatedExercise : exercise;
        }).toList();

        state = state.copyWith(exercises: updatedExercises);
        return updatedExercise;
      }

      return null;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return null;
    }
  }

  /// Xóa exercise
  Future<bool> deleteExercise(String id) async {
    try {
      await _apiService.deleteExercise(id);

      // Remove from state
      final updatedExercises =
          state.exercises.where((exercise) => exercise.id != id).toList();

      state = state.copyWith(exercises: updatedExercises);
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }
}

final exerciseListProvider =
    StateNotifierProvider<ExerciseListNotifier, ExerciseListState>((ref) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return ExerciseListNotifier(apiService);
});

/// Exercise Detail Provider
class ExerciseDetailNotifier extends StateNotifier<AsyncValue<Exercise?>> {
  final ExerciseApiService _apiService;

  ExerciseDetailNotifier(this._apiService) : super(const AsyncValue.loading());

  /// Load exercise detail
  Future<void> loadExercise(String id) async {
    state = const AsyncValue.loading();
    try {
      final response = await _apiService.getExerciseById(id);
      if (response.exercises.isNotEmpty) {
        state = AsyncValue.data(response.exercises.first);
      } else {
        state = const AsyncValue.data(null);
      }
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
    }
  }

  /// Reset state
  void reset() {
    state = const AsyncValue.loading();
  }
}

final exerciseDetailProvider = StateNotifierProvider.family<
    ExerciseDetailNotifier, AsyncValue<Exercise?>, String>((ref, id) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  final notifier = ExerciseDetailNotifier(apiService);
  notifier.loadExercise(id);
  return notifier;
});

/// Exercise Quiz State
class ExerciseQuizState {
  final List<Exercise> exercises;
  final int currentIndex;
  final Map<String, String> userAnswers;
  final bool isCompleted;
  final int score;
  final bool isLoading;
  final String? error;

  const ExerciseQuizState({
    this.exercises = const [],
    this.currentIndex = 0,
    this.userAnswers = const {},
    this.isCompleted = false,
    this.score = 0,
    this.isLoading = false,
    this.error,
  });

  ExerciseQuizState copyWith({
    List<Exercise>? exercises,
    int? currentIndex,
    Map<String, String>? userAnswers,
    bool? isCompleted,
    int? score,
    bool? isLoading,
    String? error,
  }) {
    return ExerciseQuizState(
      exercises: exercises ?? this.exercises,
      currentIndex: currentIndex ?? this.currentIndex,
      userAnswers: userAnswers ?? this.userAnswers,
      isCompleted: isCompleted ?? this.isCompleted,
      score: score ?? this.score,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  Exercise? get currentExercise =>
      exercises.isNotEmpty && currentIndex < exercises.length
          ? exercises[currentIndex]
          : null;

  bool get hasNext => currentIndex < exercises.length - 1;
  bool get hasPrevious => currentIndex > 0;

  double get progress =>
      exercises.isEmpty ? 0.0 : (currentIndex + 1) / exercises.length;

  int get totalQuestions => exercises.length;
  int get answeredQuestions => userAnswers.length;
}

/// Exercise Quiz Provider
class ExerciseQuizNotifier extends StateNotifier<ExerciseQuizState> {
  final ExerciseApiService _apiService;

  ExerciseQuizNotifier(this._apiService) : super(const ExerciseQuizState());

  /// Initialize quiz với exercises
  void initializeQuiz(List<Exercise> exercises) {
    state = ExerciseQuizState(exercises: exercises);
  }

  /// Submit answer cho current exercise
  Future<void> submitAnswer(String answer) async {
    final currentExercise = state.currentExercise;
    if (currentExercise == null) return;

    try {
      await _apiService.submitAnswer(
        exerciseId: currentExercise.id!,
        userAnswer: answer,
      );

      final newAnswers = Map<String, String>.from(state.userAnswers);
      newAnswers[currentExercise.id!] = answer;

      // Calculate score
      int score = 0;
      for (final exercise in state.exercises) {
        final userAnswer = newAnswers[exercise.id];
        if (userAnswer != null && userAnswer == exercise.correctAnswer) {
          score += exercise.points;
        }
      }

      state = state.copyWith(
        userAnswers: newAnswers,
        score: score,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  /// Move to next exercise
  void nextExercise() {
    if (state.hasNext) {
      state = state.copyWith(currentIndex: state.currentIndex + 1);
    }
  }

  /// Move to previous exercise
  void previousExercise() {
    if (state.hasPrevious) {
      state = state.copyWith(currentIndex: state.currentIndex - 1);
    }
  }

  /// Go to specific exercise
  void goToExercise(int index) {
    if (index >= 0 && index < state.exercises.length) {
      state = state.copyWith(currentIndex: index);
    }
  }

  /// Complete quiz
  void completeQuiz() {
    state = state.copyWith(isCompleted: true);
  }

  /// Reset quiz
  void resetQuiz() {
    state = const ExerciseQuizState();
  }

  /// Get user answer for current exercise
  String? getCurrentAnswer() {
    final currentExercise = state.currentExercise;
    return currentExercise != null
        ? state.userAnswers[currentExercise.id]
        : null;
  }

  /// Check if current exercise is answered
  bool isCurrentExerciseAnswered() {
    return getCurrentAnswer() != null;
  }

  /// Get quiz results
  Map<String, dynamic> getQuizResults() {
    int correctAnswers = 0;
    int totalPoints = 0;
    int earnedPoints = 0;

    for (final exercise in state.exercises) {
      totalPoints += exercise.points;
      final userAnswer = state.userAnswers[exercise.id];
      if (userAnswer != null && userAnswer == exercise.correctAnswer) {
        correctAnswers++;
        earnedPoints += exercise.points;
      }
    }

    final percentage = state.exercises.isEmpty
        ? 0.0
        : (correctAnswers / state.exercises.length) * 100;

    return {
      'totalQuestions': state.exercises.length,
      'correctAnswers': correctAnswers,
      'incorrectAnswers': state.exercises.length - correctAnswers,
      'totalPoints': totalPoints,
      'earnedPoints': earnedPoints,
      'percentage': percentage,
      'grade': _getGrade(percentage),
    };
  }

  String _getGrade(double percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
}

final exerciseQuizProvider =
    StateNotifierProvider<ExerciseQuizNotifier, ExerciseQuizState>((ref) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return ExerciseQuizNotifier(apiService);
});

/// Convenience providers
final exercisesByTypeProvider =
    FutureProvider.family<List<Exercise>, String>((ref, type) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return await apiService.getExercisesByType(type);
});

final exercisesByDifficultyProvider =
    FutureProvider.family<List<Exercise>, String>((ref, difficulty) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return await apiService.getExercisesByDifficulty(difficulty);
});

final exercisesByLevelProvider =
    FutureProvider.family<List<Exercise>, String>((ref, level) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return await apiService.getExercisesByLevel(level);
});

final exercisesByLessonProvider =
    FutureProvider.family<List<Exercise>, String>((ref, lessonId) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return await apiService.getExercisesByLesson(lessonId);
});
