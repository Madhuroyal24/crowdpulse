import 'package:firebase_analytics/firebase_analytics.dart';

class AnalyticsService {
  final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;

  Future<void> logLocationView(String locationId, String locationName) async {
    await _analytics.logEvent(
      name: 'view_location',
      parameters: {
        'location_id': locationId,
        'location_name': locationName,
      },
    );
  }

  Future<void> logCrowdReportSubmitted(String locationId, String crowdLevel, int waitTime) async {
    await _analytics.logEvent(
      name: 'submit_crowd_report',
      parameters: {
        'location_id': locationId,
        'crowd_level': crowdLevel,
        'wait_time_minutes': waitTime,
      },
    );
  }

  Future<void> logSearchQuery(String query, String category) async {
    await _analytics.logSearch(
      searchTerm: query,
      numberOfNights: 0,
    );
  }
}
