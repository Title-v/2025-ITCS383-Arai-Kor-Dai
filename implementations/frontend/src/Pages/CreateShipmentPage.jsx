import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --accent: #E60012; --accent-dark: #8B0009; --accent-light: #FF6666;
    --bg: linear-gradient(135deg, #E60012 0%, #FFAAAA 100%);
    --card: rgba(255,255,255,0.97); --text: #1a1a2e; --muted: #6B5050;
    --input-bg: #FFF5F5; --input-border: #FFD0D0;
    --error: #e53935; --success-bg: #f0fdf4; --success: #16a34a;
  }
  .cs-root {
    min-height: 100vh; background: var(--bg);
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 36px 16px 64px; position: relative; overflow-x: hidden;
  }
  .cs-root::before {
    content: ''; position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }
  .blob { position: fixed; border-radius: 50%; filter: blur(72px); opacity: 0.17; pointer-events: none; z-index: 0; animation: blobFloat 10s ease-in-out infinite alternate; }
  .b1 { width: 500px; height: 500px; background: #E60012; top: -150px; left: -130px; }
  .b2 { width: 380px; height: 380px; background: #FF9999; bottom: -100px; right: -80px; animation-delay: 4s; }
  .b3 { width: 240px; height: 240px; background: #FFB3B3; top: 40%; left: 60%; animation-delay: 7s; }
  @keyframes blobFloat { from { transform: translateY(0) scale(1); } to { transform: translateY(-32px) scale(1.05); } }
  .deco { position: fixed; opacity: 0.055; pointer-events: none; z-index: 0; color: #fff; }
  .deco svg { fill: currentColor; }
  .d1 { width: 100px; top: 7%; left: 5%; animation: drift 13s ease-in-out infinite alternate; }
  .d2 { width: 70px; bottom: 14%; left: 16%; animation: drift 10s ease-in-out infinite alternate; animation-delay: 3s; transform: rotate(-15deg); }
  .d3 { width: 90px; top: 30%; right: 4%; animation: drift 11s ease-in-out infinite alternate; animation-delay: 6s; transform: rotate(10deg); }
  .d4 { width: 55px; bottom: 25%; right: 18%; animation: drift 9s ease-in-out infinite alternate; animation-delay: 1.5s; }
  @keyframes drift { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-20px) rotate(5deg); } }
  .page { position: relative; z-index: 1; max-width: 980px; margin: 0 auto; }
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; animation: fadeDown 0.5s ease both; }
  .back-btn { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.22); border: none; color: #fff; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 9px 18px; border-radius: 50px; cursor: pointer; backdrop-filter: blur(8px); text-decoration: none; transition: background 0.2s; }
  .back-btn:hover { background: rgba(255,255,255,0.35); }
  .back-btn svg { width: 15px; height: 15px; }
  .page-title { text-align: center; flex: 1; }
  .page-title h1 { font-family: 'Barlow', sans-serif; font-size: 1.9rem; font-weight: 700; color: #fff; text-shadow: 0 2px 14px rgba(160,20,20,0.22); }
  .page-title p { color: rgba(255,255,255,0.72); font-size: 0.82rem; font-weight: 300; margin-top: 3px; }
  .topbar-right { width: 110px; display: flex; justify-content: flex-end; }
  .draft-btn { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.78rem; font-weight: 500; padding: 8px 14px; border-radius: 50px; cursor: pointer; backdrop-filter: blur(8px); transition: background 0.2s; }
  .draft-btn:hover { background: rgba(255,255,255,0.3); }
  .main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
  .card { background: var(--card); border-radius: 20px; box-shadow: 0 20px 60px rgba(140,30,30,0.16), 0 2px 8px rgba(140,30,30,0.07); overflow: hidden; animation: fadeUp 0.55s ease both 0.1s; }
  .card-header { padding: 22px 28px 18px; border-bottom: 1px solid #FFE0E0; display: flex; align-items: center; gap: 12px; }
  .card-header-icon { width: 38px; height: 38px; flex-shrink: 0; background: linear-gradient(135deg, #FF6666, #E60012); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(192,57,43,0.3); }
  .card-header h3 { font-family: 'Barlow', sans-serif; font-size: 1.05rem; font-weight: 700; color: var(--text); }
  .card-header p { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }
  .card-body { padding: 24px 28px; }
  .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; }
  .fields-grid .full { grid-column: 1 / -1; }
  .field { display: flex; flex-direction: column; }
  .field label { font-size: 0.77rem; font-weight: 600; color: var(--text); margin-bottom: 6px; letter-spacing: 0.3px; }
  .field label .req { color: var(--accent); margin-left: 2px; }
  .input-wrap { display: flex; align-items: center; background: var(--input-bg); border: 1.5px solid var(--input-border); border-radius: 10px; padding: 0 13px; transition: border-color 0.2s, box-shadow 0.2s; }
  .input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(192,57,43,0.1); }
  .input-wrap.error { border-color: var(--error); }
  .input-wrap.error:focus-within { box-shadow: 0 0 0 3px rgba(229,57,53,0.1); }
  .ii { color: #d4a0a0; display: flex; align-items: center; margin-right: 9px; flex-shrink: 0; }
  .ii svg { width: 15px; height: 15px; }
  .input-wrap input, .input-wrap select, .input-wrap textarea { border: none; background: transparent; outline: none; flex: 1; padding: 11px 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.86rem; color: var(--text); }
  .input-wrap select { cursor: pointer; }
  .input-wrap input::placeholder, .input-wrap select::placeholder, .input-wrap textarea::placeholder { color: #d4aaaa; }
  .input-wrap textarea { resize: none; padding: 10px 0; min-height: 68px; }
  .field-error { font-size: 0.72rem; color: var(--error); margin-top: 4px; display: none; }
  .field-error.show { display: block; }
  .field-hint { font-size: 0.72rem; color: var(--muted); margin-top: 4px; }
  .autofill-hint { font-size: 0.72rem; color: var(--success); margin-top: 4px; font-weight: 500; }
  .input-wrap.autofilled { border-color: var(--success); background: #f0fdf4; }
  .input-wrap.autofilled:focus-within { box-shadow: 0 0 0 3px rgba(22,163,106,0.1); }
  .sec-label { font-size: 0.7rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--input-border); }
  .pkg-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 4px; }
  .pkg-opt { border: 2px solid var(--input-border); border-radius: 12px; padding: 12px 8px; text-align: center; cursor: pointer; background: var(--input-bg); transition: all 0.2s; user-select: none; }
  .pkg-opt:hover { border-color: var(--accent-light); background: #FFE0E0; }
  .pkg-opt.selected { border-color: var(--accent); background: #ffe0e0; box-shadow: 0 0 0 3px rgba(192,57,43,0.12); }
  .pkg-opt .pkg-icon { font-size: 1.6rem; margin-bottom: 5px; }
  .pkg-opt .pkg-name { font-size: 0.72rem; font-weight: 600; color: var(--text); }
  .pkg-opt .pkg-price { font-size: 0.68rem; color: var(--muted); margin-top: 2px; }
  .pkg-opt.selected .pkg-name { color: var(--accent); }
  .service-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .service-pill { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 50px; border: 2px solid var(--input-border); background: var(--input-bg); font-size: 0.8rem; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.2s; user-select: none; }
  .service-pill:hover { border-color: var(--accent-light); color: var(--accent); }
  .service-pill.selected { border-color: var(--accent); background: #ffe0e0; color: var(--accent); font-weight: 600; }
  .pill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--input-border); transition: background 0.2s; }
  .service-pill.selected .pill-dot { background: var(--accent); }
  .dims-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--input-bg); border: 1.5px solid var(--input-border); border-radius: 10px; }
  .toggle-info strong { font-size: 0.84rem; font-weight: 600; color: var(--text); display: block; }
  .toggle-info span { font-size: 0.73rem; color: var(--muted); }
  .toggle-switch { position: relative; width: 44px; height: 24px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-track { position: absolute; inset: 0; background: var(--input-border); border-radius: 50px; cursor: pointer; transition: background 0.25s; }
  .toggle-track::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
  .toggle-switch input:checked + .toggle-track { background: var(--accent); }
  .toggle-switch input:checked + .toggle-track::after { transform: translateX(20px); }
  .chips-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip { display: flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 8px; border: 1.5px solid var(--input-border); background: var(--input-bg); font-size: 0.76rem; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.18s; user-select: none; }
  .chip:hover { border-color: var(--accent-light); color: var(--accent); }
  .chip.on { border-color: var(--accent); background: #ffe0e0; color: var(--accent); font-weight: 600; }
  .summary-card { background: var(--card); border-radius: 20px; box-shadow: 0 20px 60px rgba(140,30,30,0.16), 0 2px 8px rgba(140,30,30,0.07); overflow: hidden; position: sticky; top: 24px; animation: fadeUp 0.55s ease both 0.2s; }
  .summary-header { background: linear-gradient(135deg, #B8000E, #E60012); padding: 20px 24px; position: relative; overflow: hidden; }
  .summary-header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.14) 0%, transparent 60%); }
  .summary-header h3 { font-family: 'Barlow', sans-serif; font-size: 1.05rem; font-weight: 700; color: #fff; position: relative; z-index: 1; }
  .summary-header p { font-size: 0.72rem; color: rgba(255,255,255,0.68); margin-top: 2px; position: relative; z-index: 1; }
  .tracking-preview { margin: 16px 20px 0; padding: 12px 16px; background: #FFF5F5; border: 2px dashed var(--input-border); border-radius: 10px; text-align: center; }
  .tracking-preview .track-label { font-size: 0.68rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  .tracking-preview .track-id { font-family: 'IBM Plex Sans', sans-serif; font-weight: 700; font-size: 1rem; color: var(--accent); margin-top: 3px; letter-spacing: 1px; }
  .summary-body { padding: 16px 20px; }
  .sum-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; padding: 9px 0; border-bottom: 1px solid #fff4f4; font-size: 0.82rem; }
  .sum-row:last-of-type { border-bottom: none; }
  .sum-key { color: var(--muted); font-weight: 400; flex-shrink: 0; }
  .sum-val { color: var(--text); font-weight: 600; text-align: right; }
  .sum-val.accent { color: var(--accent); }
  .sum-divider { height: 1px; background: var(--input-border); margin: 10px 0; }
  .sum-total { display: flex; align-items: center; justify-content: space-between; padding: 12px 0 4px; }
  .sum-total .total-label { font-family: 'Barlow', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--text); }
  .sum-total .total-amt { font-family: 'Barlow', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--accent); }
  .submit-area { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }
  .submit-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #E60012, #B8000E); color: #fff; border: none; border-radius: 11px; font-family: 'Barlow', sans-serif; font-size: 1rem; font-weight: 500; cursor: pointer; letter-spacing: 0.3px; transition: transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 18px rgba(192,57,43,0.35); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent); pointer-events: none; }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(192,57,43,0.42); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn.loading { opacity: 0.75; pointer-events: none; }
  .btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .preview-btn { width: 100%; padding: 11px; background: transparent; color: var(--accent); border: 2px solid var(--input-border); border-radius: 11px; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 7px; }
  .preview-btn:hover { border-color: var(--accent); background: var(--input-bg); }
  .success-overlay { display: none; position: fixed; inset: 0; z-index: 100; background: rgba(160,20,20,0.45); backdrop-filter: blur(8px); align-items: center; justify-content: center; animation: fadeIn 0.3s ease both; }
  .success-overlay.show { display: flex; }
  .success-box { background: #fff; border-radius: 24px; padding: 44px 40px; text-align: center; max-width: 380px; width: 90%; box-shadow: 0 32px 80px rgba(130,20,20,0.28); animation: popUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
  .success-big { font-size: 3.5rem; display: block; margin-bottom: 12px; animation: bounce 0.6s cubic-bezier(.22,.68,0,1.4) both 0.15s; }
  .success-box h2 { font-family: 'Barlow', sans-serif; font-size: 1.45rem; color: var(--text); margin-bottom: 6px; }
  .success-box p { font-size: 0.845rem; color: var(--muted); line-height: 1.6; }
  .success-track { margin: 18px auto 0; padding: 14px 20px; background: var(--input-bg); border-radius: 12px; display: inline-block; width: 100%; }
  .success-track .st-label { font-size: 0.68rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  .success-track .st-id { font-size: 1.15rem; font-weight: 700; color: var(--accent); letter-spacing: 1.5px; margin-top: 3px; }
  .success-actions { display: flex; gap: 10px; margin-top: 22px; }
  .sa-btn { flex: 1; padding: 11px; border-radius: 10px; font-family: 'IBM Plex Sans', sans-serif; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: all 0.15s; border: none; text-decoration: none; display: flex; align-items: center; justify-content: center; }
  .sa-primary { background: linear-gradient(135deg, #E60012, #B8000E); color: #fff; box-shadow: 0 4px 14px rgba(192,57,43,0.3); }
  .sa-primary:hover { transform: translateY(-1px); box-shadow: 0 7px 20px rgba(192,57,43,0.38); }
  .sa-secondary { background: var(--input-bg); color: var(--accent); border: 2px solid var(--input-border) !important; }
  .sa-secondary:hover { border-color: var(--accent) !important; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popUp { from { opacity: 0; transform: scale(0.88) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes bounce { 0% { transform: scale(0.4); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 760px) {
    .main-grid { grid-template-columns: 1fr; }
    .summary-card { position: static; }
    .pkg-selector { grid-template-columns: repeat(2, 1fr); }
    .dims-row { grid-template-columns: 1fr 1fr; }
    .fields-grid { grid-template-columns: 1fr; }
    .fields-grid .full { grid-column: 1; }
    .page-title h1 { font-size: 1.4rem; }
    .topbar-right { display: none; }
  }
`;

// ─── Province data ────────────────────────────────────────────────────────────
const PROVINCE_GROUPS = [
  { label: "── Bangkok Metropolitan", provinces: ["Bangkok","Nonthaburi","Pathum Thani","Samut Prakan","Nakhon Pathom","Samut Sakhon"] },
  { label: "── Central Region", provinces: ["Phra Nakhon Si Ayutthaya","Saraburi","Ang Thong","Sing Buri","Lopburi","Chai Nat","Suphan Buri","Ratchaburi","Kanchanaburi","Samut Songkhram","Phetchaburi","Prachuap Khiri Khan","Nakhon Sawan","Uthai Thani","Kamphaeng Phet"] },
  { label: "── Eastern Region", provinces: ["Chonburi","Rayong","Chanthaburi","Trat","Nakhon Nayok","Prachin Buri","Sa Kaeo","Chachoengsao"] },
  { label: "── Northern Region", provinces: ["Chiang Mai","Chiang Rai","Lampang","Lamphun","Mae Hong Son","Nan","Phayao","Phrae","Uttaradit","Sukhothai","Phitsanulok","Phichit","Phetchabun","Tak"] },
  { label: "── Northeastern Region", provinces: ["Nakhon Ratchasima","Khon Kaen","Udon Thani","Buriram","Surin","Si Sa Ket","Ubon Ratchathani","Yasothon","Roi Et","Maha Sarakham","Kalasin","Sakon Nakhon","Nakhon Phanom","Mukdahan","Amnat Charoen","Nong Khai","Bueng Kan","Nong Bua Lam Phu","Loei","Chaiyaphum"] },
  { label: "── Southern Region", provinces: ["Chumphon","Ranong","Surat Thani","Nakhon Si Thammarat","Krabi","Phang Nga","Phuket","Trang","Phatthalung","Songkhla","Satun","Pattani","Yala","Narathiwat"] },
];

const CLUSTER = {
  Bangkok:0,Nonthaburi:0,"Pathum Thani":0,"Samut Prakan":0,"Nakhon Pathom":0,"Samut Sakhon":0,
  "Phra Nakhon Si Ayutthaya":1,Saraburi:1,"Ang Thong":1,"Sing Buri":1,Lopburi:1,"Chai Nat":1,
  "Suphan Buri":1,Ratchaburi:1,Kanchanaburi:1,"Samut Songkhram":1,Phetchaburi:1,"Prachuap Khiri Khan":1,
  "Nakhon Sawan":1,"Uthai Thani":1,"Kamphaeng Phet":1,Chachoengsao:1,"Nakhon Nayok":1,"Prachin Buri":1,
  Chonburi:1,Rayong:1,"Sa Kaeo":1,Chanthaburi:1,Trat:1,
  Tak:2,Sukhothai:2,Phitsanulok:2,Phichit:2,Phetchabun:2,Uttaradit:2,Lampang:2,Lamphun:2,
  Phrae:2,Phayao:2,"Chiang Mai":2,"Chiang Rai":2,Nan:2,"Mae Hong Son":2,
  "Nakhon Ratchasima":3,Chaiyaphum:3,Buriram:3,Surin:3,"Si Sa Ket":3,"Ubon Ratchathani":3,
  Yasothon:3,"Amnat Charoen":3,"Maha Sarakham":3,"Roi Et":3,Kalasin:3,"Khon Kaen":3,
  "Udon Thani":3,Loei:3,"Nong Bua Lam Phu":3,"Sakon Nakhon":3,"Nakhon Phanom":3,
  Mukdahan:3,"Nong Khai":3,"Bueng Kan":3,
  Chumphon:4,Ranong:4,"Surat Thani":4,"Phang Nga":4,Phuket:4,Krabi:4,
  "Nakhon Si Thammarat":4,Phatthalung:4,Trang:4,
  Songkhla:5,Satun:5,Pattani:5,Yala:5,Narathiwat:5,
};
const CB = [
  [ 0, 18, 62, 58, 68, 88],
  [18,  0, 47, 42, 52, 72],
  [62, 47,  0, 57, 77, 97],
  [58, 42, 57,  0, 72, 92],
  [68, 52, 77, 72,  0, 28],
  [88, 72, 97, 92, 28,  0],
];
const RANK = {};
[
  ["Bangkok","Nonthaburi","Pathum Thani","Samut Prakan","Nakhon Pathom","Samut Sakhon"],
  ["Phra Nakhon Si Ayutthaya","Chachoengsao","Chonburi","Nakhon Nayok","Saraburi","Ang Thong","Sing Buri","Lopburi","Prachin Buri","Chai Nat","Suphan Buri","Ratchaburi","Rayong","Samut Songkhram","Kanchanaburi","Phetchaburi","Sa Kaeo","Nakhon Sawan","Uthai Thani","Prachuap Khiri Khan","Chanthaburi","Kamphaeng Phet","Trat"],
  ["Phitsanulok","Phichit","Tak","Sukhothai","Phetchabun","Uttaradit","Lamphun","Lampang","Chiang Mai","Phrae","Phayao","Nan","Chiang Rai","Mae Hong Son"],
  ["Nakhon Ratchasima","Chaiyaphum","Khon Kaen","Buriram","Maha Sarakham","Surin","Yasothon","Roi Et","Kalasin","Si Sa Ket","Ubon Ratchathani","Amnat Charoen","Loei","Nong Bua Lam Phu","Udon Thani","Nong Khai","Mukdahan","Sakon Nakhon","Bueng Kan","Nakhon Phanom"],
  ["Chumphon","Ranong","Surat Thani","Nakhon Si Thammarat","Phang Nga","Phuket","Phatthalung","Trang","Krabi"],
  ["Songkhla","Satun","Pattani","Yala","Narathiwat"],
].forEach(cluster => cluster.forEach((p, i) => { RANK[p] = i; }));

// ─── Postal code → Province auto-fill (prefix-based) ─────────────────────────
const PREFIX_TO_PROVINCE = {
  "10":"Bangkok","11":"Nonthaburi","12":"Pathum Thani",
  "13":"Phra Nakhon Si Ayutthaya","14":"Ang Thong","15":"Lopburi",
  "16":"Sing Buri","17":"Chai Nat","18":"Saraburi",
  "20":"Chonburi","21":"Rayong","22":"Chanthaburi","23":"Trat",
  "24":"Chachoengsao","25":"Prachin Buri","26":"Nakhon Nayok","27":"Sa Kaeo",
  "30":"Nakhon Ratchasima","31":"Buriram","32":"Surin","33":"Si Sa Ket",
  "34":"Ubon Ratchathani","35":"Yasothon","36":"Chaiyaphum","37":"Amnat Charoen",
  "38":"Bueng Kan","39":"Nong Bua Lam Phu",
  "40":"Khon Kaen","41":"Udon Thani","42":"Loei","43":"Nong Khai",
  "44":"Maha Sarakham","45":"Roi Et","46":"Kalasin","47":"Sakon Nakhon",
  "48":"Nakhon Phanom","49":"Mukdahan",
  "50":"Chiang Mai","51":"Lamphun","52":"Lampang","53":"Uttaradit",
  "54":"Phrae","55":"Nan","56":"Phayao","57":"Chiang Rai","58":"Mae Hong Son",
  "60":"Nakhon Sawan","61":"Uthai Thani","62":"Kamphaeng Phet","63":"Tak",
  "64":"Sukhothai","65":"Phitsanulok","66":"Phichit","67":"Phetchabun",
  "70":"Ratchaburi","71":"Kanchanaburi","72":"Suphan Buri","73":"Nakhon Pathom",
  "74":"Samut Sakhon","75":"Samut Songkhram","76":"Phetchaburi","77":"Prachuap Khiri Khan",
  "80":"Nakhon Si Thammarat","81":"Krabi","82":"Phang Nga","83":"Phuket",
  "84":"Surat Thani","85":"Ranong","86":"Chumphon",
  "90":"Songkhla","91":"Satun","92":"Trang","93":"Phatthalung",
  "94":"Pattani","95":"Yala","96":"Narathiwat",
};

function lookupProvince(zip) {
  if (!zip || zip.length !== 5) return null;
  return PREFIX_TO_PROVINCE[zip.substring(0, 2)] || null;
}

function routeKey(a, b) { return [a, b].sort().join("|||"); }
const ROUTE_PRICE = (() => {
  const map = {};
  const all = PROVINCE_GROUPS.flatMap(g => g.provinces);
  for (let i = 0; i < all.length; i++) {
    for (let j = i; j < all.length; j++) {
      const a = all[i], b = all[j];
      if (a === b) { map[routeKey(a, b)] = 0; continue; }
      const ca = CLUSTER[a] ?? 0, cb2 = CLUSTER[b] ?? 0;
      const base = CB[ca][cb2];
      const ra = RANK[a] ?? 0, rb = RANK[b] ?? 0;
      const offset = (ra * 5 + rb * 11 + (ra ^ rb) * 3) % 31;
      map[routeKey(a, b)] = base + offset;
    }
  }
  return map;
})();

function getRoutePrice(from, to) {
  if (!from || !to) return null;
  if (from === to) return 0;
  return ROUTE_PRICE[routeKey(from, to)] ?? null;
}

function generateTrackId() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const r = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `PO-${d}${r}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const ProvinceSelect = ({ value, onChange, hasError }) => (
  <div className={`input-wrap${hasError ? " error" : ""}`}>
    <span className="ii">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4z"/>
      </svg>
    </span>
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select province</option>
      {PROVINCE_GROUPS.map(g => (
        <optgroup key={g.label} label={g.label}>
          {g.provinces.map(p => <option key={p}>{p}</option>)}
        </optgroup>
      ))}
    </select>
  </div>
);

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);
const PinIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);
const HashIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
  </svg>
);
const ClipboardIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
);
const CurrencyIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PKG_TYPES = [
  { type: "Parcel", icon: "📦", price: "from ฿85", base: 85 },
  { type: "Letter", icon: "✉️", price: "from ฿18", base: 18 },
  { type: "Express", icon: "⚡", price: "from ฿210", base: 210 },
  { type: "Registered", icon: "📋", price: "from ฿120", base: 120 },
];
const SERVICES = [
  { label: "Standard (3–5 days)", fee: 0 },
  { label: "Priority (2 days)", fee: 60 },
  { label: "Same Day", fee: 120 },
];
const CHIPS = ["🔴 Fragile", "❄️ Keep Cold", "☝️ This Side Up", "🚫 No Stack", "💧 Keep Dry"];

const EMPTY_FORM = {
  sname: "", sphone: "", saddr: "", sprov: "", szip: "",
  rname: "", rphone: "", raddr: "", rprov: "", rzip: "", rnotes: "",
  weight: "", plen: "", pwid: "", phei: "",
  contents: "", declval: "", insurance: false,
};
const REQUIRED_FIELDS = ["sname","sphone","saddr","sprov","szip","rname","rphone","raddr","rprov","rzip","weight","contents"];

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pkgIdx, setPkgIdx] = useState(0);
  const [svcIdx, setSvcIdx] = useState(0);
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackId] = useState(generateTrackId);

  const pkgBase = PKG_TYPES[pkgIdx].base;
  const svcFee = SERVICES[svcIdx].fee;

  const summary = useMemo(() => {
    const weight = parseFloat(form.weight) || 0;
    const wSurcharge = weight > 1 ? Math.round((weight - 1) * 15) : 0;
    const insFee = form.insurance ? 35 : 0;
    const routePrice = getRoutePrice(form.sprov, form.rprov);
    const destFee = routePrice ?? 0;
    const destKnown = routePrice !== null && form.sprov !== "" && form.rprov !== "";
    const total = pkgBase + svcFee + wSurcharge + destFee + insFee;
    let zoneColor = "#e65100";
    if (destKnown && form.sprov !== form.rprov) {
      zoneColor = destFee <= 25 ? "#2e7d32" : destFee <= 60 ? "#f57f17" : "#E60012";
    }
    return { weight, wSurcharge, insFee, destFee, destKnown, total, zoneColor };
  }, [form.weight, form.sprov, form.rprov, form.insurance, pkgBase, svcFee]);

  const [sAutoFilled, setSAutoFilled] = useState(false);
  const [rAutoFilled, setRAutoFilled] = useState(false);

  const set = useCallback((key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      // Auto-fill province when 5-digit zip is entered
      if (key === "szip" && val.length === 5) {
        const prov = lookupProvince(val);
        if (prov) { next.sprov = prov; setSAutoFilled(true); }
        else { setSAutoFilled(false); }
      } else if (key === "szip") { setSAutoFilled(false); }
      if (key === "rzip" && val.length === 5) {
        const prov = lookupProvince(val);
        if (prov) { next.rprov = prov; setRAutoFilled(true); }
        else { setRAutoFilled(false); }
      } else if (key === "rzip") { setRAutoFilled(false); }
      return next;
    });
  }, []);

  const toggleChip = (chip) =>
    setChips(cs => cs.includes(chip) ? cs.filter(c => c !== chip) : [...cs, chip]);

  const validate = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach(k => { if (!form[k]?.toString().trim()) newErrors[k] = true; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    const params = new URLSearchParams({
      trackId,
      total: `฿${summary.total}`,
      pkg: PKG_TYPES[pkgIdx].type,
      svc: SERVICES[svcIdx].label,
      sname: form.sname, sphone: form.sphone, saddr: form.saddr, sprov: form.sprov, szip: form.szip,
      rname: form.rname, rphone: form.rphone, raddr: form.raddr, rprov: form.rprov, rzip: form.rzip,
      weight: form.weight ? `${form.weight} kg` : "",
      dims: (form.plen && form.pwid && form.phei) ? `${form.plen}x${form.pwid}x${form.phei} cm` : "",
      contents: form.contents, declval: form.declval,
      insurance: form.insurance ? "Yes" : "No",
      handling: chips.join(", ") || "None",
    });
    setTimeout(() => {
      setLoading(false);
      navigate(`/payments?${params}`);
    }, 1000);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setPkgIdx(0);
    setSvcIdx(0);
    setChips([]);
  };

  const F = ({ id, label, req, children, hint }) => (
    <div className="field">
      <label>{label}{req && <span className="req">*</span>}</label>
      {children}
      {errors[id] && <div className="field-error show">{req}</div>}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="cs-root">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />

        <div className="deco d1"><svg viewBox="0 0 80 80"><rect x="5" y="20" width="70" height="50" rx="5"/><rect x="5" y="28" width="70" height="6"/><rect x="35" y="20" width="10" height="50"/></svg></div>
        <div className="deco d2"><svg viewBox="0 0 100 70"><rect width="100" height="70" rx="6"/><polyline points="0,0 50,38 100,0" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none"/></svg></div>
        <div className="deco d3"><svg viewBox="0 0 80 80"><rect x="5" y="20" width="70" height="50" rx="5"/><rect x="5" y="28" width="70" height="6"/><rect x="35" y="20" width="10" height="50"/></svg></div>
        <div className="deco d4"><svg viewBox="0 0 100 70"><rect width="100" height="70" rx="6"/><polyline points="0,0 50,38 100,0" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none"/></svg></div>

        <div className="page">
          {/* Topbar */}
          <div className="topbar">
            <a href="/dashboard" className="back-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Back
            </a>
            <div className="page-title">
              <h1>📦 Create Shipment</h1>
              <p>Fill in details to generate a new shipment label</p>
            </div>
            <div className="topbar-right">
              <button className="draft-btn">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                Save Draft
              </button>
            </div>
          </div>

          <div className="main-grid">
            {/* ── Left column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Sender */}
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">📤</div>
                  <div><h3>Sender Information</h3><p>Who is sending this shipment?</p></div>
                </div>
                <div className="card-body">
                  <div className="fields-grid">
                    <div className="field">
                      <label>Full Name <span className="req">*</span></label>
                      <div className={`input-wrap${errors.sname ? " error" : ""}`}>
                        <span className="ii"><UserIcon /></span>
                        <input type="text" placeholder="Somchai Jaidee" value={form.sname} onChange={e => set("sname", e.target.value)} />
                      </div>
                      {errors.sname && <div className="field-error show">Sender name is required.</div>}
                    </div>
                    <div className="field">
                      <label>Phone <span className="req">*</span></label>
                      <div className={`input-wrap${errors.sphone ? " error" : ""}`}>
                        <span className="ii"><PhoneIcon /></span>
                        <input type="tel" placeholder="081-234-5678" value={form.sphone} onChange={e => set("sphone", e.target.value)} />
                      </div>
                      {errors.sphone && <div className="field-error show">Phone number required.</div>}
                    </div>
                    <div className="field full">
                      <label>Street Address <span className="req">*</span></label>
                      <div className={`input-wrap${errors.saddr ? " error" : ""}`}>
                        <span className="ii"><PinIcon /></span>
                        <input type="text" placeholder="123 Sukhumvit Road, Khlong Toei" value={form.saddr} onChange={e => set("saddr", e.target.value)} />
                      </div>
                      {errors.saddr && <div className="field-error show">Address is required.</div>}
                    </div>
                    <div className="field">
                      <label>Province <span className="req">*</span></label>
                      <ProvinceSelect value={form.sprov} onChange={v => set("sprov", v)} hasError={!!errors.sprov} />
                      {errors.sprov && <div className="field-error show">Province is required.</div>}
                    </div>
                    <div className="field">
                      <label>Postal Code <span className="req">*</span></label>
                      <div className={`input-wrap${errors.szip ? " error" : ""}${sAutoFilled ? " autofilled" : ""}`}>
                        <span className="ii"><HashIcon /></span>
                        <input type="text" placeholder="10110" maxLength={5} value={form.szip} onChange={e => set("szip", e.target.value.replace(/\D/g, ""))} />
                      </div>
                      {errors.szip && <div className="field-error show">Postal code required.</div>}
                      {sAutoFilled && <div className="autofill-hint">Province auto-filled: {form.sprov}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Receiver */}
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">📥</div>
                  <div><h3>Receiver Information</h3><p>Where is this shipment going?</p></div>
                </div>
                <div className="card-body">
                  <div className="fields-grid">
                    <div className="field">
                      <label>Full Name <span className="req">*</span></label>
                      <div className={`input-wrap${errors.rname ? " error" : ""}`}>
                        <span className="ii"><UserIcon /></span>
                        <input type="text" placeholder="Nattapong Sriwan" value={form.rname} onChange={e => set("rname", e.target.value)} />
                      </div>
                      {errors.rname && <div className="field-error show">Receiver name is required.</div>}
                    </div>
                    <div className="field">
                      <label>Phone <span className="req">*</span></label>
                      <div className={`input-wrap${errors.rphone ? " error" : ""}`}>
                        <span className="ii"><PhoneIcon /></span>
                        <input type="tel" placeholder="089-765-4321" value={form.rphone} onChange={e => set("rphone", e.target.value)} />
                      </div>
                      {errors.rphone && <div className="field-error show">Phone number required.</div>}
                    </div>
                    <div className="field full">
                      <label>Street Address <span className="req">*</span></label>
                      <div className={`input-wrap${errors.raddr ? " error" : ""}`}>
                        <span className="ii"><PinIcon /></span>
                        <input type="text" placeholder="45 Nimman Road, Suthep" value={form.raddr} onChange={e => set("raddr", e.target.value)} />
                      </div>
                      {errors.raddr && <div className="field-error show">Address is required.</div>}
                    </div>
                    <div className="field">
                      <label>Province <span className="req">*</span></label>
                      <ProvinceSelect value={form.rprov} onChange={v => set("rprov", v)} hasError={!!errors.rprov} />
                      {errors.rprov && <div className="field-error show">Province is required.</div>}
                    </div>
                    <div className="field">
                      <label>Postal Code <span className="req">*</span></label>
                      <div className={`input-wrap${errors.rzip ? " error" : ""}${rAutoFilled ? " autofilled" : ""}`}>
                        <span className="ii"><HashIcon /></span>
                        <input type="text" placeholder="50200" maxLength={5} value={form.rzip} onChange={e => set("rzip", e.target.value.replace(/\D/g, ""))} />
                      </div>
                      {errors.rzip && <div className="field-error show">Postal code required.</div>}
                      {rAutoFilled && <div className="autofill-hint">Province auto-filled: {form.rprov}</div>}
                    </div>
                    <div className="field full">
                      <label>Delivery Notes</label>
                      <div className="input-wrap">
                        <textarea placeholder="Building name, landmark, special instructions…" rows={2} value={form.rnotes} onChange={e => set("rnotes", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">📋</div>
                  <div><h3>Package Details</h3><p>Type, size, weight & service</p></div>
                </div>
                <div className="card-body">

                  <div className="sec-label">Package Type</div>
                  <div className="pkg-selector">
                    {PKG_TYPES.map((p, i) => (
                      <div key={p.type} className={`pkg-opt${pkgIdx === i ? " selected" : ""}`} onClick={() => setPkgIdx(i)}>
                        <div className="pkg-icon">{p.icon}</div>
                        <div className="pkg-name">{p.type}</div>
                        <div className="pkg-price">{p.price}</div>
                      </div>
                    ))}
                  </div>

                  <div className="sec-label" style={{ marginTop: 20 }}>Service Level</div>
                  <div className="service-row">
                    {SERVICES.map((s, i) => (
                      <div key={s.label} className={`service-pill${svcIdx === i ? " selected" : ""}`} onClick={() => setSvcIdx(i)}>
                        <span className="pill-dot" />{s.label}
                      </div>
                    ))}
                  </div>

                  <div className="sec-label" style={{ marginTop: 20 }}>Dimensions & Weight</div>
                  <div className="dims-row">
                    <div className="field">
                      <label>Weight (kg) <span className="req">*</span></label>
                      <div className={`input-wrap${errors.weight ? " error" : ""}`}>
                        <input type="number" placeholder="1.5" min="0.1" step="0.1" value={form.weight} onChange={e => set("weight", e.target.value)} />
                      </div>
                      {errors.weight && <div className="field-error show">Required.</div>}
                    </div>
                    <div className="field">
                      <label>Length (cm)</label>
                      <div className="input-wrap"><input type="number" placeholder="30" min="1" value={form.plen} onChange={e => set("plen", e.target.value)} /></div>
                    </div>
                    <div className="field">
                      <label>Width (cm)</label>
                      <div className="input-wrap"><input type="number" placeholder="20" min="1" value={form.pwid} onChange={e => set("pwid", e.target.value)} /></div>
                    </div>
                    <div className="field">
                      <label>Height (cm)</label>
                      <div className="input-wrap"><input type="number" placeholder="15" min="1" value={form.phei} onChange={e => set("phei", e.target.value)} /></div>
                    </div>
                  </div>

                  <div className="sec-label" style={{ marginTop: 20 }}>Contents & Handling</div>
                  <div className="fields-grid" style={{ marginBottom: 14 }}>
                    <div className="field full">
                      <label>Package Contents <span className="req">*</span></label>
                      <div className={`input-wrap${errors.contents ? " error" : ""}`}>
                        <span className="ii"><ClipboardIcon /></span>
                        <input type="text" placeholder="e.g. Clothing, Electronics, Documents…" value={form.contents} onChange={e => set("contents", e.target.value)} />
                      </div>
                      {errors.contents && <div className="field-error show">Contents description required.</div>}
                    </div>
                    <div className="field full">
                      <label>Declared Value (฿)</label>
                      <div className="input-wrap">
                        <span className="ii"><CurrencyIcon /></span>
                        <input type="number" placeholder="500" min="0" value={form.declval} onChange={e => set("declval", e.target.value)} />
                      </div>
                      <div className="field-hint">Used for insurance & customs purposes.</div>
                    </div>
                  </div>

                  <div className="chips-row">
                    {CHIPS.map(chip => (
                      <div key={chip} className={`chip${chips.includes(chip) ? " on" : ""}`} onClick={() => toggleChip(chip)}>{chip}</div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <div className="toggle-row">
                      <div className="toggle-info">
                        <strong>Add Insurance</strong>
                        <span>Covers up to declared value — +฿35</span>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={form.insurance} onChange={e => set("insurance", e.target.checked)} />
                        <span className="toggle-track" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column — Summary ── */}
            <div>
              <div className="summary-card">
                <div className="summary-header">
                  <h3>Shipment Summary</h3>
                  <p>Live cost estimate</p>
                </div>

                <div className="tracking-preview">
                  <div className="track-label">Tracking ID (Auto-generated)</div>
                  <div className="track-id">{trackId}</div>
                </div>

                <div className="summary-body">
                  <div className="sum-row"><span className="sum-key">From</span><span className="sum-val accent">{form.sprov || (form.sname ? form.sname.split(" ")[0] : "—")}</span></div>
                  <div className="sum-row"><span className="sum-key">To</span><span className="sum-val accent">{form.rprov || (form.rname ? form.rname.split(" ")[0] : "—")}</span></div>
                  <div className="sum-row"><span className="sum-key">Package</span><span className="sum-val">{PKG_TYPES[pkgIdx].type}</span></div>
                  <div className="sum-row"><span className="sum-key">Service</span><span className="sum-val">{SERVICES[svcIdx].label.split("(")[0].trim()}</span></div>
                  <div className="sum-row"><span className="sum-key">Weight</span><span className="sum-val">{form.weight ? `${form.weight} kg` : "— kg"}</span></div>
                  <div className="sum-row"><span className="sum-key">Base Fee</span><span className="sum-val">฿{pkgBase}</span></div>
                  <div className="sum-row"><span className="sum-key">Service Surcharge</span><span className="sum-val">{svcFee ? `฿${svcFee}` : "฿0"}</span></div>
                  <div className="sum-row"><span className="sum-key">Weight Surcharge</span><span className="sum-val">{summary.wSurcharge ? `฿${summary.wSurcharge}` : "฿0"}</span></div>
                  {summary.destKnown && (
                    <div className="sum-row">
                      <span className="sum-key">Route Fee</span>
                      <span className="sum-val" style={{ color: summary.zoneColor }}>
                        {form.sprov === form.rprov ? "฿0 — same province" : `฿${summary.destFee}`}
                      </span>
                    </div>
                  )}
                  <div className="sum-row"><span className="sum-key">Insurance</span><span className="sum-val">{form.insurance ? "฿35" : "—"}</span></div>
                  <div className="sum-divider" />
                  <div className="sum-total">
                    <span className="total-label">Total</span>
                    <span className="total-amt">฿{summary.total}</span>
                  </div>
                </div>

                <div className="submit-area">
                  <button className={`submit-btn${loading ? " loading" : ""}`} onClick={handleSubmit}>
                    {loading ? (
                      <span className="btn-spinner" />
                    ) : (
                      <>
                        <span>Proceed to Payment</span>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                      </>
                    )}
                  </button>
                  <button className="preview-btn">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    Print Label Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success overlay */}
        {showSuccess && (
          <div className="success-overlay show">
            <div className="success-box">
              <span className="success-big">🎉</span>
              <h2>Shipment Created!</h2>
              <p>Your shipment has been registered successfully. Use the tracking ID below to monitor its progress.</p>
              <div className="success-track">
                <div className="st-label">Tracking ID</div>
                <div className="st-id">{trackId}</div>
              </div>
              <div className="success-actions">
                <button className="sa-btn sa-secondary" onClick={() => setShowSuccess(false)}>Close</button>
                <button className="sa-btn sa-primary" onClick={handleReset}>New Shipment</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
