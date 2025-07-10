import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors - Similar to Tailwind blue
  static const Color primaryBlue = Color(0xFF2563EB); // blue-600
  static const Color primaryBlueDark = Color(0xFF1D4ED8); // blue-700
  static const Color primaryBlueLight = Color(0xFF3B82F6); // blue-500
  static const Color primaryBlueUltraLight = Color(0xFFDCFDF7); // blue-200

  // Background Colors
  static const Color backgroundColor = Color(0xFFF8FAFC); // slate-50
  static const Color surfaceColor = Colors.white;
  static const Color cardBackground = Colors.white;

  // Text Colors
  static const Color textPrimary = Color(0xFF0F172A); // slate-900
  static const Color textSecondary = Color(0xFF64748B); // slate-500
  static const Color textLight = Color(0xFF94A3B8); // slate-400

  // Status Colors
  static const Color successColor = Color(0xFF10B981); // emerald-500
  static const Color warningColor = Color(0xFFF59E0B); // amber-500
  static const Color errorColor = Color(0xFFEF4444); // red-500

  // Shadow Colors
  static const Color shadowColor = Color(0x0F000000);

  // Border Colors
  static const Color borderColor = Color(0xFFE2E8F0); // slate-200
}

class AppTextStyles {
  // Headers
  static const TextStyle h1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    height: 1.2,
  );

  static const TextStyle h2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    height: 1.3,
  );

  static const TextStyle h3 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.4,
  );

  static const TextStyle h4 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.4,
  );

  // Body Text
  static const TextStyle body = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
    height: 1.5,
  );

  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
    height: 1.5,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
    height: 1.5,
  );

  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.textLight,
    height: 1.4,
  );

  // Additional Text Styles
  static const TextStyle subtitle = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
    height: 1.4,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
    height: 1.3,
  );

  // Button Text
  static const TextStyle buttonLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );

  static const TextStyle buttonMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );

  // Navigation
  static const TextStyle navTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );

  static const TextStyle navItem = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: Colors.white,
  );
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

class AppRadius {
  static const double sm = 4.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double xxl = 24.0;
}

class AppShadows {
  static const BoxShadow small = BoxShadow(
    color: AppColors.shadowColor,
    offset: Offset(0, 1),
    blurRadius: 2,
    spreadRadius: 0,
  );

  static const BoxShadow medium = BoxShadow(
    color: AppColors.shadowColor,
    offset: Offset(0, 4),
    blurRadius: 6,
    spreadRadius: -1,
  );

  static const BoxShadow large = BoxShadow(
    color: AppColors.shadowColor,
    offset: Offset(0, 10),
    blurRadius: 15,
    spreadRadius: -3,
  );

  static const BoxShadow cardShadow = BoxShadow(
    color: AppColors.shadowColor,
    offset: Offset(0, 1),
    blurRadius: 3,
    spreadRadius: 0,
  );

  static const BoxShadow elevatedShadow = BoxShadow(
    color: AppColors.shadowColor,
    offset: Offset(0, 4),
    blurRadius: 6,
    spreadRadius: -1,
  );

  static const BoxShadow buttonShadow = BoxShadow(
    color: AppColors.shadowColor,
    offset: Offset(0, 2),
    blurRadius: 4,
    spreadRadius: 0,
  );
}
