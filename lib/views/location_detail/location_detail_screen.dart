import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../services/firestore_service.dart';
import '../../services/prediction_service.dart';
import '../../models/location_model.dart';
import '../../models/crowd_report_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../config/theme.dart';

class LocationDetailScreen extends StatelessWidget {
  final String locationId;

  const LocationDetailScreen({super.key, required this.locationId});

  @override
  Widget build(BuildContext context) {
    final firestoreService = FirestoreService();
    final authProvider = Provider.of<AuthProvider>(context);
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final theme = Theme.of(context);

    return StreamBuilder<LocationModel?>(
      stream: firestoreService.streamLocationDetail(locationId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        final location = snapshot.data;
        if (location == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Venue Not Found')),
            body: const Center(child: Text('This venue doc was not found in Firestore.')),
          );
        }

        final crowdColor = AppTheme.getCrowdColor(location.currentCrowdLevel.label);
        final isFav = favoritesProvider.isFavorite(location.id);

        return Scaffold(
          appBar: AppBar(
            title: Text(location.name),
            actions: [
              IconButton(
                icon: Icon(
                  isFav ? Icons.favorite : Icons.favorite_border,
                  color: isFav ? Colors.red : null,
                ),
                onPressed: () {
                  if (authProvider.isAuthenticated) {
                    favoritesProvider.toggleFavorite(authProvider.firebaseUser!.uid, location.id);
                  } else {
                    context.push('/auth/login');
                  }
                },
              ),
            ],
          ),
          body: StreamBuilder<List<CrowdReportModel>>(
            stream: firestoreService.streamLocationReports(locationId),
            builder: (context, reportSnapshot) {
              final reports = reportSnapshot.data ?? [];
              final prediction = PredictionService.predictCrowd(
                location: location,
                recentReports: reports,
              );

              return SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Main Status Card
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        location.name,
                                        style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${location.category} • ${location.address}',
                                        style: const TextStyle(color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const Divider(height: 32),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                // Current Crowd
                                Column(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: crowdColor.withOpacity(0.15),
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(color: crowdColor, width: 2),
                                      ),
                                      child: Text(
                                        location.currentCrowdLevel.label,
                                        style: TextStyle(color: crowdColor, fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    const Text('Current Crowd', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                  ],
                                ),

                                // Wait Time
                                Column(
                                  children: [
                                    Text(
                                      '${location.estimatedWaitTime} min',
                                      style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.extrabold,
                                        color: location.estimatedWaitTime > 20 ? AppTheme.crowdHigh : AppTheme.primaryBlue,
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    const Text('Current Queue Wait', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // BEST TIME TO VISIT CARD (Solves User Problem Directly!)
                    Card(
                      color: AppTheme.crowdLow.withOpacity(0.12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: const BorderSide(color: AppTheme.crowdLow, width: 1.5),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.stars_rounded, color: AppTheme.crowdLow, size: 24),
                                const SizedBox(width: 8),
                                Text(
                                  'RECOMMENDED BEST TIME TO VISIT',
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.extrabold,
                                    color: AppTheme.crowdLow,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              prediction.bestTimeToVisit,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Visiting during this window drops wait time to only ~${prediction.bestTimeWaitTime} mins (save ~${location.estimatedWaitTime - prediction.bestTimeWaitTime} mins!).',
                              style: TextStyle(color: Colors.grey[700], fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // AI Prediction Forecast Card
                    Card(
                      color: AppTheme.aiAccent.withOpacity(0.08),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: const BorderSide(color: AppTheme.aiAccent, width: 1.5),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.auto_awesome, color: AppTheme.aiAccent),
                                const SizedBox(width: 8),
                                Text(
                                  'AI Crowd Forecast',
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.aiAccent,
                                  ),
                                ),
                                const Spacer(),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppTheme.aiAccent,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    '${(prediction.confidenceScore * 100).toInt()}% Confidence',
                                    style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Predicted Crowd Level: ${prediction.predictedCrowdLevel.label} (~${prediction.estimatedWaitTime} min wait)',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              prediction.reasoning,
                              style: TextStyle(color: Colors.grey[700], fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Action Buttons
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              if (authProvider.isAuthenticated) {
                                context.push('/report/${location.id}', extra: location.name);
                              } else {
                                context.push('/auth/login');
                              }
                            },
                            icon: const Icon(Icons.rate_review_outlined),
                            label: const Text('Report Crowd'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryBlue,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        OutlinedButton.icon(
                          onPressed: () => context.push('/analytics/${location.id}'),
                          icon: const Icon(Icons.bar_chart_rounded),
                          label: const Text('Analytics'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    // Recent Live Reports Section
                    Text(
                      'Live User Reports (${reports.length})',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),

                    reports.isEmpty
                        ? const Padding(
                            padding: EdgeInsets.symmetric(vertical: 20.0),
                            child: Text('No reports submitted yet. Be the first to report!', style: TextStyle(color: Colors.grey)),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: reports.length,
                            itemBuilder: (context, index) {
                              final r = reports[index];
                              final rColor = AppTheme.getCrowdColor(r.crowdLevel.label);

                              return Card(
                                margin: const EdgeInsets.only(bottom: 8),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: rColor.withOpacity(0.2),
                                    child: Icon(Icons.person, color: rColor),
                                  ),
                                  title: Text(r.userName, style: const TextStyle(fontWeight: FontWeight.bold)),
                                  subtitle: Text(
                                    r.comment.isNotEmpty ? r.comment : '${r.crowdLevel.label} crowd • ${r.waitingTime}m wait',
                                  ),
                                  trailing: Text(
                                    DateFormat('h:mm a').format(r.timestamp),
                                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                                  ),
                                ),
                              );
                            },
                          ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
}
