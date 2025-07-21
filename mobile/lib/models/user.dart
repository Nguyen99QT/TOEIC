class User {
  final String id;
  final String email;
  final String username;
  final String? firstName;
  final String? lastName;
  final String? avatar;
  final String? phoneNumber;
  final DateTime? dateOfBirth;
  final String? country;
  final String? language;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final String role;
  final int totalScore;
  final int lessonsCompleted;
  final int exercisesCompleted;
  final int studyStreak;
  final DateTime? lastStudyDate;

  const User({
    required this.id,
    required this.email,
    required this.username,
    this.firstName,
    this.lastName,
    this.avatar,
    this.phoneNumber,
    this.dateOfBirth,
    this.country,
    this.language,
    required this.createdAt,
    required this.updatedAt,
    required this.isActive,
    required this.role,
    this.totalScore = 0,
    this.lessonsCompleted = 0,
    this.exercisesCompleted = 0,
    this.studyStreak = 0,
    this.lastStudyDate,
  });

  String get fullName => (firstName != null && lastName != null)
      ? '$firstName $lastName'
      : username;

  bool get hasCompletedProfile =>
      firstName != null && lastName != null && phoneNumber != null;

  User copyWith({
    String? id,
    String? email,
    String? username,
    String? firstName,
    String? lastName,
    String? avatar,
    String? phoneNumber,
    DateTime? dateOfBirth,
    String? country,
    String? language,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isActive,
    String? role,
    int? totalScore,
    int? lessonsCompleted,
    int? exercisesCompleted,
    int? studyStreak,
    DateTime? lastStudyDate,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      username: username ?? this.username,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      avatar: avatar ?? this.avatar,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      country: country ?? this.country,
      language: language ?? this.language,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isActive: isActive ?? this.isActive,
      role: role ?? this.role,
      totalScore: totalScore ?? this.totalScore,
      lessonsCompleted: lessonsCompleted ?? this.lessonsCompleted,
      exercisesCompleted: exercisesCompleted ?? this.exercisesCompleted,
      studyStreak: studyStreak ?? this.studyStreak,
      lastStudyDate: lastStudyDate ?? this.lastStudyDate,
    );
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      username: json['username'] as String,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      avatar: json['avatar'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.parse(json['dateOfBirth'] as String)
          : null,
      country: json['country'] as String?,
      language: json['language'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      role: json['role'] as String? ?? 'user',
      totalScore: json['totalScore'] as int? ?? 0,
      lessonsCompleted: json['lessonsCompleted'] as int? ?? 0,
      exercisesCompleted: json['exercisesCompleted'] as int? ?? 0,
      studyStreak: json['studyStreak'] as int? ?? 0,
      lastStudyDate: json['lastStudyDate'] != null
          ? DateTime.parse(json['lastStudyDate'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'firstName': firstName,
      'lastName': lastName,
      'avatar': avatar,
      'phoneNumber': phoneNumber,
      'dateOfBirth': dateOfBirth?.toIso8601String(),
      'country': country,
      'language': language,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isActive': isActive,
      'role': role,
      'totalScore': totalScore,
      'lessonsCompleted': lessonsCompleted,
      'exercisesCompleted': exercisesCompleted,
      'studyStreak': studyStreak,
      'lastStudyDate': lastStudyDate?.toIso8601String(),
    };
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
