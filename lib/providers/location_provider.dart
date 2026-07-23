import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../models/location_model.dart';
import '../services/firestore_service.dart';

class LocationProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();

  List<LocationModel> _locations = [];
  bool _isLoading = true;
  String _selectedCategory = 'All';
  String _searchQuery = '';
  Position? _userPosition;

  StreamSubscription<List<LocationModel>>? _subscription;

  List<LocationModel> get locations => _filteredLocations();
  bool get isLoading => _isLoading;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  Position? get userPosition => _userPosition;

  final List<String> categories = [
    'All',
    'Supermarket',
    'Hospital',
    'Shopping Mall',
    'Restaurant',
    'Bank / ATM',
    'Airport',
    'Transit Center'
  ];

  LocationProvider() {
    _init();
  }

  void _init() {
    _fetchUserLocation();
    _subscribeToLocations();
  }

  void _subscribeToLocations() {
    _isLoading = true;
    notifyListeners();

    _subscription?.cancel();
    _subscription = _firestoreService.streamLocations(
      category: _selectedCategory,
      searchQuery: _searchQuery,
    ).listen((data) {
      _locations = data;
      _isLoading = false;
      notifyListeners();
    }, onError: (err) {
      _isLoading = false;
      notifyListeners();
    });
  }

  Future<void> _fetchUserLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }
      if (permission == LocationPermission.deniedForever) return;

      _userPosition = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
      );
      notifyListeners();
    } catch (_) {}
  }

  void setCategory(String category) {
    if (_selectedCategory == category) return;
    _selectedCategory = category;
    _subscribeToLocations();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    _subscribeToLocations();
  }

  double calculateDistanceInKm(double destLat, double destLng) {
    if (_userPosition == null) return 1.5; // fallback default
    double distanceInMeters = Geolocator.distanceBetween(
      _userPosition!.latitude,
      _userPosition!.longitude,
      destLat,
      destLng,
    );
    return distanceInMeters / 1000.0;
  }

  List<LocationModel> _filteredLocations() {
    return _locations;
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
