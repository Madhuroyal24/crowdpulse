import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // Request permission for push notifications
    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      String? token = await _fcm.getToken();
      // FCM Token initialized
    }

    // Foreground message handler
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Handle foreground notification
    });
  }

  Future<void> subscribeToLocationAlerts(String locationId) async {
    await _fcm.subscribeToTopic('location_$locationId');
  }

  Future<void> unsubscribeFromLocationAlerts(String locationId) async {
    await _fcm.unsubscribeFromTopic('location_$locationId');
  }
}
