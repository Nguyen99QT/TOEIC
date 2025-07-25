/// Model cho Flashcard
class Flashcard {
  final String? id;
  final String front;
  final String back;
  final String? imageUrl;
  final String? audioUrl;
  final String? setId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Flashcard({
    this.id,
    required this.front,
    required this.back,
    this.imageUrl,
    this.audioUrl,
    this.setId,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'front': front,
      'back': back,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'setId': setId,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  factory Flashcard.fromJson(Map<String, dynamic> json) {
    return Flashcard(
      id: json['id']?.toString(),
      front: json['front'] ?? '',
      back: json['back'] ?? '',
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      setId: json['setId']?.toString(),
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt:
          json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Flashcard copyWith({
    String? id,
    String? front,
    String? back,
    String? imageUrl,
    String? audioUrl,
    String? setId,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Flashcard(
      id: id ?? this.id,
      front: front ?? this.front,
      back: back ?? this.back,
      imageUrl: imageUrl ?? this.imageUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      setId: setId ?? this.setId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Flashcard{id: $id, front: $front, back: $back}';
  }
}

/// Model cho FlashcardSet
class FlashcardSet {
  final String? id;
  final String title;
  final String description;
  final String category;
  final String difficulty;
  final String? imageUrl;
  final String? audioUrl;
  final String? createdBy;
  final List<Flashcard>? flashcards;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  FlashcardSet({
    this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.difficulty,
    this.imageUrl,
    this.audioUrl,
    this.createdBy,
    this.flashcards,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'difficulty': difficulty,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'createdBy': createdBy,
      'flashcards': flashcards?.map((f) => f.toJson()).toList(),
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  factory FlashcardSet.fromJson(Map<String, dynamic> json) {
    return FlashcardSet(
      id: json['id']?.toString(),
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'GENERAL',
      difficulty: json['difficulty'] ?? 'EASY',
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      createdBy: json['createdBy']?.toString(),
      flashcards: json['flashcards'] is List
          ? (json['flashcards'] as List)
              .map((item) => Flashcard.fromJson(item))
              .toList()
          : null,
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt:
          json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  FlashcardSet copyWith({
    String? id,
    String? title,
    String? description,
    String? category,
    String? difficulty,
    String? imageUrl,
    String? audioUrl,
    String? createdBy,
    List<Flashcard>? flashcards,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return FlashcardSet(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      difficulty: difficulty ?? this.difficulty,
      imageUrl: imageUrl ?? this.imageUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      createdBy: createdBy ?? this.createdBy,
      flashcards: flashcards ?? this.flashcards,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'FlashcardSet{id: $id, title: $title, category: $category}';
  }
}

/// Response model cho Flashcard API
class FlashcardResponse {
  final bool success;
  final String? message;
  final FlashcardSet? data;
  final Flashcard? flashcard;
  final List<FlashcardSet>? sets;
  final List<Flashcard>? flashcards;
  final int? totalElements;
  final int? totalPages;
  final int? currentPage;

  FlashcardResponse({
    required this.success,
    this.message,
    this.data,
    this.flashcard,
    this.sets,
    this.flashcards,
    this.totalElements,
    this.totalPages,
    this.currentPage,
  });

  factory FlashcardResponse.fromJson(Map<String, dynamic> json) {
    return FlashcardResponse(
      success: json['success'] ?? false,
      message: json['message'],
      data: json['data'] != null && json['data'] is Map
          ? FlashcardSet.fromJson(json['data'])
          : null,
      flashcard: json['flashcard'] != null
          ? Flashcard.fromJson(json['flashcard'])
          : null,
      sets: json['data'] is List
          ? (json['data'] as List)
              .map((item) => FlashcardSet.fromJson(item))
              .toList()
          : json['sets'] is List
              ? (json['sets'] as List)
                  .map((item) => FlashcardSet.fromJson(item))
                  .toList()
              : null,
      flashcards: json['flashcards'] is List
          ? (json['flashcards'] as List)
              .map((item) => Flashcard.fromJson(item))
              .toList()
          : null,
      totalElements: json['totalElements'],
      totalPages: json['totalPages'],
      currentPage: json['currentPage'],
    );
  }
}
