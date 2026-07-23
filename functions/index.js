const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// ============================================================
// TRIGGER: New Crowd Report Created
// Updates venue crowd level + confidence + triggers FCM push
// ============================================================
exports.onCrowdReportCreated = functions.firestore
  .document("crowdReports/{reportId}")
  .onCreate(async (snapshot, context) => {
    const reportData = snapshot.data();
    const locationId = reportData.locationId;
    if (!locationId) return null;

    try {
      const locationRef = db.collection("locations").doc(locationId);
      const locationDoc = await locationRef.get();
      if (!locationDoc.exists) return null;

      const locData = locationDoc.data();

      // ── Fetch recent reports (last 4 hours) for AI weighting ────
      const fourHoursAgo = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 4 * 60 * 60 * 1000)
      );

      const recentReportsSnap = await db.collection("crowdReports")
        .where("locationId", "==", locationId)
        .where("timestamp", ">=", fourHoursAgo)
        .orderBy("timestamp", "desc")
        .limit(20)
        .get();

      let totalWeight        = 0;
      let weightedCrowdScore = 0;
      let weightedWaitTime   = 0;

      const now = new Date();
      const currentHour = now.getHours();
      const dayOfWeek   = now.getDay(); // 0=Sun

      recentReportsSnap.forEach((doc) => {
        const report     = doc.data();
        const reportTime = report.timestamp ? report.timestamp.toDate() : now;
        const minutesAgo = Math.max(1, (now - reportTime) / (1000 * 60));

        // Exponential recency decay: weight = e^(-t / 45)
        const weight = Math.exp(-minutesAgo / 45.0);

        const crowdMap = { "Low": 0.15, "Moderate": 0.50, "High": 0.80, "Very High": 0.97 };
        const crowdValue = crowdMap[report.crowdLevel] || 0.50;

        weightedCrowdScore += crowdValue * weight;
        weightedWaitTime   += (report.waitingTime || 10) * weight;
        totalWeight        += weight;
      });

      // ── Time-of-day heuristic ────────────────────────────────────
      // Peak times vary by venue category
      const category = locData.category || "General";
      const timeHeuristics = {
        "Bank / ATM":        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 0.8, 0.85, 0.65, 0.5, 0.45, 0.6, 0.7, 0.75, 0.5, 0.3, 0.1, 0.1, 0.1, 0.1],
        "Hospital":          [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.6, 0.8, 0.9, 0.85, 0.75, 0.65, 0.6, 0.55, 0.5, 0.6, 0.55, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
        "Supermarket":       [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.65, 0.55, 0.5, 0.65, 0.8, 0.85, 0.7, 0.5, 0.3, 0.15, 0.1],
        "Shopping Mall":     [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.25, 0.45, 0.65, 0.7, 0.65, 0.6, 0.65, 0.75, 0.85, 0.8, 0.6, 0.4, 0.2, 0.1],
        "Government Office": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 0.8, 0.85, 0.8, 0.7, 0.45, 0.6, 0.65, 0.6, 0.5, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1],
      };

      const profile   = timeHeuristics[category] || timeHeuristics["Government Office"];
      const timeScore = profile[Math.min(currentHour, 23)];

      // Weekend multiplier (Sat/Sun tend to be different)
      const weekendMult = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.8 : 1.0;
      const timeBaseScore = Math.min(1, timeScore * weekendMult);

      // ── Combine AI model + live reports ─────────────────────────
      let finalScore = timeBaseScore;
      let estWait    = Math.round(timeBaseScore * 30);
      let confidence = 0.72;

      if (totalWeight > 0) {
        const liveAverage = weightedCrowdScore / totalWeight;
        finalScore = (liveAverage * 0.70) + (timeBaseScore * 0.30);
        estWait    = Math.round((weightedWaitTime / totalWeight) * 0.75 + (finalScore * 25) * 0.25);
        confidence = Math.min(0.99, 0.78 + Math.min(0.18, totalWeight * 0.03));
      }

      let predictedLevel = "Low";
      if      (finalScore >= 0.80) predictedLevel = "Very High";
      else if (finalScore >= 0.58) predictedLevel = "High";
      else if (finalScore >= 0.35) predictedLevel = "Moderate";

      // ── Update venue document ────────────────────────────────────
      await locationRef.update({
        currentCrowdLevel:  reportData.crowdLevel || predictedLevel,
        predictedCrowd:     predictedLevel,
        predictedCrowdLevel: predictedLevel,
        estimatedWaitTime:  Math.max(2, estWait),
        waitingTime:        Math.max(2, estWait),
        confidence:         Number(confidence.toFixed(2)),
        updatedAt:          admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`[AI] ${locData.name}: ${predictedLevel} crowd, ~${estWait}min, confidence ${confidence.toFixed(2)}`);

      // ── Send FCM Push Notification for significant crowd changes ─
      const prevLevel = locData.currentCrowdLevel || "Moderate";
      const levelOrder = { "Low": 0, "Moderate": 1, "High": 2, "Very High": 3 };

      if (levelOrder[reportData.crowdLevel] >= 2 && levelOrder[prevLevel] < 2) {
        // Crowd went to High / Very High
        const payload = {
          notification: {
            title: `⚠️ High Crowd: ${locData.name}`,
            body:  `Currently ${reportData.crowdLevel} crowd (~${estWait} min wait). Best time: ${locData.bestTimeToVisit || "off-peak hours"}.`,
          },
          data: {
            locationId,
            type:  "crowd_alert",
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
          topic: `location_${locationId}`,
        };
        await messaging.send(payload);
        console.log(`[FCM] High crowd alert sent for ${locData.name}`);

      } else if (levelOrder[prevLevel] >= 2 && levelOrder[predictedLevel] === 0) {
        // Crowd dropped back to Low
        const payload = {
          notification: {
            title: `✅ Queue Cleared: ${locData.name}`,
            body:  `Crowd is now Low (~${estWait} min wait). Great time to visit!`,
          },
          data: { locationId, type: "queue_drop" },
          topic: `location_${locationId}`,
        };
        await messaging.send(payload);
        console.log(`[FCM] Queue drop alert sent for ${locData.name}`);
      }

      // ── Increment user's report count ────────────────────────────
      if (reportData.userId) {
        db.collection("users").doc(reportData.userId)
          .update({ reports: admin.firestore.FieldValue.increment(1) })
          .catch(() => {});
      }

      return { success: true, predictedLevel, estWait, confidence };

    } catch (err) {
      console.error("Error in onCrowdReportCreated:", err);
      return null;
    }
  });


