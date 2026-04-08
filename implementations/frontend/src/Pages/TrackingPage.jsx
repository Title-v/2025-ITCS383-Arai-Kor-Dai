import { useState, useEffect, useCallback, useRef } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// ── Helpers
function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-TH", { day: "numeric", month: "short", year: "numeric" });
}

function statusConfig(status) {
  const s = (status || "").toLowerCase().replace(" ", "-");
  const map = {
    "delivered":  { cls: "delivered",  icon: "✅", title: "Delivered",           badge: "DELIVERED",  progress: 100 },
    "in-transit": { cls: "in-transit", icon: "🚚", title: "In Transit",          badge: "IN TRANSIT", progress: 60  },
    "in transit": { cls: "in-transit", icon: "🚚", title: "In Transit",          badge: "IN TRANSIT", progress: 60  },
    "processing": { cls: "processing", icon: "⚙️", title: "Processing",          badge: "PROCESSING", progress: 20  },
    "pending":    { cls: "pending",    icon: "⏳", title: "Pending Pickup",      badge: "PENDING",    progress: 5   },
    "returned":   { cls: "returned",   icon: "↩️", title: "Returned to Sender",  badge: "RETURNED",   progress: 80  },
  };
  return map[s] || map["pending"];
}

function StatusPill({ status }) {
  const s = (status || "").toLowerCase().replace(" ", "-");
  const map = {
    "delivered":  <span className="status-pill sp-delivered">✅ Delivered</span>,
    "in-transit": <span className="status-pill sp-in-transit">🚚 In Transit</span>,
    "in transit": <span className="status-pill sp-in-transit">🚚 In Transit</span>,
    "processing": <span className="status-pill sp-processing">⚙️ Processing</span>,
    "pending":    <span className="status-pill sp-pending">⏳ Pending</span>,
    "returned":   <span className="status-pill sp-returned">↩️ Returned</span>,
  };
  return map[s] || <span className="status-pill sp-pending">{status}</span>;
}

// ── Location pin SVG (reused in timeline)
const PinSVG = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <circle cx="12" cy="11" r="3" fill="none"/>
  </svg>
);

