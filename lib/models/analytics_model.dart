class AnalyticsDataPoint {
  final String label; // e.g. "Mon", "Jan 10", "10 AM"
  final double value; // visitor count or wait time

  AnalyticsDataPoint({required this.label, required this.value});
}

class LocationAnalyticsModel {
  final String locationId;
  final List<AnalyticsDataPoint> dailyVisitors;
  final List<AnalyticsDataPoint> weeklyVisitors;
  final List<AnalyticsDataPoint> monthlyVisitors;
  final double averageQueueTime;
  final List<AnalyticsDataPoint> peakHoursData;

  LocationAnalyticsModel({
    required this.locationId,
    required this.dailyVisitors,
    required this.weeklyVisitors,
    required this.monthlyVisitors,
    required this.averageQueueTime,
    required this.peakHoursData,
  });

  factory LocationAnalyticsModel.fromMap(Map<String, dynamic> map, String locId) {
    List<AnalyticsDataPoint> parseList(dynamic rawList) {
      if (rawList is List) {
        return rawList.map((item) {
          if (item is Map) {
            return AnalyticsDataPoint(
              label: item['label']?.toString() ?? '',
              value: (item['value'] as num?)?.toDouble() ?? 0.0,
            );
          }
          return AnalyticsDataPoint(label: '', value: 0);
        }).toList();
      }
      return [];
    }

    return LocationAnalyticsModel(
      locationId: locId,
      dailyVisitors: parseList(map['dailyVisitors']),
      weeklyVisitors: parseList(map['weeklyVisitors']),
      monthlyVisitors: parseList(map['monthlyVisitors']),
      averageQueueTime: (map['averageQueueTime'] as num?)?.toDouble() ?? 12.5,
      peakHoursData: parseList(map['peakHoursData']),
    );
  }
}
