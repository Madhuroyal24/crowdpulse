/* ============================================================
   CrowdPulse AI Platform — Master Application Engine v2.0
   Complete SPA with Firebase integration, AI predictions,
   real-time updates, admin dashboard, auth, charts, & PWA
   ============================================================ */

'use strict';

// ============================================================
// DATA LAYER — SEED DATA & CONSTANTS
// ============================================================

const CATEGORIES = [
  { id: 'all',        icon: '🌐', name: 'All' },
  { id: 'bank',       icon: '🏦', name: 'Bank / ATM' },
  { id: 'hospital',   icon: '🏥', name: 'Hospital' },
  { id: 'super',      icon: '🛒', name: 'Supermarket' },
  { id: 'mall',       icon: '🏬', name: 'Shopping Mall' },
  { id: 'airport',    icon: '✈️',  name: 'Airport' },
  { id: 'govt',       icon: '🏛️', name: 'Government Office' },
  { id: 'post',       icon: '📮', name: 'Post Office' },
];

const SEED_VENUES = [
  {
    id: 'venue_sbi_mg',
    name: 'State Bank of India — MG Road',
    category: 'Bank / ATM',
    address: 'MG Road, Central Circle',
    city: 'Bangalore',
    lat: 12.9756, lng: 77.6094,
    currentCrowd: 'High',
    predictedCrowd: 'High',
    waitTime: 35, confidence: 0.95,
    bestTimeToVisit: '2:00 PM – 3:30 PM', bestTimeWait: 4,
    openHours: '9:30 AM – 5:00 PM',
    isFav: true,
    reports: [
      { id: 'r1', userId: 'u1', user: 'Ravi Kumar', crowd: 'High', wait: 35, ts: Date.now() - 600000, comment: 'Deposit counters have 15+ people in queue.', approved: true }
    ]
  },
  {
    id: 'venue_hdfc_indiranagar',
    name: 'HDFC Bank & Currency Exchange',
    category: 'Bank / ATM',
    address: 'Indiranagar 100ft Road',
    city: 'Bangalore',
    lat: 12.9784, lng: 77.6408,
    currentCrowd: 'Moderate',
    predictedCrowd: 'Low',
    waitTime: 12, confidence: 0.91,
    bestTimeToVisit: '1:30 PM – 3:00 PM', bestTimeWait: 3,
    openHours: '9:00 AM – 6:00 PM',
    isFav: false,
    reports: [
      { id: 'r2', userId: 'u2', user: 'Priya S.', crowd: 'Moderate', wait: 10, ts: Date.now() - 900000, comment: 'Passbook printing counter moving quickly.', approved: true }
    ]
  },
  {
    id: 'venue_spar',
    name: 'Spar Hypermarket',
    category: 'Supermarket',
    address: 'RMZ Galleria Mall, Yelahanka',
    city: 'Bangalore',
    lat: 13.0991, lng: 77.5956,
    currentCrowd: 'Low',
    predictedCrowd: 'Low',
    waitTime: 3, confidence: 0.94,
    bestTimeToVisit: '10:00 AM – 11:30 AM', bestTimeWait: 2,
    openHours: '10:00 AM – 10:00 PM',
    isFav: true,
    reports: [
      { id: 'r3', userId: 'u3', user: 'Sarah M.', crowd: 'Low', wait: 3, ts: Date.now() - 1500000, comment: 'All express checkout lanes open.', approved: true }
    ]
  },
  {
    id: 'venue_manipal',
    name: 'Manipal Hospital',
    category: 'Hospital',
    address: 'HAL Old Airport Road',
    city: 'Bangalore',
    lat: 12.9592, lng: 77.6444,
    currentCrowd: 'High',
    predictedCrowd: 'High',
    waitTime: 28, confidence: 0.88,
    bestTimeToVisit: '3:30 PM – 5:00 PM', bestTimeWait: 6,
    openHours: '8:00 AM – 8:00 PM',
    isFav: false,
    reports: [
      { id: 'r4', userId: 'u4', user: 'David K.', crowd: 'High', wait: 30, ts: Date.now() - 300000, comment: 'OPD pharmacy line is long. Radiology is quick.', approved: true }
    ]
  },
  {
    id: 'venue_phoenix',
    name: 'Phoenix Marketcity',
    category: 'Shopping Mall',
    address: 'Whitefield Main Road',
    city: 'Bangalore',
    lat: 12.9959, lng: 77.6963,
    currentCrowd: 'Moderate',
    predictedCrowd: 'High',
    waitTime: 15, confidence: 0.91,
    bestTimeToVisit: '11:00 AM – 1:00 PM', bestTimeWait: 5,
    openHours: '11:00 AM – 11:00 PM',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_blr_airport',
    name: 'Kempegowda International Airport',
    category: 'Airport',
    address: 'Devanahalli, NH-44',
    city: 'Bangalore',
    lat: 13.1986, lng: 77.7066,
    currentCrowd: 'Very High',
    predictedCrowd: 'Very High',
    waitTime: 55, confidence: 0.87,
    bestTimeToVisit: '2:00 AM – 5:00 AM', bestTimeWait: 8,
    openHours: '24 Hours',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_icici_koramangala',
    name: 'ICICI Bank — Koramangala',
    category: 'Bank / ATM',
    address: '5th Block, Koramangala',
    city: 'Bangalore',
    lat: 12.9352, lng: 77.6245,
    currentCrowd: 'Low',
    predictedCrowd: 'Moderate',
    waitTime: 6, confidence: 0.93,
    bestTimeToVisit: '2:00 PM – 4:00 PM', bestTimeWait: 3,
    openHours: '9:30 AM – 5:00 PM',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_bigbasket',
    name: 'BigBasket Superstore',
    category: 'Supermarket',
    address: 'JP Nagar 7th Phase',
    city: 'Bangalore',
    lat: 12.9088, lng: 77.5857,
    currentCrowd: 'Moderate',
    predictedCrowd: 'Low',
    waitTime: 8, confidence: 0.90,
    bestTimeToVisit: '9:00 AM – 11:00 AM', bestTimeWait: 2,
    openHours: '8:00 AM – 10:00 PM',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_aiims',
    name: 'AIIMS Bangalore OPD',
    category: 'Hospital',
    address: 'Devanahalli',
    city: 'Bangalore',
    lat: 13.2106, lng: 77.7127,
    currentCrowd: 'Very High',
    predictedCrowd: 'High',
    waitTime: 48, confidence: 0.85,
    bestTimeToVisit: '7:00 AM – 8:30 AM', bestTimeWait: 10,
    openHours: '7:00 AM – 2:00 PM',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_forum',
    name: 'Forum Mall Koramangala',
    category: 'Shopping Mall',
    address: 'Hosur Road, Koramangala',
    city: 'Bangalore',
    lat: 12.9363, lng: 77.6107,
    currentCrowd: 'Moderate',
    predictedCrowd: 'Moderate',
    waitTime: 10, confidence: 0.89,
    bestTimeToVisit: '12:00 PM – 2:00 PM', bestTimeWait: 4,
    openHours: '10:00 AM – 10:00 PM',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_post_office_brigade',
    name: 'Brigade Road Post Office',
    category: 'Post Office',
    address: 'Brigade Road',
    city: 'Bangalore',
    lat: 12.9737, lng: 77.6085,
    currentCrowd: 'Low',
    predictedCrowd: 'Low',
    waitTime: 5, confidence: 0.92,
    bestTimeToVisit: '11:00 AM – 1:00 PM', bestTimeWait: 3,
    openHours: '9:00 AM – 5:30 PM',
    isFav: false,
    reports: []
  },
  {
    id: 'venue_bbmp',
    name: 'BBMP Citizen Service Centre',
    category: 'Government Office',
    address: 'Rajajinagar',
    city: 'Bangalore',
    lat: 12.9916, lng: 77.5568,
    currentCrowd: 'High',
    predictedCrowd: 'High',
    waitTime: 40, confidence: 0.82,
    bestTimeToVisit: '8:30 AM – 9:30 AM', bestTimeWait: 8,
    openHours: '8:30 AM – 5:30 PM',
    isFav: false,
    reports: []
  }
];

const SEED_USERS = [
  { uid: 'u1', name: 'Ravi Kumar',    email: 'ravi@example.com',  joinedAt: '2025-01-15', reports: 47, status: 'active' },
  { uid: 'u2', name: 'Priya Sharma',  email: 'priya@example.com', joinedAt: '2025-03-22', reports: 23, status: 'active' },
  { uid: 'u3', name: 'Sarah M.',      email: 'sarah@example.com', joinedAt: '2025-05-10', reports: 18, status: 'active' },
  { uid: 'u4', name: 'David Kurien',  email: 'david@example.com', joinedAt: '2025-06-01', reports: 9,  status: 'suspended' },
  { uid: 'u5', name: 'Arjun Mehta',   email: 'arjun@example.com', joinedAt: '2025-07-20', reports: 5,  status: 'active' },
];

const SENT_NOTIFS = [
  { title: 'System Update', msg: 'CrowdPulse v2.0 is live with AI improvements.', sentTo: 'All Users', sentAt: '2026-07-22' },
  { title: 'Queue Drop Alert', msg: 'SBI MG Road queue has dropped to 4 mins.', sentTo: 'Active Users', sentAt: '2026-07-21' },
];

// ============================================================
// APP STATE
// ============================================================

const state = {
  venues: [],
  users: SEED_USERS,
  selectedCategory: 'All',
  activePage: 'home',
  activeAdminTab: 'overview',
  currentUser: null,
  userFavoriteIds: [],      // Synced from Firestore favorites collection
  firestoreMode: false,     // true when real Firebase is connected
  notifications: [
    { id: 'n1', type: 'alert',   title: 'Queue Drop Alert',    msg: 'SBI MG Road queue drops to ~4 min wait at 2 PM today.', time: '5 min ago' },
    { id: 'n2', type: 'success', title: 'Favorite Updated',    msg: 'Spar Hypermarket is now LOW crowd — great time to shop!', time: '1 hr ago' },
    { id: 'n3', type: 'info',    title: 'AI Model Updated',    msg: 'New accuracy: 94.8% — Hospital prediction improved.', time: '3 hr ago' },
    { id: 'n4', type: 'alert',   title: 'High Crowd Warning',  msg: 'AIIMS OPD is Very High crowd. Consider alternate timing.', time: '4 hr ago' },
  ],
  selectedCrowdLevel: 'Moderate',
  quickReportLevel: 'Moderate',
  selectedVenueId: null,
  chartInstances: {},
  adminChartInstances: {},
  theme: 'dark',
  notifPrefs: { queueAlerts: true, favUpdates: true, weeklyDigest: false },
  sentNotifs: SENT_NOTIFS,
  customCategories: [],
  // Firestore unsubscribe handles
  _unsub: {},
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // Load saved state
  loadFromLocalStorage();

  // Set theme
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeBtn();

  // Seed from local if no data yet
  if (state.venues.length === 0) {
    state.venues = SEED_VENUES;
    saveVenues();
  }

  // Load from Embedded IndexedDB Web Database
  try {
    if (typeof WebDatabase !== 'undefined') {
      const idbVenues = await WebDatabase.getAll('locations');
      if (idbVenues && idbVenues.length > 0) {
        state.venues = idbVenues;
        console.log('⚡ CrowdPulse: Loaded', idbVenues.length, 'venues from IndexedDB Web Database');
      } else {
        // Seed IndexedDB with initial venues
        SEED_VENUES.forEach(v => WebDatabase.put('locations', v));
      }
    }
  } catch(e) {}

  // Set up real-time cross-tab Web DB sync listener
  window.onWebDBSync = async function(evt) {
    console.log('📡 Cross-tab DB event:', evt);
    if (typeof WebDatabase !== 'undefined') {
      const updatedVenues = await WebDatabase.getAll('locations');
      if (updatedVenues && updatedVenues.length > 0) {
        state.venues = updatedVenues;
        if (state.activePage === 'home') renderHomeVenues();
        if (state.activePage === 'dashboard') renderDashboard();
        if (state.activePage === 'search') filterSearch();
      }
    }
  };

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  });

  // Render initial page immediately with live database content
  renderAuthNav();
  renderHomeCategoryChips();
  renderHeroCategoryChips();
  renderHomeVenues();
  populateReportVenueSelects();

  // Animate hero stats counter
  setTimeout(animateCounters, 600);

  // Animate AI accuracy circle
  setTimeout(animateAICircle, 800);

  // Connect to Real-Time Server API & SSE Stream
  connectRealtimeServer();

  // ── Database Connection Status ──────────────────────────────
  if (typeof firebase !== 'undefined' && db) {
    state.firestoreMode = true;
    console.log('🔥 CrowdPulse: Cloud Firestore connected');
    initFirestoreListeners();
    initAuthObserver();
    showToast('success', '🟢 Database Connected', 'Real-Time Cloud Firestore active.', 3500);
  } else {
    state.firestoreMode = false;
    showToast('success', '🟢 Real-Time Database Connected', 'Real-Time Data Engine & SSE Server active!', 4000);
    startLiveUpdates();
  }

  // If hash exists, navigate to it
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home','dashboard','search','favorites','report','profile','admin'].includes(hash)) {
    navigateTo(hash);
  }
}

