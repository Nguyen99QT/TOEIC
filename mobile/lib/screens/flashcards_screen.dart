import 'package:flutter/material.dart';
import '../themes/app_theme.dart';
import '../widgets/layout/app_layout.dart';
import '../widgets/cards/app_cards.dart';
import '../widgets/buttons/app_buttons.dart';

class FlashcardsScreen extends StatefulWidget {
  const FlashcardsScreen({super.key});

  @override
  State<FlashcardsScreen> createState() => _FlashcardsScreenState();
}

class _FlashcardsScreenState extends State<FlashcardsScreen> {
  final List<FlashcardSetData> _flashcardSets = [
    FlashcardSetData(
      id: 1,
      title: "Business Vocabulary",
      description:
          "Essential business terms and phrases for professional communication",
      cardCount: 150,
      masteredCount: 89,
      lastStudied: DateTime.now().subtract(const Duration(hours: 2)),
      category: "Vocabulary",
    ),
    FlashcardSetData(
      id: 2,
      title: "Grammar Essentials",
      description: "Key grammar rules and patterns for TOEIC success",
      cardCount: 200,
      masteredCount: 156,
      lastStudied: DateTime.now().subtract(const Duration(days: 1)),
      category: "Grammar",
    ),
    FlashcardSetData(
      id: 3,
      title: "Travel & Transportation",
      description: "Common phrases and vocabulary for travel situations",
      cardCount: 80,
      masteredCount: 80,
      lastStudied: DateTime.now().subtract(const Duration(days: 3)),
      category: "Vocabulary",
    ),
    FlashcardSetData(
      id: 4,
      title: "Listening Keywords",
      description: "Important words and phrases for listening comprehension",
      cardCount: 120,
      masteredCount: 45,
      lastStudied: DateTime.now().subtract(const Duration(hours: 5)),
      category: "Listening",
    ),
    FlashcardSetData(
      id: 5,
      title: "Reading Comprehension",
      description: "Vocabulary and phrases commonly found in reading passages",
      cardCount: 180,
      masteredCount: 23,
      lastStudied: DateTime.now().subtract(const Duration(days: 7)),
      category: "Reading",
    ),
  ];

  String _selectedFilter = 'All';
  final List<String> _filters = [
    'All',
    'Not Started',
    'In Progress',
    'Completed',
  ];

