import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';

class ResultScreen extends StatelessWidget {
  final Map<int, Answer> selectedAnswers;
  final List<Question> questions;

  const ResultScreen({
    super.key,
    required this.selectedAnswers,
    required this.questions,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate score
    final totalQuestions = questions.length;
    final answeredQuestions = selectedAnswers.length;
    final correctAnswers = _countCorrectAnswers();
    final accuracy =
        totalQuestions > 0
            ? (correctAnswers / totalQuestions * 100).toStringAsFixed(1)
            : '0';

    return Scaffold(
      appBar: AppBar(title: const Text('Exercise Results')),
      body: Column(
        children: [
          // Score card
          Card(
            margin: const EdgeInsets.all(16),
            elevation: 3,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Score header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        correctAnswers >= totalQuestions / 2
                            ? Icons.check_circle
                            : Icons.info,
                        size: 32,
                        color:
                            correctAnswers >= totalQuestions / 2
                                ? Colors.green
                                : Colors.orange,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        correctAnswers >= totalQuestions / 2
                            ? 'Good job!'
                            : 'Keep practicing!',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Score details
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildScoreItem(
                        icon: Icons.check_circle,
                        label: 'Correct',
                        value: '$correctAnswers',
                        color: Colors.green,
                      ),
                      _buildScoreItem(
                        icon: Icons.cancel,
                        label: 'Incorrect',
                        value: '${answeredQuestions - correctAnswers}',
                        color: Colors.red,
                      ),
                      _buildScoreItem(
                        icon: Icons.help_outline,
                        label: 'Unanswered',
                        value: '${totalQuestions - answeredQuestions}',
                        color: Colors.grey,
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Score percentage
                  CircularProgressIndicator(
                    value: correctAnswers / totalQuestions,
                    backgroundColor: Colors.grey[300],
                    color: _getScoreColor(correctAnswers / totalQuestions),
                    strokeWidth: 10,
                  ),

                  const SizedBox(height: 16),

                  Text(
                    '$accuracy%',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: _getScoreColor(correctAnswers / totalQuestions),
                    ),
                  ),

                  Text(
                    'Accuracy',
                    style: TextStyle(fontSize: 16, color: Colors.grey[700]),
                  ),
                ],
              ),
            ),
          ),

          // Question summary header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Text(
                  'Question Summary',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Icon(Icons.circle, size: 12, color: Colors.green),
                const SizedBox(width: 4),
                const Text('Correct'),
                const SizedBox(width: 8),
                Icon(Icons.circle, size: 12, color: Colors.red),
                const SizedBox(width: 4),
                const Text('Incorrect'),
                const SizedBox(width: 8),
                Icon(Icons.circle, size: 12, color: Colors.grey),
                const SizedBox(width: 4),
                const Text('Unanswered'),
              ],
            ),
          ),

          // Question list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: questions.length,
              itemBuilder: (context, index) {
                final question = questions[index];
                final selectedAnswer = selectedAnswers[question.id];
                final isCorrect = selectedAnswer?.isCorrect ?? false;
                final isAnswered = selectedAnswer != null;

                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor:
                          isAnswered
                              ? (isCorrect ? Colors.green : Colors.red)
                              : Colors.grey,
                      child: Text(
                        '${index + 1}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(
                      question.content.length > 50
                          ? '${question.content.substring(0, 50)}...'
                          : question.content,
                    ),
                    subtitle:
                        isAnswered
                            ? Text(
                              isCorrect
                                  ? 'Correct: ${selectedAnswer.content}'
                                  : 'Incorrect: ${selectedAnswer.content}',
                              style: TextStyle(
                                color: isCorrect ? Colors.green : Colors.red,
                              ),
                            )
                            : const Text('Not answered'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      // Navigate to question detail or explanation
                      // Implementation would go here
                    },
                  ),
                );
              },
            ),
          ),

          // Action buttons
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Exit'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        // Reset and retry the exercise
                        Navigator.of(context).pop();
                        // You could also navigate to the exercise screen again
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: Theme.of(context).primaryColor,
                      ),
                      child: const Text('Try Again'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  int _countCorrectAnswers() {
    int count = 0;
    for (var entry in selectedAnswers.entries) {
      if (entry.value.isCorrect) {
        count++;
      }
    }
    return count;
  }

  Color _getScoreColor(double ratio) {
    if (ratio >= 0.8) {
      return Colors.green;
    } else if (ratio >= 0.6) {
      return Colors.lightGreen;
    } else if (ratio >= 0.4) {
      return Colors.orange;
    } else {
      return Colors.red;
    }
  }

  Widget _buildScoreItem({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(label, style: const TextStyle(fontSize: 14)),
      ],
    );
  }
}
