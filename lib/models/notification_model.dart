import 'package:cloud_firestore/cloud_firestore.dart';

class AppNotificationModel {
  final String id;
  final String title;
  final String message;
  final bool read;
  final DateTime createdAt;
  final String? locationId;
  final String? type;

  AppNotificationModel({
    required this.id,
    required this.title,
    required this.message,
    this.read = false,
    required this.createdAt,
    this.locationId,
    this.type,
  });

  factory AppNotificationModel.fromMap(Map<String, dynamic> map, String docId) {
    return AppNotificationModel(
      id: docId,
      title: map['title'] ?? '',
      message: map['message'] ?? '',
      read: map['read'] ?? false,
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      locationId: map['locationId'],
      type: map['type'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'message': message,
      'read': read,
      'createdAt': Timestamp.fromDate(createdAt),
      'locationId': locationId,
      'type': type,
    };
  }
}
