import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/features/exercise/providers/exercise_provider.dart';

class ExerciseQuizPage extends ConsumerStatefulWidget {
  const ExerciseQuizPage({Key? key}) : super(key: key);

  @override
  ConsumerState<ExerciseQuizPage> createState() => _ExerciseQuizPageState();
}

class _ExerciseQuizPageState extends ConsumerState<ExerciseQuizPage> {
  String? selectedAnswer;
  bool showResult = false;

  @override
  void initState() {
    super.initState();
    // Check if quiz is already started
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final quizState = ref.read(exerciseQuizProvider);
      if (quizState.exercises.isEmpty) {
        // No quiz started, go back
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No quiz session found')),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final quizState = ref.watch(exerciseQuizProvider);
    final quizNotifier = ref.read(exerciseQuizProvider.notifier);

    if (quizState.exercises.isEmpty) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (quizState.isCompleted) {
      return _buildResultsPage(quizState);
    }

    final currentExercise = quizState.currentExercise!;
    final progress = (quizState.currentIndex + 1) / quizState.exercises.length;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Question ${quizState.currentIndex + 1} of ${quizState.exercises.length}',
        ),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4.0),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white.withOpacity(0.3),
            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => _showExitDialog(),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Exercise metadata
                  Card(
                    color: Colors.blue.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Icon(Icons.quiz, color: Colors.blue.shade700),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  currentExercise.title,
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue.shade700,
                                  ),
                                ),
                                Text(
                                  '${currentExercise.type} • ${currentExercise.difficulty}',
                                  style: TextStyle(
                                    color: Colors.blue.shade600,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (currentExercise.points != null &&
                              currentExercise.points! > 0)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.amber.shade100,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${currentExercise.points} pts',
                                style: TextStyle(
                                  color: Colors.amber.shade700,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Question
                  Text(
                    'Question',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Text(
                        currentExercise.question,
                        style: const TextStyle(
                          fontSize: 18,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Media files
                  if (currentExercise.imageUrl != null ||
                      currentExercise.audioUrl != null) ...[
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            if (currentExercise.imageUrl != null) ...[
                              Row(
                                children: [
                                  const Icon(Icons.image, color: Colors.blue),
                                  const SizedBox(width: 8),
                                  const Text('Image available'),
                                  const Spacer(),
                                  TextButton(
                                    onPressed: () => _showImageDialog(
                                        currentExercise.imageUrl!),
                                    child: const Text('View'),
                                  ),
                                ],
                              ),
                            ],
                            if (currentExercise.audioUrl != null) ...[
                              Row(
                                children: [
                                  const Icon(Icons.audiotrack,
                                      color: Colors.orange),
                                  const SizedBox(width: 8),
                                  const Text('Audio available'),
                                  const Spacer(),
                                  TextButton(
                                    onPressed: () =>
                                        _playAudio(currentExercise.audioUrl!),
                                    child: const Text('Play'),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Answer options or input
                  Text(
                    currentExercise.options.isNotEmpty
                        ? 'Choose the correct answer:'
                        : 'Your answer:',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 12),

                  if (currentExercise.options.isNotEmpty) ...[
                    // Multiple choice options
                    ...currentExercise.options.asMap().entries.map((entry) {
                      final index = entry.key;
                      final option = entry.value;
                      final optionLabel =
                          String.fromCharCode(65 + index); // A, B, C, D
                      final isSelected = selectedAnswer == option;
                      final isCorrect = option == currentExercise.correctAnswer;

                      Color? backgroundColor;
                      Color? borderColor;
                      Color? textColor;

                      if (showResult) {
                        if (isCorrect) {
                          backgroundColor = Colors.green.shade50;
                          borderColor = Colors.green;
                          textColor = Colors.green.shade700;
                        } else if (isSelected) {
                          backgroundColor = Colors.red.shade50;
                          borderColor = Colors.red;
                          textColor = Colors.red.shade700;
                        }
                      } else if (isSelected) {
                        backgroundColor = Colors.blue.shade50;
                        borderColor = Colors.blue;
                        textColor = Colors.blue.shade700;
                      }

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Material(
                          color: backgroundColor ?? Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          child: InkWell(
                            onTap: showResult || quizState.isLoading
                                ? null
                                : () {
                                    setState(() {
                                      selectedAnswer = option;
                                    });
                                  },
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: borderColor ?? Colors.grey.shade300,
                                  width: isSelected || (showResult && isCorrect)
                                      ? 2
                                      : 1,
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(
                                      color:
                                          borderColor ?? Colors.grey.shade300,
                                      shape: BoxShape.circle,
                                    ),
                                    child: Center(
                                      child: Text(
                                        optionLabel,
                                        style: TextStyle(
                                          color: (isSelected ||
                                                  (showResult && isCorrect))
                                              ? Colors.white
                                              : Colors.grey.shade600,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Text(
                                      option,
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: textColor,
                                        fontWeight: (showResult && isCorrect)
                                            ? FontWeight.w600
                                            : null,
                                      ),
                                    ),
                                  ),
                                  if (showResult && isCorrect)
                                    Icon(Icons.check_circle,
                                        color: Colors.green.shade700),
                                  if (showResult && isSelected && !isCorrect)
                                    Icon(Icons.cancel,
                                        color: Colors.red.shade700),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ] else ...[
                    // Text input for fill-in-the-blank or other types
                    TextField(
                      enabled: !showResult && !quizState.isLoading,
                      onChanged: (value) {
                        setState(() {
                          selectedAnswer = value;
                        });
                      },
                      decoration: InputDecoration(
                        hintText: 'Type your answer here...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.grey.shade50,
                      ),
                      maxLines: currentExercise.type == 'essay' ? 5 : 1,
                    ),
                  ],

                  const SizedBox(height: 20),

                  // Show explanation after answer
                  if (showResult && currentExercise.explanation != null) ...[
                    Card(
                      color: Colors.amber.shade50,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.lightbulb,
                                    color: Colors.amber.shade700),
                                const SizedBox(width: 8),
                                Text(
                                  'Explanation',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.amber.shade700,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              currentExercise.explanation!,
                              style: const TextStyle(fontSize: 14, height: 1.4),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ],
              ),
            ),
          ),

          // Bottom action buttons
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, -2),
                  blurRadius: 8,
                  color: Colors.black.withOpacity(0.1),
                ),
              ],
            ),
            child: Row(
              children: [
                if (quizState.currentIndex > 0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: showResult
                          ? null
                          : () {
                              quizNotifier.previousExercise();
                              setState(() {
                                selectedAnswer = null;
                                showResult = false;
                              });
                            },
                      child: const Text('Previous'),
                    ),
                  ),
                if (quizState.currentIndex > 0) const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: _getButtonAction(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _getButtonColor(),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: _getButtonChild(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultsPage(ExerciseQuizState quizState) {
    final scorePercentage = quizState.exercises.isEmpty
        ? 0.0
        : (quizState.score / quizState.exercises.length) * 100;
    final score = quizState.score;
    final total = quizState.exercises.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Results'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Score circle
                  Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          _getScoreColor(scorePercentage),
                          _getScoreColor(scorePercentage).withOpacity(0.7),
                        ],
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '${(scorePercentage * 100).toInt()}%',
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '$score / $total',
                          style: const TextStyle(
                            fontSize: 18,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  Text(
                    _getScoreMessage(scorePercentage),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 16),

                  Text(
                    _getEncouragementMessage(scorePercentage),
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 32),

                  // Performance breakdown
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          _buildStatRow(
                              'Correct Answers', '$score', Colors.green),
                          const SizedBox(height: 12),
                          _buildStatRow('Incorrect Answers', '${total - score}',
                              Colors.red),
                          const SizedBox(height: 12),
                          _buildStatRow(
                              'Total Questions', '$total', Colors.blue),
                          const SizedBox(height: 12),
                          _buildStatRow(
                              'Accuracy',
                              '${(scorePercentage * 100).toInt()}%',
                              Colors.purple),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Action buttons
            Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      ref.read(exerciseQuizProvider.notifier).resetQuiz();
                      context.pop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text(
                      'Back to Exercises',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      ref
                          .read(exerciseQuizProvider.notifier)
                          .initializeQuiz(quizState.exercises);
                      setState(() {
                        selectedAnswer = null;
                        showResult = false;
                      });
                    },
                    child: const Text(
                      'Retry Quiz',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 16),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  VoidCallback? _getButtonAction() {
    final quizState = ref.read(exerciseQuizProvider);

    if (quizState.isLoading) return null;

    if (!showResult) {
      // Submit answer
      if (selectedAnswer == null || selectedAnswer!.trim().isEmpty) return null;
      return () async {
        await ref
            .read(exerciseQuizProvider.notifier)
            .submitAnswer(selectedAnswer!);
        setState(() {
          showResult = true;
        });
      };
    } else {
      // Next question or finish
      return () {
        if (quizState.currentIndex < quizState.exercises.length - 1) {
          ref.read(exerciseQuizProvider.notifier).nextExercise();
          setState(() {
            selectedAnswer = null;
            showResult = false;
          });
        } else {
          // Quiz completed
          ref.read(exerciseQuizProvider.notifier).nextExercise();
        }
      };
    }
  }

  Color _getButtonColor() {
    final quizState = ref.read(exerciseQuizProvider);

    if (quizState.isLoading) return Colors.grey;

    if (!showResult) {
      return (selectedAnswer == null || selectedAnswer!.trim().isEmpty)
          ? Colors.grey
          : Theme.of(context).primaryColor;
    } else {
      return Colors.green;
    }
  }

  Widget _getButtonChild() {
    final quizState = ref.read(exerciseQuizProvider);

    if (quizState.isLoading) {
      return const SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
        ),
      );
    }

    if (!showResult) {
      return const Text('Submit Answer');
    } else {
      final isLastQuestion =
          quizState.currentIndex >= quizState.exercises.length - 1;
      return Text(isLastQuestion ? 'Finish Quiz' : 'Next Question');
    }
  }

  Color _getScoreColor(double percentage) {
    if (percentage >= 0.8) return Colors.green;
    if (percentage >= 0.6) return Colors.orange;
    return Colors.red;
  }

  String _getScoreMessage(double percentage) {
    if (percentage >= 0.9) return 'Excellent!';
    if (percentage >= 0.8) return 'Great Job!';
    if (percentage >= 0.7) return 'Good Work!';
    if (percentage >= 0.6) return 'Not Bad!';
    return 'Keep Practicing!';
  }

  String _getEncouragementMessage(double percentage) {
    if (percentage >= 0.9)
      return 'Outstanding performance! You\'ve mastered this topic.';
    if (percentage >= 0.8) return 'Excellent work! You\'re doing great.';
    if (percentage >= 0.7) return 'Good job! Keep up the good work.';
    if (percentage >= 0.6)
      return 'You\'re on the right track. A bit more practice will help.';
    return 'Don\'t give up! Practice makes perfect.';
  }

  void _showExitDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Exit Quiz'),
        content: const Text(
            'Are you sure you want to exit? Your progress will be lost.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Continue Quiz'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(context);
              ref.read(exerciseQuizProvider.notifier).resetQuiz();
              context.pop();
            },
            child: const Text('Exit'),
          ),
        ],
      ),
    );
  }

  void _showImageDialog(String imageUrl) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AppBar(
              title: const Text('Image'),
              automaticallyImplyLeading: false,
              actions: [
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Image.network(
                imageUrl,
                errorBuilder: (context, error, stackTrace) =>
                    const Text('Failed to load image'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _playAudio(String audioUrl) {
    // TODO: Implement audio player
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Playing audio: $audioUrl')),
    );
  }
}
