import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';

class ExerciseCard extends StatelessWidget {
  final Exercise exercise;
  final VoidCallback onTap;

  const ExerciseCard({Key? key, required this.exercise, required this.onTap})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 2),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Exercise header
              Row(
                children: [
                  // Exercise type badge
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
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Difficulty level badge
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
                        fontSize: 12,
                      ),
                    ),
                  ),

                  // Points badge
                  if (exercise.points > 0)
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange[100],
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.star,
                              size: 14,
                              color: Colors.orange[800],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${exercise.points} pts',
                              style: TextStyle(
                                color: Colors.orange[800],
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),

              const SizedBox(height: 16),

              // Exercise title
              Text(
                exercise.title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 8),

              // Exercise description
              Text(
                exercise.description,
                style: TextStyle(fontSize: 14, color: Colors.grey[700]),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 16),

              // Footer with audio indicator and start button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Time limit or audio indicator
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (exercise.timeLimitSeconds != null)
                        Row(
                          children: [
                            Icon(
                              Icons.timer,
                              size: 16,
                              color: Colors.grey[700],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${_formatTime(exercise.timeLimitSeconds!)}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[700],
                              ),
                            ),
                            const SizedBox(width: 12),
                          ],
                        ),

                      if (exercise.audioUrl != null)
                        Row(
                          children: [
                            Icon(
                              Icons.volume_up,
                              size: 16,
                              color: Colors.blue[700],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Audio',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Colors.blue[700],
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),

                  // Start button
                  ElevatedButton.icon(
                    onPressed: onTap,
                    icon: const Icon(Icons.play_arrow, size: 16),
                    label: const Text('Start'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: exercise.typeColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      textStyle: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper method to format time in MM:SS format
  String _formatTime(int seconds) {
    final minutes = (seconds / 60).floor();
    final remainingSeconds = seconds % 60;
    return '$minutes:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}
