import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/test_models.dart';
import '../core/services/auth_service.dart';

// Custom exception for premium requirement
class PremiumRequiredException implements Exception {
  final String message;
  final bool upgradeRequired;
  
  PremiumRequiredException(this.message, {this.upgradeRequired = true});
}

class TestService {
  static const String baseUrl = 'http://10.0.2.2:8080/api';
  static const String backendBaseUrl = 'http://10.0.2.2:8080';  // For media files

  // Lấy danh sách tất cả các bài test
  static Future<List<Test>> getAllTests() async {
    try {
      print('Fetching tests from backend API...');
      
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }
      
      final response = await http.get(
        Uri.parse('$baseUrl/tests/selection/available'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print('API Response Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Successfully fetched ${data.length} tests from backend');
        return data.map((json) => Test.fromJson(json)).toList();
      } else {
        String errorMessage = 'Không thể tải danh sách bài test';
        if (response.statusCode == 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
        } else if (response.statusCode == 403) {
          errorMessage = 'Không có quyền truy cập. Vui lòng liên hệ quản trị viên';
        } else if (response.statusCode == 404) {
          errorMessage = 'Không tìm thấy bài test nào';
        } else if (response.statusCode >= 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau';
        }
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Error loading tests from backend: $e');
      String errorMessage = 'Không thể tải danh sách bài test';
      if (e.toString().contains('Connection refused') || 
          e.toString().contains('No route to host')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Kiểm tra kết nối internet';
      } else if (e.toString().contains('timeout')) {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại';
      } else if (e.toString().contains('SocketException')) {
        errorMessage = 'Lỗi kết nối mạng. Kiểm tra internet và thử lại';
      } else if (e.toString().contains('not authenticated')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
      }
      throw Exception(errorMessage);
    }
  }

  // Lấy chi tiết bài test và câu hỏi
  static Future<TestDetail> getTestQuestions(int testId) async {
    try {
      print('Fetching test questions for testId: $testId');
      
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }
      
      final response = await http.get(
        Uri.parse('$baseUrl/tests/$testId/questions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print('API Response Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Successfully fetched ${data.length} questions from backend');
        
        // Convert backend format to mobile format
        List<TestQuestion> questions = data.map((item) {
          List<TestOption> options = [];
          
          // Add options from the new format
          if (item['options'] != null) {
            for (var option in item['options']) {
              if (option['label'] != null && option['content'] != null && 
                  option['content'].toString().isNotEmpty) {
                options.add(TestOption(
                  label: option['label'],
                  content: option['content']
                ));
              }
            }
          }
          
          return TestQuestion(
            questionId: item['questionId'] ?? 0,
            questionText: item['questionText'] ?? '',
            partNumber: item['partNumber'] ?? 1,
            questionOrder: item['questionOrder'] ?? 0,
            audioUrl: _buildFullUrl(item['audioUrl']),
            imageUrl: _buildFullUrl(item['imageUrl']),
            content: item['content'], // Add content for reading parts
            options: options,
          );
        }).toList();

        // Get test info - try to fetch from backend first
        Test test;
        try {
          final testResponse = await http.get(
            Uri.parse('$baseUrl/tests/$testId'),
            headers: {'Content-Type': 'application/json'},
          );
          if (testResponse.statusCode == 200) {
            final testData = json.decode(testResponse.body);
            test = Test.fromJson(testData);
          } else {
            // Fallback test info
            test = Test(
              testId: testId,
              title: 'Test $testId',
              description: 'Test from backend',
              createdAt: DateTime.now().toIso8601String(),
            );
          }
        } catch (e) {
          print('Error fetching test info: $e, using fallback');
          test = Test(
            testId: testId,
            title: 'Test $testId',
            description: 'Test from backend',
            createdAt: DateTime.now().toIso8601String(),
          );
        }

        return TestDetail(test: test, questions: questions);
      } else {
        String errorMessage = 'Không thể tải câu hỏi bài test';
        if (response.statusCode == 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
        } else if (response.statusCode == 403) {
          errorMessage = 'Không có quyền truy cập bài test này';
        } else if (response.statusCode == 404) {
          errorMessage = 'Bài test không tồn tại hoặc đã bị xóa';
        } else if (response.statusCode >= 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau';
        }
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Error loading test questions: $e');
      String errorMessage = 'Không thể tải câu hỏi bài test';
      if (e.toString().contains('Connection refused') || 
          e.toString().contains('No route to host')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Kiểm tra kết nối internet';
      } else if (e.toString().contains('timeout')) {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại';
      } else if (e.toString().contains('SocketException')) {
        errorMessage = 'Lỗi kết nối mạng. Kiểm tra internet và thử lại';
      } else if (e.toString().contains('not authenticated')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
      }
      throw Exception(errorMessage);
    }
  }

  // Tạo test nhanh
  static Future<QuickTestResult> generateQuickTest() async {
    try {
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/tests/selection/generate-quick'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return QuickTestResult(
          testId: data['testId'] ?? 0,
          message: data['message'] ?? 'Quick test generated successfully',
        );
      } else if (response.statusCode == 403) {
        // Handle premium requirement
        final Map<String, dynamic> errorData = json.decode(response.body);
        if (errorData['error'] == 'PREMIUM_REQUIRED') {
          throw PremiumRequiredException(
            errorData['message'] ?? 'Cần nâng cấp lên Premium để sử dụng tính năng này',
            upgradeRequired: errorData['upgradeRequired'] ?? true,
          );
        }
        throw Exception('Không có quyền truy cập tính năng này');
      } else {
        throw Exception('Failed to generate quick test: HTTP ${response.statusCode}');
      }
    } catch (e) {
      if (e is PremiumRequiredException) {
        rethrow;
      }
      print('Error generating quick test: $e');
      throw Exception('Cannot generate quick test from backend: $e');
    }
  }

