import { useState, useCallback } from "react";

// ════════════════════════════════════════════════
//  REUSABLE: Toggle Switch
// ════════════════════════════════════════════════
function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
}

// ════════════════════════════════════════════════
//  REUSABLE: Save Row
// ════════════════════════════════════════════════
function SaveRow({ msgId, label = "Save Changes", onSave }) {
  const [msg, setMsg] = useState("");
  function handleSave() {
    setMsg("✓ Changes saved successfully!");
    if (onSave) onSave();
    setTimeout(() => setMsg(""), 3000);
  }
  return (
    <div className="save-row">
      <span className={`save-msg${msg ? " success" : ""}`}>{msg}</span>
      <button className="btn-save" onClick={handleSave}>{label}</button>
    </div>
  );
}

// ════════════════════════════════════════════════
//  REUSABLE: Toggle Row
// ════════════════════════════════════════════════
function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Profile
// ════════════════════════════════════════════════
function ProfilePanel() {
  const [profile, setProfile] = useState({
    firstName: "Somchai", lastName: "Jaidee",
    email: "somchai@email.com", phone: "+66 81 234 5678",
    dob: "1990-04-15", idNum: "", bio: "",
    company: "", taxId: "", bizAddress: "",
  });
  const set = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      {/* Profile Info */}
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon">👤</div>
            <div><h3>Profile Information</h3><p>Update your personal details</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="avatar-section">
            <div className="big-avatar">
              S
              <div className="avatar-edit-overlay">📷</div>
            </div>
            <div className="avatar-info">
              <h4>Somchai Jaidee</h4>
              <p>somchai@email.com · Member since Jan 2023</p>
              <div className="avatar-btns">
                <button className="btn-sm-primary">Upload Photo</button>
                <button className="btn-sm-outline">Remove</button>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "#fff4f4", margin: "18px 0" }} />

          <div className="form-grid">
            <div className="field"><label>First Name</label><input type="text" value={profile.firstName} onChange={set("firstName")} /></div>
            <div className="field"><label>Last Name</label><input type="text" value={profile.lastName} onChange={set("lastName")} /></div>
            <div className="field"><label>Email Address</label><input type="email" value={profile.email} onChange={set("email")} /></div>
            <div className="field"><label>Phone Number</label><input type="tel" value={profile.phone} onChange={set("phone")} /></div>
            <div className="field"><label>Date of Birth</label><input type="date" value={profile.dob} onChange={set("dob")} /></div>
            <div className="field"><label>ID / Passport Number</label><input type="text" placeholder="National ID or passport" value={profile.idNum} onChange={set("idNum")} /></div>
            <div className="field form-full"><label>Bio / Notes</label><textarea placeholder="Add a short note about yourself…" value={profile.bio} onChange={set("bio")} /></div>
          </div>
          <SaveRow label="Save Changes" />
        </div>
      </div>

      {/* Business Details */}
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon blue-ic">🏢</div>
            <div><h3>Business Details</h3><p>Optional business information</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="field"><label>Company Name</label><input type="text" placeholder="Your company (optional)" value={profile.company} onChange={set("company")} /></div>
            <div className="field"><label>Tax ID</label><input type="text" placeholder="Thai VAT / Tax ID" value={profile.taxId} onChange={set("taxId")} /></div>
            <div className="field form-full"><label>Business Address</label><input type="text" placeholder="Full business address" value={profile.bizAddress} onChange={set("bizAddress")} /></div>
          </div>
          <SaveRow label="Save Details" />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Security
