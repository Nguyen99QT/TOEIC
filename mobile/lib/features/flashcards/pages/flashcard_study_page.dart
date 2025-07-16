import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FlashcardStudyPage extends ConsumerStatefulWidget {
  final String flashcardSetId;

  const FlashcardStudyPage({super.key, required this.flashcardSetId});

  @override
  ConsumerState<FlashcardStudyPage> createState() => _FlashcardStudyPageState();
}

class _FlashcardStudyPageState extends ConsumerState<FlashcardStudyPage> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;
  bool _isFlipped = false;

  final List<Map<String, dynamic>> _flashcards = [
    {
      'id': 1,
      'front': 'Accommodate',
      'back': 'To provide lodging or sufficient space for; to adapt or adjust',
      'example': 'The hotel can accommodate 200 guests.',
      'difficulty': 'Intermediate',
    },
    {
      'id': 2,
      'front': 'Collaborate',
      'back':
          'To work jointly with others or together especially in an intellectual endeavor',
      'example': 'We need to collaborate with other departments.',
      'difficulty': 'Intermediate',
    },
    {
      'id': 3,
      'front': 'Comprehensive',
      'back': 'Complete; including all or nearly all elements or aspects',
      'example': 'The report provides a comprehensive analysis.',
      'difficulty': 'Advanced',
    },
    {
      'id': 4,
      'front': 'Implement',
      'back': 'To put a decision or plan into effect; to carry out',
      'example': 'We will implement the new policy next month.',
      'difficulty': 'Intermediate',
    },
    {
      'id': 5,
      'front': 'Subsequent',
      'back': 'Coming after something in time; following',
      'example': 'The subsequent meetings were more productive.',
      'difficulty': 'Advanced',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Vocabulary'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              _showInstructions();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress Bar
          Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Card ${_currentIndex + 1} of ${_flashcards.length}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      '${((_currentIndex + 1) / _flashcards.length * 100).toInt()}%',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: (_currentIndex + 1) / _flashcards.length,
                  backgroundColor: Colors.grey[200],
                  valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).primaryColor),
                ),
              ],
            ),
          ),

          // Flashcard
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                  _isFlipped = false;
                });
              },
              itemCount: _flashcards.length,
              itemBuilder: (context, index) {
                return _buildFlashcard(_flashcards[index]);
              },
            ),
          ),

          // Controls
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                IconButton(
                  onPressed: _currentIndex > 0 ? _previousCard : null,
                  icon: const Icon(Icons.arrow_back),
                  iconSize: 32,
                  color: _currentIndex > 0
                      ? Theme.of(context).primaryColor
                      : Colors.grey,
                ),
                ElevatedButton(
                  onPressed: _flipCard,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 32, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  child: Text(
                    _isFlipped ? 'Show Front' : 'Show Back',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                IconButton(
                  onPressed:
                      _currentIndex < _flashcards.length - 1 ? _nextCard : null,
                  icon: const Icon(Icons.arrow_forward),
                  iconSize: 32,
                  color: _currentIndex < _flashcards.length - 1
                      ? Theme.of(context).primaryColor
                      : Colors.grey,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFlashcard(Map<String, dynamic> card) {
    return Container(
      margin: const EdgeInsets.all(16),
      child: Card(
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: InkWell(
          onTap: _flipCard,
          borderRadius: BorderRadius.circular(20),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getDifficultyColor(card['difficulty'])
                        .withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    card['difficulty'],
                    style: TextStyle(
                      fontSize: 12,
                      color: _getDifficultyColor(card['difficulty']),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                if (!_isFlipped) ...[
                  // Front of card
                  const Icon(
                    Icons.quiz,
                    size: 48,
                    color: Colors.blue,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    card['front'],
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Tap to see definition',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey,
                    ),
                  ),
                ] else ...[
                  // Back of card
                  const Icon(
                    Icons.lightbulb_outline,
                    size: 48,
                    color: Colors.amber,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    card['back'],
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Example:',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          card['example'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const Spacer(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    IconButton(
                      onPressed: () {
                        // Mark as difficult
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Marked as difficult')),
                        );
                      },
                      icon: const Icon(Icons.thumb_down_outlined),
                      iconSize: 28,
                      color: Colors.red,
                    ),
                    IconButton(
                      onPressed: () {
                        // Mark as easy
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Marked as easy')),
                        );
                      },
                      icon: const Icon(Icons.thumb_up_outlined),
                      iconSize: 28,
                      color: Colors.green,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _flipCard() {
    setState(() {
      _isFlipped = !_isFlipped;
    });
  }

  void _nextCard() {
    if (_currentIndex < _flashcards.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousCard() {
    if (_currentIndex > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _showInstructions() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('How to Study'),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('• Tap the card to flip between front and back'),
              Text('• Use arrow buttons to navigate'),
              Text('• Mark cards as easy or difficult'),
              Text('• Study regularly for best results'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Got it'),
            ),
          ],
        );
      },
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty) {
      case 'Beginner':
        return Colors.green;
      case 'Intermediate':
        return Colors.orange;
      case 'Advanced':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