// ============================================================
// CALLABLE: Real-time AI Crowd Forecast for a location
// ============================================================
exports.predictCrowd = functions.https.onCall(async (data, context) => {
  const { locationId } = data;
  if (!locationId) {
    throw new functions.https.HttpsError("invalid-argument", "locationId is required.");
  }

  const doc = await db.collection("locations").doc(locationId).get();
  if (!doc.exists) {
    throw new functions.https.HttpsError("not-found", "Location not found.");
  }

  const loc = doc.data();
  return {
    locationId,
    name:               loc.name,
    currentCrowdLevel:  loc.currentCrowdLevel,
    predictedCrowd:     loc.predictedCrowd || loc.predictedCrowdLevel,
    estimatedWaitTime:  loc.estimatedWaitTime || loc.waitingTime,
    bestTimeToVisit:    loc.bestTimeToVisit,
    bestTimeWait:       loc.bestTimeWait,
    confidence:         loc.confidence,
    updatedAt:          loc.updatedAt,
  };
});


// ============================================================
// HTTP: Admin — Send push notification to all users on topic
// ============================================================
exports.sendAdminNotification = functions.https.onCall(async (data, context) => {
  // Must be admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admin access required.");
  }

  const { title, body, target, type } = data;
  if (!title || !body) {
    throw new functions.https.HttpsError("invalid-argument", "title and body are required.");
  }

  const payload = {
    notification: { title, body },
    data: { type: type || "info" },
    topic: target === "all" ? "all_users" : target,
  };

  await messaging.send(payload);

  // Log notification in Firestore
  await db.collection("admin").doc("sentNotifications").collection("items").add({
    title, body, target,
    sentAt: admin.firestore.FieldValue.serverTimestamp(),
    sentBy: context.auth.uid,
  });

  return { success: true };
});


