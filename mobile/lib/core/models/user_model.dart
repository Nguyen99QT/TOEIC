import 'package:hive/hive.dart';

@HiveType(typeId: 0)
class User {
  @HiveField(0)
  final int id;

  @HiveField(1)
  final String username;

  @HiveField(2)
  final String email;

  @HiveField(3)
  final String? fullName;

  @HiveField(4)
  final String? firstName;

  @HiveField(5)
  final String? lastName;

  @HiveField(6)
  final String? gender;

  @HiveField(7)
  final String? phoneNumber;

  @HiveField(8)
  final String role;

  @HiveField(9)
  final DateTime? createdAt;

  @HiveField(10)
  final DateTime? updatedAt;

  @HiveField(11)
  final String? membershipType;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.fullName,
    this.firstName,
    this.lastName,
    this.gender,
    this.phoneNumber,
    required this.role,
    this.createdAt,
    this.updatedAt,
    this.membershipType,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    // Handle roles array from backend
    String userRole = 'USER';
    if (map['roles'] != null &&
        map['roles'] is List &&
        (map['roles'] as List).isNotEmpty) {
      userRole = (map['roles'] as List).first.toString();
    } else if (map['role'] != null) {
      userRole = map['role'].toString();
    }

    return User(
      id: map['id']?.toInt() ?? 0,
      username: map['username'] ?? '',
      email: map['email'] ?? '',
      fullName: map['fullName'],
      firstName: map['firstName'],
      lastName: map['lastName'],
      gender: map['gender'],
      phoneNumber: map['phoneNumber'],
      role: userRole,
      createdAt:
          map['createdAt'] != null ? DateTime.parse(map['createdAt']) : null,
      updatedAt:
          map['updatedAt'] != null ? DateTime.parse(map['updatedAt']) : null,
      membershipType: map['membershipType'],
    );
  }

  factory User.fromJson(String source) {
    final map = Map<String, dynamic>.from(source as Map);
    return User.fromMap(map);
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'firstName': firstName,
      'lastName': lastName,
      'gender': gender,
      'phoneNumber': phoneNumber,
      'role': role,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'membershipType': membershipType,
    };
  }

  String toJson() {
    return toMap().toString();
  }

  User copyWith({
    int? id,
    String? username,
    String? email,
    String? fullName,
    String? firstName,
    String? lastName,
    String? gender,
    String? phoneNumber,
    String? role,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? membershipType,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      gender: gender ?? this.gender,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      membershipType: membershipType ?? this.membershipType,
    );
  }

  @override
  String toString() {
    return 'User(id: $id, username: $username, email: $email, fullName: $fullName, role: $role, membershipType: $membershipType)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is User &&
        other.id == id &&
        other.username == username &&
        other.email == email;
  }

  @override
  int get hashCode {
    return id.hashCode ^ username.hashCode ^ email.hashCode;
  }

  // Helper methods for role checking
  bool get isStudent =>
      role.toUpperCase() == 'USER' ||
      role.toUpperCase() == 'STUDENT' ||
      role.toUpperCase() == 'ROLE_USER' ||
      role.toUpperCase() == 'ROLE_STUDENT';

  bool get isCollaborator =>
      role.toUpperCase() == 'COLLABORATOR' ||
      role.toUpperCase() == 'ROLE_COLLABORATOR';

  bool get isAdmin =>
      role.toUpperCase() == 'ADMIN' || role.toUpperCase() == 'ROLE_ADMIN';

  bool get canCreateContent => isCollaborator || isAdmin;
  bool get canManageUsers => isAdmin;

  String get displayRole {
    switch (role.toUpperCase()) {
      case 'USER':
      case 'STUDENT':
        return 'Student';
      case 'COLLABORATOR':
        return 'Collaborator';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Student';
    }
  }
}
