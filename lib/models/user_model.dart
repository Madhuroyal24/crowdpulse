import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String name;
  final String email;
  final String phone;
  final String profileImage;
  final DateTime createdAt;
  final DateTime lastLogin;
  final List<String> favoriteLocations;
  final bool notificationEnabled;

  UserModel({
    required this.uid,
    required this.name,
    required this.email,
    this.phone = '',
    this.profileImage = '',
    required this.createdAt,
    required this.lastLogin,
    this.favoriteLocations = const [],
    this.notificationEnabled = true,
  });

  factory UserModel.fromMap(Map<String, dynamic> map, String docId) {
    return UserModel(
      uid: docId,
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      phone: map['phone'] ?? '',
      profileImage: map['profileImage'] ?? '',
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      lastLogin: (map['lastLogin'] as Timestamp?)?.toDate() ?? DateTime.now(),
      favoriteLocations: List<String>.from(map['favoriteLocations'] ?? []),
      notificationEnabled: map['notificationEnabled'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'phone': phone,
      'profileImage': profileImage,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastLogin': Timestamp.fromDate(lastLogin),
      'favoriteLocations': favoriteLocations,
      'notificationEnabled': notificationEnabled,
    };
  }

  UserModel copyWith({
    String? uid,
    String? name,
    String? email,
    String? phone,
    String? profileImage,
    DateTime? createdAt,
    DateTime? lastLogin,
    List<String>? favoriteLocations,
    bool? notificationEnabled,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      profileImage: profileImage ?? this.profileImage,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      favoriteLocations: favoriteLocations ?? this.favoriteLocations,
      notificationEnabled: notificationEnabled ?? this.notificationEnabled,
    );
  }
}
