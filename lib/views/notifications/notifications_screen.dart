import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../services/firestore_service.dart';
import '../../providers/auth_provider.dart';
import '../../models/notification_model.dart';
import '../../config/theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final firestoreService = FirestoreService();

    if (!authProvider.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('Notifications')),
        body: const Center(child: Text('Sign in to view your notification inbox.')),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: StreamBuilder<List<AppNotificationModel>>(
        stream: firestoreService.streamUserNotifications(authProvider.firebaseUser!.uid),
        builder: (context, snapshot) {
          final notifications = snapshot.data ?? [];

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (notifications.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.notifications_off_outlined, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No notifications yet.', style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: notifications.length,
            itemBuilder: (context, index) {
              final n = notifications[index];
              return Card(
                color: n.read ? null : AppTheme.primaryBlue.withOpacity(0.08),
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: AppTheme.primaryBlue.withOpacity(0.2),
                    child: const Icon(Icons.notifications_active, color: AppTheme.primaryBlue),
                  ),
                  title: Text(n.title, style: TextStyle(fontWeight: n.read ? FontWeight.normal : FontWeight.bold)),
                  subtitle: Text(n.message),
                  trailing: Text(
                    DateFormat('MMM d, h:mm a').format(n.createdAt),
                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                  onTap: () {
                    firestoreService.markNotificationRead(
                      authProvider.firebaseUser!.uid,
                      n.id,
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
