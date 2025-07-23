import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../models/test_model.dart';
import '../repository/test_repository.dart';

// Test state classes
class TestState {
  final bool isLoading;
  final List<TestModel> tests;
  final String? error;

  TestState({
    required this.isLoading,
    required this.tests,
    this.error,
  });

  TestState copyWith({
    bool? isLoading,
    List<TestModel>? tests,
    String? error,
  }) {
    return TestState(
      isLoading: isLoading ?? this.isLoading,
      tests: tests ?? this.tests,
      error: error,
    );
  }
}

class TestSessionState {
  final bool isActive;
  final TestModel? currentTest;
  final int currentQuestionIndex;
  final Map<int, int> answers; // questionId -> selectedAnswerIndex
  final DateTime? startTime;
  final int timeRemaining; // in seconds

  TestSessionState({
    required this.isActive,
    this.currentTest,
    required this.currentQuestionIndex,
    required this.answers,
    this.startTime,
    required this.timeRemaining,
  });

  TestSessionState copyWith({
    bool? isActive,
    TestModel? currentTest,
    int? currentQuestionIndex,
    Map<int, int>? answers,
    DateTime? startTime,
    int? timeRemaining,
  }) {
    return TestSessionState(
      isActive: isActive ?? this.isActive,
      currentTest: currentTest ?? this.currentTest,
      currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
      answers: answers ?? this.answers,
      startTime: startTime ?? this.startTime,
      timeRemaining: timeRemaining ?? this.timeRemaining,
    );
  }
}

// Test Controller
class TestController extends StateNotifier<TestState> {
  final TestRepository _repository;

  TestController(this._repository) : super(TestState(isLoading: false, tests: []));

  Future<void> loadAvailableTests() async {
    state = state.copyWith(isLoading: true, error: null);
    
    final response = await _repository.getAvailableTests();
    
    if (response.isSuccess) {
      state = state.copyWith(
        isLoading: false,
        tests: response.data ?? [],
      );
    } else {
      state = state.copyWith(
        isLoading: false,
        error: response.error,
      );
    }
  }

  Future<TestModel?> getTestDetails(int testId) async {
    final response = await _repository.getTestDetails(testId);
    return response.isSuccess ? response.data : null;
  }
}

// Test Session Controller
class TestSessionController extends StateNotifier<TestSessionState> {
  final TestRepository _repository;

  TestSessionController(this._repository) : super(TestSessionState(
    isActive: false,
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 0,
  ));

  Future<bool> startTest(TestModel test) async {
    final response = await _repository.startTest(test.id);
    
    if (response.isSuccess) {
      state = state.copyWith(
        isActive: true,
        currentTest: test,
        currentQuestionIndex: 0,
        answers: {},
        startTime: DateTime.now(),
        timeRemaining: test.duration * 60, // convert minutes to seconds
      );
      return true;
    }
    return false;
  }

  void answerQuestion(int questionId, int selectedAnswerIndex) {
    final newAnswers = Map<int, int>.from(state.answers);
    newAnswers[questionId] = selectedAnswerIndex;
    
    state = state.copyWith(answers: newAnswers);
  }

  void nextQuestion() {
    if (state.currentTest != null &&
        state.currentQuestionIndex < (state.currentTest!.questions?.length ?? 0) - 1) {
      state = state.copyWith(
        currentQuestionIndex: state.currentQuestionIndex + 1,
      );
    }
  }

  void previousQuestion() {
    if (state.currentQuestionIndex > 0) {
      state = state.copyWith(
        currentQuestionIndex: state.currentQuestionIndex - 1,
      );
    }
  }

  void goToQuestion(int index) {
    if (state.currentTest != null &&
        index >= 0 &&
        index < (state.currentTest!.questions?.length ?? 0)) {
      state = state.copyWith(currentQuestionIndex: index);
    }
  }

  void updateTimeRemaining(int seconds) {
    state = state.copyWith(timeRemaining: seconds);
  }

  Future<Map<String, dynamic>?> submitTest() async {
    if (state.currentTest == null) return null;

    final response = await _repository.submitTest(
      state.currentTest!.id,
      state.answers.map((key, value) => MapEntry(key.toString(), value)),
    );

    if (response.isSuccess) {
      // Reset session
      state = TestSessionState(
        isActive: false,
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 0,
      );
      return response.data;
    }
    return null;
  }

  void endTest() {
    state = TestSessionState(
      isActive: false,
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
    );
  }
}

// Providers
final testControllerProvider = StateNotifierProvider<TestController, TestState>((ref) {
  final repository = ref.read(testRepositoryProvider);
  return TestController(repository);
});

final testSessionControllerProvider = StateNotifierProvider<TestSessionController, TestSessionState>((ref) {
  final repository = ref.read(testRepositoryProvider);
  return TestSessionController(repository);
});

// Additional providers for specific data
final testHistoryProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final repository = ref.read(testRepositoryProvider);
  final response = await repository.getTestHistory();
  return response.isSuccess ? (response.data ?? []) : [];
});

final testResultProvider = FutureProvider.family<Map<String, dynamic>?, int>((ref, resultId) async {
  final repository = ref.read(testRepositoryProvider);
  final response = await repository.getTestResult(resultId);
  return response.isSuccess ? response.data : null;
});
