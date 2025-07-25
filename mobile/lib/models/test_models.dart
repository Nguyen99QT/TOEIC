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
  final String? content; // Add content field for reading comprehension parts
  final List<TestOption> options;

  TestQuestion({
    required this.questionId,
    required this.questionText,
    required this.partNumber,
    required this.questionOrder,
    this.audioUrl,
    this.imageUrl,
    this.content,
    required this.options,
  });

  factory TestQuestion.fromJson(Map<String, dynamic> json) {
    // Parse options from backend format (optionA, optionB, optionC, optionD)
    List<TestOption> options = [];
    
    if (json['optionA'] != null && json['optionA'].toString().isNotEmpty) {
      options.add(TestOption(label: 'A', content: json['optionA']));
    }
    if (json['optionB'] != null && json['optionB'].toString().isNotEmpty) {
      options.add(TestOption(label: 'B', content: json['optionB']));
    }
    if (json['optionC'] != null && json['optionC'].toString().isNotEmpty) {
      options.add(TestOption(label: 'C', content: json['optionC']));
    }
    if (json['optionD'] != null && json['optionD'].toString().isNotEmpty) {
      options.add(TestOption(label: 'D', content: json['optionD']));
    }

    return TestQuestion(
      questionId: json['questionId'] ?? 0,
      questionText: json['questionText'] ?? '',
      partNumber: json['partNumber'] ?? 1,
      questionOrder: json['questionOrder'] ?? 0,
      audioUrl: json['audioUrl'],
      imageUrl: json['imageUrl'],
      content: json['content'], // Add content from backend
      options: options,
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
      'content': content,
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
  final Map<int, List<TestQuestion>> questionsByPart;
  final List<int> availableParts;

  TestDetail({
    required this.test,
    required this.questions,
  }) : questionsByPart = _groupQuestionsByPart(questions),
       availableParts = _getAvailableParts(questions);

  static Map<int, List<TestQuestion>> _groupQuestionsByPart(List<TestQuestion> questions) {
    Map<int, List<TestQuestion>> grouped = {};
    for (var question in questions) {
      if (!grouped.containsKey(question.partNumber)) {
        grouped[question.partNumber] = [];
      }
      grouped[question.partNumber]!.add(question);
    }
    
    // Sort questions within each part by questionOrder
    for (var part in grouped.keys) {
      grouped[part]!.sort((a, b) => a.questionOrder.compareTo(b.questionOrder));
    }
    
    return grouped;
  }

  static List<int> _getAvailableParts(List<TestQuestion> questions) {
    Set<int> parts = questions.map((q) => q.partNumber).toSet();
    List<int> sortedParts = parts.toList()..sort();
    return sortedParts;
  }

  // Get part info for display
  String getPartTitle(int partNumber) {
    switch (partNumber) {
      case 1: return 'Part 1: Photographs';
      case 2: return 'Part 2: Question-Response';
      case 3: return 'Part 3: Conversations';
      case 4: return 'Part 4: Talks';
      case 5: return 'Part 5: Incomplete Sentences';
      case 6: return 'Part 6: Text Completion';
      case 7: return 'Part 7: Reading Comprehension';
      default: return 'Part $partNumber';
    }
  }

  String getPartDescription(int partNumber) {
    switch (partNumber) {
      case 1: return 'Look at the picture and select the best description.';
      case 2: return 'Listen to the question and select the best response.';
      case 3: return 'Listen to the conversation and answer questions.';
      case 4: return 'Listen to the talk and answer questions.';
      case 5: return 'Select the word or phrase that best completes the sentence.';
      case 6: return 'Read the text and select the best word or phrase for each blank.';
      case 7: return 'Read the passage and answer the questions.';
      default: return 'Answer the questions for this part.';
    }
  }

  int getPartQuestionCount(int partNumber) {
    return questionsByPart[partNumber]?.length ?? 0;
  }

  int getTotalQuestions() {
    return questions.length;
  }

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

class TestResultDetail {
  final int resultId;
  final String testTitle;
  final int totalScore;
  final int listeningScore;
  final int readingScore;
  final int totalQuestions;
  final int correctAnswers;
  final double percentage;
  final String? startedAt;
  final String? finishedAt;
  final List<QuestionAnswerDetail> answers;

  TestResultDetail({
    required this.resultId,
    required this.testTitle,
    required this.totalScore,
    required this.listeningScore,
    required this.readingScore,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.percentage,
    this.startedAt,
    this.finishedAt,
    required this.answers,
  });

  factory TestResultDetail.fromJson(Map<String, dynamic> json) {
    return TestResultDetail(
      resultId: json['resultId'] ?? 0,
      testTitle: json['testTitle'] ?? '',
      totalScore: json['totalScore'] ?? 0,
      listeningScore: json['listeningScore'] ?? 0,
      readingScore: json['readingScore'] ?? 0,
      totalQuestions: json['totalQuestions'] ?? 0,
      correctAnswers: json['correctAnswers'] ?? 0,
      percentage: (json['percentage'] ?? 0.0).toDouble(),
      startedAt: json['startedAt'],
      finishedAt: json['finishedAt'],
      answers: (json['answers'] as List<dynamic>?)
          ?.map((answer) => QuestionAnswerDetail.fromJson(answer))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'resultId': resultId,
      'testTitle': testTitle,
      'totalScore': totalScore,
      'listeningScore': listeningScore,
      'readingScore': readingScore,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'percentage': percentage,
      'startedAt': startedAt,
      'finishedAt': finishedAt,
      'answers': answers.map((answer) => answer.toJson()).toList(),
    };
  }

  Map<int, List<QuestionAnswerDetail>> get answersByPart {
    Map<int, List<QuestionAnswerDetail>> grouped = {};
    for (var answer in answers) {
      int part = answer.partNumber;
      if (!grouped.containsKey(part)) {
        grouped[part] = [];
      }
      grouped[part]!.add(answer);
    }
    return grouped;
  }

  List<PartScore> getPartScores() {
    var byPart = answersByPart;
    return byPart.entries.map((entry) {
      int part = entry.key;
      var partAnswers = entry.value;
      int correct = partAnswers.where((a) => a.isCorrect).length;
      int total = partAnswers.length;
      double percentage = total > 0 ? (correct / total) * 100 : 0.0;
      
      return PartScore(
        partNumber: part,
        totalQuestions: total,
        correctAnswers: correct,
        scorePercentage: percentage,
      );
    }).toList()..sort((a, b) => a.partNumber.compareTo(b.partNumber));
  }
}

class QuestionAnswerDetail {
  final int questionId;
  final String questionText;
  final String selectedOption;
  final String correctOption;
  final bool isCorrect;
  final int partNumber;
  final String? answeredAt;
  final String? imageUrl;
  final String? audioUrl;
  final List<OptionDetail> options;

  QuestionAnswerDetail({
    required this.questionId,
    required this.questionText,
    required this.selectedOption,
    required this.correctOption,
    required this.isCorrect,
    required this.partNumber,
    this.answeredAt,
    this.imageUrl,
    this.audioUrl,
    required this.options,
  });

  factory QuestionAnswerDetail.fromJson(Map<String, dynamic> json) {
    return QuestionAnswerDetail(
      questionId: json['questionId'] ?? 0,
      questionText: json['questionText'] ?? '',
      selectedOption: json['userAnswer'] ?? '',
      correctOption: json['correctAnswer'] ?? '',
      isCorrect: json['isCorrect'] ?? false,
      partNumber: json['partNumber'] ?? 1,
      answeredAt: json['answeredAt'],
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      options: (json['options'] as List<dynamic>?)
          ?.map((option) => OptionDetail.fromJson(option))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'questionId': questionId,
      'questionText': questionText,
      'selectedOption': selectedOption,
      'correctOption': correctOption,
      'isCorrect': isCorrect,
      'partNumber': partNumber,
      'answeredAt': answeredAt,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'options': options.map((option) => option.toJson()).toList(),
    };
  }
}

class OptionDetail {
  final String label;
  final String content;

  OptionDetail({
    required this.label,
    required this.content,
  });

  factory OptionDetail.fromJson(Map<String, dynamic> json) {
    return OptionDetail(
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
