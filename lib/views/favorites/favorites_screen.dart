import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/location_provider.dart';
import '../../providers/auth_provider.dart';
import '../home/home_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final locationProvider = Provider.of<LocationProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    final favLocations = locationProvider.locations
        .where((loc) => favoritesProvider.isFavorite(loc.id))
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Favorites'),
      ),
      body: !authProvider.isAuthenticated
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.favorite_border, size: 64, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text('Sign in to view and save your favorite venues.', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.push('/auth/login'),
                    child: const Text('Sign In'),
                  ),
                ],
              ),
            )
          : favLocations.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.favorite_outline, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('No favorite places saved yet.', style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: favLocations.length,
                  itemBuilder: (context, index) {
                    final location = favLocations[index];
                    final distance = locationProvider.calculateDistanceInKm(
                      location.latitude,
                      location.longitude,
                    );

                    return LocationCard(
                      location: location,
                      distanceInKm: distance,
                      isFavorite: true,
                      onFavoriteToggle: () {
                        favoritesProvider.toggleFavorite(
                          authProvider.firebaseUser!.uid,
                          location.id,
                        );
                      },
                      onTap: () => context.push('/location/${location.id}'),
                    );
                  },
                ),
    );
  }
}
