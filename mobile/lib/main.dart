import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:toeic_mobile/core/theme/app_theme.dart';
import 'package:toeic_mobile/core/router.dart';
import 'package:toeic_mobile/core/services/storage_service.dart';
import 'package:toeic_mobile/core/services/api_service.dart' as legacy_api;
import 'package:toeic_mobile/core/services/dio_service.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  print('🚀 Starting app initialization...');

  // Initialize Hive
  await Hive.initFlutter();
  print('✅ Hive initialized');

  // Initialize Storage Service
  await StorageService.instance.init();
  print('✅ StorageService initialized');

  // Initialize API Service (legacy - for authentication)
  legacy_api.ApiService.init();
  print('✅ Legacy ApiService initialized');

  // Initialize DioApiService for CRUD operations with interceptors
  DioApiService.instance.init();
  print('✅ DioApiService initialized');

  // Initialize Auth Service to load saved tokens
  await AuthService.instance.init();
  print('✅ AuthService initialized');

  print('🎉 All services initialized successfully!');

  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'TOEIC Learning Platform',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
