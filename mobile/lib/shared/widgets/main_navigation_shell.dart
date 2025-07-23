import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainNavigationShell extends StatelessWidget {
  final Widget child;

  const MainNavigationShell({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final currentLocation = GoRouterState.of(context).uri.path;

    return Scaffold(
      body: child,
      bottomNavigationBar: _buildBottomNavigation(context, currentLocation),
    );
  }

  Widget _buildBottomNavigation(BuildContext context, String currentLocation) {
    int currentIndex = _getCurrentIndex(currentLocation);

    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      currentIndex: currentIndex,
      selectedItemColor: Theme.of(context).primaryColor,
      unselectedItemColor: Colors.grey,
      onTap: (index) => _onItemTapped(context, index),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard),
          label: 'Dashboard',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.quiz),
          label: 'Tests',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.school),
          label: 'Lessons',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.credit_card),
          label: 'Flashcards',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
    );
  }

  int _getCurrentIndex(String location) {
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/test')) return 1;
    if (location.startsWith('/lesson')) return 2;
    if (location.startsWith('/flashcard')) return 3;
    if (location.startsWith('/profile')) return 4;
    return 0;
  }

  void _onItemTapped(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/tests');
        break;
      case 2:
        context.go('/lessons');
        break;
      case 3:
        context.go('/flashcards');
        break;
      case 4:
        context.go('/profile');
        break;
    }
  }
}
