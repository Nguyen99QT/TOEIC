import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/core/services/exercise_api_service.dart';

/// Provider for ExerciseApiService
final exerciseApiServiceProvider = Provider<ExerciseApiService>((ref) {
  return ExerciseApiService();
});

/// State class cho exercise list
class ExerciseListState {
  final List<Exercise> exercises;
  final bool isLoading;
  final String? error;
  final bool hasNextPage;
  final int currentPage;

  const ExerciseListState({
    this.exercises = const [],
    this.isLoading = false,
    this.error,
    this.hasNextPage = true,
    this.currentPage = 1,
  });

  ExerciseListState copyWith({
    List<Exercise>? exercises,
    bool? isLoading,
    String? error,
    bool? hasNextPage,
    int? currentPage,
  }) {
    return ExerciseListState(
      exercises: exercises ?? this.exercises,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      currentPage: currentPage ?? this.currentPage,
    );
  }
}

/// Exercise List Notifier
class ExerciseListNotifier extends StateNotifier<ExerciseListState> {
  final ExerciseApiService _apiService;

  ExerciseListNotifier(this._apiService) : super(const ExerciseListState());

  /// Load exercises với phân trang
  Future<void> loadExercises({
    bool refresh = false,
    String? type,
    String? difficulty,
    String? level,
    String? lessonId,
    bool? isActive,
    bool? isPremium,
  }) async {
    if (refresh) {
      state = state.copyWith(
        exercises: [],
        currentPage: 1,
        hasNextPage: true,
        error: null,
      );
    }

    if (state.isLoading || !state.hasNextPage) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _apiService.getExercisesWithFilter(
        page: state.currentPage,
        limit: 10,
        type: type,
        difficulty: difficulty,
        level: level,
        lessonId: lessonId,
        isActive: isActive,
        isPremium: isPremium,
      );

      final newExercises = response.exercises;
      final allExercises =
          refresh ? newExercises : [...state.exercises, ...newExercises];

      state = state.copyWith(
        exercises: allExercises,
        isLoading: false,
        currentPage: state.currentPage + 1,
        hasNextPage: newExercises.length >= 10,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Refresh exercises
  Future<void> refreshExercises({
    String? type,
    String? difficulty,
    String? level,
    String? lessonId,
    bool? isActive,
    bool? isPremium,
  }) async {
    await loadExercises(
      refresh: true,
      type: type,
      difficulty: difficulty,
      level: level,
      lessonId: lessonId,
      isActive: isActive,
      isPremium: isPremium,
    );
  }

  /// Add exercise to list
  void addExercise(Exercise exercise) {
    state = state.copyWith(
      exercises: [exercise, ...state.exercises],
    );
  }

  /// Update exercise in list
  void updateExercise(Exercise updatedExercise) {
    final exercises = state.exercises.map((exercise) {
      return exercise.id == updatedExercise.id ? updatedExercise : exercise;
    }).toList();

    state = state.copyWith(exercises: exercises);
  }

  /// Remove exercise from list
  void removeExercise(String exerciseId) {
    final exercises =
        state.exercises.where((exercise) => exercise.id != exerciseId).toList();

    state = state.copyWith(exercises: exercises);
  }
}

/// Provider cho exercise list
final exerciseListProvider =
    StateNotifierProvider<ExerciseListNotifier, ExerciseListState>((ref) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return ExerciseListNotifier(apiService);
});

/// Single Exercise State
class ExerciseDetailState {
  final Exercise? exercise;
  final bool isLoading;
  final String? error;

  const ExerciseDetailState({
    this.exercise,
    this.isLoading = false,
    this.error,
  });

  ExerciseDetailState copyWith({
    Exercise? exercise,
    bool? isLoading,
    String? error,
  }) {
    return ExerciseDetailState(
      exercise: exercise ?? this.exercise,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Exercise Detail Notifier
class ExerciseDetailNotifier extends StateNotifier<ExerciseDetailState> {
  final ExerciseApiService _apiService;

  ExerciseDetailNotifier(this._apiService) : super(const ExerciseDetailState());

  /// Load exercise detail
  Future<void> loadExercise(String exerciseId) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _apiService.getExerciseById(exerciseId);
      state = state.copyWith(
        exercise: response.exercises.first,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Create exercise
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
    String? category,
    int? timeLimit,
    int? points,
    int? orderIndex,
    String? lessonId,
    bool? isActive,
    bool? isPremium,
    File? imageFile,
    File? audioFile,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

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
        timeLimit: timeLimit ?? 0,
        points: points ?? 0,
        orderIndex: orderIndex ?? 0,
        lessonId: lessonId,
        isActive: isActive ?? true,
        isPremium: isPremium ?? false,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      final exercise = response.exercises.first;
      state = state.copyWith(
        exercise: exercise,
        isLoading: false,
      );

      return exercise;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return null;
    }
  }

  /// Update exercise
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
    String? category,
    int? timeLimit,
    int? points,
    int? orderIndex,
    String? lessonId,
    bool? isActive,
    bool? isPremium,
    File? imageFile,
    File? audioFile,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

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
        timeLimit: timeLimit ?? 0,
        points: points ?? 0,
        orderIndex: orderIndex ?? 0,
        lessonId: lessonId,
        isActive: isActive ?? true,
        isPremium: isPremium ?? false,
        imageFile: imageFile,
        audioFile: audioFile,
      );

      final exercise = response.exercises.first;
      state = state.copyWith(
        exercise: exercise,
        isLoading: false,
      );

      return exercise;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return null;
    }
  }

