import 'package:flutter/material.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';
import 'package:toeic_mobile/shared/widgets/layout/app_bottom_navigation.dart';
import 'package:toeic_mobile/shared/widgets/layout/app_drawer.dart';

class MainLayout extends StatefulWidget {
  final Widget child;
  final bool showBottomNavigation;
  final bool showDrawer;

  const MainLayout({
    super.key,
    required this.child,
    this.showBottomNavigation = true,
    this.showDrawer = true,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('LeEnglish'),
        elevation: 0,
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          if (AuthService.instance.isAuthenticated)
            IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () {
                // Handle notifications
              },
            ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              // Handle more options
            },
          ),
        ],
      ),
      drawer: widget.showDrawer && AuthService.instance.isAuthenticated
          ? const AppDrawer()
          : null,
      body: widget.child,
      bottomNavigationBar:
          widget.showBottomNavigation && AuthService.instance.isAuthenticated
              ? const AppBottomNavigation()
              : null,
    );
  }
}

class AuthLayout extends StatelessWidget {
  final Widget child;

  const AuthLayout({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
    );
  }
}
