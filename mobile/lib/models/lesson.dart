enum LessonType {
  grammar,
  vocabulary,
  listening,
  reading,
  speaking,
  writing,
}

enum LessonStatus {
  notStarted,
  inProgress,
  completed,
}

enum LessonDifficulty {
  beginner,
  intermediate,
  advanced,
}

class Lesson {
  final String id;
  final String title;
  final String description;
  final LessonType type;
  final LessonDifficulty difficulty;
  final int duration; // in minutes
  final String content;
  final String? audioUrl;
  final String? videoUrl;
  final String? imageUrl;
  final List<String> tags;
  final List<LessonSection> sections;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final String? prerequisites;
  final int orderIndex;

  const Lesson({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.difficulty,
    required this.duration,
    required this.content,
    this.audioUrl,
    this.videoUrl,
    this.imageUrl,
    required this.tags,
    required this.sections,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
    this.prerequisites,
    required this.orderIndex,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: LessonType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => LessonType.grammar,
      ),
      difficulty: LessonDifficulty.values.firstWhere(
        (e) => e.name == json['difficulty'],
        orElse: () => LessonDifficulty.beginner,
      ),
      duration: json['duration'] as int,
      content: json['content'] as String,
      audioUrl: json['audioUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((t) => t as String).toList() ??
              [],
      sections: (json['sections'] as List<dynamic>?)
              ?.map((s) => LessonSection.fromJson(s as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      prerequisites: json['prerequisites'] as String?,
      orderIndex: json['orderIndex'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type.name,
      'difficulty': difficulty.name,
      'duration': duration,
      'content': content,
      'audioUrl': audioUrl,
      'videoUrl': videoUrl,
      'imageUrl': imageUrl,
      'tags': tags,
      'sections': sections.map((s) => s.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isActive': isActive,
      'prerequisites': prerequisites,
      'orderIndex': orderIndex,
    };
  }
}

class LessonSection {
  final String id;
  final String lessonId;
  final String title;
  final String content;
  final String? audioUrl;
  final String? videoUrl;
  final String? imageUrl;
  final int orderIndex;
  final DateTime createdAt;
  final DateTime updatedAt;

  const LessonSection({
    required this.id,
    required this.lessonId,
    required this.title,
    required this.content,
    this.audioUrl,
    this.videoUrl,
    this.imageUrl,
    required this.orderIndex,
    required this.createdAt,
    required this.updatedAt,
  });

  factory LessonSection.fromJson(Map<String, dynamic> json) {
    return LessonSection(
      id: json['id'] as String,
      lessonId: json['lessonId'] as String,
      title: json['title'] as String,
      content: json['content'] as String,
      audioUrl: json['audioUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
      imageUrl: json['imageUrl'] as String?,
      orderIndex: json['orderIndex'] as int,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'lessonId': lessonId,
      'title': title,
      'content': content,
      'audioUrl': audioUrl,
      'videoUrl': videoUrl,
      'imageUrl': imageUrl,
      'orderIndex': orderIndex,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class LessonProgress {
  final String id;
  final String userId;
  final String lessonId;
  final LessonStatus status;
  final double progress; // 0.0 to 1.0
  final int timeSpent; // in seconds
  final DateTime startedAt;
  final DateTime? completedAt;
  final DateTime lastAccessedAt;
  final Map<String, dynamic> metadata;

  const LessonProgress({
    required this.id,
    required this.userId,
    required this.lessonId,
    required this.status,
    required this.progress,
    required this.timeSpent,
    required this.startedAt,
    this.completedAt,
    required this.lastAccessedAt,
    required this.metadata,
  });

  factory LessonProgress.fromJson(Map<String, dynamic> json) {
    return LessonProgress(
      id: json['id'] as String,
      userId: json['userId'] as String,
      lessonId: json['lessonId'] as String,
      status: LessonStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => LessonStatus.notStarted,
      ),
      progress: (json['progress'] as num).toDouble(),
      timeSpent: json['timeSpent'] as int,
      startedAt: DateTime.parse(json['startedAt'] as String),
      completedAt: json['completedAt'] != null
          ? DateTime.parse(json['completedAt'] as String)
          : null,
      lastAccessedAt: DateTime.parse(json['lastAccessedAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>? ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'lessonId': lessonId,
      'status': status.name,
      'progress': progress,
      'timeSpent': timeSpent,
      'startedAt': startedAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'lastAccessedAt': lastAccessedAt.toIso8601String(),
      'metadata': metadata,
    };
  }
}
