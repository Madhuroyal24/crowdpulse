import 'package:cloud_firestore/cloud_firestore.dart';
import 'location_model.dart';

class CrowdReportModel {
  final String id;
  final String locationId;
  final String userId;
  final CrowdLevel crowdLevel;
  final int waitingTime; // minutes
  final DateTime timestamp;
  final String comment;
  final String userName;

  CrowdReportModel({
    required this.id,
    required this.locationId,
    required this.userId,
    required this.crowdLevel,
    required this.waitingTime,
    required this.timestamp,
    this.comment = '',
    this.userName = 'Anonymous User',
  });

  factory CrowdReportModel.fromMap(Map<String, dynamic> map, String docId) {
    return CrowdReportModel(
      id: docId,
      locationId: map['locationId'] ?? '',
      userId: map['userId'] ?? '',
      crowdLevel: CrowdLevelExtension.fromString(map['crowdLevel'] ?? 'moderate'),
      waitingTime: (map['waitingTime'] as num?)?.toInt() ?? 5,
      timestamp: (map['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
      comment: map['comment'] ?? '',
      userName: map['userName'] ?? 'Anonymous User',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'locationId': locationId,
      'userId': userId,
      'crowdLevel': crowdLevel.label,
      'waitingTime': waitingTime,
      'timestamp': Timestamp.fromDate(timestamp),
      'comment': comment,
      'userName': userName,
    };
  }
}
