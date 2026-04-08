import { useEffect, useState, useCallback } from "react";

// ── CONFIG: เปลี่ยนเป็น URL ของ Render backend ตอน deploy
const API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
// ── Helpers
function getInitial(name) {
  return name ? name.trim()[0].toUpperCase() : "?";
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-TH", {
    day: "numeric", month: "short", year: "numeric",
  });
}
function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return formatDate(dateStr);
}
function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered")
    return <span className="badge b-delivered">✅ Delivered</span>;
  if (s === "in transit" || s === "transit")
    return <span className="badge b-transit">🚚 In Transit</span>;
  if (s === "processing")
    return <span className="badge b-processing">⚙️ Processing</span>;
  return <span className="badge b-pending">⏳ Pending</span>;
}
function activityDotColor(type) {
  const map = { delivered: "green", payment: "amber", created: "red", arrived: "blue", transit: "blue" };
  return map[(type || "").toLowerCase()] || "blue";
}
function activityIcon(type) {
  const map = { delivered: "✅", payment: "💳", created: "📦", arrived: "🚚", transit: "🚚" };
  return map[(type || "").toLowerCase()] || "📋";
}
function notifDotClass(type) {
  const map = { info: "nd-blue", warning: "nd-amber", success: "nd-green", error: "nd-red" };
  return map[(type || "").toLowerCase()] || "nd-blue";
}