// ════════════════════════════════════════════════
//  ROUTE VISUAL
// ════════════════════════════════════════════════
function RouteVisual({ data, cfg }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(cfg.progress), 300);
    return () => clearTimeout(t);
  }, [cfg.progress]);

  const stops = data.events?.length
    ? data.events.slice(0, 4)
    : [
        { location: data.origin || "Origin",      date: "Departed", done: true  },
        { location: data.destination || "Destination", date: data.eta ? formatDate(data.eta) : "—", current: cfg.cls !== "delivered" },
      ];

  return (
    <div className="route-card">
      <div className="route-header">
        <div className="route-header-icon">🗺️</div>
        <div>
          <h3>Delivery Route</h3>
          <p>{data.origin || "—"} → {data.destination || "—"}</p>
        </div>
      </div>
      <div className="route-visual">
        <div className="route-node">
          <div className="rn-dot origin">📤</div>
          <div className="rn-name">{data.origin || "—"}</div>
          <div className="rn-sub">Origin</div>
        </div>
        <div className="route-line" style={{ flex: 1 }}>
          <div className="route-line-fill" style={{ width: `${progress}%` }} />
          <div className="route-truck" style={{ left: `${progress}%` }}>🚚</div>
        </div>
        <div className="route-node">
          <div className="rn-dot dest">📍</div>
          <div className="rn-name">{data.destination || "—"}</div>
          <div className="rn-sub">Destination</div>
        </div>
      </div>
      <div className="route-stops">
        {stops.map((s, i) => (
          <div className={`rs-stop${s.done ? " passed" : ""}${s.current ? " current" : ""}`} key={i}>
            <div className="rs-dot" />
            <div className="rs-name">{s.location || s.loc || "—"}</div>
            <div className="rs-date">{s.date || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  TIMELINE
// ════════════════════════════════════════════════
function Timeline({ data, cfg }) {
  const isDelivered  = (data.status || "").toLowerCase() === "delivered";
  const isTransit    = (data.status || "").toLowerCase().includes("transit");
  const isProcessing = (data.status || "").toLowerCase() === "processing";

  const events = data.events?.length
    ? data.events
    : [
        { done: true,  icon: "✅", title: "Shipment Created",      loc: data.origin || "—",                   time: data.created_at ? formatDate(data.created_at) : "—" },
        { done: isTransit || isDelivered, current: isProcessing, icon: isTransit || isDelivered ? "🚛" : isProcessing ? "⚙️" : "○",
          title: "Processing & Dispatch", loc: "Sorting Hub",
          time: isProcessing ? "In progress" : isTransit || isDelivered ? "Completed" : "Pending",
          pending: !isTransit && !isDelivered && !isProcessing },
        { done: isDelivered, current: isTransit, icon: isDelivered ? "✅" : isTransit ? "🚚" : "○",
          title: "In Transit", loc: `En route to ${data.destination || "—"}`,
          time: isTransit ? data.last_update || "In progress" : isDelivered ? "Completed" : "Pending",
          pending: !isDelivered && !isTransit },
        { done: isDelivered, icon: isDelivered ? "🏠" : "○",
          title: "Delivered", loc: data.destination || "—",
          time: isDelivered ? formatDate(data.eta) : `Expected ${data.eta ? formatDate(data.eta) : "—"}`,
          pending: !isDelivered },
      ];

  return (
    <div className="timeline">
      {events.map((e, i) => (
        <div className={`tl-item${e.done ? " done" : ""}`} key={i}>
          <div className={`tl-dot${e.done ? " done" : e.current ? " current" : " pending"}`}>
            {e.done || e.current ? (e.icon || "📦") : "○"}
          </div>
          <div className="tl-content">
            <div className={`tl-title${e.pending && !e.current ? " pending" : ""}`}>{e.title}</div>
            <div className="tl-loc"><PinSVG />{e.loc || e.location || "—"}</div>
            <div className={`tl-time${e.pending && !e.current ? " pending" : ""}`}>{e.time || e.created_at || ""}</div>
            {e.note && <div className="tl-note">{e.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function TrackingPage() {
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);   // null | object
  const [error,      setError]      = useState(false);
  const [chips,      setChips]      = useState(["PO-20240312001","PO-20240308003","PO-20240306007","PO-20240303005"]);
  const [copied,     setCopied]     = useState(false);
  const resultsRef = useRef(null);

  // Load quick chips from API
  useEffect(() => {
    async function loadChips() {
      try {
        const res  = await fetch(`${API}/shipments/recent`);
        const data = await res.json();
        if (data?.length) setChips(data.slice(0, 4).map(s => s.tracking_number));
      } catch (_) {}
    }
    loadChips();

    // Auto-track from URL ?id=
    const urlId = new URLSearchParams(window.location.search).get("id");
    if (urlId) { setInput(urlId); track(urlId); }
  }, []);

  const track = useCallback(async (override) => {
    const val = (override || input).trim().toUpperCase();
    if (!val) return;
    setError(false);
    setResult(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/shipments/track/${val}`);
      const data = await res.json();
      if (!data || data.error) { setError(true); }
      else { setResult({ ...data, _id: val }); }
    } catch (_) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [input]);

  // Scroll to results when data arrives
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function copyId() {
    if (!result) return;
    navigator.clipboard.writeText(result._id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const cfg = result ? statusConfig(result.status) : null;

  return (
    <>
      <style>{CSS}</style>

      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      {/* decorative SVGs */}
      <div className="deco d1"><svg viewBox="0 0 100 70"><rect width="100" height="70" rx="6"/><polyline points="0,0 50,38 100,0" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none"/></svg></div>
      <div className="deco d2"><svg viewBox="0 0 80 80"><rect x="5" y="20" width="70" height="50" rx="5"/><rect x="5" y="28" width="70" height="6"/><rect x="35" y="20" width="10" height="50"/></svg></div>
      <div className="deco d3"><svg viewBox="0 0 100 70"><rect width="100" height="70" rx="6"/><polyline points="0,0 50,38 100,0" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none"/></svg></div>
      <div className="deco d4"><svg viewBox="0 0 80 80"><rect x="5" y="20" width="70" height="50" rx="5"/><rect x="5" y="28" width="70" height="6"/><rect x="35" y="20" width="10" height="50"/></svg></div>

      <div className="page">

        {/* Topbar */}
        <div className="topbar">
          <a href="/" className="back-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </a>
          <div className="page-title">
            <h1>🔍 Track Shipment</h1>
            <p>Real-time parcel tracking</p>
          </div>
          <div className="spacer" />
        </div>

        {/* Search hero */}
        <div className="search-hero">
          <h2>Enter your Tracking ID</h2>
          <p>Track any parcel with your tracking number from your receipt or history</p>
          <div className="search-row">
            <div className="search-input-wrap">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/>
                <path strokeLinecap="round" d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="e.g. PO-20240312001"
                maxLength={20}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && track()}
              />
            </div>
            <button
              className={`search-btn${loading ? " loading" : ""}`}
              onClick={() => track()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: "spin .7s linear infinite" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Tracking…
                </>
              ) : (
                <>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19A8 8 0 103 11a8 8 0 008 8z"/>
                  </svg>
                  Track
                </>
              )}
            </button>
          </div>
          <div className="quick-demos">
            <span className="qd-label">Try:</span>
            {chips.map(id => (
              <span key={id} className="qd-chip" onClick={() => { setInput(id); track(id); }}>{id}</span>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="err-banner show">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>Tracking ID not found. Please check the number and try again.</span>
          </div>
        )}

        {/* Results */}
        {result && cfg && (
          <div className="results show" ref={resultsRef}>

            {/* Status banner */}
            <div className="status-card">
              <div className={`status-banner ${cfg.cls}`}>
                <div className="status-left">
                  <div className="status-icon-big">{cfg.icon}</div>
                  <div className="status-info">
                    <h2>{cfg.title}</h2>
                    <p>{result.last_update ? `Last updated: ${result.last_update}` : `Status: ${cfg.title}`}</p>
                  </div>
                </div>
                <div className="status-badge">{cfg.badge}</div>
              </div>
              <div className="status-meta">
                <div className="sm-cell"><div className="sm-label">Tracking ID</div><div className="sm-val accent">{result._id}</div></div>
                <div className="sm-cell"><div className="sm-label">Sender</div><div className="sm-val">{result.origin || "—"}</div></div>
                <div className="sm-cell"><div className="sm-label">Receiver</div><div className="sm-val">{result.recipient || "—"}</div></div>
                <div className="sm-cell"><div className="sm-label">Est. Delivery</div><div className="sm-val accent">{result.eta ? formatDate(result.eta) : "—"}</div></div>
              </div>
            </div>

            {/* Route visual */}
            <RouteVisual data={result} cfg={cfg} />

            {/* Detail grid */}
            <div className="detail-grid">

              {/* Timeline */}
              <div className="card">
                <div className="card-header">
                  <div className="card-icon">📋</div>
                  <div><h3>Tracking History</h3><p>Full shipment journey</p></div>
                </div>
                <div className="card-body">
                  <Timeline data={result} cfg={cfg} />
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">📦</div>
                    <div><h3>Package Info</h3><p>Shipment details</p></div>
                  </div>
                  <div className="card-body">
                    {[
                      { key: "Type",         val: result.type     || "Parcel",   accent: false },
                      { key: "Service",      val: result.service  || "Standard", accent: false },
                      { key: "Weight",       val: result.weight   || "—",        accent: false },
                      { key: "Dimensions",   val: result.dims     || "—",        accent: false },
                      { key: "Contents",     val: result.contents || "—",        accent: false },
                      { key: "Shipping Fee", val: result.amount ? `฿${Number(result.amount).toLocaleString()}` : "—", accent: true },
                    ].map(({ key, val, accent }) => (
                      <div className="pkg-detail-row" key={key}>
                        <span className="pkg-key">{key}</span>
                        <span className={`pkg-val${accent ? " accent" : ""}`}>{val}</span>
                      </div>
                    ))}
                    <div className="pkg-detail-row">
                      <span className="pkg-key">Status</span>
                      <span className="pkg-val"><StatusPill status={result.status} /></span>
                    </div>

                    <div className="eta-banner">
                      <div className="eta-icon">📅</div>
                      <div className="eta-info">
                        <strong>{(result.status || "").toLowerCase() === "delivered" ? "Delivered Successfully" : "Estimated Delivery"}</strong>
                        <span>{result.eta ? formatDate(result.eta) : "—"}</span>
                      </div>
                    </div>

                    <div className="share-row">
                      <button className="share-btn" onClick={copyId} style={copied ? { color: "var(--green)" } : {}}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        {copied ? "✅ Copied!" : "Copy ID"}
                      </button>
                      <button className="share-btn" onClick={() => window.print()}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                        Print
                      </button>
                      <button className="share-btn" onClick={() => navigator.share?.({ title: "Tracking", text: result._id, url: window.location.href })}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !error && (
          <div className="empty-state">
            <span className="es-icon">📮</span>
            <h3>Enter a Tracking ID to get started</h3>
            <p>Type your tracking number above or click one of the demo IDs to see live tracking in action.</p>
          </div>
        )}

      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--accent:#E60012;--accent-dark:#8B0009;--accent-light:#FF6666;--card:rgba(255,255,255,0.97);--text:#1a1a2e;--muted:#6B5050;--input-bg:#FFF5F5;--input-border:#FFD0D0;--green:#16a34a;--green-bg:#f0fdf4;--green-border:#bbf7d0;--amber:#d97706;--amber-bg:#fffbeb;--amber-border:#fde68a;--blue:#1d4ed8;--blue-bg:#eff6ff;--blue-border:#bfdbfe;--red:#dc2626;--red-bg:#fef2f2;--red-border:#fecaca;}
body{min-height:100vh;background:linear-gradient(135deg,#E60012 0%,#FFAAAA 100%);font-family:'IBM Plex Sans',sans-serif;padding:36px 16px 80px;position:relative;overflow-x:hidden;}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0;}
.blob{position:fixed;border-radius:50%;filter:blur(72px);opacity:0.17;pointer-events:none;z-index:0;animation:blobFloat 10s ease-in-out infinite alternate;}
.b1{width:500px;height:500px;background:#E60012;top:-150px;left:-130px;}
.b2{width:380px;height:380px;background:#FF9999;bottom:-100px;right:-80px;animation-delay:4s;}
.b3{width:220px;height:220px;background:#FFB3B3;top:40%;left:62%;animation-delay:7s;}
@keyframes blobFloat{from{transform:translateY(0) scale(1);}to{transform:translateY(-32px) scale(1.05);}}
.deco{position:fixed;opacity:0.055;pointer-events:none;z-index:0;}
.deco svg{fill:#fff;}
.d1{width:110px;top:8%;left:5%;animation:drift 12s ease-in-out infinite alternate;}
.d2{width:70px;bottom:14%;left:15%;animation:drift 9s ease-in-out infinite alternate;animation-delay:3s;}
.d3{width:90px;top:30%;right:5%;animation:drift 11s ease-in-out infinite alternate;animation-delay:6s;}
.d4{width:55px;bottom:22%;right:18%;animation:drift 8s ease-in-out infinite alternate;animation-delay:1.5s;}
@keyframes drift{from{transform:translateY(0) rotate(0deg);}to{transform:translateY(-20px) rotate(6deg);}}
.page{position:relative;z-index:1;max-width:860px;margin:0 auto;}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;animation:fadeDown 0.5s ease both;}
.back-btn{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.22);border:none;color:#fff;font-family:'IBM Plex Sans',sans-serif;font-size:0.875rem;font-weight:500;padding:9px 18px;border-radius:50px;cursor:pointer;backdrop-filter:blur(8px);text-decoration:none;transition:background 0.2s;}
.back-btn:hover{background:rgba(255,255,255,0.35);}
.back-btn svg{width:15px;height:15px;}
.page-title{text-align:center;flex:1;}
.page-title h1{font-family:'Barlow',sans-serif;font-size:2rem;font-weight:700;color:#fff;text-shadow:0 2px 14px rgba(160,20,20,0.22);}
.page-title p{color:rgba(255,255,255,0.72);font-size:0.82rem;font-weight:300;margin-top:3px;}
.spacer{width:110px;}
.search-hero{background:rgba(255,255,255,0.18);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.3);border-radius:20px;padding:28px 32px 24px;margin-bottom:24px;animation:fadeDown 0.5s ease both 0.1s;}
.search-hero h2{font-family:'Barlow',sans-serif;font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:4px;}
.search-hero p{font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:18px;}
.search-row{display:flex;gap:10px;}
.search-input-wrap{flex:1;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.95);border-radius:12px;padding:0 16px;border:2px solid transparent;transition:border-color 0.2s,box-shadow 0.2s;}
.search-input-wrap:focus-within{border-color:rgba(255,255,255,0.8);box-shadow:0 0 0 4px rgba(255,255,255,0.2);}
.search-input-wrap svg{color:#d4a0a0;width:17px;height:17px;flex-shrink:0;}
.search-input-wrap input{border:none;background:transparent;outline:none;flex:1;padding:13px 0;font-family:'IBM Plex Sans',sans-serif;font-size:0.92rem;color:var(--text);letter-spacing:0.5px;}
.search-input-wrap input::placeholder{color:#d4a0a0;}
.search-btn{background:#fff;color:var(--accent);border:none;border-radius:12px;padding:13px 24px;font-family:'Barlow',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:flex;align-items:center;gap:8px;white-space:nowrap;}
.search-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.16);}
.search-btn.loading{opacity:0.7;pointer-events:none;}
.search-btn svg{width:16px;height:16px;}
.quick-demos{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px;}
.qd-label{font-size:0.72rem;color:rgba(255,255,255,0.6);font-weight:500;}
.qd-chip{background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);color:rgba(255,255,255,0.9);border-radius:20px;padding:4px 12px;font-size:0.72rem;font-weight:600;cursor:pointer;transition:background 0.15s;letter-spacing:0.5px;font-family:'IBM Plex Sans',sans-serif;}
.qd-chip:hover{background:rgba(255,255,255,0.3);}
.err-banner{display:none;background:var(--red-bg);border:1.5px solid var(--red-border);border-radius:12px;padding:14px 18px;margin-bottom:18px;align-items:center;gap:10px;animation:fadeUp 0.3s ease both;}
.err-banner.show{display:flex;}
.err-banner svg{color:var(--red);width:18px;height:18px;flex-shrink:0;}
.err-banner span{font-size:0.84rem;color:var(--red);font-weight:500;}
.results{display:none;}
.results.show{display:block;animation:fadeUp 0.5s ease both;}
.status-card{border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(140,30,30,0.18),0 2px 8px rgba(140,30,30,0.08);margin-bottom:18px;}
.status-banner{padding:24px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.status-banner.delivered{background:linear-gradient(135deg,#16a34a,#22c55e);}
.status-banner.in-transit{background:linear-gradient(135deg,#1d4ed8,#3b82f6);}
.status-banner.processing{background:linear-gradient(135deg,#d97706,#f59e0b);}
.status-banner.returned{background:linear-gradient(135deg,#dc2626,#ef4444);}
.status-banner.pending{background:linear-gradient(135deg,#B8000E,#E60012);}
.status-left{display:flex;align-items:center;gap:16px;}
.status-icon-big{font-size:2.6rem;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.2));}
.status-info h2{font-family:'Barlow',sans-serif;font-size:1.4rem;font-weight:700;color:#fff;}
.status-info p{font-size:0.8rem;color:rgba(255,255,255,0.78);margin-top:3px;}
.status-badge{background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.35);border-radius:50px;padding:8px 20px;font-size:0.82rem;font-weight:700;color:#fff;letter-spacing:0.5px;backdrop-filter:blur(6px);}
.status-meta{background:var(--card);display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--input-border);}
.sm-cell{background:#fff;padding:14px 18px;}
.sm-label{font-size:0.67rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;font-weight:600;}
.sm-val{font-size:0.88rem;font-weight:600;color:var(--text);margin-top:3px;}
.sm-val.accent{color:var(--accent);}
.route-card{background:var(--card);border-radius:20px;box-shadow:0 20px 60px rgba(140,30,30,0.16),0 2px 8px rgba(140,30,30,0.07);padding:22px 28px;margin-bottom:18px;}
.route-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.route-header-icon{width:36px;height:36px;background:linear-gradient(135deg,#FF6666,#E60012);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 3px 8px rgba(192,57,43,0.28);flex-shrink:0;}
.route-header h3{font-family:'Barlow',sans-serif;font-size:1rem;font-weight:700;color:var(--text);}
.route-header p{font-size:0.73rem;color:var(--muted);}
.route-visual{display:flex;align-items:center;gap:0;}
.route-node{text-align:center;flex:0 0 auto;}
.rn-dot{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin:0 auto 8px;box-shadow:0 3px 10px rgba(192,57,43,0.2);}
.rn-dot.origin{background:linear-gradient(135deg,#FF6666,#E60012);}
.rn-dot.dest{background:linear-gradient(135deg,#22c55e,#16a34a);}
.rn-dot.current-loc{background:linear-gradient(135deg,#3b82f6,#1d4ed8);animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{box-shadow:0 3px 10px rgba(59,130,246,0.3);}50%{box-shadow:0 3px 18px rgba(59,130,246,0.65);}}
.rn-name{font-size:0.78rem;font-weight:700;color:var(--text);white-space:nowrap;}
.rn-sub{font-size:0.68rem;color:var(--muted);margin-top:2px;}
.route-line{flex:1;position:relative;height:4px;background:var(--input-border);margin:0 4px;margin-bottom:28px;}
.route-line-fill{position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,var(--accent),#22c55e);border-radius:4px;transition:width 1s ease;}
.route-truck{position:absolute;top:-16px;font-size:1.4rem;transition:left 1s ease;transform:translateX(-50%);filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15));}
.route-stops{display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid #FFE0E0;}
.rs-stop{text-align:center;}
.rs-stop .rs-name{font-size:0.74rem;font-weight:600;color:var(--text);}
.rs-stop .rs-date{font-size:0.68rem;color:var(--muted);margin-top:2px;}
.rs-stop .rs-dot{width:8px;height:8px;border-radius:50%;background:var(--input-border);margin:0 auto 5px;}
.rs-stop.passed .rs-dot{background:var(--accent);}
.rs-stop.current .rs-dot{background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.25);}
.detail-grid{display:grid;grid-template-columns:1fr 320px;gap:18px;align-items:start;}
.card{background:var(--card);border-radius:20px;box-shadow:0 20px 60px rgba(140,30,30,0.16),0 2px 8px rgba(140,30,30,0.07);overflow:hidden;}
.card-header{padding:18px 24px 14px;border-bottom:1px solid #FFE0E0;display:flex;align-items:center;gap:10px;}
.card-icon{width:36px;height:36px;flex-shrink:0;background:linear-gradient(135deg,#FF6666,#E60012);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 3px 8px rgba(192,57,43,0.28);}
.card-header h3{font-family:'Barlow',sans-serif;font-size:1rem;font-weight:700;color:var(--text);}
.card-header p{font-size:0.72rem;color:var(--muted);margin-top:1px;}
.card-body{padding:20px 24px;}
.timeline{display:flex;flex-direction:column;gap:0;}
.tl-item{display:flex;gap:16px;position:relative;padding-bottom:22px;}
.tl-item:last-child{padding-bottom:0;}
.tl-item:not(:last-child)::before{content:'';position:absolute;left:15px;top:32px;bottom:0;width:2px;background:var(--input-border);z-index:0;}
.tl-item.done:not(:last-child)::before{background:linear-gradient(180deg,var(--accent),#FF6666);}
.tl-dot{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.9rem;z-index:1;position:relative;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
.tl-dot.done{background:linear-gradient(135deg,#FF6666,#E60012);}
.tl-dot.current{background:linear-gradient(135deg,#3b82f6,#1d4ed8);animation:pulseDot 2s ease infinite;}
.tl-dot.pending{background:#fff;border:2px solid var(--input-border);}
@keyframes pulseDot{0%,100%{box-shadow:0 2px 8px rgba(59,130,246,0.2);}50%{box-shadow:0 2px 18px rgba(59,130,246,0.55);}}
.tl-content{flex:1;padding-top:4px;}
.tl-title{font-size:0.875rem;font-weight:600;color:var(--text);}
.tl-title.pending{color:var(--muted);font-weight:400;}
.tl-loc{font-size:0.76rem;color:var(--muted);margin-top:2px;display:flex;align-items:center;gap:5px;}
.tl-loc svg{width:12px;height:12px;}
.tl-time{font-size:0.72rem;color:var(--accent);font-weight:600;margin-top:3px;}
.tl-time.pending{color:var(--muted);font-weight:400;}
.tl-note{font-size:0.75rem;color:var(--muted);margin-top:4px;background:var(--input-bg);border-radius:6px;padding:6px 10px;border-left:3px solid var(--accent-light);}
.pkg-detail-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #fff4f4;font-size:0.83rem;}
.pkg-detail-row:last-child{border-bottom:none;}
.pkg-key{color:var(--muted);}
.pkg-val{font-weight:600;color:var(--text);text-align:right;}
.pkg-val.accent{color:var(--accent);}
.status-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:0.76rem;font-weight:700;}
.sp-delivered{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);}
.sp-in-transit{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border);}
.sp-processing{background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-border);}
.sp-returned{background:var(--red-bg);color:var(--red);border:1px solid var(--red-border);}
.sp-pending{background:#fff0f0;color:var(--accent);border:1px solid #f0bfbf;}
.share-row{display:flex;gap:8px;margin-top:14px;}
.share-btn{flex:1;padding:9px;border-radius:9px;border:1.5px solid var(--input-border);background:var(--input-bg);font-family:'IBM Plex Sans',sans-serif;font-size:0.76rem;font-weight:600;color:var(--accent);cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:5px;}
.share-btn:hover{border-color:var(--accent);background:#ffe0e0;}
.share-btn svg{width:14px;height:14px;}
.eta-banner{background:linear-gradient(135deg,#ffe0e0,#fff0f0);border:1.5px solid #ebb8b8;border-radius:12px;padding:14px 18px;margin-top:14px;display:flex;align-items:center;gap:12px;}
.eta-icon{font-size:1.6rem;}
.eta-info strong{display:block;font-size:0.85rem;font-weight:700;color:var(--text);}
.eta-info span{font-size:0.76rem;color:var(--muted);margin-top:1px;display:block;}
.empty-state{text-align:center;padding:48px 20px;}
.empty-state .es-icon{font-size:3.5rem;margin-bottom:14px;display:block;}
.empty-state h3{font-family:'Barlow',sans-serif;font-size:1.2rem;color:#fff;margin-bottom:6px;}
.empty-state p{font-size:0.84rem;color:rgba(255,255,255,0.68);line-height:1.6;}
@keyframes fadeDown{from{opacity:0;transform:translateY(-18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@media(max-width:720px){.detail-grid{grid-template-columns:1fr;}.status-meta{grid-template-columns:1fr 1fr;}.route-visual{overflow-x:auto;padding-bottom:8px;}.page-title h1{font-size:1.45rem;}.search-row{flex-direction:column;}.search-btn{justify-content:center;}.spacer{display:none;}}
`;
