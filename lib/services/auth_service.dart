import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Stream of currentUser
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  // Sign In with Email & Password
  Future<UserCredential> signInWithEmail(String email, String password) async {
    final credential = await _auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password.trim(),
    );
    if (credential.user != null) {
      await _db.collection('users').doc(credential.user!.uid).update({
        'lastLogin': FieldValue.serverTimestamp(),
      });
    }
    return credential;
  }

  // Register with Email & Password
  Future<UserCredential> registerWithEmail({
    required String name,
    required String email,
    required String password,
    String phone = '',
  }) async {
    final credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password.trim(),
    );

    if (credential.user != null) {
      final userModel = UserModel(
        uid: credential.user!.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        profileImage: '',
        createdAt: DateTime.now(),
        lastLogin: DateTime.now(),
        favoriteLocations: [],
        notificationEnabled: true,
      );

      await _db.collection('users').doc(credential.user!.uid).set(userModel.toMap());
      await credential.user!.updateDisplayName(name);
    }
    return credential;
  }

  // Send Password Reset Email
  Future<void> sendPasswordResetEmail(String email) async {
    await _auth.sendPasswordResetEmail(email: email.trim());
  }

  // Fetch User Document
  Future<UserModel?> getUserProfile(String uid) async {
    final doc = await _db.collection('users').doc(uid).get();
    if (doc.exists && doc.data() != null) {
      return UserModel.fromMap(doc.data()!, doc.id);
    }
    return null;
  }

  // Stream User Profile
  Stream<UserModel?> streamUserProfile(String uid) {
    return _db.collection('users').doc(uid).snapshots().map((snapshot) {
      if (snapshot.exists && snapshot.data() != null) {
        return UserModel.fromMap(snapshot.data()!, snapshot.id);
      }
      return null;
    });
  }

  // Update Profile
  Future<void> updateUserProfile(String uid, {String? name, String? phone, String? profileImage, bool? notificationEnabled}) async {
    final Map<String, dynamic> updates = {};
    if (name != null) updates['name'] = name;
    if (phone != null) updates['phone'] = phone;
    if (profileImage != null) updates['profileImage'] = profileImage;
    if (notificationEnabled != null) updates['notificationEnabled'] = notificationEnabled;

    if (updates.isNotEmpty) {
      await _db.collection('users').doc(uid).update(updates);
    }
  }

  // Sign Out
  Future<void> signOut() async {
    await _auth.signOut();
  }
}
