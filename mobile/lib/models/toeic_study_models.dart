import 'package:flutter/material.dart';

enum QuestionSection {
  LISTENING_PART1,
  LISTENING_PART2,
  LISTENING_PART3,
  LISTENING_PART4,
  READING_PART5,
  READING_PART6,
  READING_PART7,
}

class Question {
  final int id;
  final QuestionSection section;
  final int difficultyLevel;
  final String content;
  final String? imageUrl;
  final String? audioUrl;
  final List<Answer> answers;
  final Exercise exercise;

  Question({
    required this.id,
    required this.section,
    required this.difficultyLevel,
    required this.content,
    this.imageUrl,
    this.audioUrl,
    required this.answers,
    required this.exercise,
  });

  factory Question.fromJson(Map<String, dynamic> json, {Exercise? exercise}) {
    return Question(
      id: json['id'],
      section: _parseQuestionSection(json['section']),
      difficultyLevel: json['difficultyLevel'] ?? 1,
      content: json['content'] ?? '',
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      answers:
          json['answers'] != null
              ? List<Answer>.from(
                json['answers'].map((a) => Answer.fromJson(a)),
              )
              : [],
      exercise: exercise ?? Exercise.fromJson(json['exercise'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'section': section.toString().split('.').last,
      'difficultyLevel': difficultyLevel,
      'content': content,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'answers': answers.map((a) => a.toJson()).toList(),
      'exerciseId': exercise.id,
    };
  }

  static QuestionSection _parseQuestionSection(String? sectionStr) {
    if (sectionStr == null) return QuestionSection.READING_PART5;

    try {
      return QuestionSection.values.firstWhere(
        (e) => e.toString().split('.').last == sectionStr,
        orElse: () => QuestionSection.READING_PART5,
      );
    } catch (_) {
      return QuestionSection.READING_PART5;
    }
  }
}

class Answer {
  final int id;
  final String content;
  final bool isCorrect;
  final String optionLabel; // A, B, C, D, etc.

  Answer({
    required this.id,
    required this.content,
    required this.isCorrect,
    required this.optionLabel,
  });

  factory Answer.fromJson(Map<String, dynamic> json) {
    return Answer(
      id: json['id'],
      content: json['content'] ?? '',
      isCorrect: json['isCorrect'] ?? false,
      optionLabel: json['optionLabel'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'isCorrect': isCorrect,
      'optionLabel': optionLabel,
    };
  }
}

enum ExerciseType { LISTENING, READING, GRAMMAR, VOCABULARY }

class Exercise {
  final int id;
  final String title;
  final String description;
  final ExerciseType type;
  final String level;
  final int difficultyLevel;
  final int points;
  final int? timeLimitSeconds;
  final String? audioUrl;
  final String? imageUrl;
  final Lesson lesson;
  final List<Question>? questions;

  Exercise({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.level,
    required this.difficultyLevel,
    required this.points,
    this.timeLimitSeconds,
    this.audioUrl,
    this.imageUrl,
    required this.lesson,
    this.questions,
  });

  factory Exercise.fromJson(Map<String, dynamic> json, {Lesson? lesson}) {
    final exerciseType = _parseExerciseType(json['type']);

    return Exercise(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      type: exerciseType,
      level: json['level'] ?? 'BEGINNER',
      difficultyLevel: json['difficultyLevel'] ?? 1,
      points: json['points'] ?? 0,
      timeLimitSeconds: json['timeLimitSeconds'],
      audioUrl: json['audioUrl'],
      imageUrl: json['imageUrl'],
      lesson: lesson ?? Lesson.fromJson(json['lesson'] ?? {}),
      questions:
          json['questions'] != null
              ? List<Question>.from(
                json['questions'].map(
                  (q) => Question.fromJson(q, exercise: null),
                ),
              )
              : null,
    );
  }

  static ExerciseType _parseExerciseType(String? typeStr) {
    if (typeStr == null) return ExerciseType.READING;

    try {
      return ExerciseType.values.firstWhere(
        (e) => e.toString().split('.').last == typeStr,
        orElse: () => ExerciseType.READING,
      );
    } catch (_) {
      return ExerciseType.READING;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type.toString().split('.').last,
      'level': level,
      'difficultyLevel': difficultyLevel,
      'points': points,
      'timeLimitSeconds': timeLimitSeconds,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'lessonId': lesson.id,
    };
  }

  String get typeDisplayName {
    switch (type) {
      case ExerciseType.LISTENING:
        return 'Listening';
      case ExerciseType.READING:
        return 'Reading';
      case ExerciseType.GRAMMAR:
        return 'Grammar';
      case ExerciseType.VOCABULARY:
        return 'Vocabulary';
      default:
        return 'Unknown';
    }
  }

  Color get typeColor {
    switch (type) {
      case ExerciseType.LISTENING:
        return Colors.blue;
      case ExerciseType.READING:
        return Colors.green;
      case ExerciseType.GRAMMAR:
        return Colors.purple;
      case ExerciseType.VOCABULARY:
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }
}

enum LessonLevel { BEGINNER, INTERMEDIATE, ADVANCED }

class Lesson {
  final int id;
  final String title;
  final String description;
  final String content;
  final LessonLevel level;
  final String? imageUrl;
  final String? audioUrl;
  final bool isPremium;
  final int orderIndex;
  final List<Exercise>? exercises;

  Lesson({
    required this.id,
    required this.title,
    required this.description,
    required this.content,
    required this.level,
    this.imageUrl,
    this.audioUrl,
    required this.isPremium,
    required this.orderIndex,
    this.exercises,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    final lessonLevel = _parseLessonLevel(json['level']);

    return Lesson(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      content: json['content'] ?? '',
      level: lessonLevel,
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      isPremium: json['isPremium'] ?? false,
      orderIndex: json['orderIndex'] ?? 0,
      exercises:
          json['exercises'] != null
              ? List<Exercise>.from(
                json['exercises'].map(
                  (e) => Exercise.fromJson(e, lesson: null),
                ),
              )
              : null,
    );
  }

  static LessonLevel _parseLessonLevel(String? levelStr) {
    if (levelStr == null) return LessonLevel.BEGINNER;

    try {
      return LessonLevel.values.firstWhere(
        (e) => e.toString().split('.').last == levelStr,
        orElse: () => LessonLevel.BEGINNER,
      );
    } catch (_) {
      return LessonLevel.BEGINNER;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'content': content,
      'level': level.toString().split('.').last,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'isPremium': isPremium,
      'orderIndex': orderIndex,
    };
  }

  String get levelDisplayName {
    switch (level) {
      case LessonLevel.BEGINNER:
        return 'Beginner';
      case LessonLevel.INTERMEDIATE:
        return 'Intermediate';
      case LessonLevel.ADVANCED:
        return 'Advanced';
      default:
        return 'Unknown';
    }
  }

  Color get levelColor {
    switch (level) {
      case LessonLevel.BEGINNER:
        return Colors.green;
      case LessonLevel.INTERMEDIATE:
        return Colors.orange;
      case LessonLevel.ADVANCED:
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
