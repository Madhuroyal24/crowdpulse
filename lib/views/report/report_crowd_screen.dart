import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/crowd_report_provider.dart';
import '../../models/location_model.dart';
import '../../config/theme.dart';

class ReportCrowdScreen extends StatefulWidget {
  final String locationId;
  final String locationName;

  const ReportCrowdScreen({
    super.key,
    required this.locationId,
    required this.locationName,
  });

  @override
  State<ReportCrowdScreen> createState() => _ReportCrowdScreenState();
}

class _ReportCrowdScreenState extends State<ReportCrowdScreen> {
  CrowdLevel _selectedLevel = CrowdLevel.moderate;
  double _waitTimeMinutes = 10.0;
  final _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _submit() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final reportProvider = Provider.of<CrowdReportProvider>(context, listen: false);

    final success = await reportProvider.submitReport(
      locationId: widget.locationId,
      userId: authProvider.firebaseUser?.uid ?? 'anonymous',
      userName: authProvider.userModel?.name ?? 'CrowdPulse User',
      crowdLevel: _selectedLevel,
      waitingTime: _waitTimeMinutes.round(),
      comment: _commentController.text.trim(),
    );

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Crowd report submitted successfully! Thank you!'),
            backgroundColor: AppTheme.crowdLow,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(reportProvider.errorMessage ?? 'Submission failed.'),
            backgroundColor: AppTheme.crowdHigh,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final reportProvider = Provider.of<CrowdReportProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Report Crowd - ${widget.locationName}'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Select Current Crowd Density',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildLevelTile(CrowdLevel.low, 'Low', AppTheme.crowdLow),
                const SizedBox(width: 8),
                _buildLevelTile(CrowdLevel.moderate, 'Moderate', AppTheme.crowdModerate),
                const SizedBox(width: 8),
                _buildLevelTile(CrowdLevel.high, 'High', AppTheme.crowdHigh),
              ],
            ),
            const SizedBox(height: 32),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Estimated Waiting Time',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  '~${_waitTimeMinutes.round()} minutes',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primaryBlue),
                ),
              ],
            ),
            Slider(
              value: _waitTimeMinutes,
              min: 0,
              max: 60,
              divisions: 12,
              activeColor: AppTheme.primaryBlue,
              label: '${_waitTimeMinutes.round()} min',
              onChanged: (val) => setState(() => _waitTimeMinutes = val),
            ),
            const SizedBox(height: 24),

            const Text(
              'Optional Comments',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _commentController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'e.g., Line is moving fast, counters are fully open...',
              ),
            ),
            const SizedBox(height: 40),

            SizedBox(
              height: 52,
              child: ElevatedButton(
                onPressed: reportProvider.isSubmitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: reportProvider.isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Submit Real-Time Report', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLevelTile(CrowdLevel level, String label, Color color) {
    final isSelected = _selectedLevel == level;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedLevel = level),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: isSelected ? color : color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color, width: 2),
          ),
          child: Column(
            children: [
              Icon(
                level == CrowdLevel.low
                    ? Icons.sentiment_satisfied_alt
                    : level == CrowdLevel.moderate
                        ? Icons.sentiment_neutral
                        : Icons.sentiment_very_dissatisfied,
                color: isSelected ? Colors.white : color,
              ),
              const SizedBox(height: 6),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : color,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
