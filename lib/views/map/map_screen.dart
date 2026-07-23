import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/location_provider.dart';
import '../../models/location_model.dart';
import '../../config/theme.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  GoogleMapController? _mapController;
  LocationModel? _selectedLocation;

  static const CameraPosition _initialCamera = CameraPosition(
    target: LatLng(12.9716, 77.5946), // Bangalore City Center
    zoom: 12.0,
  );

  double _getHueForCrowdLevel(CrowdLevel level) {
    switch (level) {
      case CrowdLevel.low:
        return BitmapDescriptor.hueGreen;
      case CrowdLevel.moderate:
        return BitmapDescriptor.hueYellow;
      case CrowdLevel.high:
        return BitmapDescriptor.hueRed;
    }
  }

  @override
  Widget build(BuildContext context) {
    final locationProvider = Provider.of<LocationProvider>(context);
    final locations = locationProvider.locations;

    final Set<Marker> markers = locations.map((loc) {
      final hue = _getHueForCrowdLevel(loc.currentCrowdLevel);
      return Marker(
        markerId: MarkerId(loc.id),
        position: LatLng(loc.latitude, loc.longitude),
        icon: BitmapDescriptor.defaultMarkerWithHue(hue),
        infoWindow: InfoWindow(
          title: loc.name,
          snippet: '${loc.currentCrowdLevel.label} Crowd • Best Time: ${loc.bestTimeToVisit}',
        ),
        onTap: () {
          setState(() {
            _selectedLocation = loc;
          });
        },
      );
    }).toSet();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Crowd Heatmap'),
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: () {
              if (locationProvider.userPosition != null && _mapController != null) {
                _mapController!.animateCamera(
                  CameraUpdate.newLatLngZoom(
                    LatLng(
                      locationProvider.userPosition!.latitude,
                      locationProvider.userPosition!.longitude,
                    ),
                    14.0,
                  ),
                );
              }
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: _initialCamera,
            markers: markers,
            myLocationEnabled: false, // Prevents location permission error on web without HTTPS
            myLocationButtonEnabled: false,
            zoomControlsEnabled: false,
            onMapCreated: (controller) {
              _mapController = controller;
              if (locations.isNotEmpty) {
                _mapController!.animateCamera(
                  CameraUpdate.newLatLngZoom(
                    LatLng(locations.first.latitude, locations.first.longitude),
                    13.0,
                  ),
                );
              }
            },
          ),

          // Map Legend Badge
          Positioned(
            top: 16,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)],
              ),
              child: Row(
                children: [
                  _buildLegendItem(AppTheme.crowdLow, 'Low'),
                  const SizedBox(width: 12),
                  _buildLegendItem(AppTheme.crowdModerate, 'Moderate'),
                  const SizedBox(width: 12),
                  _buildLegendItem(AppTheme.crowdHigh, 'High'),
                ],
              ),
            ),
          ),

          // Selected Location Sheet
          if (_selectedLocation != null)
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: _buildLocationSheet(_selectedLocation!),
            ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Row(
      children: [
        Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildLocationSheet(LocationModel loc) {
    final crowdColor = AppTheme.getCrowdColor(loc.currentCrowdLevel.label);

    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(loc.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text('${loc.category} • ${loc.address}', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => setState(() => _selectedLocation = null),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: crowdColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${loc.currentCrowdLevel.label} Density',
                    style: TextStyle(color: crowdColor, fontWeight: FontWeight.bold),
                  ),
                ),
                Text('Current Wait: ~${loc.estimatedWaitTime} mins', style: const TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '🌟 Best Visit Window: ${loc.bestTimeToVisit} (~${loc.bestTimeWaitTime}m wait)',
              style: const TextStyle(color: AppTheme.crowdLow, fontWeight: FontWeight.bold, fontSize: 12),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => context.push('/location/${loc.id}'),
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryBlue, foregroundColor: Colors.white),
                child: const Text('View Full Analytics & AI Forecast'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