// ── API Fetch wrapper
async function apiFetch(path) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API error [${path}]:`, err.message);
    return null;
  }
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function UserDashboard() {
  const USER_ID = localStorage.getItem("userId") || 1;

  const [user, setUser]             = useState({ name: "Loading…", email: "…" });
  const [stats, setStats]           = useState({});
  const [shipments, setShipments]   = useState([]);
  const [notifs, setNotifs]         = useState([]);
  const [activity, setActivity]     = useState([]);
  const [chartData, setChartData]   = useState([]);
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread]         = useState(0);
  const [topbarDate, setTopbarDate] = useState("");

  // ── Load all data
  useEffect(() => {
    const now = new Date();
    setTopbarDate(now.toLocaleDateString("en-TH", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }));

    async function init() {
      // Profile
      let u = await apiFetch(`/user/profile/${USER_ID}`);
      if (!u) {
        u = {
          name: localStorage.getItem("userName") || "Somchai Jaidee",
          email: localStorage.getItem("userEmail") || "somchai@example.com",
          created_at: null,
        };
      }
      localStorage.setItem("userName", u.name);
      localStorage.setItem("userEmail", u.email || "—");
      setUser(u);

      // Stats
      const st = await apiFetch(`/user/stats/${USER_ID}`);
      if (st) setStats(st);

      // Shipments
      const sh = await apiFetch(`/shipments/${USER_ID}`);
      if (sh) setShipments(sh);

      // Notifications
      const nf = await apiFetch(`/notifications/${USER_ID}`);
      if (nf) {
        setNotifs(nf.slice(0, 4));
        setUnread(nf.filter((n) => !n.is_read).length);
      }

      // Activity
      const ev = await apiFetch(`/activity/${USER_ID}`);
      if (ev) setActivity(ev.slice(0, 5));

      // Chart
      const ch = await apiFetch(`/shipments/monthly/${USER_ID}`);
      if (ch) setChartData(ch);
    }
    init();
  }, [USER_ID]);

  // ── Quick Track
  const doTrack = useCallback(async () => {
    const val = trackInput.trim().toUpperCase();
    if (!val) return;
    setTrackLoading(true);
    setTrackResult(null);
    const data = await apiFetch(`/shipments/track/${val}`);
    setTrackLoading(false);
    if (!data || data.error) {
      setTrackResult({ error: true });
    } else {
      setTrackResult({ ...data, val });
    }
  }, [trackInput]);

  // ── Mark all notifications read
  const markAllRead = useCallback(async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/notifications/${USER_ID}/read-all`, { method: "PATCH" });
    } catch (_) {}
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
  }, [USER_ID]);

  // ── Chart max
  const maxV = Math.max(...chartData.map((d) => d.count), 1);

  const since = user.created_at
    ? `Member since ${new Date(user.created_at).getFullYear()}`
    : "Member";

  return (
    <>
      {/* ── Inject CSS ── */}
      <style>{CSS}</style>

      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      {sidebarOpen && (
        <div className="overlay show" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════ SIDEBAR ════ */}
      <nav className={`sidebar${sidebarOpen ? " open" : ""}`} id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-s">📮</div>
          <div className="logo-text-s">
            <h2>Post Office</h2>
            <p>Management System</p>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{getInitial(user.name)}</div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{since}</p>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          <a href="/" className="nav-item active">
            <span className="nav-icon">🏠</span> Dashboard
          </a>
          <a href="/tracking" className="nav-item">
            <span className="nav-icon">📍</span> Track Parcel
          </a>
          <a href="/create-shipment" className="nav-item">
            <span className="nav-icon">📦</span> Create Shipment
          </a>
          <a href="/history" className="nav-item">
            <span className="nav-icon">📋</span> Shipment History
            <span className="nav-badge">{shipments.length || "—"}</span>
          </a>
          <div className="nav-section-label">Account</div>
          <a href="/payments" className="nav-item">
            <span className="nav-icon">💳</span> Payments
          </a>
          <a href="/settings" className="nav-item">
            <span className="nav-icon">⚙️</span> Settings
          </a>
        </div>

        <div className="sidebar-logout">
          <a href="/login" className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span>Log Out</span>
          </a>
        </div>
        <div className="sidebar-footer">© 2024 Thai Post Office System</div>
      </nav>

      {/* ════ TOPBAR ════ */}
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="topbar-title">
          <h1>{`${getGreeting()}, ${user.name.split(" ")[0]} ☀️`}</h1>
          <p>{topbarDate}</p>
        </div>
        <div className="topbar-search">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search tracking ID…"
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
          />
        </div>
        <div className="topbar-actions">
          <div className="topbar-avatar">{getInitial(user.name)}</div>
        </div>
      </header>

      {/* ════ MAIN ════ */}
      <main className="main">

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="wb-text">
            <h2>Welcome back, {user.name.split(" ")[0]}!</h2>
            <p>
              You have <strong>{stats.transit ?? 0} parcel{stats.transit !== 1 ? "s" : ""}</strong> currently in transit
              {stats.pending > 0 && (
                <> and <strong>{stats.pending} pending payment{stats.pending !== 1 ? "s" : ""}</strong></>
              )}. Everything is on track!
            </p>
          </div>
          <div className="wb-actions">
            <a href="/create-shipment" className="btn-primary">📦 New Shipment</a>
            <a href="/tracking" className="btn-outline">📍 Track Parcel</a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {[
            { color: "red",   icon: "📦", label: "Total Shipments", val: stats.total },
            { color: "green", icon: "✅", label: "Delivered",        val: stats.delivered },
            { color: "blue",  icon: "🚚", label: "In Transit",       val: stats.transit },
            { color: "amber", icon: "⏳", label: "Pending",          val: stats.pending },
          ].map(({ color, icon, label, val }) => (
            <div className={`stat-card ${color}`} key={label}>
              <div className="stat-top">
                <div className={`stat-icon-wrap ic-${color}`}>{icon}</div>
              </div>
              <div className="stat-num">{val ?? <span className="skeleton skel-num">&nbsp;&nbsp;&nbsp;</span>}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="content-grid">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Recent Shipments */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-icon">📦</div>
                  <div><h3>Recent Shipments</h3><p>Your last {shipments.length} shipments</p></div>
                </div>
                <a href="/history" className="see-all">View all →</a>
              </div>
              <div className="card-body" style={{ paddingTop: 10 }}>
                <table className="ship-table">
                  <thead>
                    <tr>
                      <th>Tracking ID</th><th>Destination</th>
                      <th>Date</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: ".82rem" }}>
                          No shipments found.
                        </td>
                      </tr>
                    ) : shipments.map((s) => (
                      <tr key={s.tracking_number}>
                        <td><span className="tid">{s.tracking_number}</span></td>
                        <td className="dest-cell">{s.destination}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>{formatDate(s.created_at)}</td>
                        <td>{statusBadge(s.status)}</td>
                        <td><a href={`/tracking?id=${s.tracking_number}`} className="see-all">Track</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Track */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-icon blue-ic">📍</div>
                  <div><h3>Quick Track</h3><p>Enter a tracking number</p></div>
                </div>
              </div>
              <div className="card-body">
                <div className="track-input-row">
                  <input
                    type="text"
                    className="track-input"
                    placeholder="e.g. TH-2024-0089"
                    value={trackInput}
                    onChange={(e) => { setTrackInput(e.target.value); setTrackResult(null); }}
                    onKeyDown={(e) => e.key === "Enter" && doTrack()}
                  />
                  <button className="track-btn" onClick={doTrack}>Track →</button>
                </div>
                {trackLoading && (
                  <div className="track-result show" style={{ textAlign: "center", color: "var(--text-muted)", fontSize: ".82rem" }}>
                    🔍 Searching…
                  </div>
                )}
                {trackResult && !trackLoading && (
                  <div className="track-result show">
                    {trackResult.error ? (
                      <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: ".83rem" }}>
                        ❌ Tracking number not found. Please check and try again.
                      </div>
                    ) : (
                      <>
                        <div className="tr-header">
                          <span className="tr-status-badge">
                            {trackResult.status ? trackResult.status.charAt(0).toUpperCase() + trackResult.status.slice(1) : "Unknown"}
                          </span>
                          <span className="tr-id">{trackResult.val}</span>
                        </div>
                        <div className="tr-info">
                          <div className="tr-field"><label>Origin</label><p>{trackResult.origin || "—"}</p></div>
                          <div className="tr-field"><label>Destination</label><p>{trackResult.destination || trackResult.dest || "—"}</p></div>
                          <div className="tr-field"><label>Est. Delivery</label><p>{trackResult.eta ? formatDate(trackResult.eta) : "—"}</p></div>
                          <div className="tr-field"><label>Last Update</label><p>{trackResult.last_update || "—"}</p></div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div className="right-col">

            {/* Profile Card */}
            <div className="profile-card">
              <div className="pc-avatar">{getInitial(user.name)}</div>
              <div className="pc-name">{user.name}</div>
              <div className="pc-email">{user.email || "—"}</div>
              <div className="pc-stats">
                <div className="pc-stat">
                  <div className="pc-stat-num">{stats.total ?? "—"}</div>
                  <div className="pc-stat-label">Shipments</div>
                </div>
                <div className="pc-stat">
                  <div className="pc-stat-num">{stats.delivered ?? "—"}</div>
                  <div className="pc-stat-label">Delivered</div>
                </div>
                <div className="pc-stat">
                  <div className="pc-stat-num">{stats.totalSpend ? `฿${Number(stats.totalSpend).toLocaleString()}` : "฿0"}</div>
                  <div className="pc-stat-label">Spent</div>
                </div>
              </div>
              <button className="pc-edit-btn">✏️ Edit Profile</button>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-icon amber-ic">⚡</div>
                  <div><h3>Quick Actions</h3></div>
                </div>
              </div>
              <div className="card-body">
                <div className="qa-grid">
                  {[
                    { href: "/create-shipment", icon: "📦", label: "New Shipment" },
                    { href: "/tracking",        icon: "📍", label: "Track Parcel" },
                    { href: "/payments",        icon: "💳", label: "Make Payment" },
                    { href: "/history",         icon: "📋", label: "View History" },
                  ].map(({ href, icon, label }) => (
                    <a href={href} className="qa-btn" key={label}>
                      <span className="qa-btn-icon">{icon}</span>
                      <span className="qa-btn-label">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-left">
                  <div className="card-icon">🔔</div>
                  <div><h3>Notifications</h3><p>{unread} unread</p></div>
                </div>
                <a href="#" className="see-all" onClick={markAllRead}>Mark all read</a>
              </div>
              <div className="card-body" style={{ paddingTop: 8 }}>
                <div className="notif-list">
                  {notifs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 16, color: "var(--text-muted)", fontSize: ".82rem" }}>No notifications.</div>
                  ) : notifs.map((n, i) => (
                    <div className={`notif-item${!n.is_read ? " notif-unread" : ""}`} key={i}>
                      <div className={`notif-dot-i ${notifDotClass(n.type)}`} />
                      <div className="notif-body">
                        <p>{n.message}</p>
                        <span>{formatTimeAgo(n.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Full Row: Chart + Activity */}
        <div className="content-grid full-row">

          {/* Chart */}
          <div className="card">
            <div className="card-head">
              <div className="card-head-left">
                <div className="card-icon green-ic">📊</div>
                <div><h3>Shipment Activity</h3><p>Last 6 months overview</p></div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {chartData.length === 0 ? (
                  <div style={{ width: "100%", textAlign: "center", color: "var(--text-muted)", fontSize: ".82rem", padding: "40px 0" }}>
                    No chart data available.
                  </div>
                ) : chartData.map((d) => (
                  <div className="bar-group" key={d.month}>
                    <div className="bar-wrap">
                      <div className="bar" style={{ height: `${(d.count / maxV) * 100}%` }}>
                        <div className="bar-tooltip">{d.count} shipment{d.count !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div className="bar-label">{d.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card">
            <div className="card-head">
              <div className="card-head-left">
                <div className="card-icon">🕐</div>
                <div><h3>Recent Activity</h3><p>Latest updates</p></div>
              </div>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              <div className="tl-list">
                {activity.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 16, color: "var(--text-muted)", fontSize: ".82rem" }}>No recent activity.</div>
                ) : activity.map((e, i) => (
                  <div className="tl-item" key={i}>
                    <div className="tl-dot-wrap">
                      <div className={`tl-dot ${activityDotColor(e.type)}`}>{activityIcon(e.type)}</div>
                      <div className="tl-line" />
                    </div>
                    <div className="tl-content">
                      <div className="tl-title">{e.title}</div>
                      <div className="tl-sub">{e.subtitle || ""}</div>
                      <div className="tl-time">{formatTimeAgo(e.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

// ════════════════════════════════════════════════
//  CSS (เหมือนเดิมทุกอย่าง)
// ════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--accent:#E60012;--accent-dark:#8B0009;--accent-light:#FF6666;--card-bg:rgba(255,255,255,0.97);--text-dark:#1a1a2e;--text-muted:#6B5050;--input-bg:#FFF5F5;--input-border:#FFD0D0;--sidebar-w:240px;--topbar-h:64px;--green:#16a34a;--blue:#1d4ed8;--amber:#d97706;}
body{min-height:100vh;background:linear-gradient(135deg,#E60012 0%,#FFAAAA 100%);font-family:'IBM Plex Sans',sans-serif;color:var(--text-dark);overflow-x:hidden;}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0;}
.blob{position:fixed;border-radius:50%;filter:blur(80px);opacity:.15;pointer-events:none;z-index:0;animation:blobFloat 10s ease-in-out infinite alternate;}
.b1{width:500px;height:500px;background:#E60012;top:-180px;left:-160px;}
.b2{width:380px;height:380px;background:#FF9999;bottom:-120px;right:-100px;animation-delay:4s;}
.b3{width:250px;height:250px;background:#FFB3B3;top:50%;left:55%;animation-delay:7s;}
@keyframes blobFloat{from{transform:translateY(0) scale(1);}to{transform:translateY(-35px) scale(1.06);}}
.sidebar{position:fixed;left:0;top:0;bottom:0;width:var(--sidebar-w);background:linear-gradient(180deg,#B8000E 0%,#E60012 100%);z-index:100;display:flex;flex-direction:column;box-shadow:4px 0 24px rgba(130,20,20,.2);transition:transform .3s;}
.sidebar-logo{display:flex;align-items:center;gap:12px;padding:22px 20px 20px;border-bottom:1px solid rgba(255,255,255,.1);}
.logo-icon-s{width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(6px);}
.logo-text-s h2{font-family:'Barlow',serif;font-size:.98rem;color:#fff;font-weight:700;}
.logo-text-s p{font-size:.6rem;opacity:.65;color:#fff;letter-spacing:1.5px;text-transform:uppercase;}
.sidebar-user{padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:11px;}
.user-avatar{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.25);border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff;font-weight:700;font-family:'Barlow',serif;}
.user-info h4{font-size:.82rem;color:#fff;font-weight:600;line-height:1.2;}
.user-info p{font-size:.67rem;opacity:.65;color:#fff;}
.sidebar-nav{flex:1;padding:14px 12px;overflow-y:auto;}
.nav-section-label{font-size:.6rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.45);font-weight:600;padding:8px 8px 4px;margin-top:6px;}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:11px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.78);font-size:.83rem;font-weight:500;margin-bottom:2px;text-decoration:none;}
.nav-item:hover{background:rgba(255,255,255,.14);color:#fff;}
.nav-item.active{background:rgba(255,255,255,.22);color:#fff;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.12);}
.nav-item .nav-icon{font-size:1rem;width:20px;text-align:center;flex-shrink:0;}
.nav-badge{margin-left:auto;background:rgba(255,255,255,.25);color:#fff;font-size:.62rem;font-weight:700;padding:2px 7px;border-radius:20px;}
.sidebar-logout{padding:10px 16px 6px;}
.logout-btn{display:flex;align-items:center;gap:10px;width:100%;padding:11px 14px;border-radius:11px;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.85);font-family:'IBM Plex Sans',sans-serif;font-size:.83rem;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;}
.logout-btn:hover{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.5);color:#fff;transform:translateX(2px);}
.logout-icon{font-size:1rem;flex-shrink:0;}
.sidebar-footer{padding:10px 20px 14px;border-top:1px solid rgba(255,255,255,.1);font-size:.7rem;color:rgba(255,255,255,.45);text-align:center;}
.topbar{position:fixed;left:var(--sidebar-w);right:0;top:0;height:var(--topbar-h);background:rgba(255,255,255,.96);backdrop-filter:blur(12px);z-index:90;display:flex;align-items:center;padding:0 28px;box-shadow:0 2px 12px rgba(130,20,20,.1);border-bottom:1px solid rgba(240,190,190,.3);gap:16px;}
.topbar-title{flex:1;}
.topbar-title h1{font-family:'Barlow',serif;font-size:1.15rem;font-weight:700;color:var(--text-dark);}
.topbar-title p{font-size:.72rem;color:var(--text-muted);margin-top:1px;}
.topbar-search{display:flex;align-items:center;gap:8px;background:var(--input-bg);border:1.5px solid var(--input-border);border-radius:50px;padding:7px 16px;width:260px;}
.topbar-search svg{width:15px;height:15px;color:#d4a0a0;flex-shrink:0;}
.topbar-search input{border:none;background:transparent;outline:none;font-size:.82rem;width:100%;font-family:'IBM Plex Sans',sans-serif;color:var(--text-dark);}
.topbar-search input::placeholder{color:#d4a0a0;}
.topbar-actions{display:flex;align-items:center;gap:10px;}
.topbar-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E60012,#8B0009);color:white;font-weight:700;font-size:.85rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid rgba(214,40,40,.3);font-family:'Barlow',serif;}
.main{margin-left:var(--sidebar-w);padding-top:calc(var(--topbar-h) + 28px);padding-bottom:40px;padding-left:28px;padding-right:28px;position:relative;z-index:1;animation:pageIn .5s cubic-bezier(.22,.68,0,1.1) both;}
@keyframes pageIn{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
.welcome-banner{background:linear-gradient(135deg,rgba(255,255,255,.96),rgba(255,240,240,.96));border-radius:20px;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 12px 40px rgba(140,30,30,.13);margin-bottom:24px;border:1px solid rgba(240,190,190,.3);overflow:hidden;position:relative;}
.wb-text h2{font-family:'Barlow',serif;font-size:1.55rem;color:var(--text-dark);}
.wb-text p{font-size:.85rem;color:var(--text-muted);margin-top:5px;line-height:1.5;}
.wb-actions{display:flex;gap:10px;flex-shrink:0;}
.btn-primary{padding:10px 22px;border:none;border-radius:11px;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;font-family:'Barlow',serif;font-size:.88rem;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:7px;box-shadow:0 4px 14px rgba(214,40,40,.3);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(214,40,40,.38);}
.btn-outline{padding:10px 20px;border:1.5px solid var(--input-border);border-radius:11px;background:transparent;color:var(--accent);font-family:'IBM Plex Sans',sans-serif;font-size:.83rem;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:7px;}
.btn-outline:hover{border-color:var(--accent);background:#fff0f0;}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
.stat-card{background:rgba(255,255,255,.96);border-radius:16px;padding:20px 22px;box-shadow:0 8px 28px rgba(140,30,30,.1);border:1px solid rgba(240,190,190,.25);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden;}
.stat-card:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(140,30,30,.16);}
.stat-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 16px 16px;}
.stat-card.red::after{background:linear-gradient(90deg,#E60012,#FF5555);}
.stat-card.green::after{background:linear-gradient(90deg,#16a34a,#4ade80);}
.stat-card.blue::after{background:linear-gradient(90deg,#1d4ed8,#60a5fa);}
.stat-card.amber::after{background:linear-gradient(90deg,#d97706,#fbbf24);}
.stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
.stat-icon-wrap{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;}
.ic-red{background:linear-gradient(135deg,#ffe0e0,#FFB3B3);}
.ic-green{background:linear-gradient(135deg,#dcfce7,#bbf7d0);}
.ic-blue{background:linear-gradient(135deg,#dbeafe,#bfdbfe);}
.ic-amber{background:linear-gradient(135deg,#fef3c7,#fde68a);}
.stat-num{font-family:'Barlow',serif;font-size:1.9rem;font-weight:700;color:var(--text-dark);line-height:1;}
.stat-label{font-size:.74rem;color:var(--text-muted);margin-top:5px;}
.content-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:20px;margin-bottom:20px;}
.full-row{margin-bottom:20px;}
.card{background:rgba(255,255,255,.97);border-radius:18px;box-shadow:0 12px 40px rgba(140,30,30,.11);border:1px solid rgba(240,190,190,.25);overflow:hidden;}
.card-head{padding:18px 22px 14px;border-bottom:1px solid #FFE0E0;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.card-head-left{display:flex;align-items:center;gap:10px;}
.card-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#FF6666,#E60012);display:flex;align-items:center;justify-content:center;font-size:.95rem;box-shadow:0 3px 8px rgba(192,57,43,.28);flex-shrink:0;}
.card-icon.green-ic{background:linear-gradient(135deg,#4ade80,#16a34a);}
.card-icon.blue-ic{background:linear-gradient(135deg,#60a5fa,#1d4ed8);}
.card-icon.amber-ic{background:linear-gradient(135deg,#fbbf24,#d97706);}
.card-head h3{font-family:'Barlow',serif;font-size:1rem;font-weight:700;color:var(--text-dark);}
.card-head p{font-size:.7rem;color:var(--text-muted);margin-top:1px;}
.card-body{padding:20px 22px;}
.see-all{font-size:.74rem;font-weight:600;color:var(--accent);background:none;border:none;cursor:pointer;text-decoration:none;white-space:nowrap;}
.see-all:hover{text-decoration:underline;}
.ship-table{width:100%;border-collapse:collapse;}
.ship-table th{font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);padding:0 8px 10px;text-align:left;border-bottom:1.5px solid #FFE0E0;}
.ship-table td{padding:11px 8px;font-size:.82rem;border-bottom:1px solid #fff4f4;vertical-align:middle;}
.ship-table tr:last-child td{border-bottom:none;}
.ship-table tr:hover td{background:#FFF5F5;}
.tid{font-weight:700;color:var(--accent);font-size:.78rem;letter-spacing:.5px;}
.dest-cell{max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:700;}
.b-delivered{background:#dcfce7;color:#16a34a;border:1px solid #bbf7d0;}
.b-transit{background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe;}
.b-processing{background:#fef3c7;color:#d97706;border:1px solid #fde68a;}
.b-pending{background:#fff0f0;color:#E60012;border:1px solid #fdd;}
.tl-list{display:flex;flex-direction:column;gap:0;}
.tl-item{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid #fff4f4;position:relative;}
.tl-item:last-child{border-bottom:none;}
.tl-dot-wrap{display:flex;flex-direction:column;align-items:center;flex-shrink:0;}
.tl-dot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;box-shadow:0 2px 6px rgba(0,0,0,.1);}
.tl-dot.red{background:linear-gradient(135deg,#FF6666,#E60012);}
.tl-dot.green{background:linear-gradient(135deg,#4ade80,#16a34a);}
.tl-dot.blue{background:linear-gradient(135deg,#60a5fa,#1d4ed8);}
.tl-dot.amber{background:linear-gradient(135deg,#fbbf24,#d97706);}
.tl-line{width:2px;flex:1;background:#FFE0E0;margin-top:4px;}
.tl-item:last-child .tl-line{display:none;}
.tl-content{flex:1;padding-top:4px;}
.tl-title{font-size:.83rem;font-weight:600;color:var(--text-dark);}
.tl-sub{font-size:.73rem;color:var(--text-muted);margin-top:2px;}
.tl-time{font-size:.68rem;color:var(--accent);font-weight:600;margin-top:3px;}
.qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.qa-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:18px 12px;border-radius:14px;border:1.5px solid var(--input-border);background:var(--input-bg);cursor:pointer;transition:all .2s;text-decoration:none;}
.qa-btn:hover{border-color:var(--accent);background:#fff0f0;transform:translateY(-2px);box-shadow:0 6px 18px rgba(192,57,43,.15);}
.qa-btn-icon{font-size:1.5rem;}
.qa-btn-label{font-size:.76rem;font-weight:600;color:var(--text-dark);text-align:center;line-height:1.3;}
.track-input-row{display:flex;gap:10px;margin-bottom:16px;}
.track-input{flex:1;padding:10px 14px;border:1.5px solid var(--input-border);border-radius:10px;background:var(--input-bg);outline:none;font-size:.83rem;font-family:'IBM Plex Sans',sans-serif;color:var(--text-dark);}
.track-input:focus{border-color:var(--accent);}
.track-btn{padding:10px 18px;border:none;border-radius:10px;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;font-size:.8rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .2s;}
.track-btn:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(214,40,40,.3);}
.track-result{border-radius:12px;padding:14px 16px;background:linear-gradient(135deg,#FFF5F5,#fff0f0);border:1.5px solid #FFD0D0;}
.tr-header{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.tr-status-badge{padding:4px 12px;border-radius:20px;font-size:.72rem;font-weight:700;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;}
.tr-id{font-size:.78rem;font-weight:700;color:var(--accent);}
.tr-info{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.tr-field label{font-size:.63rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600;}
.tr-field p{font-size:.8rem;font-weight:600;color:var(--text-dark);margin-top:2px;}
.chart-container{height:160px;display:flex;align-items:flex-end;gap:8px;padding:0 4px;}
.bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;}
.bar-wrap{width:100%;display:flex;align-items:flex-end;justify-content:center;height:120px;}
.bar{width:70%;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#FF6666,#E60012);transition:height .8s cubic-bezier(.22,.68,0,1.1);position:relative;cursor:pointer;}
.bar:hover{background:linear-gradient(180deg,#FF5555,#8B0009);}
.bar-tooltip{position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:var(--text-dark);color:#fff;font-size:.62rem;padding:3px 7px;border-radius:5px;white-space:nowrap;opacity:0;transition:.2s;pointer-events:none;}
.bar:hover .bar-tooltip{opacity:1;}
.bar-label{font-size:.65rem;color:var(--text-muted);font-weight:500;}
.notif-list{display:flex;flex-direction:column;}
.notif-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #fff4f4;}
.notif-item:last-child{border-bottom:none;}
.notif-dot-i{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.nd-red{background:#ef4444;}.nd-green{background:#22c55e;}.nd-blue{background:#3b82f6;}.nd-amber{background:#f59e0b;}
.notif-body{flex:1;}
.notif-body p{font-size:.81rem;color:var(--text-dark);line-height:1.4;}
.notif-body span{font-size:.68rem;color:var(--text-muted);}
.notif-unread .notif-body p{font-weight:600;}
.profile-card{background:linear-gradient(135deg,rgba(255,255,255,.97),rgba(255,248,248,.97));border-radius:18px;padding:24px 22px;box-shadow:0 8px 28px rgba(140,30,30,.1);border:1px solid rgba(240,190,190,.25);}
.pc-avatar{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;font-size:1.4rem;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'Barlow',serif;margin-bottom:14px;border:3px solid rgba(214,40,40,.25);}
.pc-name{font-family:'Barlow',serif;font-size:1.1rem;font-weight:700;color:var(--text-dark);}
.pc-email{font-size:.75rem;color:var(--text-muted);margin-top:2px;margin-bottom:16px;}
.pc-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;}
.pc-stat{background:#FFF5F5;border-radius:10px;padding:10px 8px;text-align:center;}
.pc-stat-num{font-family:'Barlow',serif;font-size:1.1rem;font-weight:700;color:var(--accent);}
.pc-stat-label{font-size:.62rem;color:var(--text-muted);margin-top:2px;}
.pc-edit-btn{width:100%;padding:9px;border-radius:10px;border:1.5px solid var(--input-border);background:transparent;font-size:.8rem;font-weight:600;color:var(--accent);cursor:pointer;transition:all .2s;font-family:'IBM Plex Sans',sans-serif;}
.pc-edit-btn:hover{border-color:var(--accent);background:#fff0f0;}
.right-col{display:flex;flex-direction:column;gap:20px;}
.skeleton{background:linear-gradient(90deg,#ffe0e0 25%,#fff5f5 50%,#ffe0e0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px;display:inline-block;}
@keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
.skel-num{height:32px;width:50%;}
.menu-toggle{display:none;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99;display:none;}
.overlay.show{display:block;}
@media(max-width:1080px){.stats-row{grid-template-columns:repeat(2,1fr);}.content-grid{grid-template-columns:1fr;}}
@media(max-width:720px){.sidebar{transform:translateX(-100%);}.sidebar.open{transform:translateX(0);}.topbar{left:0;}.main{margin-left:0;padding-left:16px;padding-right:16px;}.stats-row{grid-template-columns:1fr 1fr;}.topbar-search{display:none;}.menu-toggle{display:flex;width:38px;height:38px;align-items:center;justify-content:center;border:1.5px solid var(--input-border);background:var(--input-bg);border-radius:50%;cursor:pointer;}.menu-toggle svg{width:17px;height:17px;color:var(--accent);}.welcome-banner{flex-direction:column;align-items:flex-start;gap:16px;}}
`;
