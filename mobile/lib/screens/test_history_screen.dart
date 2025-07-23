import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../shared/widgets/loading_widget.dart';
import '../shared/widgets/error_widget.dart';
import '../features/tests/providers/test_provider.dart';

class TestHistoryScreen extends ConsumerWidget {
  const TestHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final testHistoryAsync = ref.watch(testHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Test History'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: testHistoryAsync.when(
        data: (history) => _buildHistoryList(context, history),
        loading: () => const LoadingWidget(message: 'Loading test history...'),
        error: (error, stack) => CustomErrorWidget(
          message: 'Failed to load test history',
          onRetry: () => ref.refresh(testHistoryProvider),
        ),
      ),
    );
  }

  Widget _buildHistoryList(BuildContext context, List<Map<String, dynamic>> history) {
    if (history.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.history,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              'No test history found',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Take your first test to see results here',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        // ref.refresh(testHistoryProvider);
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: history.length,
        itemBuilder: (context, index) {
          final testResult = history[index];
          return _buildHistoryCard(context, testResult);
        },
      ),
    );
  }

  Widget _buildHistoryCard(BuildContext context, Map<String, dynamic> testResult) {
    final testTitle = testResult['testTitle'] ?? 'Unknown Test';
    final score = testResult['score'] ?? 0;
    final totalQuestions = testResult['totalQuestions'] ?? 0;
    final percentage = totalQuestions > 0 ? (score / totalQuestions * 100) : 0;
    final completedAt = testResult['completedAt'] ?? testResult['completed_at'];
    final resultId = testResult['id'] ?? testResult['resultId'];

    DateTime? completedDate;
    if (completedAt != null) {
      completedDate = DateTime.tryParse(completedAt.toString());
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: resultId != null
            ? () => context.push('/test-result-details/$resultId')
            : null,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      testTitle,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  _buildScoreChip(percentage),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildInfoRow(
                    icon: Icons.quiz,
                    label: 'Score',
                    value: '$score/$totalQuestions',
                  ),
                  _buildInfoRow(
                    icon: Icons.percent,
                    label: 'Accuracy',
                    value: '${percentage.toStringAsFixed(1)}%',
                  ),
                ],
              ),
              if (completedDate != null) ...[
                const SizedBox(height: 8),
                _buildInfoRow(
                  icon: Icons.calendar_today,
                  label: 'Completed',
                  value: _formatDate(completedDate),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScoreChip(double percentage) {
    Color color;
    String label;

    if (percentage >= 80) {
      color = Colors.green;
      label = 'Excellent';
    } else if (percentage >= 60) {
      color = Colors.orange;
      label = 'Good';
    } else {
      color = Colors.red;
      label = 'Need Practice';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 16,
          color: Colors.grey[600],
        ),
        const SizedBox(width: 4),
        Text(
          '$label: ',
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
