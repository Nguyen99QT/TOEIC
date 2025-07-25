import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:toeic_mobile/core/services/storage_service.dart';

/// Service xử lý HTTP requests sử dụng Dio cho CRUD operations
class DioApiService {
  static DioApiService? _instance;
  static DioApiService get instance => _instance ??= DioApiService._();
  DioApiService._();

  late final Dio _dio;

  /// Getter để access Dio instance từ bên ngoài
  static Dio get dio => instance._dio;

  /// Initialize Dio với cấu hình
  void init() {
    _dio = Dio(BaseOptions(
      baseUrl: _getBaseUrl(),
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ));

    // Add interceptors
    _dio.interceptors.addAll([
      _AuthInterceptor(),
      _ErrorInterceptor(),
      if (kDebugMode)
        LogInterceptor(
          requestBody: true,
          responseBody: true,
          requestHeader: true,
          responseHeader: false,
          error: true,
        ),
    ]);
  }

  /// Get base URL based on platform
  static String _getBaseUrl() {
    if (kIsWeb) {
      return 'http://localhost:8080';
    } else if (Platform.isAndroid) {
      // For Android Emulator
      return 'http://10.0.2.2:8080';
    } else if (Platform.isIOS) {
      // For iOS Simulator
      return 'http://localhost:8080';
    } else {
      return 'http://localhost:8080';
    }
  }
}

/// Interceptor để tự động thêm auth token
class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    // Get token from storage
    try {
      final token = await StorageService.instance.getString('auth_token');
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    } catch (e) {
      debugPrint('Error getting auth token: $e');
    }

    handler.next(options);
  }
}

/// Interceptor để xử lý lỗi chung
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    debugPrint('API Error: ${err.type} - ${err.message}');

    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        err = err.copyWith(
          message: 'Connection timeout. Please check your internet connection.',
        );
        break;
      case DioExceptionType.connectionError:
        err = err.copyWith(
          message:
              'Unable to connect to server. Please check your internet connection.',
        );
        break;
      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;
        switch (statusCode) {
          case 401:
            err = err.copyWith(message: 'Unauthorized. Please login again.');
            // Clear token and redirect to login
            StorageService.instance.remove('auth_token');
            break;
          case 403:
            err = err.copyWith(message: 'Access forbidden.');
            break;
          case 404:
            err = err.copyWith(message: 'Resource not found.');
            break;
          case 422:
            err = err.copyWith(message: 'Validation error.');
            break;
          case 500:
            err = err.copyWith(message: 'Internal server error.');
            break;
          default:
            err = err.copyWith(message: 'Server error occurred.');
        }
        break;
      default:
        err = err.copyWith(message: 'An unexpected error occurred.');
    }

    handler.next(err);
  }
}

/// Update ApiService class để include Dio
class ApiService {
  // Keep existing http-based methods for backward compatibility
  // ... existing code ...

  /// Static Dio getter for new CRUD operations
  static Dio get dio => DioApiService.dio;

  /// Initialize both HTTP and Dio services
  static void init() {
    DioApiService.instance.init();
  }
}
