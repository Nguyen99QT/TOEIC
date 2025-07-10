import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';

class QuestionWidget extends StatefulWidget {
  final Question question;
  final Function(Answer) onAnswerSelected;
  final bool showResult;
  final Answer? selectedAnswer;

  const QuestionWidget({
    super.key,
    required this.question,
    required this.onAnswerSelected,
    this.showResult = false,
    this.selectedAnswer,
  });

  @override
  _QuestionWidgetState createState() => _QuestionWidgetState();
}

class _QuestionWidgetState extends State<QuestionWidget> {
  Answer? _selectedAnswer;

  @override
  void initState() {
    super.initState();
    _selectedAnswer = widget.selectedAnswer;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${widget.question.section.toString().split('.').last} - Level ${widget.question.difficultyLevel}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  'Question #${widget.question.id}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.blue,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Image if available
            if (widget.question.imageUrl != null)
              Container(
                width: double.infinity,
                constraints: const BoxConstraints(maxHeight: 200),
                margin: const EdgeInsets.only(bottom: 16),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    widget.question.imageUrl!,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 100,
                        color: Colors.grey[200],
                        child: const Center(
                          child: Icon(Icons.error, color: Colors.grey),
                        ),
                      );
                    },
                  ),
                ),
              ),

            // Audio player if available
            if (widget.question.audioUrl != null)
              Container(
                width: double.infinity,
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.volume_up, color: Colors.blue[600]),
                    const SizedBox(width: 8),
                    const Text('Audio available'),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: () {
                        // TODO: Implement audio playback
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Audio playback not implemented yet'),
                          ),
                        );
                      },
                      child: const Icon(Icons.play_arrow),
                    ),
                  ],
                ),
              ),

            // Question content
            Text(
              widget.question.content,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 20),

            // Answer options
            ...widget.question.answers.asMap().entries.map(
              (entry) => _buildAnswerOption(entry.value),
            ),

            // Result display
            if (widget.showResult) _buildResultDisplay(),
          ],
        ),
      ),
    );
  }

  Widget _buildAnswerOption(Answer answer) {
    final isSelected = _selectedAnswer?.id == answer.id;
    final isCorrect = answer.isCorrect;
    final showResult = widget.showResult;

    Color? backgroundColor;
    Color? borderColor;
    Color? textColor;

    if (showResult) {
      if (isCorrect) {
        backgroundColor = Colors.green[50];
        borderColor = Colors.green[400];
        textColor = Colors.green[800];
      } else if (isSelected && !isCorrect) {
        backgroundColor = Colors.red[50];
        borderColor = Colors.red[400];
        textColor = Colors.red[800];
      } else {
        backgroundColor = Colors.grey[50];
        borderColor = Colors.grey[300];
        textColor = Colors.grey[700];
      }
    } else {
      if (isSelected) {
        backgroundColor = Colors.blue[50];
        borderColor = Colors.blue[400];
        textColor = Colors.blue[800];
      } else {
        backgroundColor = Colors.white;
        borderColor = Colors.grey[300];
        textColor = Colors.black87;
      }
    }

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: showResult ? null : () => _handleAnswerSelection(answer),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: backgroundColor,
            border: Border.all(color: borderColor!, width: 2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isSelected ? borderColor : Colors.transparent,
                  border: Border.all(color: borderColor),
                  borderRadius: BorderRadius.circular(12),
                ),
                child:
                    isSelected
                        ? Icon(Icons.check, size: 16, color: Colors.white)
                        : null,
              ),
              const SizedBox(width: 12),
              Text(
                '${answer.optionLabel}.',
                style: TextStyle(fontWeight: FontWeight.bold, color: textColor),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(answer.content, style: TextStyle(color: textColor)),
              ),
              if (showResult && isCorrect)
                Icon(Icons.check_circle, color: Colors.green[600], size: 20),
              if (showResult && isSelected && !isCorrect)
                Icon(Icons.cancel, color: Colors.red[600], size: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResultDisplay() {
    final correctAnswer = widget.question.answers.firstWhere(
      (a) => a.isCorrect,
    );
    final isCorrect = _selectedAnswer?.isCorrect == true;

    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isCorrect ? Icons.check_circle : Icons.cancel,
                color: isCorrect ? Colors.green : Colors.red,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                isCorrect ? 'Correct!' : 'Incorrect',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isCorrect ? Colors.green[700] : Colors.red[700],
                ),
              ),
            ],
          ),
          if (!isCorrect) ...[
            const SizedBox(height: 8),
            Text(
              'Correct answer: ${correctAnswer.optionLabel}. ${correctAnswer.content}',
              style: TextStyle(color: Colors.grey[700], fontSize: 14),
            ),
          ],
        ],
      ),
    );
  }

  void _handleAnswerSelection(Answer answer) {
    setState(() {
      _selectedAnswer = answer;
    });
    widget.onAnswerSelected(answer);
  }
}
