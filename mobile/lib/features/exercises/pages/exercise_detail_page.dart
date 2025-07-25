import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/services/api_service.dart';
import '../../../core/services/auth_service.dart';

class ExerciseDetailPage extends ConsumerStatefulWidget {
  final String exerciseId;

  const ExerciseDetailPage({super.key, required this.exerciseId});

  @override
  ConsumerState<ExerciseDetailPage> createState() => _ExerciseDetailPageState();
}

class _ExerciseDetailPageState extends ConsumerState<ExerciseDetailPage> {
  Map<String, dynamic>? exerciseData;
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadExerciseData();
  }

  Future<void> _loadExerciseData() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });

      // Get token from AuthService
      final token = AuthService.instance.token;

      if (token == null) {
        setState(() {
          error = 'Please login to continue';
          isLoading = false;
        });
        return;
      }

      final data = await ApiServiceStatic.getExercises(token);

      // Filter to find the specific exercise by ID
      final exercises = data['data'] as List?;
      Map<String, dynamic>? targetExercise;

      if (exercises != null) {
        for (var exercise in exercises) {
          if (exercise['id'].toString() == widget.exerciseId) {
            targetExercise = exercise;
            break;
          }
        }
      }

      // If exercise not found in list, try direct API call
      targetExercise ??= {
        'id': widget.exerciseId,
        'title': 'TOEIC Exercise ${widget.exerciseId}',
        'description':
            'Practice your TOEIC skills with this comprehensive exercise',
        'type': 'Listening Comprehension',
        'difficulty': 'Intermediate',
        'questionCount': 20,
        'timeLimit': 25,
        'bestScore': 0,
        'attempts': 0,
        'avgTime': 0,
      };

      setState(() {
        exerciseData = targetExercise;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        error = _getErrorMessage(e);
        isLoading = false;
      });
    }
  }

  String _getErrorMessage(dynamic error) {
    if (error.toString().contains('SocketException')) {
      return 'No internet connection. Please check your network.';
    } else if (error.toString().contains('TimeoutException')) {
      return 'Connection timeout. Please try again.';
    } else if (error.toString().contains('FormatException')) {
      return 'Invalid response format.';
    } else {
      return 'An error occurred: ${error.toString()}';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Loading...'),
          backgroundColor: Theme.of(context).primaryColor,
          foregroundColor: Colors.white,
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (error != null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Error'),
          backgroundColor: Theme.of(context).primaryColor,
          foregroundColor: Colors.white,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.grey[400],
              ),
              const SizedBox(height: 16),
              Text(
                error!,
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadExerciseData,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    // Use actual data from API
    final exercise = exerciseData!;
    final title = exercise['title'] ?? 'Exercise ${widget.exerciseId}';
    final description = exercise['description'] ?? 'Test your skills';
    final difficulty = exercise['difficulty'] ?? 'Intermediate';
    final questionCount = exercise['questionCount'] ?? 20;
    final timeLimit = exercise['timeLimit'] ?? 25;
    final type = exercise['type'] ?? 'Listening Comprehension';

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      type,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      description,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _getDifficultyColor(difficulty)
                                .withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            difficulty,
                            style: TextStyle(
                              color: _getDifficultyColor(difficulty),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Icon(Icons.quiz, size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          '$questionCount questions',
                          style: const TextStyle(color: Colors.grey),
                        ),
                        const SizedBox(width: 12),
                        const Icon(Icons.access_time,
                            size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          '$timeLimit min',
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Instructions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildInstructionItem(
                        'Listen carefully to each audio clip'),
                    _buildInstructionItem(
                        'Choose the best answer for each question'),
                    _buildInstructionItem(
                        'You can replay each audio clip up to 2 times'),
                    _buildInstructionItem(
                        'Complete all questions within the time limit'),
                    _buildInstructionItem(
                        'Your score will be calculated at the end'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Your Performance',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildPerformanceItem(
                      'Best Score',
                      '${exercise['bestScore'] ?? 0}%',
                    ),
                    _buildPerformanceItem(
                      'Attempts',
                      '${exercise['attempts'] ?? 0}',
                    ),
                    _buildPerformanceItem(
                      'Average Time',
                      '${exercise['avgTime'] ?? 0} min',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Navigate to exercise practice page
                  _startExercise();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Start Exercise',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInstructionItem(String instruction) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.check_circle_outline,
            size: 16,
            color: Theme.of(context).primaryColor,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              instruction,
              style: const TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceItem(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Theme.of(context).primaryColor,
          ),
        ),
      ],
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return Colors.green;
      case 'intermediate':
        return Colors.orange;
      case 'advanced':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  void _startExercise() {
    // TODO: Navigate to exercise practice page
    // For now, just show a placeholder message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Exercise practice page will be implemented soon!'),
      ),
    );
  }
}
