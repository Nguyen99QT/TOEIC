import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../auth/providers/auth_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final isAuthenticated = authState.isAuthenticated;
    final user = authState.user;

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeroSection(context, isAuthenticated, user),
            _buildStatisticsSection(),
            _buildWhyChooseSection(),
            _buildFeaturedFlashcardsSection(),
            _buildFeaturedLessonsSection(),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroSection(
      BuildContext context, bool isAuthenticated, dynamic user) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85, // Responsive height
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF667eea), // Matching frontend colors
            Color(0xFF764ba2),
          ],
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              // Navigation Bar - giống frontend
              _buildNavigationBar(context, isAuthenticated, user),

              // Hero Content - responsive
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Main title - responsive font size
                      Text(
                        'Master TOEIC with',
                        style: TextStyle(
                          fontSize:
                              MediaQuery.of(context).size.width < 600 ? 32 : 48,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          height: 1.2,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      Text(
                        'LeEnglish',
                        style: TextStyle(
                          fontSize:
                              MediaQuery.of(context).size.width < 600 ? 32 : 48,
                          fontWeight: FontWeight.bold,
                          color: const Color(
                              0xFFFFD700), // Gold color like frontend
                          height: 1.2,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      // Subtitle - responsive
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'Comprehensive TOEIC preparation platform designed to help you achieve your target score with interactive lessons, practice tests, and personalized learning paths.',
                          style: TextStyle(
                            fontSize: MediaQuery.of(context).size.width < 600
                                ? 16
                                : 18,
                            color: Colors.white70,
                            height: 1.5,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 32),
                      // Welcome message for authenticated users
                      if (isAuthenticated) ...[
                        Text(
                          'Welcome back, ${user?.fullName ?? 'User'}! Ready to improve your TOEIC score?',
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 32),
                      ],
                      // Action buttons - responsive layout
                      _buildHeroButtons(context, isAuthenticated),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavigationBar(
      BuildContext context, bool isAuthenticated, dynamic user) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Logo and brand
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.school,
                color: Colors.white,
                size: 28,
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'LeEnglish',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                Text(
                  'TOEIC Platform',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
        // Navigation menu - giống frontend
        _buildNavMenu(context, isAuthenticated, user),
      ],
    );
  }

  Widget _buildNavMenu(
      BuildContext context, bool isAuthenticated, dynamic user) {
    return Row(
      children: [
        // Navigation items
        if (MediaQuery.of(context).size.width > 600) ...[
          _buildNavItem(context, '📊 Dashboard', '/dashboard'),
          _buildNavItem(context, '📚 Lessons', '/lessons'),
          _buildNavItem(context, '📝 Exercises', '/exercises'),
          _buildNavItem(context, '🔖 Flashcards', '/flashcards'),
          _buildNavItem(context, '📈 Progress', '/progress'),
        ],
        const SizedBox(width: 16),
        // User section
        if (isAuthenticated) ...[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.white,
                  child: Text(
                    (user?.fullName?.isNotEmpty == true
                        ? user!.fullName.substring(0, 1).toUpperCase()
                        : 'U'),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF667eea),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  user?.fullName ?? 'User',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ] else ...[
          ElevatedButton(
            onPressed: () => context.go('/login'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF667eea),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              elevation: 0,
            ),
            child: const Text('Sign In'),
          ),
        ],
      ],
    );
  }

  Widget _buildNavItem(BuildContext context, String title, String route) {
    return Padding(
      padding: const EdgeInsets.only(right: 16),
      child: TextButton(
        onPressed: () => context.go(route),
        style: TextButton.styleFrom(
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        ),
        child: Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildHeroButtons(BuildContext context, bool isAuthenticated) {
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      alignment: WrapAlignment.center,
      children: [
        ElevatedButton.icon(
          onPressed: () =>
              context.go(isAuthenticated ? '/dashboard' : '/login'),
          icon: Icon(isAuthenticated ? Icons.dashboard : Icons.login),
          label: Text(isAuthenticated ? 'Go to Dashboard' : 'Get Started'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF667eea),
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            elevation: 8,
            shadowColor: Colors.black.withValues(alpha: 0.3),
          ),
        ),
        OutlinedButton.icon(
          onPressed: () => context.go('/lessons'),
          icon: const Icon(Icons.school),
          label: const Text('Continue Learning'),
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.white,
            side: const BorderSide(color: Colors.white, width: 2),
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatisticsSection() {
    return Container(
      color: const Color(0xFF1A202C),
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
      child: Wrap(
        spacing: 40,
        runSpacing: 30,
        alignment: WrapAlignment.spaceEvenly,
        children: [
          _buildStatItem('10,408+', 'Active Students', Colors.blue),
          _buildStatItem('682+', 'Questions', Colors.green),
          _buildStatItem('90%', 'Success Rate', Colors.orange),
          _buildStatItem('4.91', 'Rating', Colors.purple),
        ],
      ),
    );
  }

  Widget _buildStatItem(String number, String label, Color color) {
    return Column(
      children: [
        Text(
          number,
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Widget _buildWhyChooseSection() {
    return Container(
      color: const Color(0xFFF7FAFC),
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 20),
      child: Column(
        children: [
          const Text(
            'Why Choose LeEnglish?',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2D3748),
            ),
          ),
          const SizedBox(height: 50),
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth > 800) {
                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(
                        child: _buildFeatureCard('🎯', 'Interactive Lessons',
                            'Engaging content with real-world examples')),
                    const SizedBox(width: 20),
                    Expanded(
                        child: _buildFeatureCard('📊', 'Practice Tests',
                            'Comprehensive TOEIC practice tests')),
                    const SizedBox(width: 20),
                    Expanded(
                        child: _buildFeatureCard('📈', 'Progress Tracking',
                            'Monitor your improvement over time')),
                  ],
                );
              } else {
                return Column(
                  children: [
                    _buildFeatureCard('🎯', 'Interactive Lessons',
                        'Engaging content with real-world examples'),
                    const SizedBox(height: 20),
                    _buildFeatureCard('📊', 'Practice Tests',
                        'Comprehensive TOEIC practice tests'),
                    const SizedBox(height: 20),
                    _buildFeatureCard('📈', 'Progress Tracking',
                        'Monitor your improvement over time'),
                  ],
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard(String icon, String title, String description) {
    return Container(
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            icon,
            style: const TextStyle(fontSize: 48),
          ),
          const SizedBox(height: 20),
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2D3748),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedFlashcardsSection() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 20),
      child: Column(
        children: [
          const Text(
            'Featured Flashcards',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2D3748),
            ),
          ),
          const SizedBox(height: 50),
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth > 800) {
                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(child: _buildFlashcard('Basic Nouns', '50 cards')),
                    const SizedBox(width: 20),
                    Expanded(child: _buildFlashcard('Daily Verbs', '45 cards')),
                    const SizedBox(width: 20),
                    Expanded(child: _buildFlashcard('Colors', '20 cards')),
                  ],
                );
              } else {
                return Column(
                  children: [
                    _buildFlashcard('Basic Nouns', '50 cards'),
                    const SizedBox(height: 20),
                    _buildFlashcard('Daily Verbs', '45 cards'),
                    const SizedBox(height: 20),
                    _buildFlashcard('Colors', '20 cards'),
                  ],
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFlashcard(String title, String count) {
    return Container(
      padding: const EdgeInsets.all(25),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF667eea), Color(0xFF764ba2)],
        ),
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(
            Icons.style,
            size: 40,
            color: Colors.white,
          ),
          const SizedBox(height: 15),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            count,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedLessonsSection() {
    return Container(
      color: const Color(0xFFF7FAFC),
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 20),
      child: Column(
        children: [
          const Text(
            'Featured Lessons',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2D3748),
            ),
          ),
          const SizedBox(height: 50),
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth > 1000) {
                return Wrap(
                  spacing: 20,
                  runSpacing: 20,
                  children: [
                    SizedBox(
                        width: constraints.maxWidth / 3 - 15,
                        child: _buildLessonCard('Introduction to TOEIC')),
                    SizedBox(
                        width: constraints.maxWidth / 3 - 15,
                        child: _buildLessonCard('Listening Skills')),
                    SizedBox(
                        width: constraints.maxWidth / 3 - 15,
                        child: _buildLessonCard('Reading Comprehension')),
                    SizedBox(
                        width: constraints.maxWidth / 3 - 15,
                        child: _buildLessonCard('Speaking Practice')),
                    SizedBox(
                        width: constraints.maxWidth / 3 - 15,
                        child: _buildLessonCard('Writing Skills')),
                    SizedBox(
                        width: constraints.maxWidth / 3 - 15,
                        child: _buildLessonCard('Grammar Basics')),
                  ],
                );
              } else {
                return Column(
                  children: [
                    _buildLessonCard('Introduction to TOEIC'),
                    const SizedBox(height: 20),
                    _buildLessonCard('Listening Skills'),
                    const SizedBox(height: 20),
                    _buildLessonCard('Reading Comprehension'),
                    const SizedBox(height: 20),
                    _buildLessonCard('Speaking Practice'),
                    const SizedBox(height: 20),
                    _buildLessonCard('Writing Skills'),
                    const SizedBox(height: 20),
                    _buildLessonCard('Grammar Basics'),
                  ],
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLessonCard(String title) {
    return Container(
      padding: const EdgeInsets.all(25),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(
            Icons.book,
            size: 40,
            color: Color(0xFF667eea),
          ),
          const SizedBox(height: 15),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2D3748),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          const Text(
            'Comprehensive lesson with exercises',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      color: const Color(0xFF1A202C),
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
      child: const Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.school,
                color: Colors.white,
                size: 32,
              ),
              SizedBox(width: 12),
              Text(
                'LeEnglish',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 20),
          Text(
            'Your comprehensive TOEIC preparation platform',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
          SizedBox(height: 30),
          Text(
            '© 2024 LeEnglish. All rights reserved.',
            style: TextStyle(
              color: Colors.white54,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
