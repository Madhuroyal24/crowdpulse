import 'package:cloud_firestore/cloud_firestore.dart';

enum CrowdLevel { low, moderate, high }

extension CrowdLevelExtension on CrowdLevel {
  String get label {
    switch (this) {
      case CrowdLevel.low:
        return 'Low';
      case CrowdLevel.moderate:
        return 'Moderate';
      case CrowdLevel.high:
        return 'High';
    }
  }

  static CrowdLevel fromString(String value) {
    switch (value.toLowerCase()) {
      case 'low':
        return CrowdLevel.low;
      case 'moderate':
      case 'medium':
        return CrowdLevel.moderate;
      case 'high':
        return CrowdLevel.high;
      default:
        return CrowdLevel.moderate;
    }
  }
}

class LocationModel {
  final String id;
  final String name;
  final String category;
  final double latitude;
  final double longitude;
  final String address;
  final String city;
  final CrowdLevel currentCrowdLevel;
  final CrowdLevel predictedCrowdLevel;
  final int estimatedWaitTime; // in minutes
  final double confidence; // 0.0 - 1.0
  final int averageVisitors;
  final Map<String, dynamic> peakHours; // e.g. {"08:00": 20, "12:00": 85, "18:00": 90}
  final String bestTimeToVisit; // e.g. "2:30 PM - 4:00 PM (~4 min wait)"
  final int bestTimeWaitTime; // e.g. 4
  final DateTime updatedAt;
  final String imageUrl;

  LocationModel({
    required this.id,
    required this.name,
    required this.category,
    required this.latitude,
    required this.longitude,
    required this.address,
    this.city = '',
    required this.currentCrowdLevel,
    required this.predictedCrowdLevel,
    required this.estimatedWaitTime,
    required this.confidence,
    this.averageVisitors = 0,
    this.peakHours = const {},
    this.bestTimeToVisit = '2:00 PM – 4:00 PM',
    this.bestTimeWaitTime = 3,
    required this.updatedAt,
    this.imageUrl = '',
  });

  factory LocationModel.fromMap(Map<String, dynamic> map, String docId) {
    return LocationModel(
      id: docId,
      name: map['name'] ?? '',
      category: map['category'] ?? 'General',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 0.0,
      address: map['address'] ?? '',
      city: map['city'] ?? '',
      currentCrowdLevel: CrowdLevelExtension.fromString(map['currentCrowdLevel'] ?? 'moderate'),
      predictedCrowdLevel: CrowdLevelExtension.fromString(map['predictedCrowdLevel'] ?? 'moderate'),
      estimatedWaitTime: (map['estimatedWaitTime'] as num?)?.toInt() ?? 10,
      confidence: (map['confidence'] as num?)?.toDouble() ?? 0.85,
      averageVisitors: (map['averageVisitors'] as num?)?.toInt() ?? 150,
      peakHours: map['peakHours'] is Map ? Map<String, dynamic>.from(map['peakHours']) : {},
      bestTimeToVisit: map['bestTimeToVisit'] ?? '2:00 PM – 4:00 PM',
      bestTimeWaitTime: (map['bestTimeWaitTime'] as num?)?.toInt() ?? 3,
      updatedAt: (map['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      imageUrl: map['imageUrl'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'category': category,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'city': city,
      'currentCrowdLevel': currentCrowdLevel.label,
      'predictedCrowdLevel': predictedCrowdLevel.label,
      'estimatedWaitTime': estimatedWaitTime,
      'confidence': confidence,
      'averageVisitors': averageVisitors,
      'peakHours': peakHours,
      'bestTimeToVisit': bestTimeToVisit,
      'bestTimeWaitTime': bestTimeWaitTime,
      'updatedAt': Timestamp.fromDate(updatedAt),
      'imageUrl': imageUrl,
    };
  }
}
