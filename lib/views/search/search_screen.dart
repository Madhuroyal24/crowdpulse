import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/location_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/favorites_provider.dart';
import '../home/home_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locationProvider = Provider.of<LocationProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final favoritesProvider = Provider.of<FavoritesProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Venues'),
      ),
      body: Column(
        children: [
          // Search Input Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => locationProvider.setSearchQuery(val),
              decoration: InputDecoration(
                hintText: 'Search by venue name, city, category...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          locationProvider.setSearchQuery('');
                        },
                      )
                    : null,
              ),
            ),
          ),

          // Search Results
          Expanded(
            child: locationProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : locationProvider.locations.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.search_off_rounded, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text('No matching venues found.', style: TextStyle(color: Colors.grey)),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
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
}
