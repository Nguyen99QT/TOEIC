class UserModel {
  final String id;
  final String username;
  final String email;
  final String? photoUrl;
  final String? fullName;
  final String role;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    this.photoUrl,
    this.fullName,
    required this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      photoUrl: json['photoUrl'],
      fullName: json['fullName'],
      role: json['role'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'photoUrl': photoUrl,
      'fullName': fullName,
      'role': role,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
