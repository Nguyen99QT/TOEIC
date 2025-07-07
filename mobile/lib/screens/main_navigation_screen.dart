import 'package:flutter/material.dart';
import '../widgets/layout/app_layout.dart';
import '../widgets/content/lessons_content.dart';
import '../widgets/content/flashcards_content.dart';
import '../widgets/buttons/logout_button.dart';
import 'new_home_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _currentIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onTabChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        children: [
          // Home Screen
          _buildHomeScreen(),
          // Lessons Screen
          _buildLessonsScreen(),
          // Flashcards Screen
          _buildFlashcardsScreen(),
          // Exercises Screen
          _buildExercisesScreen(),
          // Profile Screen
          _buildProfileScreen(),
        ],
      ),
    );
  }

  Widget _buildHomeScreen() {
    return AppLayout(
      title: "LeEnglish TOEIC",
      currentIndex: _currentIndex,
      onTabChanged: _onTabChanged,
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

  Widget _buildLessonsScreen() {
    return AppLayout(
      title: "Lessons",
      currentIndex: _currentIndex,
      onTabChanged: _onTabChanged,
      child: const LessonsScreenContent(),
    );
  }

  Widget _buildFlashcardsScreen() {
    return AppLayout(
      title: "Flashcards",
      currentIndex: _currentIndex,
      onTabChanged: _onTabChanged,
      actions: [
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () {
            // TODO: Add new flashcard set
          },
        ),
      ],
      child: const FlashcardsScreenContent(),
    );
  }

  Widget _buildExercisesScreen() {
    return AppLayout(
      title: "Exercises",
      currentIndex: _currentIndex,
      onTabChanged: _onTabChanged,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.assignment_outlined, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'Exercises Screen',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              'Coming Soon',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileScreen() {
    return AppLayout(
      title: "Profile",
      currentIndex: _currentIndex,
      onTabChanged: _onTabChanged,
      actions: [const LogoutButton()],
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.person_outline, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'Profile Screen',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              'Coming Soon',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            SizedBox(height: 32),
            LogoutButton(showIcon: false),
          ],
        ),
      ),
    );
  }
}
