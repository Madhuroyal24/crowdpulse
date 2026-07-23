import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/location_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../models/location_model.dart';
import '../../config/theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final locationProvider = Provider.of<LocationProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final favoritesProvider = Provider.of<FavoritesProvider>(context);

    if (authProvider.userModel != null) {
      favoritesProvider.setFavorites(authProvider.userModel!.favoriteLocations);
    }

    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.bolt, color: AppTheme.primaryBlue, size: 20),
                const SizedBox(width: 4),
                Text(
                  'CrowdPulse',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.extrabold,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
            Text(
              authProvider.isAuthenticated
                  ? 'Hello, ${authProvider.userModel?.name ?? 'User'}'
                  : 'Avoid long queues & find best visit times',
              style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () => context.push('/notifications'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Category Filter Chips
          SizedBox(
            height: 50,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              itemCount: locationProvider.categories.length,
              itemBuilder: (context, index) {
                final category = locationProvider.categories[index];
                final isSelected = locationProvider.selectedCategory == category;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(category),
                    selected: isSelected,
                    selectedColor: AppTheme.primaryBlue.withOpacity(0.2),
                    checkmarkColor: AppTheme.primaryBlue,
                    labelStyle: TextStyle(
                      color: isSelected ? AppTheme.primaryBlue : theme.textTheme.bodyMedium?.color,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    onSelected: (_) => locationProvider.setCategory(category),
                  ),
                );
              },
            ),
          ),

          // Location Cards List
          Expanded(
            child: locationProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : locationProvider.locations.isEmpty
                    ? _buildEmptyState(context)
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: locationProvider.locations.length,
                        itemBuilder: (context, index) {
                          final location = locationProvider.locations[index];
                          final distance = locationProvider.calculateDistanceInKm(
                            location.latitude,
                            location.longitude,
                          );
                          final isFav = favoritesProvider.isFavorite(location.id);

                          return LocationCard(
                            location: location,
                            distanceInKm: distance,
                            isFavorite: isFav,
                            onFavoriteToggle: () {
                              if (authProvider.isAuthenticated) {
                                favoritesProvider.toggleFavorite(
                                  authProvider.firebaseUser!.uid,
                                  location.id,
                                );
                              } else {
                                context.push('/auth/login');
                              }
                            },
                            onTap: () => context.push('/location/${location.id}'),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.location_off_outlined, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          const Text('No venues found in this category.', style: TextStyle(fontSize: 16, color: Colors.grey)),
        ],
      ),
    );
  }
}

class LocationCard extends StatelessWidget {
  final LocationModel location;
  final double distanceInKm;
  final bool isFavorite;
  final VoidCallback onFavoriteToggle;
  final VoidCallback onTap;

  const LocationCard({
    super.key,
    required this.location,
    required this.distanceInKm,
    required this.isFavorite,
    required this.onFavoriteToggle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final crowdColor = AppTheme.getCrowdColor(location.currentCrowdLevel.label);
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Name, Category, Favorite
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          location.name,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${location.category} • ${location.address}',
                          style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: isFavorite ? Colors.red : Colors.grey,
                    ),
                    onPressed: onFavoriteToggle,
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Crowd Level & Wait Time Metrics
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: crowdColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: crowdColor, width: 1.5),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(color: crowdColor, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '${location.currentCrowdLevel.label} Crowd',
                          style: TextStyle(
                            color: crowdColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),

                  Row(
                    children: [
                      const Icon(Icons.timer_outlined, size: 18, color: Colors.blueAccent),
                      const SizedBox(width: 4),
                      Text(
                        'Current: ~${location.estimatedWaitTime}m wait',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Best Time To Visit Banner (Addresses User Requirement Directly!)
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.crowdLow.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.crowdLow.withOpacity(0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.stars_rounded, size: 18, color: AppTheme.crowdLow),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'BEST TIME TO VISIT',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.extrabold,
                              color: AppTheme.crowdLow,
                              letterSpacing: 0.5,
                            ),
                          ),
                          Text(
                            '${location.bestTimeToVisit} (Only ~${location.bestTimeWaitTime} min wait)',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, size: 18, color: Colors.grey),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
