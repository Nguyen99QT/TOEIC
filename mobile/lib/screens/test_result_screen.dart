import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class TestResultScreen extends StatelessWidget {
  final Map<String, dynamic> result;

  const TestResultScreen({
    super.key,
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    final score = result['score'] ?? 0;
    final totalQuestions = result['totalQuestions'] ?? 0;
    final percentage = totalQuestions > 0 ? (score / totalQuestions * 100) : 0;
    final timeTaken = result['timeTaken'] ?? 0; // in seconds
    final correctAnswers = result['correctAnswers'] ?? 0;
    final wrongAnswers = result['wrongAnswers'] ?? 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Test Result'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Score circle
            _buildScoreCircle(percentage),
            
            const SizedBox(height: 24),
            
            // Result details
            _buildResultCard(context, score, totalQuestions, timeTaken, correctAnswers, wrongAnswers),
            
            const SizedBox(height: 24),
            
            // Performance analysis
            _buildPerformanceAnalysis(percentage),
            
            const SizedBox(height: 24),
            
            // Action buttons
            _buildActionButtons(context),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreCircle(double percentage) {
    Color scoreColor;
    String performance;

    if (percentage >= 80) {
      scoreColor = Colors.green;
      performance = 'Excellent!';
    } else if (percentage >= 60) {
      scoreColor = Colors.orange;
      performance = 'Good';
    } else {
      scoreColor = Colors.red;
      performance = 'Need Improvement';
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 120,
                  height: 120,
                  child: CircularProgressIndicator(
                    value: percentage / 100,
                    strokeWidth: 8,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(scoreColor),
                  ),
                ),
                Column(
                  children: [
                    Text(
                      '${percentage.toStringAsFixed(1)}%',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: scoreColor,
                      ),
                    ),
                    Text(
                      performance,
                      style: TextStyle(
                        color: scoreColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard(BuildContext context, int score, int totalQuestions, int timeTaken, 
                          int correctAnswers, int wrongAnswers) {
    final minutes = timeTaken ~/ 60;
    final seconds = timeTaken % 60;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Test Summary',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildSummaryRow(
              icon: Icons.quiz,
              label: 'Total Questions',
              value: totalQuestions.toString(),
            ),
            const SizedBox(height: 12),
            _buildSummaryRow(
              icon: Icons.check_circle,
              label: 'Correct Answers',
              value: correctAnswers.toString(),
              valueColor: Colors.green,
            ),
            const SizedBox(height: 12),
            _buildSummaryRow(
              icon: Icons.cancel,
              label: 'Wrong Answers',
              value: wrongAnswers.toString(),
              valueColor: Colors.red,
            ),
            const SizedBox(height: 12),
            _buildSummaryRow(
              icon: Icons.timer,
              label: 'Time Taken',
              value: '${minutes}m ${seconds}s',
            ),
            const SizedBox(height: 12),
            _buildSummaryRow(
              icon: Icons.score,
              label: 'Final Score',
              value: '$score / $totalQuestions',
              valueColor: Theme.of(context).primaryColor,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow({
    required IconData icon,
    required String label,
    required String value,
    Color? valueColor,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 20,
          color: Colors.grey[600],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: valueColor ?? Colors.black,
          ),
        ),
      ],
    );
  }

  Widget _buildPerformanceAnalysis(double percentage) {
    String advice;
    IconData icon;
    Color color;

    if (percentage >= 80) {
      advice = 'Outstanding performance! Keep up the excellent work and continue practicing to maintain your high level.';
      icon = Icons.emoji_events;
      color = Colors.green;
    } else if (percentage >= 60) {
      advice = 'Good job! You\'re on the right track. Focus on reviewing incorrect answers and practice more to improve.';
      icon = Icons.thumb_up;
      color = Colors.orange;
    } else {
      advice = 'Don\'t give up! Review the fundamentals, practice regularly, and consider additional study materials.';
      icon = Icons.school;
      color = Colors.red;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: color,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Performance Analysis',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              advice,
              style: TextStyle(
                color: Colors.grey[700],
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () {
              context.go('/tests');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text(
              'Take Another Test',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () {
              context.go('/test-history');
            },
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              side: BorderSide(color: Theme.of(context).primaryColor),
            ),
            child: Text(
              'View Test History',
              style: TextStyle(
                fontSize: 16,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: () {
              context.go('/dashboard');
            },
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text(
              'Back to Dashboard',
              style: TextStyle(
                fontSize: 16,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