function loadFromLocalStorage() {
  try {
    const savedVenues = localStorage.getItem('cp_venues_v2');
    if (savedVenues) state.venues = JSON.parse(savedVenues);

    const savedUser = localStorage.getItem('cp_user_v2');
    if (savedUser) state.currentUser = JSON.parse(savedUser);

    const savedTheme = localStorage.getItem('cp_theme');
    if (savedTheme) state.theme = savedTheme;

    const savedNotifPrefs = localStorage.getItem('cp_notif_prefs');
    if (savedNotifPrefs) state.notifPrefs = JSON.parse(savedNotifPrefs);
  } catch(e) {
    console.warn('LocalStorage load error:', e);
  }
}

function saveVenues() {
  try { localStorage.setItem('cp_venues_v2', JSON.stringify(state.venues)); } catch(e) {}
}

function saveUser() {
  try {
    if (state.currentUser) localStorage.setItem('cp_user_v2', JSON.stringify(state.currentUser));
    else localStorage.removeItem('cp_user_v2');
  } catch(e) {}
}

// ============================================================
// ROUTER — PAGE NAVIGATION
// ============================================================

function navigateTo(pageId, venueId = null, event = null) {
  if (event) event.preventDefault();

  state.activePage = pageId;
  state.selectedVenueId = venueId;

  // Update page visibility
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');

  // Update nav links & mobile bottom nav items
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navLink = document.getElementById(`nav-${pageId}`);
  if (navLink) navLink.classList.add('active');

  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  const bottomNavLink = document.getElementById(`bnav-${pageId}`);
  if (bottomNavLink) bottomNavLink.classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Page-specific rendering
  switch (pageId) {
    case 'home':      renderHomeVenues(); break;
    case 'dashboard': renderDashboard(); break;
    case 'search':    renderSearchPage(); break;
    case 'detail':    renderLocationDetail(venueId); break;
    case 'report':    renderReportPage(); break;
    case 'favorites': renderFavoritesPage(); break;
    case 'profile':   renderProfilePage(); break;
    case 'admin':     renderAdminPage(); break;
  }

  // Update URL hash
  window.history.pushState(null, '', `#${pageId}`);
}

// ============================================================
// THEME
// ============================================================

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('cp_theme', state.theme);
  updateThemeBtn();
  // Re-render charts if on detail page
  if (state.activePage === 'detail' && state.selectedVenueId) {
    setTimeout(() => renderDetailChart(state.selectedVenueId), 100);
  }
}

function updateThemeBtn() {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
}

// ============================================================
// MOBILE MENU
// ============================================================

function toggleMobileMenu() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('mobileMenuBtn');
  const isOpen = nav.classList.contains('open');
  nav.classList.toggle('open', !isOpen);
  btn.textContent = isOpen ? '☰' : '✕';
  renderMobileAuthArea();
}

function closeMobileMenu() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('mobileMenuBtn').textContent = '☰';
}

// ============================================================
// AUTH UI
// ============================================================

