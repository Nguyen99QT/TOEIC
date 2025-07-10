import 'package:flutter/material.dart';
import '../models/toeic_study_models.dart';

class LessonCard extends StatelessWidget {
  final Lesson lesson;
  final VoidCallback onTap;

  const LessonCard({Key? key, required this.lesson, required this.onTap})
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Lesson image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              child:
                  lesson.imageUrl != null
                      ? Image.network(
                        lesson.imageUrl!,
                        height: 150,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder:
                            (_, __, ___) => Container(
                              height: 150,
                              color: Colors.grey[300],
                              child: const Center(
                                child: Icon(
                                  Icons.image,
                                  size: 50,
                                  color: Colors.grey,
                                ),
                              ),
                            ),
                      )
                      : Container(
                        height: 150,
                        color: Colors.grey[300],
                        child: Center(
                          child: Icon(
                            Icons.menu_book,
                            size: 50,
                            color: lesson.levelColor.withOpacity(0.7),
                          ),
                        ),
                      ),
            ),

            // Lesson content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Level badge
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
                            fontSize: 12,
                          ),
                        ),
                      ),

                      // Premium badge if applicable
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
                              Icon(
                                Icons.star,
                                size: 14,
                                color: Colors.amber[800],
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Premium',
                                style: TextStyle(
                                  color: Colors.amber[800],
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Lesson title
                  Text(
                    lesson.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 8),

                  // Lesson description
                  Text(
                    lesson.description,
                    style: TextStyle(fontSize: 14, color: Colors.grey[700]),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),

                  const SizedBox(height: 16),

                  // Audio indicator and Start button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Audio indicator
                      if (lesson.audioUrl != null)
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.volume_up,
                              size: 16,
                              color: Colors.blue[700],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Audio available',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.blue[700],
                              ),
                            ),
                          ],
                        ),

                      // Start button
                      ElevatedButton.icon(
                        onPressed: onTap,
                        icon: const Icon(Icons.play_arrow, size: 16),
                        label: const Text('Start'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: lesson.levelColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          textStyle: const TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
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
  }
}
