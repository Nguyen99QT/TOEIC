class User {
  final String id;
  final String email;
  final String name;
  final int? currentLevel;
  final int? totalScore;

  const User({
    required this.id,
    required this.email,
    required this.name,
    this.currentLevel,
    this.totalScore,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      currentLevel: json['currentLevel'] as int?,
      totalScore: json['totalScore'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'currentLevel': currentLevel,
      'totalScore': totalScore,
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? name,
    int? currentLevel,
    int? totalScore,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      currentLevel: currentLevel ?? this.currentLevel,
      totalScore: totalScore ?? this.totalScore,
    );
  }
}