// ============================================================
// SCHEDULED: Recalculate AI crowd levels every 30 minutes
// Updates all venues based on time-of-day model even when
// no new reports come in
// ============================================================
exports.scheduledCrowdRefresh = functions.pubsub
  .schedule("every 30 minutes")
  .onRun(async (context) => {
    const locationsSnap = await db.collection("locations").get();

    const now         = new Date();
    const currentHour = now.getHours();
    const dayOfWeek   = now.getDay();

    const batch = db.batch();
    let updated = 0;

    locationsSnap.forEach(doc => {
      const loc = doc.data();

      // Skip if recently updated by a real report (within 30 min)
      if (loc.updatedAt) {
        const lastUpdate = loc.updatedAt.toDate ? loc.updatedAt.toDate() : new Date(0);
        if ((now - lastUpdate) < 28 * 60 * 1000) return; // recently updated
      }

      // Simple time-based model
      const timeHeuristics = {
        "Bank / ATM":        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 0.8, 0.85, 0.65, 0.5, 0.45, 0.6, 0.7, 0.75, 0.5, 0.3, 0.1, 0.1, 0.1, 0.1],
        "Hospital":          [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.6, 0.8, 0.9, 0.85, 0.75, 0.65, 0.6, 0.55, 0.5, 0.6, 0.55, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
        "Supermarket":       [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.65, 0.55, 0.5, 0.65, 0.8, 0.85, 0.7, 0.5, 0.3, 0.15, 0.1],
        "Shopping Mall":     [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.25, 0.45, 0.65, 0.7, 0.65, 0.6, 0.65, 0.75, 0.85, 0.8, 0.6, 0.4, 0.2, 0.1],
        "Government Office": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 0.8, 0.85, 0.8, 0.7, 0.45, 0.6, 0.65, 0.6, 0.5, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1],
      };

      const profile    = timeHeuristics[loc.category] || [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.5, 0.6, 0.7, 0.7, 0.65, 0.6, 0.55, 0.55, 0.6, 0.65, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2];
      const timeScore  = profile[currentHour];
      const weekMult   = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.8 : 1.0;
      const finalScore = Math.min(1, timeScore * weekMult);

      let predictedLevel = "Low";
      if      (finalScore >= 0.80) predictedLevel = "Very High";
      else if (finalScore >= 0.58) predictedLevel = "High";
      else if (finalScore >= 0.35) predictedLevel = "Moderate";

      const estWait = Math.round(finalScore * 35);

      batch.update(doc.ref, {
        predictedCrowd:      predictedLevel,
        predictedCrowdLevel: predictedLevel,
        estimatedWaitTime:   Math.max(2, estWait),
        confidence:          0.75,
        updatedAt:           admin.firestore.FieldValue.serverTimestamp(),
      });

      updated++;
    });

    await batch.commit();
    console.log(`[Scheduled] AI crowd refresh complete. ${updated} venues updated.`);
    return null;
  });


// ============================================================
// AUTH TRIGGER: Set custom claims for admin users
// Admin emails defined in Firestore: admin/settings.adminEmails
// ============================================================
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    const adminSettingsDoc = await db.collection("admin").doc("settings").get();
    const adminEmails = adminSettingsDoc.exists
      ? (adminSettingsDoc.data().adminEmails || [])
      : [];

    if (adminEmails.includes(user.email)) {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`[Auth] Admin claim set for ${user.email}`);
    }

    // Create user document in Firestore
    await db.collection("users").doc(user.uid).set({
      uid:          user.uid,
      name:         user.displayName || user.email?.split("@")[0] || "User",
      email:        user.email || "",
      profileImage: user.photoURL || "",
      createdAt:    admin.firestore.FieldValue.serverTimestamp(),
      reports:      0,
      role:         adminEmails.includes(user.email) ? "admin" : "user",
    }, { merge: true });

  } catch (err) {
    console.error("[Auth] onUserCreated error:", err);
  }
});
