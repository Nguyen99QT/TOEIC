// Flutter Models
class User {
  final int id;
  final String username;
  final String email;
  final String? fullName;
  final UserRole role;
  final int currentLevel;
  final int totalScore;
  final int testsCompleted;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.fullName,
    required this.role,
    required this.currentLevel,
    required this.totalScore,
    required this.testsCompleted,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      fullName: json['fullName'],
      role: UserRole.values.firstWhere(
        (e) => e.toString().split('.').last == json['role'],
        orElse: () => UserRole.USER,
      ),
      currentLevel: json['currentLevel'] ?? 1,
      totalScore: json['totalScore'] ?? 0,
      testsCompleted: json['testsCompleted'] ?? 0,
      createdAt:
          json['createdAt'] != null
              ? DateTime.parse(json['createdAt'])
              : DateTime.now(),
      updatedAt:
          json['updatedAt'] != null
              ? DateTime.parse(json['updatedAt'])
              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'role': role.toString().split('.').last,
      'currentLevel': currentLevel,
      'totalScore': totalScore,
      'testsCompleted': testsCompleted,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

enum UserRole { USER, ADMIN }

// Lesson model
class Lesson {
  final int id;
  final String title;
  final String description;
  final LessonLevel level;
  final LessonCategory category;
  final String? imageUrl;
  final String? contentUrl;
  final bool isPremium;
  final DateTime createdAt;
  final DateTime updatedAt;

  Lesson({
    required this.id,
    required this.title,
    required this.description,
    required this.level,
    required this.category,
    this.imageUrl,
    this.contentUrl,
    required this.isPremium,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      level: LessonLevel.values.firstWhere(
        (e) => e.toString().split('.').last == json['level'],
        orElse: () => LessonLevel.BEGINNER,
      ),
      category: LessonCategory.values.firstWhere(
        (e) => e.toString().split('.').last == json['category'],
        orElse: () => LessonCategory.GENERAL,
      ),
      imageUrl: json['imageUrl'],
      contentUrl: json['contentUrl'],
      isPremium: json['isPremium'] ?? false,
      createdAt:
          json['createdAt'] != null
              ? DateTime.parse(json['createdAt'])
              : DateTime.now(),
      updatedAt:
          json['updatedAt'] != null
              ? DateTime.parse(json['updatedAt'])
              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'level': level.toString().split('.').last,
      'category': category.toString().split('.').last,
      'imageUrl': imageUrl,
      'contentUrl': contentUrl,
      'isPremium': isPremium,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

enum LessonLevel { BEGINNER, INTERMEDIATE, ADVANCED }

enum LessonCategory {
  GENERAL,
  CONVERSATION,
  GRAMMAR,
  VOCABULARY,
  BUSINESS,
  TRAVEL,
}

// Flashcard model
class FlashcardSet {
  final int id;
  final String title;
  final String description;
  final FlashcardLevel level;
  final FlashcardCategory category;
  final bool isPublic;
  final int creatorId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Flashcard>? flashcards;

  FlashcardSet({
    required this.id,
    required this.title,
    required this.description,
    required this.level,
    required this.category,
    required this.isPublic,
    required this.creatorId,
    required this.createdAt,
    required this.updatedAt,
    this.flashcards,
  });

  factory FlashcardSet.fromJson(Map<String, dynamic> json) {
    return FlashcardSet(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      level: FlashcardLevel.values.firstWhere(
        (e) => e.toString().split('.').last == json['level'],
        orElse: () => FlashcardLevel.BEGINNER,
      ),
      category: FlashcardCategory.values.firstWhere(
        (e) => e.toString().split('.').last == json['category'],
        orElse: () => FlashcardCategory.GENERAL,
      ),
      isPublic: json['isPublic'] ?? true,
      creatorId: json['creatorId'],
      createdAt:
          json['createdAt'] != null
              ? DateTime.parse(json['createdAt'])
              : DateTime.now(),
      updatedAt:
          json['updatedAt'] != null
              ? DateTime.parse(json['updatedAt'])
              : DateTime.now(),
      flashcards:
          json['flashcards'] != null
              ? (json['flashcards'] as List)
                  .map((cardJson) => Flashcard.fromJson(cardJson))
                  .toList()
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'level': level.toString().split('.').last,
      'category': category.toString().split('.').last,
      'isPublic': isPublic,
      'creatorId': creatorId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'flashcards': flashcards?.map((card) => card.toJson()).toList(),
    };
  }
}

class Flashcard {
  final int id;
  final String front;
  final String back;
  final String? example;
  final int setId;
  final String? imageUrl;
  final String? audioUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Flashcard({
    required this.id,
    required this.front,
    required this.back,
    this.example,
    required this.setId,
    this.imageUrl,
    this.audioUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Flashcard.fromJson(Map<String, dynamic> json) {
    return Flashcard(
      id: json['id'],
      front: json['front'],
      back: json['back'],
      example: json['example'],
      setId: json['setId'],
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      createdAt:
          json['createdAt'] != null
              ? DateTime.parse(json['createdAt'])
              : DateTime.now(),
      updatedAt:
          json['updatedAt'] != null
              ? DateTime.parse(json['updatedAt'])
              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'front': front,
      'back': back,
      'example': example,
      'setId': setId,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

enum FlashcardLevel { BEGINNER, INTERMEDIATE, ADVANCED }

enum FlashcardCategory {
  GENERAL,
  VOCABULARY,
  GRAMMAR,
  BUSINESS,
  TRAVEL,
  IDIOMS,
  PHRASAL_VERBS,
}
