import 'package:flutter/material.dart';
import '../themes/app_theme.dart';
import '../widgets/layout/app_layout.dart';
import '../widgets/cards/app_cards.dart';
import '../widgets/buttons/app_buttons.dart';

class NewHomeScreen extends StatefulWidget {
  const NewHomeScreen({super.key});

  @override
  State<NewHomeScreen> createState() => _NewHomeScreenState();
}

class _NewHomeScreenState extends State<NewHomeScreen> {
  int _currentFeature = 0;
  late PageController _pageController;

  final List<FeatureItem> _features = [
    FeatureItem(
      icon: Icons.book_outlined,
      title: "Interactive Lessons",
      description: "Full TOEIC preparation with real exam scenarios",
    ),
    FeatureItem(
      icon: Icons.headphones_outlined,
      title: "Audio Lessons",
      description: "Improve listening skills with native speakers",
    ),
    FeatureItem(
      icon: Icons.emoji_events_outlined,
      title: "Achievement System",
      description: "Gamified learning with rewards and milestones",
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startFeatureRotation();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _startFeatureRotation() {
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _currentFeature = (_currentFeature + 1) % _features.length;
        });
        _startFeatureRotation();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppLayout(
      title: "LeEnglish TOEIC",
      currentIndex: 0,
      actions: [
        IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {},
        ),
      ],
      child: const NewHomeScreenContent(),
    );
  }
}

// Content widget for the home screen
class NewHomeScreenContent extends StatefulWidget {
  const NewHomeScreenContent({super.key});

  @override
  State<NewHomeScreenContent> createState() => _NewHomeScreenContentState();
}

class _NewHomeScreenContentState extends State<NewHomeScreenContent> {
  int _currentFeature = 0;
  late PageController _pageController;

