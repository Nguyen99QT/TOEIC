class Question {
  final String id;
  final String type; // 'listening' or 'reading'
  final String question;
  final List<String> options;
  final String correctAnswer;
  final String? audioUrl;
  final String? imageUrl;
  final int difficulty; // 1-5 scale
  final String section; // Part 1-7 for TOEIC

  const Question({
    required this.id,
    required this.type,
    required this.question,
    required this.options,
    required this.correctAnswer,
    this.audioUrl,
    this.imageUrl,
    required this.difficulty,
    required this.section,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] as String,
      type: json['type'] as String,
      question: json['question'] as String,
      options: List<String>.from(json['options'] as List),
      correctAnswer: json['correctAnswer'] as String,
      audioUrl: json['audioUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      difficulty: json['difficulty'] as int,
      section: json['section'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'question': question,
      'options': options,
      'correctAnswer': correctAnswer,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'difficulty': difficulty,
      'section': section,
    };
  }
}

class TestResult {
  final String id;
  final String userId;
  final String testType;
  final int totalQuestions;
  final int correctAnswers;
  final int score;
  final DateTime completedAt;
  final Duration timeSpent;

  const TestResult({
    required this.id,
    required this.userId,
    required this.testType,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.score,
    required this.completedAt,
    required this.timeSpent,
  });

  factory TestResult.fromJson(Map<String, dynamic> json) {
    return TestResult(
      id: json['id'] as String,
      userId: json['userId'] as String,
      testType: json['testType'] as String,
      totalQuestions: json['totalQuestions'] as int,
      correctAnswers: json['correctAnswers'] as int,
      score: json['score'] as int,
      completedAt: DateTime.parse(json['completedAt'] as String),
      timeSpent: Duration(seconds: json['timeSpentSeconds'] as int),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'testType': testType,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'score': score,
      'completedAt': completedAt.toIso8601String(),
      'timeSpentSeconds': timeSpent.inSeconds,
    };
  }

  double get percentage => (correctAnswers / totalQuestions) * 100;
}
