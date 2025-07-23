import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/test_models.dart';
import '../core/services/auth_service.dart';

class TestService {
  static const String baseUrl = 'http://10.0.2.2:8080/api';

  // Lấy danh sách tất cả các bài test
  static Future<List<Test>> getAllTests() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/tests/selection/available'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.instance.token}',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Test.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load tests');
      }
    } catch (e) {
      throw Exception('Error loading tests: $e');
    }
  }

  // Lấy chi tiết bài test và câu hỏi
  static Future<TestDetail> getTestQuestions(int testId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/tests/$testId/parts'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.instance.token}',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        
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

        // Create a test detail with basic test info
        Test test = Test(
          testId: testId,
          title: 'Test $testId',
          description: 'Test description',
          createdAt: DateTime.now().toIso8601String(),
        );

        return TestDetail(test: test, questions: questions);
      } else {
        throw Exception('Failed to load test questions');
      }
    } catch (e) {
      throw Exception('Error loading test questions: $e');
    }
  }

  // Tạo test nhanh
  static Future<QuickTestResult> generateQuickTest() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/tests/selection/generate-quick'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.instance.token}',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return QuickTestResult(
          testId: data['testId'] ?? 0,
          message: data['message'] ?? 'Quick test generated successfully',
        );
      } else {
        throw Exception('Failed to generate quick test');
      }
    } catch (e) {
      throw Exception('Error generating quick test: $e');
    }
  }

  // Nộp bài test
  static Future<TestSubmissionResult> submitTest(TestSubmission submission) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/submit'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.instance.token}',
        },
        body: json.encode({
          'testId': submission.testId,
          'answers': submission.answers.map((answer) => {
            'questionId': answer.questionId,
            'selectedOption': answer.selectedOption,
          }).toList(),
        }),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        
        // Get detailed result with answers
        final resultId = data['resultId'] ?? data['id'] ?? 1;
        final detailResult = await getTestResult(resultId);
        
        return TestSubmissionResult(
          submissionId: resultId,
          message: 'Test submitted successfully',
          result: detailResult,
        );
      } else {
        throw Exception('Failed to submit test: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error submitting test: $e');
    }
  }

  // Lấy kết quả test
  static Future<TestResult> getTestResult(int resultId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/submit/result/$resultId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.instance.token}',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return TestResult.fromJson(data);
      } else {
        throw Exception('Failed to load test result');
      }
    } catch (e) {
      throw Exception('Error loading test result: $e');
    }
  }

  // Lấy lịch sử làm bài của user (tạm thời dùng mock data)
  static Future<List<TestHistory>> getUserTestHistory() async {
    try {
      // Tạm thời return mock data cho đến khi backend có endpoint
      await Future.delayed(const Duration(seconds: 1)); // Simulate network delay
      
      return [
        TestHistory(
          resultId: 1,
          testTitle: 'TOEIC Practice Test 1',
          testDescription: 'Full practice test with 200 questions',
          totalScore: 450,
          estimatedToeicScore: 750,
          completedAt: DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
          totalQuestions: 200,
          correctAnswers: 150,
          scorePercentage: 75.0,
        ),
        TestHistory(
          resultId: 2,
          testTitle: 'Listening Practice',
          testDescription: 'Listening section practice',
          totalScore: 220,
          estimatedToeicScore: 680,
          completedAt: DateTime.now().subtract(const Duration(days: 5)).toIso8601String(),
          totalQuestions: 100,
          correctAnswers: 68,
          scorePercentage: 68.0,
        ),
        TestHistory(
          resultId: 3,
          testTitle: 'Reading Practice',
          testDescription: 'Reading section practice',
          totalScore: 280,
          estimatedToeicScore: 720,
          completedAt: DateTime.now().subtract(const Duration(days: 7)).toIso8601String(),
          totalQuestions: 100,
          correctAnswers: 72,
          scorePercentage: 72.0,
        ),
      ];
    } catch (e) {
      throw Exception('Error loading test history: $e');
    }
  }

  // Get test history for current user
  static Future<List<TestResult>> getTestHistory() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/user/test-history'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((item) => TestResult.fromJson(item)).toList();
      } else {
        throw Exception('Failed to load test history');
      }
    } catch (e) {
      print('Error loading test history: $e');
      // Return empty list for now - replace with actual error handling
      return [];
    }
  }
}
