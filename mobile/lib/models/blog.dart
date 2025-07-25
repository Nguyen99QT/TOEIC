class BlogPost {
  final int? id;
  final String title;
  final String content;
  final String author;
  final DateTime createdAt;
  final String? imageUrl;
  final String? videoUrl;
  final String? pdfUrl;
  final int likesCount;
  final int commentsCount;
  final bool hidden;

  BlogPost({
    this.id,
    required this.title,
    required this.content,
    required this.author,
    required this.createdAt,
    this.imageUrl,
    this.videoUrl,
    this.pdfUrl,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.hidden = false,
  });

  factory BlogPost.fromJson(Map<String, dynamic> json) {
    return BlogPost(
      id: json['id'],
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      author: json['author'] ?? '',
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      imageUrl: json['imageUrl'],
      videoUrl: json['videoUrl'],
      pdfUrl: json['pdfUrl'],
      likesCount: json['likesCount'] ?? 0,
      commentsCount: json['commentsCount'] ?? 0,
      hidden: json['hidden'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'author': author,
      'createdAt': createdAt.toIso8601String(),
      'imageUrl': imageUrl,
      'videoUrl': videoUrl,
      'pdfUrl': pdfUrl,
      'likesCount': likesCount,
      'commentsCount': commentsCount,
      'hidden': hidden,
    };
  }

  BlogPost copyWith({
    int? id,
    String? title,
    String? content,
    String? author,
    DateTime? createdAt,
    String? imageUrl,
    String? videoUrl,
    String? pdfUrl,
    int? likesCount,
    int? commentsCount,
    bool? hidden,
  }) {
    return BlogPost(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      author: author ?? this.author,
      createdAt: createdAt ?? this.createdAt,
      imageUrl: imageUrl ?? this.imageUrl,
      videoUrl: videoUrl ?? this.videoUrl,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      hidden: hidden ?? this.hidden,
    );
  }

  @override
  String toString() {
    return 'BlogPost(id: $id, title: $title, author: $author, createdAt: $createdAt)';
  }
}
