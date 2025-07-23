import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/services/dio_api_service.dart';
import '../../../models/test_model.dart';
import '../../../models/api_response.dart';

class TestRepository {
  final ApiService _apiService;

  TestRepository(this._apiService);

  /// Get all available tests for user
  Future<ApiResponse<List<TestModel>>> getAvailableTests() async {
    try {
      final response = await _apiService.get('/tests');
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        final List<dynamic> testsData = jsonData['data'] ?? jsonData;
        final tests = testsData.map((json) => TestModel.fromJson(json)).toList();
        
        return ApiResponse.success(tests);
      } else {
        return ApiResponse.error('Failed to load tests: ${response.statusCode}');
      }
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred: $e');
    }
  }

  /// Get specific test details
  Future<ApiResponse<TestModel>> getTestDetails(int testId) async {
    try {
      final response = await _apiService.get('/tests/$testId');
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        final testData = jsonData['data'] ?? jsonData;
        final test = TestModel.fromJson(testData);
        
        return ApiResponse.success(test);
      } else {
        return ApiResponse.error('Failed to load test details: ${response.statusCode}');
      }
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred: $e');
    }
  }

  /// Start a test session
  Future<ApiResponse<Map<String, dynamic>>> startTest(int testId) async {
    try {
      final response = await _apiService.post('/tests/$testId/start');
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        return ApiResponse.success(jsonData);
      } else {
        return ApiResponse.error('Failed to start test: ${response.statusCode}');
      }
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred: $e');
    }
  }

  /// Submit test answers
  Future<ApiResponse<Map<String, dynamic>>> submitTest(
    int testId,
    Map<String, dynamic> answers,
  ) async {
    try {
      final response = await _apiService.post(
        '/tests/$testId/submit',
        data: {'answers': answers},
      );
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        return ApiResponse.success(jsonData);
      } else {
        return ApiResponse.error('Failed to submit test: ${response.statusCode}');
      }
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred: $e');
    }
  }

  /// Get user's test history
  Future<ApiResponse<List<Map<String, dynamic>>>> getTestHistory() async {
    try {
      final response = await _apiService.get('/test-history');
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        final List<dynamic> historyData = jsonData['data'] ?? jsonData;
        
        return ApiResponse.success(historyData.cast<Map<String, dynamic>>());
      } else {
        return ApiResponse.error('Failed to load test history: ${response.statusCode}');
      }
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred: $e');
    }
  }

  /// Get test result details
  Future<ApiResponse<Map<String, dynamic>>> getTestResult(int resultId) async {
    try {
      final response = await _apiService.get('/test-results/$resultId');
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        final resultData = jsonData['data'] ?? jsonData;
        return ApiResponse.success(resultData);
      } else {
        return ApiResponse.error('Failed to load test result: ${response.statusCode}');
      }
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred: $e');
    }
  }
}

// Provider
final testRepositoryProvider = Provider<TestRepository>((ref) {
  final apiService = ref.read(apiServiceProvider);
  return TestRepository(apiService);
});
