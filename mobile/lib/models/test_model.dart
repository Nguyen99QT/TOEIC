class TestModel {
  final int id;
  final String title;
  final String description;
  final String type; // 'listening', 'reading', 'full'
  final int duration; // in minutes
  final int totalQuestions;
  final String difficulty; // 'easy', 'medium', 'hard'
  final bool isActive;
  final DateTime createdAt;
  final List<QuestionModel>? questions;

  TestModel({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.duration,
    required this.totalQuestions,
    required this.difficulty,
    required this.isActive,
    required this.createdAt,
    this.questions,
  });

  factory TestModel.fromJson(Map<String, dynamic> json) {
    return TestModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      type: json['type'] ?? 'full',
      duration: json['duration'] ?? 120,
      totalQuestions: json['totalQuestions'] ?? json['total_questions'] ?? 0,
      difficulty: json['difficulty'] ?? 'medium',
      isActive: json['isActive'] ?? json['is_active'] ?? true,
      createdAt: DateTime.tryParse(json['createdAt'] ?? json['created_at'] ?? '') ?? DateTime.now(),
      questions: json['questions'] != null
          ? (json['questions'] as List).map((q) => QuestionModel.fromJson(q)).toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'duration': duration,
      'totalQuestions': totalQuestions,
      'difficulty': difficulty,
      'isActive': isActive,
      'createdAt': createdAt.toIso8601String(),
      'questions': questions?.map((q) => q.toJson()).toList(),
    };
  }
}

class QuestionModel {
  final int id;
  final String questionText;
  final String? audioUrl;
  final String? imageUrl;
  final List<AnswerOption> options;
  final int correctAnswerIndex;
  final String explanation;
  final String skillType; // 'listening', 'reading'
  final String questionType; // 'single_choice', 'multiple_choice'

  QuestionModel({
    required this.id,
    required this.questionText,
    this.audioUrl,
    this.imageUrl,
    required this.options,
    required this.correctAnswerIndex,
    required this.explanation,
    required this.skillType,
    required this.questionType,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    return QuestionModel(
      id: json['id'] ?? 0,
      questionText: json['questionText'] ?? json['question_text'] ?? '',
      audioUrl: json['audioUrl'] ?? json['audio_url'],
      imageUrl: json['imageUrl'] ?? json['image_url'],
      options: json['options'] != null
          ? (json['options'] as List).map((o) => AnswerOption.fromJson(o)).toList()
          : [],
      correctAnswerIndex: json['correctAnswerIndex'] ?? json['correct_answer_index'] ?? 0,
      explanation: json['explanation'] ?? '',
      skillType: json['skillType'] ?? json['skill_type'] ?? 'reading',
      questionType: json['questionType'] ?? json['question_type'] ?? 'single_choice',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'questionText': questionText,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'options': options.map((o) => o.toJson()).toList(),
      'correctAnswerIndex': correctAnswerIndex,
      'explanation': explanation,
      'skillType': skillType,
      'questionType': questionType,
    };
  }
}

class AnswerOption {
  final String text;
  final bool isCorrect;

  AnswerOption({
    required this.text,
    required this.isCorrect,
  });

  factory AnswerOption.fromJson(Map<String, dynamic> json) {
    return AnswerOption(
      text: json['text'] ?? '',
      isCorrect: json['isCorrect'] ?? json['is_correct'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'text': text,
      'isCorrect': isCorrect,
    };
  }
}
