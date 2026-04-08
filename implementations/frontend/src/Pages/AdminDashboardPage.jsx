import { useState, useEffect, useRef, useCallback } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --accent: #c0392b; --accent-dark: #991b1b; --accent-light: #e07070; --accent-glow: rgba(192,57,43,0.25);
    --bg: #f7f1f1; --sidebar-bg: #1a0505; --sidebar-border: #2e0a0a;
    --card: #ffffff; --text: #1a0a0a; --muted: #7c5555;
    --input-bg: #fff8f8; --input-border: #f5cece; --border: #f0dada;
    --green: #16a34a; --green-bg: #f0fdf4;
    --blue: #1d4ed8; --blue-bg: #eff6ff;
    --amber: #d97706; --amber-bg: #fffbeb; --gold: #f59e0b;
  }
  .adp-root { min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; display: flex; overflow-x: hidden; }

  /* Sidebar */
  .sidebar { width: 240px; min-height: 100vh; background: var(--sidebar-bg); border-right: 1px solid var(--sidebar-border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transition: transform 0.3s; }
  .sidebar.open { transform: translateX(0) !important; }
  .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid var(--sidebar-border); display: flex; align-items: center; gap: 10px; }
  .sidebar-logo .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, rgba(192,57,43,0.4), rgba(224,112,112,0.2)); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid rgba(192,57,43,0.35); box-shadow: 0 0 16px rgba(192,57,43,0.2); }
  .sidebar-logo .logo-text h2 { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #f5e8e8; }
  .sidebar-logo .logo-text p  { font-size: 0.62rem; color: rgba(245,232,232,0.45); letter-spacing: 1.4px; text-transform: uppercase; margin-top: 1px; }
  .sidebar-admin { padding: 14px 20px; border-bottom: 1px solid var(--sidebar-border); display: flex; align-items: center; gap: 10px; }
  .admin-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #c0392b, #e07070); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 0 10px rgba(192,57,43,0.4); }
  .admin-info strong { display: block; font-size: 0.78rem; font-weight: 600; color: #f5e8e8; }
  .admin-info span { font-size: 0.67rem; color: rgba(245,232,232,0.45); }
  .admin-role-badge { margin-left: auto; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); border-radius: 4px; padding: 2px 7px; font-size: 0.6rem; font-weight: 700; color: var(--gold); letter-spacing: 0.8px; text-transform: uppercase; }
  .sidebar-nav { flex: 1; padding: 14px 12px; overflow-y: auto; }
  .nav-section-label { font-size: 0.6rem; font-weight: 700; color: rgba(245,232,232,0.3); text-transform: uppercase; letter-spacing: 1.2px; padding: 10px 8px 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; color: rgba(245,232,232,0.55); font-size: 0.82rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.18s; margin-bottom: 2px; }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: #f5e8e8; }
  .nav-item.active { background: rgba(192,57,43,0.2); color: #f5e8e8; border-left: 3px solid var(--accent); padding-left: 9px; }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: var(--accent); border-radius: 10px; padding: 1px 7px; font-size: 0.62rem; font-weight: 700; color: #fff; }
  .sidebar-footer { padding: 14px 12px; border-top: 1px solid var(--sidebar-border); }
  .logout-btn { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: 9px; color: rgba(245,232,232,0.45); font-size: 0.82rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.18s; width: 100%; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .logout-btn:hover { color: var(--accent-light); background: rgba(192,57,43,0.1); }
  .logout-btn svg { width: 16px; height: 16px; }

  /* Main */
  .main { margin-left: 240px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 28px; height: 62px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40; box-shadow: 0 1px 8px rgba(140,30,30,0.06); }
  .topbar-left { display: flex; align-items: center; gap: 14px; }
  .topbar-left h1 { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--text); }
  .topbar-left p { font-size: 0.76rem; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .tb-btn { width: 36px; height: 36px; border-radius: 9px; background: var(--input-bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; position: relative; }
  .tb-btn:hover { border-color: var(--accent-light); background: #fff0f0; }
  .tb-btn svg { width: 16px; height: 16px; color: var(--muted); }
  .tb-badge { position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 0.58rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .tb-divider { width: 1px; height: 24px; background: var(--border); }
  .tb-admin { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .tb-admin-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #c0392b, #e07070); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
  .tb-admin span { font-size: 0.78rem; font-weight: 600; color: var(--text); }
  .sidebar-toggle { display: none; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 9px; background: var(--input-bg); border: 1px solid var(--border); cursor: pointer; }
  .sidebar-toggle svg { width: 18px; height: 18px; color: var(--text); }

  .page-body { padding: 24px 28px 60px; flex: 1; }

  /* Welcome banner */
  .welcome-banner { background: linear-gradient(135deg, #c0392b 0%, #e8a598 100%); border-radius: 18px; padding: 24px 28px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(192,57,43,0.25); animation: fadeUp 0.5s ease both; }
  .welcome-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.1), transparent); }
  .wb-deco { position: absolute; right: 180px; top: -10px; font-size: 6rem; opacity: 0.07; pointer-events: none; }
  .wb-left { position: relative; z-index: 1; }
  .wb-left h2 { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .wb-left p { font-size: 0.82rem; color: rgba(255,255,255,0.76); }
  .wb-right { position: relative; z-index: 1; display: flex; gap: 10px; }
  .wb-btn { padding: 9px 18px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; display: flex; align-items: center; gap: 7px; }
  .wb-primary { background: #fff; color: var(--accent); border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .wb-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }

  /* KPI */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card { background: var(--card); border-radius: 14px; padding: 18px 20px; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(140,30,30,0.06); position: relative; overflow: hidden; animation: fadeUp 0.5s ease both; transition: transform 0.18s, box-shadow 0.18s; }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(140,30,30,0.1); }
  .kpi-card:nth-child(1) { animation-delay: 0.05s; }
  .kpi-card:nth-child(2) { animation-delay: 0.10s; }
  .kpi-card:nth-child(3) { animation-delay: 0.15s; }
  .kpi-card:nth-child(4) { animation-delay: 0.20s; }
  .kpi-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 0 0 14px 14px; }
  .kpi-card.red::after   { background: linear-gradient(90deg, #c0392b, #e07070); }
  .kpi-card.green::after { background: linear-gradient(90deg, #16a34a, #22c55e); }
  .kpi-card.blue::after  { background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
  .kpi-card.amber::after { background: linear-gradient(90deg, #d97706, #f59e0b); }
  .kpi-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .kpi-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .kpi-icon.red   { background: #fff0f0; }
  .kpi-icon.green { background: var(--green-bg); }
  .kpi-icon.blue  { background: var(--blue-bg); }
  .kpi-icon.amber { background: var(--amber-bg); }
  .kpi-trend { display: flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; }
  .kpi-trend.up   { color: var(--green); }
  .kpi-trend.down { color: var(--accent); }
  .kpi-trend svg  { width: 13px; height: 13px; }
  .kpi-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--text); line-height: 1; margin-bottom: 4px; }
  .kpi-label { font-size: 0.76rem; color: var(--muted); font-weight: 400; }

  /* Grid layouts */
  .dash-grid   { display: grid; grid-template-columns: 1fr 340px; gap: 18px; margin-bottom: 18px; }
  .dash-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  /* Cards */
  .card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(140,30,30,0.06); overflow: hidden; animation: fadeUp 0.55s ease both 0.2s; }
  .card-header { padding: 16px 22px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-header-left { display: flex; align-items: center; gap: 10px; }
  .card-h-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #e07070, #c0392b); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; box-shadow: 0 2px 8px rgba(192,57,43,0.25); flex-shrink: 0; }
  .card-header h3 { font-family: 'Playfair Display', serif; font-size: 0.97rem; font-weight: 700; color: var(--text); }
  .card-header p  { font-size: 0.72rem; color: var(--muted); margin-top: 1px; }
  .card-action { font-size: 0.76rem; font-weight: 600; color: var(--accent); text-decoration: none; transition: color 0.15s; }
  .card-action:hover { color: var(--accent-dark); }
  .card-body { padding: 18px 22px; }

  /* Shipment table */
  .ship-table { width: 100%; border-collapse: collapse; }
  .ship-table thead tr { background: #fff8f8; border-bottom: 2px solid var(--border); }
  .ship-table th { padding: 10px 14px; text-align: left; font-size: 0.68rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap; }
  .ship-table tbody tr { border-bottom: 1px solid #fdf4f4; transition: background 0.15s; }
  .ship-table tbody tr:last-child { border-bottom: none; }
  .ship-table tbody tr:hover { background: #fff8f8; }
  .ship-table td { padding: 11px 14px; font-size: 0.82rem; color: var(--text); vertical-align: middle; }
  .track-id { font-weight: 700; color: var(--accent); font-size: 0.78rem; letter-spacing: 0.4px; }
  .person-cell .name { font-weight: 500; }
  .person-cell .loc  { font-size: 0.7rem; color: var(--muted); }
  .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
  .sp-sent       { background: #fff0f0; color: var(--accent); border: 1px solid #f5cece; }
  .sp-received   { background: var(--blue-bg); color: var(--blue); border: 1px solid #bfdbfe; }
  .sp-pending    { background: var(--amber-bg); color: var(--amber); border: 1px solid #fde68a; }
  .sp-delivered  { background: var(--green-bg); color: var(--green); border: 1px solid #bbf7d0; }
  .sp-returned   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .type-chip { display: inline-flex; align-items: center; gap: 4px; background: #fff8f8; color: var(--accent-dark); border-radius: 6px; padding: 3px 8px; font-size: 0.72rem; font-weight: 500; }
  .tbl-action { background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--accent); font-size: 0.72rem; padding: 4px 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.15s; }
  .tbl-action:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* Right column */
  .right-col { display: flex; flex-direction: column; gap: 16px; }

  /* Activity feed */
  .activity-list { display: flex; flex-direction: column; }
  .act-item { display: flex; align-items: flex-start; gap: 12px; padding: 11px 0; border-bottom: 1px solid #fdf4f4; }
  .act-item:last-child { border-bottom: none; }
  .act-dot { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
  .act-dot.red   { background: #fff0f0; }
  .act-dot.green { background: var(--green-bg); }
  .act-dot.blue  { background: var(--blue-bg); }
  .act-dot.amber { background: var(--amber-bg); }
  .act-title { font-size: 0.8rem; font-weight: 500; color: var(--text); line-height: 1.3; }
  .act-time  { font-size: 0.7rem; color: var(--muted); margin-top: 2px; }

  /* Quick actions */
  .qa-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .qa-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 10px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--input-bg); text-decoration: none; cursor: pointer; transition: all 0.18s; text-align: center; }
  .qa-btn:hover { border-color: var(--accent); background: #fff0f0; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(192,57,43,0.1); }
  .qa-icon  { font-size: 1.5rem; }
  .qa-label { font-size: 0.76rem; font-weight: 600; color: var(--text); }
  .qa-sub   { font-size: 0.66rem; color: var(--muted); }

  /* Mini chart */
  .mini-chart { display: flex; align-items: flex-end; gap: 4px; height: 60px; padding: 0 2px; }
  .mc-bar { flex: 1; border-radius: 4px 4px 0 0; transition: height 0.6s cubic-bezier(.22,.68,0,1.1), opacity 0.2s; cursor: pointer; }
  .mc-bar:hover { opacity: 0.75; }
  .mc-bar.red   { background: linear-gradient(180deg, #e07070, #c0392b); }
  .mc-bar.light { background: #f5cece; }
  .mc-label { display: flex; justify-content: space-between; margin-top: 6px; }
  .mc-label span { font-size: 0.62rem; color: var(--muted); }

  /* Chart stats */
  .chart-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); border-radius: 10px; overflow: hidden; margin-top: 14px; }
  .cs-cell { background: #fff8f8; padding: 10px 12px; text-align: center; }
  .cs-num   { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--accent); }
  .cs-label { font-size: 0.65rem; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Status bars */
  .status-bars { display: flex; flex-direction: column; gap: 12px; }
  .sb-item { display: flex; flex-direction: column; gap: 5px; }
  .sb-top { display: flex; justify-content: space-between; align-items: center; }
  .sb-top span { font-size: 0.78rem; font-weight: 500; color: var(--text); }
  .sb-top strong { font-size: 0.78rem; font-weight: 700; color: var(--text); }
  .sb-bar-bg { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .sb-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
    .sidebar-toggle { display: flex; }
    .kpi-grid { grid-template-columns: repeat(2,1fr); }
    .dash-grid { grid-template-columns: 1fr; }
    .dash-grid-2 { grid-template-columns: 1fr; }
  }
`;

// ─── Static data ──────────────────────────────────────────────────────────────
const SHIPMENTS = [
  { id: "PO-20240324001", sender: "Viroj W.",        sLoc: "Bangkok",  receiver: "Nanthicha S.",    rLoc: "Nonthaburi",   type: "📦 Parcel",     status: "sp-pending",   statusTxt: "⏳ Pending",   fee: "฿90" },
  { id: "PO-20240323002", sender: "Suphannika S.",   sLoc: "Bangkok",  receiver: "Ekkawit C.",      rLoc: "Pathum Thani", type: "⚡ Express",    status: "sp-returned",  statusTxt: "↩️ Returned",  fee: "฿225" },
  { id: "PO-20240322003", sender: "Apichart N.",     sLoc: "Bangkok",  receiver: "Darunee P.",      rLoc: "Samut Sakhon", type: "📋 Registered", status: "sp-received",  statusTxt: "📥 Received",  fee: "฿115" },
  { id: "PO-20240321004", sender: "Rungnapha S.",    sLoc: "Bangkok",  receiver: "Watcharaporn S.", rLoc: "Samut Prakan", type: "✉️ Letter",     status: "sp-sent",      statusTxt: "📤 Sent",      fee: "฿16" },
  { id: "PO-20240320005", sender: "Winai C.",        sLoc: "Bangkok",  receiver: "Patcharin D.",    rLoc: "Ang Thong",    type: "📦 Parcel",     status: "sp-pending",   statusTxt: "⏳ Pending",   fee: "฿78" },
  { id: "PO-20240319006", sender: "Pornpan S.",      sLoc: "Bangkok",  receiver: "Atchara K.",      rLoc: "Nakhon Pathom",type: "⚡ Express",    status: "sp-delivered", statusTxt: "✅ Delivered",  fee: "฿200" },
];

const ACTIVITY = [
  { dot: "green", icon: "✅", title: "PO-20240319006 delivered to Nakhon Pathom", time: "2 minutes ago" },
  { dot: "red",   icon: "📦", title: "New shipment created by Viroj W.",           time: "14 minutes ago" },
  { dot: "amber", icon: "⚠️", title: "PO-20240323002 return initiated — delivery failed", time: "1 hour ago" },
  { dot: "blue",  icon: "💳", title: "Payment of ฿225 received via PromptPay",    time: "2 hours ago" },
  { dot: "red",   icon: "👤", title: "New user registered: Wirut Thanakit",        time: "3 hours ago" },
];

const WEEK_DATA = [22, 31, 28, 35, 24, 18, 10];
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_DIST = [
  { label: "Delivered", count: 9,  pct: 37, color: "#16a34a" },
  { label: "Sent",      count: 9,  pct: 37, color: "#c0392b" },
  { label: "Received",  count: 8,  pct: 33, color: "#1d4ed8" },
  { label: "Pending",   count: 5,  pct: 21, color: "#d97706" },
  { label: "Returned",  count: 2,  pct: 8,  color: "#dc2626" },
];

const QUICK_ACTIONS = [
  { icon: "📦", label: "New Shipment",   sub: "Create label",   href: "/shipment/new" },
  { icon: "🔍", label: "Track Parcel",   sub: "Live status",    href: "/track" },
  { icon: "👥", label: "User Approvals", sub: "5 waiting",      href: "/admin/users" },
  { icon: "📊", label: "Reports",        sub: "Stats & export", href: "/admin/reports" },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedCount(target, prefix = "", suffix = "") {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const dur = 1200, start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setDisplay(prefix + Math.round(e * target).toLocaleString() + suffix);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 200);
    return () => { clearTimeout(delay); cancelAnimationFrame(rafRef.current); };
  }, [target, prefix, suffix]);

  return display;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ color, icon, trend, target, prefix = "", suffix = "", label, delay }) {
  const val = useAnimatedCount(target, prefix, suffix);
  return (
    <div className={`kpi-card ${color}`} style={{ animationDelay: delay }}>
      <div className="kpi-top">
        <div className={`kpi-icon ${color}`}>{icon}</div>
        <div className="kpi-trend up">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {trend}
        </div>
      </div>
      <div className="kpi-num">{val}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniChart({ data, labels, highlightIdx = 2 }) {
  const [animated, setAnimated] = useState(false);
  const maxVal = Math.max(...data);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="mini-chart">
        {data.map((v, i) => (
          <div
            key={i}
            className={`mc-bar ${i === highlightIdx ? "red" : "light"}`}
            style={{ height: animated ? `${Math.round((v / maxVal) * 100)}%` : "0%", transitionDelay: `${i * 0.08}s` }}
            title={`${v} shipments`}
          />
        ))}
      </div>
      <div className="mc-label">
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </>
  );
}

// ─── Status distribution bars ─────────────────────────────────────────────────
function StatusBars({ data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="status-bars">
      {data.map(s => (
        <div key={s.label} className="sb-item">
          <div className="sb-top"><span>{s.label}</span><strong>{s.count}</strong></div>
          <div className="sb-bar-bg">
            <div className="sb-bar-fill" style={{ width: animated ? `${s.pct}%` : "0%", background: s.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="adp-root">

        {/* ── Sidebar ── */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">🛡️</div>
            <div className="logo-text"><h2>Post Office</h2><p>Admin Portal</p></div>
          </div>
          <div className="sidebar-admin">
            <div className="admin-avatar">👨‍💼</div>
            <div className="admin-info"><strong>Admin User</strong><span>admin_001</span></div>
            <div className="admin-role-badge">SA</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            <a className="nav-item active" href="/admin/dashboard">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Dashboard
            </a>
            <div className="nav-section-label" style={{ marginTop: 8 }}>Management</div>
            <a className="nav-item" href="/admin/users">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
              User Approval
              <span className="nav-badge">5</span>
            </a>
            <a className="nav-item" href="/admin/reports">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              Statistics & Reports
            </a>
            <div className="nav-section-label" style={{ marginTop: 8 }}>System</div>
            <a className="nav-item" href="/admin/settings">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
              Settings
            </a>
          </nav>
          <div className="sidebar-footer">
            <a href="/admin/login" className="logout-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sign Out
            </a>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <div>
                <h1>Dashboard</h1>
                <p>Wednesday, 11 March 2026</p>
              </div>
            </div>
            <div className="topbar-right">
              <button className="tb-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
              <button className="tb-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <div className="tb-badge">4</div>
              </button>
              <div className="tb-divider" />
              <div className="tb-admin">
                <div className="tb-admin-avatar">👨‍💼</div>
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          {/* Page body */}
          <div className="page-body">

            {/* Welcome banner */}
            <div className="welcome-banner">
              <div className="wb-deco">📮</div>
              <div className="wb-left">
                <h2>Good morning, Admin 👋</h2>
                <p>Here's what's happening at your post office today — 11 March 2026</p>
              </div>
              <div className="wb-right">
                <a href="/admin/users" className="wb-btn wb-primary">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  5 Pending Approvals
                </a>
              </div>
            </div>

            {/* KPI row */}
            <div className="kpi-grid">
              <KpiCard color="red"   icon="📦" trend="+12%" target={247}  label="Total Shipments"    delay="0.05s" />
              <KpiCard color="green" icon="✅" trend="+8%"  target={38}   label="Delivered Today"    delay="0.10s" />
              <KpiCard color="blue"  icon="🚚" trend="+5%"  target={54}   label="In Transit"         delay="0.15s" />
              <KpiCard color="amber" icon="💰" trend="+18%" target={4280} label="Revenue (฿) This Week" delay="0.20s" prefix="฿" />
            </div>

            {/* Row 1: Shipments table + right column */}
            <div className="dash-grid">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon">📋</div>
                    <div><h3>Recent Shipments</h3><p>Latest 6 transactions</p></div>
                  </div>
                  <a href="#" className="card-action" style={{ visibility: "hidden" }}>View All →</a>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="ship-table">
                    <thead>
                      <tr>
                        <th>Tracking ID</th><th>Sender</th><th>Receiver</th>
                        <th>Type</th><th>Status</th><th>Fee</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHIPMENTS.map(s => (
                        <tr key={s.id}>
                          <td><span className="track-id">{s.id}</span></td>
                          <td><div className="person-cell"><div className="name">{s.sender}</div><div className="loc">{s.sLoc}</div></div></td>
                          <td><div className="person-cell"><div className="name">{s.receiver}</div><div className="loc">{s.rLoc}</div></div></td>
                          <td><span className="type-chip">{s.type}</span></td>
                          <td><span className={`status-pill ${s.status}`}>{s.statusTxt}</span></td>
                          <td>{s.fee}</td>
                          <td><button className="tbl-action">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right column */}
              <div className="right-col">
                {/* Activity feed */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-left">
                      <div className="card-h-icon">🔔</div>
                      <div><h3>Recent Activity</h3></div>
                    </div>
                  </div>
                  <div className="card-body" style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <div className="activity-list">
                      {ACTIVITY.map((a, i) => (
                        <div key={i} className="act-item">
                          <div className={`act-dot ${a.dot}`}>{a.icon}</div>
                          <div>
                            <div className="act-title">{a.title}</div>
                            <div className="act-time">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-left">
                      <div className="card-h-icon">⚡</div>
                      <div><h3>Quick Actions</h3></div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="qa-grid">
                      {QUICK_ACTIONS.map(q => (
                        <a key={q.label} href={q.href} className="qa-btn">
                          <span className="qa-icon">{q.icon}</span>
                          <span className="qa-label">{q.label}</span>
                          <span className="qa-sub">{q.sub}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Weekly chart + Status distribution */}
            <div className="dash-grid-2">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon">📊</div>
                    <div><h3>Shipments This Week</h3><p>Mon 4 Mar — Sun 10 Mar 2026</p></div>
                  </div>
                </div>
                <div className="card-body">
                  <MiniChart data={WEEK_DATA} labels={WEEK_LABELS} highlightIdx={2} />
                  <div className="chart-stats">
                    <div className="cs-cell"><div className="cs-num">168</div><div className="cs-label">Total</div></div>
                    <div className="cs-cell"><div className="cs-num">฿18,420</div><div className="cs-label">Revenue</div></div>
                    <div className="cs-cell"><div className="cs-num">94%</div><div className="cs-label">Delivered</div></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon">🥧</div>
                    <div><h3>Status Distribution</h3><p>Current month</p></div>
                  </div>
                </div>
                <div className="card-body">
                  <StatusBars data={STATUS_DIST} />
                  <div className="chart-stats" style={{ marginTop: 16 }}>
                    <div className="cs-cell"><div className="cs-num">24</div><div className="cs-label">This Month</div></div>
                    <div className="cs-cell"><div className="cs-num">2</div><div className="cs-label">Pending</div></div>
                    <div className="cs-cell"><div className="cs-num">฿2,841</div><div className="cs-label">Collected</div></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
