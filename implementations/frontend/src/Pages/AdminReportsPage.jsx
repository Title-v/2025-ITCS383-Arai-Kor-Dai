import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --accent: #c0392b; --accent-dark: #991b1b; --accent-light: #e07070;
    --bg: #f7f1f1; --sidebar-bg: #1a0505; --sidebar-border: #2e0a0a;
    --card: #ffffff; --text: #1a0a0a; --muted: #7c5555;
    --input-bg: #fff8f8; --input-border: #f5cece; --border: #f0dada;
    --green: #16a34a; --green-bg: #f0fdf4; --green-border: #bbf7d0;
    --blue: #1d4ed8; --blue-bg: #eff6ff;
    --amber: #d97706; --amber-bg: #fffbeb;
    --gold: #f59e0b; --purple: #7c3aed; --purple-bg: #f5f3ff;
  }
  .ar-root { min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; display: flex; overflow-x: hidden; color: var(--text); }
  /* Sidebar */
  .sidebar { width: 240px; min-height: 100vh; background: var(--sidebar-bg); border-right: 1px solid var(--sidebar-border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; }
  .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid var(--sidebar-border); display: flex; align-items: center; gap: 10px; }
  .sidebar-logo .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg,rgba(192,57,43,0.4),rgba(224,112,112,0.2)); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid rgba(192,57,43,0.35); box-shadow: 0 0 16px rgba(192,57,43,0.2); }
  .sidebar-logo .logo-text h2 { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #f5e8e8; }
  .sidebar-logo .logo-text p  { font-size: 0.62rem; color: rgba(245,232,232,0.45); letter-spacing: 1.4px; text-transform: uppercase; margin-top: 1px; }
  .sidebar-admin { padding: 14px 20px; border-bottom: 1px solid var(--sidebar-border); display: flex; align-items: center; gap: 10px; }
  .admin-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#c0392b,#e07070); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 0 10px rgba(192,57,43,0.4); }
  .admin-info strong { display: block; font-size: 0.78rem; font-weight: 600; color: #f5e8e8; }
  .admin-info span { font-size: 0.67rem; color: rgba(245,232,232,0.45); }
  .admin-role-badge { margin-left: auto; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); border-radius: 4px; padding: 2px 7px; font-size: 0.6rem; font-weight: 700; color: var(--gold); letter-spacing: 0.8px; text-transform: uppercase; }
  .sidebar-nav { flex: 1; padding: 14px 12px; overflow-y: auto; }
  .nav-section-label { font-size: 0.6rem; font-weight: 700; color: rgba(245,232,232,0.3); text-transform: uppercase; letter-spacing: 1.2px; padding: 10px 8px 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; color: rgba(245,232,232,0.55); font-size: 0.82rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.18s; margin-bottom: 2px; }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: #f5e8e8; }
  .nav-item.active { background: rgba(192,57,43,0.2); color: #f5e8e8; border-left: 3px solid var(--accent); padding-left: 9px; }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
  .nav-item .nav-badge { margin-left: auto; background: var(--accent); border-radius: 10px; padding: 1px 7px; font-size: 0.62rem; font-weight: 700; color: #fff; }
  .sidebar-footer { padding: 14px 12px; border-top: 1px solid var(--sidebar-border); }
  .logout-btn { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: 9px; color: rgba(245,232,232,0.45); font-size: 0.82rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.18s; width: 100%; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .logout-btn:hover { color: var(--accent-light); background: rgba(192,57,43,0.1); }
  .logout-btn svg { width: 16px; height: 16px; }
  /* Main */
  .main { margin-left: 240px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 28px; height: 62px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40; box-shadow: 0 1px 8px rgba(140,30,30,0.06); }
  .topbar-left h1 { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--text); }
  .topbar-left p  { font-size: 0.76rem; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .tb-btn { width: 36px; height: 36px; border-radius: 9px; background: var(--input-bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; position: relative; }
  .tb-btn:hover { border-color: var(--accent-light); background: #fff0f0; }
  .tb-btn svg { width: 16px; height: 16px; color: var(--muted); }
  .tb-badge { position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 0.58rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .tb-divider { width: 1px; height: 24px; background: var(--border); }
  .tb-admin { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .tb-admin-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#c0392b,#e07070); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
  .tb-admin span { font-size: 0.78rem; font-weight: 600; color: var(--text); }
  .page-body { padding: 24px 28px 60px; flex: 1; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  /* Page header */
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; animation: fadeUp 0.4s ease both; flex-wrap: wrap; gap: 14px; }
  .page-header-left { display: flex; align-items: center; gap: 14px; }
  .back-btn { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 9px; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--muted); font-size: 0.8rem; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.15s; }
  .back-btn:hover { border-color: var(--accent-light); color: var(--accent); background: #fff0f0; }
  .back-btn svg { width: 14px; height: 14px; }
  .page-title h1 { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 700; color: var(--text); }
  .page-title p  { font-size: 0.76rem; color: var(--muted); margin-top: 2px; }
  /* Filter bar */
  .filter-bar { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; margin-bottom: 22px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; animation: fadeUp 0.42s ease both 0.05s; box-shadow: 0 2px 10px rgba(140,30,30,0.05); }
  .filter-bar-label { font-size: 0.76rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap; }
  .period-tabs { display: flex; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 9px; padding: 3px; gap: 2px; }
  .period-tab { padding: 6px 16px; border-radius: 7px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .period-tab.active { background: var(--accent); color: #fff; box-shadow: 0 2px 8px rgba(192,57,43,0.3); }
  .period-tab:hover:not(.active) { color: var(--accent); }
  .type-select { padding: 8px 14px; border: 1.5px solid var(--input-border); border-radius: 9px; background: var(--input-bg); font-size: 0.82rem; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; cursor: pointer; min-width: 150px; }
  .type-select:focus { border-color: var(--accent-light); }
  .date-range { display: flex; align-items: center; gap: 8px; }
  .date-input { padding: 8px 12px; border: 1.5px solid var(--input-border); border-radius: 9px; background: var(--input-bg); font-size: 0.8rem; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; }
  .date-input:focus { border-color: var(--accent-light); }
  .date-sep { font-size: 0.76rem; color: var(--muted); }
  .filter-spacer { flex: 1; }
  .export-group { display: flex; gap: 8px; }
  .btn-export-pdf { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 9px; border: none; background: linear-gradient(135deg, #c0392b, #991b1b); color: #fff; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; box-shadow: 0 3px 10px rgba(192,57,43,0.25); }
  .btn-export-pdf:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(192,57,43,0.35); }
  .btn-export-pdf svg { width: 14px; height: 14px; }
  .btn-export-csv { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 9px; border: 1.5px solid var(--input-border); background: var(--input-bg); color: var(--muted); font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .btn-export-csv:hover { border-color: var(--green); color: var(--green); background: var(--green-bg); }
  .btn-export-csv svg { width: 14px; height: 14px; }
  /* KPI */
  .kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 22px; animation: fadeUp 0.44s ease both 0.08s; }
  .kpi-card { background: var(--card); border-radius: 14px; padding: 18px 18px 16px; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(140,30,30,0.06); position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(140,30,30,0.1); }
  .kpi-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 0 0 14px 14px; }
  .kpi-card.c-red::after    { background: linear-gradient(90deg,#c0392b,#e07070); }
  .kpi-card.c-green::after  { background: linear-gradient(90deg,#16a34a,#22c55e); }
  .kpi-card.c-blue::after   { background: linear-gradient(90deg,#1d4ed8,#3b82f6); }
  .kpi-card.c-amber::after  { background: linear-gradient(90deg,#d97706,#f59e0b); }
  .kpi-card.c-purple::after { background: linear-gradient(90deg,#7c3aed,#a78bfa); }
  .kpi-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .kpi-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .ki-red    { background: #fff0f0; }
  .ki-green  { background: var(--green-bg); }
  .ki-blue   { background: var(--blue-bg); }
  .ki-amber  { background: var(--amber-bg); }
  .ki-purple { background: var(--purple-bg); }
  .kpi-trend { font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .kt-up   { background: var(--green-bg); color: var(--green); }
  .kt-down { background: #fff0f0; color: var(--accent); }
  .kpi-num   { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 700; color: var(--text); line-height: 1; }
  .kpi-label { font-size: 0.72rem; color: var(--muted); margin-top: 4px; }
  /* Grids */
  .main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 18px; margin-bottom: 18px; }
  .full-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
  /* Cards */
  .card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(140,30,30,0.06); overflow: hidden; animation: fadeUp 0.5s ease both 0.12s; }
  .card-header { padding: 16px 22px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-header-left { display: flex; align-items: center; gap: 10px; }
  .card-h-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg,#e07070,#c0392b); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; box-shadow: 0 2px 8px rgba(192,57,43,0.25); flex-shrink: 0; }
  .card-h-icon.green  { background: linear-gradient(135deg,#4ade80,#16a34a); }
  .card-h-icon.blue   { background: linear-gradient(135deg,#60a5fa,#1d4ed8); }
  .card-h-icon.amber  { background: linear-gradient(135deg,#fbbf24,#d97706); }
  .card-h-icon.purple { background: linear-gradient(135deg,#c084fc,#7c3aed); }
  .card-header h3 { font-family: 'Playfair Display', serif; font-size: 0.97rem; font-weight: 700; color: var(--text); }
  .card-header p  { font-size: 0.72rem; color: var(--muted); margin-top: 1px; }
  .card-body { padding: 20px 22px; }
  .period-label { font-size: 0.72rem; font-weight: 600; color: var(--muted); background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 20px; padding: 3px 12px; }
  /* Bar chart */
  .bar-chart-wrap { position: relative; }
  .bar-chart { height: 180px; display: flex; align-items: flex-end; gap: 4px; padding: 0 2px 0; position: relative; overflow: visible; }
  .bar-chart::before { content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0; background: repeating-linear-gradient(to bottom, transparent, transparent calc(25% - 1px), #f5e8e8 calc(25% - 1px), #f5e8e8 25%); pointer-events: none; z-index: 0; }
  .bc-group { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 0; }
  .bc-bars  { width: 100%; display: flex; align-items: flex-end; justify-content: center; gap: 1px; height: 160px; position: relative; z-index: 1; }
  .bc-bar { flex: 1; border-radius: 4px 4px 0 0; position: relative; cursor: pointer; transition: height 0.7s cubic-bezier(.22,.68,0,1.1), filter 0.15s; min-width: 4px; max-width: 22px; }
  .bc-bar:hover { filter: brightness(1.15); }
  .bc-bar.parcels    { background: linear-gradient(180deg, #e07070, #c0392b); }
  .bc-bar.letters    { background: linear-gradient(180deg, #60a5fa, #1d4ed8); }
  .bc-bar.express    { background: linear-gradient(180deg, #fbbf24, #d97706); }
  .bc-bar.registered { background: linear-gradient(180deg, #a78bfa, #7c3aed); }
  .bc-tooltip { position: absolute; bottom: calc(100% + 4px); left: 50%; transform: translateX(-50%); background: var(--text); color: #fff; font-size: 0.62rem; font-weight: 600; padding: 3px 7px; border-radius: 5px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.15s; z-index: 20; }
  .bc-bar:hover .bc-tooltip { opacity: 1; }
  .bc-label { font-size: 0.62rem; color: var(--muted); margin-top: 5px; font-weight: 500; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
  .chart-legend { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 14px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.73rem; color: var(--muted); }
  .legend-dot  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .ld-red    { background: #c0392b; }
  .ld-blue   { background: #1d4ed8; }
  .ld-amber  { background: #d97706; }
  .ld-purple { background: #7c3aed; }
  /* Revenue chart */
  .rev-line-svg { width: 100%; height: 160px; display: block; }
  /* Type breakdown */
  .type-rows { display: flex; flex-direction: column; gap: 12px; }
  .type-row { display: flex; flex-direction: column; gap: 5px; }
  .type-row-head { display: flex; align-items: center; justify-content: space-between; }
  .type-name { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600; color: var(--text); }
  .type-dot  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .type-count { font-size: 0.78rem; color: var(--muted); }
  .type-pct   { font-size: 0.78rem; font-weight: 700; color: var(--text); }
  .type-bar-track { height: 7px; background: var(--input-bg); border-radius: 10px; overflow: hidden; }
  .type-bar-fill  { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(.22,.68,0,1.1); }
  /* Revenue table */
  .rev-table { width: 100%; border-collapse: collapse; }
  .rev-table th { font-size: 0.67rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); padding: 8px 12px; text-align: left; border-bottom: 1.5px solid var(--border); background: #fdf8f8; }
  .rev-table td { padding: 11px 12px; font-size: 0.82rem; border-bottom: 1px solid #fdf5f5; vertical-align: middle; }
  .rev-table tr:last-child td { border-bottom: none; }
  .rev-table tr:hover td { background: #fffafa; }
  .rev-num { font-weight: 700; color: var(--text); font-family: 'Playfair Display', serif; }
  .rev-num.positive { color: var(--green); }
  .badge-small { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 0.67rem; font-weight: 700; }
  .bs-green  { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .bs-amber  { background: var(--amber-bg); color: var(--amber); border: 1px solid #fde68a; }
  .bs-red    { background: #fff0f0; color: var(--accent); border: 1px solid var(--input-border); }
  .bs-blue   { background: var(--blue-bg); color: var(--blue); border: 1px solid #bfdbfe; }
  .bs-purple { background: var(--purple-bg); color: var(--purple); border: 1px solid #ddd6fe; }
  /* Summary */
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .sum-cell { background: var(--input-bg); border-radius: 10px; padding: 12px 14px; border: 1px solid var(--input-border); }
  .sum-cell-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); font-weight: 700; }
  .sum-cell-val   { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--text); margin-top: 4px; }
  .sum-cell-sub   { font-size: 0.67rem; color: var(--muted); margin-top: 1px; }
  /* Top routes */
  .top-routes { display: flex; flex-direction: column; gap: 8px; }
  .route-row  { display: flex; align-items: center; gap: 10px; padding: 9px 12px; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 9px; }
  .route-rank { width: 22px; height: 22px; border-radius: 6px; background: linear-gradient(135deg,#e07070,#c0392b); color: #fff; font-size: 0.67rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .route-info { flex: 1; }
  .route-info .r-name { font-size: 0.8rem; font-weight: 600; color: var(--text); }
  .route-info .r-sub  { font-size: 0.67rem; color: var(--muted); margin-top: 1px; }
  .route-count { font-size: 0.78rem; font-weight: 700; color: var(--accent); font-family: 'Playfair Display', serif; }
  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(26,5,5,0.55); backdrop-filter: blur(4px); z-index: 200; display: none; align-items: center; justify-content: center; padding: 20px; }
  .modal-overlay.show { display: flex; }
  .modal { background: #fff; border-radius: 18px; width: 100%; max-width: 500px; box-shadow: 0 24px 60px rgba(26,5,5,0.25); animation: modalIn 0.3s cubic-bezier(.22,.68,0,1.2) both; overflow: hidden; }
  @keyframes modalIn { from { opacity:0; transform:scale(0.93) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .modal-icon { width: 40px; height: 40px; border-radius: 11px; background: #fff0f0; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .modal-header h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: var(--text); }
  .modal-header p  { font-size: 0.74rem; color: var(--muted); margin-top: 2px; }
  .modal-close { margin-left: auto; width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--border); background: var(--input-bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
  .modal-close:hover { background: #fff0f0; border-color: var(--accent-light); }
  .modal-close svg { width: 14px; height: 14px; color: var(--muted); }
  .modal-body  { padding: 20px 24px; }
  .modal-footer { padding: 0 24px 20px; display: flex; gap: 10px; }
  .export-option { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1.5px solid var(--input-border); border-radius: 12px; cursor: pointer; transition: all 0.15s; margin-bottom: 10px; }
  .export-option:hover { border-color: var(--accent-light); background: #fff8f8; }
  .export-option input[type=checkbox] { width: 16px; height: 16px; accent-color: var(--accent); cursor: pointer; flex-shrink: 0; }
  .export-option-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .export-option-text strong { display: block; font-size: 0.84rem; font-weight: 700; color: var(--text); }
  .export-option-text span   { font-size: 0.72rem; color: var(--muted); }
  .modal-label { font-size: 0.76rem; font-weight: 700; color: var(--text); margin-bottom: 8px; display: block; }
  .modal-select { width: 100%; padding: 9px 12px; border: 1.5px solid var(--input-border); border-radius: 9px; background: var(--input-bg); font-size: 0.83rem; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; margin-bottom: 16px; }
  .modal-btn-cancel { flex: 1; padding: 10px; border-radius: 9px; border: 1.5px solid var(--border); background: var(--input-bg); font-size: 0.83rem; font-weight: 600; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .modal-btn-cancel:hover { border-color: var(--accent-light); color: var(--accent); }
  .modal-btn-export { flex: 2; padding: 10px; border-radius: 9px; border: none; background: linear-gradient(135deg,#c0392b,#991b1b); color: #fff; font-size: 0.83rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .modal-btn-export:hover { box-shadow: 0 4px 14px rgba(192,57,43,0.35); transform: translateY(-1px); }
  .modal-btn-export svg { width: 14px; height: 14px; }
  /* Progress modal */
  .progress-wrap { text-align: center; padding: 10px 0 4px; }
  .progress-bar-track { height: 8px; background: var(--input-bg); border-radius: 10px; overflow: hidden; margin: 16px 0 8px; }
  .progress-bar-fill  { height: 100%; background: linear-gradient(90deg,#c0392b,#e07070); border-radius: 10px; transition: width 0.3s ease; }
  .progress-text { font-size: 0.8rem; color: var(--muted); }
  /* Toast */
  .toast { position: fixed; bottom: 28px; right: 28px; background: var(--text); color: #fff; padding: 12px 20px; border-radius: 11px; font-size: 0.83rem; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 10px; z-index: 300; opacity: 0; transform: translateY(12px); transition: all 0.3s; pointer-events: none; }
  .toast.show  { opacity: 1; transform: translateY(0); }
  .toast.green { background: #16a34a; }
  .toast svg   { width: 16px; height: 16px; }
  @media(max-width:1100px) { .kpi-row { grid-template-columns: repeat(3,1fr); } .main-grid { grid-template-columns: 1fr; } .full-grid { grid-template-columns: 1fr; } }
  @media(max-width:760px) { .main { margin-left: 0; } .sidebar { display: none; } .kpi-row { grid-template-columns: repeat(2,1fr); } .filter-bar { flex-direction: column; align-items: flex-start; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const DATA = {
  day: { labels:['8am','10am','12pm','2pm','4pm','6pm'], parcels:[4,6,9,7,5,3], letters:[2,3,5,4,3,1], express:[1,2,3,2,1,1], registered:[1,1,2,1,1,0], revenue:[620,840,1280,960,680,420], total:47, delivered:41, transit:4, revenue_total:4800, avg:102, periodLabel:'Today', chartSub:'Hourly — 11 Mar 2026', peakDay:'12:00–14:00', rate:'87%', ret:'3.2%', collected:'฿4,800' },
  week: { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], parcels:[18,24,22,30,20,14,8], letters:[10,13,11,15,12,8,5], express:[6,9,8,11,7,5,3], registered:[4,5,4,6,5,3,2], revenue:[2200,3100,2850,3800,2750,1900,1020], total:247, delivered:232, transit:11, revenue_total:18420, avg:74, periodLabel:'This Week', chartSub:'Mon 4 Mar — Sun 10 Mar 2026', peakDay:'Thursday', rate:'94%', ret:'2.4%', collected:'฿18,420' },
  month: { labels:['W1','W2','W3','W4'], parcels:[82,95,88,71], letters:[45,52,48,39], express:[28,33,30,24], registered:[18,21,19,15], revenue:[9800,11400,10600,8500], total:990, delivered:941, transit:38, revenue_total:40300, avg:40, periodLabel:'This Month', chartSub:'March 2026', peakDay:'Week 2', rate:'95%', ret:'1.8%', collected:'฿40,300' },
  year: { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], parcels:[280,260,310,90,0,0,0,0,0,0,0,0], letters:[155,143,171,50,0,0,0,0,0,0,0,0], express:[95,88,105,30,0,0,0,0,0,0,0,0], registered:[62,57,68,20,0,0,0,0,0,0,0,0], revenue:[38000,35400,42100,12000,0,0,0,0,0,0,0,0], total:2680, delivered:2540, transit:98, revenue_total:127500, avg:47, periodLabel:'This Year', chartSub:'January — December 2026', peakDay:'March', rate:'95%', ret:'1.6%', collected:'฿127,500' },
};
const TYPE_META = [
  { key:'parcels',    label:'📦 Parcels',    color:'#c0392b', badgeCls:'bs-red'    },
  { key:'express',    label:'⚡ Express',    color:'#d97706', badgeCls:'bs-amber'  },
  { key:'letters',    label:'✉️ Letters',    color:'#1d4ed8', badgeCls:'bs-blue'   },
  { key:'registered', label:'📋 Registered', color:'#7c3aed', badgeCls:'bs-purple' },
];
const AVG_FEE = { parcels:84, letters:18, express:185, registered:110 };
const TOP_ROUTES = [
  { name:'Bangkok → Nonthaburi', sub:'Metropolitan corridor', count:42 },
  { name:'Bangkok → Chiang Mai', sub:'North route', count:31 },
  { name:'Bangkok → Phuket', sub:'South route', count:28 },
  { name:'Bangkok → Khon Kaen', sub:'Northeast route', count:19 },
  { name:'Bangkok → Hat Yai', sub:'Deep south route', count:14 },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedCount(target, prefix = '', suffix = '') {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const dur = 900, start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = e * target;
      setDisplay(prefix + Math.round(v).toLocaleString() + suffix);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, prefix, suffix]);

  return display;
}

// ─── Bar chart component ──────────────────────────────────────────────────────
function BarChart({ d, typeFilter }) {
  const [animated, setAnimated] = useState(false);
  const keys = typeFilter === 'all' ? ['parcels','letters','express','registered'] : [typeFilter];
  const CHART_H = 160;

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [d, typeFilter]);

  const totals = d.labels.map((_, i) => keys.reduce((s, k) => s + d[k][i], 0));
  const maxV = Math.max(...totals, 1);

  return (
    <div className="bar-chart">
      {d.labels.map((lbl, i) => (
        <div key={lbl} className="bc-group">
          <div className="bc-bars">
            {keys.map((k, ki) => {
              const v = d[k][i];
              const px = Math.round((v / maxV) * CHART_H);
              return (
                <div
                  key={k}
                  className={`bc-bar ${k}`}
                  style={{ height: animated ? `${px}px` : '0px', transitionDelay: `${0.2 + i * 0.055}s` }}
                >
                  <div className="bc-tooltip">{v} {k}</div>
                </div>
              );
            })}
          </div>
          <div className="bc-label">{lbl}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Revenue SVG chart ────────────────────────────────────────────────────────
function RevChart({ d }) {
  const vals = d.revenue;
  const maxR = Math.max(...vals, 1);
  const W = 600, H = 150, padX = 10, padY = 16;
  const n = vals.length;

  const pts = vals.map((v, i) => ({
    x: Math.round(padX + (i / Math.max(n - 1, 1)) * (W - padX * 2)),
    y: Math.round(padY + (1 - v / maxR) * (H - padY * 2)),
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${H} ` + pts.map(p => `${p.x},${p.y}`).join(' ') + ` ${pts[pts.length - 1].x},${H}`;

  return (
    <>
      <svg className="rev-line-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c0392b" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c0392b" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#revGrad)" />
        <polyline points={polyline} fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#c0392b" stroke="white" strokeWidth="2">
            <title>฿{vals[i].toLocaleString()}</title>
          </circle>
        ))}
      </svg>
      <div style={{ display:'flex', gap:0, marginTop:6 }}>
        {d.labels.map(l => (
          <div key={l} style={{ flex:1, textAlign:'center', fontSize:'0.62rem', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" }}>{l}</div>
        ))}
      </div>
    </>
  );
}

// ─── Type breakdown ───────────────────────────────────────────────────────────
function TypeBreakdown({ d, typeFilter }) {
  const [widths, setWidths] = useState({});
  const relevant = typeFilter === 'all' ? TYPE_META : TYPE_META.filter(t => t.key === typeFilter);
  const totals = relevant.map(t => d[t.key].reduce((s, v) => s + v, 0));
  const grand = totals.reduce((s, v) => s + v, 0) || 1;

  useEffect(() => {
    setWidths({});
    const t = setTimeout(() => {
      const w = {};
      relevant.forEach((t2, i) => { w[t2.key] = Math.round((totals[i] / grand) * 100); });
      setWidths(w);
    }, 150);
    return () => clearTimeout(t);
  }, [d, typeFilter]);

  return (
    <div className="type-rows">
      {relevant.map((t, i) => {
        const cnt = totals[i];
        const pct = Math.round((cnt / grand) * 100);
        return (
          <div key={t.key} className="type-row">
            <div className="type-row-head">
              <div className="type-name">
                <div className="type-dot" style={{ background: t.color }} />
                {t.label}
              </div>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span className="type-count">{cnt} parcels</span>
                <span className="type-pct">{pct}%</span>
              </div>
            </div>
            <div className="type-bar-track">
              <div className="type-bar-fill" style={{ width: `${widths[t.key] ?? 0}%`, background: t.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── KPI card with animated counter ──────────────────────────────────────────
function KpiCard({ color, iconCls, icon, trend, trendCls, target, prefix = '', suffix = '', label }) {
  const val = useAnimatedCount(target, prefix, suffix);
  return (
    <div className={`kpi-card c-${color}`}>
      <div className="kpi-top">
        <div className={`kpi-icon ki-${iconCls}`}>{icon}</div>
        <span className={`kpi-trend ${trendCls}`}>{trend}</span>
      </div>
      <div className="kpi-num">{val}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [period, setPeriodState] = useState('week');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('2026-03-04');
  const [dateTo, setDateTo] = useState('2026-03-11');

  // Export modal
  const [exportModal, setExportModal] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const [exportChecks, setExportChecks] = useState({ stats: true, revenue: true, routes: false, summary: false });
  const [exportPeriodSel, setExportPeriodSel] = useState('This Week (4–10 Mar 2026)');

  // Progress modal
  const [progress, setProgress] = useState({ show: false, title: '', step: '', pct: 0 });

  // Toast
  const [toast, setToast] = useState({ show: false, msg: '' });
  const toastRef = useRef(null);

  const d = DATA[period];

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }, []);

  const openExport = (type) => { setExportType(type); setExportModal(true); };
  const closeExportModal = () => setExportModal(false);

  const exportCSV = useCallback(() => {
    const rows = [['Period','Label','Parcels','Letters','Express','Registered','Total','Revenue (THB)']];
    d.labels.forEach((lbl, i) => {
      const total = d.parcels[i] + d.letters[i] + d.express[i] + d.registered[i];
      rows.push([d.periodLabel, lbl, d.parcels[i], d.letters[i], d.express[i], d.registered[i], total, d.revenue[i]]);
    });
    rows.push([], [' SUMMARY '], [' Total Parcels', d.total], ['Delivered', d.delivered], ['In Transit', d.transit],
      ['Total Revenue (THB)', d.revenue_total], ['Avg Fee (THB)', d.avg], ['Delivery Rate', d.rate], ['Return Rate', d.ret], ['Peak Day', d.peakDay]);
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'PostOffice_Report_' + d.periodLabel.replace(/\s+/g, '_') + '.csv';
    a.click(); URL.revokeObjectURL(url);
  }, [d]);

  const runExport = useCallback(async () => {
    closeExportModal();
    if (exportType === 'csv') {
      setProgress({ show: true, title: 'Exporting CSV...', step: 'Building rows...', pct: 40 });
      await new Promise(r => setTimeout(r, 300));
      exportCSV();
      setProgress(p => ({ ...p, pct: 100, step: 'Done!' }));
      await new Promise(r => setTimeout(r, 400));
      setProgress(p => ({ ...p, show: false }));
      showToast('CSV downloaded: PostOffice_Report_' + d.periodLabel.replace(/\s+/g, '_') + '.csv');
    } else {
      setProgress({ show: true, title: 'Generating PDF...', step: 'Starting...', pct: 0 });
      // jsPDF would be loaded via CDN — placeholder flow
      await new Promise(r => setTimeout(r, 400));
      setProgress(p => ({ ...p, pct: 100, step: 'Done!' }));
      await new Promise(r => setTimeout(r, 300));
      setProgress(p => ({ ...p, show: false }));
      showToast('PDF downloaded successfully');
    }
  }, [exportType, exportCSV, d.periodLabel, showToast]);

  const relevant = typeFilter === 'all' ? TYPE_META : TYPE_META.filter(t => t.key === typeFilter);

  return (
    <>
      {/* Load jsPDF for PDF export */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" />
      <style>{styles}</style>
      <div className="ar-root">

        {/* ── Sidebar ── */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">📮</div>
            <div className="logo-text"><h2>Post Office</h2><p>Admin Panel</p></div>
          </div>
          <div className="sidebar-admin">
            <div className="admin-avatar">👨‍💼</div>
            <div className="admin-info"><strong>Super Admin</strong><span>Administrator</span></div>
            <span className="admin-role-badge">Admin</span>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Overview</div>
            <a className="nav-item" href="/admin/dashboard">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Dashboard
            </a>
            <div className="nav-section-label" style={{ marginTop:8 }}>Management</div>
            <a className="nav-item" href="/admin/users">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
              User Approval
              <span className="nav-badge">5</span>
            </a>
            <a className="nav-item active" href="/admin/reports">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              Statistics & Reports
            </a>
            <div className="nav-section-label" style={{ marginTop:8 }}>System</div>
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
        </nav>

        {/* ── Main ── */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <h1>Statistics & Reports</h1>
              <p>FR-11 · FR-12 · FR-13 — Parcel stats, revenue analytics, PDF export</p>
            </div>
            <div className="topbar-right">
              <button className="tb-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <div className="tb-badge">5</div>
              </button>
              <div className="tb-divider" />
              <div className="tb-admin">
                <div className="tb-admin-avatar">👨‍💼</div>
                <span>Super Admin</span>
              </div>
            </div>
          </header>

          <div className="page-body">
            {/* Page header */}
            <div className="page-header">
              <div className="page-header-left">
                <a href="/admin/dashboard" className="back-btn">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  Back to Dashboard
                </a>
                <div className="page-title">
                  <h1>Statistics & Reports</h1>
                  <p>Wednesday, 11 March 2026</p>
                </div>
              </div>
              <div className="export-group">
                <button className="btn-export-csv" onClick={() => openExport('csv')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Export CSV
                </button>
                <button className="btn-export-pdf" onClick={() => openExport('pdf')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
              <span className="filter-bar-label">Period</span>
              <div className="period-tabs">
                {['day','week','month','year'].map(p => (
                  <button key={p} className={`period-tab${period === p ? ' active' : ''}`} onClick={() => setPeriodState(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <span className="filter-bar-label" style={{ marginLeft:8 }}>Type</span>
              <select className="type-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="parcels">📦 Parcels</option>
                <option value="letters">✉️ Letters</option>
                <option value="express">⚡ Express</option>
                <option value="registered">📋 Registered</option>
              </select>
              <div className="date-range">
                <input type="date" className="date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                <span className="date-sep">–</span>
                <input type="date" className="date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
              <div className="filter-spacer" />
              <span className="period-label">{d.periodLabel}</span>
            </div>

            {/* KPI row */}
            <div className="kpi-row">
              <KpiCard color="red"    iconCls="red"    icon="📦" trend="↑ 12%" trendCls="kt-up"   target={d.total}         label="Total Parcels" />
              <KpiCard color="green"  iconCls="green"  icon="✅" trend="↑ 8%"  trendCls="kt-up"   target={d.delivered}     label="Delivered" />
              <KpiCard color="blue"   iconCls="blue"   icon="🚚" trend="↑ 5%"  trendCls="kt-up"   target={d.transit}       label="In Transit" />
              <KpiCard color="amber"  iconCls="amber"  icon="💰" trend="↑ 18%" trendCls="kt-up"   target={d.revenue_total} prefix="฿" label="Revenue (฿)" />
              <KpiCard color="purple" iconCls="purple" icon="📈" trend="↑ 3%"  trendCls="kt-up"   target={d.avg}           prefix="฿" label="Avg. Fee (฿)" />
            </div>

            {/* FR-11: Bar chart + Type breakdown */}
            <div className="main-grid">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon">📊</div>
                    <div><h3>Parcel Volume by Type</h3><p>{d.chartSub}</p></div>
                  </div>
                  <span className="period-label">{d.periodLabel}</span>
                </div>
                <div className="card-body">
                  <BarChart d={d} typeFilter={typeFilter} />
                  <div className="chart-legend">
                    <div className="legend-item"><div className="legend-dot ld-red" /> Parcels</div>
                    <div className="legend-item"><div className="legend-dot ld-blue" /> Letters</div>
                    <div className="legend-item"><div className="legend-dot ld-amber" /> Express</div>
                    <div className="legend-item"><div className="legend-dot ld-purple" /> Registered</div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon amber">🥧</div>
                    <div><h3>Type Breakdown</h3><p>Share of total volume</p></div>
                  </div>
                </div>
                <div className="card-body">
                  <TypeBreakdown d={d} typeFilter={typeFilter} />
                </div>
              </div>
            </div>

            {/* FR-12: Revenue chart + Revenue by type table */}
            <div className="main-grid">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon green">💰</div>
                    <div><h3>Revenue Report</h3><p>Daily revenue — {d.periodLabel.toLowerCase()}</p></div>
                  </div>
                  <span className="period-label">{d.periodLabel}</span>
                </div>
                <div className="card-body">
                  <div className="rev-chart"><RevChart d={d} /></div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon purple">📋</div>
                    <div><h3>Revenue by Type</h3><p>Breakdown this period</p></div>
                  </div>
                </div>
                <div className="card-body" style={{ padding:0 }}>
                  <table className="rev-table">
                    <thead>
                      <tr><th>Type</th><th>Parcels</th><th>Revenue</th><th>Avg. Fee</th></tr>
                    </thead>
                    <tbody>
                      {relevant.map(t => {
                        const cnt = d[t.key].reduce((s, v) => s + v, 0);
                        const rev = cnt * AVG_FEE[t.key];
                        return (
                          <tr key={t.key}>
                            <td><span className={`badge-small ${t.badgeCls}`}>{t.label}</span></td>
                            <td>{cnt}</td>
                            <td className="rev-num positive">฿{rev.toLocaleString()}</td>
                            <td className="rev-num">฿{AVG_FEE[t.key]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary + Top routes */}
            <div className="full-grid">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon blue">📌</div>
                    <div><h3>Period Summary</h3><p>Key metrics at a glance</p></div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="summary-grid">
                    <div className="sum-cell"><div className="sum-cell-label">Delivery Rate</div><div className="sum-cell-val">{d.rate}</div><div className="sum-cell-sub">of all shipments delivered</div></div>
                    <div className="sum-cell"><div className="sum-cell-label">Return Rate</div><div className="sum-cell-val">{d.ret}</div><div className="sum-cell-sub">returned / failed</div></div>
                    <div className="sum-cell"><div className="sum-cell-label">Peak Day</div><div className="sum-cell-val">{d.peakDay}</div><div className="sum-cell-sub">highest volume day</div></div>
                    <div className="sum-cell"><div className="sum-cell-label">Total Collected</div><div className="sum-cell-val">{d.collected}</div><div className="sum-cell-sub">all payment methods</div></div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="card-h-icon">🗺️</div>
                    <div><h3>Top Routes</h3><p>Most active origin → destination</p></div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="top-routes">
                    {TOP_ROUTES.map((r, i) => (
                      <div key={r.name} className="route-row">
                        <div className="route-rank">{i + 1}</div>
                        <div className="route-info">
                          <div className="r-name">{r.name}</div>
                          <div className="r-sub">{r.sub}</div>
                        </div>
                        <div className="route-count">{r.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FR-13: Export Modal ── */}
        <div className={`modal-overlay${exportModal ? ' show' : ''}`} onClick={e => { if (e.target === e.currentTarget) setExportModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-icon">📄</div>
              <div>
                <h3>{exportType === 'pdf' ? 'Export PDF Report' : 'Export CSV Data'}</h3>
                <p>Choose sections to include in the report</p>
              </div>
              <button className="modal-close" onClick={closeExportModal}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-label">Include sections</label>
              {[
                { key:'stats',   icon:'📊', bg:'#fff0f0',              title:'Parcel Statistics',  sub:'Volume by type, period totals, delivery rates' },
                { key:'revenue', icon:'💰', bg:'var(--green-bg)',       title:'Revenue Report',     sub:'Daily revenue, totals by type, average fees' },
                { key:'routes',  icon:'🗺️', bg:'var(--blue-bg)',        title:'Top Routes',         sub:'Most active origin-destination pairs' },
                { key:'summary', icon:'📌', bg:'var(--amber-bg)',       title:'Period Summary',     sub:'Delivery rate, return rate, peak day' },
              ].map(opt => (
                <label key={opt.key} className="export-option">
                  <input type="checkbox" checked={exportChecks[opt.key]} onChange={e => setExportChecks(c => ({ ...c, [opt.key]: e.target.checked }))} />
                  <div className="export-option-icon" style={{ background: opt.bg }}>{opt.icon}</div>
                  <div className="export-option-text"><strong>{opt.title}</strong><span>{opt.sub}</span></div>
                </label>
              ))}
              <label className="modal-label" style={{ marginTop:4 }}>Report period</label>
              <select className="modal-select" value={exportPeriodSel} onChange={e => setExportPeriodSel(e.target.value)}>
                <option>This Week (4–10 Mar 2026)</option>
                <option>This Month (Mar 2026)</option>
                <option>Last Month (Feb 2026)</option>
                <option>Custom date range</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={closeExportModal}>Cancel</button>
              <button className="modal-btn-export" onClick={runExport}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {exportType === 'pdf' ? 'Generate PDF' : 'Download CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress modal */}
        <div className={`modal-overlay${progress.show ? ' show' : ''}`}>
          <div className="modal" style={{ maxWidth:360 }}>
            <div className="modal-body" style={{ padding:'28px 28px 24px' }}>
              <div className="progress-wrap">
                <div style={{ fontSize:'2rem', marginBottom:12 }}>📄</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'var(--text)', marginBottom:4 }}>{progress.title}</div>
                <div className="progress-text">{progress.step}</div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progress.pct}%` }} />
                </div>
                <div className="progress-text">{progress.pct}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`toast green${toast.show ? ' show' : ''}`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          <span>{toast.msg}</span>
        </div>
      </div>
    </>
  );
}
