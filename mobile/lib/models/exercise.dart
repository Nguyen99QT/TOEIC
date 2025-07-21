enum ExerciseType {
  listeningComprehension,
  readingComprehension,
  grammar,
  vocabulary,
  fullTest,
}

enum ExerciseStatus {
  notStarted,
  inProgress,
  completed,
}

enum QuestionType {
  multipleChoice,
  fillInBlank,
  matching,
  ordering,
  trueFalse,
}

class Exercise {
  final String id;
  final String title;
  final String description;
  final ExerciseType type;
  final int duration; // in minutes
  final int totalQuestions;
  final int totalScore;
  final String? audioUrl;
  final String? imageUrl;
  final List<Question> questions;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final String? instructions;
  final int difficulty; // 1-5 scale

  const Exercise({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.duration,
    required this.totalQuestions,
    required this.totalScore,
    this.audioUrl,
    this.imageUrl,
    required this.questions,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
    this.instructions,
    this.difficulty = 1,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: ExerciseType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => ExerciseType.listeningComprehension,
      ),
      duration: json['duration'] as int,
      totalQuestions: json['totalQuestions'] as int,
      totalScore: json['totalScore'] as int,
      audioUrl: json['audioUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((q) => Question.fromJson(q as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      instructions: json['instructions'] as String?,
      difficulty: json['difficulty'] as int? ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type.name,
      'duration': duration,
      'totalQuestions': totalQuestions,
      'totalScore': totalScore,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'questions': questions.map((q) => q.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isActive': isActive,
      'instructions': instructions,
      'difficulty': difficulty,
    };
  }
}

class Question {
  final String id;
  final String exerciseId;
  final String questionText;
  final QuestionType type;
  final String? audioUrl;
  final String? imageUrl;
  final List<AnswerOption> options;
  final String explanation;
  final int orderIndex;
  final int score;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Question({
    required this.id,
    required this.exerciseId,
    required this.questionText,
    required this.type,
    this.audioUrl,
    this.imageUrl,
    required this.options,
    required this.explanation,
    required this.orderIndex,
    required this.score,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] as String,
      exerciseId: json['exerciseId'] as String,
      questionText: json['questionText'] as String,
      type: QuestionType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => QuestionType.multipleChoice,
      ),
      audioUrl: json['audioUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      options: (json['options'] as List<dynamic>?)
              ?.map((o) => AnswerOption.fromJson(o as Map<String, dynamic>))
              .toList() ??
          [],
      explanation: json['explanation'] as String? ?? '',
      orderIndex: json['orderIndex'] as int,
      score: json['score'] as int,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'exerciseId': exerciseId,
      'questionText': questionText,
      'type': type.name,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'options': options.map((o) => o.toJson()).toList(),
      'explanation': explanation,
      'orderIndex': orderIndex,
      'score': score,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class AnswerOption {
  final String id;
  final String questionId;
  final String optionText;
  final bool isCorrect;
  final int orderIndex;
  final String? explanation;

  const AnswerOption({
    required this.id,
    required this.questionId,
    required this.optionText,
    required this.isCorrect,
    required this.orderIndex,
    this.explanation,
  });

  factory AnswerOption.fromJson(Map<String, dynamic> json) {
    return AnswerOption(
      id: json['id'] as String,
      questionId: json['questionId'] as String,
      optionText: json['optionText'] as String,
      isCorrect: json['isCorrect'] as bool,
      orderIndex: json['orderIndex'] as int,
      explanation: json['explanation'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'questionId': questionId,
      'optionText': optionText,
      'isCorrect': isCorrect,
      'orderIndex': orderIndex,
      'explanation': explanation,
    };
  }
}

class ExerciseResult {
  final String id;
  final String userId;
  final String exerciseId;
  final int score;
  final int totalScore;
  final int correctAnswers;
  final int totalQuestions;
  final int timeSpent; // in seconds
  final ExerciseStatus status;
  final DateTime startedAt;
  final DateTime? completedAt;
  final List<UserAnswer> userAnswers;

  const ExerciseResult({
    required this.id,
    required this.userId,
    required this.exerciseId,
    required this.score,
    required this.totalScore,
    required this.correctAnswers,
    required this.totalQuestions,
    required this.timeSpent,
    required this.status,
    required this.startedAt,
    this.completedAt,
    required this.userAnswers,
  });

  double get percentage => totalScore > 0 ? (score / totalScore) * 100 : 0;

  factory ExerciseResult.fromJson(Map<String, dynamic> json) {
    return ExerciseResult(
      id: json['id'] as String,
      userId: json['userId'] as String,
      exerciseId: json['exerciseId'] as String,
      score: json['score'] as int,
      totalScore: json['totalScore'] as int,
      correctAnswers: json['correctAnswers'] as int,
      totalQuestions: json['totalQuestions'] as int,
      timeSpent: json['timeSpent'] as int,
      status: ExerciseStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => ExerciseStatus.notStarted,
      ),
      startedAt: DateTime.parse(json['startedAt'] as String),
      completedAt: json['completedAt'] != null
          ? DateTime.parse(json['completedAt'] as String)
          : null,
      userAnswers: (json['userAnswers'] as List<dynamic>?)
              ?.map((a) => UserAnswer.fromJson(a as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'exerciseId': exerciseId,
      'score': score,
      'totalScore': totalScore,
      'correctAnswers': correctAnswers,
      'totalQuestions': totalQuestions,
      'timeSpent': timeSpent,
      'status': status.name,
      'startedAt': startedAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'userAnswers': userAnswers.map((a) => a.toJson()).toList(),
    };
  }
}

class UserAnswer {
  final String id;
  final String userId;
  final String questionId;
  final String? selectedOptionId;
  final String? userInput;
  final bool isCorrect;
  final int timeSpent; // in seconds
  final DateTime answeredAt;

  const UserAnswer({
    required this.id,
    required this.userId,
    required this.questionId,
    this.selectedOptionId,
    this.userInput,
    required this.isCorrect,
    required this.timeSpent,
    required this.answeredAt,
  });

  factory UserAnswer.fromJson(Map<String, dynamic> json) {
    return UserAnswer(
      id: json['id'] as String,
      userId: json['userId'] as String,
      questionId: json['questionId'] as String,
      selectedOptionId: json['selectedOptionId'] as String?,
      userInput: json['userInput'] as String?,
      isCorrect: json['isCorrect'] as bool,
      timeSpent: json['timeSpent'] as int,
      answeredAt: DateTime.parse(json['answeredAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'questionId': questionId,
      'selectedOptionId': selectedOptionId,
      'userInput': userInput,
      'isCorrect': isCorrect,
      'timeSpent': timeSpent,
      'answeredAt': answeredAt.toIso8601String(),
    };
  }
}
