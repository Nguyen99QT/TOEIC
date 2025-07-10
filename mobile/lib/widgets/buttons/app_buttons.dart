import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

enum ButtonSize { small, medium, large }

enum AppButtonVariant { primary, secondary, outline, text, danger }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonSize size;
  final AppButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final bool fullWidth;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.size = ButtonSize.medium,
    this.variant = AppButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.fullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: _getHeight(),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: _getButtonStyle(),
        child: isLoading ? _buildLoadingIndicator() : _buildButtonContent(),
      ),
    );
  }

  double _getHeight() {
    switch (size) {
      case ButtonSize.small:
        return 36;
      case ButtonSize.medium:
        return 44;
      case ButtonSize.large:
        return 52;
    }
  }

  ButtonStyle _getButtonStyle() {
    return ElevatedButton.styleFrom(
      backgroundColor: _getBackgroundColor(),
      foregroundColor: _getForegroundColor(),
      elevation: _getElevation(),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: _getBorderSide(),
      ),
      padding: EdgeInsets.symmetric(
        horizontal: _getHorizontalPadding(),
        vertical: _getVerticalPadding(),
      ),
    );
  }

  Color? _getBackgroundColor() {
    switch (variant) {
      case AppButtonVariant.primary:
        return AppColors.primaryBlue;
      case AppButtonVariant.secondary:
        return AppColors.backgroundColor;
      case AppButtonVariant.outline:
        return Colors.transparent;
      case AppButtonVariant.text:
        return Colors.transparent;
      case AppButtonVariant.danger:
        return AppColors.errorColor;
    }
  }

  Color? _getForegroundColor() {
    switch (variant) {
      case AppButtonVariant.primary:
        return Colors.white;
      case AppButtonVariant.secondary:
        return AppColors.textPrimary;
      case AppButtonVariant.outline:
        return AppColors.primaryBlue;
      case AppButtonVariant.text:
        return AppColors.primaryBlue;
      case AppButtonVariant.danger:
        return Colors.white;
    }
  }

  double _getElevation() {
    switch (variant) {
      case AppButtonVariant.primary:
      case AppButtonVariant.danger:
        return 2;
      case AppButtonVariant.secondary:
        return 1;
      case AppButtonVariant.outline:
      case AppButtonVariant.text:
        return 0;
    }
  }

  BorderSide _getBorderSide() {
    switch (variant) {
      case AppButtonVariant.outline:
        return const BorderSide(color: AppColors.primaryBlue, width: 1.5);
      default:
        return BorderSide.none;
    }
  }

  double _getHorizontalPadding() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.md;
      case ButtonSize.medium:
        return AppSpacing.lg;
      case ButtonSize.large:
        return AppSpacing.xl;
    }
  }

  double _getVerticalPadding() {
    return AppSpacing.sm;
  }

  TextStyle _getTextStyle() {
    switch (size) {
      case ButtonSize.small:
        return AppTextStyles.bodyMedium.copyWith(
          fontWeight: FontWeight.w600,
          color: _getForegroundColor(),
        );
      case ButtonSize.medium:
        return AppTextStyles.buttonMedium.copyWith(
          color: _getForegroundColor(),
        );
      case ButtonSize.large:
        return AppTextStyles.buttonLarge.copyWith(color: _getForegroundColor());
    }
  }

  Widget _buildLoadingIndicator() {
    return SizedBox(
      width: 20,
      height: 20,
      child: CircularProgressIndicator(
        strokeWidth: 2,
        valueColor: AlwaysStoppedAnimation<Color>(
          _getForegroundColor() ?? Colors.white,
        ),
      ),
    );
  }

  Widget _buildButtonContent() {
    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: _getIconSize()),
          const SizedBox(width: AppSpacing.sm),
          Text(text, style: _getTextStyle()),
        ],
      );
    } else {
      return Text(text, style: _getTextStyle());
    }
  }

  double _getIconSize() {
    switch (size) {
      case ButtonSize.small:
        return 16;
      case ButtonSize.medium:
        return 18;
      case ButtonSize.large:
        return 20;
    }
  }
}

// Specialized button for floating action
class AppFloatingActionButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final IconData icon;
  final String? tooltip;
  final bool mini;

  const AppFloatingActionButton({
    super.key,
    this.onPressed,
    required this.icon,
    this.tooltip,
    this.mini = false,
  });

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: onPressed,
      tooltip: tooltip,
      mini: mini,
      backgroundColor: AppColors.primaryBlue,
      foregroundColor: Colors.white,
      elevation: 4,
      child: Icon(icon),
    );
  }
}

// Icon button for app bars and toolbars
class AppIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final String? tooltip;
  final Color? color;
  final double? size;
  final AppButtonVariant? variant;

  const AppIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.tooltip,
    this.color,
    this.size,
    this.variant,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: onPressed,
      icon: Icon(
        icon,
        color: color ?? _getColorFromVariant(),
        size: size ?? 24,
      ),
      tooltip: tooltip,
    );
  }

  Color? _getColorFromVariant() {
    if (variant == null) return null;

    switch (variant!) {
      case AppButtonVariant.primary:
        return AppColors.primaryBlue;
      case AppButtonVariant.secondary:
        return AppColors.textSecondary;
      case AppButtonVariant.outline:
        return AppColors.primaryBlue;
      case AppButtonVariant.text:
        return AppColors.textPrimary;
      case AppButtonVariant.danger:
        return AppColors.errorColor;
    }
  }
}
