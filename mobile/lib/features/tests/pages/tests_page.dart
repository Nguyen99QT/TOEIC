import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TestsPage extends ConsumerWidget {
  const TestsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tests',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView(
                children: [
                  _buildTestCard(
                    'TOEIC Practice Test 1',
                    'Full length practice test with 200 questions',
                    120,
                    Icons.quiz,
                  ),
                  _buildTestCard(
                    'Listening Section Test',
                    'Focus on listening comprehension skills',
                    45,
                    Icons.headphones,
                  ),
                  _buildTestCard(
                    'Reading Section Test',
                    'Focus on reading comprehension skills',
                    75,
                    Icons.menu_book,
                  ),
                  _buildTestCard(
                    'Vocabulary Quiz',
                    'Test your vocabulary knowledge',
                    30,
                    Icons.spellcheck,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTestCard(String title, String description, int duration, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue.withOpacity(0.1),
          child: Icon(icon, color: Colors.blue),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(description),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.timer, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  '$duration minutes',
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: Builder(
          builder: (context) => ElevatedButton(
            onPressed: () {
              // TODO: Navigate to test
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Starting $title...')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
            child: const Text('Start'),
          ),
        ),
        isThreeLine: true,
      ),
    );
  }
}
