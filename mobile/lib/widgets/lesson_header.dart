import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';

class LessonHeader extends StatelessWidget {
  final Lesson lesson;

  const LessonHeader({super.key, required this.lesson});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title and metadata
          Row(
            children: [
              Expanded(
                child: Text(
                  lesson.title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              if (lesson.audioUrl != null)
                IconButton(
                  onPressed: () {
                    // Play audio implementation
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Playing audio...')),
                    );
                  },
                  icon: const Icon(Icons.volume_up),
                  tooltip: 'Play audio',
                ),
            ],
          ),

          const SizedBox(height: 8),

          // Level and premium badges
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: lesson.levelColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  lesson.levelDisplayName,
                  style: TextStyle(
                    color: lesson.levelColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              const SizedBox(width: 8),

              if (lesson.isPremium)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.amber[100],
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.star, size: 14, color: Colors.amber[800]),
                      const SizedBox(width: 4),
                      Text(
                        'Premium',
                        style: TextStyle(
                          color: Colors.amber[800],
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),

          const SizedBox(height: 16),

          // Description
          Text(
            lesson.description,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[700],
              fontStyle: FontStyle.italic,
            ),
          ),

          const Divider(height: 32),
        ],
      ),
    );
  }
}