  /// Delete exercise
  Future<bool> deleteExercise(String exerciseId) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      await _apiService.deleteExercise(exerciseId);
      state = state.copyWith(
        exercise: null,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  /// Clear exercise
  void clearExercise() {
    state = const ExerciseDetailState();
  }
}

/// Provider cho exercise detail
final exerciseDetailProvider =
    StateNotifierProvider<ExerciseDetailNotifier, ExerciseDetailState>((ref) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return ExerciseDetailNotifier(apiService);
});

/// Exercise Quiz State - for quiz functionality
class ExerciseQuizState {
  final Exercise? currentExercise;
  final int currentQuestionIndex;
  final List<Exercise> questions;
  final Map<String, String> userAnswers;
  final Map<String, bool> answerResults;
  final bool isSubmitting;
  final bool isCompleted;
  final int score;
  final int totalQuestions;

  const ExerciseQuizState({
    this.currentExercise,
    this.currentQuestionIndex = 0,
    this.questions = const [],
    this.userAnswers = const {},
    this.answerResults = const {},
    this.isSubmitting = false,
    this.isCompleted = false,
    this.score = 0,
    this.totalQuestions = 0,
  });

  ExerciseQuizState copyWith({
    Exercise? currentExercise,
    int? currentQuestionIndex,
    List<Exercise>? questions,
    Map<String, String>? userAnswers,
    Map<String, bool>? answerResults,
    bool? isSubmitting,
    bool? isCompleted,
    int? score,
    int? totalQuestions,
  }) {
    return ExerciseQuizState(
      currentExercise: currentExercise ?? this.currentExercise,
      currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
      questions: questions ?? this.questions,
      userAnswers: userAnswers ?? this.userAnswers,
      answerResults: answerResults ?? this.answerResults,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isCompleted: isCompleted ?? this.isCompleted,
      score: score ?? this.score,
      totalQuestions: totalQuestions ?? this.totalQuestions,
    );
  }
}

/// Exercise Quiz Notifier
class ExerciseQuizNotifier extends StateNotifier<ExerciseQuizState> {
  final ExerciseApiService _apiService;

  ExerciseQuizNotifier(this._apiService) : super(const ExerciseQuizState());

  /// Start quiz with exercises
  void startQuiz(List<Exercise> exercises) {
    state = ExerciseQuizState(
      questions: exercises,
      currentExercise: exercises.isNotEmpty ? exercises.first : null,
      totalQuestions: exercises.length,
    );
  }

  /// Submit answer for current question
  Future<void> submitAnswer(String answer) async {
    if (state.currentExercise == null) return;

    state = state.copyWith(isSubmitting: true);

    try {
      final result = await _apiService.submitAnswer(
        exerciseId: state.currentExercise!.id!,
        userAnswer: answer,
      );

      final isCorrect = result['is_correct'] ?? false;
      final newUserAnswers = Map<String, String>.from(state.userAnswers);
      final newAnswerResults = Map<String, bool>.from(state.answerResults);

      newUserAnswers[state.currentExercise!.id!] = answer;
      newAnswerResults[state.currentExercise!.id!] = isCorrect;

      final newScore = isCorrect ? state.score + 1 : state.score;

      state = state.copyWith(
        userAnswers: newUserAnswers,
        answerResults: newAnswerResults,
        score: newScore,
        isSubmitting: false,
      );

      // Auto-move to next question after 2 seconds
      await Future.delayed(const Duration(seconds: 2));
      nextQuestion();
    } catch (e) {
      state = state.copyWith(isSubmitting: false);
    }
  }

  /// Move to next question
  void nextQuestion() {
    final nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= state.questions.length) {
      // Quiz completed
      state = state.copyWith(
        isCompleted: true,
        currentExercise: null,
      );
    } else {
      state = state.copyWith(
        currentQuestionIndex: nextIndex,
        currentExercise: state.questions[nextIndex],
      );
    }
  }

  /// Move to previous question
  void previousQuestion() {
    final prevIndex = state.currentQuestionIndex - 1;

    if (prevIndex >= 0) {
      state = state.copyWith(
        currentQuestionIndex: prevIndex,
        currentExercise: state.questions[prevIndex],
      );
    }
  }

  /// Reset quiz
  void resetQuiz() {
    state = const ExerciseQuizState();
  }

  /// Get quiz progress
  double get progress {
    if (state.totalQuestions == 0) return 0.0;
    return (state.currentQuestionIndex + 1) / state.totalQuestions;
  }

  /// Get score percentage
  double get scorePercentage {
    if (state.totalQuestions == 0) return 0.0;
    return state.score / state.totalQuestions;
  }
}

/// Provider cho exercise quiz
final exerciseQuizProvider =
    StateNotifierProvider<ExerciseQuizNotifier, ExerciseQuizState>((ref) {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return ExerciseQuizNotifier(apiService);
});

/// Provider cho exercises by lesson
final exercisesByLessonProvider =
    FutureProvider.family<List<Exercise>, String>((ref, lessonId) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return apiService.getExercisesByLesson(lessonId);
});

/// Provider cho exercises by type
final exercisesByTypeProvider =
    FutureProvider.family<List<Exercise>, String>((ref, type) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return apiService.getExercisesByType(type);
});

/// Provider cho exercise progress
final exerciseProgressProvider =
    FutureProvider.family<Map<String, dynamic>, String>((ref, userId) async {
  final apiService = ref.watch(exerciseApiServiceProvider);
  return apiService.getExerciseProgress(userId);
});
