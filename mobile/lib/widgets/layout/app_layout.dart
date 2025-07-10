import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../themes/app_theme.dart';

class AppLayout extends StatelessWidget {
  final Widget child;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final bool showAppBar;
  final bool showBottomNav;
  final int currentIndex;
  final Function(int)? onTabChanged;

  const AppLayout({
    super.key,
    required this.child,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.showAppBar = true,
    this.showBottomNav = true,
    this.currentIndex = 0,
    this.onTabChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: showAppBar ? _buildAppBar(context) : null,
      body: SafeArea(child: child),
      bottomNavigationBar: showBottomNav ? _buildBottomNav(context) : null,
      floatingActionButton: floatingActionButton,
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.primaryBlue,
      foregroundColor: Colors.white,
      elevation: 0,
      title: Text(title ?? 'LeEnglish TOEIC', style: AppTextStyles.navTitle),
      actions: actions,
      systemOverlayStyle: const SystemUiOverlayStyle(
        statusBarColor: AppColors.primaryBlue,
        statusBarIconBrightness: Brightness.light,
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Color(0x0F000000),
            offset: Offset(0, -1),
            blurRadius: 3,
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: onTabChanged,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primaryBlue,
        unselectedItemColor: AppColors.textLight,
        selectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.normal,
        ),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.book_outlined),
            activeIcon: Icon(Icons.book),
            label: 'Lessons',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.style_outlined),
            activeIcon: Icon(Icons.style),
            label: 'Flashcards',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment_outlined),
            activeIcon: Icon(Icons.assignment),
            label: 'Exercises',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

// Custom AppBar for specific pages
class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final Widget? leading;
  final bool centerTitle;
  final Color? backgroundColor;
  final Color? foregroundColor;

  const CustomAppBar({
    super.key,
    required this.title,
    this.actions,
    this.leading,
    this.centerTitle = true,
    this.backgroundColor,
    this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: backgroundColor ?? AppColors.primaryBlue,
      foregroundColor: foregroundColor ?? Colors.white,
      elevation: 0,
      centerTitle: centerTitle,
      title: Text(title, style: AppTextStyles.navTitle),
      leading: leading,
      actions: actions,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