  final List<FeatureItem> _features = [
    FeatureItem(
      icon: Icons.book_outlined,
      title: "Interactive Lessons",
      description: "Comprehensive TOEIC preparation with real exam scenarios",
    ),
    FeatureItem(
      icon: Icons.headphones_outlined,
      title: "Audio Lessons",
      description: "Improve listening skills with native speakers",
    ),
    FeatureItem(
      icon: Icons.emoji_events_outlined,
      title: "Achievement System",
      description: "Gamified learning with rewards and milestones",
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startFeatureRotation();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _startFeatureRotation() {
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _currentFeature = (_currentFeature + 1) % _features.length;
        });
        _startFeatureRotation();
      }
    });
  }

  Widget _buildWelcomeSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primaryBlue, AppColors.primaryBlueLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppRadius.lg),
        boxShadow: [AppShadows.medium],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.waving_hand, color: Colors.white, size: 32),
              const SizedBox(width: AppSpacing.sm),
              Text(
                'Welcome Back!',
                style: AppTextStyles.h2.copyWith(color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Ready to continue your TOEIC journey?',
            style: AppTextStyles.body.copyWith(
              color: Colors.white.withValues(alpha: 0.9),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  text: "Continue Learning",
                  onPressed: () {},
                  variant: AppButtonVariant.secondary,
                  icon: Icons.play_arrow,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              AppIconButton(
                icon: Icons.calendar_today,
                onPressed: () {},
                variant: AppButtonVariant.secondary,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Platform Features', style: AppTextStyles.h3),
        const SizedBox(height: AppSpacing.md),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 500),
          child: FeatureCard(
            key: ValueKey(_currentFeature),
            icon: _features[_currentFeature].icon,
            title: _features[_currentFeature].title,
            description: _features[_currentFeature].description,
            onTap: () {},
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_features.length, (index) {
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 2),
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color:
                    index == _currentFeature
                        ? AppColors.primaryBlue
                        : AppColors.borderColor,
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildQuickActionsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Quick Actions', style: AppTextStyles.h3),
        const SizedBox(height: AppSpacing.md),
        Row(
          children: [
            Expanded(
              child: AppCard(
                child: Column(
                  children: [
                    const Icon(
                      Icons.quiz_outlined,
                      size: 32,
                      color: AppColors.primaryBlue,
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      'Practice Test',
                      style: AppTextStyles.subtitle,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                onTap: () {},
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: AppCard(
                child: Column(
                  children: [
                    const Icon(
                      Icons.headphones_outlined,
                      size: 32,
                      color: AppColors.primaryBlue,
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      'Listening',
                      style: AppTextStyles.subtitle,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                onTap: () {},
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: AppCard(
                child: Column(
                  children: [
                    const Icon(
                      Icons.style_outlined,
                      size: 32,
                      color: AppColors.primaryBlue,
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      'Flashcards',
                      style: AppTextStyles.subtitle,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                onTap: () {},
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRecentLessonsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Recent Lessons', style: AppTextStyles.h3),
            TextButton(onPressed: () {}, child: const Text('View All')),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        ...[
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: LessonCard(
              title: "Business Communication",
              description: "Essential vocabulary for workplace conversations",
              duration: "25 min",
              difficulty: "Intermediate",
              progress: 0.75,
              isCompleted: false,
              onTap: () {},
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: LessonCard(
              title: "Travel & Tourism",
              description: "Common phrases for travel situations",
              duration: "20 min",
              difficulty: "Beginner",
              progress: 1.0,
              isCompleted: true,
              onTap: () {},
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildFlashcardsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Flashcard Sets', style: AppTextStyles.h3),
            TextButton(onPressed: () {}, child: const Text('View All')),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        ...[
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: FlashcardSetCard(
              title: "Business Vocabulary",
              description: "Essential business terms and phrases",
              cardCount: 150,
              masteredCount: 89,
              lastStudied: DateTime.now().subtract(const Duration(hours: 2)),
              onTap: () {},
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: FlashcardSetCard(
              title: "Grammar Essentials",
              description: "Key grammar rules and patterns",
              cardCount: 200,
              masteredCount: 156,
              lastStudied: DateTime.now().subtract(const Duration(days: 1)),
              onTap: () {},
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStatsSection() {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Your Progress', style: AppTextStyles.h4),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: _buildStatItem(
                  'Lessons\nCompleted',
                  '24',
                  Icons.book_outlined,
                ),
              ),
              Expanded(
                child: _buildStatItem(
                  'Study\nStreak',
                  '7 days',
                  Icons.local_fire_department_outlined,
                ),
              ),
              Expanded(
                child: _buildStatItem(
                  'Cards\nMastered',
                  '245',
                  Icons.style_outlined,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
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

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        // TODO: Implement refresh logic
        await Future.delayed(const Duration(seconds: 1));
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeSection(),
            const SizedBox(height: AppSpacing.lg),
            _buildFeaturesSection(),
            const SizedBox(height: AppSpacing.lg),
            _buildQuickActionsSection(),
            const SizedBox(height: AppSpacing.lg),
            _buildRecentLessonsSection(),
            const SizedBox(height: AppSpacing.lg),
            _buildFlashcardsSection(),
            const SizedBox(height: AppSpacing.lg),
            _buildStatsSection(),
            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }
}

// Data Models
class FeatureItem {
  final IconData icon;
  final String title;
  final String description;

  FeatureItem({
    required this.icon,
    required this.title,
    required this.description,
  });
}

class LessonItem {
  final int id;
  final String title;
  final String description;
  final String duration;
  final String difficulty;
  final double progress;
  final bool isCompleted;

  LessonItem({
    required this.id,
    required this.title,
    required this.description,
    required this.duration,
    required this.difficulty,
    required this.progress,
    required this.isCompleted,
  });
}

class FlashcardSetItem {
  final int id;
  final String title;
  final String description;
  final int cardCount;
  final int masteredCount;
  final DateTime lastStudied;

  FlashcardSetItem({
    required this.id,
    required this.title,
    required this.description,
    required this.cardCount,
    required this.masteredCount,
    required this.lastStudied,
  });
}
