import 'package:flutter/material.dart';
import 'package:toeic_mobile/core/theme/app_theme.dart';

// Modern Gradient Card Component
class GradientCard extends StatelessWidget {
  final Widget child;
  final List<Color>? gradientColors;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final VoidCallback? onTap;
  final List<BoxShadow>? boxShadow;

  const GradientCard({
    super.key,
    required this.child,
    this.gradientColors,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = 16,
    this.onTap,
    this.boxShadow,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors ??
              [AppTheme.primaryColor, AppTheme.primaryColor.withOpacity(0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: boxShadow ?? AppTheme.mediumShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(borderRadius),
          child: Container(
            padding: padding ?? const EdgeInsets.all(20),
            child: child,
          ),
        ),
      ),
    );
  }
}

// Modern Glass Effect Card
class GlassCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final VoidCallback? onTap;
  final double opacity;

  const GlassCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = 16,
    this.onTap,
    this.opacity = 0.1,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        color: (isDark ? Colors.white : Colors.black).withOpacity(opacity),
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: (isDark ? Colors.white : Colors.black).withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(borderRadius),
          child: Container(
            padding: padding ?? const EdgeInsets.all(20),
            child: child,
          ),
        ),
      ),
    );
  }
}

// Modern Progress Indicator
class ModernProgressIndicator extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final Color? progressColor;
  final Color? backgroundColor;
  final double height;
  final String? label;
  final bool showPercentage;

  const ModernProgressIndicator({
    super.key,
    required this.progress,
    this.progressColor,
    this.backgroundColor,
    this.height = 8,
    this.label,
    this.showPercentage = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null || showPercentage) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (label != null)
                Text(
                  label!,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                ),
              if (showPercentage)
                Text(
                  '${(progress * 100).toInt()}%',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primaryColor,
                      ),
                ),
            ],
          ),
          const SizedBox(height: 8),
        ],
        Container(
          height: height,
          decoration: BoxDecoration(
            color: backgroundColor ?? AppTheme.getBorderColor(context),
            borderRadius: BorderRadius.circular(height / 2),
          ),
          child: Stack(
            children: [
              Container(
                width: double.infinity,
                height: height,
                decoration: BoxDecoration(
                  color: backgroundColor ?? AppTheme.getBorderColor(context),
                  borderRadius: BorderRadius.circular(height / 2),
                ),
              ),
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: MediaQuery.of(context).size.width * progress,
                height: height,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      progressColor ?? AppTheme.primaryColor,
                      (progressColor ?? AppTheme.primaryColor).withOpacity(0.8),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(height / 2),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// Achievement Badge Component
class AchievementBadge extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Color? backgroundColor;
  final Color? iconColor;
  final bool isUnlocked;
  final VoidCallback? onTap;

  const AchievementBadge({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.backgroundColor,
    this.iconColor,
    this.isUnlocked = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isUnlocked
              ? (backgroundColor ?? AppTheme.primaryColor.withOpacity(0.1))
              : AppTheme.getBorderColor(context),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isUnlocked
                ? (backgroundColor ?? AppTheme.primaryColor.withOpacity(0.3))
                : AppTheme.getBorderColor(context),
            width: 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isUnlocked
                    ? (backgroundColor ?? AppTheme.primaryColor)
                    : AppTheme.getSecondaryTextColor(context),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: isUnlocked
                    ? (iconColor ?? Colors.white)
                    : AppTheme.getSecondaryTextColor(context).withOpacity(0.5),
                size: 24,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: isUnlocked
                        ? AppTheme.getTextColor(context)
                        : AppTheme.getSecondaryTextColor(context),
                  ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: isUnlocked
                          ? AppTheme.getSecondaryTextColor(context)
                          : AppTheme.getSecondaryTextColor(context)
                              .withOpacity(0.5),
                    ),
                textAlign: TextAlign.center,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// Modern Statistics Card
class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color? color;
  final String? subtitle;
  final double? progress;
  final VoidCallback? onTap;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    this.color,
    this.subtitle,
    this.progress,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cardColor = color ?? AppTheme.primaryColor;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppTheme.getSurfaceColor(context),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppTheme.getBorderColor(context),
            width: 1,
          ),
          boxShadow: AppTheme.lightShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: cardColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: cardColor,
                    size: 24,
                  ),
                ),
                if (onTap != null)
                  Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: AppTheme.getSecondaryTextColor(context),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppTheme.getTextColor(context),
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppTheme.getSecondaryTextColor(context),
                  ),
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppTheme.getSecondaryTextColor(context),
                    ),
              ),
            ],
            if (progress != null) ...[
              const SizedBox(height: 12),
              ModernProgressIndicator(
                progress: progress!,
                progressColor: cardColor,
                height: 4,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
