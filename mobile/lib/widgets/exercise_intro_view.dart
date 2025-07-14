import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';

class ExerciseIntroView extends StatelessWidget {
  final Exercise exercise;
  final VoidCallback onStart;

  const ExerciseIntroView({
    super.key,
    required this.exercise,
    required this.onStart,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Exercise image if available
            if (exercise.imageUrl != null)
              Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    exercise.imageUrl!,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder:
                        (_, __, ___) => Container(
                          height: 200,
                          width: double.infinity,
                          color: Colors.grey[300],
                          child: Center(
                            child: Icon(
                              Icons.assignment,
                              size: 64,
                              color: exercise.typeColor.withOpacity(0.5),
                            ),
                          ),
                        ),
                  ),
                ),
              ),

            if (exercise.imageUrl != null) const SizedBox(height: 24),

            // Exercise information card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Type and level badges
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: exercise.typeColor.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            exercise.typeDisplayName,
                            style: TextStyle(
                              color: exercise.typeColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),

                        const SizedBox(width: 8),

                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            'Level ${exercise.difficultyLevel}',
                            style: TextStyle(
                              color: Colors.grey[800],
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Exercise details
                    const Text(
                      'Exercise Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 8),

                    _buildDetailRow(
                      icon: Icons.star_outline,
                      label: 'Points',
                      value: '${exercise.points} points',
                    ),

                    if (exercise.timeLimitSeconds != null)
                      _buildDetailRow(
                        icon: Icons.timer_outlined,
                        label: 'Time Limit',
                        value: _formatTime(exercise.timeLimitSeconds!),
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Description and instructions
            const Text(
              'Instructions',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 8),

            Text(exercise.description, style: const TextStyle(fontSize: 16)),

            const SizedBox(height: 32),

            // Start button
            Center(
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onStart,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: exercise.typeColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    textStyle: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        exercise.type == ExerciseType.LISTENING
                            ? Icons.headphones
                            : Icons.play_arrow,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        exercise.type == ExerciseType.LISTENING
                            ? 'Start Listening Exercise'
                            : 'Start Exercise',
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[700]),
          const SizedBox(width: 12),
          Text(
            '$label:',
            style: TextStyle(fontSize: 15, color: Colors.grey[700]),
          ),
          const SizedBox(width: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  String _formatTime(int seconds) {
    final minutes = (seconds / 60).floor();
    final remainingSeconds = seconds % 60;
    return '$minutes:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}
