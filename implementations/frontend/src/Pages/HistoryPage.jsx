import { useState, useEffect, useMemo } from "react";

const API_URL       = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
const USER_ID       = 1; // replace with real session user ID
const ROWS_PER_PAGE = 8;

const TYPE_ICONS = { Parcel:"📦", Letter:"✉️", Express:"⚡", Registered:"📋" };

const BADGE_CLS = {
  Sent:     "badge-sent",
  Received: "badge-received",
  Pending:  "badge-pending",
  Returned: "badge-returned",
};

function normStatus(s) {
  const map = {
    paid:"Sent", delivered:"Received", pending:"Pending",
    processing:"Pending", shipped:"Sent", cancelled:"Returned", returned:"Returned",
  };
  return map[(s||"").toLowerCase()] || s || "Pending";
}

function fmtDate(raw) {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

// ════════════════════════════════════════════════
//  STATUS BADGE
// ════════════════════════════════════════════════
function Badge({ status }) {
  return <span className={`badge ${BADGE_CLS[status] || "badge-pending"}`}>{status}</span>;
}

// ════════════════════════════════════════════════
//  PAGINATION
// ════════════════════════════════════════════════
function Pagination({ page, totalPages, total, perPage, onChange }) {
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);
  const info  = total ? `Showing ${start}–${end} of ${total} records` : "No records found";

  return (
    <div className="pagination">
      <div className="pagination-info">{info}</div>
      <div className="pagination-btns">
        <button className="pg-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(pg => (
          <button key={pg} className={`pg-btn${pg === page ? " active" : ""}`} onClick={() => onChange(pg)}>{pg}</button>
        ))}
        <button className="pg-btn" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>›</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function HistoryPage() {
  const [allData,  setAllData]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("");
  const [typeF,    setTypeF]    = useState("");
  const [page,     setPage]     = useState(1);

  // ── Fetch history ──
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/shipments/history/${USER_ID}`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const rows = await res.json();
        setAllData(rows.map(r => ({
          id:       r.tracking_number,
          sender:   "Me",
          sAddr:    r.sAddr  || "—",
          receiver: r.receiver || "—",
          rAddr:    r.rAddr  || "—",
          type:     r.paymentMethod === "Cash on Delivery" ? "Registered" : "Parcel",
          date:     fmtDate(r.created_at),
          status:   normStatus(r.status),
          fee:      r.amount ? `฿${parseFloat(r.amount).toFixed(0)}` : "—",
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Filtered data (derived) ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allData.filter(r =>
      (!q || [r.id, r.sender, r.receiver, r.sAddr, r.rAddr].some(v => v.toLowerCase().includes(q))) &&
      (!statusF || r.status === statusF) &&
      (!typeF   || r.type   === typeF)
    );
  }, [allData, search, statusF, typeF]);

  // ── Reset page on filter change ──
  useEffect(() => setPage(1), [search, statusF, typeF]);

  // ── Stats ──
  const stats = useMemo(() => ({
    total:    filtered.length,
    sent:     filtered.filter(r => r.status === "Sent").length,
    received: filtered.filter(r => r.status === "Received").length,
    pending:  filtered.filter(r => r.status === "Pending").length,
  }), [filtered]);

  // ── Page slice ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <>
      <style>{CSS}</style>

      <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>

      <div className="page">

        {/* Header */}
        <div className="page-header">
          <a href="/" className="back-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </a>
          <div className="page-title-group">
            <h1>📮 Transaction History</h1>
            <p>Post Office — All parcel &amp; mail records</p>
          </div>
          <div className="spacer"/>
        </div>

        {/* Card */}
        <div className="card">

          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-wrap">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/>
                <path strokeLinecap="round" d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name, tracking ID, city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
              <option value="">All Status</option>
              <option>Sent</option><option>Received</option>
              <option>Pending</option><option>Returned</option>
            </select>
            <select className="filter-select" value={typeF} onChange={e => setTypeF(e.target.value)}>
              <option value="">All Types</option>
              <option>Parcel</option><option>Letter</option>
              <option>Express</option><option>Registered</option>
            </select>
            <button className="export-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m-4-4 4 4 4-4M12 3v9"/>
              </svg>
              Export
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Total Records</div>
            </div>
            <div className="stat-item">
              <div className="stat-num" style={{ color:"#2e7d32" }}>{stats.sent}</div>
              <div className="stat-label">Sent</div>
            </div>
            <div className="stat-item">
              <div className="stat-num" style={{ color:"#1565c0" }}>{stats.received}</div>
              <div className="stat-label">Received</div>
            </div>
            <div className="stat-item">
              <div className="stat-num" style={{ color:"#f57f17" }}>{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="sortable">Tracking ID <span className="sort-icon">↕</span></th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Type</th>
                  <th className="sortable">Date <span className="sort-icon">↕</span></th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign:"center", padding:40, color:"var(--text-muted)" }}>Loading…</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign:"center", padding:40, color:"#e53935" }}>
                      ⚠️ Could not load data: {error}
                    </td>
                  </tr>
                ) : pageData.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign:"center", padding:36, color:"var(--text-muted)" }}>No records found.</td>
                  </tr>
                ) : pageData.map((r, i) => (
                  <tr key={r.id} style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
                    <td><span className="tracking-id">{r.id}</span></td>
                    <td>
                      <div className="sender-info">
                        <div className="info-name">{r.sender}</div>
                        <div className="info-addr">{r.sAddr}</div>
                      </div>
                    </td>
                    <td>
                      <div className="receiver-info">
                        <div className="info-name">{r.receiver}</div>
                        <div className="info-addr">{r.rAddr}</div>
                      </div>
                    </td>
                    <td><span className="pkg-type">{TYPE_ICONS[r.type] || "📦"} {r.type}</span></td>
                    <td className="date-cell">{r.date}</td>
                    <td><Badge status={r.status} /></td>
                    <td className="amount-cell">{r.fee}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => window.location.href = `/tracking?id=${encodeURIComponent(r.id)}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            perPage={ROWS_PER_PAGE}
            onChange={setPage}
          />

        </div>
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
:root{--purple-light:#FF6666;--purple-mid:#E60012;--purple-dark:#8B0009;--bg-gradient:linear-gradient(135deg,#E60012 0%,#FFAAAA 100%);--card-bg:rgba(255,255,255,0.97);--text-dark:#1a1a2e;--text-muted:#6B5050;--accent:#E60012;--row-hover:#f3f1ff;--badge-sent:#e8f5e9;--badge-sent-text:#2e7d32;--badge-received:#e3f2fd;--badge-received-text:#1565c0;--badge-pending:#fff8e1;--badge-pending-text:#f57f17;--badge-returned:#fce4ec;--badge-returned-text:#c62828;}
body{min-height:100vh;background:var(--bg-gradient);font-family:'IBM Plex Sans',sans-serif;display:flex;flex-direction:column;align-items:center;padding:40px 16px 60px;position:relative;overflow-x:hidden;}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0;}
.blob{position:fixed;border-radius:50%;filter:blur(60px);opacity:0.18;pointer-events:none;z-index:0;animation:float 8s ease-in-out infinite alternate;}
.blob-1{width:420px;height:420px;background:#E60012;top:-80px;left:-100px;animation-delay:0s;}
.blob-2{width:300px;height:300px;background:#FF9999;bottom:40px;right:-60px;animation-delay:3s;}
.blob-3{width:200px;height:200px;background:#FF8888;top:40%;left:55%;animation-delay:5s;}
@keyframes float{from{transform:translateY(0) scale(1);}to{transform:translateY(-30px) scale(1.05);}}
.page{position:relative;z-index:1;width:100%;max-width:900px;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;animation:fadeDown 0.5s ease both;}
.back-btn{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.22);border:none;color:#fff;font-family:'IBM Plex Sans',sans-serif;font-size:0.875rem;font-weight:500;padding:8px 16px;border-radius:50px;cursor:pointer;backdrop-filter:blur(8px);transition:background 0.2s;text-decoration:none;}
.back-btn:hover{background:rgba(255,255,255,0.35);}
.back-btn svg{width:16px;height:16px;}
.page-title-group{text-align:center;flex:1;}
.page-title-group h1{font-family:'Barlow',sans-serif;font-size:1.9rem;font-weight:700;color:#fff;letter-spacing:-0.3px;text-shadow:0 2px 12px rgba(160,20,20,0.25);}
.page-title-group p{color:rgba(255,255,255,0.75);font-size:0.82rem;font-weight:300;margin-top:2px;}
.spacer{width:90px;}
.card{background:var(--card-bg);border-radius:20px;box-shadow:0 20px 60px rgba(140,30,30,0.18),0 2px 8px rgba(140,30,30,0.08);overflow:hidden;animation:fadeUp 0.55s ease both 0.1s;}
.toolbar{display:flex;align-items:center;gap:12px;padding:20px 24px 16px;border-bottom:1px solid #FFE0E0;flex-wrap:wrap;}
.search-wrap{display:flex;align-items:center;gap:8px;flex:1;min-width:200px;background:#FFF5F5;border:1.5px solid #ebe8ff;border-radius:10px;padding:9px 14px;transition:border-color 0.2s;}
.search-wrap:focus-within{border-color:var(--accent);}
.search-wrap svg{color:#d48080;width:16px;height:16px;flex-shrink:0;}
.search-wrap input{border:none;background:transparent;outline:none;font-family:'IBM Plex Sans',sans-serif;font-size:0.875rem;color:var(--text-dark);width:100%;}
.search-wrap input::placeholder{color:#d4a0a0;}
.filter-select{background:#FFF5F5;border:1.5px solid #ebe8ff;border-radius:10px;padding:9px 14px;font-family:'IBM Plex Sans',sans-serif;font-size:0.875rem;color:var(--text-dark);outline:none;cursor:pointer;transition:border-color 0.2s;}
.filter-select:focus{border-color:var(--accent);}
.export-btn{display:flex;align-items:center;gap:6px;background:var(--accent);color:#fff;border:none;border-radius:10px;padding:9px 18px;font-family:'IBM Plex Sans',sans-serif;font-size:0.875rem;font-weight:500;cursor:pointer;transition:background 0.2s,transform 0.15s;}
.export-btn:hover{background:var(--purple-dark);transform:translateY(-1px);}
.export-btn svg{width:15px;height:15px;}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid #FFE0E0;}
.stat-item{padding:16px 20px;text-align:center;border-right:1px solid #FFE0E0;position:relative;transition:background 0.2s;}
.stat-item:last-child{border-right:none;}
.stat-item:hover{background:#fbfaff;}
.stat-num{font-family:'Barlow',sans-serif;font-size:1.6rem;font-weight:700;color:var(--accent);line-height:1;}
.stat-label{font-size:0.72rem;color:var(--text-muted);margin-top:4px;text-transform:uppercase;letter-spacing:0.6px;font-weight:500;}
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead tr{background:#fff9f9;border-bottom:2px solid #ebe8ff;}
thead th{padding:13px 18px;text-align:left;font-size:0.72rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.7px;white-space:nowrap;user-select:none;}
thead th.sortable{cursor:pointer;}
thead th.sortable:hover{color:var(--accent);}
thead th .sort-icon{margin-left:4px;opacity:0.5;font-size:0.65rem;}
tbody tr{border-bottom:1px solid #fff4f4;transition:background 0.15s;animation:fadeRow 0.4s ease both;}
tbody tr:last-child{border-bottom:none;}
tbody tr:hover{background:var(--row-hover);}
td{padding:14px 18px;font-size:0.875rem;color:var(--text-dark);vertical-align:middle;}
.tracking-id{font-family:'IBM Plex Sans',sans-serif;font-weight:600;color:var(--accent);font-size:0.82rem;letter-spacing:0.4px;}
.sender-info,.receiver-info{line-height:1.3;}
.info-name{font-weight:500;font-size:0.875rem;}
.info-addr{font-size:0.75rem;color:var(--text-muted);}
.pkg-type{display:inline-flex;align-items:center;gap:5px;background:#FFE0E0;color:var(--purple-dark);border-radius:6px;padding:4px 10px;font-size:0.75rem;font-weight:500;}
.badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;letter-spacing:0.3px;}
.badge-sent{background:var(--badge-sent);color:var(--badge-sent-text);}
.badge-received{background:var(--badge-received);color:var(--badge-received-text);}
.badge-pending{background:var(--badge-pending);color:var(--badge-pending-text);}
.badge-returned{background:var(--badge-returned);color:var(--badge-returned-text);}
.date-cell{color:var(--text-muted);font-size:0.82rem;white-space:nowrap;}
.amount-cell{font-weight:600;font-size:0.875rem;white-space:nowrap;}
.action-btn{background:none;border:1.5px solid #f0bfbf;border-radius:7px;color:var(--accent);font-size:0.75rem;padding:5px 11px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:500;transition:all 0.15s;}
.action-btn:hover{background:var(--accent);color:#fff;border-color:var(--accent);}
.pagination{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-top:1px solid #FFE0E0;flex-wrap:wrap;gap:12px;}
.pagination-info{font-size:0.8rem;color:var(--text-muted);}
.pagination-btns{display:flex;gap:6px;}
.pg-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1.5px solid #ebe8ff;background:#fff;color:var(--text-muted);font-size:0.82rem;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:500;transition:all 0.15s;}
.pg-btn:hover,.pg-btn.active{background:var(--accent);color:#fff;border-color:var(--accent);}
.pg-btn:disabled{opacity:0.4;cursor:not-allowed;}
@keyframes fadeDown{from{opacity:0;transform:translateY(-18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeRow{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
@media(max-width:640px){.stats-row{grid-template-columns:repeat(2,1fr);}.stat-item:nth-child(2){border-right:none;}.page-title-group h1{font-size:1.4rem;}.spacer{display:none;}}
`;
