import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';
import 'package:toeic_mobile/core/theme/app_theme.dart';
import 'package:toeic_mobile/shared/widgets/common/modern_cards.dart';
import 'package:toeic_mobile/shared/widgets/layout/main_layout.dart';

class ModernDashboardPage extends ConsumerStatefulWidget {
  const ModernDashboardPage({super.key});

  @override
  ConsumerState<ModernDashboardPage> createState() =>
      _ModernDashboardPageState();
}

class _ModernDashboardPageState extends ConsumerState<ModernDashboardPage>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeInAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _fadeInAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
    ));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: const Interval(0.2, 0.8, curve: Curves.easeOut),
    ));

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth > 600;

    // Debug logging
    print('🔍 Dashboard Debug:');
    print('   User: ${user?.username}');
    print('   Role: ${user?.role}');
    print('   isCollaborator: ${user?.isCollaborator}');
    print('   canCreateContent: ${user?.canCreateContent}');

    return MainLayout(
      child: RefreshIndicator(
        color: AppTheme.primaryColor,
        backgroundColor: AppTheme.getSurfaceColor(context),
        onRefresh: () async {
          // Simulate refresh
          await Future.delayed(const Duration(seconds: 1));
        },
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            // Custom App Bar with Glass Effect
            SliverAppBar(
              expandedHeight: 120,
              floating: true,
              pinned: true,
              backgroundColor: Colors.transparent,
              elevation: 0,
              actions: user?.isCollaborator == true
                  ? [
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.admin_panel_settings,
                            color: Colors.white),
                        tooltip: 'Content Management',
                        itemBuilder: (BuildContext context) =>
                            <PopupMenuEntry<String>>[
                          const PopupMenuItem<String>(
                            value: 'lessons',
                            child: Row(
                              children: [
                                Icon(Icons.book, color: Colors.blue),
                                SizedBox(width: 12),
                                Text('Manage Lessons'),
                              ],
                            ),
                          ),
                          const PopupMenuItem<String>(
                            value: 'exercises',
                            child: Row(
                              children: [
                                Icon(Icons.assignment, color: Colors.green),
                                SizedBox(width: 12),
                                Text('Manage Exercises'),
                              ],
                            ),
                          ),
                          const PopupMenuItem<String>(
                            value: 'flashcards',
                            child: Row(
                              children: [
                                Icon(Icons.style, color: Colors.purple),
                                SizedBox(width: 12),
                                Text('Manage Flashcards'),
                              ],
                            ),
                          ),
                        ],
                        onSelected: (String value) {
                          switch (value) {
                            case 'lessons':
                              context.go('/lessons-manage');
                              break;
                            case 'exercises':
                              context.go('/exercises-crud');
                              break;
                            case 'flashcards':
                              context.go('/flashcards-crud');
                              break;
                          }
                        },
                      ),
                    ]
                  : null,
              flexibleSpace: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppTheme.primaryColor,
                      AppTheme.primaryColor.withValues(alpha: 0.8),
                    ],
                  ),
                ),
                child: FlexibleSpaceBar(
                  background: Container(
                    padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
                    child: FadeTransition(
                      opacity: _fadeInAnimation,
                      child: Row(
                        children: [
                          // Profile Avatar with Status
                          Stack(
                            children: [
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.3),
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color:
                                          Colors.black.withValues(alpha: 0.2),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: CircleAvatar(
                                  radius: 28,
                                  backgroundColor: Colors.white,
                                  child: Text(
                                    (user?.fullName != null &&
                                            user!.fullName!.isNotEmpty
                                        ? user.fullName!
                                            .substring(0, 1)
                                            .toUpperCase()
                                        : 'U'),
                                    style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.primaryColor,
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: 0,
                                right: 0,
                                child: Container(
                                  width: 18,
                                  height: 18,
                                  decoration: BoxDecoration(
                                    color: AppTheme.successColor,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.white,
                                      width: 2,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          // Welcome Text
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'Welcome back! 👋',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color:
                                            Colors.white.withValues(alpha: 0.9),
                                        fontWeight: FontWeight.w500,
                                      ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  user?.fullName ?? 'Student',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                      ),
                                ),
                              ],
                            ),
                          ),
                          // Notification Bell
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Stack(
                              children: [
                                const Icon(
                                  Icons.notifications_outlined,
                                  color: Colors.white,
                                  size: 24,
                                ),
                                Positioned(
                                  top: 0,
                                  right: 0,
                                  child: Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: AppTheme.errorColor,
                                      shape: BoxShape.circle,
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
                ),
              ),
            ),

            // Main Content
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Quick Stats Row
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeInAnimation,
                      child: _buildQuickStatsSection(isTablet),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Learning Progress Section
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeInAnimation,
                      child: _buildLearningProgressSection(),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Quick Actions
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeInAnimation,
                      child: _buildQuickActionsSection(isTablet),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Recent Activity
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeInAnimation,
                      child: _buildRecentActivitySection(),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Achievements
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeInAnimation,
                      child: _buildAchievementsSection(),
                    ),
                  ),

                  const SizedBox(height: 100), // Bottom padding for navigation
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStatsSection(bool isTablet) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your Progress Today',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
                color: AppTheme.getTextColor(context),
              ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: isTablet ? 4 : 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: isTablet ? 1.2 : 1.1,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          children: [
            StatCard(
              title: 'Lessons Completed',
              value: '12',
              icon: Icons.school_outlined,
              color: AppTheme.primaryColor,
              subtitle: '+3 today',
              progress: 0.75,
              onTap: () => context.push('/lessons'),
            ),
            StatCard(
              title: 'Practice Score',
              value: '850',
              icon: Icons.quiz_outlined,
              color: AppTheme.successColor,
              subtitle: 'TOEIC Level',
              progress: 0.85,
              onTap: () => context.push('/exercises'),
            ),
            const StatCard(
              title: 'Study Streak',
              value: '7',
              icon: Icons.local_fire_department,
              color: AppTheme.warningColor,
              subtitle: 'days',
              progress: 0.7,
            ),
            StatCard(
              title: 'Flashcards',
              value: '145',
              icon: Icons.style_outlined,
              color: AppTheme.accentColor,
              subtitle: 'mastered',
              progress: 0.6,
              onTap: () => context.push('/flashcards'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLearningProgressSection() {
    return GradientCard(
      gradientColors: [
        AppTheme.primaryColor.withValues(alpha: 0.1),
        AppTheme.secondaryColor.withValues(alpha: 0.05),
      ],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Weekly Goal',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppTheme.getTextColor(context),
                    ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.successColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '5/7 days',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.successColor,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const ModernProgressIndicator(
            progress: 0.71,
            label: 'Study Progress',
            showPercentage: true,
            progressColor: AppTheme.primaryColor,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(
                Icons.trending_up,
                color: AppTheme.successColor,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'Great progress! Keep it up to reach your weekly goal.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.getSecondaryTextColor(context),
                    ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsSection(bool isTablet) {
    final user = AuthService.instance.currentUser;

    final actions = [
      {
        'title': 'Take Practice Test',
        'subtitle': 'Full TOEIC simulation',
        'icon': Icons.quiz,
        'color': AppTheme.primaryColor,
        'route': '/exercises',
      },
      {
        'title': 'Study Lessons',
        'subtitle': 'Learn new concepts',
        'icon': Icons.school,
        'color': AppTheme.secondaryColor,
        'route': '/lessons',
      },
      {
        'title': 'Review Flashcards',
        'subtitle': 'Quick vocabulary practice',
        'icon': Icons.style,
        'color': AppTheme.accentColor,
        'route': '/flashcards',
      },
      {
        'title': 'View Progress',
        'subtitle': 'Track your improvement',
        'icon': Icons.analytics,
        'color': AppTheme.warningColor,
        'route': '/profile',
      },
    ];

    // Add collaborator actions if user is collaborator
    if (user?.isCollaborator == true) {
      actions.addAll([
        {
          'title': 'Manage Lessons',
          'subtitle': 'Create & edit lessons',
          'icon': Icons.book_outlined,
          'color': Colors.blue,
          'route': '/lessons-manage',
        },
        {
          'title': 'Manage Exercises',
          'subtitle': 'Create & edit exercises',
          'icon': Icons.assignment_outlined,
          'color': Colors.green,
          'route': '/exercises-crud',
        },
        {
          'title': 'Manage Flashcards',
          'subtitle': 'Create & edit flashcards',
          'icon': Icons.style_outlined,
          'color': Colors.purple,
          'route': '/flashcards-crud',
        },
      ]);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
                color: AppTheme.getTextColor(context),
              ),
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: isTablet ? 4 : 2,
            childAspectRatio: isTablet ? 1.3 : 1.2,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
          ),
          itemCount: actions.length,
          itemBuilder: (context, index) {
            final action = actions[index];
            return GlassCard(
              onTap: () => context.push(action['route'] as String),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: (action['color'] as Color).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      action['icon'] as IconData,
                      color: action['color'] as Color,
                      size: 28,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Flexible(
                    child: Text(
                      action['title'] as String,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.getTextColor(context),
                          ),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Flexible(
                    child: Text(
                      action['subtitle'] as String,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppTheme.getSecondaryTextColor(context),
                          ),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildRecentActivitySection() {
    final activities = [
      {
        'title': 'Completed Listening Practice',
        'subtitle': 'Part 1: Photographs',
        'time': '2 hours ago',
        'icon': Icons.headphones,
        'color': AppTheme.primaryColor,
      },
      {
        'title': 'Studied Grammar Lesson',
        'subtitle': 'Present Perfect Tense',
        'time': '1 day ago',
        'icon': Icons.book,
        'color': AppTheme.secondaryColor,
      },
      {
        'title': 'Reviewed Flashcards',
        'subtitle': 'Business Vocabulary',
        'time': '2 days ago',
        'icon': Icons.style,
        'color': AppTheme.accentColor,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppTheme.getTextColor(context),
                  ),
            ),
            TextButton(
              onPressed: () {
                // Navigate to full activity log
              },
              child: const Text(
                'View All',
                style: TextStyle(
                  color: AppTheme.primaryColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            color: AppTheme.getSurfaceColor(context),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppTheme.getBorderColor(context),
              width: 1,
            ),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: activities.length,
            separatorBuilder: (context, index) => Divider(
              color: AppTheme.getBorderColor(context),
              height: 1,
            ),
            itemBuilder: (context, index) {
              final activity = activities[index];
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 8,
                ),
                leading: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: (activity['color'] as Color).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    activity['icon'] as IconData,
                    color: activity['color'] as Color,
                    size: 20,
                  ),
                ),
                title: Text(
                  activity['title'] as String,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppTheme.getTextColor(context),
                      ),
                ),
                subtitle: Text(
                  activity['subtitle'] as String,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.getSecondaryTextColor(context),
                      ),
                ),
                trailing: Text(
                  activity['time'] as String,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.getSecondaryTextColor(context),
                      ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAchievementsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Achievements',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
                color: AppTheme.getTextColor(context),
              ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: const [
              AchievementBadge(
                icon: Icons.local_fire_department,
                title: 'Week Warrior',
                subtitle: '7-day streak',
                backgroundColor: AppTheme.warningColor,
                isUnlocked: true,
              ),
              SizedBox(width: 12),
              AchievementBadge(
                icon: Icons.quiz,
                title: 'Test Master',
                subtitle: '10 tests done',
                backgroundColor: AppTheme.primaryColor,
                isUnlocked: true,
              ),
              SizedBox(width: 12),
              AchievementBadge(
                icon: Icons.star,
                title: 'High Scorer',
                subtitle: '850+ score',
                backgroundColor: AppTheme.successColor,
                isUnlocked: false,
              ),
              SizedBox(width: 12),
              AchievementBadge(
                icon: Icons.school,
                title: 'Scholar',
                subtitle: '50 lessons',
                backgroundColor: AppTheme.secondaryColor,
                isUnlocked: false,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