  List<FlashcardSetData> get filteredSets {
    switch (_selectedFilter) {
      case 'Not Started':
        return _flashcardSets.where((set) => set.masteredCount == 0).toList();
      case 'In Progress':
        return _flashcardSets
            .where(
              (set) =>
                  set.masteredCount > 0 && set.masteredCount < set.cardCount,
            )
            .toList();
      case 'Completed':
        return _flashcardSets
            .where((set) => set.masteredCount == set.cardCount)
            .toList();
      default:
        return _flashcardSets;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: "Flashcards",
      currentIndex: 2,
      actions: [
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () {
            // TODO: Add new flashcard set
            _showCreateSetDialog(context);
          },
        ),
      ],
      child: Column(
        children: [
          // Stats Overview
          Container(
            margin: const EdgeInsets.all(AppSpacing.md),
            child: AppCard(
              child: Column(
                children: [
                  Text('Your Progress', style: AppTextStyles.h4),
                  const SizedBox(height: AppSpacing.md),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatColumn(
                          'Total Sets',
                          _flashcardSets.length.toString(),
                          Icons.style_outlined,
                        ),
                      ),
                      Expanded(
                        child: _buildStatColumn(
                          'Cards Mastered',
                          _flashcardSets
                              .fold<int>(
                                0,
                                (sum, set) => sum + set.masteredCount,
                              )
                              .toString(),
                          Icons.check_circle_outline,
                        ),
                      ),
                      Expanded(
                        child: _buildStatColumn(
                          'Completion',
                          '${((_flashcardSets.fold<int>(0, (sum, set) => sum + set.masteredCount) / _flashcardSets.fold<int>(0, (sum, set) => sum + set.cardCount)) * 100).toInt()}%',
                          Icons.trending_up,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Filter Tabs
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            child: Row(
              children:
                  _filters.map((filter) {
                    final isSelected = filter == _selectedFilter;
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2),
                        child: AppButton(
                          text: filter,
                          onPressed: () {
                            setState(() {
                              _selectedFilter = filter;
                            });
                          },
                          variant:
                              isSelected
                                  ? AppButtonVariant.primary
                                  : AppButtonVariant.outline,
                          size: ButtonSize.small,
                        ),
                      ),
                    );
                  }).toList(),
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Flashcard Sets List
          Expanded(
            child:
                filteredSets.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md,
                      ),
                      itemCount: filteredSets.length,
                      itemBuilder: (context, index) {
                        final set = filteredSets[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: AppSpacing.md),
                          child: FlashcardSetCard(
                            title: set.title,
                            description: set.description,
                            cardCount: set.cardCount,
                            masteredCount: set.masteredCount,
                            lastStudied: set.lastStudied,
                            onTap: () {
                              // TODO: Navigate to flashcard study
                              _showStudyOptions(context, set);
                            },
                          ),
                        );
                      },
                    ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 24, color: AppColors.primaryBlue),
        const SizedBox(height: AppSpacing.xs),
        Text(value, style: AppTextStyles.h4),
        const SizedBox(height: AppSpacing.xs),
        Text(label, style: AppTextStyles.caption, textAlign: TextAlign.center),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.style_outlined, size: 64, color: AppColors.textLight),
          const SizedBox(height: AppSpacing.md),
          Text(
            'No flashcard sets found',
            style: AppTextStyles.h3.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Try changing your filter or create a new set',
            style: AppTextStyles.bodyMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.lg),
          AppButton(
            text: "Create New Set",
            onPressed: () => _showCreateSetDialog(context),
            icon: Icons.add,
          ),
        ],
      ),
    );
  }

  void _showStudyOptions(BuildContext context, FlashcardSetData set) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
      ),
      builder:
          (context) => Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(set.title, style: AppTextStyles.h3),
                const SizedBox(height: AppSpacing.md),
                _buildStudyOption(
                  'Study New Cards',
                  'Learn new flashcards',
                  Icons.play_circle_outline,
                  () {
                    Navigator.pop(context);
                    // TODO: Start studying new cards
                  },
                ),
                _buildStudyOption(
                  'Review',
                  'Review previously learned cards',
                  Icons.refresh,
                  () {
                    Navigator.pop(context);
                    // TODO: Start review
                  },
                ),
                _buildStudyOption(
                  'Test Mode',
                  'Test your knowledge',
                  Icons.quiz_outlined,
                  () {
                    Navigator.pop(context);
                    // TODO: Start test mode
                  },
                ),
                const SizedBox(height: AppSpacing.md),
                AppButton(
                  text: "Cancel",
                  onPressed: () => Navigator.pop(context),
                  variant: AppButtonVariant.outline,
                  fullWidth: true,
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildStudyOption(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primaryBlue),
      title: Text(title, style: AppTextStyles.subtitle),
      subtitle: Text(subtitle, style: AppTextStyles.caption),
      onTap: onTap,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
    );
  }

  void _showCreateSetDialog(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Create New Flashcard Set'),
            content: const Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Set Name',
                    border: OutlineInputBorder(),
                  ),
                ),
                SizedBox(height: AppSpacing.md),
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Description',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              AppButton(
                text: 'Create',
                onPressed: () {
                  Navigator.pop(context);
                  // TODO: Create new flashcard set
                },
              ),
            ],
          ),
    );
  }
}

class FlashcardSetData {
  final int id;
  final String title;
  final String description;
  final int cardCount;
  final int masteredCount;
  final DateTime lastStudied;
  final String category;

  FlashcardSetData({
    required this.id,
    required this.title,
    required this.description,
    required this.cardCount,
    required this.masteredCount,
    required this.lastStudied,
    required this.category,
  });
}
