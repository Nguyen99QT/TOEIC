import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../models/test_models.dart';
import '../../../services/test_service.dart';

// Provider cho test result
final testResultProvider = FutureProvider.family<TestResult, int>((ref, resultId) async {
  return await TestService.getTestResult(resultId);
});

class TestResultPage extends ConsumerStatefulWidget {
  final int submissionId;

  const TestResultPage({super.key, required this.submissionId});

  @override
  ConsumerState<TestResultPage> createState() => _TestResultPageState();
}

class _TestResultPageState extends ConsumerState<TestResultPage> {
  bool showDetails = false;

  @override
  Widget build(BuildContext context) {
    final testResultAsync = ref.watch(testResultProvider(widget.submissionId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kết quả bài test'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        actions: [
          if (testResultAsync.hasValue && testResultAsync.value!.questions.isNotEmpty)
            TextButton(
              onPressed: () {
                setState(() {
                  showDetails = !showDetails;
                });
              },
              child: Text(
                showDetails ? 'Tóm tắt' : 'Chi tiết',
                style: const TextStyle(color: Colors.white),
              ),
            ),
        ],
      ),
      body: testResultAsync.when(
        data: (result) {
          if (showDetails) {
            return _buildDetailView(context, result);
          } else {
            return _buildSummaryView(context, result);
          }
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
                onPressed: () => ref.invalidate(testResultProvider(widget.submissionId)),
                child: const Text('Thử lại'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryView(BuildContext context, TestResult result) {
    final correctCount = result.questions.where((q) => q.isCorrect).length;
    final totalQuestions = result.questions.length;
    final percentage = totalQuestions > 0 ? (correctCount / totalQuestions * 100) : 0.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Overall Score Card
          Card(
            elevation: 4,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context).colorScheme.primary.withOpacity(0.8),
                  ],
                ),
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.emoji_events,
                    size: 48,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    result.testTitle,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '${result.totalScore}',
                    style: const TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const Text(
                    'Tổng điểm',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Score Breakdown
          Row(
            children: [
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        const Icon(Icons.headphones, size: 32, color: Colors.green),
                        const SizedBox(height: 8),
                        Text(
                          '${result.scoreListen}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                        const Text(
                          'Listening',
                          style: TextStyle(fontSize: 14, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        const Icon(Icons.book, size: 32, color: Colors.blue),
                        const SizedBox(height: 8),
                        Text(
                          '${result.scoreRead}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                        const Text(
                          'Reading',
                          style: TextStyle(fontSize: 14, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Statistics Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Thống kê chi tiết',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  _buildStatRow(
                    icon: Icons.quiz,
                    label: 'Tổng số câu',
                    value: '$totalQuestions',
                    color: Colors.blue,
                  ),
                  const SizedBox(height: 12),
                  _buildStatRow(
                    icon: Icons.check_circle,
                    label: 'Câu trả lời đúng',
                    value: '$correctCount',
                    color: Colors.green,
                  ),
                  const SizedBox(height: 12),
                  _buildStatRow(
                    icon: Icons.cancel,
                    label: 'Câu trả lời sai',
                    value: '${totalQuestions - correctCount}',
                    color: Colors.red,
                  ),
                  const SizedBox(height: 12),
                  _buildStatRow(
                    icon: Icons.percent,
                    label: 'Tỷ lệ chính xác',
                    value: '${percentage.toStringAsFixed(1)}%',
                    color: Colors.orange,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 32),

          // Action buttons
          Column(
            children: [
              if (result.questions.isNotEmpty)
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        showDetails = true;
                      });
                    },
                    icon: const Icon(Icons.visibility),
                    label: const Text('Xem chi tiết câu trả lời'),
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
                  onPressed: () {
                    context.go('/tests');
                  },
                  icon: const Icon(Icons.list),
                  label: const Text('Về danh sách test'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    context.go('/test-history');
                  },
                  icon: const Icon(Icons.history),
                  label: const Text('Xem lịch sử'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailView(BuildContext context, TestResult result) {
    return Column(
      children: [
        // Summary header
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          color: Colors.grey[100],
          child: Row(
            children: [
              Icon(Icons.analytics, color: Colors.grey[700]),
              const SizedBox(width: 8),
              Text(
                'Chi tiết từng câu hỏi',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[700],
                ),
              ),
              const Spacer(),
              Text(
                '${result.questions.where((q) => q.isCorrect).length}/${result.questions.length} đúng',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
        
        // Questions list
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: result.questions.length,
            itemBuilder: (context, index) {
              final question = result.questions[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Question header
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue[100],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'Câu ${index + 1} - Part ${question.part}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Colors.blue[800],
                              ),
                            ),
                          ),
                          const Spacer(),
                          Icon(
                            question.isCorrect ? Icons.check_circle : Icons.cancel,
                            color: question.isCorrect ? Colors.green : Colors.red,
                            size: 20,
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Question text
                      Text(
                        question.questionText,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Options
                      ...question.options.map((option) {
                        final isCorrect = option.label == question.correctOption;
                        final isUserAnswer = option.label == question.userOption;
                        
                        Color? backgroundColor;
                        Color? borderColor;
                        Color? textColor;
                        
                        if (isCorrect) {
                          backgroundColor = Colors.green[50];
                          borderColor = Colors.green;
                          textColor = Colors.green[800];
                        } else if (isUserAnswer && !question.isCorrect) {
                          backgroundColor = Colors.red[50];
                          borderColor = Colors.red;
                          textColor = Colors.red[800];
                        }
                        
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: backgroundColor,
                            border: Border.all(
                              color: borderColor ?? Colors.grey[300]!,
                              width: borderColor != null ? 2 : 1,
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: borderColor,
                                  border: borderColor == null 
                                      ? Border.all(color: Colors.grey[400]!)
                                      : null,
                                ),
                                child: Center(
                                  child: Text(
                                    option.label,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: borderColor != null ? Colors.white : Colors.grey[600],
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  option.text,
                                  style: TextStyle(
                                    color: textColor ?? Colors.grey[800],
                                    fontWeight: borderColor != null ? FontWeight.w500 : null,
                                  ),
                                ),
                              ),
                              if (isCorrect)
                                const Icon(Icons.check, color: Colors.green, size: 16),
                              if (isUserAnswer && !question.isCorrect)
                                const Icon(Icons.close, color: Colors.red, size: 16),
                            ],
                          ),
                        );
                      }).toList(),
                      
                      // Answer summary
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.grey[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Text('Đáp án đúng: ', style: TextStyle(fontWeight: FontWeight.w500)),
                                Text(
                                  question.correctOption,
                                  style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                const Text('Bạn chọn: ', style: TextStyle(fontWeight: FontWeight.w500)),
                                Text(
                                  question.userOption.isEmpty ? 'Không trả lời' : question.userOption,
                                  style: TextStyle(
                                    color: question.isCorrect ? Colors.green : Colors.red,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildStatRow({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Row(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontSize: 16),
          ),
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
}
