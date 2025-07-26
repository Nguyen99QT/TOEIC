class Lesson {
  final String? id;
  final String title;
  final String description;
  final String content;
  final String difficulty;
  final String category;
  final int estimatedTime;
  final String? imageUrl;
  final String? audioUrl;
  final String? createdBy;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool isPublic;

  Lesson({
    this.id,
    required this.title,
    required this.description,
    required this.content,
    required this.difficulty,
    required this.category,
    required this.estimatedTime,
    this.imageUrl,
    this.audioUrl,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
    this.isPublic = true,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id']?.toString(),
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      content: json['content'] ?? '',
      // Map backend fields to frontend model
      difficulty: json['difficulty'] ?? json['level'] ?? 'EASY',
      category: json['category'] ?? json['type'] ?? 'GENERAL', 
      estimatedTime: json['estimatedTime'] ?? json['duration'] ?? 30,
      imageUrl: json['imageUrl'],
      audioUrl: json['audioUrl'],
      createdBy: json['createdBy'],
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'])
          : null,
      isPublic: json['isPublic'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'title': title,
      'description': description,
      'content': content,
      'difficulty': difficulty,
      'category': category,
      'estimatedTime': estimatedTime,
      if (imageUrl != null) 'imageUrl': imageUrl,
      if (audioUrl != null) 'audioUrl': audioUrl,
      if (createdBy != null) 'createdBy': createdBy,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updatedAt': updatedAt!.toIso8601String(),
      'isPublic': isPublic,
    };
  }

  Lesson copyWith({
    String? id,
    String? title,
    String? description,
    String? content,
    String? difficulty,
    String? category,
    int? estimatedTime,
    String? imageUrl,
    String? audioUrl,
    String? createdBy,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isPublic,
  }) {
    return Lesson(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      content: content ?? this.content,
      difficulty: difficulty ?? this.difficulty,
      category: category ?? this.category,
      estimatedTime: estimatedTime ?? this.estimatedTime,
      imageUrl: imageUrl ?? this.imageUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isPublic: isPublic ?? this.isPublic,
    );
  }
}

class LessonResponse {
  final List<Lesson> lessons;
  final int totalCount;
  final int page;
  final int size;
  final bool hasNext;
  final bool hasPrevious;

  LessonResponse({
    required this.lessons,
    required this.totalCount,
    required this.page,
    required this.size,
    required this.hasNext,
    required this.hasPrevious,
  });

  factory LessonResponse.fromJson(dynamic json) {
    // Handle direct array response from backend
    if (json is List) {
      return LessonResponse(
        lessons: json.map((e) => Lesson.fromJson(e)).toList(),
        totalCount: json.length,
        page: 0,
        size: json.length,
        hasNext: false,
        hasPrevious: false,
      );
    }
    
    // Handle paginated response format
    if (json is Map<String, dynamic>) {
      return LessonResponse(
        lessons: (json['content'] as List? ?? [])
            .map((e) => Lesson.fromJson(e))
            .toList(),
        totalCount: json['totalElements'] ?? 0,
        page: json['number'] ?? 0,
        size: json['size'] ?? 10,
        hasNext: !(json['last'] ?? true),
        hasPrevious: !(json['first'] ?? true),
      );
    }
    
    // Fallback for unknown format
    return LessonResponse(
      lessons: [],
      totalCount: 0,
      page: 0,
      size: 10,
      hasNext: false,
      hasPrevious: false,
    );
  }

  // Add factory for direct array response
  factory LessonResponse.fromArray(List<dynamic> jsonArray) {
    return LessonResponse(
      lessons: jsonArray.map((e) => Lesson.fromJson(e)).toList(),
      totalCount: jsonArray.length,
      page: 0,
      size: jsonArray.length,
      hasNext: false,
      hasPrevious: false,
    );
  }
}