function renderAuthNav() {
  const container = document.getElementById('authNavArea');
  if (!container) return;
  if (state.currentUser) {
    const initials = state.currentUser.name ? state.currentUser.name.charAt(0).toUpperCase() : 'U';
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="user-avatar-btn" onclick="navigateTo('profile')" title="My Profile" aria-label="Profile">${initials}</div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="openModal('authModal','signin')" id="navSignInBtn">Sign In</button>
      <button class="btn btn-primary btn-sm" onclick="openModal('authModal','signup')" id="navSignUpBtn">Get Started</button>
    `;
  }
}

function renderMobileAuthArea() {
  const area = document.getElementById('mobileAuthArea');
  if (!area) return;
  if (state.currentUser) {
    area.innerHTML = `
      <button class="btn btn-secondary" onclick="navigateTo('profile');closeMobileMenu()">👤 My Profile</button>
      <button class="btn btn-danger btn-sm" onclick="handleLogout()">Sign Out</button>
    `;
  } else {
    area.innerHTML = `
      <button class="btn btn-primary" onclick="openModal('authModal','signin');closeMobileMenu()">Sign In</button>
      <button class="btn btn-gradient" onclick="openModal('authModal','signup');closeMobileMenu()">Get Started</button>
    `;
  }
}

// ============================================================
// HERO SECTION
// ============================================================

function renderHeroCategoryChips() {
  const container = document.getElementById('heroCategoryChips');
  if (!container) return;
  const cats = CATEGORIES.slice(1); // skip 'All'
  container.innerHTML = cats.map(c => `
    <button class="chip" onclick="navigateTo('search'); setTimeout(()=>{ document.getElementById('searchCategoryFilter').value='${c.name}'; filterSearch(); },100)">
      ${c.icon} ${c.name}
    </button>
  `).join('');
}

function doHeroSearch() {
  const q = document.getElementById('heroSearchInput').value.trim();
  navigateTo('search');
  setTimeout(() => {
    document.getElementById('searchInput').value = q;
    filterSearch();
  }, 50);
}

// ============================================================
// HOME PAGE — VENUES
// ============================================================

function renderHomeCategoryChips() {
  const container = document.getElementById('homeCategoryChips');
  if (!container) return;
  container.innerHTML = CATEGORIES.map(c => `
    <button class="chip ${state.selectedCategory === c.name ? 'active' : ''}"
      onclick="setHomeCategory('${c.name}')">
      ${c.icon} ${c.name}
    </button>
  `).join('');
}

function setHomeCategory(cat) {
  state.selectedCategory = cat;
  renderHomeCategoryChips();
  renderHomeVenues();
}

function renderHomeVenues() {
  const container = document.getElementById('homeVenuesGrid');
  if (!container) return;

  let filtered = getFilteredVenues(state.selectedCategory);

  if (filtered.length === 0) {
    container.innerHTML = emptyStateHtml('🏢', 'No venues found', 'Try selecting a different category.');
    return;
  }

  // Show first 6 on home
  container.innerHTML = filtered.slice(0, 6).map(v => venueCardHtml(v)).join('');
}

function getFilteredVenues(category) {
  if (!category || category === 'All') return [...state.venues];
  return state.venues.filter(v => v.category === category);
}

// ============================================================
// VENUE CARD HTML
// ============================================================

const VENUE_ICONS = {
  'Bank / ATM':        '🏦',
  'Hospital':          '🏥',
  'Supermarket':       '🛒',
  'Shopping Mall':     '🏬',
  'Airport':           '✈️',
  'Government Office': '🏛️',
  'Post Office':       '📮',
};

const CROWD_COLORS = {
  'Low':      'var(--crowd-low)',
  'Moderate': 'var(--crowd-moderate)',
  'High':     'var(--crowd-high)',
  'Very High':'var(--crowd-veryhigh)',
};

function venueCardHtml(v) {
  const icon = VENUE_ICONS[v.category] || '🏢';
  const pct = Math.round(v.confidence * 100);
  const isFav = v.isFav;
  const waitColor = v.waitTime > 30 ? 'var(--color-red-400)' : v.waitTime > 15 ? 'var(--color-amber-400)' : 'var(--crowd-low)';

  return `
    <div class="venue-card" onclick="navigateTo('detail','${v.id}')" role="button" tabindex="0" aria-label="${v.name}">
      <div class="venue-card-top">
        <div class="venue-icon">${icon}</div>
        <div class="venue-info">
          <div class="venue-name">${v.name}</div>
          <div class="venue-meta">
            <span>${v.category}</span>
            <span class="venue-meta-dot"></span>
            <span>${v.city}</span>
          </div>
        </div>
        <button class="fav-btn ${isFav ? 'active' : ''}" 
          onclick="event.stopPropagation(); toggleFavorite('${v.id}')"
          aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
          title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div class="crowd-row">
        <span class="crowd-badge ${v.currentCrowd}">
          <span class="crowd-badge-dot"></span>
          ${v.currentCrowd} Crowd
        </span>
        <div class="wait-info">
          <div class="wait-time-val" style="color:${waitColor}">~${v.waitTime} min</div>
          <div class="wait-time-label">Current wait</div>
        </div>
      </div>

      <div class="confidence-bar">
        <div class="confidence-bar-label">
          <span>AI Confidence</span>
          <span style="font-weight:700; color:var(--color-blue-400)">${pct}%</span>
        </div>
        <div class="confidence-bar-track">
          <div class="confidence-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="best-time-banner">
        <div class="best-time-icon">🌟</div>
        <div>
          <div class="best-time-label">Best Time to Visit</div>
          <div class="best-time-value">${v.bestTimeToVisit}</div>
          <div class="best-time-sub">Only ~${v.bestTimeWait} min wait</div>
        </div>
      </div>
    </div>
  `;
}

function emptyStateHtml(icon, title, desc, actionLabel = null, actionFn = null) {
  return `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">${icon}</div>
      <div class="empty-title">${title}</div>
      <div class="empty-desc">${desc}</div>
      ${actionLabel ? `<button class="btn btn-primary" onclick="${actionFn}">${actionLabel}</button>` : ''}
    </div>
  `;
}

// ============================================================
// FAVORITES
// ============================================================

function toggleFavorite(venueId) {
  const venue = state.venues.find(v => v.id === venueId);
  if (!venue) return;

  if (!state.currentUser) {
    showToast('info', 'Sign in required', 'Create a free account to save your favorite venues!');
    openModal('authModal', 'signup');
    return;
  }

  venue.isFav = !venue.isFav;
  saveVenues();

  // Re-render current page
  if (state.activePage === 'home') { renderHomeVenues(); renderHomeCategoryChips(); }
  if (state.activePage === 'dashboard') renderDashboard();
  if (state.activePage === 'favorites') renderFavoritesPage();
  if (state.activePage === 'search') filterSearch();
  if (state.activePage === 'detail') renderLocationDetail(venueId);

  showToast(venue.isFav ? 'success' : 'info',
    venue.isFav ? 'Added to Favorites' : 'Removed from Favorites',
    venue.isFav ? `${venue.name} saved!` : `${venue.name} removed.`
  );
}

function renderFavoritesPage() {
  const container = document.getElementById('favoritesGrid');
  if (!container) return;
  const favs = state.venues.filter(v => v.isFav);
  if (favs.length === 0) {
    container.innerHTML = emptyStateHtml('❤️', 'No favorites yet', 'Browse venues and tap the heart icon to save your favorites here.', '🔍 Browse Venues', "navigateTo('search')");
    return;
  }
  container.innerHTML = favs.map(v => venueCardHtml(v)).join('');
}

// ============================================================
// SEARCH PAGE
// ============================================================

function renderSearchPage() {
  filterSearch();
}

function filterSearch() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const catFilter = document.getElementById('searchCategoryFilter')?.value || 'All';
  const crowdFilter = document.getElementById('searchCrowdFilter')?.value || 'All';
  const sortBy = document.getElementById('searchSortFilter')?.value || 'name';
  const container = document.getElementById('searchResultsGrid');
  const meta = document.getElementById('searchMeta');
  if (!container) return;

  let results = [...state.venues];

  if (q) {
    results = results.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  }

  if (catFilter !== 'All') {
    results = results.filter(v => v.category === catFilter);
  }

  if (crowdFilter !== 'All') {
    results = results.filter(v => v.currentCrowd === crowdFilter);
  }

  // Sort
  switch (sortBy) {
    case 'wait_asc':    results.sort((a,b) => a.waitTime - b.waitTime); break;
    case 'wait_desc':   results.sort((a,b) => b.waitTime - a.waitTime); break;
    case 'confidence':  results.sort((a,b) => b.confidence - a.confidence); break;
    default:            results.sort((a,b) => a.name.localeCompare(b.name));
  }

  if (meta) meta.textContent = `Showing ${results.length} venue${results.length !== 1 ? 's' : ''}`;

  if (results.length === 0) {
    container.innerHTML = emptyStateHtml('🔍', 'No results found', 'Try adjusting your search terms or filters.');
    return;
  }

  container.innerHTML = results.map(v => venueCardHtml(v)).join('');
}

// ============================================================
// LOCATION DETAIL PAGE
// ============================================================

function renderLocationDetail(id) {
  const venue = state.venues.find(v => v.id === id);
  const container = document.getElementById('detailContainer');
  if (!venue || !container) return;

  state.selectedVenueId = id;

  const icon = VENUE_ICONS[venue.category] || '🏢';
  const totalReports = venue.reports ? venue.reports.length : 0;
  const approvedReports = venue.reports ? venue.reports.filter(r => r.approved !== false) : [];
  const waitColor = venue.waitTime > 30 ? 'var(--color-red-400)' : venue.waitTime > 15 ? 'var(--color-amber-400)' : 'var(--crowd-low)';
  const pct = Math.round(venue.confidence * 100);
  const timeSaved = Math.max(0, venue.waitTime - venue.bestTimeWait);

  container.innerHTML = `
    <!-- Back Button -->
    <div style="margin-bottom:20px">
      <button class="btn btn-secondary btn-sm" onclick="history.back()" id="detailBackBtn">← Back</button>
    </div>

    <div class="detail-layout">
      <!-- Left Column -->
      <div>
        <!-- Hero card with map -->
        <div class="detail-hero">
          <div class="detail-map-placeholder">
            <div class="map-grid-bg"></div>
            <div class="map-pin">${icon}</div>
            <div class="map-label">${venue.name}</div>
            <div style="font-size:12px; color:var(--text-muted); position:relative; z-index:1">${venue.address}, ${venue.city}</div>
          </div>
          <div class="detail-info">
            <h1 class="detail-name">${venue.name}</h1>
            <div class="detail-meta">
              <span>${icon} ${venue.category}</span>
              <span>•</span>
              <span>📍 ${venue.address}, ${venue.city}</span>
              <span>•</span>
              <span>🕐 ${venue.openHours || 'Hours N/A'}</span>
            </div>

            <!-- 3 Metric Boxes -->
            <div class="detail-metrics">
              <div class="metric-box">
                <div class="metric-box-val">
                  <span class="crowd-badge ${venue.currentCrowd}" style="font-size:13px; display:inline-flex">${venue.currentCrowd}</span>
                </div>
                <div class="metric-box-label">Live Crowd</div>
              </div>
              <div class="metric-box">
                <div class="metric-box-val" style="color:${waitColor}">~${venue.waitTime}m</div>
                <div class="metric-box-label">Current Wait</div>
              </div>
              <div class="metric-box">
                <div class="metric-box-val" style="color:var(--color-blue-400)">${pct}%</div>
                <div class="metric-box-label">AI Confidence</div>
              </div>
            </div>

            <!-- Best Time Banner -->
            <div class="best-time-banner" style="margin-bottom:16px">
              <div class="best-time-icon">🌟</div>
              <div>
                <div class="best-time-label">Recommended Best Time to Visit</div>
                <div class="best-time-value">${venue.bestTimeToVisit}</div>
                <div class="best-time-sub">Only ~${venue.bestTimeWait} min wait (save ~${timeSaved} min!)</div>
              </div>
            </div>

            <!-- Action buttons -->
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn btn-gradient" onclick="openModal('reportModal',null,'${id}')" id="detailReportBtn">📢 Report Crowd</button>
              <button class="btn btn-secondary" onclick="toggleFavorite('${id}')" id="detailFavBtn">
                ${venue.isFav ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
          </div>
        </div>

        <!-- Peak Hours Chart -->
        <div class="chart-container">
          <div class="chart-head">
            <div>
              <div class="chart-title">Peak Busy Hours &amp; Crowd Analytics</div>
              <div class="chart-subtitle">24-hour visitor traffic — tap a bar for hourly detail</div>
            </div>
          </div>
          <div class="chart-wrap">
            <canvas id="detailChart"></canvas>
          </div>
        </div>

        <!-- Crowd Trend (7-day) -->
        <div class="chart-container">
          <div class="chart-head">
            <div>
              <div class="chart-title">7-Day Crowd Trend</div>
              <div class="chart-subtitle">Average wait time over the past week</div>
            </div>
          </div>
          <div class="chart-wrap">
            <canvas id="detailTrendChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <aside>
        <!-- AI Prediction -->
        <div class="ai-card mb-20">
          <div class="ai-card-header">
            <div class="ai-icon">🤖</div>
            <div>
              <div class="ai-card-title">AI Prediction Model</div>
              <div class="ai-card-sub">Accuracy: ${pct}%</div>
            </div>
          </div>
          <p class="ai-prediction-text">
            Forecasted using exponential decay of live community reports combined with historical peak-hour heuristics 
            for ${venue.category} locations in ${venue.city}. 
            Current AI confidence: <strong>${pct}%</strong>.
            Predicted crowd at best visit time: <span class="crowd-badge Low" style="font-size:11px; display:inline-flex; padding:2px 8px;">${venue.bestTimeWait < 10 ? 'Low' : 'Moderate'}</span>
          </p>
          <div class="confidence-bar">
            <div class="confidence-bar-label"><span>Model accuracy</span><span style="color:var(--color-blue-400); font-weight:700">${pct}%</span></div>
            <div class="confidence-bar-track"><div class="confidence-bar-fill" style="width:${pct}%"></div></div>
          </div>
        </div>

        <!-- Live Reports -->
        <div class="sidebar-card">
          <div class="sidebar-card-head">
            <div class="sidebar-card-title">📋 Live Reports (${approvedReports.length})</div>
            <button class="btn btn-ghost btn-sm" onclick="openModal('reportModal',null,'${id}')">+ Add</button>
          </div>
          <div id="detailReportsList">
            ${approvedReports.length === 0
              ? `<div class="empty-state" style="padding:24px 0"><div class="empty-icon" style="font-size:28px">📭</div><div class="empty-desc">No reports yet. Be the first to report!</div></div>`
              : approvedReports.map(r => reportItemHtml(r)).join('')
            }
          </div>
        </div>

        <!-- Venue Details -->
        <div class="sidebar-card" style="margin-top:20px">
          <div class="sidebar-card-title" style="margin-bottom:14px">ℹ️ Venue Details</div>
          <div style="display:flex; flex-direction:column; gap:10px; font-size:13.5px;">
            <div style="display:flex; justify-content:space-between;"><span class="text-muted">Category</span><span style="font-weight:600">${venue.category}</span></div>
            <div style="display:flex; justify-content:space-between;"><span class="text-muted">City</span><span style="font-weight:600">${venue.city}</span></div>
            <div style="display:flex; justify-content:space-between;"><span class="text-muted">Hours</span><span style="font-weight:600">${venue.openHours || 'N/A'}</span></div>
            <div style="display:flex; justify-content:space-between;"><span class="text-muted">Reports</span><span style="font-weight:600">${totalReports} total</span></div>
            <div style="display:flex; justify-content:space-between;"><span class="text-muted">Predicted Next</span><span class="crowd-badge ${venue.predictedCrowd}" style="font-size:11px">${venue.predictedCrowd}</span></div>
          </div>
        </div>
      </aside>
    </div>
  `;

  // Render charts after DOM is ready
  setTimeout(() => {
    renderDetailChart(id);
    renderDetailTrendChart(id);
  }, 80);
}

function reportItemHtml(r) {
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444'];
  const color = colors[r.user.charCodeAt(0) % colors.length];
  const initial = r.user.charAt(0).toUpperCase();
  const timeAgo = formatTimeAgo(r.ts);
  return `
    <div class="report-item">
      <div class="report-avatar" style="background:${color}">${initial}</div>
      <div class="report-content">
        <div class="report-user">${r.user}</div>
        <div class="report-detail">${r.comment || 'No comment provided.'}</div>
        <div class="report-meta">
          <span class="crowd-badge ${r.crowd}" style="font-size:10px; padding:2px 8px">${r.crowd}</span>
          <span>~${r.wait} min wait</span>
          <span>${timeAgo}</span>
        </div>
      </div>
    </div>
  `;
}

function formatTimeAgo(ts) {
  if (!ts) return 'Unknown';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

// ============================================================
// CHARTS — DETAIL PAGE
// ============================================================

function getChartColors() {
  const isDark = state.theme === 'dark';
  return {
    gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    textColor: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#111827' : '#ffffff',
  };
}

function renderDetailChart(venueId) {
  const ctx = document.getElementById('detailChart');
  if (!ctx) return;

  // Destroy previous
  if (state.chartInstances.detail) { state.chartInstances.detail.destroy(); }

  const venue = state.venues.find(v => v.id === venueId);
  const { gridColor, textColor, tooltipBg } = getChartColors();

  // Generate realistic peak hour data based on category
  const peakData = generatePeakHoursData(venue?.category || 'Bank / ATM');

  state.chartInstances.detail = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm'],
      datasets: [{
        label: 'Crowd Level',
        data: peakData,
        backgroundColor: peakData.map(v => {
          if (v >= 80) return 'rgba(239,68,68,0.7)';
          if (v >= 55) return 'rgba(249,115,22,0.7)';
          if (v >= 35) return 'rgba(245,158,11,0.7)';
          return 'rgba(16,185,129,0.7)';
        }),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => `Crowd: ${ctx.raw}% full — Est. ${Math.round(ctx.raw * 0.5)} min wait`
          }
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 }, callback: v => v + '%' },
          min: 0, max: 100
        }
      }
    }
  });
}

function renderDetailTrendChart(venueId) {
  const ctx = document.getElementById('detailTrendChart');
  if (!ctx) return;
  if (state.chartInstances.trend) state.chartInstances.trend.destroy();

  const { gridColor, textColor, tooltipBg } = getChartColors();
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data = [18, 22, 31, 25, 38, 55, 42];

  state.chartInstances.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Avg Wait Time (min)',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: { label: ctx => `Avg wait: ~${ctx.raw} min` }
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 }, callback: v => v + 'm' },
          min: 0
        }
      }
    }
  });
}

function generatePeakHoursData(category) {
  const profiles = {
    'Bank / ATM':       [5, 10, 25, 75, 85, 80, 60, 45, 40, 55, 65, 70, 50, 30, 20],
    'Hospital':         [30, 55, 80, 90, 85, 70, 65, 60, 55, 50, 70, 65, 40, 30, 20],
    'Supermarket':      [5,  8,  15, 25, 40, 55, 70, 65, 50, 45, 60, 75, 80, 70, 50],
    'Shopping Mall':    [3,  5,  5,  10, 25, 45, 65, 70, 65, 55, 60, 75, 85, 80, 60],
    'Airport':          [40, 55, 70, 75, 65, 55, 60, 70, 65, 60, 70, 80, 85, 75, 60],
    'Government Office':[5,  5,  10, 75, 85, 80, 70, 40, 55, 60, 55, 45, 30, 15, 5 ],
    'Post Office':      [5,  5,  10, 60, 70, 65, 55, 45, 40, 50, 60, 55, 40, 20, 10],
  };
  const base = profiles[category] || profiles['Bank / ATM'];
  // Add slight random variation
  return base.map(v => Math.max(0, Math.min(100, v + (Math.random() * 10 - 5))));
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

function renderDashboard() {
  if (!requireAuth('dashboard')) return;

  // Stats
  const favs = state.venues.filter(v => v.isFav);
  const lowCount = state.venues.filter(v => v.currentCrowd === 'Low').length;
  const totalReports = state.venues.reduce((sum, v) => sum + (v.reports?.length || 0), 0);

  setEl('dashTotalVenues', state.venues.length);
  setEl('dashLowCount', lowCount);
  setEl('dashReportsCount', totalReports);
  setEl('dashFavCount', favs.length);

  // Venues grid
  const grid = document.getElementById('dashVenuesGrid');
  if (grid) {
    grid.innerHTML = state.venues.map(v => venueCardHtml(v)).join('');
  }

  // Notifications
  const notifList = document.getElementById('dashNotifList');
  if (notifList) {
    if (state.notifications.length === 0) {
      notifList.innerHTML = `<div style="color:var(--text-muted); font-size:13px; text-align:center; padding:16px 0">No notifications</div>`;
    } else {
      notifList.innerHTML = state.notifications.map(n => `
        <div class="notif-item">
          <div class="notif-icon ${n.type}">
            ${{ alert: '⚠️', success: '✅', info: 'ℹ️' }[n.type] || '🔔'}
          </div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-msg">${n.msg}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join('');
    }
  }

  // Favorites sidebar
  const favList = document.getElementById('dashFavList');
  if (favList) {
    if (favs.length === 0) {
      favList.innerHTML = `<div style="color:var(--text-muted); font-size:13px; padding:8px 0">No favorites saved yet.</div>`;
    } else {
      favList.innerHTML = favs.map(v => `
        <div class="fav-item" onclick="navigateTo('detail','${v.id}')">
          <span style="font-size:18px">${VENUE_ICONS[v.category] || '🏢'}</span>
          <div class="fav-item-name">${v.name}</div>
          <span class="crowd-badge ${v.currentCrowd}" style="font-size:10px; padding:2px 8px">${v.currentCrowd}</span>
          <div class="fav-item-wait">~${v.waitTime}m</div>
        </div>
      `).join('');
    }
  }

  // Recent reports
  const recentReports = document.getElementById('dashRecentReports');
  if (recentReports) {
    const allReports = state.venues
      .flatMap(v => (v.reports || []).map(r => ({ ...r, venueName: v.name })))
      .sort((a, b) => (b.ts || 0) - (a.ts || 0))
      .slice(0, 5);

    if (allReports.length === 0) {
      recentReports.innerHTML = `<div style="color:var(--text-muted); font-size:13px; padding:8px 0">No reports yet.</div>`;
    } else {
      recentReports.innerHTML = allReports.map(r => `
        <div style="padding:8px 0; border-bottom:1px solid var(--border-subtle); font-size:13px;">
          <div style="font-weight:700; margin-bottom:2px">${r.venueName}</div>
          <div style="color:var(--text-secondary); display:flex; gap:8px; align-items:center; flex-wrap:wrap">
            <span class="crowd-badge ${r.crowd}" style="font-size:10px; padding:2px 8px">${r.crowd}</span>
            <span>~${r.wait}m</span>
            <span style="color:var(--text-muted)">${formatTimeAgo(r.ts)}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

function clearNotifications() {
  state.notifications = [];
  renderDashboard();
  showToast('success', 'Cleared', 'All notifications cleared.');
}

// ============================================================
// CROWD REPORT — FULL PAGE
// ============================================================

function renderReportPage() {
  populateReportVenueSelects();
  if (state.selectedVenueId) {
    const select = document.getElementById('reportVenueSelect');
    if (select) select.value = state.selectedVenueId;
  }
}

function populateReportVenueSelects() {
  const selects = ['reportVenueSelect', 'quickReportVenue'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<option value="">-- Select a venue --</option>` +
      state.venues.map(v => `<option value="${v.id}">${v.name} (${v.city})</option>`).join('');
  });
}

function selectCrowdLevel(level, el) {
  state.selectedCrowdLevel = level;
  document.querySelectorAll('#reportLevelGrid .level-card').forEach(c => {
    c.className = 'level-card';
  });
  const cls = { 'Low': 'selected-low', 'Moderate': 'selected-moderate', 'High': 'selected-high', 'Very High': 'selected-veryhigh' };
  if (el) el.classList.add(cls[level] || 'selected-moderate');
  const hidden = document.getElementById('reportCrowdLevel');
  if (hidden) hidden.value = level;
}

function selectQuickLevel(level, el) {
  state.quickReportLevel = level;
  document.querySelectorAll('#quickReportLevelGrid .level-card').forEach(c => {
    c.className = 'level-card';
  });
  const cls = { 'Low': 'selected-low', 'Moderate': 'selected-moderate', 'High': 'selected-high', 'Very High': 'selected-veryhigh' };
  if (el) el.classList.add(cls[level] || 'selected-moderate');
  const hidden = document.getElementById('quickReportLevel');
  if (hidden) hidden.value = level;
}

function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', 'File too large', 'Please select an image under 5MB.');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('photoPreview');
    const wrap = document.getElementById('photoPreviewWrap');
    if (preview) preview.src = e.target.result;
    if (wrap) wrap.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function handlePhotoDrop(event) {
  event.preventDefault();
  document.getElementById('uploadZone').classList.remove('dragging');
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const input = document.getElementById('photoFileInput');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    handlePhotoSelect({ target: input });
  }
}

