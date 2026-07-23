import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/firestore_service.dart';
import '../../models/analytics_model.dart';
import '../../config/theme.dart';

class AnalyticsScreen extends StatefulWidget {
  final String locationId;

  const AnalyticsScreen({super.key, required this.locationId});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  int _selectedTab = 0; // 0: Daily, 1: Weekly, 2: Monthly

  @override
  Widget build(BuildContext context) {
    final firestoreService = FirestoreService();
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Crowd Analytics & Trends'),
      ),
      body: FutureBuilder<LocationAnalyticsModel?>(
        future: firestoreService.getLocationAnalytics(widget.locationId),
        builder: (context, snapshot) {
          final analytics = snapshot.data ?? _generateFallbackAnalytics(widget.locationId);

          final activeData = _selectedTab == 0
              ? analytics.dailyVisitors
              : _selectedTab == 1
                  ? analytics.weeklyVisitors
                  : analytics.monthlyVisitors;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tab Selector
                Row(
                  children: [
                    _buildTabChip('Daily', 0),
                    const SizedBox(width: 8),
                    _buildTabChip('Weekly', 1),
                    const SizedBox(width: 8),
                    _buildTabChip('Monthly', 2),
                  ],
                ),
                const SizedBox(height: 24),

                // Visitor Trend Chart
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Footfall Trend (${_selectedTab == 0 ? 'Daily' : _selectedTab == 1 ? 'Weekly' : 'Monthly'})',
                          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        const Text('Average visitor count', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        const SizedBox(height: 24),
                        SizedBox(
                          height: 220,
                          child: BarChart(
                            BarChartData(
                              alignment: BarChartAlignment.spaceAround,
                              maxY: 150,
                              barTouchData: BarTouchData(enabled: true),
                              titlesData: FlTitlesData(
                                show: true,
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    getTitlesWidget: (val, meta) {
                                      int idx = val.toInt();
                                      if (idx >= 0 && idx < activeData.length) {
                                        return SideTitleWidget(
                                          axisSide: meta.axisSide,
                                          child: Text(activeData[idx].label, style: const TextStyle(fontSize: 11)),
                                        );
                                      }
                                      return const SizedBox.shrink();
                                    },
                                  ),
                                ),
                                leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              ),
                              borderData: FlBorderData(show: false),
                              barGroups: List.generate(activeData.length, (index) {
                                return BarChartGroupData(
                                  x: index,
                                  barRods: [
                                    BarChartRodData(
                                      toY: activeData[index].value,
                                      color: AppTheme.primaryBlue,
                                      width: 16,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ],
                                );
                              }),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Peak Hours Graph
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Peak Busy Hours', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        const Text('Crowd density curve over 24 hours', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        const SizedBox(height: 24),
                        SizedBox(
                          height: 200,
                          child: LineChart(
                            LineChartData(
                              gridData: const FlGridData(show: false),
                              titlesData: FlTitlesData(
                                show: true,
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    getTitlesWidget: (val, meta) {
                                      int idx = val.toInt();
                                      if (idx >= 0 && idx < analytics.peakHoursData.length) {
                                        return SideTitleWidget(
                                          axisSide: meta.axisSide,
                                          child: Text(analytics.peakHoursData[idx].label, style: const TextStyle(fontSize: 10)),
                                        );
                                      }
                                      return const SizedBox.shrink();
                                    },
                                  ),
                                ),
                                leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              ),
                              borderData: FlBorderData(show: false),
                              lineBarsData: [
                                LineChartBarData(
                                  spots: List.generate(analytics.peakHoursData.length, (i) {
                                    return FlSpot(i.toDouble(), analytics.peakHoursData[i].value);
                                  }),
                                  isCurved: true,
                                  color: AppTheme.aiAccent,
                                  barWidth: 3,
                                  isStrokeCapRound: true,
                                  dotData: const FlDotData(show: false),
                                  belowBarData: BarAreaData(
                                    show: true,
                                    color: AppTheme.aiAccent.withOpacity(0.2),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTabChip(String label, int index) {
    final isSelected = _selectedTab == index;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: AppTheme.primaryBlue,
      labelStyle: TextStyle(color: isSelected ? Colors.white : null, fontWeight: FontWeight.bold),
      onSelected: (_) => setState(() => _selectedTab = index),
    );
  }

  LocationAnalyticsModel _generateFallbackAnalytics(String locId) {
    return LocationAnalyticsModel(
      locationId: locId,
      dailyVisitors: [
        AnalyticsDataPoint(label: '8 AM', value: 20),
        AnalyticsDataPoint(label: '11 AM', value: 65),
        AnalyticsDataPoint(label: '2 PM', value: 90),
        AnalyticsDataPoint(label: '5 PM', value: 120),
        AnalyticsDataPoint(label: '8 PM', value: 70),
      ],
      weeklyVisitors: [
        AnalyticsDataPoint(label: 'Mon', value: 45),
        AnalyticsDataPoint(label: 'Tue', value: 50),
        AnalyticsDataPoint(label: 'Wed', value: 60),
        AnalyticsDataPoint(label: 'Thu', value: 55),
        AnalyticsDataPoint(label: 'Fri', value: 110),
        AnalyticsDataPoint(label: 'Sat', value: 140),
        AnalyticsDataPoint(label: 'Sun', value: 130),
      ],
      monthlyVisitors: [
        AnalyticsDataPoint(label: 'W1', value: 420),
        AnalyticsDataPoint(label: 'W2', value: 510),
        AnalyticsDataPoint(label: 'W3', value: 480),
        AnalyticsDataPoint(label: 'W4', value: 620),
      ],
      averageQueueTime: 14.5,
      peakHoursData: [
        AnalyticsDataPoint(label: '6am', value: 10),
        AnalyticsDataPoint(label: '9am', value: 40),
        AnalyticsDataPoint(label: '12pm', value: 85),
        AnalyticsDataPoint(label: '3pm', value: 60),
        AnalyticsDataPoint(label: '6pm', value: 95),
        AnalyticsDataPoint(label: '9pm', value: 30),
      ],
    );
  }
}
