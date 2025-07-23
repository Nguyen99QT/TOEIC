import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../models/test_models.dart';
import '../../../services/test_service.dart';
import '../../../core/services/auth_service.dart';

// Provider cho test detail
final testDetailProvider = FutureProvider.family<TestDetail, int>((ref, testId) async {
  return await TestService.getTestQuestions(testId);
});

// Provider cho test state
final testStateProvider = StateNotifierProvider.family<TestStateNotifier, TestState, int>((ref, testId) {
  return TestStateNotifier(testId);
});

class TestState {
  final int currentQuestionIndex;
  final Map<int, String> userAnswers;
  final Duration timeRemaining;
  final bool isSubmitting;
  final TestSubmissionResult? submissionResult;

  TestState({
    this.currentQuestionIndex = 0,
    this.userAnswers = const {},
    this.timeRemaining = const Duration(hours: 2),
    this.isSubmitting = false,
    this.submissionResult,
  });

  TestState copyWith({
    int? currentQuestionIndex,
    Map<int, String>? userAnswers,
    Duration? timeRemaining,
    bool? isSubmitting,
    TestSubmissionResult? submissionResult,
  }) {
    return TestState(
      currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
      userAnswers: userAnswers ?? this.userAnswers,
      timeRemaining: timeRemaining ?? this.timeRemaining,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      submissionResult: submissionResult ?? this.submissionResult,
    );
  }
}

class TestStateNotifier extends StateNotifier<TestState> {
  final int testId;
  Timer? _timer;

  TestStateNotifier(this.testId) : super(TestState()) {
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.timeRemaining.inSeconds <= 0) {
        timer.cancel();
        _autoSubmit();
      } else {
        state = state.copyWith(
          timeRemaining: Duration(seconds: state.timeRemaining.inSeconds - 1),
        );
      }
    });
  }

  void setAnswer(int questionId, String answer) {
    final newAnswers = Map<int, String>.from(state.userAnswers);
    newAnswers[questionId] = answer;
    state = state.copyWith(userAnswers: newAnswers);
  }

  void goToQuestion(int index) {
    state = state.copyWith(currentQuestionIndex: index);
  }

  void nextQuestion(int totalQuestions) {
    if (state.currentQuestionIndex < totalQuestions - 1) {
      state = state.copyWith(currentQuestionIndex: state.currentQuestionIndex + 1);
    }
  }

  void previousQuestion() {
    if (state.currentQuestionIndex > 0) {
      state = state.copyWith(currentQuestionIndex: state.currentQuestionIndex - 1);
    }
  }

  Future<void> submitTest(List<TestQuestion> questions) async {
    state = state.copyWith(isSubmitting: true);
    
    try {
      final user = AuthService.instance.currentUser;
      if (user == null) throw Exception('User not authenticated');

      final answers = questions.map((question) {
        final userAnswer = state.userAnswers[question.questionId] ?? '';
        return TestAnswer(
          questionId: question.questionId,
          selectedOption: userAnswer,
        );
      }).toList();

      final submission = TestSubmission(
        userId: user.id,
        testId: testId,
        answers: answers,
      );

      final result = await TestService.submitTest(submission);
      state = state.copyWith(
        submissionResult: result,
        isSubmitting: false,
      );
      
      // Stop timer when submitted
      _timer?.cancel();
    } catch (e) {
      state = state.copyWith(isSubmitting: false);
      rethrow;
    }
  }

  Future<void> _autoSubmit() async {
    // Auto submit when time runs out
    // This would need the questions list - implement as needed
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}

class TestPage extends ConsumerWidget {
  final int testId;

