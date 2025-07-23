import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/test_model.dart';
import '../shared/widgets/loading_widget.dart';
import '../shared/widgets/error_widget.dart';
import '../features/tests/providers/test_provider.dart';

class TestDetailsScreen extends ConsumerWidget {
  final int testId;

  const TestDetailsScreen({
    super.key,
    required this.testId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Test Details'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<TestModel?>(
        future: ref.read(testControllerProvider.notifier).getTestDetails(testId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const LoadingWidget(message: 'Loading test details...');
          }

          if (snapshot.hasError || snapshot.data == null) {
            return CustomErrorWidget(
              message: 'Failed to load test details',
              onRetry: () {
                // Trigger rebuild
                context.push('/test-details/$testId');
              },
            );
          }

          final test = snapshot.data!;
          return _buildTestDetails(context, ref, test);
        },
      ),
    );
  }

  Widget _buildTestDetails(BuildContext context, WidgetRef ref, TestModel test) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Test header
          _buildTestHeader(test),
          
          const SizedBox(height: 24),
          
          // Test info
          _buildTestInfo(test),
          
          const SizedBox(height: 24),
          
          // Description
          _buildDescription(test),
          
          const SizedBox(height: 32),
          
          // Start button
          _buildStartButton(context, ref, test),
        ],
      ),
    );
  }

  Widget _buildTestHeader(TestModel test) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    test.title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                _buildTestTypeChip(test.type),
              ],
            ),
            const SizedBox(height: 8),
            _buildDifficultyChip(test.difficulty),
          ],
        ),
      ),
    );
  }

  Widget _buildTestInfo(TestModel test) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Test Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildInfoRow(
              icon: Icons.timer,
              label: 'Duration',
              value: '${test.duration} minutes',
            ),
            const SizedBox(height: 12),
            _buildInfoRow(
              icon: Icons.quiz,
              label: 'Questions',
              value: '${test.totalQuestions} questions',
            ),
            const SizedBox(height: 12),
            _buildInfoRow(
              icon: Icons.category,
              label: 'Type',
              value: test.type.toUpperCase(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDescription(TestModel test) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Description',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              test.description,
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

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
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
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildStartButton(BuildContext context, WidgetRef ref, TestModel test) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () {
          _showStartConfirmation(context, ref, test);
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Theme.of(context).primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: const Text(
          'Start Test',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  void _showStartConfirmation(BuildContext context, WidgetRef ref, TestModel test) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Start Test'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Are you ready to start this test?'),
            const SizedBox(height: 16),
            Text(
              'Duration: ${test.duration} minutes',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              'Questions: ${test.totalQuestions}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Once started, the timer will begin immediately.',
              style: TextStyle(
                color: Colors.orange,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.of(context).pop();
              
              final success = await ref
                  .read(testSessionControllerProvider.notifier)
                  .startTest(test);
              
              if (success && context.mounted) {
                context.push('/test-session/${test.id}');
              } else if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Failed to start test. Please try again.'),
                  ),
                );
              }
            },
            child: const Text('Start'),
          ),
        ],
      ),
    );
  }

  Widget _buildTestTypeChip(String type) {
    Color color;
    String label;
    
    switch (type.toLowerCase()) {
      case 'listening':
        color = Colors.blue;
        label = 'Listening';
        break;
      case 'reading':
        color = Colors.green;
        label = 'Reading';
        break;
      case 'full':
        color = Colors.purple;
        label = 'Full Test';
        break;
      default:
        color = Colors.grey;
        label = type;
    }

    return Chip(
      label: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
        ),
      ),
      backgroundColor: color,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Widget _buildDifficultyChip(String difficulty) {
    Color color;
    
    switch (difficulty.toLowerCase()) {
      case 'easy':
        color = Colors.green;
        break;
      case 'medium':
        color = Colors.orange;
        break;
      case 'hard':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color),
      ),
      child: Text(
        difficulty.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
