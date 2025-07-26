import 'package:dio/dio.dart';

Future<void> main() async {
  print('🔍 Checking backend connection...');

  final dio = Dio();

  // Test different possible backend URLs
  final testUrls = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://10.0.2.2:8080', // Android emulator
  ];

  for (final url in testUrls) {
    print('\n📡 Testing: $url');

    try {
      // Test basic connection
      final response = await dio.get(
        '$url/api/health',
        options: Options(
          receiveTimeout: const Duration(seconds: 5),
          sendTimeout: const Duration(seconds: 5),
        ),
      );

      print('✅ Success: ${response.statusCode}');
      print('📄 Response: ${response.data}');

      // Test auth endpoint
      try {
        final authResponse = await dio.post(
          '$url/api/auth/login',
          data: {
            'username': 'test',
            'password': 'test',
          },
          options: Options(
            receiveTimeout: const Duration(seconds: 5),
            sendTimeout: const Duration(seconds: 5),
          ),
        );
        print('🔐 Auth endpoint available: ${authResponse.statusCode}');
      } catch (e) {
        if (e is DioException && e.response?.statusCode == 401) {
          print(
              '🔐 Auth endpoint available (401 - invalid credentials expected)');
        } else {
          print('⚠️ Auth endpoint error: $e');
        }
      }

      // Test blog endpoint
      try {
        final blogResponse = await dio.get(
          '$url/api/blog',
          options: Options(
            receiveTimeout: const Duration(seconds: 5),
            sendTimeout: const Duration(seconds: 5),
          ),
        );
        print('📰 Blog endpoint available: ${blogResponse.statusCode}');
      } catch (e) {
        print('⚠️ Blog endpoint error: $e');
      }

      break; // Stop testing if one URL works
    } catch (e) {
      print('❌ Failed: $e');
    }
  }

  print('\n🏁 Backend connection test completed.');
  print('\n📋 Instructions:');
  print('1. Make sure your Java Spring Boot backend is running');
  print('2. Backend should be available on one of the tested URLs');
  print('3. Check backend logs for CORS and authentication setup');
  print('4. Use the working URL in your Flutter app configuration');
}
