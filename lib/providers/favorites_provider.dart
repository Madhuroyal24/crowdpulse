import 'package:flutter/material.dart';
import '../services/firestore_service.dart';

class FavoritesProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();

  List<String> _favoriteLocationIds = [];

  List<String> get favoriteLocationIds => _favoriteLocationIds;

  void setFavorites(List<String> favs) {
    _favoriteLocationIds = favs;
    notifyListeners();
  }

  bool isFavorite(String locationId) {
    return _favoriteLocationIds.contains(locationId);
  }

  Future<void> toggleFavorite(String uid, String locationId) async {
    final currentlyFav = isFavorite(locationId);
    if (currentlyFav) {
      _favoriteLocationIds.remove(locationId);
    } else {
      _favoriteLocationIds.add(locationId);
    }
    notifyListeners();

    try {
      await _firestoreService.toggleFavorite(uid, locationId, !currentlyFav);
    } catch (e) {
      // Revert if error
      if (currentlyFav) {
        _favoriteLocationIds.add(locationId);
      } else {
        _favoriteLocationIds.remove(locationId);
      }
      notifyListeners();
    }
  }
}
