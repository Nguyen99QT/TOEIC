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

  static List<Test> _createMockTestList() {
    return [
      Test(
        testId: 1,
        title: 'Complete TOEIC Practice Test A',
        description: 'Full TOEIC test with all 7 parts (200 questions)',
        createdAt: DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
      ),
      Test(
        testId: 2,
        title: 'TOEIC Simulation Test B',
        description: 'Realistic TOEIC simulation covering all sections',
        createdAt: DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
      ),
      Test(
        testId: 3,
        title: 'Official TOEIC Mock Test C',
        description: 'Official-style TOEIC test for practice',
        createdAt: DateTime.now().subtract(const Duration(days: 3)).toIso8601String(),
      ),
      Test(
        testId: 4,
        title: 'TOEIC Listening Focus Test',
        description: 'Enhanced listening practice with Parts 1-4',
        createdAt: DateTime.now().subtract(const Duration(days: 4)).toIso8601String(),
      ),
      Test(
        testId: 5,
        title: 'TOEIC Reading Mastery Test',
        description: 'Intensive reading practice with Parts 5-7',
        createdAt: DateTime.now().subtract(const Duration(days: 5)).toIso8601String(),
      ),
      Test(
        testId: 6,
        title: 'Quick TOEIC Assessment',
        description: 'Shortened TOEIC test for quick evaluation',
        createdAt: DateTime.now().subtract(const Duration(days: 6)).toIso8601String(),
      ),
      Test(
        testId: 7,
        title: 'TOEIC Business English Test',
        description: 'Business-focused TOEIC with workplace scenarios',
        createdAt: DateTime.now().subtract(const Duration(days: 7)).toIso8601String(),
      ),
      Test(
        testId: 8,
        title: 'Advanced TOEIC Challenge',
        description: 'High-level TOEIC test for advanced learners',
        createdAt: DateTime.now().subtract(const Duration(days: 8)).toIso8601String(),
      ),
    ];
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

  static TestDetail _createMockTestDetail(int testId) {
    String testTitle;
    List<TestQuestion> questions = [];
    
    // Create different test content based on testId
    switch (testId % 3) {
      case 0:
        testTitle = 'Complete TOEIC Practice Test A';
        questions = _generateMockTestQuestions(testId, 'A');
        break;
      case 1:
        testTitle = 'TOEIC Simulation Test B';
        questions = _generateMockTestQuestions(testId, 'B');
        break;
      default:
        testTitle = 'Official TOEIC Mock Test C';
        questions = _generateMockTestQuestions(testId, 'C');
        break;
    }

    Test test = Test(
      testId: testId,
      title: testTitle,
      description: 'Mock TOEIC test with all 7 parts',
      createdAt: DateTime.now().toIso8601String(),
    );

    return TestDetail(test: test, questions: questions);
  }

  static List<TestQuestion> _generateMockTestQuestions(int testId, String variant) {
    List<TestQuestion> questions = [];
    int questionId = 1;

    // Part 1: Photographs (6 questions)
    for (int i = 0; i < 6; i++) {
      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: 'Look at the picture marked number ${i + 1}.',
        partNumber: 1,
        questionOrder: i + 1,
        audioUrl: 'https://example.com/audio/part1_${i + 1}.mp3',
        imageUrl: 'https://example.com/images/part1_${i + 1}.jpg',
        options: [
          TestOption(label: 'A', content: 'A person is sitting at a desk.'),
          TestOption(label: 'B', content: 'People are walking outside.'),
          TestOption(label: 'C', content: 'A meeting is taking place.'),
          TestOption(label: 'D', content: 'Equipment is being used.'),
        ],
      ));
    }

    // Part 2: Question-Response (25 questions)
    for (int i = 0; i < 25; i++) {
      String questionText;
      List<TestOption> options;
      
      switch (i % 5) {
        case 0:
          questionText = 'When will the presentation begin?';
          options = [
            TestOption(label: 'A', content: 'At 3 o\'clock.'),
            TestOption(label: 'B', content: 'In the conference room.'),
            TestOption(label: 'C', content: 'Yes, it will be informative.'),
          ];
          break;
        case 1:
          questionText = 'Where did you put the reports?';
          options = [
            TestOption(label: 'A', content: 'On the manager\'s desk.'),
            TestOption(label: 'B', content: 'Yesterday afternoon.'),
            TestOption(label: 'C', content: 'Three copies were made.'),
          ];
          break;
        case 2:
          questionText = 'Who is responsible for the project?';
          options = [
            TestOption(label: 'A', content: 'Ms. Park from marketing.'),
            TestOption(label: 'B', content: 'It\'s due next week.'),
            TestOption(label: 'C', content: 'In the development department.'),
          ];
          break;
        case 3:
          questionText = 'How often do you check your email?';
          options = [
            TestOption(label: 'A', content: 'Several times a day.'),
            TestOption(label: 'B', content: 'On my computer.'),
            TestOption(label: 'C', content: 'Yes, I received it.'),
          ];
          break;
        default:
          questionText = 'What time does the store close?';
          options = [
            TestOption(label: 'A', content: 'At 9 PM tonight.'),
            TestOption(label: 'B', content: 'On Main Street.'),
            TestOption(label: 'C', content: 'It sells electronics.'),
          ];
      }

      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: questionText,
        partNumber: 2,
        questionOrder: (i + 1),
        audioUrl: 'https://example.com/audio/part2_${i + 1}.mp3',
        imageUrl: null,
        options: options,
      ));
    }

    // Part 3: Conversations (39 questions)
    for (int i = 0; i < 39; i++) {
      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: 'What does the man/woman suggest?',
        partNumber: 3,
        questionOrder: i + 1,
        audioUrl: 'https://example.com/audio/part3_set${(i ~/ 3) + 1}.mp3',
        imageUrl: null,
        options: [
          TestOption(label: 'A', content: 'Calling the client immediately.'),
          TestOption(label: 'B', content: 'Rescheduling the meeting.'),
          TestOption(label: 'C', content: 'Reviewing the document again.'),
          TestOption(label: 'D', content: 'Waiting for more information.'),
        ],
      ));
    }

    // Part 4: Talks (30 questions)
    for (int i = 0; i < 30; i++) {
      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: 'What is the main purpose of this announcement?',
        partNumber: 4,
        questionOrder: i + 1,
        audioUrl: 'https://example.com/audio/part4_talk${(i ~/ 3) + 1}.mp3',
        imageUrl: null,
        options: [
          TestOption(label: 'A', content: 'To inform about schedule changes.'),
          TestOption(label: 'B', content: 'To introduce new policies.'),
          TestOption(label: 'C', content: 'To announce a promotion.'),
          TestOption(label: 'D', content: 'To provide safety instructions.'),
        ],
      ));
    }

    // Part 5: Incomplete Sentences (30 questions)
    for (int i = 0; i < 30; i++) {
      String questionText;
      List<TestOption> options;
      
      switch (i % 6) {
        case 0:
          questionText = 'The new employees will _____ a comprehensive training program.';
          options = [
            TestOption(label: 'A', content: 'attend'),
            TestOption(label: 'B', content: 'attending'),
            TestOption(label: 'C', content: 'attended'),
            TestOption(label: 'D', content: 'attendance'),
          ];
          break;
        case 1:
          questionText = 'Ms. Johnson is _____ for her excellent leadership skills.';
          options = [
            TestOption(label: 'A', content: 'known'),
            TestOption(label: 'B', content: 'knowing'),
            TestOption(label: 'C', content: 'knows'),
            TestOption(label: 'D', content: 'know'),
          ];
          break;
        case 2:
          questionText = 'The meeting has been _____ until next Friday.';
          options = [
            TestOption(label: 'A', content: 'postponed'),
            TestOption(label: 'B', content: 'postpone'),
            TestOption(label: 'C', content: 'postponing'),
            TestOption(label: 'D', content: 'postponement'),
          ];
          break;
        case 3:
          questionText = 'Please _____ the report by the end of the week.';
          options = [
            TestOption(label: 'A', content: 'submit'),
            TestOption(label: 'B', content: 'submitting'),
            TestOption(label: 'C', content: 'submitted'),
            TestOption(label: 'D', content: 'submission'),
          ];
          break;
        case 4:
          questionText = 'The company\'s profits have _____ significantly this quarter.';
          options = [
            TestOption(label: 'A', content: 'increased'),
            TestOption(label: 'B', content: 'increasing'),
            TestOption(label: 'C', content: 'increase'),
            TestOption(label: 'D', content: 'increasingly'),
          ];
          break;
        default:
          questionText = 'All employees _____ wear their ID badges at all times.';
          options = [
            TestOption(label: 'A', content: 'must'),
            TestOption(label: 'B', content: 'might'),
            TestOption(label: 'C', content: 'could'),
            TestOption(label: 'D', content: 'would'),
          ];
      }

      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: questionText,
        partNumber: 5,
        questionOrder: i + 1,
        audioUrl: null,
        imageUrl: null,
        options: options,
      ));
    }

    // Part 6: Text Completion (16 questions)
    for (int i = 0; i < 16; i++) {
      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: 'In the email below, select the best word or phrase for blank ${131 + i}.',
        partNumber: 6,
        questionOrder: i + 1,
        audioUrl: null,
        imageUrl: null,
        options: [
          TestOption(label: 'A', content: 'however'),
          TestOption(label: 'B', content: 'therefore'),
          TestOption(label: 'C', content: 'furthermore'),
          TestOption(label: 'D', content: 'nevertheless'),
        ],
      ));
    }

    // Part 7: Reading Comprehension (54 questions)
    for (int i = 0; i < 54; i++) {
      questions.add(TestQuestion(
        questionId: questionId++,
        questionText: 'According to the passage, what is mentioned about the new policy?',
        partNumber: 7,
        questionOrder: i + 1,
        audioUrl: null,
        imageUrl: null,
        options: [
          TestOption(label: 'A', content: 'It will improve efficiency.'),
          TestOption(label: 'B', content: 'It requires manager approval.'),
          TestOption(label: 'C', content: 'It takes effect immediately.'),
          TestOption(label: 'D', content: 'It applies to all departments.'),
        ],
      ));
    }

    return questions;
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

  static TestResult _createMockTestResult(int resultId) {
    // Create different test results based on resultId to simulate variety
    String testTitle;
    int listeningScore;
    int readingScore;
    List<TestResultQuestion> questions;

    // Generate different content based on resultId
    switch (resultId % 3) {
      case 0:
        testTitle = 'Complete TOEIC Practice Test A';
        listeningScore = 350 + (resultId % 50);
        readingScore = 380 + (resultId % 45);
        questions = _generateFullToeicQuestions(resultId, 'A');
        break;
      case 1:
        testTitle = 'TOEIC Simulation Test B';
        listeningScore = 320 + (resultId % 60);
        readingScore = 360 + (resultId % 55);
        questions = _generateFullToeicQuestions(resultId, 'B');
        break;
      default:
        testTitle = 'Official TOEIC Mock Test C';
        listeningScore = 370 + (resultId % 40);
        readingScore = 390 + (resultId % 35);
        questions = _generateFullToeicQuestions(resultId, 'C');
        break;
    }

    return TestResult(
      resultId: resultId,
      testTitle: testTitle,
      user: 'Test User',
      scoreListen: listeningScore,
      scoreRead: readingScore,
      totalScore: listeningScore + readingScore,
      questions: questions,
    );
  }

  static List<TestResultQuestion> _generateFullToeicQuestions(int resultId, String variant) {
    List<TestResultQuestion> questions = [];
    int questionId = 1;

    // Part 1: Photographs (6 questions)
    for (int i = 0; i < 6; i++) {
      questions.add(TestResultQuestion(
        id: questionId++,
        part: 1,
        questionText: 'Look at the picture marked number ${i + 1}.',
        correctOption: ['A', 'B', 'C', 'D'][(questionId + resultId) % 4],
        userOption: ['A', 'B', 'C', 'D'][(questionId + resultId + i) % 4],
        isCorrect: (questionId + resultId) % 3 != 0, // ~67% correct rate
        options: [
          TestResultOption(label: 'A', text: 'A person is sitting at a desk.'),
          TestResultOption(label: 'B', text: 'People are walking outside.'),
          TestResultOption(label: 'C', text: 'A meeting is taking place.'),
          TestResultOption(label: 'D', text: 'Equipment is being used.'),
        ],
      ));
    }

    // Part 2: Question-Response (25 questions)
    for (int i = 0; i < 25; i++) {
      String questionText;
      List<TestResultOption> options;
      
      switch (i % 5) {
        case 0:
          questionText = 'When will the presentation begin?';
          options = [
            TestResultOption(label: 'A', text: 'At 3 o\'clock.'),
            TestResultOption(label: 'B', text: 'In the conference room.'),
            TestResultOption(label: 'C', text: 'Yes, it will be informative.'),
          ];
          break;
        case 1:
          questionText = 'Where did you put the reports?';
          options = [
            TestResultOption(label: 'A', text: 'On the manager\'s desk.'),
            TestResultOption(label: 'B', text: 'Yesterday afternoon.'),
            TestResultOption(label: 'C', text: 'Three copies were made.'),
          ];
          break;
        case 2:
          questionText = 'Who is responsible for the project?';
          options = [
            TestResultOption(label: 'A', text: 'Ms. Park from marketing.'),
            TestResultOption(label: 'B', text: 'It\'s due next week.'),
            TestResultOption(label: 'C', text: 'In the development department.'),
          ];
          break;
        case 3:
          questionText = 'How often do you check your email?';
          options = [
            TestResultOption(label: 'A', text: 'Several times a day.'),
            TestResultOption(label: 'B', text: 'On my computer.'),
            TestResultOption(label: 'C', text: 'Yes, I received it.'),
          ];
          break;
        default:
          questionText = 'What time does the store close?';
          options = [
            TestResultOption(label: 'A', text: 'At 9 PM tonight.'),
            TestResultOption(label: 'B', text: 'On Main Street.'),
            TestResultOption(label: 'C', text: 'It sells electronics.'),
          ];
      }

      questions.add(TestResultQuestion(
        id: questionId++,
        part: 2,
        questionText: questionText,
        correctOption: ['A', 'B', 'C'][(questionId + resultId) % 3],
        userOption: ['A', 'B', 'C'][(questionId + resultId + i) % 3],
        isCorrect: (questionId + resultId + i) % 4 != 0, // ~75% correct rate
        options: options,
      ));
    }

    // Part 3: Conversations (39 questions, 13 sets of 3)
    for (int i = 0; i < 39; i++) {
      questions.add(TestResultQuestion(
        id: questionId++,
        part: 3,
        questionText: 'Question ${32 + i}: What does the man/woman suggest?',
        correctOption: ['A', 'B', 'C', 'D'][(questionId + resultId) % 4],
        userOption: ['A', 'B', 'C', 'D'][(questionId + resultId + i) % 4],
        isCorrect: (questionId + resultId + i) % 3 != 0,
        options: [
          TestResultOption(label: 'A', text: 'Calling the client immediately.'),
          TestResultOption(label: 'B', text: 'Rescheduling the meeting.'),
          TestResultOption(label: 'C', text: 'Reviewing the document again.'),
          TestResultOption(label: 'D', text: 'Waiting for more information.'),
        ],
      ));
    }

    // Part 4: Talks (30 questions, 10 sets of 3)
    for (int i = 0; i < 30; i++) {
      questions.add(TestResultQuestion(
        id: questionId++,
        part: 4,
        questionText: 'Question ${71 + i}: What is the main purpose of this announcement?',
        correctOption: ['A', 'B', 'C', 'D'][(questionId + resultId) % 4],
        userOption: ['A', 'B', 'C', 'D'][(questionId + resultId + i) % 4],
        isCorrect: (questionId + resultId + i) % 4 != 0,
        options: [
          TestResultOption(label: 'A', text: 'To inform about schedule changes.'),
          TestResultOption(label: 'B', text: 'To introduce new policies.'),
          TestResultOption(label: 'C', text: 'To announce a promotion.'),
          TestResultOption(label: 'D', text: 'To provide safety instructions.'),
        ],
      ));
    }

    // Part 5: Incomplete Sentences (30 questions)
    for (int i = 0; i < 30; i++) {
      String questionText;
      List<TestResultOption> options;
      
      switch (i % 6) {
        case 0:
          questionText = 'The new employees will _____ a comprehensive training program.';
          options = [
            TestResultOption(label: 'A', text: 'attend'),
            TestResultOption(label: 'B', text: 'attending'),
            TestResultOption(label: 'C', text: 'attended'),
            TestResultOption(label: 'D', text: 'attendance'),
          ];
          break;
        case 1:
          questionText = 'Ms. Johnson is _____ for her excellent leadership skills.';
          options = [
            TestResultOption(label: 'A', text: 'known'),
            TestResultOption(label: 'B', text: 'knowing'),
            TestResultOption(label: 'C', text: 'knows'),
            TestResultOption(label: 'D', text: 'know'),
          ];
          break;
        case 2:
          questionText = 'The meeting has been _____ until next Friday.';
          options = [
            TestResultOption(label: 'A', text: 'postponed'),
            TestResultOption(label: 'B', text: 'postpone'),
            TestResultOption(label: 'C', text: 'postponing'),
            TestResultOption(label: 'D', text: 'postponement'),
          ];
          break;
        case 3:
          questionText = 'Please _____ the report by the end of the week.';
          options = [
            TestResultOption(label: 'A', text: 'submit'),
            TestResultOption(label: 'B', text: 'submitting'),
            TestResultOption(label: 'C', text: 'submitted'),
            TestResultOption(label: 'D', text: 'submission'),
          ];
          break;
        case 4:
          questionText = 'The company\'s profits have _____ significantly this quarter.';
          options = [
            TestResultOption(label: 'A', text: 'increased'),
            TestResultOption(label: 'B', text: 'increasing'),
            TestResultOption(label: 'C', text: 'increase'),
            TestResultOption(label: 'D', text: 'increasingly'),
          ];
          break;
        default:
          questionText = 'All employees _____ wear their ID badges at all times.';
          options = [
            TestResultOption(label: 'A', text: 'must'),
            TestResultOption(label: 'B', text: 'might'),
            TestResultOption(label: 'C', text: 'could'),
            TestResultOption(label: 'D', text: 'would'),
          ];
      }

      questions.add(TestResultQuestion(
        id: questionId++,
        part: 5,
        questionText: questionText,
        correctOption: ['A', 'B', 'C', 'D'][(questionId + resultId) % 4],
        userOption: ['A', 'B', 'C', 'D'][(questionId + resultId + i) % 4],
        isCorrect: (questionId + resultId + i) % 3 != 0,
        options: options,
      ));
    }

    // Part 6: Text Completion (16 questions, 4 sets of 4)
    for (int i = 0; i < 16; i++) {
      questions.add(TestResultQuestion(
        id: questionId++,
        part: 6,
        questionText: 'In the email below, select the best word or phrase for blank ${131 + i}.',
        correctOption: ['A', 'B', 'C', 'D'][(questionId + resultId) % 4],
        userOption: ['A', 'B', 'C', 'D'][(questionId + resultId + i) % 4],
        isCorrect: (questionId + resultId + i) % 4 != 0,
        options: [
          TestResultOption(label: 'A', text: 'however'),
          TestResultOption(label: 'B', text: 'therefore'),
          TestResultOption(label: 'C', text: 'furthermore'),
          TestResultOption(label: 'D', text: 'nevertheless'),
        ],
      ));
    }

    // Part 7: Reading Comprehension (54 questions)
    for (int i = 0; i < 54; i++) {
      questions.add(TestResultQuestion(
        id: questionId++,
        part: 7,
        questionText: 'Question ${147 + i}: According to the passage, what is mentioned about the new policy?',
        correctOption: ['A', 'B', 'C', 'D'][(questionId + resultId) % 4],
        userOption: ['A', 'B', 'C', 'D'][(questionId + resultId + i) % 4],
        isCorrect: (questionId + resultId + i) % 5 != 0, // ~80% correct rate
        options: [
          TestResultOption(label: 'A', text: 'It will improve efficiency.'),
          TestResultOption(label: 'B', text: 'It requires manager approval.'),
          TestResultOption(label: 'C', text: 'It takes effect immediately.'),
          TestResultOption(label: 'D', text: 'It applies to all departments.'),
        ],
      ));
    }

    return questions;
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
