import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/models/exercise_model.dart';
import 'package:toeic_mobile/features/exercise/providers/exercise_provider.dart';

class ExerciseDetailPage extends ConsumerStatefulWidget {
  final String exerciseId;

  const ExerciseDetailPage({
    Key? key,
    required this.exerciseId,
  }) : super(key: key);

  @override
  ConsumerState<ExerciseDetailPage> createState() => _ExerciseDetailPageState();
}

class _ExerciseDetailPageState extends ConsumerState<ExerciseDetailPage> {
  @override
  void initState() {
    super.initState();
    // Load exercise detail - provider family automatically loads exercise by ID
  }

  @override
  Widget build(BuildContext context) {
    final exerciseState = ref.watch(exerciseDetailProvider(widget.exerciseId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Exercise Detail'),
        actions: [
          if (exerciseState.hasValue && exerciseState.value != null) ...[
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () =>
                  context.push('/exercises/${widget.exerciseId}/edit'),
            ),
            IconButton(
              icon: const Icon(Icons.play_arrow),
              onPressed: () => _startQuiz(exerciseState.value!),
            ),
            PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'delete':
                    _showDeleteDialog(exerciseState.value!);
                    break;
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(value: 'delete', child: Text('Delete')),
              ],
            ),
          ],
        ],
      ),
      body: exerciseState.when(
        data: (exercise) {
          if (exercise == null) {
            return const Center(
              child: Text(
                'Exercise not found',
                style: TextStyle(fontSize: 18),
              ),
            );
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: ExerciseDetailContent(exercise: exercise),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error, size: 64, color: Colors.red[300]),
              const SizedBox(height: 16),
              Text(
                'Error: $error',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () =>
                    ref.refresh(exerciseDetailProvider(widget.exerciseId)),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton:
          exerciseState.hasValue && exerciseState.value != null
              ? FloatingActionButton.extended(
                  onPressed: () => _startQuiz(exerciseState.value!),
                  label: const Text('Start Quiz'),
                  icon: const Icon(Icons.play_arrow),
                )
              : null,
    );
  }

  void _startQuiz(Exercise exercise) {
    ref.read(exerciseQuizProvider.notifier).initializeQuiz([exercise]);
    context.push('/exercises/quiz');
  }

  void _showDeleteDialog(Exercise exercise) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Exercise'),
        content: Text('Are you sure you want to delete "${exercise.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              Navigator.pop(context);
              final success = await ref
                  .read(exerciseListProvider.notifier)
                  .deleteExercise(exercise.id!);
              if (success) {
                context.pop(); // Go back to previous page
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text('Exercise deleted successfully')),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text('Failed to delete exercise'),
                      backgroundColor: Colors.red),
                );
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

class ExerciseDetailContent extends StatelessWidget {
  final Exercise exercise;

  const ExerciseDetailContent({
    Key? key,
    required this.exercise,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header Card
        Card(
          elevation: 2,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  exercise.title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  exercise.description,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildInfoChip(Icons.category, 'Type', exercise.type),
                    _buildInfoChip(
                        Icons.speed, 'Difficulty', exercise.difficulty),
                    _buildInfoChip(Icons.trending_up, 'Level', exercise.level),
                    if (exercise.timeLimit != null && exercise.timeLimit! > 0)
                      _buildInfoChip(
                          Icons.timer, 'Time Limit', '${exercise.timeLimit}s'),
                    if (exercise.points > 0)
                      _buildInfoChip(
                          Icons.stars, 'Points', '${exercise.points}'),
                    if (exercise.isPremium == true)
                      _buildInfoChip(Icons.workspace_premium, 'Premium', 'Yes'),
                  ],
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Question Card
        Card(
          elevation: 2,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Question',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  exercise.question,
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Options Card (if applicable)
        if (exercise.options.isNotEmpty) ...[
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Options',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...exercise.options.asMap().entries.map((entry) {
                    final index = entry.key;
                    final option = entry.value;
                    final isCorrect = option == exercise.correctAnswer;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isCorrect
                            ? Colors.green.withOpacity(0.1)
                            : Colors.grey.withOpacity(0.05),
                        border: Border.all(
                          color: isCorrect
                              ? Colors.green
                              : Colors.grey.withOpacity(0.3),
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color:
                                  isCorrect ? Colors.green : Colors.grey[300],
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                String.fromCharCode(65 + index), // A, B, C, D
                                style: TextStyle(
                                  color:
                                      isCorrect ? Colors.white : Colors.black,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              option,
                              style: TextStyle(
                                fontSize: 16,
                                color: isCorrect ? Colors.green[700] : null,
                                fontWeight: isCorrect ? FontWeight.w500 : null,
                              ),
                            ),
                          ),
                          if (isCorrect)
                            Icon(Icons.check_circle, color: Colors.green[700]),
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Correct Answer Card (for non-multiple choice)
        if (exercise.options.isEmpty && exercise.correctAnswer.isNotEmpty) ...[
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Correct Answer',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.1),
                      border: Border.all(color: Colors.green),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green[700]),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            exercise.correctAnswer,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.green[700],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Explanation Card
        if (exercise.explanation != null &&
            exercise.explanation!.isNotEmpty) ...[
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Explanation',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    exercise.explanation!,
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Media Cards
        if (exercise.imageUrl != null || exercise.audioUrl != null) ...[
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Media Files',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (exercise.imageUrl != null) ...[
                    Row(
                      children: [
                        const Icon(Icons.image, color: Colors.blue),
                        const SizedBox(width: 8),
                        const Text('Image: '),
                        Expanded(
                          child: Text(
                            exercise.imageUrl!,
                            style: const TextStyle(color: Colors.blue),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],
                  if (exercise.audioUrl != null) ...[
                    Row(
                      children: [
                        const Icon(Icons.audiotrack, color: Colors.orange),
                        const SizedBox(width: 8),
                        const Text('Audio: '),
                        Expanded(
                          child: Text(
                            exercise.audioUrl!,
                            style: const TextStyle(color: Colors.orange),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Additional Info Card
        Card(
          elevation: 2,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Additional Information',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                _buildInfoRow('Exercise ID', exercise.id ?? 'N/A'),
                if (exercise.lessonId != null)
                  _buildInfoRow('Lesson ID', exercise.lessonId!),
                _buildInfoRow('Type', exercise.type),
                _buildInfoRow('Order Index', exercise.orderIndex.toString()),
                _buildInfoRow(
                    'Active', exercise.isActive == true ? 'Yes' : 'No'),
                if (exercise.createdAt != null)
                  _buildInfoRow('Created', _formatDate(exercise.createdAt!)),
                if (exercise.updatedAt != null)
                  _buildInfoRow('Updated', _formatDate(exercise.updatedAt!)),
              ],
            ),
          ),
        ),

        const SizedBox(height: 80), // Space for FAB
      ],
    );
  }

  Widget _buildInfoChip(IconData icon, String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.blue.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.blue.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.blue[700]),
          const SizedBox(width: 6),
          Text(
            '$label: $value',
            style: TextStyle(
              color: Colors.blue[700],
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}