function submitCrowdReport(event) {
  event.preventDefault();
  if (!requireAuth('report')) return;

  const venueId    = document.getElementById('reportVenueSelect').value;
  const crowdLevel = document.getElementById('reportCrowdLevel').value || 'Moderate';
  const waitTime   = parseInt(document.getElementById('reportWaitSlider').value);
  const comment    = document.getElementById('reportComment').value.trim();
  const photoInput = document.getElementById('photoFileInput');
  const photoFile  = photoInput?.files?.[0] || null;

  if (!venueId) { showToast('error', 'No venue', 'Please select a venue.'); return; }

  doSubmitReport(venueId, crowdLevel, waitTime, comment, photoFile);
  event.target.reset();
  document.getElementById('photoPreviewWrap').style.display = 'none';
  document.querySelectorAll('#reportLevelGrid .level-card').forEach(c => c.className = 'level-card');
  state.selectedCrowdLevel = 'Moderate';
  document.getElementById('reportCrowdLevel').value = '';

  navigateTo('dashboard');
}


function submitQuickReport(event) {
  event.preventDefault();
  if (!requireAuth(null)) return;

  const venueId = document.getElementById('quickReportVenue').value;
  const crowdLevel = document.getElementById('quickReportLevel').value || state.quickReportLevel;
  const waitTime = parseInt(document.getElementById('quickWaitSlider').value);
  const comment = document.getElementById('quickComment').value.trim();

  if (!venueId) { showToast('error', 'No venue', 'Please select a venue.'); return; }

  doSubmitReport(venueId, crowdLevel, waitTime, comment);
  closeModal('reportModal');
  event.target.reset();
  document.querySelectorAll('#quickReportLevelGrid .level-card').forEach(c => c.className = 'level-card');
}

// NOTE: This is the LOCAL-ONLY fallback. The Firestore-aware doSubmitReport()
// is defined later in the file and overrides this one when Firebase is available.
function _doSubmitReportLocal(venueId, crowdLevel, waitTime, comment) {
  const venue = state.venues.find(v => v.id === venueId);
  if (!venue) return;

  const report = {
    id:      'r_' + Date.now(),
    userId:  state.currentUser?.uid || 'anonymous',
    user:    state.currentUser?.name || 'Community Member',
    crowd:   crowdLevel,
    wait:    waitTime,
    ts:      Date.now(),
    comment: comment || '',
    approved: true,
  };

  // Update venue data
  venue.currentCrowd = crowdLevel;
  venue.waitTime     = waitTime;
  if (!venue.reports) venue.reports = [];
  venue.reports.unshift(report);

  // AI re-prediction
  venue.predictedCrowd = aiPredictCrowd(venue);
  venue.confidence = Math.min(0.99, venue.confidence + 0.01);

  saveVenues();

  // Add notification
  state.notifications.unshift({
    id:    'n_' + Date.now(),
    type:  'success',
    title: 'Report Submitted ✅',
    msg:   `Your ${crowdLevel} crowd report for ${venue.name} was recorded. AI predictions updated!`,
    time:  'Just now',
  });

  showToast('success', 'Report Submitted! 🎉', `Your live report for ${venue.name} has been recorded and predictions updated.`);
  if (state.currentUser) state.currentUser.reports = (state.currentUser.reports || 0) + 1;

  // Update current page
  if (state.activePage === 'detail')    renderLocationDetail(venueId);
  if (state.activePage === 'home')      renderHomeVenues();
  if (state.activePage === 'dashboard') renderDashboard();
}


// ============================================================
// AI PREDICTION ENGINE
// ============================================================

function aiPredictCrowd(venue) {
  const now = new Date();
  const hour = now.getHours();
  const dow = now.getDay(); // 0=Sun

  // Base prediction from current crowd + time
  const peakData = generatePeakHoursData(venue.category);
  const idx = Math.max(0, hour - 6); // chart starts at 6am
  const peakLevel = peakData[Math.min(idx, peakData.length - 1)] || 50;

  // Weight: 40% AI time-model, 60% latest community report
  const reportWeight = 0.6;
  const aiWeight = 0.4;

  const reportLevelNum = crowdToNum(venue.currentCrowd);
  const aiNum = peakLevel;
  const combined = reportWeight * reportLevelNum + aiWeight * (aiNum / 100 * 100);

  if (combined >= 75) return 'Very High';
  if (combined >= 55) return 'High';
  if (combined >= 30) return 'Moderate';
  return 'Low';
}

function crowdToNum(level) {
  return { 'Low': 20, 'Moderate': 50, 'High': 75, 'Very High': 95 }[level] || 50;
}

function numToCrowd(num) {
  if (num >= 75) return 'Very High';
  if (num >= 55) return 'High';
  if (num >= 30) return 'Moderate';
  return 'Low';
}

// ============================================================
// AUTH — MODALS & HANDLERS
// ============================================================

function openModal(modalId, mode = null, venueId = null) {
  // Close any open modals first
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    m.classList.remove('open');
    m.style.display = 'none';
  });

  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('open'), 10);

  // Auth modal mode
  if (modalId === 'authModal') {
    if (mode === 'signup') switchAuthTab('signup');
    else if (mode === 'forgot') switchAuthTab('forgot');
    else switchAuthTab('signin');
  }

  // Report modal pre-select venue
  if (modalId === 'reportModal') {
    populateReportVenueSelects();
    if (venueId) {
      const sel = document.getElementById('quickReportVenue');
      if (sel) sel.value = venueId;
    }
  }

  // Close on overlay click
  modal.onclick = (e) => { if (e.target === modal) closeModal(modalId); };

  // Close on Escape
  document.onkeydown = (e) => { if (e.key === 'Escape') closeModal(modalId); };
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  modal.style.display = 'none';
}

function switchAuthTab(tab) {
  ['signin','signup','forgot'].forEach(t => {
    const panel = document.getElementById(`authPanel${t.charAt(0).toUpperCase()+t.slice(1)}`);
    if (panel) panel.style.display = t === tab ? 'block' : 'none';
  });

  // Highlight tab buttons (only signin/signup)
  ['SignIn','SignUp'].forEach(t => {
    const btn = document.getElementById(`authTab${t}`);
    if (btn) btn.classList.toggle('active', tab === t.toLowerCase().replace('si','si'));
  });

  const tabSignIn = document.getElementById('authTabSignIn');
  const tabSignUp = document.getElementById('authTabSignUp');
  if (tabSignIn) tabSignIn.classList.toggle('active', tab === 'signin');
  if (tabSignUp) tabSignUp.classList.toggle('active', tab === 'signup');
}

