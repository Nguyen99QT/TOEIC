class Lesson {
  final String id;
  final String title;
  final String description;
  final String level;
  final int duration; // in minutes
  final String category;
  final bool isCompleted;
  final double progress;
  final String? imageUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Lesson({
    required this.id,
    required this.title,
    required this.description,
    required this.level,
    required this.duration,
    required this.category,
    this.isCompleted = false,
    this.progress = 0.0,
    this.imageUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Lesson.fromMap(Map<String, dynamic> map) {
    return Lesson(
      id: map['id']?.toString() ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      level: map['level'] ?? 'beginner',
      duration: map['duration'] ?? 0,
      category: map['category'] ?? '',
      isCompleted: map['isCompleted'] ?? false,
      progress: (map['progress'] ?? 0.0).toDouble(),
      imageUrl: map['imageUrl'],
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'])
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null
          ? DateTime.parse(map['updatedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'level': level,
      'duration': duration,
      'category': category,
      'isCompleted': isCompleted,
      'progress': progress,
      'imageUrl': imageUrl,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Lesson copyWith({
    String? id,
    String? title,
    String? description,
    String? level,
    int? duration,
    String? category,
    bool? isCompleted,
    double? progress,
    String? imageUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Lesson(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      level: level ?? this.level,
      duration: duration ?? this.duration,
      category: category ?? this.category,
      isCompleted: isCompleted ?? this.isCompleted,
      progress: progress ?? this.progress,
      imageUrl: imageUrl ?? this.imageUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class Exercise {
  final String id;
  final String title;
  final String description;
  final String type; // listening, reading, grammar, vocabulary
  final String level;
  final int timeLimit; // in minutes
  final int totalQuestions;
  final int? userScore;
  final double? accuracy;
  final bool isCompleted;
  final DateTime? completedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  Exercise({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.level,
    required this.timeLimit,
    required this.totalQuestions,
    this.userScore,
    this.accuracy,
    this.isCompleted = false,
    this.completedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Exercise.fromMap(Map<String, dynamic> map) {
    return Exercise(
      id: map['id']?.toString() ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      type: map['type'] ?? 'reading',
      level: map['level'] ?? 'beginner',
      timeLimit: map['timeLimit'] ?? 30,
      totalQuestions: map['totalQuestions'] ?? 10,
      userScore: map['userScore'],
      accuracy: map['accuracy']?.toDouble(),
      isCompleted: map['isCompleted'] ?? false,
      completedAt: map['completedAt'] != null
          ? DateTime.parse(map['completedAt'])
          : null,
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'])
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null
          ? DateTime.parse(map['updatedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'level': level,
      'timeLimit': timeLimit,
      'totalQuestions': totalQuestions,
      'userScore': userScore,
      'accuracy': accuracy,
      'isCompleted': isCompleted,
      'completedAt': completedAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Exercise copyWith({
    String? id,
    String? title,
    String? description,
    String? type,
    String? level,
    int? timeLimit,
    int? totalQuestions,
    int? userScore,
    double? accuracy,
    bool? isCompleted,
    DateTime? completedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Exercise(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      level: level ?? this.level,
      timeLimit: timeLimit ?? this.timeLimit,
      totalQuestions: totalQuestions ?? this.totalQuestions,
      userScore: userScore ?? this.userScore,
      accuracy: accuracy ?? this.accuracy,
      isCompleted: isCompleted ?? this.isCompleted,
      completedAt: completedAt ?? this.completedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class FlashcardSet {
  final String id;
  final String title;
  final String description;
  final String category;
  final int totalCards;
  final int studiedCards;
  final double progress;
  final DateTime createdAt;
  final DateTime updatedAt;

  FlashcardSet({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.totalCards,
    this.studiedCards = 0,
    this.progress = 0.0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory FlashcardSet.fromMap(Map<String, dynamic> map) {
    return FlashcardSet(
      id: map['id']?.toString() ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      category: map['category'] ?? '',
      totalCards: map['totalCards'] ?? 0,
      studiedCards: map['studiedCards'] ?? 0,
      progress: (map['progress'] ?? 0.0).toDouble(),
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'])
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null
          ? DateTime.parse(map['updatedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'totalCards': totalCards,
      'studiedCards': studiedCards,
      'progress': progress,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  FlashcardSet copyWith({
    String? id,
    String? title,
    String? description,
    String? category,
    int? totalCards,
    int? studiedCards,
    double? progress,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return FlashcardSet(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      totalCards: totalCards ?? this.totalCards,
      studiedCards: studiedCards ?? this.studiedCards,
      progress: progress ?? this.progress,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class Flashcard {
  final String id;
  final String setId;
  final String front;
  final String back;
  final String? audioUrl;
  final String? imageUrl;
  final String? example;
  final String difficulty;
  final bool isStudied;
  final DateTime createdAt;
  final DateTime updatedAt;

  Flashcard({
    required this.id,
    required this.setId,
    required this.front,
    required this.back,
    this.audioUrl,
    this.imageUrl,
    this.example,
    this.difficulty = 'medium',
    this.isStudied = false,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Flashcard.fromMap(Map<String, dynamic> map) {
    return Flashcard(
      id: map['id']?.toString() ?? '',
      setId: map['setId']?.toString() ?? '',
      front: map['front'] ?? '',
      back: map['back'] ?? '',
      audioUrl: map['audioUrl'],
      imageUrl: map['imageUrl'],
      example: map['example'],
      difficulty: map['difficulty'] ?? 'medium',
      isStudied: map['isStudied'] ?? false,
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'])
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null
          ? DateTime.parse(map['updatedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'setId': setId,
      'front': front,
      'back': back,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'example': example,
      'difficulty': difficulty,
      'isStudied': isStudied,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Flashcard copyWith({
    String? id,
    String? setId,
    String? front,
    String? back,
    String? audioUrl,
    String? imageUrl,
    String? example,
    String? difficulty,
    bool? isStudied,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Flashcard(
      id: id ?? this.id,
      setId: setId ?? this.setId,
      front: front ?? this.front,
      back: back ?? this.back,
      audioUrl: audioUrl ?? this.audioUrl,
      imageUrl: imageUrl ?? this.imageUrl,
      example: example ?? this.example,
      difficulty: difficulty ?? this.difficulty,
      isStudied: isStudied ?? this.isStudied,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
