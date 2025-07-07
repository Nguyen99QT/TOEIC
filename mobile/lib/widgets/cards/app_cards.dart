import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final double? borderRadius;
  final Color? backgroundColor;
  final List<BoxShadow>? boxShadow;
  final VoidCallback? onTap;

  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
    this.boxShadow,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ?? const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.cardBackground,
        borderRadius: BorderRadius.circular(borderRadius ?? AppRadius.lg),
        boxShadow: boxShadow ?? [AppShadows.cardShadow],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(borderRadius ?? AppRadius.lg),
          child: Padding(
            padding: padding ?? const EdgeInsets.all(AppSpacing.md),
            child: child,
          ),
        ),
      ),
    );
  }
}

class FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final VoidCallback? onTap;
  final Color? iconColor;

  const FeatureCard({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    this.onTap,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 32, color: iconColor ?? AppColors.primaryBlue),
          const SizedBox(height: AppSpacing.md),
          Text(
            title,
            style: AppTextStyles.h4,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            description,
            style: AppTextStyles.bodyMedium,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class LessonCard extends StatelessWidget {
  final String title;
  final String description;
  final String? imageUrl;
  final int? lessonNumber;
  final String? duration;
  final String? difficulty;
  final double? progress;
  final bool isCompleted;
  final VoidCallback? onTap;

  const LessonCard({
    super.key,
    required this.title,
    required this.description,
    this.imageUrl,
    this.lessonNumber,
    this.duration,
    this.difficulty,
    this.progress,
    this.isCompleted = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      child: Row(
        children: [
          // Lesson number or image
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color:
                  isCompleted
                      ? AppColors.successColor
                      : AppColors.primaryBlueLight,
              borderRadius: BorderRadius.circular(AppRadius.md),
              image:
                  imageUrl != null
                      ? DecorationImage(
                        image: NetworkImage(imageUrl!),
                        fit: BoxFit.cover,
                      )
                      : null,
            ),
            child:
                imageUrl == null
                    ? Center(
                      child: Text(
                        lessonNumber?.toString() ?? '?',
                        style: AppTextStyles.h3.copyWith(color: Colors.white),
                      ),
                    )
                    : null,
          ),
          const SizedBox(width: AppSpacing.md),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTextStyles.h4,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  description,
                  style: AppTextStyles.bodyMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (duration != null || difficulty != null)
                  const SizedBox(height: AppSpacing.xs),
                if (duration != null || difficulty != null)
                  Row(
                    children: [
                      if (duration != null) ...[
                        const Icon(
                          Icons.access_time,
                          size: 12,
                          color: AppColors.textSecondary,
                        ),
                        const SizedBox(width: 2),
                        Text(duration!, style: AppTextStyles.caption),
                      ],
                      if (duration != null && difficulty != null)
                        const SizedBox(width: AppSpacing.sm),
                      if (difficulty != null) ...[
                        const Icon(
                          Icons.bar_chart,
                          size: 12,
                          color: AppColors.textSecondary,
                        ),
                        const SizedBox(width: 2),
                        Text(difficulty!, style: AppTextStyles.caption),
                      ],
                    ],
                  ),
                if (progress != null) ...[
                  const SizedBox(height: AppSpacing.xs),
                  LinearProgressIndicator(
                    value: progress,
                    backgroundColor: AppColors.borderColor,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppColors.primaryBlue,
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Status indicator
          if (isCompleted)
            const Icon(
              Icons.check_circle,
              color: AppColors.successColor,
              size: 24,
            )
          else
            const Icon(
              Icons.play_circle_outline,
              color: AppColors.primaryBlue,
              size: 24,
            ),
        ],
      ),
    );
  }
}

class FlashcardSetCard extends StatelessWidget {
  final String title;
  final String description;
  final int cardCount;
  final int? masteredCount;
  final DateTime? lastStudied;
  final double? progress;
  final VoidCallback? onTap;

  const FlashcardSetCard({
    super.key,
    required this.title,
    required this.description,
    required this.cardCount,
    this.masteredCount,
    this.lastStudied,
    this.progress,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: AppTextStyles.h4,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: AppSpacing.xs,
                ),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlueUltraLight,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Text(
                  '$cardCount cards',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.primaryBlue,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            description,
            style: AppTextStyles.bodyMedium,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          if (masteredCount != null || lastStudied != null) ...[
            const SizedBox(height: AppSpacing.sm),
            Row(
              children: [
                if (masteredCount != null) ...[
                  const Icon(
                    Icons.check_circle_outline,
                    size: 16,
                    color: AppColors.successColor,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$masteredCount/$cardCount mastered',
                    style: AppTextStyles.caption,
                  ),
                ],
                if (masteredCount != null && lastStudied != null)
                  const SizedBox(width: AppSpacing.md),
                if (lastStudied != null) ...[
                  const Icon(
                    Icons.schedule,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _formatLastStudied(lastStudied!),
                    style: AppTextStyles.caption,
                  ),
                ],
              ],
            ),
          ],
          if (progress != null || masteredCount != null) ...[
            const SizedBox(height: AppSpacing.md),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Progress', style: AppTextStyles.bodySmall),
                    Text(
                      masteredCount != null
                          ? '${((masteredCount! / cardCount) * 100).toInt()}%'
                          : '${(progress! * 100).toInt()}%',
                      style: AppTextStyles.bodySmall.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.xs),
                LinearProgressIndicator(
                  value:
                      masteredCount != null
                          ? masteredCount! / cardCount
                          : progress,
                  backgroundColor: AppColors.borderColor,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    AppColors.primaryBlue,
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  String _formatLastStudied(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 7) {
      return '${difference.inDays} days ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minutes ago';
    } else {
      return 'Just now';
    }
  }
}
