import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../views/auth/login_screen.dart';
import '../views/auth/register_screen.dart';
import '../views/auth/forgot_password_screen.dart';
import '../views/main_navigation_wrapper.dart';
import '../views/location_detail/location_detail_screen.dart';
import '../views/report/report_crowd_screen.dart';
import '../views/analytics/analytics_screen.dart';

class AppRouter {
  static GoRouter createRouter(BuildContext context) {
    return GoRouter(
      initialLocation: '/',
      redirect: (BuildContext context, GoRouterState state) {
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        final bool loggedIn = authProvider.isAuthenticated;
        final bool isLoggingIn = state.matchedLocation.startsWith('/auth');

        // Allow guest browsing or redirect to login if unauthenticated
        if (!loggedIn && !isLoggingIn) {
          // Keep accessible or redirect to login
          return null;
        }

        if (loggedIn && isLoggingIn) {
          return '/';
        }

        return null;
      },
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const MainNavigationWrapper(),
        ),
        GoRoute(
          path: '/auth/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/auth/register',
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(
          path: '/auth/forgot-password',
          builder: (context, state) => const ForgotPasswordScreen(),
        ),
        GoRoute(
          path: '/location/:id',
          builder: (context, state) {
            final locationId = state.pathParameters['id'] ?? '';
            return LocationDetailScreen(locationId: locationId);
          },
        ),
        GoRoute(
          path: '/report/:id',
          builder: (context, state) {
            final locationId = state.pathParameters['id'] ?? '';
            final locationName = state.extra as String? ?? 'Venue';
            return ReportCrowdScreen(locationId: locationId, locationName: locationName);
          },
        ),
        GoRoute(
          path: '/analytics/:id',
          builder: (context, state) {
            final locationId = state.pathParameters['id'] ?? '';
            return AnalyticsScreen(locationId: locationId);
          },
        ),
      ],
    );
  }
}
