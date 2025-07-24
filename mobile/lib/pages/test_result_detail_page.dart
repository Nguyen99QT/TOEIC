import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/test_models.dart';
import '../services/test_service.dart';

// Provider for detailed test result
final testResultDetailProvider = FutureProvider.family<TestResultDetail, int>(
  (ref, resultId) => TestService.getTestResultDetail(resultId),
);

class TestResultDetailPage extends ConsumerStatefulWidget {
  final int resultId;

  const TestResultDetailPage({
    super.key,
    required this.resultId,
  });

  @override
  ConsumerState<TestResultDetailPage> createState() => _TestResultDetailPageState();
}

class _TestResultDetailPageState extends ConsumerState<TestResultDetailPage> {
  int selectedPart = 0; // 0 means all parts
  
  @override
  Widget build(BuildContext context) {
    final resultDetailAsync = ref.watch(testResultDetailProvider(widget.resultId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi tiết kết quả bài test'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: resultDetailAsync.when(
        loading: () => const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Đang tải chi tiết kết quả...'),
            ],
          ),
        ),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'Lỗi khi tải chi tiết kết quả:\n$error',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.red),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.invalidate(testResultDetailProvider(widget.resultId)),
                child: const Text('Thử lại'),
              ),
            ],
          ),
        ),
        data: (resultDetail) => _buildDetailView(context, resultDetail),
      ),
    );
  }

  Widget _buildDetailView(BuildContext context, TestResultDetail resultDetail) {
    return Column(
      children: [
        // Header with summary
        _buildSummaryCard(resultDetail),
        
        // Part filter
        _buildPartFilter(resultDetail),
        
        // Questions list
        Expanded(
          child: _buildQuestionsList(resultDetail),
        ),
      ],
    );
  }

  Widget _buildSummaryCard(TestResultDetail resultDetail) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              resultDetail.testTitle,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildScoreInfo('Tổng điểm', resultDetail.totalScore, Colors.blue),
                _buildScoreInfo('Nghe', resultDetail.listeningScore, Colors.green),
                _buildScoreInfo('Đọc', resultDetail.readingScore, Colors.orange),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Đúng: ${resultDetail.correctAnswers}/${resultDetail.totalQuestions}'),
                Text('Tỷ lệ: ${resultDetail.percentage.toStringAsFixed(1)}%'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreInfo(String label, int score, Color color) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        Text(
          score.toString(),
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildPartFilter(TestResultDetail resultDetail) {
    final partScores = resultDetail.getPartScores();
    
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          // All parts filter
          _buildPartFilterChip(
            'Tất cả',
            selectedPart == 0,
            () => setState(() => selectedPart = 0),
            resultDetail.correctAnswers,
            resultDetail.totalQuestions,
          ),
          
          // Individual part filters
          ...partScores.map((partScore) => _buildPartFilterChip(
            'Part ${partScore.partNumber}',
            selectedPart == partScore.partNumber,
            () => setState(() => selectedPart = partScore.partNumber),
            partScore.correctAnswers,
            partScore.totalQuestions,
          )),
        ],
      ),
    );
  }

  Widget _buildPartFilterChip(String label, bool isSelected, VoidCallback onTap, int correct, int total) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label),
            Text(
              '$correct/$total',
              style: const TextStyle(fontSize: 10),
            ),
          ],
        ),
        selected: isSelected,
        onSelected: (_) => onTap(),
        backgroundColor: Colors.grey[200],
        selectedColor: Theme.of(context).colorScheme.primaryContainer,
      ),
    );
  }

  Widget _buildQuestionsList(TestResultDetail resultDetail) {
    final questions = selectedPart == 0
        ? resultDetail.answers
        : resultDetail.answers.where((q) => q.partNumber == selectedPart).toList();
    
    if (questions.isEmpty) {
      return const Center(
        child: Text('Không có câu hỏi nào trong phần này'),
      );
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: questions.length,
      itemBuilder: (context, index) {
        final question = questions[index];
        return _buildQuestionCard(question, index + 1);
      },
    );
  }

  Widget _buildQuestionCard(QuestionAnswerDetail question, int questionNumber) {
    final isCorrect = question.isCorrect;
    final borderColor = isCorrect ? Colors.green : Colors.red;
    final backgroundColor = isCorrect ? Colors.green.shade50 : Colors.red.shade50;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: borderColor, width: 2),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(12),
        ),
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
                      color: isCorrect ? Colors.green : Colors.red,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Câu $questionNumber',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Part ${question.partNumber}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    isCorrect ? Icons.check_circle : Icons.cancel,
                    color: isCorrect ? Colors.green : Colors.red,
                    size: 24,
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Question content
              if (question.imageUrl != null && question.imageUrl!.isNotEmpty)
                _buildQuestionImage(question.imageUrl!),
              
              if (question.audioUrl != null && question.audioUrl!.isNotEmpty)
                _buildQuestionAudio(question.audioUrl!),
              
              if (question.questionText.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(
                  question.questionText,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
              
              const SizedBox(height: 12),
              
              // Answer options
              ...question.options.map((option) => _buildOptionTile(
                option,
                question.selectedOption,
                question.correctOption,
              )),
              
              const SizedBox(height: 8),
              
              // Answer summary
              _buildAnswerSummary(question),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuestionImage(String imageUrl) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Image.network(
          imageUrl,
          width: double.infinity,
          height: 200,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.broken_image, size: 48, color: Colors.grey),
                    Text('Không thể tải hình ảnh'),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildQuestionAudio(String audioUrl) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.blue.shade200),
      ),
      child: Row(
        children: [
          Icon(Icons.volume_up, color: Colors.blue.shade700),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Audio: ${audioUrl.split('/').last}',
              style: TextStyle(
                color: Colors.blue.shade700,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.play_arrow, color: Colors.blue.shade700),
            onPressed: () {
              // For now, just show a message. You can implement audio player later
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Audio player feature will be implemented: $audioUrl'),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildOptionTile(OptionDetail option, String userAnswer, String correctAnswer) {
    final isUserChoice = option.label == userAnswer;
    final isCorrectAnswer = option.label == correctAnswer;
    final isUserWrong = isUserChoice && !isCorrectAnswer;
    
    Color? backgroundColor;
    Color? textColor = Colors.black87;
    IconData? icon;
    Color? iconColor;
    
    if (isCorrectAnswer) {
      backgroundColor = Colors.green.shade100;
      icon = Icons.check_circle;
      iconColor = Colors.green;
    } else if (isUserWrong) {
      backgroundColor = Colors.red.shade100;
      icon = Icons.cancel;
      iconColor = Colors.red;
    }
    
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: backgroundColor,
        border: Border.all(
          color: isCorrectAnswer 
              ? Colors.green 
              : isUserWrong 
                  ? Colors.red 
                  : Colors.grey.shade300,
          width: isCorrectAnswer || isUserWrong ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        dense: true,
        leading: CircleAvatar(
          radius: 16,
          backgroundColor: isCorrectAnswer 
              ? Colors.green 
              : isUserWrong 
                  ? Colors.red 
                  : Colors.grey.shade300,
          child: Text(
            option.label,
            style: TextStyle(
              color: isCorrectAnswer || isUserWrong ? Colors.white : Colors.black87,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
        title: Text(
          option.content,
          style: TextStyle(
            color: textColor,
            fontWeight: isCorrectAnswer || isUserWrong ? FontWeight.w500 : FontWeight.normal,
          ),
        ),
        trailing: icon != null 
            ? Icon(icon, color: iconColor, size: 20) 
            : null,
      ),
    );
  }

  Widget _buildAnswerSummary(QuestionAnswerDetail question) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Bạn đã chọn: ${question.selectedOption.isNotEmpty ? question.selectedOption : 'Không chọn'}',
                  style: TextStyle(
                    color: question.isCorrect ? Colors.green.shade700 : Colors.red.shade700,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  'Đáp án đúng: ${question.correctOption}',
                  style: TextStyle(
                    color: Colors.green.shade700,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: question.isCorrect ? Colors.green : Colors.red,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              question.isCorrect ? 'ĐÚNG' : 'SAI',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