  // Tạo full TOEIC test (200 câu hỏi theo cấu trúc thật)
  static Future<QuickTestResult> generateFullTOEICTest() async {
    try {
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/tests/selection/generate-full'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return QuickTestResult(
          testId: data['testId'] ?? 0,
          message: data['message'] ?? 'Full TOEIC test generated successfully',
        );
      } else if (response.statusCode == 403) {
        // Handle premium requirement
        final Map<String, dynamic> errorData = json.decode(response.body);
        if (errorData['error'] == 'PREMIUM_REQUIRED') {
          throw PremiumRequiredException(
            errorData['message'] ?? 'Cần nâng cấp lên Premium để sử dụng tính năng này',
            upgradeRequired: errorData['upgradeRequired'] ?? true,
          );
        }
        throw Exception('Không có quyền truy cập tính năng này');
      } else {
        throw Exception('Failed to generate full TOEIC test: HTTP ${response.statusCode}');
      }
    } catch (e) {
      if (e is PremiumRequiredException) {
        rethrow;
      }
      print('Error generating full TOEIC test: $e');
      throw Exception('Cannot generate full TOEIC test from backend: $e');
    }
  }

  // Nộp bài test
  static Future<TestSubmissionResult> submitTest(TestSubmission submission) async {
    try {
      print('Submitting test to backend API...');
      
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }
      
      final requestBody = {
        'testId': submission.testId,
        'answers': submission.answers.map((answer) => {
          'questionId': answer.questionId,
          'selectedOption': answer.selectedOption,
        }).toList(),
      };
      
      print('Submitting to API: ${json.encode(requestBody)}');
      
      final response = await http.post(
        Uri.parse('$baseUrl/submit'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: json.encode(requestBody),
      );

      print('Submit response status: ${response.statusCode}');
      print('Submit response body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        
        // Backend now returns scoreListen, scoreRead, resultId, and message
        final scoreListen = data['scoreListen'] ?? 0;
        final scoreRead = data['scoreRead'] ?? 0;
        final resultId = data['resultId']; // Use actual resultId from backend
        final message = data['message'] ?? 'Test submitted successfully';
        
        if (resultId == null) {
          throw Exception('Backend did not return resultId');
        }
        
        return TestSubmissionResult(
          submissionId: resultId, // Use actual resultId from backend
          message: '$message - Listening: $scoreListen, Reading: $scoreRead',
          result: null, // Will be loaded separately from history
        );
      } else {
        throw Exception('Failed to submit test: HTTP ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Submit error: $e');
      throw Exception('Cannot submit test to backend: $e');
    }
  }

  // Lấy kết quả test
  static Future<TestResult> getTestResult(int resultId) async {
    try {
      print('Fetching test result for resultId: $resultId');
      
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/submit/result/$resultId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print('Result response status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        print('Successfully fetched test result from backend');
        return TestResult.fromJson(data);
      } else {
        throw Exception('Failed to load test result: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error loading test result: $e');
      throw Exception('Cannot load test result from backend: $e');
    }
  }

  // Lấy lịch sử làm bài của user 
  static Future<List<TestResult>> getTestHistory() async {
    try {
      print('Fetching test history from backend API...');
      
      // Get authentication token and user info from AuthService
      String? authToken = AuthService.instance.token;
      final user = AuthService.instance.currentUser;
      if (authToken == null || user == null) {
        throw Exception('User not authenticated - no token or user info available');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/user-results/user/${user.id}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print('History response status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Successfully fetched ${data.length} test results from backend');
        
        // Convert UserResultSummary to TestResult format
        return data.map((json) {
          return TestResult(
            resultId: json['resultId'] ?? 0,
            testTitle: 'Test ${json['testId'] ?? 'Unknown'}',
            user: user.username,
            scoreListen: json['scoreListen'] ?? 0,
            scoreRead: json['scoreRead'] ?? 0,
            totalScore: ((json['scoreRead'] ?? 0) + (json['scoreListen'] ?? 0)),
            questions: [], // Details not available in summary
          );
        }).toList();
      } else {
        throw Exception('Failed to load test history: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error loading test history: $e');
      throw Exception('Cannot load test history from backend: $e');
    }
  }

  // Lấy chi tiết kết quả test để hiển thị đáp án
  static Future<TestResultDetail> getTestResultDetail(int resultId) async {
    try {
      print('Fetching detailed test result for resultId: $resultId');
      
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/test-results/$resultId/detail'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print('Detail response status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        print('Successfully fetched detailed test result from backend');
        
        // Fix URLs in the response data before creating the model
        if (data['answers'] != null) {
          for (var answer in data['answers'] as List) {
            if (answer['audioUrl'] != null) {
              answer['audioUrl'] = _buildFullUrl(answer['audioUrl']);
            }
            if (answer['imageUrl'] != null) {
              answer['imageUrl'] = _buildFullUrl(answer['imageUrl']);
            }
          }
        }
        
        return TestResultDetail.fromJson(data);
      } else {
        throw Exception('Failed to load test result detail: HTTP ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error loading test result detail: $e');
      throw Exception('Cannot load test result detail from backend: $e');
    }
  }

  // Helper method to build full URLs from relative paths
  static String? _buildFullUrl(String? path) {
    if (path == null || path.isEmpty) {
      return null;
    }
    
    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/$path';
    }
    
    return '$backendBaseUrl$path';
  }
}