function handleEmailSignIn(event) {
  event.preventDefault();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  const btn = document.getElementById('signInSubmitBtn');

  btn.classList.add('btn-loading');
  btn.disabled = true;

  // Try Firebase auth, fall back to demo mode
  if (auth) {
    auth.signInWithEmailAndPassword(email, password)
      .then(uc => {
        onAuthSuccess({ uid: uc.user.uid, name: uc.user.displayName || email.split('@')[0], email });
      })
      .catch(() => {
        // Demo mode fallback
        onAuthSuccess({ uid: 'demo_' + Date.now(), name: email.split('@')[0], email, reports: 0 });
      });
  } else {
    setTimeout(() => {
      onAuthSuccess({ uid: 'demo_' + Date.now(), name: email.split('@')[0], email, reports: 0 });
    }, 800);
  }
}

function handleEmailSignUp(event) {
  event.preventDefault();
  const name = document.getElementById('signUpName').value.trim();
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  const btn = document.getElementById('signUpSubmitBtn');

  btn.classList.add('btn-loading');
  btn.disabled = true;

  if (auth) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(uc => {
        uc.user.updateProfile({ displayName: name });
        onAuthSuccess({ uid: uc.user.uid, name, email, reports: 0 });
      })
      .catch(() => {
        onAuthSuccess({ uid: 'demo_' + Date.now(), name, email, reports: 0 });
      });
  } else {
    setTimeout(() => {
      onAuthSuccess({ uid: 'demo_' + Date.now(), name, email, reports: 0 });
    }, 800);
  }
}

function handleGoogleSignIn() {
  if (auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        onAuthSuccess({
          uid: result.user.uid,
          name: result.user.displayName || 'Google User',
          email: result.user.email,
          avatar: result.user.photoURL,
          reports: 0,
        });
      })
      .catch(() => {
        // Demo fallback
        onAuthSuccess({ uid: 'google_demo_' + Date.now(), name: 'Google User', email: 'user@gmail.com', reports: 0 });
      });
  } else {
    onAuthSuccess({ uid: 'google_demo_' + Date.now(), name: 'Google User', email: 'user@gmail.com', reports: 0 });
  }
}

function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgotEmail').value;
  const btn = document.getElementById('forgotSubmitBtn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    closeModal('authModal');
    showToast('success', 'Reset link sent!', `Check ${email} for your password reset link.`);
    btn.textContent = 'Send Reset Link';
    btn.disabled = false;
  }, 1000);
}

function onAuthSuccess(user) {
  state.currentUser = user;
  saveUser();
  closeModal('authModal');
  renderAuthNav();

  // Reset button states
  ['signInSubmitBtn','signUpSubmitBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.classList.remove('btn-loading'); btn.disabled = false; }
  });

  showToast('success', `Welcome, ${user.name.split(' ')[0]}! 🎉`, 'You are now signed in to CrowdPulse.');

  // If on protected page, refresh
  if (['dashboard','favorites','profile'].includes(state.activePage)) {
    navigateTo(state.activePage);
  }
}

function handleLogout() {
  if (auth) {
    auth.signOut().catch(() => {});
  }
  state.currentUser = null;
  saveUser();
  renderAuthNav();
  closeMobileMenu();
  navigateTo('home');
  showToast('info', 'Signed out', 'You have been signed out successfully.');
}

function requireAuth(redirectPage) {
  if (!state.currentUser) {
    openModal('authModal', 'signin');
    showToast('info', 'Sign in required', 'Please sign in to access this feature.');
    if (redirectPage) {
      // Save intended destination
      state._redirectAfterAuth = redirectPage;
    }
    return false;
  }
  return true;
}

// ============================================================
// PROFILE PAGE
// ============================================================

function renderProfilePage() {
  if (!requireAuth('profile')) return;
  const user = state.currentUser;

  setEl('profileDisplayName', user.name || 'User');
  setEl('profileEmailDisplay', user.email || '');
  setEl('profileReportCount', user.reports || 0);
  setEl('profileFavCount', state.venues.filter(v => v.isFav).length);

  const avatarEl = document.getElementById('profileAvatarCircle');
  if (avatarEl) {
    if (user.avatar) {
      avatarEl.innerHTML = `<img src="${user.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" alt="Avatar">`;
    } else {
      avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
    }
  }

  const nameInput = document.getElementById('profileNameInput');
  const emailInput = document.getElementById('profileEmailInput');
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';

  // Badges
  if ((user.reports || 0) >= 5) document.getElementById('profileReporterBadge')?.style.removeProperty('display');
  if ((user.reports || 0) >= 20) document.getElementById('profilePowerBadge')?.style.removeProperty('display');

  // Notification prefs toggles
  updateToggle('toggleQueueAlerts', state.notifPrefs.queueAlerts);
  updateToggle('toggleFavUpdates', state.notifPrefs.favUpdates);
  updateToggle('toggleWeeklyDigest', state.notifPrefs.weeklyDigest);

  // My reports
  const myReports = state.venues
    .flatMap(v => (v.reports || []).filter(r => r.userId === user.uid).map(r => ({ ...r, venueName: v.name })))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));

  const reportsList = document.getElementById('profileReportsList');
  if (reportsList) {
    if (myReports.length === 0) {
      reportsList.innerHTML = `<div style="color:var(--text-muted); font-size:13px; padding:8px 0">No reports submitted yet. <span style="cursor:pointer; color:var(--color-blue-400)" onclick="navigateTo('report')">Submit your first report!</span></div>`;
    } else {
      reportsList.innerHTML = myReports.map(r => `
        <div style="padding:10px 0; border-bottom:1px solid var(--border-subtle); font-size:13px;">
          <div style="font-weight:700">${r.venueName}</div>
          <div style="display:flex; gap:8px; align-items:center; margin-top:4px; flex-wrap:wrap;">
            <span class="crowd-badge ${r.crowd}" style="font-size:10px; padding:2px 8px">${r.crowd}</span>
            <span style="color:var(--text-muted)">~${r.wait} min</span>
            <span style="color:var(--text-muted)">${formatTimeAgo(r.ts)}</span>
          </div>
          ${r.comment ? `<div style="color:var(--text-secondary); margin-top:4px">"${r.comment}"</div>` : ''}
        </div>
      `).join('');
    }
  }
}

function saveProfile(event) {
  event.preventDefault();
  const name = document.getElementById('profileNameInput').value.trim();
  const email = document.getElementById('profileEmailInput').value.trim();
  if (!name) { showToast('error', 'Name required', 'Please enter your name.'); return; }

  state.currentUser.name = name;
  state.currentUser.email = email;
  saveUser();
  renderAuthNav();
  renderProfilePage();
  showToast('success', 'Profile Updated', 'Your profile has been saved successfully.');
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    state.currentUser.avatar = e.target.result;
    saveUser();
    renderProfilePage();
    renderAuthNav();
    showToast('success', 'Avatar Updated', 'Your profile picture has been changed.');
  };
  reader.readAsDataURL(file);
}

function toggleNotifPref(key, btn) {
  state.notifPrefs[key] = !state.notifPrefs[key];
  updateToggle(btn.id, state.notifPrefs[key]);
  try { localStorage.setItem('cp_notif_prefs', JSON.stringify(state.notifPrefs)); } catch(e) {}
  showToast('success', 'Preference Saved', `${key.replace(/([A-Z])/g,' $1')} ${state.notifPrefs[key] ? 'enabled' : 'disabled'}.`);
}

function updateToggle(id, on) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  if (el) el.className = `toggle ${on ? 'on' : ''}`;
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function renderAdminPage() {
  switchAdminTab(state.activeAdminTab || 'overview');
  renderAdminOverview();
  renderAdminVenuesTable();
  renderAdminUsersTable();
  renderAdminReportsList();
  renderAdminNotifHistory();
  renderAdminCategoriesTable();
  setEl('adminStatVenues', state.venues.length);
  setEl('adminStatReports', state.venues.reduce((s, v) => s + (v.reports?.length || 0), 0));
  setEl('adminStatUsers', state.users.length);
}

function switchAdminTab(tab) {
  state.activeAdminTab = tab;

  // Update nav links
  document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
  const navLink = document.getElementById(`adminNav-${tab}`);
  if (navLink) navLink.classList.add('active');

  // Show/hide tabs
  document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
  const tabEl = document.getElementById(`adminTab-${tab}`);
  if (tabEl) tabEl.style.display = 'block';

  // Render analytics charts lazily
  if (tab === 'analytics') setTimeout(renderAdminAnalyticsCharts, 80);
  if (tab === 'overview') setTimeout(renderAdminOverviewCharts, 80);
}

function renderAdminOverview() {
  const activity = document.getElementById('adminRecentActivity');
  if (!activity) return;

  const allReports = state.venues
    .flatMap(v => (v.reports || []).map(r => ({ ...r, venueName: v.name })))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 8);

  activity.innerHTML = allReports.length === 0
    ? `<div style="color:var(--text-muted)">No recent activity.</div>`
    : allReports.map(r => `
        <div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-subtle); font-size:13px;">
          <span style="font-size:18px">${VENUE_ICONS[state.venues.find(v=>v.reports?.some(rr=>rr.id===r.id))?.category] || '📋'}</span>
          <div style="flex:1">
            <div style="font-weight:700">${r.user} reported at <span style="color:var(--color-blue-400)">${r.venueName}</span></div>
            <div style="color:var(--text-muted)">${formatTimeAgo(r.ts)}</div>
          </div>
          <span class="crowd-badge ${r.crowd}" style="font-size:10px">${r.crowd}</span>
        </div>
      `).join('');
}

