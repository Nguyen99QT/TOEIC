import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/test_model.dart';
import '../shared/widgets/loading_widget.dart';
import '../features/tests/providers/test_provider.dart';

class TestSessionScreen extends ConsumerStatefulWidget {
  final int testId;

  const TestSessionScreen({
    super.key,
    required this.testId,
  });

  @override
  ConsumerState<TestSessionScreen> createState() => _TestSessionScreenState();
}

class _TestSessionScreenState extends ConsumerState<TestSessionScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final sessionState = ref.read(testSessionControllerProvider);
      if (sessionState.timeRemaining > 0) {
        ref.read(testSessionControllerProvider.notifier)
            .updateTimeRemaining(sessionState.timeRemaining - 1);
      } else {
        _timer?.cancel();
        _submitTest();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final sessionState = ref.watch(testSessionControllerProvider);

    if (!sessionState.isActive || sessionState.currentTest == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Test Session'),
        ),
        body: const LoadingWidget(message: 'Loading test...'),
      );
    }

    final test = sessionState.currentTest!;
    final currentQuestion = test.questions?[sessionState.currentQuestionIndex];

    if (currentQuestion == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Test Session'),
        ),
        body: const Center(
          child: Text('No questions available'),
        ),
      );
    }

    return Scaffold(
      appBar: _buildAppBar(sessionState),
      body: Column(
        children: [
          _buildTimer(sessionState.timeRemaining),
          _buildProgressBar(sessionState),
          Expanded(
            child: _buildQuestionContent(currentQuestion, sessionState),
          ),
          _buildNavigationButtons(sessionState),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(TestSessionState sessionState) {
    return AppBar(
      title: Text(sessionState.currentTest?.title ?? 'Test Session'),
      backgroundColor: Theme.of(context).primaryColor,
      foregroundColor: Colors.white,
      leading: IconButton(
        icon: const Icon(Icons.close),
        onPressed: _showExitConfirmation,
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.grid_view),
          onPressed: () => _showQuestionNavigator(sessionState),
        ),
        IconButton(
          icon: const Icon(Icons.flag),
          onPressed: _submitTest,
        ),
      ],
    );
  }

  Widget _buildTimer(int timeRemaining) {
    final minutes = timeRemaining ~/ 60;
    final seconds = timeRemaining % 60;
    final isLowTime = timeRemaining < 300; // 5 minutes

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      color: isLowTime ? Colors.red[50] : Colors.blue[50],
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.timer,
            color: isLowTime ? Colors.red : Colors.blue,
          ),
          const SizedBox(width: 8),
          Text(
            '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isLowTime ? Colors.red : Colors.blue,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar(TestSessionState sessionState) {
    final progress = (sessionState.currentQuestionIndex + 1) / 
        (sessionState.currentTest?.questions?.length ?? 1);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(
              Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Question ${sessionState.currentQuestionIndex + 1} of ${sessionState.currentTest?.questions?.length ?? 0}',
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionContent(QuestionModel question, TestSessionState sessionState) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Question text
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    question.questionText,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      height: 1.5,
                    ),
                  ),
                  if (question.imageUrl != null) ...[
                    const SizedBox(height: 16),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        question.imageUrl!,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 200,
                            color: Colors.grey[300],
                            child: const Center(
                              child: Icon(Icons.broken_image),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                  if (question.audioUrl != null) ...[
                    const SizedBox(height: 16),
                    _buildAudioPlayer(question.audioUrl!),
                  ],
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Answer options
          const Text(
            'Choose your answer:',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          
          ...question.options.asMap().entries.map((entry) {
            final index = entry.key;
            final option = entry.value;
            final isSelected = sessionState.answers[question.id] == index;

            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              color: isSelected ? Theme.of(context).primaryColor.withValues(alpha: 0.1) : null,
              child: InkWell(
                onTap: () {
                  ref.read(testSessionControllerProvider.notifier)
                      .answerQuestion(question.id, index);
                },
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected 
                                ? Theme.of(context).primaryColor 
                                : Colors.grey,
                            width: 2,
                          ),
                          color: isSelected 
                              ? Theme.of(context).primaryColor 
                              : Colors.transparent,
                        ),
                        child: isSelected
                            ? const Icon(
                                Icons.check,
                                color: Colors.white,
                                size: 16,
                              )
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '${String.fromCharCode(65 + index)}. ${option.text}',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
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
    );
  }

  Widget _buildAudioPlayer(String audioUrl) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.blue[200]!),
      ),
      child: Row(
        children: [
          Icon(
            Icons.headphones,
            color: Colors.blue[700],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Audio content available',
              style: TextStyle(
                color: Colors.blue[700],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              // TODO: Implement audio player
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Audio player not implemented yet')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue[700],
              foregroundColor: Colors.white,
            ),
            child: const Text('Play'),
          ),
        ],
      ),
    );
  }

  Widget _buildNavigationButtons(TestSessionState sessionState) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton(
              onPressed: sessionState.currentQuestionIndex > 0
                  ? () {
                      ref.read(testSessionControllerProvider.notifier)
                          .previousQuestion();
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey[600],
                foregroundColor: Colors.white,
              ),
              child: const Text('Previous'),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: sessionState.currentQuestionIndex < 
                      ((sessionState.currentTest?.questions?.length ?? 0) - 1)
                  ? () {
                      ref.read(testSessionControllerProvider.notifier)
                          .nextQuestion();
                    }
                  : _submitTest,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: Text(
                sessionState.currentQuestionIndex < 
                        ((sessionState.currentTest?.questions?.length ?? 0) - 1)
                    ? 'Next'
                    : 'Submit',
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showQuestionNavigator(TestSessionState sessionState) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Question Navigator',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Flexible(
                child: GridView.builder(
                  shrinkWrap: true,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 5,
                    mainAxisSpacing: 8,
                    crossAxisSpacing: 8,
                  ),
                  itemCount: sessionState.currentTest?.questions?.length ?? 0,
                  itemBuilder: (context, index) {
                    final isAnswered = sessionState.answers.containsKey(
                      sessionState.currentTest?.questions?[index].id,
                    );
                    final isCurrent = index == sessionState.currentQuestionIndex;

                    return InkWell(
                      onTap: () {
                        ref.read(testSessionControllerProvider.notifier)
                            .goToQuestion(index);
                        Navigator.of(context).pop();
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: isCurrent
                              ? Theme.of(context).primaryColor
                              : isAnswered
                                  ? Colors.green
                                  : Colors.grey[300],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Text(
                            '${index + 1}',
                            style: TextStyle(
                              color: isCurrent || isAnswered
                                  ? Colors.white
                                  : Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showExitConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Exit Test'),
        content: const Text(
          'Are you sure you want to exit the test? Your progress will be lost.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(testSessionControllerProvider.notifier).endTest();
              context.go('/tests');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Exit'),
          ),
        ],
      ),
    );
  }

  void _submitTest() async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Submit Test'),
        content: const Text(
          'Are you sure you want to submit your test? You cannot change your answers after submission.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Submit'),
          ),
        ],
      ),
    );

    if (result == true) {
      final testResult = await ref
          .read(testSessionControllerProvider.notifier)
          .submitTest();

      if (testResult != null && mounted) {
        context.pushReplacement('/test-result', extra: testResult);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to submit test. Please try again.'),
          ),
        );
      }
    }
  }
}
