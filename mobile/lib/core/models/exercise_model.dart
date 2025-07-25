/// Model cho Exercise
class Exercise {
  final String? id;
  final String title;
  final String description;
  final String difficulty;
  final String category;
  final int timeLimit;
  final String? imageUrl;
  final String? audioUrl;
  final String? createdBy;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Exercise({
    this.id,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.category,
    required this.timeLimit,
    this.imageUrl,
    this.audioUrl,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'difficulty': difficulty,
      'category': category,
      'timeLimit': timeLimit,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'createdBy': createdBy,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      id: json['id']?.toString(),
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      difficulty: json['difficulty'] ?? 'EASY',
      category: json['category'] ?? 'GENERAL',
      timeLimit: json['timeLimit'] ?? 30,
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      createdBy: json['createdBy']?.toString(),
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt:
          json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Exercise copyWith({
    String? id,
    String? title,
    String? description,
    String? difficulty,
    String? category,
    int? timeLimit,
    String? imageUrl,
    String? audioUrl,
    String? createdBy,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Exercise(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      difficulty: difficulty ?? this.difficulty,
      category: category ?? this.category,
      timeLimit: timeLimit ?? this.timeLimit,
      imageUrl: imageUrl ?? this.imageUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Exercise{id: $id, title: $title, difficulty: $difficulty}';
  }
}

/// Response model cho Exercise API
class ExerciseResponse {
  final bool success;
  final String? message;
  final Exercise? data;
  final List<Exercise>? exercises;
  final int? totalElements;
  final int? totalPages;
  final int? currentPage;

  ExerciseResponse({
    required this.success,
    this.message,
    this.data,
    this.exercises,
    this.totalElements,
    this.totalPages,
    this.currentPage,
  });

  factory ExerciseResponse.fromJson(Map<String, dynamic> json) {
    return ExerciseResponse(
      success: json['success'] ?? false,
      message: json['message'],
      data: json['data'] != null ? Exercise.fromJson(json['data']) : null,
      exercises: json['data'] is List
          ? (json['data'] as List)
              .map((item) => Exercise.fromJson(item))
              .toList()
          : json['exercises'] is List
              ? (json['exercises'] as List)
                  .map((item) => Exercise.fromJson(item))
                  .toList()
              : null,
      totalElements: json['totalElements'],
      totalPages: json['totalPages'],
      currentPage: json['currentPage'],
    );
  }
}
