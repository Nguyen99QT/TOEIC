import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/test_model.dart';
import '../shared/widgets/loading_widget.dart';
import '../shared/widgets/error_widget.dart';
import '../features/tests/providers/test_provider.dart';

class TestsScreen extends ConsumerStatefulWidget {
  const TestsScreen({super.key});

  @override
  ConsumerState<TestsScreen> createState() => _TestsScreenState();
}

class _TestsScreenState extends ConsumerState<TestsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(testControllerProvider.notifier).loadAvailableTests();
    });
  }

  @override
  Widget build(BuildContext context) {
    final testState = ref.watch(testControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tests'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(testControllerProvider.notifier).loadAvailableTests();
        },
        child: _buildBody(testState),
      ),
    );
  }

  Widget _buildBody(TestState testState) {
    if (testState.isLoading) {
      return const LoadingWidget();
    }

    if (testState.error != null) {
      return CustomErrorWidget(
        message: testState.error!,
        onRetry: () {
          ref.read(testControllerProvider.notifier).loadAvailableTests();
        },
      );
    }

    if (testState.tests.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.quiz_outlined,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              'No tests available',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: testState.tests.length,
      itemBuilder: (context, index) {
        final test = testState.tests[index];
        return _buildTestCard(test);
      },
    );
  }

  Widget _buildTestCard(TestModel test) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          context.push('/test-details/${test.id}');
        },
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
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  _buildTestTypeChip(test.type),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                test.description,
                style: TextStyle(
                  color: Colors.grey[600],
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildInfoChip(
                    icon: Icons.timer,
                    label: '${test.duration} min',
                  ),
                  _buildInfoChip(
                    icon: Icons.quiz,
                    label: '${test.totalQuestions} questions',
                  ),
                  _buildDifficultyChip(test.difficulty),
                ],
              ),
            ],
          ),
        ),
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

  Widget _buildInfoChip({
    required IconData icon,
    required String label,
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
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
      ],
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
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        difficulty.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
