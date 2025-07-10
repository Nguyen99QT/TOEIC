import 'package:flutter/material.dart';
import '../themes/app_theme.dart';
import '../widgets/layout/app_layout.dart';
import '../widgets/cards/app_cards.dart';

class LessonsScreen extends StatefulWidget {
  const LessonsScreen({super.key});

  @override
  State<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends State<LessonsScreen> {
  final List<String> _categories = [
    'All',
    'Listening',
    'Reading',
    'Speaking',
    'Writing',
    'Grammar',
    'Vocabulary',
  ];

  String _selectedCategory = 'All';
  String _searchQuery = '';

  final List<LessonData> _lessons = [
    LessonData(
      id: 1,
      title: "Business Communication",
      description:
          "Essential vocabulary for workplace conversations and professional communication",
      category: "Speaking",
      duration: "25 min",
      difficulty: "Intermediate",
      progress: 0.75,
      isCompleted: false,
      lessonNumber: 1,
    ),
    LessonData(
      id: 2,
      title: "Travel & Tourism",
      description: "Common phrases and vocabulary for travel situations",
      category: "Vocabulary",
      duration: "20 min",
      difficulty: "Beginner",
      progress: 1.0,
      isCompleted: true,
      lessonNumber: 2,
    ),
    LessonData(
      id: 3,
      title: "Listening Practice - Part 1",
      description:
          "Improve your listening skills with photo description exercises",
      category: "Listening",
      duration: "30 min",
      difficulty: "Advanced",
      progress: 0.3,
      isCompleted: false,
      lessonNumber: 3,
    ),
    LessonData(
      id: 4,
      title: "Reading Comprehension",
      description: "Practice reading skills with TOEIC-style passages",
      category: "Reading",
      duration: "35 min",
      difficulty: "Intermediate",
      progress: 0.0,
      isCompleted: false,
      lessonNumber: 4,
    ),
    LessonData(
      id: 5,
      title: "Grammar Essentials",
      description: "Master key grammar rules for TOEIC success",
      category: "Grammar",
      duration: "40 min",
      difficulty: "Beginner",
      progress: 0.6,
      isCompleted: false,
      lessonNumber: 5,
    ),
  ];

  List<LessonData> get filteredLessons {
    return _lessons.where((lesson) {
      final matchesCategory =
          _selectedCategory == 'All' || lesson.category == _selectedCategory;
      final matchesSearch =
          lesson.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          lesson.description.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isTablet = screenSize.width >= 768;
    final isDesktop = screenSize.width >= 1024;

    return AppLayout(
      title: "Lessons",
      currentIndex: 1,
      child: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: EdgeInsets.all(isTablet ? AppSpacing.lg : AppSpacing.md),
            color: AppColors.surfaceColor,
            child: Column(
              children: [
                // Search Bar
                TextField(
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                  decoration: InputDecoration(
                    hintText: 'Search lessons...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon:
                        _searchQuery.isNotEmpty
                            ? IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                setState(() {
                                  _searchQuery = '';
                                });
                              },
                            )
                            : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      borderSide: const BorderSide(
                        color: AppColors.borderColor,
                      ),
                    ),
                    filled: true,
                    fillColor: AppColors.backgroundColor,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Categories Filter
                SizedBox(
                  height: 40,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final isSelected = category == _selectedCategory;

                      return Padding(
                        padding: const EdgeInsets.only(right: AppSpacing.sm),
                        child: FilterChip(
                          label: Text(category),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedCategory = category;
                            });
                          },
                          backgroundColor: AppColors.backgroundColor,
                          selectedColor: AppColors.primaryBlueUltraLight,
                          labelStyle: TextStyle(
                            color:
                                isSelected
                                    ? AppColors.primaryBlue
                                    : AppColors.textSecondary,
                            fontWeight:
                                isSelected
                                    ? FontWeight.w600
                                    : FontWeight.normal,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Lessons List or Grid
          Expanded(
            child:
                filteredLessons.isEmpty
                    ? _buildEmptyState()
                    : isTablet
                    ? _buildLessonsGrid(isDesktop)
                    : _buildLessonsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: filteredLessons.length,
      itemBuilder: (context, index) {
        final lesson = filteredLessons[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: LessonCard(
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
            progress: lesson.progress,
            isCompleted: lesson.isCompleted,
            lessonNumber: lesson.lessonNumber,
            onTap: () {
              // TODO: Navigate to lesson detail
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Opening ${lesson.title}...'),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildLessonsGrid(bool isDesktop) {
    final crossAxisCount = isDesktop ? 3 : 2;

    return GridView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: 1.2,
        crossAxisSpacing: AppSpacing.md,
        mainAxisSpacing: AppSpacing.md,
      ),
      itemCount: filteredLessons.length,
      itemBuilder: (context, index) {
        final lesson = filteredLessons[index];
        return Card(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          child: InkWell(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Opening ${lesson.title}...'),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlueLight,
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                        child: Center(
                          child: Text(
                            '${lesson.lessonNumber}',
                            style: AppTextStyles.h3.copyWith(
                              color: AppColors.primaryBlue,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              lesson.difficulty,
                              style: AppTextStyles.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                            Text(
                              lesson.duration,
                              style: AppTextStyles.bodySmall.copyWith(
                                color: AppColors.textLight,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (lesson.isCompleted)
                        const Icon(
                          Icons.check_circle,
                          color: AppColors.successColor,
                          size: 20,
                        ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    lesson.title,
                    style: AppTextStyles.h3.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    lesson.description,
                    style: AppTextStyles.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  if (!lesson.isCompleted) ...[
                    const SizedBox(height: AppSpacing.sm),
                    LinearProgressIndicator(
                      value: lesson.progress,
                      backgroundColor: AppColors.borderColor,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.primaryBlue,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      '${(lesson.progress * 100).toInt()}% complete',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, size: 64, color: AppColors.textLight),
          const SizedBox(height: AppSpacing.md),
          Text(
            'No lessons found',
            style: AppTextStyles.h3.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Try adjusting your search or filters',
            style: AppTextStyles.bodyMedium,
          ),
        ],
      ),
    );
  }
}

class LessonData {
  final int id;
  final String title;
  final String description;
  final String category;
  final String duration;
  final String difficulty;
  final double progress;
  final bool isCompleted;
  final int lessonNumber;

  LessonData({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.duration,
    required this.difficulty,
    required this.progress,
    required this.isCompleted,
    required this.lessonNumber,
  });
}
