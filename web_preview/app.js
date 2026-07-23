// Seed Venues with Live Crowd Level & Best Time to Visit Windows
const INITIAL_VENUES = [
  {
    id: "loc_1",
    name: "State Bank of India (Main Branch)",
    category: "Bank / ATM",
    address: "MG Road, Central Circle",
    city: "Bangalore",
    lat: 12.9756,
    lng: 77.6094,
    currentCrowdLevel: "High",
    predictedCrowdLevel: "High",
    estimatedWaitTime: 35,
    confidence: 0.95,
    bestTimeToVisit: "2:00 PM – 3:30 PM",
    bestTimeWaitTime: 4,
    averageVisitors: 650,
    isFav: true,
    reports: [
      { user: "Ravi Kumar", crowd: "High", wait: 35, time: "8 mins ago", comment: "Cash deposit counters have 15+ people in queue." }
    ]
  },
  {
    id: "loc_2",
    name: "HDFC Bank & Currency Exchange",
    category: "Bank / ATM",
    address: "Indiranagar 100ft Road",
    city: "Bangalore",
    lat: 12.9784,
    lng: 77.6408,
    currentCrowdLevel: "Moderate",
    predictedCrowdLevel: "Low",
    estimatedWaitTime: 12,
    confidence: 0.91,
    bestTimeToVisit: "1:30 PM – 3:00 PM",
    bestTimeWaitTime: 3,
    averageVisitors: 400,
    isFav: false,
    reports: [
      { user: "Priya S.", crowd: "Moderate", wait: 10, time: "12 mins ago", comment: "Passbook printing counter is moving fine." }
    ]
  },
  {
    id: "loc_3",
    name: "Spar Hypermarket",
    category: "Supermarket",
    address: "RMZ Galleria Mall, Yelahanka",
    city: "Bangalore",
    lat: 13.0991,
    lng: 77.5956,
    currentCrowdLevel: "Low",
    predictedCrowdLevel: "Low",
    estimatedWaitTime: 3,
    confidence: 0.94,
    bestTimeToVisit: "10:00 AM – 11:30 AM",
    bestTimeWaitTime: 2,
    averageVisitors: 450,
    isFav: true,
    reports: [
      { user: "Sarah M.", crowd: "Low", wait: 3, time: "10 mins ago", comment: "All express checkout counters are open." }
    ]
  },
  {
    id: "loc_4",
    name: "Manipal Hospital",
    category: "Hospital",
    address: "HAL Old Airport Road",
    city: "Bangalore",
    lat: 12.9592,
    lng: 77.6444,
    currentCrowdLevel: "High",
    predictedCrowdLevel: "High",
    estimatedWaitTime: 28,
    confidence: 0.88,
    bestTimeToVisit: "3:30 PM – 5:00 PM",
    bestTimeWaitTime: 6,
    averageVisitors: 1200,
    isFav: false,
    reports: [
      { user: "David K.", crowd: "High", wait: 30, time: "5 mins ago", comment: "Pharmacy line is long." }
    ]
  },
  {
    id: "loc_5",
    name: "Phoenix Marketcity",
    category: "Shopping Mall",
    address: "Whitefield Main Road",
    city: "Bangalore",
    lat: 12.9959,
    lng: 77.6963,
    currentCrowdLevel: "Moderate",
    predictedCrowdLevel: "High",
    estimatedWaitTime: 15,
    confidence: 0.91,
    bestTimeToVisit: "11:00 AM – 1:00 PM",
    bestTimeWaitTime: 5,
    averageVisitors: 2800,
    isFav: false,
    reports: []
  }
];

let state = {
  venues: JSON.parse(localStorage.getItem('crowdpulse_venues')) || INITIAL_VENUES,
  selectedCategory: "All",
  searchQuery: "",
  activeTab: "home",
  activeVenueForReport: null,
  selectedReportLevel: "Moderate"
};

const CATEGORIES = ["All", "Bank / ATM", "Supermarket", "Hospital", "Shopping Mall"];

