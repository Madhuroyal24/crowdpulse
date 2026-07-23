import 'package:flutter/material.dart';
import '../models/crowd_report_model.dart';
import '../models/location_model.dart';
import '../services/firestore_service.dart';

class CrowdReportProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();

  bool _isSubmitting = false;
  String? _errorMessage;

  bool get isSubmitting => _isSubmitting;
  String? get errorMessage => _errorMessage;

  Future<bool> submitReport({
    required String locationId,
    required String userId,
    required String userName,
    required CrowdLevel crowdLevel,
    required int waitingTime,
    String comment = '',
  }) async {
    try {
      _isSubmitting = true;
      _errorMessage = null;
      notifyListeners();

      final report = CrowdReportModel(
        id: '',
        locationId: locationId,
        userId: userId,
        crowdLevel: crowdLevel,
        waitingTime: waitingTime,
        timestamp: DateTime.now(),
        comment: comment,
        userName: userName.isNotEmpty ? userName : 'CrowdPulse User',
      );

      await _firestoreService.submitCrowdReport(report);

      _isSubmitting = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to submit report. Please try again.';
      _isSubmitting = false;
      notifyListeners();
      return false;
    }
  }
}
