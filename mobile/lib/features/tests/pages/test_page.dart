import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../models/test_models.dart';
import '../../../services/test_service.dart';
import '../../../core/services/auth_service.dart';
import '../../../widgets/audio_player_widget.dart';
import '../../../widgets/question_image_widget.dart';

// Provider cho test detail
final testDetailProvider = FutureProvider.family<TestDetail, int>((ref, testId) async {
  return await TestService.getTestQuestions(testId);
});

// Provider cho test state
final testStateProvider = StateNotifierProvider.family<TestStateNotifier, TestState, int>((ref, testId) {
  return TestStateNotifier(testId);
});

class TestState {
  final int currentPartIndex;
  final int currentQuestionIndexInPart;
  final Map<int, String> userAnswers;
  final Duration timeRemaining;
  final bool isSubmitting;
  final TestSubmissionResult? submissionResult;

  TestState({
    this.currentPartIndex = 0,
    this.currentQuestionIndexInPart = 0,
    this.userAnswers = const {},
    this.timeRemaining = const Duration(hours: 2),
    this.isSubmitting = false,
    this.submissionResult,
  });

  TestState copyWith({
    int? currentPartIndex,
    int? currentQuestionIndexInPart,
    Map<int, String>? userAnswers,
    Duration? timeRemaining,
    bool? isSubmitting,
    TestSubmissionResult? submissionResult,
  }) {
    return TestState(
      currentPartIndex: currentPartIndex ?? this.currentPartIndex,
      currentQuestionIndexInPart: currentQuestionIndexInPart ?? this.currentQuestionIndexInPart,
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

  void goToPart(int partIndex) {
    state = state.copyWith(
      currentPartIndex: partIndex,
      currentQuestionIndexInPart: 0,
    );
  }

  void goToQuestionInPart(int questionIndex) {
    state = state.copyWith(currentQuestionIndexInPart: questionIndex);
  }

  void nextQuestionInPart(int questionsInPart) {
    if (state.currentQuestionIndexInPart < questionsInPart - 1) {
      state = state.copyWith(
        currentQuestionIndexInPart: state.currentQuestionIndexInPart + 1,
      );
    }
  }

  void previousQuestionInPart() {
    if (state.currentQuestionIndexInPart > 0) {
      state = state.copyWith(
        currentQuestionIndexInPart: state.currentQuestionIndexInPart - 1,
      );
    }
  }

  void nextPart(List<int> availableParts) {
    if (state.currentPartIndex < availableParts.length - 1) {
      state = state.copyWith(
        currentPartIndex: state.currentPartIndex + 1,
        currentQuestionIndexInPart: 0,
      );
    }
  }

  void previousPart() {
    if (state.currentPartIndex > 0) {
      state = state.copyWith(
        currentPartIndex: state.currentPartIndex - 1,
        currentQuestionIndexInPart: 0,
      );
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

      print('Submitting test: ${submission.toJson()}');
      final result = await TestService.submitTest(submission);
      print('Submission result: ${result.toJson()}');
      
      state = state.copyWith(
        submissionResult: result,
        isSubmitting: false,
      );
      
      // Stop timer when submitted
      _timer?.cancel();
    } catch (e) {
      print('Submit error: $e');
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
          if (testDetail.availableParts.isEmpty) {
            return const Center(
              child: Text('Không có parts nào trong bài test này'),
            );
          }

          final currentPartNumber = testDetail.availableParts[testState.currentPartIndex];
          final questionsInCurrentPart = testDetail.questionsByPart[currentPartNumber] ?? [];
          
          if (questionsInCurrentPart.isEmpty) {
            return const Center(
              child: Text('Không có câu hỏi nào trong part này'),
            );
          }

          final currentQuestion = questionsInCurrentPart[testState.currentQuestionIndexInPart];

          return Column(
            children: [
              // Part and question progress
              Container(
                padding: const EdgeInsets.all(16),
                color: Colors.grey[100],
                child: Column(
                  children: [
                    // Part info
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                testDetail.getPartTitle(currentPartNumber),
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                testDetail.getPartDescription(currentPartNumber),
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    
                    // Question progress
                    Row(
                      children: [
                        Text(
                          'Câu ${testState.currentQuestionIndexInPart + 1}/${questionsInCurrentPart.length}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Part ${testState.currentPartIndex + 1}/${testDetail.availableParts.length}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    
                    // Parts navigation
                    const SizedBox(height: 8),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: testDetail.availableParts.asMap().entries.map((entry) {
                          final index = entry.key;
                          final partNumber = entry.value;
                          final isCurrentPart = index == testState.currentPartIndex;
                          
                          return GestureDetector(
                            onTap: () {
                              ref.read(testStateProvider(testId).notifier).goToPart(index);
                            },
                            child: Container(
                              margin: const EdgeInsets.only(right: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: isCurrentPart ? Theme.of(context).colorScheme.primary : Colors.white,
                                border: Border.all(
                                  color: isCurrentPart ? Theme.of(context).colorScheme.primary : Colors.grey[300]!,
                                ),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                'P$partNumber',
                                style: TextStyle(
                                  color: isCurrentPart ? Colors.white : Colors.black,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          );
                        }).toList(),
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
                      if (currentQuestion.audioUrl != null && currentQuestion.audioUrl!.isNotEmpty) ...[
                        Builder(
                          builder: (context) {
                            print('Test Page - Audio URL: ${currentQuestion.audioUrl}'); // Debug log
                            return AudioPlayerWidget(audioUrl: currentQuestion.audioUrl!);
                          },
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Image if available
                      if (currentQuestion.imageUrl != null && currentQuestion.imageUrl!.isNotEmpty) ...[
                        QuestionImageWidget(imageUrl: currentQuestion.imageUrl!),
                        const SizedBox(height: 16),
                      ],

                      // Reading content for Part 6 & 7
                      if (currentQuestion.content != null && currentQuestion.content!.isNotEmpty) ...[
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.grey[50],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey[300]!),
                          ),
                          child: Text(
                            currentQuestion.content!,
                            style: const TextStyle(
                              fontSize: 14,
                              height: 1.6,
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
                child: Column(
                  children: [
                    // Question navigation
                    Row(
                      children: [
                        // Previous question
                        if (testState.currentQuestionIndexInPart > 0 || testState.currentPartIndex > 0)
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () {
                                if (testState.currentQuestionIndexInPart > 0) {
                                  ref.read(testStateProvider(testId).notifier).previousQuestionInPart();
                                } else {
                                  ref.read(testStateProvider(testId).notifier).previousPart();
                                }
                              },
                              icon: const Icon(Icons.arrow_back),
                              label: const Text('Câu trước'),
                            ),
                          ),
                        
                        if (testState.currentQuestionIndexInPart > 0 || testState.currentPartIndex > 0) 
                          const SizedBox(width: 16),

                        // Next question or next part
                        Expanded(
                          child: testState.currentQuestionIndexInPart < questionsInCurrentPart.length - 1
                              ? ElevatedButton.icon(
                                  onPressed: () {
                                    ref.read(testStateProvider(testId).notifier)
                                        .nextQuestionInPart(questionsInCurrentPart.length);
                                  },
                                  icon: const Icon(Icons.arrow_forward),
                                  label: const Text('Câu tiếp'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Theme.of(context).colorScheme.primary,
                                    foregroundColor: Colors.white,
                                  ),
                                )
                              : testState.currentPartIndex < testDetail.availableParts.length - 1
                                  ? ElevatedButton.icon(
                                      onPressed: () {
                                        ref.read(testStateProvider(testId).notifier)
                                            .nextPart(testDetail.availableParts);
                                      },
                                      icon: const Icon(Icons.arrow_forward),
                                      label: const Text('Part tiếp'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.orange,
                                        foregroundColor: Colors.white,
                                      ),
                                    )
                                  : ElevatedButton.icon(
                                      onPressed: testState.isSubmitting 
                                          ? null
                                          : () => _showSubmitDialog(context, ref, testDetail.questions),
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
                final result = ref.read(testStateProvider(testId)).submissionResult;
                print('Submit button: got result: $result');
                if (result != null && context.mounted) {
                  // Navigate to result page with submissionId
                  print('Submit button: Navigating to /test-result/${result.submissionId}');
                  context.go('/test-result/${result.submissionId}');
                  print('Submit button: Navigation called');
                } else {
                  print('Submit button: No result or context not mounted');
                }
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

  String _formatTime(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    final seconds = duration.inSeconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}
