import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../models/test_models.dart';
import '../../../services/test_service.dart';

// Provider cho test result với resultId cụ thể
final specificTestResultProvider = FutureProvider.family<TestResult?, int>((ref, resultId) async {
  try {
    // Get detailed result for display but convert to simple TestResult format
    final detailResult = await TestService.getTestResultDetail(resultId);
    // Create a simple TestResult from the detailed data
    return TestResult(
      resultId: detailResult.resultId,
      testTitle: detailResult.testTitle,
      user: 'Test User', // Simple placeholder
      scoreListen: detailResult.listeningScore,
      scoreRead: detailResult.readingScore,
      totalScore: detailResult.totalScore,
      questions: [], // Empty for simple view
    );
  } catch (e) {
    print('Error loading specific test result: $e');
    return null;
  }
});

// Provider cho test result từ history (latest entry)
final latestTestResultProvider = FutureProvider<TestResult?>((ref) async {
  try {
    final history = await TestService.getTestHistory();
    return history.isNotEmpty ? history.first : null;
  } catch (e) {
    return null;
  }
});

class TestResultSimplePage extends ConsumerWidget {
  final String? message;
  final int? score;
  final int? resultId; // Add resultId parameter

  const TestResultSimplePage({
    super.key,
    this.message,
    this.score,
    this.resultId, // Add resultId parameter
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Use specific result if resultId is provided, otherwise use latest
    final resultAsync = resultId != null 
        ? ref.watch(specificTestResultProvider(resultId!))
        : ref.watch(latestTestResultProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kết quả bài test'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Success header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.green[200]!),
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.check_circle,
                    size: 64,
                    color: Colors.green[600],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Nộp bài thành công!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.green[800],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    message ?? 'Bài test đã được nộp thành công',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.green[700],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Score display
            resultAsync.when(
              data: (result) {
                if (result != null) {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.blue[200]!),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Điểm số của bạn',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue[800],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildScoreItem(
                              'Listening',
                              result.scoreListen.toString(),
                              Colors.blue,
                            ),
                            _buildScoreItem(
                              'Reading',
                              result.scoreRead.toString(),
                              Colors.orange,
                            ),
                            _buildScoreItem(
                              'Tổng điểm',
                              result.totalScore.toString(),
                              Colors.green,
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                } else if (score != null) {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.blue[200]!),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Điểm số của bạn',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue[800],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          score.toString(),
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue[600],
                          ),
                        ),
                      ],
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
              loading: () => Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Column(
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 12),
                    Text('Đang tải kết quả...'),
                  ],
                ),
              ),
              error: (error, stack) => Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.orange[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.orange[200]!),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.info,
                      color: Colors.orange[600],
                      size: 32,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Kết quả chi tiết sẽ có sẵn trong lịch sử',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),

            const Spacer(),

            // Action buttons
            Column(
              children: [
                // View detailed results button (if we have a result)
                resultAsync.when(
                  data: (result) {
                    if (result != null) {
                      // Use the specific resultId if provided, otherwise use the result's ID
                      final useResultId = resultId ?? result.resultId;
                      return Column(
                        children: [
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () => context.go('/test-result-detail/$useResultId'),
                              icon: const Icon(Icons.visibility),
                              label: const Text('Xem chi tiết đáp án'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.indigo,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                        ],
                      );
                    }
                    return const SizedBox.shrink();
                  },
                  loading: () => const SizedBox.shrink(),
                  error: (_, __) => const SizedBox.shrink(),
                ),
                
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => context.go('/test-history'),
                    icon: const Icon(Icons.history),
                    label: const Text('Xem lịch sử làm bài'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => context.go('/tests'),
                    icon: const Icon(Icons.quiz),
                    label: const Text('Làm bài test khác'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: TextButton.icon(
                    onPressed: () => context.go('/dashboard'),
                    icon: const Icon(Icons.home),
                    label: const Text('Về trang chủ'),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
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

  Widget _buildScoreItem(String label, String score, Color color) {
    return Column(
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: color,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          score,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}
