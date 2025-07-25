import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;

    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(user?.fullName ?? 'User'),
            accountEmail: Text(user?.email ?? 'user@example.com'),
            currentAccountPicture: CircleAvatar(
              backgroundColor: Colors.white,
              child: Text(
                (user?.fullName != null && user!.fullName!.isNotEmpty
                    ? user.fullName!.substring(0, 1).toUpperCase()
                    : 'U'),
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                ListTile(
                  leading: const Icon(Icons.home),
                  title: const Text('Home'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/dashboard');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.dashboard),
                  title: const Text('Dashboard'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/dashboard');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.book),
                  title: const Text('Lessons'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/lessons');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.fitness_center),
                  title: const Text('Exercises'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/exercises');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.credit_card),
                  title: const Text('Flashcards'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/flashcards');
                  },
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.person),
                  title: const Text('Profile'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/profile');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.settings),
                  title: const Text('Settings'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/settings');
                  },
                ),
              ],
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () async {
              Navigator.pop(context);
              await AuthService.instance.logout();
              if (context.mounted) {
                context.go('/login');
              }
            },
          ),
        ],
      ),
    );
  }
}
