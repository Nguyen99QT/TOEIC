import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/test_models.dart';
import '../core/services/auth_service.dart';

class TestService {
  static const String baseUrl = 'http://10.0.2.2:8080/api';

  // Lấy danh sách tất cả các bài test
  static Future<List<Test>> getAllTests() async {
    try {
      print('Fetching tests from backend API...');
      final response = await http.get(
        Uri.parse('$baseUrl/tests/selection/available'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      print('API Response Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Successfully fetched ${data.length} tests from backend');
        return data.map((json) => Test.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load tests: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error loading tests from backend: $e');
      throw Exception('Cannot load tests from backend: $e');
    }
  }

  // Lấy chi tiết bài test và câu hỏi
  static Future<TestDetail> getTestQuestions(int testId) async {
    try {
      print('Fetching test questions for testId: $testId');
      final response = await http.get(
        Uri.parse('$baseUrl/tests/$testId/parts'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      print('API Response Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Successfully fetched ${data.length} questions from backend');
        
        // Convert backend format to mobile format
        List<TestQuestion> questions = data.map((item) {
          List<TestOption> options = [];
          
          // Add options if they exist and are not null
          if (item['optionA'] != null && item['optionA'].toString().isNotEmpty) {
            options.add(TestOption(label: 'A', content: item['optionA']));
          }
          if (item['optionB'] != null && item['optionB'].toString().isNotEmpty) {
            options.add(TestOption(label: 'B', content: item['optionB']));
          }
          if (item['optionC'] != null && item['optionC'].toString().isNotEmpty) {
            options.add(TestOption(label: 'C', content: item['optionC']));
          }
          if (item['optionD'] != null && item['optionD'].toString().isNotEmpty) {
            options.add(TestOption(label: 'D', content: item['optionD']));
          }
          
          return TestQuestion(
            questionId: item['questionId'] ?? 0,
            questionText: item['questionText'] ?? '',
            partNumber: item['partNumber'] ?? 1,
            questionOrder: item['questionOrder'] ?? 0,
            audioUrl: item['audioUrl'],
            imageUrl: item['imageUrl'],
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
        throw Exception('Failed to load test questions: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error loading test questions: $e');
      throw Exception('Cannot load test questions from backend: $e');
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
      } else {
        throw Exception('Failed to generate quick test: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error generating quick test: $e');
      throw Exception('Cannot generate quick test from backend: $e');
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
        
        final resultId = data['resultId'] ?? data['id'] ?? DateTime.now().millisecondsSinceEpoch;
        
        return TestSubmissionResult(
          submissionId: resultId,
          message: data['message'] ?? 'Test submitted successfully',
          result: null, // Will be loaded separately
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
      
      // Get authentication token from AuthService
      String? authToken = AuthService.instance.token;
      if (authToken == null) {
        throw Exception('User not authenticated - no token available');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/user/test-history'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      print('History response status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Successfully fetched ${data.length} test results from backend');
        return data.map((json) => TestResult.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load test history: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error loading test history: $e');
      throw Exception('Cannot load test history from backend: $e');
    }
  }
}
