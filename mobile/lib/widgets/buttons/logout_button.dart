import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../themes/app_theme.dart';

class LogoutButton extends ConsumerWidget {
  final bool showIcon;
  final bool isMenuItem;

  const LogoutButton({
    super.key,
    this.showIcon = true,
    this.isMenuItem = false,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    if (isMenuItem) {
      return ListTile(
        leading: const Icon(Icons.logout, color: AppColors.textSecondary),
        title: const Text('Logout'),
        onTap: () => _handleLogout(context),
      );
    }

    if (showIcon) {
      return IconButton(
        icon: const Icon(Icons.logout),
        tooltip: 'Logout',
        onPressed: () => _handleLogout(context),
      );
    }

    return TextButton(
      onPressed: () => _handleLogout(context),
      style: TextButton.styleFrom(foregroundColor: Colors.white),
      child: Text(
        'Logout',
        style: AppTextStyles.buttonMedium.copyWith(
          color: authState.isLoading ? AppColors.textLight : Colors.white,
        ),
      ),
    );
  }

  void _handleLogout(BuildContext context) {
    // Confirmation dialog
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Logout'),
            content: const Text('Are you sure you want to logout?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  context.go('/logout'); // Navigate to logout screen
                },
                child: const Text('Logout'),
              ),
            ],
          ),
    );
  }
}
