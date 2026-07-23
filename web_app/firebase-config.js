// ============================================================
// CrowdPulse — Real-Time Web Database & Firebase Backend System v2.0
// Supports: Embedded IndexedDB Real-Time Database & Cloud Firestore
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDemoKeyForCrowdPulseWebPlatform2026",
  authDomain:        "crowdpulse-ai.firebaseapp.com",
  projectId:         "crowdpulse-ai",
  storageBucket:     "crowdpulse-ai.appspot.com",
  messagingSenderId: "987654321012",
  appId:             "1:987654321012:web:a1b2c3d4e5f67890",
  measurementId:     "G-XXXXXXXXXX"
};

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";
const FCM_VAPID_KEY       = "YOUR_FCM_VAPID_PUBLIC_KEY_HERE";

// Global Database Handles
let db        = null;
let auth      = null;
let storage   = null;
let messaging = null;
let functions = null;
let localDB   = null;
let dbChannel = null;

// ============================================================
// EMBEDDED INDEXEDDB REAL-TIME WEB DATABASE ENGINE
// ============================================================

const WebDatabase = {
  dbName: 'CrowdPulse_WebDB',
  version: 1,

  async init() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);

      req.onupgradeneeded = (e) => {
        const idb = e.target.result;

        if (!idb.objectStoreNames.contains('locations')) {
          const locStore = idb.createObjectStore('locations', { keyPath: 'id' });
          locStore.createIndex('category', 'category', { unique: false });
          locStore.createIndex('city', 'city', { unique: false });
        }

        if (!idb.objectStoreNames.contains('crowdReports')) {
          const reportStore = idb.createObjectStore('crowdReports', { keyPath: 'id' });
          reportStore.createIndex('locationId', 'locationId', { unique: false });
          reportStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!idb.objectStoreNames.contains('users')) {
          idb.createObjectStore('users', { keyPath: 'uid' });
        }

        if (!idb.objectStoreNames.contains('favorites')) {
          idb.createObjectStore('favorites', { keyPath: 'uid' });
        }

        if (!idb.objectStoreNames.contains('notifications')) {
          idb.createObjectStore('notifications', { keyPath: 'id' });
        }
      };

      req.onsuccess = (e) => {
        localDB = e.target.result;
        console.log('⚡ CrowdPulse: Embedded IndexedDB Web Database connected successfully!');

        // Setup real-time tab & device broadcast channel
        try {
          if ('BroadcastChannel' in window) {
            dbChannel = new BroadcastChannel('crowdpulse_db_channel');
            dbChannel.onmessage = (msg) => {
              console.log('📡 Real-Time Web DB Sync Event:', msg.data);
              if (window.onWebDBSync) window.onWebDBSync(msg.data);
            };
          }
        } catch(e) {}

        resolve(localDB);
      };

      req.onerror = (e) => {
        console.warn('IndexedDB error:', e.target.error);
        resolve(null);
      };
    });
  },

  async getAll(storeName) {
    if (!localDB) return [];
    return new Promise((resolve) => {
      const tx = localDB.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  async put(storeName, data) {
    if (!localDB) return;
    return new Promise((resolve, reject) => {
      const tx = localDB.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(data);
      req.onsuccess = () => {
        if (dbChannel) {
          dbChannel.postMessage({ type: 'put', storeName, data });
        }
        resolve(req.result);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async delete(storeName, key) {
    if (!localDB) return;
    return new Promise((resolve, reject) => {
      const tx = localDB.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => {
        if (dbChannel) {
          dbChannel.postMessage({ type: 'delete', storeName, key });
        }
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }
};

// ============================================================
// FIREBASE / CLOUD FIRESTORE INITIALIZATION
// ============================================================

function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem('cp_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        console.log('🔑 CrowdPulse: Using saved Firebase credentials:', parsed.projectId);
        return parsed;
      }
    }
  } catch(e) {}
  return FIREBASE_CONFIG;
}

(async function initDatabase() {
  // 1. Initialize embedded Web Database (IndexedDB)
  await WebDatabase.init();

  if (typeof firebase === 'undefined') {
    console.warn('⚠️ CrowdPulse: Firebase SDK not loaded. Running with IndexedDB Web Database.');
    return;
  }

  // Check if already initialized
  if (firebase.apps && firebase.apps.length > 0) {
    db      = firebase.firestore();
    auth    = firebase.auth();
    storage = firebase.storage ? firebase.storage() : null;
    console.log('✅ CrowdPulse: Firebase initialized');
    return;
  }

  try {
    const activeConfig = getActiveFirebaseConfig();
    const app = firebase.initializeApp(activeConfig);
    db        = firebase.firestore();
    auth      = firebase.auth();
    storage   = firebase.storage ? firebase.storage() : null;

    // Firestore Offline Persistence
    db.enablePersistence({ synchronizeTabs: true })
      .then(() => console.log('✅ CrowdPulse: Cloud Firestore offline persistence enabled'))
      .catch(err => console.warn('Firestore persistence warning:', err.code));

    // FCM Notifications
    if (typeof firebase.messaging !== 'undefined' && firebase.messaging.isSupported()) {
      try {
        messaging = firebase.messaging();
        messaging.getToken({ vapidKey: FCM_VAPID_KEY })
          .then(token => {
            if (token) {
              window._fcmToken = token;
              if (auth.currentUser) {
                db.collection('users').doc(auth.currentUser.uid)
                  .set({ fcmToken: token }, { merge: true })
                  .catch(() => {});
              }
            }
          }).catch(() => {});
      } catch(e) {}
    }

    console.log('✅ CrowdPulse: Cloud Firestore connected to project:', activeConfig.projectId);

  } catch (err) {
    console.info('ℹ️ Running in Local Web Database mode (IndexedDB Active)');
  }
})();

// ============================================================
// FIRESTORE & WEB DB HELPERS
// ============================================================

const Collections = {
  users:        () => db?.collection('users'),
  locations:    () => db?.collection('locations'),
  crowdReports: () => db?.collection('crowdReports'),
  favorites:    () => db?.collection('favorites'),
  notifications:() => db?.collection('notifications'),
  analytics:    () => db?.collection('analytics'),
};

/** Save location to both IndexedDB and Firestore */
async function saveLocationToDB(venue) {
  await WebDatabase.put('locations', venue);
  if (db) {
    db.collection('locations').doc(venue.id).set({
      name:              venue.name,
      category:          venue.category,
      address:           venue.address,
      city:              venue.city,
      latitude:          venue.lat,
      longitude:         venue.lng,
      currentCrowdLevel: venue.currentCrowd,
      predictedCrowd:    venue.predictedCrowd,
      waitingTime:       venue.waitTime,
      confidence:        venue.confidence,
      bestTimeToVisit:   venue.bestTimeToVisit,
      bestTimeWait:      venue.bestTimeWait,
      openHours:         venue.openHours || '9:00 AM – 5:00 PM',
      updatedAt:         firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).catch(console.warn);
  }
}

/** Save report to both IndexedDB and Firestore */
async function saveReportToDB(report) {
  await WebDatabase.put('crowdReports', report);
  if (db && auth?.currentUser) {
    db.collection('crowdReports').add({
      userId:      auth.currentUser.uid,
      userName:    report.user,
      locationId:  report.locationId || report.venueId,
      crowdLevel:  report.crowd,
      waitingTime: report.wait,
      comments:    report.comment || '',
      approved:    true,
      timestamp:   firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(console.warn);
  }
}

/** Save favorite toggle to IndexedDB and Firestore */
async function saveFavoriteToDB(uid, locationId, isFav) {
  const favData = { uid, locationId, isFav, updatedAt: Date.now() };
  await WebDatabase.put('favorites', favData);
  if (db && uid) {
    const favRef = db.collection('favorites').doc(uid);
    if (isFav) {
      favRef.set({ locationIds: firebase.firestore.FieldValue.arrayUnion(locationId) }, { merge: true }).catch(() => {});
    } else {
      favRef.set({ locationIds: firebase.firestore.FieldValue.arrayRemove(locationId) }, { merge: true }).catch(() => {});
    }
  }
}

/** Connect to custom Firebase project */
function saveAndConnectDatabase(config) {
  if (!config || !config.apiKey || !config.projectId) {
    throw new Error('API Key and Project ID are required');
  }
  localStorage.setItem('cp_firebase_config', JSON.stringify(config));
  window.location.reload();
}