  const TestPage({super.key, required this.testId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final testDetailAsync = ref.watch(testDetailProvider(testId));
    final testState = ref.watch(testStateProvider(testId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Làm bài test'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        actions: [
          // Timer display
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Center(
              child: Text(
                _formatTime(testState.timeRemaining),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
      body: testDetailAsync.when(
        data: (testDetail) {
          if (testState.submissionResult != null) {
            return _buildResultView(context, testState.submissionResult!);
          }

          final questions = testDetail.questions;
          if (questions.isEmpty) {
            return const Center(
              child: Text('Không có câu hỏi nào trong bài test này'),
            );
          }

          final currentQuestion = questions[testState.currentQuestionIndex];

          return Column(
            children: [
              // Question progress
              Container(
                padding: const EdgeInsets.all(16),
                color: Colors.grey[100],
                child: Row(
                  children: [
                    Text(
                      'Câu ${testState.currentQuestionIndex + 1}/${questions.length}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      'Part ${currentQuestion.partNumber}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),

              // Question content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Audio player if available
                      if (currentQuestion.audioUrl != null) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.blue[50],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.blue[200]!),
                          ),
                          child: Column(
                            children: [
                              const Icon(Icons.headphones, size: 32, color: Colors.blue),
                              const SizedBox(height: 8),
                              const Text('Audio Question'),
                              const SizedBox(height: 8),
                              ElevatedButton.icon(
                                onPressed: () {
                                  // TODO: Implement audio player
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Audio player chưa được implement')),
                                  );
                                },
                                icon: const Icon(Icons.play_arrow),
                                label: const Text('Phát âm thanh'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Image if available
                      if (currentQuestion.imageUrl != null) ...[
                        Container(
                          width: double.infinity,
                          height: 200,
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey[300]!),
                          ),
                          child: const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.image, size: 48, color: Colors.grey),
                                SizedBox(height: 8),
                                Text('Hình ảnh câu hỏi'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Question text
                      Text(
                        currentQuestion.questionText,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Answer options
                      ...currentQuestion.options.map((option) {
                        final isSelected = testState.userAnswers[currentQuestion.questionId] == option.label;
                        
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: InkWell(
                            onTap: () {
                              ref.read(testStateProvider(testId).notifier)
                                  .setAnswer(currentQuestion.questionId, option.label);
                            },
                            borderRadius: BorderRadius.circular(8),
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: isSelected 
                                      ? Theme.of(context).colorScheme.primary
                                      : Colors.grey[300]!,
                                  width: isSelected ? 2 : 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                                color: isSelected 
                                    ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                                    : null,
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: isSelected 
                                            ? Theme.of(context).colorScheme.primary
                                            : Colors.grey[400]!,
                                      ),
                                      color: isSelected 
                                          ? Theme.of(context).colorScheme.primary
                                          : null,
                                    ),
                                    child: isSelected 
                                        ? const Icon(Icons.check, size: 16, color: Colors.white)
                                        : null,
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    '(${option.label})',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: isSelected 
                                          ? Theme.of(context).colorScheme.primary
                                          : null,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      option.content,
                                      style: TextStyle(
                                        color: isSelected 
                                            ? Theme.of(context).colorScheme.primary
                                            : null,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ],
                  ),
                ),
              ),

              // Navigation buttons
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    // Previous button
                    if (testState.currentQuestionIndex > 0)
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ref.read(testStateProvider(testId).notifier).previousQuestion();
                          },
                          icon: const Icon(Icons.arrow_back),
                          label: const Text('Câu trước'),
                        ),
                      ),
                    
                    if (testState.currentQuestionIndex > 0) const SizedBox(width: 16),

                    // Next/Submit button
                    Expanded(
                      child: testState.currentQuestionIndex < questions.length - 1
                          ? ElevatedButton.icon(
                              onPressed: () {
                                ref.read(testStateProvider(testId).notifier)
                                    .nextQuestion(questions.length);
                              },
                              icon: const Icon(Icons.arrow_forward),
                              label: const Text('Câu tiếp'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Theme.of(context).colorScheme.primary,
                                foregroundColor: Colors.white,
                              ),
                            )
                          : ElevatedButton.icon(
                              onPressed: testState.isSubmitting 
                                  ? null
                                  : () => _showSubmitDialog(context, ref, questions),
                              icon: testState.isSubmitting 
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : const Icon(Icons.check),
                              label: Text(testState.isSubmitting ? 'Đang nộp...' : 'Nộp bài'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                                foregroundColor: Colors.white,
                              ),
                            ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text('Lỗi: $error'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.invalidate(testDetailProvider(testId)),
                child: const Text('Thử lại'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showSubmitDialog(BuildContext context, WidgetRef ref, List<TestQuestion> questions) {
    final testState = ref.read(testStateProvider(testId));
    final answeredCount = testState.userAnswers.length;
    final totalQuestions = questions.length;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nộp bài'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Bạn có chắc chắn muốn nộp bài không?'),
            const SizedBox(height: 8),
            Text('Đã trả lời: $answeredCount/$totalQuestions câu'),
            if (answeredCount < totalQuestions) ...[
              const SizedBox(height: 8),
              Text(
                'Bạn còn ${totalQuestions - answeredCount} câu chưa trả lời.',
                style: const TextStyle(color: Colors.orange),
              ),
            ],
            const SizedBox(height: 8),
            const Text('Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await ref.read(testStateProvider(testId).notifier).submitTest(questions);
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Lỗi nộp bài: $e'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('Nộp bài'),
          ),
        ],
      ),
    );
  }

  Widget _buildResultView(BuildContext context, TestSubmissionResult result) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.check_circle,
            size: 80,
            color: Colors.green,
          ),
          const SizedBox(height: 24),
          const Text(
            'Nộp bài thành công!',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            result.message,
            style: const TextStyle(fontSize: 16),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                context.go('/test-result/${result.submissionId}');
              },
              icon: const Icon(Icons.assessment),
              label: const Text('Xem kết quả'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                context.go('/tests');
              },
              icon: const Icon(Icons.list),
              label: const Text('Về danh sách test'),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    final seconds = duration.inSeconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}
