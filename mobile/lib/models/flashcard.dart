enum FlashcardStatus {
  newCard,
  learning,
  reviewing,
  mastered,
}

enum FlashcardDifficulty {
  easy,
  medium,
  hard,
}

class Flashcard {
  final String id;
  final String front;
  final String back;
  final String? audioUrl;
  final String? imageUrl;
  final String? pronunciation;
  final String? example;
  final List<String> tags;
  final String category;
  final FlashcardDifficulty difficulty;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final String? notes;

  const Flashcard({
    required this.id,
    required this.front,
    required this.back,
    this.audioUrl,
    this.imageUrl,
    this.pronunciation,
    this.example,
    required this.tags,
    required this.category,
    required this.difficulty,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
    this.notes,
  });

  factory Flashcard.fromJson(Map<String, dynamic> json) {
    return Flashcard(
      id: json['id'] as String,
      front: json['front'] as String,
      back: json['back'] as String,
      audioUrl: json['audioUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      pronunciation: json['pronunciation'] as String?,
      example: json['example'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((t) => t as String).toList() ??
              [],
      category: json['category'] as String,
      difficulty: FlashcardDifficulty.values.firstWhere(
        (e) => e.name == json['difficulty'],
        orElse: () => FlashcardDifficulty.medium,
      ),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'front': front,
      'back': back,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'pronunciation': pronunciation,
      'example': example,
      'tags': tags,
      'category': category,
      'difficulty': difficulty.name,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isActive': isActive,
      'notes': notes,
    };
  }
}

class FlashcardProgress {
  final String id;
  final String userId;
  final String flashcardId;
  final FlashcardStatus status;
  final int reviewCount;
  final int correctCount;
  final int incorrectCount;
  final double easeFactor;
  final int interval; // in days
  final DateTime nextReviewDate;
  final DateTime lastReviewedAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Map<String, dynamic> metadata;

  const FlashcardProgress({
    required this.id,
    required this.userId,
    required this.flashcardId,
    required this.status,
    required this.reviewCount,
    required this.correctCount,
    required this.incorrectCount,
    required this.easeFactor,
    required this.interval,
    required this.nextReviewDate,
    required this.lastReviewedAt,
    required this.createdAt,
    required this.updatedAt,
    required this.metadata,
  });

  double get accuracy => reviewCount > 0 ? correctCount / reviewCount : 0.0;

  bool get isDue => nextReviewDate.isBefore(DateTime.now());

  factory FlashcardProgress.fromJson(Map<String, dynamic> json) {
    return FlashcardProgress(
      id: json['id'] as String,
      userId: json['userId'] as String,
      flashcardId: json['flashcardId'] as String,
      status: FlashcardStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => FlashcardStatus.newCard,
      ),
      reviewCount: json['reviewCount'] as int,
      correctCount: json['correctCount'] as int,
      incorrectCount: json['incorrectCount'] as int,
      easeFactor: (json['easeFactor'] as num).toDouble(),
      interval: json['interval'] as int,
      nextReviewDate: DateTime.parse(json['nextReviewDate'] as String),
      lastReviewedAt: DateTime.parse(json['lastReviewedAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>? ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'flashcardId': flashcardId,
      'status': status.name,
      'reviewCount': reviewCount,
      'correctCount': correctCount,
      'incorrectCount': incorrectCount,
      'easeFactor': easeFactor,
      'interval': interval,
      'nextReviewDate': nextReviewDate.toIso8601String(),
      'lastReviewedAt': lastReviewedAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'metadata': metadata,
    };
  }
}

class FlashcardDeck {
  final String id;
  final String name;
  final String description;
  final String? imageUrl;
  final List<String> flashcardIds;
  final String createdBy;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isPublic;
  final bool isActive;
  final List<String> tags;
  final String category;

  const FlashcardDeck({
    required this.id,
    required this.name,
    required this.description,
    this.imageUrl,
    required this.flashcardIds,
    required this.createdBy,
    required this.createdAt,
    required this.updatedAt,
    this.isPublic = false,
    this.isActive = true,
    required this.tags,
    required this.category,
  });

  int get cardCount => flashcardIds.length;

  factory FlashcardDeck.fromJson(Map<String, dynamic> json) {
    return FlashcardDeck(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String?,
      flashcardIds: (json['flashcardIds'] as List<dynamic>?)
              ?.map((id) => id as String)
              .toList() ??
          [],
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isPublic: json['isPublic'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
      tags:
          (json['tags'] as List<dynamic>?)?.map((t) => t as String).toList() ??
              [],
      category: json['category'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'imageUrl': imageUrl,
      'flashcardIds': flashcardIds,
      'createdBy': createdBy,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isPublic': isPublic,
      'isActive': isActive,
      'tags': tags,
      'category': category,
    };
  }
}

class FlashcardSession {
  final String id;
  final String userId;
  final String? deckId;
  final List<String> flashcardIds;
  final DateTime startedAt;
  final DateTime? completedAt;
  final int totalCards;
  final int completedCards;
  final int correctAnswers;
  final int incorrectAnswers;
  final Map<String, dynamic> metadata;

  const FlashcardSession({
    required this.id,
    required this.userId,
    this.deckId,
    required this.flashcardIds,
    required this.startedAt,
    this.completedAt,
    required this.totalCards,
    required this.completedCards,
    required this.correctAnswers,
    required this.incorrectAnswers,
    required this.metadata,
  });

  bool get isCompleted => completedAt != null;
  double get progress => totalCards > 0 ? completedCards / totalCards : 0.0;
  double get accuracy => (correctAnswers + incorrectAnswers) > 0
      ? correctAnswers / (correctAnswers + incorrectAnswers)
      : 0.0;

  factory FlashcardSession.fromJson(Map<String, dynamic> json) {
    return FlashcardSession(
      id: json['id'] as String,
      userId: json['userId'] as String,
      deckId: json['deckId'] as String?,
      flashcardIds: (json['flashcardIds'] as List<dynamic>?)
              ?.map((id) => id as String)
              .toList() ??
          [],
      startedAt: DateTime.parse(json['startedAt'] as String),
      completedAt: json['completedAt'] != null
          ? DateTime.parse(json['completedAt'] as String)
          : null,
      totalCards: json['totalCards'] as int,
      completedCards: json['completedCards'] as int,
      correctAnswers: json['correctAnswers'] as int,
      incorrectAnswers: json['incorrectAnswers'] as int,
      metadata: json['metadata'] as Map<String, dynamic>? ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'deckId': deckId,
      'flashcardIds': flashcardIds,
      'startedAt': startedAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'totalCards': totalCards,
      'completedCards': completedCards,
      'correctAnswers': correctAnswers,
      'incorrectAnswers': incorrectAnswers,
      'metadata': metadata,
    };
  }
}