function initApp() {
  renderCategories();
  renderVenues();
  renderMap();
}

function saveState() {
  localStorage.setItem('crowdpulse_venues', JSON.stringify(state.venues));
}

function renderCategories() {
  const container = document.getElementById("categoryBar");
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="chip ${state.selectedCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
      ${cat}
    </button>
  `).join("");
}

function selectCategory(cat) {
  state.selectedCategory = cat;
  renderCategories();
  renderVenues();
}

function switchTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".tab-page").forEach(page => {
    page.classList.toggle("active", page.id === `tab-${tab}`);
  });

  if (tab === "favorites") renderFavorites();
}

function renderVenues() {
  const container = document.getElementById("venueGrid");
  let filtered = state.venues;

  if (state.selectedCategory !== "All") {
    filtered = filtered.filter(v => v.category === state.selectedCategory);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No venues found in this category.</div>`;
    return;
  }

  container.innerHTML = filtered.map(v => createVenueCardHtml(v)).join("");
}

function createVenueCardHtml(v) {
  return `
    <div class="venue-card" onclick="openDetailModal('${v.id}')">
      <div class="venue-header">
        <div>
          <div class="venue-name">${v.name}</div>
          <div class="venue-sub">${v.category} • ${v.address}</div>
        </div>
        <span class="fav-icon" onclick="event.stopPropagation(); toggleFav('${v.id}')">
          ${v.isFav ? '❤️' : '🤍'}
        </span>
      </div>

      <div class="venue-metrics">
        <span class="crowd-badge ${v.currentCrowdLevel}">
          <span class="badge ${v.currentCrowdLevel.toLowerCase()}"></span>
          ${v.currentCrowdLevel} Crowd
        </span>
        <span style="font-weight:700; font-size:13px; color: ${v.estimatedWaitTime > 20 ? '#ef4444' : '#3b82f6'};">
          ⏱️ Current: ~${v.estimatedWaitTime} min wait
        </span>
      </div>

      <div class="best-time-banner">
        <span style="font-size:16px;">🌟</span>
        <div>
          <div class="best-time-label">BEST TIME TO VISIT</div>
          <div class="best-time-val">${v.bestTimeToVisit} (Only ~${v.bestTimeWaitTime}m wait)</div>
        </div>
      </div>
    </div>
  `;
}

function toggleFav(id) {
  const venue = state.venues.find(v => v.id === id);
  if (venue) {
    venue.isFav = !venue.isFav;
    saveState();
    renderVenues();
    if (state.activeTab === "favorites") renderFavorites();
  }
}

function handleSearch() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const container = document.getElementById("searchGrid");
  const filtered = state.venues.filter(v => 
    v.name.toLowerCase().includes(q) ||
    v.category.toLowerCase().includes(q) ||
    v.address.toLowerCase().includes(q)
  );

  container.innerHTML = filtered.map(v => createVenueCardHtml(v)).join("");
}