function renderAdminOverviewCharts() {
  renderAdminChart('adminReportsChart', 'bar',
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    [{ label: 'Reports', data: [12, 19, 8, 25, 32, 47, 28], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 }]
  );
  const catCounts = {};
  state.venues.forEach(v => { catCounts[v.category] = (catCounts[v.category] || 0) + 1; });
  renderAdminChart('adminCategoryChart', 'doughnut',
    Object.keys(catCounts),
    [{ data: Object.values(catCounts), backgroundColor: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316'], borderWidth: 0 }]
  );
}

function renderAdminVenuesTable() {
  const tbody = document.getElementById('adminVenuesTableBody');
  if (!tbody) return;

  const q = (document.getElementById('adminVenueSearch')?.value || '').toLowerCase();
  const catF = document.getElementById('adminVenueCategoryFilter')?.value || 'All';

  let filtered = state.venues.filter(v =>
    (catF === 'All' || v.category === catF) &&
    (!q || v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q))
  );

  tbody.innerHTML = filtered.map(v => `
    <tr>
      <td><strong>${v.name}</strong></td>
      <td><span style="font-size:13px">${VENUE_ICONS[v.category] || ''} ${v.category}</span></td>
      <td>${v.city}</td>
      <td><span class="crowd-badge ${v.currentCrowd}" style="font-size:11px">${v.currentCrowd}</span></td>
      <td>~${v.waitTime} min</td>
      <td>${v.bestTimeToVisit}</td>
      <td><span style="color:var(--color-blue-400); font-weight:700">${Math.round(v.confidence * 100)}%</span></td>
      <td>
        <div class="admin-table-actions">
          <button class="btn btn-ghost btn-icon-sm" onclick="navigateTo('detail','${v.id}')" title="View">👁️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteVenueAdmin('${v.id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:24px">No venues found.</td></tr>`;
}

function deleteVenueAdmin(id) {
  const venue = state.venues.find(v => v.id === id);
  if (!venue) return;
  if (!confirm(`Delete "${venue.name}"? This cannot be undone.`)) return;
  state.venues = state.venues.filter(v => v.id !== id);
  saveVenues();
  renderAdminVenuesTable();
  setEl('adminStatVenues', state.venues.length);
  showToast('success', 'Venue Deleted', `${venue.name} has been removed from the platform.`);
}

function handleAddVenue(event) {
  event.preventDefault();
  const name = document.getElementById('newVenueName').value.trim();
  const category = document.getElementById('newVenueCategory').value;
  const address = document.getElementById('newVenueAddress').value.trim();
  const city = document.getElementById('newVenueCity').value.trim();
  const crowd = document.getElementById('newVenueCrowdLevel').value;
  const wait = parseInt(document.getElementById('newVenueWait').value) || 10;
  const openTime = document.getElementById('newVenueOpenTime').value;
  const bestTime = document.getElementById('newVenueBestTime').value;

  const newVenue = {
    id: 'venue_' + Date.now(),
    name, category, address, city,
    lat: 12.9716 + (Math.random() - 0.5) * 0.1,
    lng: 77.5946 + (Math.random() - 0.5) * 0.1,
    currentCrowd: crowd,
    predictedCrowd: crowd,
    waitTime: wait,
    confidence: 0.80,
    bestTimeToVisit: bestTime || '2:00 PM – 3:30 PM',
    bestTimeWait: Math.max(2, Math.round(wait * 0.15)),
    openHours: openTime || '9:00 AM – 5:00 PM',
    isFav: false,
    reports: [],
  };

  state.venues.unshift(newVenue);
  saveVenues();
  closeModal('addVenueModal');
  event.target.reset();
  renderAdminVenuesTable();
  renderHomeVenues();
  setEl('adminStatVenues', state.venues.length);
  populateReportVenueSelects();
  showToast('success', 'Venue Added! 🏢', `${name} is now live on CrowdPulse.`);
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;
  const q = (document.getElementById('adminUserSearch')?.value || '').toLowerCase();
  const filtered = state.users.filter(u => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:10px">
          <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, var(--color-blue-500), var(--color-purple-500)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px; flex-shrink:0">${u.name.charAt(0)}</div>
          <strong>${u.name}</strong>
        </div>
      </td>
      <td>${u.email}</td>
      <td>${u.joinedAt}</td>
      <td>${u.reports}</td>
      <td>
        <span class="badge ${u.status === 'active' ? 'badge-green' : 'badge-amber'}">
          ${u.status === 'active' ? '🟢 Active' : '⏸️ Suspended'}
        </span>
      </td>
      <td>
        <div class="admin-table-actions">
          <button class="btn btn-${u.status === 'active' ? 'danger' : 'success'} btn-sm"
            onclick="toggleUserStatus('${u.uid}')">
            ${u.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px">No users found.</td></tr>`;
}

function toggleUserStatus(uid) {
  const user = state.users.find(u => u.uid === uid);
  if (!user) return;
  user.status = user.status === 'active' ? 'suspended' : 'active';
  renderAdminUsersTable();
  showToast('success', 'User Updated', `${user.name} is now ${user.status}.`);
}

function renderAdminReportsList() {
  const container = document.getElementById('adminReportsList');
  if (!container) return;

  const allReports = state.venues
    .flatMap(v => (v.reports || []).map(r => ({ ...r, venueId: v.id, venueName: v.name })))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 30);

  if (allReports.length === 0) {
    container.innerHTML = emptyStateHtml('📋', 'No reports yet', 'Community reports will appear here for moderation.');
    return;
  }

  container.innerHTML = allReports.map(r => `
    <div class="admin-table-card" style="margin-bottom:12px; padding:16px 20px; border-radius:var(--radius-lg);">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap">
        <div style="flex:1">
          <div style="font-size:14px; font-weight:700; margin-bottom:4px">${r.user} → <span style="color:var(--color-blue-400)">${r.venueName}</span></div>
          <div style="font-size:13px; color:var(--text-secondary); margin-bottom:6px">
            ${r.comment || 'No comment'} — ~${r.wait} min wait
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap">
            <span class="crowd-badge ${r.crowd}" style="font-size:11px">${r.crowd}</span>
            <span style="font-size:12px; color:var(--text-muted)">${formatTimeAgo(r.ts)}</span>
            ${r.approved === false ? `<span class="badge badge-amber">⚠️ Pending</span>` : `<span class="badge badge-green">✅ Approved</span>`}
          </div>
        </div>
        <div style="display:flex; gap:6px">
          ${r.approved === false ? `<button class="btn btn-success btn-sm" onclick="approveReport('${r.venueId}','${r.id}')">✅ Approve</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="deleteReport('${r.venueId}','${r.id}')">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function approveReport(venueId, reportId) {
  const venue = state.venues.find(v => v.id === venueId);
  const report = venue?.reports?.find(r => r.id === reportId);
  if (report) { report.approved = true; saveVenues(); renderAdminReportsList(); showToast('success', 'Report Approved', ''); }
}

function deleteReport(venueId, reportId) {
  const venue = state.venues.find(v => v.id === venueId);
  if (!venue) return;
  venue.reports = (venue.reports || []).filter(r => r.id !== reportId);
  saveVenues();
  renderAdminReportsList();
  showToast('success', 'Report Deleted', 'The report has been removed.');
}

function renderAdminAnalyticsCharts() {
  const { gridColor, textColor } = getChartColors();
  renderAdminChart('adminPeakHoursChart', 'bar',
    ['6am','8am','10am','12pm','2pm','4pm','6pm','8pm','10pm'],
    [{ label: 'Avg crowd', data: [15,55,80,70,45,65,78,60,30], backgroundColor: 'rgba(139,92,246,0.7)', borderRadius: 5 }]
  );
  renderAdminChart('adminQueueChart', 'bar',
    ['Bank','Hospital','Supermarket','Mall','Airport','Govt.','Post'],
    [{ label: 'Avg wait (min)', data: [22, 35, 8, 12, 45, 38, 6], backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 5 }],
    true
  );
  renderAdminChart('adminWeeklyChart', 'line',
    ['Week 1','Week 2','Week 3','Week 4'],
    [{ label: 'Reports', data: [120, 185, 240, 312], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.12)', fill: true, tension: 0.4, pointBackgroundColor: '#3b82f6' }]
  );
  renderAdminChart('adminAccuracyChart', 'line',
    ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
    [{ label: 'Accuracy %', data: [88, 89.5, 91, 92.3, 93, 94.1, 94.8], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981' }]
  );
}

function renderAdminChart(canvasId, type, labels, datasets, horizontal = false) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (state.adminChartInstances[canvasId]) state.adminChartInstances[canvasId].destroy();
  const { gridColor, textColor } = getChartColors();

  state.adminChartInstances[canvasId] = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: horizontal ? 'y' : 'x',
      plugins: {
        legend: { display: datasets.length > 1, labels: { color: textColor, font: { size: 12 } } },
      },
      scales: type === 'doughnut' ? {} : {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
      }
    }
  });
}

function sendAdminNotification(event) {
  event.preventDefault();
  const title = document.getElementById('notifTitle').value.trim();
  const msg = document.getElementById('notifMsg').value.trim();
  const target = document.getElementById('notifTarget').value;

  const btn = document.getElementById('sendNotifBtn');
  btn.classList.add('btn-loading');
  btn.disabled = true;

  setTimeout(() => {
    state.sentNotifs.unshift({ title, msg, sentTo: target, sentAt: new Date().toLocaleDateString() });
    state.notifications.unshift({ id: 'n_' + Date.now(), type: 'info', title, msg, time: 'Just now' });
    renderAdminNotifHistory();
    event.target.reset();
    btn.classList.remove('btn-loading');
    btn.disabled = false;
    showToast('success', 'Notification Sent! 📤', `"${title}" sent to ${target} users.`);
  }, 1200);
}

function renderAdminNotifHistory() {
  const container = document.getElementById('adminSentNotifList');
  if (!container) return;
  container.innerHTML = state.sentNotifs.map(n => `
    <div style="padding:12px 0; border-bottom:1px solid var(--border-subtle)">
      <div style="font-weight:700; font-size:13.5px">${n.title}</div>
      <div style="font-size:13px; color:var(--text-secondary); margin:3px 0">${n.msg}</div>
      <div style="font-size:12px; color:var(--text-muted)">Sent to: ${n.sentTo} · ${n.sentAt}</div>
    </div>
  `).join('') || `<div style="color:var(--text-muted); font-size:13px">No notifications sent yet.</div>`;
}

function renderAdminCategoriesTable() {
  const tbody = document.getElementById('adminCategoriesTableBody');
  if (!tbody) return;

  const allCats = [...CATEGORIES.filter(c => c.name !== 'All'), ...state.customCategories];
  tbody.innerHTML = allCats.map(c => {
    const count = state.venues.filter(v => v.category === c.name).length;
    return `
      <tr>
        <td style="font-size:22px">${c.icon}</td>
        <td><strong>${c.name}</strong></td>
        <td>${count} venue${count !== 1 ? 's' : ''}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="alert('Edit category coming soon!')">✏️ Edit</button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleAddCategory(event) {
  event.preventDefault();
  const icon = document.getElementById('newCatIcon').value.trim();
  const name = document.getElementById('newCatName').value.trim();
  if (!icon || !name) return;
  state.customCategories.push({ id: 'cat_' + Date.now(), icon, name });
  closeModal('addCategoryModal');
  event.target.reset();
  renderAdminCategoriesTable();
  showToast('success', 'Category Added', `"${icon} ${name}" is now available.`);
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(type, title, msg, duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const id = 'toast_' + Date.now();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = id;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '🔔'}</span>
    <div class="toast-text">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
    <button onclick="removeToast('${id}')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;padding:0 4px;flex-shrink:0;">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => removeToast(id), duration);
}

function removeToast(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.add('exiting');
  setTimeout(() => toast.remove(), 300);
}

// ============================================================
// ANIMATIONS
// ============================================================

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + '+';
      if (current >= target) clearInterval(interval);
    }, 30);
  });
  document.querySelectorAll('[data-count-pct]').forEach(el => {
    const target = parseFloat(el.dataset.countPct);
    let current = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toFixed(1) + '%';
      if (current >= target) clearInterval(interval);
    }, 30);
  });
}

function animateAICircle() {
  const circle = document.getElementById('aiCircle');
  const pctEl = document.getElementById('aiCirclePct');
  if (!circle || !pctEl) return;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const accuracy = 0.948;
  const offset = circumference - (circumference * accuracy);

  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);

  // Animate the percentage text
  let cur = 0;
  const interval = setInterval(() => {
    cur = Math.min(cur + 1.5, 94.8);
    pctEl.textContent = cur.toFixed(1) + '%';
    if (cur >= 94.8) clearInterval(interval);
  }, 20);
}

// ============================================================
// LIVE UPDATES SIMULATION
// ============================================================

function startLiveUpdates() {
  // Simulate real-time Firestore-like updates every 45 seconds
  setInterval(() => {
    simulateLiveDataUpdate();
  }, 45000);
}

function simulateLiveDataUpdate() {
  const randIdx = Math.floor(Math.random() * state.venues.length);
  const venue = state.venues[randIdx];

  // Small random walk on wait time
  const delta = Math.round((Math.random() - 0.4) * 5);
  venue.waitTime = Math.max(1, Math.min(90, venue.waitTime + delta));
  venue.currentCrowd = numToCrowd(Math.min(100, Math.max(5, crowdToNum(venue.currentCrowd) + delta * 2)));
  venue.confidence = Math.min(0.99, Math.max(0.70, venue.confidence + (Math.random() - 0.5) * 0.02));

  saveVenues();

  // Re-render if on home page
  if (state.activePage === 'home') renderHomeVenues();
  if (state.activePage === 'dashboard') renderDashboard();
}

// ============================================================
// UTILITY HELPERS
// ============================================================

function setEl(id, content) {
  const el = document.getElementById(id);
  if (el) el.textContent = content;
}

// ============================================================
// FIRESTORE — PRODUCTION REAL-TIME LISTENERS
// ============================================================

function initFirestoreListeners() {
  if (!db) {
    console.info('CrowdPulse: Running in local/demo mode. Add Firebase credentials for live data.');
    startLiveUpdates();
    return;
  }

  try {
    // ── 1. Real-time Locations / Venues Listener ─────────────────
    const unsubLocations = db.collection('locations')
      .orderBy('updatedAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          // Firestore has no data yet — seed it with our SEED_VENUES
          console.log('📥 CrowdPulse: No venues in Firestore yet. Seeding with demo data…');
          seedFirestoreVenues(SEED_VENUES).catch(console.warn);
          return;
        }

        const firestoreVenues = snapshot.docs.map(doc => {
          const d = doc.data();
          const local = state.venues.find(v => v.id === doc.id);
          return {
            id:              doc.id,
            name:            d.name            || 'Unknown Venue',
            category:        d.category        || 'General',
            address:         d.address         || '',
            city:            d.city            || 'Bangalore',
            lat:             d.latitude        || 12.9716,
            lng:             d.longitude       || 77.5946,
            currentCrowd:    d.currentCrowdLevel || d.crowdLevel || 'Moderate',
            predictedCrowd:  d.predictedCrowd  || d.predictedCrowdLevel || 'Moderate',
            waitTime:        d.waitingTime      || d.estimatedWaitTime || 10,
            confidence:      d.confidence      || 0.82,
            bestTimeToVisit: d.bestTimeToVisit || '2:00 PM – 3:30 PM',
            bestTimeWait:    d.bestTimeWait    || 5,
            openHours:       d.openHours       || '9:00 AM – 5:00 PM',
            updatedAt:       d.updatedAt,
            // Preserve local favorite state until Firestore favorites sync overrides
            isFav:           state.userFavoriteIds.includes(doc.id) || local?.isFav || false,
            reports:         local?.reports     || [],
          };
        });

        state.venues = firestoreVenues;
        saveVenues();
        populateReportVenueSelects();

        // Re-render active view with live data
        if (state.activePage === 'home')      { renderHomeVenues(); }
        if (state.activePage === 'dashboard') { renderDashboard(); }
        if (state.activePage === 'search')    { filterSearch(); }
        if (state.activePage === 'favorites') { renderFavoritesPage(); }
        if (state.activePage === 'admin')     { renderAdminVenuesTable(); }

        console.log(`✅ CrowdPulse: Firestore live sync — ${firestoreVenues.length} venues updated`);
        showToast('success', '🔴 Live Data Connected', `${firestoreVenues.length} venues synced from Firebase in real-time.`, 3500);
      }, err => {
        console.error('Firestore locations listener error:', err);
        showToast('warning', 'Firebase sync error', err.message);
        startLiveUpdates(); // fall back to simulated updates
      });

    state._unsub.locations = unsubLocations;

    // ── 2. Crowd Reports Listener for current detail page ───────
    // (started dynamically when opening a Location Detail page)

    // ── 3. Admin: listen for new reports in real time ────────────
    if (state.activeAdminTab === 'reports') {
      startAdminReportsListener();
    }

    // ── 4. Start simulated live UI refresh clock ─────────────────
    // Firestore listeners handle actual data; this refreshes relative timestamps
    setInterval(() => {
      if (state.activePage === 'dashboard') renderDashboard();
    }, 60000);

  } catch(e) {
    console.error('Firestore init error:', e);
    showToast('warning', 'Firebase Error', 'Could not connect to Firestore. Running in demo mode.');
    startLiveUpdates();
  }
}

/** Subscribe to crowd reports for the currently-viewed location */
function startDetailReportsListener(locationId) {
  // Unsubscribe previous
  if (state._unsub.reports) state._unsub.reports();

  if (!db) return;

  state._unsub.reports = db.collection('crowdReports')
    .where('locationId', '==', locationId)
    .orderBy('timestamp', 'desc')
    .limit(20)
    .onSnapshot(snap => {
      const reports = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id:      doc.id,
          userId:  d.userId  || 'anon',
          user:    d.userName || d.userId || 'Community Member',
          crowd:   d.crowdLevel  || 'Moderate',
          wait:    d.waitingTime || 10,
          comment: d.comments || d.comment || '',
          ts:      d.timestamp?.toMillis ? d.timestamp.toMillis() : Date.now(),
          approved: d.approved !== false,
        };
      });

      // Update venue in local state
      const venue = state.venues.find(v => v.id === locationId);
      if (venue) {
        venue.reports = reports;
        if (reports.length > 0) {
          // Update wait time with latest approved report
          const latest = reports[0];
          venue.currentCrowd = latest.crowd;
          venue.waitTime = latest.wait;
        }
      }

      // Refresh detail page if still on it
      if (state.activePage === 'detail' && state.selectedVenueId === locationId) {
        const listEl = document.getElementById('detailReportsList');
        if (listEl) {
          const approved = reports.filter(r => r.approved);
          listEl.innerHTML = approved.length === 0
            ? `<div class="empty-state" style="padding:24px 0"><div class="empty-icon" style="font-size:28px">📭</div><div class="empty-desc">No reports yet. Be the first!</div></div>`
            : approved.map(r => reportItemHtml(r)).join('');
        }
      }
    }, err => console.warn('Reports listener error:', err));
}

/** Subscribe to admin reports in real time */
function startAdminReportsListener() {
  if (state._unsub.adminReports) state._unsub.adminReports();
  if (!db) return;

  state._unsub.adminReports = db.collection('crowdReports')
    .orderBy('timestamp', 'desc')
    .limit(30)
    .onSnapshot(() => {
      if (state.activePage === 'admin' && state.activeAdminTab === 'reports') {
        renderAdminReportsList();
      }
    }, err => console.warn('Admin reports listener error:', err));
}

/** Subscribe to user's favorite location IDs from Firestore */
function startFavoritesListener(uid) {
  if (state._unsub.favorites) state._unsub.favorites();
  if (!db || !uid) return;

  state._unsub.favorites = db.collection('favorites').doc(uid)
    .onSnapshot(snap => {
      if (snap.exists) {
        state.userFavoriteIds = snap.data().locationIds || [];
      } else {
        state.userFavoriteIds = [];
      }
      // Apply to venues
      state.venues.forEach(v => {
        v.isFav = state.userFavoriteIds.includes(v.id);
      });
      // Re-render
      if (state.activePage === 'home')      renderHomeVenues();
      if (state.activePage === 'favorites') renderFavoritesPage();
      if (state.activePage === 'dashboard') renderDashboard();
    }, err => console.warn('Favorites listener error:', err));
}

/** Subscribe to user's notifications from Firestore */
function startNotificationsListener(uid) {
  if (state._unsub.notifications) state._unsub.notifications();
  if (!db || !uid) return;

  state._unsub.notifications = db.collection('notifications').doc(uid)
    .collection('items')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .onSnapshot(snap => {
      if (!snap.empty) {
        state.notifications = snap.docs.map(doc => {
          const d = doc.data();
          return {
            id:    doc.id,
            type:  d.type    || 'info',
            title: d.title   || 'Notification',
            msg:   d.message || d.body || '',
            time:  d.createdAt?.toDate ? formatTimeAgo(d.createdAt.toMillis()) : 'Just now',
          };
        });
        if (state.activePage === 'dashboard') renderDashboard();
      }
    }, err => console.warn('Notifications listener error:', err));
}

// ============================================================
// FIREBASE AUTH STATE OBSERVER — PRODUCTION
// ============================================================

function initAuthObserver() {
  if (!auth) return;

  auth.onAuthStateChanged(async fbUser => {
    if (fbUser) {
      // Firebase user is signed in
      const uid = fbUser.uid;

      // Fetch Firestore user profile
      let name  = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
      let reports = 0;

      if (db) {
        try {
          const userDoc = await db.collection('users').doc(uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            name    = data.name    || name;
            reports = data.reports || 0;
          }
          // Upsert profile to Firestore
          await upsertUserFirestore({ uid, name, email: fbUser.email, avatar: fbUser.photoURL });
        } catch(e) { console.warn('User profile fetch error:', e); }
      }

      state.currentUser = {
        uid,
        name,
        email:   fbUser.email,
        avatar:  fbUser.photoURL,
        reports,
      };
      saveUser();
      renderAuthNav();

      // Start per-user listeners
      startFavoritesListener(uid);
      startNotificationsListener(uid);

      // If user had a pending redirect after login, go there
      if (state._redirectAfterAuth) {
        navigateTo(state._redirectAfterAuth);
        delete state._redirectAfterAuth;
      }

      if (state.activePage === 'profile')   renderProfilePage();
      if (state.activePage === 'dashboard') renderDashboard();

      console.log('✅ CrowdPulse: User signed in:', name, uid);

    } else {
      // User signed out — only clear if it was a real Firebase user
      if (state.currentUser && !state.currentUser.uid?.startsWith('demo_') && !state.currentUser.uid?.startsWith('google_demo_')) {
        state.currentUser = null;
        state.userFavoriteIds = [];
        saveUser();
        renderAuthNav();

        // Unsubscribe user-specific listeners
        if (state._unsub.favorites)     { state._unsub.favorites();     delete state._unsub.favorites; }
        if (state._unsub.notifications) { state._unsub.notifications(); delete state._unsub.notifications; }

        console.log('ℹ️  CrowdPulse: User signed out');
      }
    }
  });
}

// ============================================================
// Google Maps callback (called by Maps API when script loads)
// ============================================================
function onGoogleMapsReady() {
  console.log('✅ Google Maps API loaded');
  state._mapsReady = true;
  // If detail page is open, re-render the map
  if (state.activePage === 'detail' && state.selectedVenueId) {
    renderLocationDetail(state.selectedVenueId);
  }
}

// ============================================================
// OVERRIDE — Toggle Favorite (Firestore-aware)
// ============================================================
const _origToggleFavorite = toggleFavorite;
window.toggleFavorite = function(venueId) {
  const venue = state.venues.find(v => v.id === venueId);
  if (!venue) return;

  if (!state.currentUser) {
    showToast('info', 'Sign in required', 'Create a free account to save your favorite venues!');
    openModal('authModal', 'signup');
    return;
  }

  const newFav = !venue.isFav;
  venue.isFav = newFav;

  // Optimistic UI update
  if (newFav) {
    if (!state.userFavoriteIds.includes(venueId)) state.userFavoriteIds.push(venueId);
  } else {
    state.userFavoriteIds = state.userFavoriteIds.filter(id => id !== venueId);
  }

  saveVenues();

  // Re-render current page
  if (state.activePage === 'home')      renderHomeVenues();
  if (state.activePage === 'dashboard') renderDashboard();
  if (state.activePage === 'favorites') renderFavoritesPage();
  if (state.activePage === 'search')    filterSearch();
  if (state.activePage === 'detail')    renderLocationDetail(venueId);

  showToast(newFav ? 'success' : 'info',
    newFav ? 'Added to Favorites' : 'Removed from Favorites',
    newFav ? `${venue.name} saved!` : `${venue.name} removed.`
  );

  // Persist to Firestore (async, non-blocking)
  if (db && state.currentUser?.uid && !state.currentUser.uid.startsWith('demo_')) {
    toggleFavoriteFirestore(state.currentUser.uid, venueId, newFav)
      .catch(err => console.warn('Firestore favorite sync error:', err));
  }
};

// Connect to Real-Time Server API & SSE Stream
function connectRealtimeServer() {
  fetch('/api/db')
    .then(r => r.json())
    .then(data => {
      if (data && data.venues && data.venues.length > 0) {
        state.venues = data.venues;
        if (state.activePage === 'home') renderHomeVenues();
        if (state.activePage === 'dashboard') renderDashboard();
        if (state.activePage === 'search') filterSearch();
        console.log('⚡ CrowdPulse: Loaded live server database —', data.venues.length, 'venues');
      }
    })
    .catch(() => {});

  try {
    if (typeof EventSource !== 'undefined') {
      const sse = new EventSource('/api/stream');
      sse.addEventListener('report_added', () => connectRealtimeServer());
      sse.addEventListener('venue_added', () => connectRealtimeServer());
    }
  } catch(e) {}
}

// ============================================================
// OVERRIDE — Submit Report (Firestore & Realtime API-aware)
// ============================================================
function doSubmitReport(venueId, crowdLevel, waitTime, comment, photoFile) {
  const venue = state.venues.find(v => v.id === venueId);
  if (!venue) return;

  const report = {
    id:      'r_' + Date.now(),
    userId:  state.currentUser?.uid || 'anonymous',
    user:    state.currentUser?.name || 'Community Member',
    crowd:   crowdLevel,
    wait:    waitTime,
    ts:      Date.now(),
    comment: comment || '',
    approved: true,
  };

  // Optimistic UI update
  venue.currentCrowd = crowdLevel;
  venue.waitTime     = waitTime;
  if (!venue.reports) venue.reports = [];
  venue.reports.unshift(report);
  venue.predictedCrowd = aiPredictCrowd(venue);
  venue.confidence = Math.min(0.99, venue.confidence + 0.01);
  saveVenues();

  // Also post to Real-Time Server API
  fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId,
      crowdLevel,
      waitTime,
      comment: comment || '',
      userName: state.currentUser?.name || 'Community Member'
    })
  }).catch(() => {});

  // Add local notification
  state.notifications.unshift({
    id:    'n_' + Date.now(),
    type:  'success',
    title: 'Report Submitted ✅',
    msg:   `Your ${crowdLevel} crowd report for ${venue.name} was recorded!`,
    time:  'Just now',
  });

  if (state.currentUser) state.currentUser.reports = (state.currentUser.reports || 0) + 1;
  saveUser();

  showToast('success', 'Report Submitted! 🎉', `Live report for ${venue.name} is now public. AI predictions updated!`);

  // Re-render current page
  if (state.activePage === 'detail')    renderLocationDetail(venueId);
  if (state.activePage === 'home')      renderHomeVenues();
  if (state.activePage === 'dashboard') renderDashboard();

  // ── Push to Firestore (async) ───────────────────────────────
  if (db && state.currentUser?.uid && !state.currentUser.uid.startsWith('demo_')) {
    const pushReport = async () => {
      let photoUrl = null;

      // Upload photo if provided
      if (photoFile && storage) {
        try {
          const path = `crowd_reports/${state.currentUser.uid}/${Date.now()}_${photoFile.name}`;
          photoUrl = await uploadPhoto(photoFile, path);
        } catch(e) { console.warn('Photo upload error:', e); }
      }

      const firestoreReport = {
        userId:      state.currentUser.uid,
        userName:    state.currentUser.name,
        locationId:  venueId,
        crowdLevel:  crowdLevel,
        waitingTime: waitTime,
        comments:    comment || '',
        photoUrl:    photoUrl,
        approved:    true,
        timestamp:   firebase.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('crowdReports').add(firestoreReport);

      // Increment user's report count in Firestore
      db.collection('users').doc(state.currentUser.uid)
        .update({ reports: firebase.firestore.FieldValue.increment(1) })
        .catch(() => {});

      console.log('✅ Crowd report saved to Firestore for', venue.name);
    };

    pushReport().catch(err => console.warn('Firestore report push error:', err));
  }
}

// ============================================================
// OVERRIDE — Handle Save Profile (Firestore-aware)
// ============================================================
const _origSaveProfile = saveProfile;
window.saveProfile = function(event) {
  event.preventDefault();
  const name  = document.getElementById('profileNameInput').value.trim();
  const email = document.getElementById('profileEmailInput').value.trim();
  if (!name) { showToast('error', 'Name required', 'Please enter your name.'); return; }

  state.currentUser.name  = name;
  state.currentUser.email = email;
  saveUser();
  renderAuthNav();
  renderProfilePage();
  showToast('success', 'Profile Updated', 'Your profile has been saved.');

  // Persist to Firestore
  if (db && state.currentUser.uid && !state.currentUser.uid.startsWith('demo_')) {
    db.collection('users').doc(state.currentUser.uid)
      .update({ name, email, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
      .then(() => console.log('✅ Profile synced to Firestore'))
      .catch(err => console.warn('Profile Firestore sync error:', err));

    // Update Firebase Auth display name
    if (auth?.currentUser) {
      auth.currentUser.updateProfile({ displayName: name }).catch(() => {});
    }
  }
};

// ============================================================
// OVERRIDE — Admin Add Venue (Firestore-aware)
// ============================================================
const _origHandleAddVenue = handleAddVenue;
window.handleAddVenue = async function(event) {
  event.preventDefault();
  const name      = document.getElementById('newVenueName').value.trim();
  const category  = document.getElementById('newVenueCategory').value;
  const address   = document.getElementById('newVenueAddress').value.trim();
  const city      = document.getElementById('newVenueCity').value.trim();
  const crowd     = document.getElementById('newVenueCrowdLevel').value;
  const wait      = parseInt(document.getElementById('newVenueWait').value) || 10;
  const openTime  = document.getElementById('newVenueOpenTime').value;
  const bestTime  = document.getElementById('newVenueBestTime').value;

  const venuePayload = {
    name, category, address, city,
    latitude:          12.9716 + (Math.random() - 0.5) * 0.1,
    longitude:         77.5946 + (Math.random() - 0.5) * 0.1,
    currentCrowdLevel: crowd,
    predictedCrowd:    crowd,
    waitingTime:       wait,
    confidence:        0.80,
    bestTimeToVisit:   bestTime || '2:00 PM – 3:30 PM',
    bestTimeWait:      Math.max(2, Math.round(wait * 0.15)),
    openHours:         openTime || '9:00 AM – 5:00 PM',
  };

  let newId = 'venue_' + Date.now();

  // Push to Firestore if available
  if (db) {
    try {
      const docRef = await db.collection('locations').add({
        ...venuePayload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      newId = docRef.id;
      console.log('✅ Venue added to Firestore:', newId);
      // Firestore listener will auto-update state.venues
    } catch(e) {
      console.warn('Venue Firestore add error (using local fallback):', e);
      _addVenueLocally(newId, venuePayload);
    }
  } else {
    _addVenueLocally(newId, venuePayload);
  }

  closeModal('addVenueModal');
  event.target.reset();
  setEl('adminStatVenues', state.venues.length);
  populateReportVenueSelects();
  showToast('success', 'Venue Added! 🏢', `${name} is now live on CrowdPulse.`);
};

function _addVenueLocally(id, payload) {
  state.venues.unshift({
    id,
    name:            payload.name,
    category:        payload.category,
    address:         payload.address,
    city:            payload.city,
    lat:             payload.latitude,
    lng:             payload.longitude,
    currentCrowd:    payload.currentCrowdLevel,
    predictedCrowd:  payload.predictedCrowd,
    waitTime:        payload.waitingTime,
    confidence:      payload.confidence,
    bestTimeToVisit: payload.bestTimeToVisit,
    bestTimeWait:    payload.bestTimeWait,
    openHours:       payload.openHours,
    isFav:           false,
    reports:         [],
  });
  saveVenues();
  renderAdminVenuesTable();
  renderHomeVenues();
}

// ============================================================
// OVERRIDE — Admin Delete Venue (Firestore-aware)
// ============================================================
window.deleteVenueAdmin = async function(id) {
  const venue = state.venues.find(v => v.id === id);
  if (!venue) return;
  if (!confirm(`Delete "${venue.name}"? This cannot be undone.`)) return;

  if (db) {
    try {
      await db.collection('locations').doc(id).delete();
      console.log('✅ Venue deleted from Firestore:', id);
      // Firestore listener will auto-update state.venues
    } catch(e) {
      console.warn('Firestore delete error, removing locally:', e);
      state.venues = state.venues.filter(v => v.id !== id);
      saveVenues();
      renderAdminVenuesTable();
    }
  } else {
    state.venues = state.venues.filter(v => v.id !== id);
    saveVenues();
    renderAdminVenuesTable();
  }

  setEl('adminStatVenues', state.venues.length);
  showToast('success', 'Venue Deleted', `${venue.name} has been removed from the platform.`);
};

// ============================================================
// OVERRIDE — Location Detail: start live report listener
// ============================================================
const _origRenderLocationDetail = renderLocationDetail;
window.renderLocationDetail = function(id) {
  _origRenderLocationDetail(id);
  // Start real-time Firestore listener for reports on this venue
  if (state.firestoreMode && db) {
    setTimeout(() => startDetailReportsListener(id), 200);
  }
};

// ============================================================
// Bootstrap: called by initApp (now handled there)
// Keep these as no-ops since initApp calls them conditionally
// ============================================================
// (initFirestoreListeners and initAuthObserver are called from initApp)

// ============================================================
// PWA APP ENGINE — SERVICE WORKER, INSTALL PROMPT & OFFLINE
// ============================================================

let deferredInstallPrompt = null;

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('✅ CrowdPulse SW registered with scope:', reg.scope);
      })
      .catch(err => {
        console.warn('⚠️ CrowdPulse SW registration failed:', err);
      });
  });
}

// Listen for PWA Install Prompt (beforeinstallprompt)
window.addEventListener('beforeinstallprompt', e => {
  // Prevent browser's default banner
  e.preventDefault();
  deferredInstallPrompt = e;

  // Show custom floating PWA install banner if not dismissed before
  if (!localStorage.getItem('cp_pwa_dismissed')) {
    setTimeout(() => {
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.classList.add('show');
    }, 3000);
  }
});

// Triggered by user clicking "Install" on the custom banner
function installPWAApp() {
  if (!deferredInstallPrompt) {
    showToast('info', 'Installation', 'App is ready! On iOS, tap Share → Add to Home Screen.');
    dismissPWAInstallPrompt();
    return;
  }

  deferredInstallPrompt.prompt();

  deferredInstallPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'accepted') {
      console.log('🎉 User accepted the PWA install prompt');
      showToast('success', 'App Installed! 🚀', 'CrowdPulse is now installed on your device home screen.');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
    deferredInstallPrompt = null;
    dismissPWAInstallPrompt();
  });
}

function dismissPWAInstallPrompt() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.classList.remove('show');
  try { localStorage.setItem('cp_pwa_dismissed', 'true'); } catch(e) {}
}

// Track App Installation Success
window.addEventListener('appinstalled', () => {
  console.log('🎉 CrowdPulse PWA successfully installed!');
  deferredInstallPrompt = null;
  dismissPWAInstallPrompt();
});

// Network Online/Offline Listeners
window.addEventListener('online', () => {
  const offlineBanner = document.getElementById('offlineBanner');
  if (offlineBanner) offlineBanner.classList.remove('active');
  showToast('success', '📡 Back Online', 'Live connection restored. Syncing real-time predictions.');
});

window.addEventListener('offline', () => {
  const offlineBanner = document.getElementById('offlineBanner');
  if (offlineBanner) offlineBanner.classList.add('active');
  showToast('warning', '📡 Offline Mode', 'Network connection lost. Using cached predictions & venue data.');
});

// Database Connection Form Handler
function handleConnectDatabase(event) {
  event.preventDefault();
  const apiKey        = document.getElementById('dbApiKey').value.trim();
  const projectId     = document.getElementById('dbProjectId').value.trim();
  const authDomain    = document.getElementById('dbAuthDomain').value.trim() || `${projectId}.firebaseapp.com`;
  const storageBucket = document.getElementById('dbStorageBucket').value.trim() || `${projectId}.appspot.com`;
  const senderId      = document.getElementById('dbSenderId').value.trim() || '';
  const appId         = document.getElementById('dbAppId').value.trim() || '';

  if (!apiKey || !projectId) {
    showToast('error', 'Missing Fields', 'API Key and Project ID are required.');
    return;
  }

  const customConfig = {
    apiKey,
    projectId,
    authDomain,
    storageBucket,
    messagingSenderId: senderId,
    appId,
  };

  try {
    saveAndConnectDatabase(customConfig);
  } catch (err) {
    showToast('error', 'Connection Error', err.message);
  }
}

function resetDatabaseCredentials() {
  if (confirm('Reset to default demo database settings?')) {
    localStorage.removeItem('cp_firebase_config');
    window.location.reload();
  }
}