// ════════════════════════════════════════════════
function SecurityPanel() {
  const [newPass, setNewPass] = useState("");
  const [strength, setStrength] = useState({ width: 0, color: "#FFD0D0", label: "" });

  function handlePassChange(e) {
    const v = e.target.value;
    setNewPass(v);
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const colors = ["#FFD0D0","#ef4444","#f97316","#eab308","#16a34a"];
    const labels = ["","Weak","Fair","Good","Strong"];
    setStrength({ width: [0,25,50,75,100][score], color: colors[score] || "#FFD0D0", label: score > 0 ? labels[score] : "" });
  }

  return (
    <>
      {/* Security Overview */}
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon">🔒</div>
            <div><h3>Security Overview</h3><p>Your account protection status</p></div>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          {[
            { icon: "🔑", cls: "si-green", title: "Password",               sub: "Last changed 45 days ago",        action: <button className="btn-sm-outline">Change</button> },
            { icon: "📱", cls: "si-amber", title: "Two-Factor Authentication", sub: "Adds an extra layer of security via SMS", action: <span className="badge-status bs-off">Off</span> },
            { icon: "📧", cls: "si-blue",  title: "Email Verified",          sub: "somchai@email.com",               action: <span className="badge-status bs-on">✓ Verified</span> },
            { icon: "📞", cls: "si-green", title: "Phone Verified",          sub: "+66 81 234 5678",                 action: <span className="badge-status bs-on">✓ Verified</span> },
          ].map(({ icon, cls, title, sub, action }) => (
            <div className="security-item" key={title}>
              <div className="security-left">
                <div className={`security-icon ${cls}`}>{icon}</div>
                <div className="security-text"><h4>{title}</h4><p>{sub}</p></div>
              </div>
              {action}
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon">🔑</div>
            <div><h3>Change Password</h3><p>Choose a strong, unique password</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="field form-full"><label>Current Password</label><input type="password" placeholder="Enter current password" /></div>
            <div className="field"><label>New Password</label><input type="password" placeholder="Minimum 8 characters" value={newPass} onChange={handlePassChange} /></div>
            <div className="field"><label>Confirm New Password</label><input type="password" placeholder="Repeat new password" /></div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: ".72rem", color: "var(--text-muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Password Strength</div>
            <div style={{ height: 6, background: "#FFE0E0", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${strength.width}%`, background: strength.color, borderRadius: 10, transition: "width .4s" }} />
            </div>
            <div style={{ fontSize: ".7rem", color: "var(--text-muted)", marginTop: 5 }}>{strength.label}</div>
          </div>
          <SaveRow label="Update Password" />
        </div>
      </div>

      {/* Active Sessions */}
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon amber-ic">🖥️</div>
            <div><h3>Active Sessions</h3><p>Devices currently signed in</p></div>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          {[
            { icon: "💻", cls: "si-green", title: <>Chrome · Windows 11 <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 10, background: "#dcfce7", color: "#16a34a", fontWeight: 700, marginLeft: 6 }}>Current</span></>, sub: "Bangkok, Thailand · Active now", action: null },
            { icon: "📱", cls: "si-blue",  title: "Safari · iPhone 15",  sub: "Bangkok, Thailand · 2 days ago",   action: <button className="btn-sm-danger">Revoke</button> },
            { icon: "💻", cls: "si-amber", title: "Firefox · macOS",     sub: "Chiang Mai, Thailand · 5 days ago", action: <button className="btn-sm-danger">Revoke</button> },
          ].map(({ icon, cls, title, sub, action }, i) => (
            <div className="security-item" key={i}>
              <div className="security-left">
                <div className={`security-icon ${cls}`}>{icon}</div>
                <div className="security-text"><h4>{title}</h4><p>{sub}</p></div>
              </div>
              {action}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Notifications
// ════════════════════════════════════════════════
function NotificationsPanel() {
  const [toggles, setToggles] = useState({
    dispatched: true, transit: true, outForDelivery: true, delivered: true, failedDelivery: false,
    paymentDue: true, paymentReceived: true, invoice: false,
    newServices: true, promotions: false,
    email: true, sms: true, push: false, line: false,
  });
  const toggle = (k) => () => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon">🔔</div>
            <div><h3>Notification Preferences</h3><p>Choose what you want to hear about</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="notif-section-label">Shipment Updates</div>
          <ToggleRow title="Parcel Dispatched"       desc="When your shipment leaves the post office"       checked={toggles.dispatched}      onChange={toggle("dispatched")} />
          <ToggleRow title="In Transit Updates"      desc="Location changes and sorting hub arrivals"       checked={toggles.transit}         onChange={toggle("transit")} />
          <ToggleRow title="Out for Delivery"        desc="When your parcel is with the delivery agent"     checked={toggles.outForDelivery}  onChange={toggle("outForDelivery")} />
          <ToggleRow title="Delivery Confirmed"      desc="When your parcel is successfully delivered"      checked={toggles.delivered}       onChange={toggle("delivered")} />
          <ToggleRow title="Failed Delivery Attempt" desc="When the delivery agent cannot reach you"        checked={toggles.failedDelivery}  onChange={toggle("failedDelivery")} />

          <div className="notif-section-label">Payments & Billing</div>
          <ToggleRow title="Payment Due Reminder"    desc="Reminder before your payment deadline"           checked={toggles.paymentDue}      onChange={toggle("paymentDue")} />
          <ToggleRow title="Payment Received"        desc="Confirmation when payment is processed"          checked={toggles.paymentReceived} onChange={toggle("paymentReceived")} />
          <ToggleRow title="Invoice Available"       desc="When a new invoice is generated"                 checked={toggles.invoice}         onChange={toggle("invoice")} />

          <div className="notif-section-label">Promotions & News</div>
          <ToggleRow title="New Services & Features" desc="Updates about new post office services"          checked={toggles.newServices}     onChange={toggle("newServices")} />
          <ToggleRow title="Discount & Promotions"   desc="Special offers and seasonal deals"               checked={toggles.promotions}      onChange={toggle("promotions")} />
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon blue-ic">📡</div>
            <div><h3>Delivery Channels</h3><p>How you receive notifications</p></div>
          </div>
        </div>
        <div className="card-body">
          <ToggleRow title="Email Notifications" desc="Sent to somchai@email.com"     checked={toggles.email} onChange={toggle("email")} />
          <ToggleRow title="SMS Notifications"   desc="Sent to +66 81 234 5678"       checked={toggles.sms}   onChange={toggle("sms")} />
          <ToggleRow title="Push Notifications"  desc="Browser and mobile app alerts" checked={toggles.push}  onChange={toggle("push")} />
          <ToggleRow title="LINE Notifications"  desc="Connect LINE account to receive updates" checked={toggles.line} onChange={toggle("line")} />
          <SaveRow label="Save Preferences" />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Addresses
// ════════════════════════════════════════════════
function AddressesPanel() {
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", recipient: "", phone: "", province: "Bangkok", street: "", district: "", postal: "" });
  const set = (k) => (e) => setNewAddr(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon">📍</div>
            <div><h3>Saved Addresses</h3><p>Manage your delivery addresses</p></div>
          </div>
          <button className="btn-sm-primary" onClick={() => setShowForm(s => !s)}>+ Add New</button>
        </div>
        <div className="card-body">
          <div className="address-list">
            <div className="address-item default">
              <div className="addr-left">
                <div className="addr-icon">🏠</div>
                <div className="addr-info">
                  <h4>Home <span className="addr-default-tag">Default</span></h4>
                  <p>123/45 Sukhumvit Soi 11, Khlong Toei Nuea,<br />Watthana, Bangkok 10110</p>
                </div>
              </div>
              <div className="addr-actions">
                <button className="btn-sm-outline">Edit</button>
                <button className="btn-sm-danger">Delete</button>
              </div>
            </div>
            <div className="address-item">
              <div className="addr-left">
                <div className="addr-icon">🏢</div>
                <div className="addr-info">
                  <h4>Office</h4>
                  <p>888 Silom Complex Tower, 18th Floor,<br />Bang Rak, Bangkok 10500</p>
                </div>
              </div>
              <div className="addr-actions">
                <button className="btn-sm-outline">Set Default</button>
                <button className="btn-sm-outline">Edit</button>
                <button className="btn-sm-danger">Delete</button>
              </div>
            </div>
            <div className="address-item">
              <div className="addr-left">
                <div className="addr-icon">👨‍👩‍👧</div>
                <div className="addr-info">
                  <h4>Family (Chiang Mai)</h4>
                  <p>56 Nimmanhaemin Soi 7,<br />Chiang Mai 50200</p>
                </div>
              </div>
              <div className="addr-actions">
                <button className="btn-sm-outline">Set Default</button>
                <button className="btn-sm-outline">Edit</button>
                <button className="btn-sm-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-head">
            <div className="card-head-left">
              <div className="card-icon green-ic">➕</div>
              <div><h3>Add New Address</h3><p>Save a new delivery location</p></div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="field"><label>Address Label</label><input type="text" placeholder="e.g. Home, Office, Parents…" value={newAddr.label} onChange={set("label")} /></div>
              <div className="field"><label>Recipient Name</label><input type="text" placeholder="Full name" value={newAddr.recipient} onChange={set("recipient")} /></div>
              <div className="field"><label>Phone</label><input type="tel" placeholder="+66 XX XXX XXXX" value={newAddr.phone} onChange={set("phone")} /></div>
              <div className="field">
                <label>Province</label>
                <select value={newAddr.province} onChange={set("province")}>
                  {["Bangkok","Chiang Mai","Phuket","Khon Kaen","Hat Yai","Other"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field form-full"><label>Street Address</label><input type="text" placeholder="House number, road, sub-district" value={newAddr.street} onChange={set("street")} /></div>
              <div className="field"><label>District</label><input type="text" placeholder="District / Amphoe" value={newAddr.district} onChange={set("district")} /></div>
              <div className="field"><label>Postal Code</label><input type="text" placeholder="5-digit code" value={newAddr.postal} onChange={set("postal")} /></div>
            </div>
            <div className="save-row">
              <button className="btn-sm-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-save" onClick={() => setShowForm(false)}>Save Address</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Appearance
// ════════════════════════════════════════════════
function AppearancePanel() {
  const [theme, setTheme] = useState("ts-red");
  const [display, setDisplay] = useState({ compact: false, animations: true, showBalance: true, fontSize: "Medium (Default)" });
  const toggleD = (k) => () => setDisplay(p => ({ ...p, [k]: !p[k] }));

  const themes = [
    { cls: "ts-red",    label: "🔴 Thai Red" },
    { cls: "ts-dark",   label: "🌑 Midnight" },
    { cls: "ts-ocean",  label: "🌊 Ocean"    },
    { cls: "ts-forest", label: "🌿 Forest"   },
  ];

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon purple-ic">🎨</div>
            <div><h3>Theme</h3><p>Choose your colour scheme</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="theme-grid">
            {themes.map(t => (
              <div key={t.cls} className={`theme-swatch ${t.cls}${theme === t.cls ? " selected" : ""}`} onClick={() => setTheme(t.cls)}>
                <div className="swatch-preview" />
                <div className="swatch-label">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon amber-ic">🖥️</div>
            <div><h3>Display</h3><p>Interface appearance options</p></div>
          </div>
        </div>
        <div className="card-body">
          <ToggleRow title="Compact Mode"                desc="Reduce spacing for a denser layout"          checked={display.compact}      onChange={toggleD("compact")} />
          <ToggleRow title="Animations"                  desc="Enable page transitions and hover effects"    checked={display.animations}   onChange={toggleD("animations")} />
          <ToggleRow title="Show Balance on Dashboard"   desc="Display your account balance by default"      checked={display.showBalance}  onChange={toggleD("showBalance")} />
          <div style={{ marginTop: 16 }}>
            <div className="field">
              <label>Font Size</label>
              <select value={display.fontSize} onChange={e => setDisplay(p => ({ ...p, fontSize: e.target.value }))}>
                <option>Small</option>
                <option>Medium (Default)</option>
                <option>Large</option>
              </select>
            </div>
          </div>
          <SaveRow label="Save Appearance" />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Language & Region
// ════════════════════════════════════════════════
function LanguagePanel() {
  const [lang, setLang] = useState("th");
  const [region, setRegion] = useState({ date: "DD/MM/YYYY", time: "24-hour", tz: "Asia/Bangkok (UTC+7)", currency: "Thai Baht (฿)", weight: "Kilograms (kg)", distance: "Kilometers (km)" });
  const setR = (k) => (e) => setRegion(p => ({ ...p, [k]: e.target.value }));

  const langs = [
    { code: "th", flag: "🇹🇭", text: "ภาษาไทย" },
    { code: "en", flag: "🇬🇧", text: "English"  },
    { code: "zh", flag: "🇨🇳", text: "中文"     },
    { code: "ja", flag: "🇯🇵", text: "日本語"   },
  ];

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon">🌐</div>
            <div><h3>Language</h3><p>Select your preferred language</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="lang-grid">
            {langs.map(l => (
              <button key={l.code} className={`lang-btn${lang === l.code ? " selected" : ""}`} onClick={() => setLang(l.code)}>
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-text">{l.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-head-left">
            <div className="card-icon blue-ic">🗓️</div>
            <div><h3>Regional Settings</h3><p>Date, time, and currency preferences</p></div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="field">
              <label>Date Format</label>
              <select value={region.date} onChange={setR("date")}>
                <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="field">
              <label>Time Format</label>
              <select value={region.time} onChange={setR("time")}>
                <option>12-hour (AM/PM)</option><option>24-hour</option>
              </select>
            </div>
            <div className="field">
              <label>Timezone</label>
              <select value={region.tz} onChange={setR("tz")}>
                <option>Asia/Bangkok (UTC+7)</option><option>Asia/Singapore (UTC+8)</option><option>UTC</option>
              </select>
            </div>
            <div className="field">
              <label>Currency Display</label>
              <select value={region.currency} onChange={setR("currency")}>
                <option>Thai Baht (฿)</option><option>US Dollar ($)</option><option>Euro (€)</option>
              </select>
            </div>
            <div className="field">
              <label>Weight Unit</label>
              <select value={region.weight} onChange={setR("weight")}>
                <option>Kilograms (kg)</option><option>Pounds (lbs)</option>
              </select>
            </div>
            <div className="field">
              <label>Distance Unit</label>
              <select value={region.distance} onChange={setR("distance")}>
                <option>Kilometers (km)</option><option>Miles (mi)</option>
              </select>
            </div>
          </div>
          <SaveRow label="Save Settings" />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Danger Zone
// ════════════════════════════════════════════════
function DangerPanel({ onDelete }) {
  return (
    <div className="danger-zone">
      <div className="danger-head">
        <span style={{ fontSize: "1.2rem" }}>⚠️</span>
        <h3>Danger Zone</h3>
      </div>
      <div className="danger-body">
        <div className="danger-item">
          <div className="danger-item-text">
            <h4>Export My Data</h4>
            <p>Download all your shipment history and account data as a CSV file</p>
          </div>
          <button className="btn-sm-outline">Export</button>
        </div>
        <div className="danger-item">
          <div className="danger-item-text">
            <h4>Deactivate Account</h4>
            <p>Temporarily disable your account. You can reactivate at any time.</p>
          </div>
          <button className="btn-sm-danger">Deactivate</button>
        </div>
        <div className="danger-item" style={{ borderColor: "#fca5a5", background: "#fff0f0" }}>
          <div className="danger-item-text">
            <h4 style={{ color: "#dc2626" }}>Delete Account</h4>
            <p>Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
          <button
            className="btn-sm-danger"
            style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px" }}
            onClick={onDelete}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  DELETE CONFIRM MODAL
// ════════════════════════════════════════════════
function DeleteModal({ onClose }) {
  return (
    <div style={{ display: "flex", position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 380, width: "90%", boxShadow: "0 24px 60px rgba(0,0,0,.2)" }}>
        <div style={{ fontSize: "2rem", textAlign: "center", marginBottom: 12 }}>⚠️</div>
        <h3 style={{ fontFamily: "'Barlow',serif", fontSize: "1.1rem", color: "#1a1a2e", textAlign: "center", marginBottom: 8 }}>Delete Account?</h3>
        <p style={{ fontSize: ".82rem", color: "#6B5050", textAlign: "center", lineHeight: 1.5, marginBottom: 20 }}>
          This will permanently delete your account and all shipment data. This action <strong>cannot</strong> be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, border: "1.5px solid #FFD0D0", borderRadius: 10, background: "transparent", fontSize: ".83rem", fontWeight: 600, color: "#6B5050", cursor: "pointer" }}>Cancel</button>
          <button onClick={onClose} style={{ flex: 1, padding: 10, border: "none", borderRadius: 10, background: "#dc2626", color: "#fff", fontSize: ".83rem", fontWeight: 600, cursor: "pointer" }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "profile",      icon: "👤", label: "Profile"          },
  { id: "security",     icon: "🔒", label: "Security"         },
  { id: "notifications",icon: "🔔", label: "Notifications"    },
  { id: "addresses",    icon: "📍", label: "Saved Addresses"  },
  { divider: true },
  { id: "appearance",   icon: "🎨", label: "Appearance"       },
  { id: "language",     icon: "🌐", label: "Language & Region"},
  { divider: true },
  { id: "danger",       icon: "⚠️", label: "Danger Zone", danger: true },
];

export default function SettingPage() {
  const [activePanel, setActivePanel] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const panels = {
    profile:       <ProfilePanel />,
    security:      <SecurityPanel />,
    notifications: <NotificationsPanel />,
    addresses:     <AddressesPanel />,
    appearance:    <AppearancePanel />,
    language:      <LanguagePanel />,
    danger:        <DangerPanel onDelete={() => setShowDeleteModal(true)} />,
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      {sidebarOpen && <div className="overlay show" onClick={() => setSidebarOpen(false)} />}

      {/* ════ SIDEBAR ════ */}
      <nav className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon-s">📮</div>
          <div className="logo-text-s"><h2>Post Office</h2><p>Management System</p></div>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">S</div>
          <div className="user-info"><h4>Somchai Jaidee</h4><p>Member since 2023</p></div>
        </div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {[
            { href: "/",          icon: "🏠", label: "Dashboard"        },
            { href: "/tracking",  icon: "📍", label: "Track Parcel"     },
            { href: "/create",    icon: "📦", label: "Create Shipment"  },
            { href: "/history",   icon: "📋", label: "Shipment History", badge: "24" },
          ].map(({ href, icon, label, badge }) => (
            <a key={label} href={href} className="nav-item">
              <span className="nav-icon">{icon}</span> {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </a>
          ))}
          <div className="nav-section-label">Account</div>
          <a href="/payments"      className="nav-item"><span className="nav-icon">💳</span> Payments</a>
          <a href="/notifications" className="nav-item"><span className="nav-icon">🔔</span> Notifications <span className="nav-badge">3</span></a>
          <a href="/settings"      className="nav-item active"><span className="nav-icon">⚙️</span> Settings</a>
        </div>
        <div className="sidebar-footer">© 2024 Thai Post Office System</div>
      </nav>

      {/* ════ TOPBAR ════ */}
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setSidebarOpen(s => !s)}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div className="topbar-title">
          <h1>Settings ⚙️</h1>
          <p>Manage your account preferences</p>
        </div>
        <div className="topbar-actions">
          <button className="topbar-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <div className="notif-dot" />
          </button>
          <div className="topbar-avatar">S</div>
        </div>
      </header>

      {/* ════ MAIN ════ */}
      <main className="main">
        <div className="settings-layout">

          {/* Settings nav */}
          <div className="settings-nav-card">
            <div className="settings-nav-header">
              <h3>Preferences</h3>
              <p>Account & app settings</p>
            </div>
            <div className="settings-nav-list">
              {NAV_ITEMS.map((item, i) =>
                item.divider
                  ? <div key={i} className="settings-nav-divider" />
                  : (
                    <button
                      key={item.id}
                      className={`settings-nav-item${activePanel === item.id ? " active" : ""}`}
                      style={item.danger ? { color: "#dc2626" } : {}}
                      onClick={() => { setActivePanel(item.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <div className="sni-icon" style={item.danger ? { background: "#fee2e2" } : {}}>{item.icon}</div>
                      {item.label}
                    </button>
                  )
              )}
            </div>
          </div>

          {/* Active panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {panels[activePanel]}
          </div>

        </div>
      </main>

      {/* Delete modal */}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}
    </>
  );
}

// ════════════════════════════════════════════════
//  CSS
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
.sidebar-footer{padding:14px 20px;border-top:1px solid rgba(255,255,255,.1);font-size:.7rem;color:rgba(255,255,255,.45);}
.topbar{position:fixed;left:var(--sidebar-w);right:0;top:0;height:var(--topbar-h);background:rgba(255,255,255,.96);backdrop-filter:blur(12px);z-index:90;display:flex;align-items:center;padding:0 28px;box-shadow:0 2px 12px rgba(130,20,20,.1);border-bottom:1px solid rgba(240,190,190,.3);gap:16px;}
.topbar-title{flex:1;}
.topbar-title h1{font-family:'Barlow',serif;font-size:1.15rem;font-weight:700;color:var(--text-dark);}
.topbar-title p{font-size:.72rem;color:var(--text-muted);margin-top:1px;}
.topbar-actions{display:flex;align-items:center;gap:10px;}
.topbar-btn{width:38px;height:38px;border-radius:50%;border:1.5px solid var(--input-border);background:var(--input-bg);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:all .2s;}
.topbar-btn:hover{border-color:var(--accent);background:#ffe0e0;}
.topbar-btn svg{width:17px;height:17px;color:var(--accent);}
.notif-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:2px solid white;}
.topbar-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E60012,#8B0009);color:white;font-weight:700;font-size:.85rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid rgba(214,40,40,.3);font-family:'Barlow',serif;}
.menu-toggle{display:none;}
.main{margin-left:var(--sidebar-w);padding-top:calc(var(--topbar-h) + 28px);padding-bottom:40px;padding-left:28px;padding-right:28px;position:relative;z-index:1;animation:pageIn .5s cubic-bezier(.22,.68,0,1.1) both;}
@keyframes pageIn{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
.settings-layout{display:grid;grid-template-columns:220px 1fr;gap:20px;align-items:start;}
.settings-nav-card{background:rgba(255,255,255,.97);border-radius:18px;box-shadow:0 12px 40px rgba(140,30,30,.11);border:1px solid rgba(240,190,190,.25);overflow:hidden;position:sticky;top:calc(var(--topbar-h) + 28px);}
.settings-nav-header{padding:18px 20px 14px;border-bottom:1px solid #FFE0E0;}
.settings-nav-header h3{font-family:'Barlow',serif;font-size:.95rem;font-weight:700;color:var(--text-dark);}
.settings-nav-header p{font-size:.7rem;color:var(--text-muted);margin-top:2px;}
.settings-nav-list{padding:10px 10px;}
.settings-nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;cursor:pointer;transition:all .2s;color:var(--text-muted);font-size:.82rem;font-weight:500;margin-bottom:2px;border:none;background:none;width:100%;text-align:left;}
.settings-nav-item:hover{background:#fff0f0;color:var(--text-dark);}
.settings-nav-item.active{background:linear-gradient(135deg,#fff0f0,#ffe4e4);color:var(--accent);font-weight:600;}
.settings-nav-item.active .sni-icon{background:linear-gradient(135deg,#FF6666,#E60012);color:#fff;}
.sni-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.82rem;background:#FFF5F5;flex-shrink:0;transition:all .2s;}
.settings-nav-divider{height:1px;background:#fff4f4;margin:6px 10px;}
.card{background:rgba(255,255,255,.97);border-radius:18px;box-shadow:0 12px 40px rgba(140,30,30,.11);border:1px solid rgba(240,190,190,.25);overflow:hidden;}
.card-head{padding:18px 22px 14px;border-bottom:1px solid #FFE0E0;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.card-head-left{display:flex;align-items:center;gap:10px;}
.card-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#FF6666,#E60012);display:flex;align-items:center;justify-content:center;font-size:.95rem;box-shadow:0 3px 8px rgba(192,57,43,.28);flex-shrink:0;}
.card-icon.green-ic{background:linear-gradient(135deg,#4ade80,#16a34a);}
.card-icon.blue-ic{background:linear-gradient(135deg,#60a5fa,#1d4ed8);}
.card-icon.amber-ic{background:linear-gradient(135deg,#fbbf24,#d97706);}
.card-icon.purple-ic{background:linear-gradient(135deg,#c084fc,#7c3aed);}
.card-head h3{font-family:'Barlow',serif;font-size:1rem;font-weight:700;color:var(--text-dark);}
.card-head p{font-size:.7rem;color:var(--text-muted);margin-top:1px;}
.card-body{padding:22px;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.form-full{grid-column:1/-1;}
.field{display:flex;flex-direction:column;gap:6px;}
.field label{font-size:.72rem;font-weight:700;color:var(--text-dark);letter-spacing:.3px;text-transform:uppercase;}
.field input,.field select,.field textarea{padding:10px 14px;border:1.5px solid var(--input-border);border-radius:10px;background:var(--input-bg);font-size:.85rem;font-family:'IBM Plex Sans',sans-serif;color:var(--text-dark);outline:none;transition:border-color .2s,box-shadow .2s;}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(192,57,43,.08);}
.field textarea{resize:vertical;min-height:80px;line-height:1.5;}
.field select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23c0392b'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:16px;padding-right:36px;}
.avatar-section{display:flex;align-items:center;gap:20px;padding:4px 0 8px;}
.big-avatar{width:72px;height:72px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;font-size:1.8rem;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'Barlow',serif;border:3px solid rgba(214,40,40,.25);position:relative;cursor:pointer;}
.avatar-edit-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:.9rem;opacity:0;transition:.2s;}
.big-avatar:hover .avatar-edit-overlay{opacity:1;}
.avatar-info h4{font-family:'Barlow',serif;font-size:1.05rem;font-weight:700;color:var(--text-dark);}
.avatar-info p{font-size:.75rem;color:var(--text-muted);margin-top:3px;}
.avatar-btns{display:flex;gap:8px;margin-top:10px;}
.btn-sm-primary{padding:7px 16px;border:none;border-radius:8px;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;font-size:.77rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'IBM Plex Sans',sans-serif;}
.btn-sm-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(214,40,40,.3);}
.btn-sm-outline{padding:7px 14px;border:1.5px solid var(--input-border);border-radius:8px;background:transparent;color:var(--text-muted);font-size:.77rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'IBM Plex Sans',sans-serif;}
.btn-sm-outline:hover{border-color:var(--accent);color:var(--accent);background:#fff0f0;}
.btn-sm-danger{padding:7px 14px;border:1.5px solid #fecaca;border-radius:8px;background:#FFF5F5;color:#dc2626;font-size:.77rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'IBM Plex Sans',sans-serif;}
.btn-sm-danger:hover{background:#fee2e2;border-color:#fca5a5;}
.save-row{display:flex;align-items:center;justify-content:space-between;padding-top:18px;margin-top:4px;border-top:1px solid #fff4f4;}
.save-msg{font-size:.78rem;color:var(--text-muted);}
.save-msg.success{color:#16a34a;font-weight:600;}
.btn-save{padding:10px 26px;border:none;border-radius:11px;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;font-family:'Barlow',serif;font-size:.88rem;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(214,40,40,.3);}
.btn-save:hover{transform:translateY(-1px);box-shadow:0 7px 20px rgba(214,40,40,.38);}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid #FFF5F5;}
.toggle-row:last-child{border-bottom:none;}
.toggle-info h4{font-size:.85rem;font-weight:600;color:var(--text-dark);}
.toggle-info p{font-size:.73rem;color:var(--text-muted);margin-top:2px;}
.toggle{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;}
.toggle input{opacity:0;width:0;height:0;}
.toggle-slider{position:absolute;inset:0;background:#FFD0D0;border-radius:24px;cursor:pointer;transition:.3s;border:1.5px solid var(--input-border);}
.toggle-slider::before{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;left:2px;top:1px;transition:.3s;box-shadow:0 1px 4px rgba(0,0,0,.15);}
.toggle input:checked + .toggle-slider{background:linear-gradient(135deg,#FF6666,#E60012);border-color:#E60012;}
.toggle input:checked + .toggle-slider::before{transform:translateX(20px);}
.security-item{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #FFF5F5;}
.security-item:last-child{border-bottom:none;}
.security-left{display:flex;align-items:center;gap:12px;}
.security-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;}
.si-green{background:linear-gradient(135deg,#dcfce7,#bbf7d0);}
.si-blue{background:linear-gradient(135deg,#dbeafe,#bfdbfe);}
.si-amber{background:linear-gradient(135deg,#fef3c7,#fde68a);}
.si-red{background:linear-gradient(135deg,#fee2e2,#fecaca);}
.security-text h4{font-size:.85rem;font-weight:600;color:var(--text-dark);}
.security-text p{font-size:.72rem;color:var(--text-muted);margin-top:2px;}
.badge-status{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:700;}
.bs-on{background:#dcfce7;color:#16a34a;border:1px solid #bbf7d0;}
.bs-off{background:#fff0f0;color:#E60012;border:1px solid #fdd;}
.address-list{display:flex;flex-direction:column;gap:12px;}
.address-item{border:1.5px solid var(--input-border);border-radius:12px;padding:14px 16px;background:var(--input-bg);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;transition:border-color .2s;}
.address-item:hover{border-color:var(--accent-light);}
.address-item.default{border-color:var(--accent);background:#FFF5F5;}
.addr-left{display:flex;gap:12px;}
.addr-icon{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#ffe0e0,#fecaca);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;}
.addr-info h4{font-size:.84rem;font-weight:600;color:var(--text-dark);display:flex;align-items:center;gap:7px;}
.addr-info p{font-size:.76rem;color:var(--text-muted);margin-top:3px;line-height:1.4;}
.addr-default-tag{font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:10px;background:linear-gradient(135deg,#E60012,#8B0009);color:#fff;}
.addr-actions{display:flex;gap:6px;flex-shrink:0;}
.notif-section-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);margin-bottom:8px;margin-top:16px;}
.notif-section-label:first-child{margin-top:0;}
.theme-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.theme-swatch{border-radius:12px;overflow:hidden;cursor:pointer;border:2.5px solid transparent;transition:all .2s;}
.theme-swatch.selected{border-color:var(--accent);box-shadow:0 0 0 3px rgba(192,57,43,.15);}
.theme-swatch:hover{transform:translateY(-2px);}
.swatch-preview{height:52px;position:relative;}
.swatch-label{padding:7px 10px;font-size:.72rem;font-weight:600;color:var(--text-dark);background:#fff;border-top:1px solid #f5e0e0;}
.ts-red .swatch-preview{background:linear-gradient(135deg,#E60012,#FFAAAA);}
.ts-dark .swatch-preview{background:linear-gradient(135deg,#1a1a2e,#3a3a5e);}
.ts-ocean .swatch-preview{background:linear-gradient(135deg,#1d4ed8,#60a5fa);}
.ts-forest .swatch-preview{background:linear-gradient(135deg,#16a34a,#86efac);}
.lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;}
.lang-btn{padding:10px 14px;border-radius:10px;border:1.5px solid var(--input-border);background:var(--input-bg);cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .2s;}
.lang-btn.selected{border-color:var(--accent);background:#FFF5F5;}
.lang-btn:hover{border-color:var(--accent-light);}
.lang-flag{font-size:1.1rem;}
.lang-text{font-size:.8rem;font-weight:600;color:var(--text-dark);}
.danger-zone{border:1.5px solid #fecaca;border-radius:18px;overflow:hidden;}
.danger-head{background:linear-gradient(135deg,#FFF5F5,#fee2e2);padding:16px 22px;border-bottom:1px solid #fecaca;display:flex;align-items:center;gap:10px;}
.danger-head h3{font-family:'Barlow',serif;font-size:1rem;color:#dc2626;font-weight:700;}
.danger-body{padding:20px 22px;display:flex;flex-direction:column;gap:14px;}
.danger-item{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:10px;background:#FFF5F5;border:1px solid #fecaca;}
.danger-item-text h4{font-size:.85rem;font-weight:600;color:var(--text-dark);}
.danger-item-text p{font-size:.72rem;color:var(--text-muted);margin-top:2px;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99;display:none;}
.overlay.show{display:block;}
@media(max-width:900px){.settings-layout{grid-template-columns:1fr;}.settings-nav-card{position:static;}}
@media(max-width:720px){.sidebar{transform:translateX(-100%);}.sidebar.open{transform:translateX(0);}.topbar{left:0;}.main{margin-left:0;padding-left:16px;padding-right:16px;}.menu-toggle{display:flex;width:38px;height:38px;align-items:center;justify-content:center;border:1.5px solid var(--input-border);background:var(--input-bg);border-radius:50%;cursor:pointer;}.menu-toggle svg{width:17px;height:17px;color:var(--accent);}.form-grid{grid-template-columns:1fr;}.theme-grid{grid-template-columns:1fr 1fr;}}
`;
