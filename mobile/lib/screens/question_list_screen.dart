import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/toeic_study_models.dart';
import '../widgets/question_widget.dart';

class QuestionListScreen extends StatefulWidget {
  final List<Question> questions;

  const QuestionListScreen({Key? key, required this.questions})
    : super(key: key);

  @override
  _QuestionListScreenState createState() => _QuestionListScreenState();
}

class _QuestionListScreenState extends State<QuestionListScreen> {
  late PageController _pageController;
  int _currentIndex = 0;
  Map<int, Answer> _selectedAnswers = {};
  bool _isSubmitted = false;
  bool _isAudioPlaying = false;
  DateTime? _startTime;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startTime = DateTime.now();

    // If we have audio for the first question, set up to play it automatically
    if (widget.questions.isNotEmpty &&
        widget.questions[0].audioUrl != null &&
        _isListeningSection(widget.questions[0].section)) {
      _playAudio(widget.questions[0]);
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  bool _isListeningSection(QuestionSection section) {
    return section == QuestionSection.LISTENING_PART1 ||
        section == QuestionSection.LISTENING_PART2 ||
        section == QuestionSection.LISTENING_PART3 ||
        section == QuestionSection.LISTENING_PART4;
  }

  void _playAudio(Question question) {
    if (question.audioUrl == null) return;

    setState(() => _isAudioPlaying = true);

    // Here you would implement the actual audio playback using a package like just_audio
    // For now, we'll just simulate audio playback with a delay
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() => _isAudioPlaying = false);
      }
    });
  }

  void _selectAnswer(Question question, Answer answer) {
    if (_isSubmitted) return; // Don't allow changes after submission

    setState(() {
      _selectedAnswers[question.id] = answer;
    });

    // Auto-advance to next question after a short delay
    Future.delayed(const Duration(milliseconds: 500), () {
      if (_currentIndex < widget.questions.length - 1) {
        _pageController.nextPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  void _submitAnswers() {
    setState(() => _isSubmitted = true);

    // Calculate score
    int correctCount = 0;
    for (var question in widget.questions) {
      final selectedAnswer = _selectedAnswers[question.id];
      if (selectedAnswer != null && selectedAnswer.isCorrect) {
        correctCount++;
      }
    }

    // Calculate time taken
    final endTime = DateTime.now();
    final duration = endTime.difference(_startTime!);

    // Show results dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder:
          (context) => AlertDialog(
            title: const Text('Exercise Results'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  color: Colors.green,
                  size: 64,
                ),
                const SizedBox(height: 16),
                Text(
                  'Score: $correctCount / ${widget.questions.length}',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Accuracy: ${(correctCount / widget.questions.length * 100).toStringAsFixed(1)}%',
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 8),
                Text(
                  'Time: ${_formatDuration(duration)}',
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop(); // Close dialog
                  // If you want to review answers, you can leave the screen open
                  // Otherwise you can also pop this screen to go back
                },
                child: const Text('Review Answers'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop(); // Close dialog
                  Navigator.of(context).pop(); // Go back to exercise screen
                },
                child: const Text('Done'),
              ),
            ],
          ),
    );
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    if (widget.questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Questions')),
        body: const Center(child: Text('No questions available')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Question ${_currentIndex + 1}/${widget.questions.length}'),
        actions: [
          if (widget.questions[_currentIndex].audioUrl != null &&
              _isListeningSection(widget.questions[_currentIndex].section))
            IconButton(
              icon: Icon(_isAudioPlaying ? Icons.pause : Icons.volume_up),
              onPressed: () => _playAudio(widget.questions[_currentIndex]),
              tooltip: 'Play audio',
            ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          LinearProgressIndicator(
            value: (_currentIndex + 1) / widget.questions.length,
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation<Color>(
              Theme.of(context).primaryColor,
            ),
          ),

          // Questions pager
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: widget.questions.length,
              onPageChanged: (index) {
                setState(() => _currentIndex = index);

                // Play audio automatically for listening questions
                final question = widget.questions[index];
                if (question.audioUrl != null &&
                    _isListeningSection(question.section) &&
                    !_isAudioPlaying) {
                  _playAudio(question);
                }

                // Provide haptic feedback when changing pages
                HapticFeedback.lightImpact();
              },
              itemBuilder: (context, index) {
                final question = widget.questions[index];
                return SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: QuestionWidget(
                      question: question,
                      onAnswerSelected:
                          (answer) => _selectAnswer(question, answer),
                      showResult: _isSubmitted,
                      selectedAnswer: _selectedAnswers[question.id],
                    ),
                  ),
                );
              },
            ),
          ),

          // Bottom navigation
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back button
                  ElevatedButton.icon(
                    onPressed:
                        _currentIndex > 0
                            ? () {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            }
                            : null,
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Previous'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[200],
                      foregroundColor: Colors.black87,
                    ),
                  ),

                  // Submit or Next button
                  _currentIndex < widget.questions.length - 1
                      ? ElevatedButton.icon(
                        onPressed: () {
                          _pageController.nextPage(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                        },
                        icon: const Icon(Icons.arrow_forward),
                        label: const Text('Next'),
                      )
                      : ElevatedButton.icon(
                        onPressed:
                            _isSubmitted ||
                                    _selectedAnswers.length <
                                        widget.questions.length
                                ? null
                                : _submitAnswers,
                        icon: const Icon(Icons.check_circle),
                        label: const Text('Submit'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
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
}
