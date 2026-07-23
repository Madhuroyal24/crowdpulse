import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/location_model.dart';
import '../models/crowd_report_model.dart';
import '../models/notification_model.dart';
import '../models/analytics_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Stream All Locations
  Stream<List<LocationModel>> streamLocations({String? category, String? searchQuery}) {
    Query query = _db.collection('locations');

    if (category != null && category.isNotEmpty && category != 'All') {
      query = query.where('category', isEqualTo: category);
    }

    return query.snapshots().map((snapshot) {
      final docs = snapshot.docs.map((doc) {
        return LocationModel.fromMap(doc.data() as Map<String, dynamic>, doc.id);
      }).toList();

      if (searchQuery != null && searchQuery.trim().isNotEmpty) {
        final q = searchQuery.toLowerCase().trim();
        return docs.where((loc) =>
          loc.name.toLowerCase().contains(q) ||
          loc.category.toLowerCase().contains(q) ||
          loc.address.toLowerCase().contains(q) ||
          loc.city.toLowerCase().contains(q)
        ).toList();
      }

      return docs;
    });
  }

  // Get single location stream
  Stream<LocationModel?> streamLocationDetail(String locationId) {
    return _db.collection('locations').doc(locationId).snapshots().map((doc) {
      if (doc.exists && doc.data() != null) {
        return LocationModel.fromMap(doc.data()!, doc.id);
      }
      return null;
    });
  }

  // Stream recent reports for a location
  Stream<List<CrowdReportModel>> streamLocationReports(String locationId) {
    return _db.collection('crowdReports')
        .where('locationId', isEqualTo: locationId)
        .orderBy('timestamp', descending: true)
        .limit(20)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => CrowdReportModel.fromMap(doc.data(), doc.id)).toList();
    });
  }

  // Submit a Crowd Report
  Future<void> submitCrowdReport(CrowdReportModel report) async {
    // 1. Add report document
    final reportRef = await _db.collection('crowdReports').add(report.toMap());

    // 2. Update venue's current level & estimated wait time based on report
    await _db.collection('locations').doc(report.locationId).update({
      'currentCrowdLevel': report.crowdLevel.label,
      'estimatedWaitTime': report.waitingTime,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // Toggle Favorite
  Future<void> toggleFavorite(String uid, String locationId, bool isFav) async {
    final userRef = _db.collection('users').doc(uid);
    if (isFav) {
      await userRef.update({
        'favoriteLocations': FieldValue.arrayUnion([locationId])
      });
    } else {
      await userRef.update({
        'favoriteLocations': FieldValue.arrayRemove([locationId])
      });
    }
  }

  // Stream User Notifications
  Stream<List<AppNotificationModel>> streamUserNotifications(String uid) {
    return _db.collection('notifications')
        .doc(uid)
        .collection('user_notifications')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => AppNotificationModel.fromMap(doc.data(), doc.id)).toList();
    });
  }

  // Mark notification as read
  Future<void> markNotificationRead(String uid, String notificationId) async {
    await _db.collection('notifications')
        .doc(uid)
        .collection('user_notifications')
        .doc(notificationId)
        .update({'read': true});
  }

  // Get Analytics for a location
  Future<LocationAnalyticsModel?> getLocationAnalytics(String locationId) async {
    final doc = await _db.collection('analytics').doc(locationId).get();
    if (doc.exists && doc.data() != null) {
      return LocationAnalyticsModel.fromMap(doc.data()!, doc.id);
    }
    return null;
  }
}
