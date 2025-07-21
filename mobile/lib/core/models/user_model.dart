import 'package:hive/hive.dart';
import 'dart:convert';

@HiveType(typeId: 0)
class User {
  @HiveField(0)
  final int id;

  @HiveField(1)
  final String username;

  @HiveField(2)
  final String email;

  @HiveField(3)
  final String fullName;

  @HiveField(4)
  final String? firstName;

  @HiveField(5)
  final String? lastName;

  @HiveField(6)
  final String role;

  @HiveField(7)
  final String membershipType;

  @HiveField(8)
  final String? gender;

  @HiveField(9)
  final String? phoneNumber;

  @HiveField(10)
  final String? profilePicture;

  @HiveField(11)
  final DateTime? createdAt;

  @HiveField(12)
  final DateTime? updatedAt;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.fullName,
    this.firstName,
    this.lastName,
    this.role = 'USER',
    this.membershipType = 'FREE',
    this.gender,
    this.phoneNumber,
    this.profilePicture,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] ?? 0,
      username: map['username'] ?? '',
      email: map['email'] ?? '',
      fullName: map['fullName'] ?? '',
      firstName: map['firstName'],
      lastName: map['lastName'],
      role: map['role'] ?? 'USER',
      membershipType: map['membershipType'] ?? 'FREE',
      gender: map['gender'],
      phoneNumber: map['phoneNumber'],
      profilePicture: map['profilePicture'],
      createdAt:
          map['createdAt'] != null ? DateTime.parse(map['createdAt']) : null,
      updatedAt:
          map['updatedAt'] != null ? DateTime.parse(map['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'membershipType': membershipType,
      'gender': gender,
      'phoneNumber': phoneNumber,
      'profilePicture': profilePicture,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  String toJson() {
    return jsonEncode(toMap());
  }

  factory User.fromJson(String jsonString) {
    final map = jsonDecode(jsonString) as Map<String, dynamic>;
    return User.fromMap(map);
  }

  User copyWith({
    int? id,
    String? username,
    String? email,
    String? fullName,
    String? firstName,
    String? lastName,
    String? role,
    String? membershipType,
    String? gender,
    String? phoneNumber,
    String? profilePicture,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      role: role ?? this.role,
      membershipType: membershipType ?? this.membershipType,
      gender: gender ?? this.gender,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      profilePicture: profilePicture ?? this.profilePicture,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'User(id: $id, username: $username, email: $email, fullName: $fullName, role: $role)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id && other.username == username;
  }

  @override
  int get hashCode => id.hashCode ^ username.hashCode;
}
