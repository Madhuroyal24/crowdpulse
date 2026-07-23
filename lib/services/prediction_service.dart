import 'dart:math';
import '../models/location_model.dart';
import '../models/crowd_report_model.dart';

class PredictionResult {
  final CrowdLevel predictedCrowdLevel;
  final int estimatedWaitTime;
  final double confidenceScore;
  final String reasoning;
  final String bestTimeToVisit;
  final int bestTimeWaitTime;

  PredictionResult({
    required this.predictedCrowdLevel,
    required this.estimatedWaitTime,
    required this.confidenceScore,
    required this.reasoning,
    required this.bestTimeToVisit,
    required this.bestTimeWaitTime,
  });
}

class PredictionService {
  /// AI Prediction algorithm calculating crowd levels, wait times, AND optimal visit window.
  static PredictionResult predictCrowd({
    required LocationModel location,
    required List<CrowdReportModel> recentReports,
    DateTime? currentTime,
  }) {
    final now = currentTime ?? DateTime.now();
    final hour = now.hour;
    final isWeekend = (now.weekday == DateTime.saturday || now.weekday == DateTime.sunday);

    // 1. Time of Day Base Score (0.0 to 1.0)
    double timeScore = 0.3; // Base low
    if (hour >= 11 && hour <= 14) {
      timeScore = 0.75; // Lunch peak
    } else if (hour >= 17 && hour <= 20) {
      timeScore = 0.90; // Evening peak
    } else if (hour >= 8 && hour < 11) {
      timeScore = 0.50; // Morning buildup
    } else if (hour >= 21 || hour < 7) {
      timeScore = 0.15; // Off peak
    }

    if (isWeekend) {
      timeScore = min(1.0, timeScore * 1.25);
    }

    // 2. Weighting Live Reports
    double totalWeight = 0.0;
    double weightedCrowdSum = 0.0;
    double weightedWaitSum = 0.0;

    if (recentReports.isNotEmpty) {
      for (var report in recentReports) {
        final minutesAgo = now.difference(report.timestamp).inMinutes;
        if (minutesAgo > 180) continue;

        double weight = exp(-minutesAgo / 45.0);
        double levelValue = report.crowdLevel == CrowdLevel.high
            ? 0.95
            : report.crowdLevel == CrowdLevel.moderate
                ? 0.6
                : 0.3;

        weightedCrowdSum += levelValue * weight;
        weightedWaitSum += report.waitingTime * weight;
        totalWeight += weight;
      }
    }

    double finalScore;
    int predictedWaitTime;
    double confidence;
    String reasoning;

    if (totalWeight > 0) {
      double liveReportAverage = weightedCrowdSum / totalWeight;
      finalScore = (liveReportAverage * 0.70) + (timeScore * 0.30);
      predictedWaitTime = ((weightedWaitSum / totalWeight) * 0.7 + (finalScore * 25) * 0.3).round();
      confidence = min(0.98, 0.75 + (totalWeight * 0.05));
      reasoning = "High accuracy calculated from ${recentReports.length} live report(s) and historical patterns.";
    } else {
      finalScore = timeScore;
      predictedWaitTime = (finalScore * 25).round();
      confidence = 0.70;
      reasoning = "Forecasted using historical peak-hour heuristics for ${location.category}.";
    }

    // Classify CrowdLevel
    CrowdLevel predictedLevel;
    if (finalScore >= 0.72) {
      predictedLevel = CrowdLevel.high;
    } else if (finalScore >= 0.42) {
      predictedLevel = CrowdLevel.moderate;
    } else {
      predictedLevel = CrowdLevel.low;
    }

    // 3. Compute Best Time to Visit Window
    String bestTimeWindow = "2:30 PM – 4:00 PM";
    int bestWait = 3;
    if (location.category.toLowerCase().contains('bank')) {
      bestTimeWindow = "2:00 PM – 3:30 PM (Post lunch drop)";
      bestWait = 4;
    } else if (location.category.toLowerCase().contains('hospital')) {
      bestTimeWindow = "3:30 PM – 5:00 PM (Afternoon OPD window)";
      bestWait = 8;
    } else if (location.category.toLowerCase().contains('supermarket')) {
      bestTimeWindow = "10:00 AM – 11:30 AM (Early morning window)";
      bestWait = 2;
    }

    return PredictionResult(
      predictedCrowdLevel: predictedLevel,
      estimatedWaitTime: max(2, predictedWaitTime),
      confidenceScore: confidence,
      reasoning: reasoning,
      bestTimeToVisit: bestTimeWindow,
      bestTimeWaitTime: bestWait,
    );
  }
}