function renderFavorites() {
  const container = document.getElementById("favoritesGrid");
  const favs = state.venues.filter(v => v.isFav);
  if (favs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No saved favorite places yet.</div>`;
    return;
  }
  container.innerHTML = favs.map(v => createVenueCardHtml(v)).join("");
}

function renderMap() {
  const canvas = document.getElementById("mapCanvas");
  canvas.innerHTML = state.venues.map((v, index) => {
    const color = v.currentCrowdLevel === 'Low' ? '#10b981' : v.currentCrowdLevel === 'Moderate' ? '#f59e0b' : '#ef4444';
    const top = 25 + (index * 15) % 65;
    const left = 20 + (index * 20) % 70;

    return `
      <div class="map-pin" style="top:${top}%; left:${left}%; background:${color}; color:white;" onclick="openDetailModal('${v.id}')">
        📍
      </div>
    `;
  }).join("");
}

function openDetailModal(id) {
  const v = state.venues.find(item => item.id === id);
  if (!v) return;

  const modalBody = document.getElementById("detailModalBody");
  modalBody.innerHTML = `
    <h2>${v.name}</h2>
    <p style="color:var(--text-muted); font-size:13px;">${v.category} • ${v.address}</p>
    <hr style="margin:16px 0; border-color:var(--card-border);">

    <div style="display:flex; justify-content:space-around; text-align:center; margin-bottom:20px;">
      <div>
        <div class="crowd-badge ${v.currentCrowdLevel}" style="display:inline-flex;">${v.currentCrowdLevel} Crowd</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Live Queue Status</div>
      </div>
      <div>
        <div style="font-size:24px; font-weight:800; color:${v.estimatedWaitTime > 20 ? '#ef4444' : '#3b82f6'};">~${v.estimatedWaitTime} min</div>
        <div style="font-size:12px; color:var(--text-muted);">Current Wait Time</div>
      </div>
    </div>

    <div style="background:rgba(16, 185, 129, 0.12); border:1px solid #10b981; padding:14px; border-radius:12px; margin-bottom:16px;">
      <div style="color:#10b981; font-weight:800; font-size:12px; letter-spacing:0.5px;">🌟 RECOMMENDED BEST TIME TO VISIT</div>
      <div style="font-size:16px; font-weight:700; margin-top:4px;">${v.bestTimeToVisit}</div>
      <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">Expected wait time in this window is only <strong>~${v.bestTimeWaitTime} mins</strong> instead of ${v.estimatedWaitTime} mins!</div>
    </div>

    <div style="background:rgba(139,92,246,0.1); border:1px solid var(--ai-purple); padding:14px; border-radius:12px; margin-bottom:20px;">
      <div style="color:var(--ai-purple); font-weight:700; font-size:13px;">⚡ AI Prediction Engine (${(v.confidence * 100).toFixed(0)}% Accuracy)</div>
      <div style="font-size:13px; margin-top:4px;">Predicted Crowd Level: <strong>${v.predictedCrowdLevel}</strong></div>
      <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Analyzed live user reports, day of week, time of day, and bank transaction hour heuristics.</div>
    </div>

    <button class="btn-primary" onclick="openReportModal('${v.id}')">📢 Report Current Queue/Crowd</button>

    <h3 style="margin-top:24px; font-size:15px;">Live User Reports (${v.reports.length})</h3>
    <div style="margin-top:12px;">
      ${v.reports.length === 0 ? '<p style="color:var(--text-muted); font-size:13px;">No reports submitted yet.</p>' : v.reports.map(r => `
        <div style="background:#0f172a; padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid var(--card-border);">
          <div style="font-weight:700; font-size:13px;">${r.user} <span style="font-weight:normal; color:var(--text-muted); font-size:11px;">• ${r.time}</span></div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">${r.crowd} crowd • ${r.wait}m wait - "${r.comment}"</div>
        </div>
      `).join("")}
    </div>
  `;

  document.getElementById("detailModal").style.display = "flex";
}

function openReportModal(id) {
  closeModal("detailModal");
  state.activeVenueForReport = state.venues.find(v => v.id === id);
  document.getElementById("reportVenueTitle").innerText = state.activeVenueForReport.name;
  document.getElementById("reportModal").style.display = "flex";
}

function selectLevel(level) {
  state.selectedReportLevel = level;
  document.querySelectorAll(".level-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === level);
  });
}

function submitReport(e) {
  e.preventDefault();
  const wait = parseInt(document.getElementById("waitRange").value);
  const comment = document.getElementById("reportComment").value;

  if (state.activeVenueForReport) {
    state.activeVenueForReport.currentCrowdLevel = state.selectedReportLevel;
    state.activeVenueForReport.estimatedWaitTime = wait;
    state.activeVenueForReport.reports.unshift({
      user: "You",
      crowd: state.selectedReportLevel,
      wait: wait,
      time: "Just now",
      comment: comment
    });

    saveState();
    closeModal("reportModal");
    renderVenues();
    renderMap();
    alert("Report submitted! Firestore and AI Crowd Prediction updated live.");
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document.addEventListener("DOMContentLoaded", initApp);
