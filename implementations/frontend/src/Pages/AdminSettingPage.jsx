import { useState, useCallback } from "react";

// ════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════
function Toast({ toast }) {
  return (
    <div className={`toast${toast.show ? " show" : ""}${toast.type === "success" ? " success" : ""}`}>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      <span>{toast.msg}</span>
    </div>
  );
}

// ════════════════════════════════════════════════
//  TOGGLE SWITCH
// ════════════════════════════════════════════════
function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
    </label>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

// ════════════════════════════════════════════════
//  SAVE BUTTON ROW
// ════════════════════════════════════════════════
function BtnRow({ label = "Save Changes", onSave, secondary, onSecondary }) {
  return (
    <div className="btn-row">
      <button className="btn-primary" onClick={onSave}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} width="14" height="14">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        {label}
      </button>
      {secondary && <button className="btn-secondary" onClick={onSecondary}>{secondary}</button>}
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: General
// ════════════════════════════════════════════════
function PanelGeneral({ toast }) {
  const [gen, setGen] = useState({
    name:"Thailand Post Office", version:"v2.4.1", lang:"English",
    tz:"Asia/Bangkok (UTC+7)", currency:"THB — Thai Baht",
    maxShip:"500", banner:"System maintenance scheduled for Sunday 15 Mar 2026, 02:00–04:00 AM.",
  });
  const [price, setPrice] = useState({
    parcel:"85", letter:"18", weight:"15", insurance:"35", cod:"30", priority:"60",
  });
  const s = k => e => setGen(p=>({...p,[k]:e.target.value}));
  const sp = k => e => setPrice(p=>({...p,[k]:e.target.value}));

  return (
    <>
      {/* System Config */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-h-icon">🏢</div>
            <div><h3>System Configuration</h3><p>Core postal system settings</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label>System Name <span className="req">*</span></label>
              <div className="input-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <input type="text" value={gen.name} onChange={s("name")} />
              </div>
            </div>
            <div className="form-group">
              <label>System Version</label>
              <div className="input-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z"/></svg>
                <input type="text" value={gen.version} readOnly style={{ color:"var(--muted)" }} />
              </div>
            </div>
            <div className="form-group">
              <label>Default Language</label>
              <div className="input-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                <select value={gen.lang} onChange={s("lang")}>
                  <option>English</option><option>Thai (ภาษาไทย)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <div className="input-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <select value={gen.tz} onChange={s("tz")}>
                  <option>Asia/Bangkok (UTC+7)</option><option>UTC</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Currency</label>
              <div className="input-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <select value={gen.currency} onChange={s("currency")}>
                  <option>THB — Thai Baht</option><option>USD — US Dollar</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Max Shipments Per Day</label>
              <div className="input-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <input type="number" value={gen.maxShip} onChange={s("maxShip")} />
              </div>
            </div>
            <div className="form-group full">
              <label>System Announcement Banner</label>
              <div className="input-wrap">
                <textarea placeholder="Enter a message to display…" value={gen.banner} onChange={s("banner")} />
              </div>
              <span className="form-hint">Leave blank to disable the banner.</span>
            </div>
          </div>
          <BtnRow label="Save Changes" onSave={() => toast("General settings saved successfully.", "success")} secondary="Reset" />
        </div>
      </div>

      {/* Pricing */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-h-icon amber">💰</div>
            <div><h3>Pricing Configuration</h3><p>Base fees and surcharge rules</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            {[["parcel","Base Parcel Fee (THB)"],["letter","Base Letter Fee (THB)"],
              ["weight","Weight Surcharge (THB/kg over 1kg)"],["insurance","Insurance Add-on (THB)"],
              ["cod","COD Surcharge (THB)"],["priority","Priority Service Surcharge (THB)"]].map(([k,lbl])=>(
              <div className="form-group" key={k}>
                <label>{lbl}</label>
                <div className="input-wrap"><input type="number" value={price[k]} onChange={sp(k)} /></div>
              </div>
            ))}
          </div>
          <BtnRow label="Save Pricing" onSave={() => toast("Pricing settings saved.", "success")} secondary="Reset to Defaults" />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Admin Profile
// ════════════════════════════════════════════════
function PanelProfile({ toast }) {
  const [p, setP] = useState({ name:"Admin User", username:"admin_001", email:"admin@post.th", phone:"+66 2 123 4567", role:"Super Admin", dept:"Operations & IT" });
  const s = k => e => setP(prev=>({...prev,[k]:e.target.value}));
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-h-icon blue">👨‍💼</div>
          <div><h3>Admin Profile</h3><p>Update your admin account details</p></div>
        </div>
      </div>
      <div className="card-body">
        <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:22, paddingBottom:18, borderBottom:"1px solid var(--border)" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#c0392b,#e07070)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem", boxShadow:"0 4px 14px rgba(192,57,43,0.3)" }}>👨‍💼</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700, color:"var(--text)" }}>Admin User</div>
            <div style={{ fontSize:"0.76rem", color:"var(--muted)", marginTop:2 }}>admin_001 · Super Admin</div>
            <div style={{ marginTop:8, display:"flex", gap:8 }}>
              <span className="role-badge rb-super">Super Admin</span>
              <span className="role-badge" style={{ background:"rgba(22,163,74,0.1)", color:"var(--green)", border:"1px solid rgba(22,163,74,0.25)" }}>Active</span>
            </div>
          </div>
        </div>
        <div className="form-grid">
          {[["name","Full Name","text",true],["username","Username","text",false],["email","Email Address","email",true],["phone","Phone","tel",false]].map(([k,lbl,type,req])=>(
            <div className="form-group" key={k}>
              <label>{lbl}{req && <span className="req"> *</span>}</label>
              <div className="input-wrap"><input type={type} value={p[k]} onChange={s(k)} /></div>
            </div>
          ))}
          <div className="form-group">
            <label>Role</label>
            <div className="input-wrap">
              <select value={p.role} onChange={s("role")}>
                <option>Super Admin</option><option>Admin</option><option>Moderator</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Department</label>
            <div className="input-wrap"><input type="text" value={p.dept} onChange={s("dept")} /></div>
          </div>
        </div>
        <BtnRow label="Save Profile" onSave={() => toast("Profile updated successfully.", "success")} secondary="Discard" />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Security
// ════════════════════════════════════════════════
function PanelSecurity({ toast }) {
  const [sec, setSec] = useState({ tfa:true, timeout:true, ipWhitelist:false, auditLog:true });
  const toggle = k => () => setSec(p=>({...p,[k]:!p[k]}));
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-h-icon">🔒</div>
            <div><h3>Change Password</h3><p>Update your admin login credentials</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group full">
              <label>Current Password <span className="req">*</span></label>
              <div className="input-wrap"><input type="password" placeholder="Enter current password" /></div>
            </div>
            <div className="form-group">
              <label>New Password <span className="req">*</span></label>
              <div className="input-wrap"><input type="password" placeholder="Min 8 characters" /></div>
            </div>
            <div className="form-group">
              <label>Confirm New Password <span className="req">*</span></label>
              <div className="input-wrap"><input type="password" placeholder="Repeat new password" /></div>
            </div>
          </div>
          <BtnRow label="Update Password" onSave={() => toast("Password changed successfully.", "success")} />
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="card-h-icon green">🛡️</div>
            <div><h3>Security Settings</h3><p>Login and access control</p></div>
          </div>
        </div>
        <div className="card-body">
          <ToggleRow title="Two-Factor Authentication (2FA)" desc="Require OTP on every admin login"                              checked={sec.tfa}         onChange={toggle("tfa")} />
          <ToggleRow title="Session Timeout"                  desc="Auto-logout after 30 minutes of inactivity"                   checked={sec.timeout}     onChange={toggle("timeout")} />
          <ToggleRow title="Login IP Whitelist"               desc="Restrict admin access to approved IP addresses only"          checked={sec.ipWhitelist} onChange={toggle("ipWhitelist")} />
          <ToggleRow title="Audit Log"                        desc="Log all admin actions for security review"                     checked={sec.auditLog}    onChange={toggle("auditLog")} />
          <BtnRow label="Save Settings" onSave={() => toast("Security settings saved.", "success")} />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Roles & Permissions
// ════════════════════════════════════════════════
const PERM_DATA = [
  { section:"Dashboard & Reports", perms:[
    { label:"View Dashboard",  sa:true,  admin:true,  mod:true  },
    { label:"View Reports",    sa:true,  admin:true,  mod:false },
    { label:"Export Reports",  sa:true,  admin:true,  mod:false },
  ]},
  { section:"User Management", perms:[
    { label:"View Users",             sa:true, admin:true,  mod:true  },
    { label:"Approve / Reject Users", sa:true, admin:true,  mod:false },
    { label:"Delete Users",           sa:true, admin:false, mod:false },
  ]},
  { section:"System", perms:[
    { label:"Access Settings",    sa:true, admin:false, mod:false },
    { label:"Manage Pricing",     sa:true, admin:false, mod:false },
    { label:"System Maintenance", sa:true, admin:false, mod:false },
  ]},
];

function PanelRoles({ toast }) {
  const [perms, setPerms] = useState(
    PERM_DATA.flatMap(g => g.perms).reduce((acc, p) => {
      acc[p.label] = { admin: p.admin, mod: p.mod };
      return acc;
    }, {})
  );
  const toggle = (lbl, role) => () => setPerms(p => ({ ...p, [lbl]: { ...p[lbl], [role]: !p[lbl][role] } }));

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-h-icon amber">🔑</div>
          <div><h3>Roles &amp; Permissions</h3><p>Control what each admin role can access</p></div>
        </div>
      </div>
      <div className="card-body" style={{ padding:0 }}>
        <table className="perm-table">
          <thead>
            <tr>
              <th>Permission</th>
              <th style={{ textAlign:"center" }}>Super Admin</th>
              <th style={{ textAlign:"center" }}>Admin</th>
              <th style={{ textAlign:"center" }}>Moderator</th>
            </tr>
          </thead>
          <tbody>
            {PERM_DATA.map(({ section, perms: ps }) => (
              <>
                <tr key={section}>
                  <td colSpan={4} style={{ fontWeight:600, color:"var(--muted)", fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.5px", padding:"14px 14px 6px" }}>{section}</td>
                </tr>
                {ps.map(({ label }) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td style={{ textAlign:"center" }}><input type="checkbox" className="perm-check" checked disabled /></td>
                    <td style={{ textAlign:"center" }}><input type="checkbox" className="perm-check" checked={perms[label]?.admin ?? false} onChange={toggle(label,"admin")} /></td>
                    <td style={{ textAlign:"center" }}><input type="checkbox" className="perm-check" checked={perms[label]?.mod ?? false} onChange={toggle(label,"mod")} /></td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)" }}>
        <button className="btn-primary" onClick={() => toast("Permissions updated.", "success")}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          Save Permissions
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Notifications
// ════════════════════════════════════════════════
function PanelNotifications({ toast }) {
  const [n, setN] = useState({ reg:true, payment:true, volume:true, errors:true, daily:false, login:true });
  const t = k => () => setN(p=>({...p,[k]:!p[k]}));
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-h-icon">🔔</div>
          <div><h3>Notification Preferences</h3><p>Choose what alerts admins receive</p></div>
        </div>
      </div>
      <div className="card-body">
        <ToggleRow title="New User Registration"  desc="Alert when a new user registers and needs approval"               checked={n.reg}     onChange={t("reg")} />
        <ToggleRow title="Failed Payment Alert"   desc="Notify on payment failures or disputed transactions"              checked={n.payment} onChange={t("payment")} />
        <ToggleRow title="High Shipment Volume"   desc="Alert when daily shipments exceed the configured limit"           checked={n.volume}  onChange={t("volume")} />
        <ToggleRow title="System Error Alerts"    desc="Immediate notification on critical system errors"                 checked={n.errors}  onChange={t("errors")} />
        <ToggleRow title="Daily Summary Email"    desc="Receive a daily digest of shipments, revenue and activity"        checked={n.daily}   onChange={t("daily")} />
        <ToggleRow title="Security Login Alerts"  desc="Email on new admin login from unrecognised device or IP"          checked={n.login}   onChange={t("login")} />
        <BtnRow label="Save Preferences" onSave={() => toast("Notification preferences saved.", "success")} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: System Info
// ════════════════════════════════════════════════
function PanelSystem({ toast }) {
  const rows = [
    { k:"System Status",           v:<span className="ir-val green"><span className="status-dot"><span className="sd-dot sd-green"/>&nbsp;Online — All systems operational</span></span> },
    { k:"Application Version",     v:"v2.4.1 (build 20260311)" },
    { k:"Database",                v:<span className="ir-val green"><span className="status-dot"><span className="sd-dot sd-green"/>&nbsp;Connected — MySQL 8.0.35</span></span> },
    { k:"Server Uptime",           v:"14 days, 6 hours, 42 minutes" },
    { k:"Server Environment",      v:"Production · Ubuntu 22.04 LTS" },
    { k:"Last Backup",             v:"Today, 03:00 AM — Successful" },
    { k:"Storage Used",            v:<span className="ir-val amber">68% of 500 GB</span> },
    { k:"Active Admin Sessions",   v:"3" },
    { k:"Total Users",             v:"1,248" },
    { k:"Total Shipments (All Time)", v:"28,741" },
  ];
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-h-icon dark">🖥️</div>
          <div><h3>System Information</h3><p>Server status and diagnostics</p></div>
        </div>
      </div>
      <div className="card-body">
        {rows.map(({ k, v }) => (
          <div className="info-row" key={k}>
            <span className="ir-key">{k}</span>
            {typeof v === "string" ? <span className="ir-val">{v}</span> : v}
          </div>
        ))}
      </div>
      <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)", display:"flex", gap:10 }}>
        <button className="btn-secondary" onClick={() => toast("Running diagnostics…")}>🔍 Run Diagnostics</button>
        <button className="btn-secondary" onClick={() => toast("Backup initiated.", "success")}>💾 Manual Backup</button>
        <button className="btn-secondary" onClick={() => toast("Cache cleared.", "success")}>🗑️ Clear Cache</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Danger Zone
// ════════════════════════════════════════════════
function PanelDanger({ toast }) {
  const zones = [
    { icon:"🗑️", title:"Clear All Shipment History", desc:"Permanently deletes all shipment records from the database. This action cannot be undone. All tracking data, labels and payment records will be lost.", btn:"Clear Shipment Data" },
    { icon:"👥", title:"Reset All User Accounts",    desc:"Removes all user accounts and resets the user database to factory state. All user data, shipment history and payment records will be permanently deleted.", btn:"Reset User Database" },
    { icon:"🔄", title:"Full System Reset",           desc:"Resets the entire system to its default factory configuration. Every piece of data — users, shipments, settings, logs — will be wiped. This cannot be undone.", btn:"Factory Reset System" },
  ];
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-h-icon" style={{ background:"linear-gradient(135deg,#f87171,#dc2626)" }}>⚠️</div>
          <div><h3>Danger Zone</h3><p>Irreversible system actions — proceed with caution</p></div>
        </div>
      </div>
      <div className="card-body" style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {zones.map(({ icon, title, desc, btn }) => (
          <div className="danger-zone" key={title}>
            <div className="dz-title">{icon} {title}</div>
            <div className="dz-desc">{desc}</div>
            <button className="btn-danger" onClick={() => toast("Action cancelled — confirmation required.")}>
              {btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  NAV ITEMS CONFIG
// ════════════════════════════════════════════════
const NAV_ITEMS = [
  { id:"general",       label:"General",            icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> },
  { id:"profile",       label:"Admin Profile",      icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { id:"security",      label:"Security",           icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> },
  { divider: true },
  { id:"roles",         label:"Roles & Permissions",icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg> },
  { id:"notifications", label:"Notifications",      icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg> },
  { id:"system",        label:"System Info",        icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg> },
  { divider: true },
  { id:"danger",        label:"Danger Zone",        icon:<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>, danger:true },
];

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function AdminSettingPage() {
  const [activePanel, setActivePanel] = useState("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastState,  setToastState]  = useState({ show:false, msg:"", type:"" });

  const showToast = useCallback((msg, type = "") => {
    setToastState({ show:true, msg, type });
    setTimeout(() => setToastState(t => ({ ...t, show:false })), 3000);
  }, []);

  const panels = {
    general:       <PanelGeneral       toast={showToast} />,
    profile:       <PanelProfile       toast={showToast} />,
    security:      <PanelSecurity      toast={showToast} />,
    roles:         <PanelRoles         toast={showToast} />,
    notifications: <PanelNotifications toast={showToast} />,
    system:        <PanelSystem        toast={showToast} />,
    danger:        <PanelDanger        toast={showToast} />,
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ════ SIDEBAR ════ */}
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
          <a className="nav-item" href="/admin">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </a>
          <div className="nav-section-label" style={{ marginTop:8 }}>Management</div>
          <a className="nav-item" href="/admin/user-approval">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
            User Approval <span className="nav-badge">5</span>
          </a>
          <a className="nav-item" href="/admin/reports">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Statistics &amp; Reports
          </a>
          <div className="nav-section-label" style={{ marginTop:8 }}>System</div>
          <a className="nav-item active" href="/admin/settings">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
            Settings
          </a>
        </nav>
        <div className="sidebar-footer">
          <a href="/admin/login" className="logout-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign Out
          </a>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(s => !s)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div>
              <h1>System Settings</h1>
              <p>Manage admin configuration, roles &amp; preferences</p>
            </div>
          </div>
          <div className="topbar-right">
            <button className="tb-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <div className="tb-badge">3</div>
            </button>
            <div className="tb-divider"/>
            <div className="tb-admin">
              <div className="tb-admin-avatar">👨‍💼</div>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        <div className="page-body">
          {/* Page header banner */}
          <div className="page-header">
            <div className="ph-left">
              <h2>⚙️ Admin Settings</h2>
              <p>System configuration · Access control · Preferences</p>
            </div>
            <div className="ph-deco">⚙️</div>
          </div>

          {/* Settings layout */}
          <div className="settings-layout">

            {/* Side nav */}
            <div className="settings-sidenav">
              <div className="ssn-header"><span>Settings Menu</span></div>
              {NAV_ITEMS.map((item, i) =>
                item.divider
                  ? <div key={i} className="ssn-divider" />
                  : (
                    <div
                      key={item.id}
                      className={`ssn-item${activePanel === item.id ? " active" : ""}`}
                      style={item.danger ? { color:"#dc2626" } : {}}
                      onClick={() => setActivePanel(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  )
              )}
            </div>

            {/* Active panel */}
            <div className="settings-content">
              {panels[activePanel]}
            </div>

          </div>
        </div>
      </div>

      <Toast toast={toastState} />
    </>
  );
}

// ════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--accent:#c0392b;--accent-dark:#991b1b;--accent-light:#e07070;--accent-glow:rgba(192,57,43,0.25);--bg:#f7f1f1;--sidebar-bg:#1a0505;--sidebar-border:#2e0a0a;--card:#ffffff;--text:#1a0a0a;--muted:#7c5555;--input-bg:#fff8f8;--input-border:#f5cece;--border:#f0dada;--green:#16a34a;--green-bg:#f0fdf4;--blue:#1d4ed8;--blue-bg:#eff6ff;--amber:#d97706;--amber-bg:#fffbeb;--gold:#f59e0b;}
body{min-height:100vh;background:var(--bg);font-family:'DM Sans',sans-serif;display:flex;overflow-x:hidden;}
.sidebar{width:240px;min-height:100vh;background:var(--sidebar-bg);border-right:1px solid var(--sidebar-border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;transition:transform 0.3s;}
.sidebar-logo{padding:24px 20px 20px;border-bottom:1px solid var(--sidebar-border);display:flex;align-items:center;gap:10px;}
.sidebar-logo .logo-icon{width:40px;height:40px;background:linear-gradient(135deg,rgba(192,57,43,0.4),rgba(224,112,112,0.2));border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;border:1px solid rgba(192,57,43,0.35);box-shadow:0 0 16px rgba(192,57,43,0.2);}
.sidebar-logo .logo-text h2{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:#f5e8e8;}
.sidebar-logo .logo-text p{font-size:0.62rem;color:rgba(245,232,232,0.45);letter-spacing:1.4px;text-transform:uppercase;margin-top:1px;}
.sidebar-admin{padding:14px 20px;border-bottom:1px solid var(--sidebar-border);display:flex;align-items:center;gap:10px;}
.admin-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#c0392b,#e07070);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;box-shadow:0 0 10px rgba(192,57,43,0.4);}
.admin-info strong{display:block;font-size:0.78rem;font-weight:600;color:#f5e8e8;}
.admin-info span{font-size:0.67rem;color:rgba(245,232,232,0.45);}
.admin-role-badge{margin-left:auto;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:4px;padding:2px 7px;font-size:0.6rem;font-weight:700;color:var(--gold);letter-spacing:0.8px;text-transform:uppercase;}
.sidebar-nav{flex:1;padding:14px 12px;overflow-y:auto;}
.nav-section-label{font-size:0.6rem;font-weight:700;color:rgba(245,232,232,0.3);text-transform:uppercase;letter-spacing:1.2px;padding:10px 8px 6px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;color:rgba(245,232,232,0.55);font-size:0.82rem;font-weight:500;cursor:pointer;text-decoration:none;transition:all 0.18s;margin-bottom:2px;}
.nav-item:hover{background:rgba(255,255,255,0.06);color:#f5e8e8;}
.nav-item.active{background:rgba(192,57,43,0.2);color:#f5e8e8;border-left:3px solid var(--accent);padding-left:9px;}
.nav-item svg{width:16px;height:16px;flex-shrink:0;}
.nav-item .nav-badge{margin-left:auto;background:var(--accent);border-radius:10px;padding:1px 7px;font-size:0.62rem;font-weight:700;color:#fff;}
.sidebar-footer{padding:14px 12px;border-top:1px solid var(--sidebar-border);}
.logout-btn{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;color:rgba(245,232,232,0.45);font-size:0.82rem;font-weight:500;cursor:pointer;text-decoration:none;transition:all 0.18s;width:100%;background:none;border:none;font-family:'DM Sans',sans-serif;}
.logout-btn:hover{color:var(--accent-light);background:rgba(192,57,43,0.1);}
.logout-btn svg{width:16px;height:16px;}
.main{margin-left:240px;flex:1;min-height:100vh;display:flex;flex-direction:column;}
.topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;height:62px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40;box-shadow:0 1px 8px rgba(140,30,30,0.06);}
.topbar-left{display:flex;align-items:center;gap:14px;}
.topbar-left h1{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--text);}
.topbar-left p{font-size:0.76rem;color:var(--muted);margin-top:1px;}
.topbar-right{display:flex;align-items:center;gap:12px;}
.tb-btn{width:36px;height:36px;border-radius:9px;background:var(--input-bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;position:relative;}
.tb-btn:hover{border-color:var(--accent-light);background:#fff0f0;}
.tb-btn svg{width:16px;height:16px;color:var(--muted);}
.tb-badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:var(--accent);color:#fff;font-size:0.58rem;font-weight:700;display:flex;align-items:center;justify-content:center;}
.tb-divider{width:1px;height:24px;background:var(--border);}
.tb-admin{display:flex;align-items:center;gap:8px;cursor:pointer;}
.tb-admin-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#c0392b,#e07070);display:flex;align-items:center;justify-content:center;font-size:0.85rem;}
.tb-admin span{font-size:0.78rem;font-weight:600;color:var(--text);}
.page-body{padding:24px 28px 60px;flex:1;}
.page-header{background:linear-gradient(135deg,#c0392b 0%,#e8a598 100%);border-radius:18px;padding:24px 28px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(192,57,43,0.25);animation:fadeUp 0.5s ease both;}
.page-header::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 80% 50%,rgba(255,255,255,0.1),transparent);}
.ph-left{position:relative;z-index:1;}
.ph-left h2{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:#fff;margin-bottom:4px;}
.ph-left p{font-size:0.82rem;color:rgba(255,255,255,0.76);}
.ph-deco{position:absolute;right:28px;top:50%;transform:translateY(-50%);font-size:4rem;opacity:0.1;pointer-events:none;}
.settings-layout{display:grid;grid-template-columns:220px 1fr;gap:20px;align-items:start;}
.settings-sidenav{background:var(--card);border-radius:16px;border:1px solid var(--border);box-shadow:0 2px 12px rgba(140,30,30,0.06);overflow:hidden;position:sticky;top:86px;animation:fadeUp 0.5s ease both 0.1s;}
.ssn-header{padding:14px 18px 12px;border-bottom:1px solid var(--border);}
.ssn-header span{font-size:0.68rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;}
.ssn-item{display:flex;align-items:center;gap:10px;padding:11px 18px;color:var(--muted);font-size:0.82rem;font-weight:500;cursor:pointer;transition:all 0.15s;border-left:3px solid transparent;}
.ssn-item:hover{background:var(--input-bg);color:var(--text);}
.ssn-item.active{background:#fff0f0;color:var(--accent);font-weight:600;border-left-color:var(--accent);}
.ssn-item svg{width:15px;height:15px;flex-shrink:0;}
.ssn-divider{height:1px;background:var(--border);margin:4px 0;}
.card{background:var(--card);border-radius:16px;border:1px solid var(--border);box-shadow:0 2px 12px rgba(140,30,30,0.06);overflow:hidden;animation:fadeUp 0.55s ease both 0.15s;margin-bottom:18px;}
.card:last-child{margin-bottom:0;}
.card-header{padding:16px 22px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.card-header-left{display:flex;align-items:center;gap:10px;}
.card-h-icon{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#e07070,#c0392b);display:flex;align-items:center;justify-content:center;font-size:0.95rem;box-shadow:0 2px 8px rgba(192,57,43,0.25);flex-shrink:0;}
.card-h-icon.green{background:linear-gradient(135deg,#4ade80,#16a34a);}
.card-h-icon.blue{background:linear-gradient(135deg,#60a5fa,#1d4ed8);}
.card-h-icon.amber{background:linear-gradient(135deg,#fbbf24,#d97706);}
.card-h-icon.dark{background:linear-gradient(135deg,#6b7280,#374151);}
.card-header h3{font-family:'Playfair Display',serif;font-size:0.97rem;font-weight:700;color:var(--text);}
.card-header p{font-size:0.72rem;color:var(--muted);margin-top:1px;}
.card-body{padding:20px 22px;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px;}
.form-group{display:flex;flex-direction:column;gap:6px;}
.form-group.full{grid-column:1/-1;}
.form-group label{font-size:0.76rem;font-weight:600;color:var(--text);letter-spacing:0.2px;}
.form-group label .req,.req{color:var(--accent);margin-left:2px;}
.form-hint{font-size:0.7rem;color:var(--muted);margin-top:2px;}
.input-wrap{display:flex;align-items:center;background:var(--input-bg);border:1.5px solid var(--input-border);border-radius:9px;padding:0 12px;transition:border-color 0.2s,box-shadow 0.2s;}
.input-wrap:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(192,57,43,0.08);}
.input-wrap svg{width:14px;height:14px;color:#d4a0a0;flex-shrink:0;margin-right:8px;}
.input-wrap input,.input-wrap select,.input-wrap textarea{border:none;background:transparent;outline:none;flex:1;padding:10px 0;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:var(--text);}
.input-wrap select{cursor:pointer;}
.input-wrap input::placeholder,.input-wrap textarea::placeholder{color:#d4a0a0;}
.input-wrap textarea{resize:none;padding:10px 0;min-height:72px;}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid #fdf4f4;}
.toggle-row:last-child{border-bottom:none;}
.toggle-info strong{display:block;font-size:0.84rem;font-weight:600;color:var(--text);}
.toggle-info span{font-size:0.73rem;color:var(--muted);margin-top:2px;display:block;}
.toggle-switch{position:relative;width:42px;height:23px;flex-shrink:0;}
.toggle-switch input{opacity:0;width:0;height:0;position:absolute;}
.toggle-track{position:absolute;inset:0;background:var(--input-border);border-radius:50px;cursor:pointer;transition:background 0.25s;}
.toggle-track::after{content:'';position:absolute;left:3px;top:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:transform 0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.15);}
.toggle-switch input:checked + .toggle-track{background:var(--accent);}
.toggle-switch input:checked + .toggle-track::after{transform:translateX(19px);}
.btn-row{display:flex;gap:10px;margin-top:20px;}
.btn-primary{padding:10px 22px;border:none;border-radius:9px;background:linear-gradient(135deg,#c0392b,#991b1b);color:#fff;font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:600;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;gap:7px;box-shadow:0 3px 12px rgba(192,57,43,0.3);}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(192,57,43,0.38);}
.btn-secondary{padding:10px 20px;border:1.5px solid var(--border);border-radius:9px;background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:600;cursor:pointer;transition:all 0.15s;}
.btn-secondary:hover{border-color:var(--accent);color:var(--accent);background:#fff0f0;}
.btn-danger{padding:10px 20px;border:1.5px solid #fecaca;border-radius:9px;background:#fff5f5;color:#dc2626;font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:600;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;gap:7px;}
.btn-danger:hover{background:#fee2e2;border-color:#dc2626;}
.role-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:6px;font-size:0.72rem;font-weight:700;}
.rb-admin{background:rgba(245,158,11,0.12);color:var(--gold);border:1px solid rgba(245,158,11,0.3);}
.rb-super{background:rgba(192,57,43,0.1);color:var(--accent);border:1px solid rgba(192,57,43,0.25);}
.perm-table{width:100%;border-collapse:collapse;}
.perm-table th{font-size:0.68rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.6px;padding:8px 14px;text-align:left;border-bottom:2px solid var(--border);background:#fff8f8;}
.perm-table td{padding:11px 14px;font-size:0.82rem;border-bottom:1px solid #fdf4f4;}
.perm-table tr:last-child td{border-bottom:none;}
.perm-table tr:hover td{background:#fff8f8;}
.perm-check{width:16px;height:16px;accent-color:var(--accent);cursor:pointer;}
.info-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #fdf4f4;font-size:0.83rem;}
.info-row:last-child{border-bottom:none;}
.info-row .ir-key{color:var(--muted);}
.info-row .ir-val{font-weight:600;color:var(--text);}
.info-row .ir-val.green{color:var(--green);}
.info-row .ir-val.amber{color:var(--amber);}
.status-dot{display:inline-flex;align-items:center;gap:6px;}
.sd-dot{width:8px;height:8px;border-radius:50%;display:inline-block;}
.sd-green{background:var(--green);box-shadow:0 0 6px rgba(22,163,74,0.5);}
.sd-amber{background:var(--amber);}
.sd-red{background:var(--accent);}
.danger-zone{background:#fff5f5;border:1.5px solid #fecaca;border-radius:12px;padding:18px 20px;}
.dz-title{font-size:0.84rem;font-weight:700;color:#dc2626;margin-bottom:4px;}
.dz-desc{font-size:0.78rem;color:#7f1d1d;line-height:1.6;margin-bottom:14px;}
.toast{position:fixed;bottom:28px;right:28px;background:var(--text);color:#fff;padding:12px 20px;border-radius:10px;font-size:0.83rem;font-weight:500;z-index:200;display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,0.2);transform:translateY(80px);opacity:0;transition:all 0.3s cubic-bezier(.22,.68,0,1.2);pointer-events:none;}
.toast.show{transform:translateY(0);opacity:1;}
.toast.success{background:var(--green);}
.toast svg{width:16px;height:16px;flex-shrink:0;}
.settings-content{min-width:0;}
.sidebar-toggle{display:none;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:900px){.sidebar{transform:translateX(-100%);}.sidebar.open{transform:translateX(0);}.main{margin-left:0;}.sidebar-toggle{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;background:var(--input-bg);border:1px solid var(--border);cursor:pointer;}.sidebar-toggle svg{width:18px;height:18px;color:var(--text);}.settings-layout{grid-template-columns:1fr;}.settings-sidenav{position:static;}.form-grid{grid-template-columns:1fr;}}
`;
