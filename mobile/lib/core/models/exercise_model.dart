/// Model cho Exercise
class Exercise {
  final String? id;
  final String title;
  final String description;
  final String question;
  final String type; // multiple_choice, matching, fill_in_the_blank
  final String difficulty; // easy, medium, hard
  final String level; // A1, A2, B1, B2, C1, C2
  final List<String> options;
  final String correctAnswer;
  final String? explanation;
  final String? imageUrl;
  final String? audioUrl;
  final int? timeLimit; // in seconds
  final int points;
  final int orderIndex;
  final String? lessonId;
  final bool isActive;
  final bool isPremium;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final String? createdBy;

  Exercise({
    this.id,
    required this.title,
    required this.description,
    required this.question,
    required this.type,
    required this.difficulty,
    required this.level,
    required this.options,
    required this.correctAnswer,
    this.explanation,
    this.imageUrl,
    this.audioUrl,
    this.timeLimit,
    required this.points,
    this.orderIndex = 0,
    this.lessonId,
    this.isActive = true,
    this.isPremium = false,
    this.createdAt,
    this.updatedAt,
    this.createdBy,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'question': question,
      'type': type,
      'difficulty': difficulty,
      'level': level,
      'options': options,
      'correctAnswer': correctAnswer,
      'explanation': explanation,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'timeLimit': timeLimit,
      'points': points,
      'orderIndex': orderIndex,
      'lessonId': lessonId,
      'isActive': isActive,
      'isPremium': isPremium,
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
      question: json['question'] ?? '',
      type: json['type'] ?? 'multiple_choice',
      difficulty: json['difficulty'] ?? json['difficulty_level'] ?? 'easy',
      level: json['level'] ?? 'A1',
      options: json['options'] != null
          ? List<String>.from(json['options'] is String
              ? _parseStringArray(json['options'])
              : json['options'])
          : [],
      correctAnswer: json['correctAnswer'] ?? json['correct_answer'] ?? '',
      explanation: json['explanation'],
      imageUrl: json['imageUrl'] ?? json['image_url'],
      audioUrl: json['audioUrl'] ?? json['audio_url'],
      timeLimit: json['timeLimit'] ??
          json['time_limit_seconds'] ??
          json['timeLimitSeconds'],
      points: json['points'] ?? 10,
      orderIndex: json['orderIndex'] ?? json['order_index'] ?? 0,
      lessonId: json['lessonId']?.toString() ?? json['lesson_id']?.toString(),
      isActive: json['isActive'] ?? json['is_active'] ?? true,
      isPremium: json['isPremium'] ?? json['is_premium'] ?? false,
      createdBy: json['createdBy']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : json['created_at'] != null
              ? DateTime.tryParse(json['created_at'])
              : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'])
          : json['updated_at'] != null
              ? DateTime.tryParse(json['updated_at'])
              : null,
    );
  }

  static List<String> _parseStringArray(String str) {
    if (str.isEmpty) return [];
    // Remove brackets and split by comma
    String cleaned = str.replaceAll(RegExp(r'[\[\]"]'), '');
    return cleaned
        .split(',')
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList();
  }

  Exercise copyWith({
    String? id,
    String? title,
    String? description,
    String? question,
    String? type,
    String? difficulty,
    String? level,
    List<String>? options,
    String? correctAnswer,
    String? explanation,
    String? imageUrl,
    String? audioUrl,
    int? timeLimit,
    int? points,
    int? orderIndex,
    String? lessonId,
    bool? isActive,
    bool? isPremium,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? createdBy,
  }) {
    return Exercise(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      question: question ?? this.question,
      type: type ?? this.type,
      difficulty: difficulty ?? this.difficulty,
      level: level ?? this.level,
      options: options ?? this.options,
      correctAnswer: correctAnswer ?? this.correctAnswer,
      explanation: explanation ?? this.explanation,
      imageUrl: imageUrl ?? this.imageUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      timeLimit: timeLimit ?? this.timeLimit,
      points: points ?? this.points,
      orderIndex: orderIndex ?? this.orderIndex,
      lessonId: lessonId ?? this.lessonId,
      isActive: isActive ?? this.isActive,
      isPremium: isPremium ?? this.isPremium,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy ?? this.createdBy,
    );
  }

  @override
  String toString() {
    return 'Exercise{id: $id, title: $title, difficulty: $difficulty, type: $type}';
  }
}

/// Response model cho Exercise API
class ExerciseResponse {
  final List<Exercise> exercises;
  final int totalCount;
  final int page;
  final int size;
  final bool hasNext;
  final bool hasPrevious;

  ExerciseResponse({
    required this.exercises,
    required this.totalCount,
    required this.page,
    required this.size,
    required this.hasNext,
    required this.hasPrevious,
  });

  factory ExerciseResponse.fromJson(dynamic json) {
    if (json is List) {
      // Handle direct array response
      return ExerciseResponse.fromArray(json);
    }

    // Handle backend ApiResponse format: { success: bool, message: string, data: array }
    if (json['data'] != null && json['data'] is List) {
      final exercises = (json['data'] as List)
          .map<Exercise>((exerciseJson) => Exercise.fromJson(exerciseJson))
          .toList();
      
      return ExerciseResponse(
        exercises: exercises,
        totalCount: exercises.length,
        page: 0,
        size: exercises.length,
        hasNext: false,
        hasPrevious: false,
      );
    }

    // Handle paginated response
    final data = json['data'] ?? json;
    final exercises =
        (data is List ? data : (data['exercises'] ?? data['data'] ?? []))
            .map<Exercise>((exerciseJson) => Exercise.fromJson(exerciseJson))
            .toList();

    return ExerciseResponse(
      exercises: exercises,
      totalCount: json['totalCount'] ?? json['total'] ?? exercises.length,
      page: json['page'] ?? 0,
      size: json['size'] ?? exercises.length,
      hasNext: json['hasNext'] ?? json['hasMore'] ?? false,
      hasPrevious: json['hasPrevious'] ?? (json['page'] ?? 0) > 0,
    );
  }

  // Handle direct array response
  factory ExerciseResponse.fromArray(List<dynamic> jsonArray) {
    final exercises = jsonArray
        .map<Exercise>((exerciseJson) => Exercise.fromJson(exerciseJson))
        .toList();

    return ExerciseResponse(
      exercises: exercises,
      totalCount: exercises.length,
      page: 0,
      size: exercises.length,
      hasNext: false,
      hasPrevious: false,
    );
  }

  ExerciseResponse copyWith({
    List<Exercise>? exercises,
    int? totalCount,
    int? page,
    int? size,
    bool? hasNext,
    bool? hasPrevious,
  }) {
    return ExerciseResponse(
      exercises: exercises ?? this.exercises,
      totalCount: totalCount ?? this.totalCount,
      page: page ?? this.page,
      size: size ?? this.size,
      hasNext: hasNext ?? this.hasNext,
      hasPrevious: hasPrevious ?? this.hasPrevious,
    );
  }
}
