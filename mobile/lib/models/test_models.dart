class Test {
  final int testId;
  final String title;
  final String description;
  final String createdAt;
  final int? totalQuestions;
  final String? testType;
  final bool? isNewlyCreated;
  final TestCreator? createdBy;

  Test({
    required this.testId,
    required this.title,
    required this.description,
    required this.createdAt,
    this.totalQuestions,
    this.testType,
    this.isNewlyCreated,
    this.createdBy,
  });

  factory Test.fromJson(Map<String, dynamic> json) {
    return Test(
      testId: json['testId'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      createdAt: json['createdAt'] ?? '',
      totalQuestions: json['totalQuestions'],
      testType: json['testType'],
      isNewlyCreated: json['isNewlyCreated'],
      createdBy: json['createdBy'] != null 
        ? TestCreator.fromJson(json['createdBy'])
        : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'testId': testId,
      'title': title,
      'description': description,
      'createdAt': createdAt,
      'totalQuestions': totalQuestions,
      'testType': testType,
      'isNewlyCreated': isNewlyCreated,
      'createdBy': createdBy?.toJson(),
    };
  }
}

class TestCreator {
  final int id;
  final String username;

  TestCreator({
    required this.id,
    required this.username,
  });

  factory TestCreator.fromJson(Map<String, dynamic> json) {
    return TestCreator(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
    };
  }
}

class TestQuestion {
  final int questionId;
  final String questionText;
  final int partNumber;
  final int questionOrder;
  final String? audioUrl;
  final String? imageUrl;
  final List<TestOption> options;

  TestQuestion({
    required this.questionId,
    required this.questionText,
    required this.partNumber,
    required this.questionOrder,
    this.audioUrl,
    this.imageUrl,
    required this.options,
  });

  factory TestQuestion.fromJson(Map<String, dynamic> json) {
    return TestQuestion(
      questionId: json['questionId'] ?? 0,
      questionText: json['questionText'] ?? '',
      partNumber: json['partNumber'] ?? 1,
      questionOrder: json['questionOrder'] ?? 0,
      audioUrl: json['audioUrl'],
      imageUrl: json['imageUrl'],
      options: (json['options'] as List<dynamic>?)
          ?.map((option) => TestOption.fromJson(option))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'questionId': questionId,
      'questionText': questionText,
      'partNumber': partNumber,
      'questionOrder': questionOrder,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'options': options.map((option) => option.toJson()).toList(),
    };
  }
}

class TestOption {
  final String label;
  final String content;

  TestOption({
    required this.label,
    required this.content,
  });

  factory TestOption.fromJson(Map<String, dynamic> json) {
    return TestOption(
      label: json['label'] ?? '',
      content: json['content'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'content': content,
    };
  }
}

class TestDetail {
  final Test test;
  final List<TestQuestion> questions;

  TestDetail({
    required this.test,
    required this.questions,
  });

  factory TestDetail.fromJson(Map<String, dynamic> json) {
    return TestDetail(
      test: Test.fromJson(json['test'] ?? {}),
      questions: (json['questions'] as List<dynamic>?)
          ?.map((question) => TestQuestion.fromJson(question))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'test': test.toJson(),
      'questions': questions.map((q) => q.toJson()).toList(),
    };
  }
}

class QuickTestResult {
  final int testId;
  final String message;

  QuickTestResult({
    required this.testId,
    required this.message,
  });

  factory QuickTestResult.fromJson(Map<String, dynamic> json) {
    return QuickTestResult(
      testId: json['testId'] ?? 0,
      message: json['message'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'testId': testId,
      'message': message,
    };
  }
}

class TestSubmission {
  final int userId;
  final int testId;
  final List<TestAnswer> answers;

  TestSubmission({
    required this.userId,
    required this.testId,
    required this.answers,
  });

  factory TestSubmission.fromJson(Map<String, dynamic> json) {
    return TestSubmission(
      userId: json['userId'] ?? 0,
      testId: json['testId'] ?? 0,
      answers: (json['answers'] as List<dynamic>?)
          ?.map((answer) => TestAnswer.fromJson(answer))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'testId': testId,
      'answers': answers.map((answer) => answer.toJson()).toList(),
    };
  }
}

class TestAnswer {
  final int questionId;
  final String selectedOption;

  TestAnswer({
    required this.questionId,
    required this.selectedOption,
  });

  factory TestAnswer.fromJson(Map<String, dynamic> json) {
    return TestAnswer(
      questionId: json['questionId'] ?? 0,
      selectedOption: json['selectedOption'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'questionId': questionId,
      'selectedOption': selectedOption,
    };
  }
}

class TestSubmissionResult {
  final int submissionId;
  final String message;
  final TestResult? result;

  TestSubmissionResult({
    required this.submissionId,
    required this.message,
    this.result,
  });

  factory TestSubmissionResult.fromJson(Map<String, dynamic> json) {
    return TestSubmissionResult(
      submissionId: json['submissionId'] ?? 0,
      message: json['message'] ?? '',
      result: json['result'] != null 
        ? TestResult.fromJson(json['result'])
        : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'submissionId': submissionId,
      'message': message,
      'result': result?.toJson(),
    };
  }
}

class TestResult {
  final int resultId;
  final String testTitle;
  final String user;
  final int scoreListen;
  final int scoreRead;
  final int totalScore;
  final List<TestResultQuestion> questions;

  TestResult({
    required this.resultId,
    required this.testTitle,
    required this.user,
    required this.scoreListen,
    required this.scoreRead,
    required this.totalScore,
    required this.questions,
  });

  factory TestResult.fromJson(Map<String, dynamic> json) {
    return TestResult(
      resultId: json['resultId'] ?? 0,
      testTitle: json['testTitle'] ?? '',
      user: json['user'] ?? '',
      scoreListen: json['scoreListen'] ?? 0,
      scoreRead: json['scoreRead'] ?? 0,
      totalScore: (json['scoreListen'] ?? 0) + (json['scoreRead'] ?? 0),
      questions: (json['questions'] as List<dynamic>?)
          ?.map((q) => TestResultQuestion.fromJson(q))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'resultId': resultId,
      'testTitle': testTitle,
      'user': user,
      'scoreListen': scoreListen,
      'scoreRead': scoreRead,
      'totalScore': totalScore,
      'questions': questions.map((q) => q.toJson()).toList(),
    };
  }
}

class TestResultQuestion {
  final int id;
  final int part;
  final String questionText;
  final String? imageUrl;
  final String? audioUrl;
  final String correctOption;
  final String userOption;
  final bool isCorrect;
  final List<TestResultOption> options;

  TestResultQuestion({
    required this.id,
    required this.part,
    required this.questionText,
    this.imageUrl,
    this.audioUrl,
    required this.correctOption,
    required this.userOption,
    required this.isCorrect,
    required this.options,
  });

  factory TestResultQuestion.fromJson(Map<String, dynamic> json) {
    return TestResultQuestion(
      id: json['id'] ?? 0,
      part: json['part'] ?? 1,
      questionText: json['questionText'] ?? '',
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      correctOption: json['correctOption'] ?? '',
      userOption: json['userOption'] ?? '',
      isCorrect: json['isCorrect'] ?? false,
      options: (json['options'] as List<dynamic>?)
          ?.map((opt) => TestResultOption.fromJson(opt))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'part': part,
      'questionText': questionText,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'correctOption': correctOption,
      'userOption': userOption,
      'isCorrect': isCorrect,
      'options': options.map((opt) => opt.toJson()).toList(),
    };
  }
}

class TestResultOption {
  final String label;
  final String text;

  TestResultOption({
    required this.label,
    required this.text,
  });

  factory TestResultOption.fromJson(Map<String, dynamic> json) {
    return TestResultOption(
      label: json['label'] ?? '',
      text: json['text'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'text': text,
    };
  }
}

class PartScore {
  final int partNumber;
  final int totalQuestions;
  final int correctAnswers;
  final double scorePercentage;

  PartScore({
    required this.partNumber,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.scorePercentage,
  });

  factory PartScore.fromJson(Map<String, dynamic> json) {
    return PartScore(
      partNumber: json['partNumber'] ?? 0,
      totalQuestions: json['totalQuestions'] ?? 0,
      correctAnswers: json['correctAnswers'] ?? 0,
      scorePercentage: (json['scorePercentage'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'partNumber': partNumber,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'scorePercentage': scorePercentage,
    };
  }
}

class TestHistory {
  final int resultId;
  final String testTitle;
  final String testDescription;
  final int totalScore;
  final int estimatedToeicScore;
  final String completedAt;
  final int totalQuestions;
  final int correctAnswers;
  final double scorePercentage;

  TestHistory({
    required this.resultId,
    required this.testTitle,
    required this.testDescription,
    required this.totalScore,
    required this.estimatedToeicScore,
    required this.completedAt,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.scorePercentage,
  });

  factory TestHistory.fromJson(Map<String, dynamic> json) {
    return TestHistory(
      resultId: json['resultId'] ?? 0,
      testTitle: json['testTitle'] ?? '',
      testDescription: json['testDescription'] ?? '',
      totalScore: json['totalScore'] ?? 0,
      estimatedToeicScore: json['estimatedToeicScore'] ?? 0,
      completedAt: json['completedAt'] ?? '',
      totalQuestions: json['totalQuestions'] ?? 0,
      correctAnswers: json['correctAnswers'] ?? 0,
      scorePercentage: (json['scorePercentage'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'resultId': resultId,
      'testTitle': testTitle,
      'testDescription': testDescription,
      'totalScore': totalScore,
      'estimatedToeicScore': estimatedToeicScore,
      'completedAt': completedAt,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'scorePercentage': scorePercentage,
    };
  }
}
