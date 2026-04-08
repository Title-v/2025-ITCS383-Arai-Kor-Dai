import { useState, useRef, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════
function calcStrength(v) {
  if (!v) return { score: 0, label: "", color: "#ccc", bars: [] };
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  score = Math.min(score, 4);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ccc", "#e53935", "#fb8c00", "#43a047", "#1b5e20"];
  const cls    = ["", "weak", "fair", "good", "strong"];
  return { score, label: labels[score] || "Too short", color: colors[score], barCls: cls[score] };
}

function formatDOB(v) {
  let d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length >= 5) d = d.slice(0,2) + "/" + d.slice(2,4) + "/" + d.slice(4);
  else if (d.length >= 3) d = d.slice(0,2) + "/" + d.slice(2);
  return d;
}

function formatPhone(v) {
  let d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length >= 7) d = d.slice(0,3) + " " + d.slice(3,6) + " " + d.slice(6);
  else if (d.length >= 4) d = d.slice(0,3) + " " + d.slice(3);
  return d;
}

// ════════════════════════════════════════════════
//  UPLOAD ZONE COMPONENT
// ════════════════════════════════════════════════
function UploadZone({ label, icon, iconBg, sub, id, file, preview, error, onChange, onRemove }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  }

  return (
    <div>
      <label style={{ fontSize: ".77rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: 7, display: "block" }}>
        {label} <span className="req">*</span>
      </label>
      <div
        className={`upload-zone${drag ? " dragover" : ""}${error ? " error" : ""}${file ? " uploaded" : ""}`}
        onClick={() => !file && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files[0]) onChange(e.target.files[0]); }}
        />

        {!file ? (
          <div className="upload-placeholder">
            <div className="up-icon-wrap" style={{ background: iconBg }}><span>{icon}</span></div>
            <div>
              <div className="up-title">{label}</div>
              <div className="up-sub" dangerouslySetInnerHTML={{ __html: sub }} />
            </div>
            <span className="up-badge">Click or drag &amp; drop</span>
          </div>
        ) : (
          <div className="upload-preview show">
            <img src={preview} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
            <div className="preview-bar">
              <span className="preview-ok">✅</span>
              <span className="preview-fname">{file.name}</span>
              <button
                className="preview-remove"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                title="Remove"
              >✕</button>
            </div>
          </div>
        )}
      </div>
      {error && <div className="field-error show" style={{ marginTop: 5 }}>{error}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function RegisterPage() {
  // Form state
  const [form, setForm] = useState({
    firstname: "", lastname: "", dob: "", gender: "",
    email: "", phone: "", address: "",
    password: "", confirm: "",
  });
  const [errors, setErrors]     = useState({});
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [terms, setTerms]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  // Upload state
  const [idFile,      setIdFile]      = useState(null);
  const [idPreview,   setIdPreview]   = useState("");
  const [selfieFile,  setSelfieFile]  = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");

  const strength = calcStrength(form.password);

  // ── Field change
  const setField = (k) => (e) => {
    let v = e.target.value;
    if (k === "dob")   v = formatDOB(v);
    if (k === "phone") v = formatPhone(v);
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  // ── File handler
  function handleFile(file, setFile, setPreview, errKey) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors(p => ({ ...p, [errKey]: "Only JPG, PNG, or WEBP images are accepted." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, [errKey]: "File is too large. Maximum size is 5 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setFile(file);
    setErrors(p => ({ ...p, [errKey]: "" }));
  }

  // ── Validate
  function validate() {
    const errs = {};
    if (form.firstname.trim().length < 2) errs.firstname = "First name must be at least 2 characters.";
    if (form.lastname.trim().length < 2)  errs.lastname  = "Last name must be at least 2 characters.";
    if (form.dob && !/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob)) errs.dob = "Please enter a valid date (DD/MM/YYYY).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    const phoneDigits = form.phone.replace(/\s/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 10) errs.phone = "Please enter a valid Thai phone number (9–10 digits).";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match.";
    if (!idFile)     errs.idcard  = "Please upload your National ID card photo.";
    if (!selfieFile) errs.selfie  = "Please upload a selfie holding your ID card.";
    if (!terms)      errs.terms   = "You must agree to the terms to continue.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit
  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
  }

  // ── Success screen
  if (success) {
    return (
      <>
        <style>{CSS}</style>
        <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/><div className="blob b4"/>
        <div className="shell">
          <BrandPanel />
          <div className="form-panel">
            <div className="success-box show">
              <span className="s-icon">🎉</span>
              <h3>Account Created!</h3>
              <p>Welcome to the Thai Post Office system.<br />Your account is ready to use.</p>
              <div className="user-card">
                <div className="user-avatar">👤</div>
                <div>
                  <div className="user-name">{form.firstname} {form.lastname}</div>
                  <div className="user-email">{form.email}</div>
                </div>
              </div>
              <a href="/login">Go to Login →</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/><div className="blob b4"/>

      <div className="shell">
        <BrandPanel />

        {/* ════ FORM PANEL ════ */}
        <div className="form-panel">
          <div className="form-head">
            <h2>Create Account</h2>
            <p>Fill in your details below — all fields marked <span style={{ color: "var(--accent)", fontWeight: 700 }}>*</span> are required</p>
          </div>

          {/* PERSONAL INFO */}
          <div className="sec-label">Personal Information</div>
          <div className="fields-grid">

            <FormField label="First Name" req id="firstname" error={errors.firstname}
              icon={<UserSVG />} value={form.firstname} onChange={setField("firstname")} placeholder="Somchai" />

            <FormField label="Last Name" req id="lastname" error={errors.lastname}
              icon={<UserSVG />} value={form.lastname} onChange={setField("lastname")} placeholder="Jaidee" />

            <FormField label="Date of Birth" req id="dob" error={errors.dob}
              icon={<CalSVG />} value={form.dob} onChange={setField("dob")} placeholder="DD/MM/YYYY" maxLength={10} />

            <div className="field">
              <label>Gender</label>
              <div className="input-wrap select-wrap">
                <span className="ii"><ClockSVG /></span>
                <select value={form.gender} onChange={setField("gender")}
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "'IBM Plex Sans',sans-serif", fontSize: ".86rem", color: "#1a1a1a", padding: "11px 0", cursor: "pointer" }}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option>
                  <option>Non-binary</option><option>Prefer not to say</option>
                </select>
              </div>
            </div>

          </div>

          {/* CONTACT INFO */}
          <div className="sec-label">Contact Information</div>
          <div className="fields-grid">

            <div className="field full">
              <label>Email Address <span className="req">*</span></label>
              <div className={`input-wrap${errors.email ? " error" : ""}`}>
                <span className="ii"><MailSVG /></span>
                <input type="email" placeholder="somchai@email.com" value={form.email}
                  onChange={setField("email")} />
              </div>
              {errors.email && <div className="field-error show">{errors.email}</div>}
            </div>

            <div className="field full">
              <label>Phone Number <span className="req">*</span></label>
              <div className={`input-wrap${errors.phone ? " error" : ""}`}>
                <span className="ii"><PhoneSVG /></span>
                <span className="phone-prefix">+66</span>
                <input type="text" placeholder="8X XXX XXXX" maxLength={11} value={form.phone}
                  onChange={setField("phone")} />
              </div>
              {errors.phone && <div className="field-error show">{errors.phone}</div>}
            </div>

            <div className="field full">
              <label>Address</label>
              <div className="input-wrap">
                <span className="ii"><PinSVG /></span>
                <input type="text" placeholder="123 Silom Rd, Bang Rak, Bangkok"
                  value={form.address} onChange={setField("address")} />
              </div>
            </div>

          </div>

          {/* ACCOUNT SECURITY */}
          <div className="sec-label">Account Security</div>
          <div className="fields-grid">

            {/* Password */}
            <div className="field full">
              <label>Password <span className="req">*</span></label>
              <div className={`input-wrap${errors.password ? " error" : ""}`}>
                <span className="ii"><LockSVG /></span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => { setField("password")(e); setErrors(p => ({ ...p, password: "" })); }}
                />
                <span className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOffSVG /> : <EyeSVG />}
                </span>
              </div>
              {form.password && (
                <div className="pw-strength show">
                  <div className="pw-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`pw-bar${i <= strength.score ? " " + strength.barCls : ""}`} />
                    ))}
                  </div>
                  <div className="pw-hint" style={{ color: strength.color }}>{strength.label}</div>
                </div>
              )}
              {errors.password && <div className="field-error show">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="field full">
              <label>Confirm Password <span className="req">*</span></label>
              <div className={`input-wrap${errors.confirm ? " error" : ""}`}>
                <span className="ii"><ShieldSVG /></span>
                <input
                  type={showCf ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={setField("confirm")}
                />
                <span className="pw-toggle" onClick={() => setShowCf(s => !s)}>
                  {showCf ? <EyeOffSVG /> : <EyeSVG />}
                </span>
              </div>
              {errors.confirm && <div className="field-error show">{errors.confirm}</div>}
            </div>

          </div>

          {/* IDENTITY VERIFICATION */}
          <div className="sec-label">Identity Verification</div>

          <div className="id-tip">
            <div className="id-tip-icon">💡</div>
            <p>Upload clear photos of your <strong>National ID card</strong> and a photo of <strong>yourself holding the ID card</strong>. Accepted formats: JPG, PNG, WEBP · Max 5 MB each.</p>
          </div>

          <div className="id-upload-grid" style={{ marginTop: 14 }}>
            <UploadZone
              label="National ID Card" icon="🪪" iconBg="#FFE0E0"
              sub="Front side, full card visible<br>on a flat surface"
              file={idFile} preview={idPreview} error={errors.idcard}
              onChange={(f) => handleFile(f, setIdFile, setIdPreview, "idcard")}
              onRemove={() => { setIdFile(null); setIdPreview(""); }}
            />
            <UploadZone
              label="Selfie Holding ID Card" icon="🤳" iconBg="#e8f0ff"
              sub="Your face &amp; ID card<br>clearly visible together"
              file={selfieFile} preview={selfiePreview} error={errors.selfie}
              onChange={(f) => handleFile(f, setSelfieFile, setSelfiePreview, "selfie")}
              onRemove={() => { setSelfieFile(null); setSelfiePreview(""); }}
            />
          </div>

          {/* TERMS */}
          <div className="terms-row">
            <input type="checkbox" id="terms" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrors(p => ({ ...p, terms: "" })); }} />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of the Thai Post Office System.
            </label>
          </div>
          {errors.terms && <div className="terms-error show">{errors.terms}</div>}

          {/* SUBMIT */}
          <button className={`nav-next${loading ? " loading" : ""}`} onClick={handleSubmit} disabled={loading}>
            <span className="btn-txt">Create Account</span>
            <span className="spinner" />
          </button>

          <div className="login-link">Already have an account? <a href="/login">Sign in</a></div>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════
//  BRAND PANEL
// ════════════════════════════════════════════════
function BrandPanel() {
  return (
    <div className="brand">
      <div>
        <div className="brand-logo">
          <div className="logo-icon">📮</div>
          <div className="logo-text">
            <h2>Post Office</h2>
            <p>MANAGEMENT SYSTEM</p>
          </div>
        </div>
        <div className="brand-body">
          <h1>Create Account<span>Join our postal system</span></h1>
          <p>Register to track parcels, manage deliveries, and access your full shipment history.</p>
        </div>
        <div className="brand-features">
          {[
            { icon: "📦", text: "Track all your shipments in real time"    },
            { icon: "🧾", text: "Access full payment and delivery history" },
            { icon: "🔔", text: "Get notified on every status update"      },
          ].map(({ icon, text }) => (
            <div className="feat" key={text}>
              <div className="feat-icon">{icon}</div>
              <div className="feat-text">{text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="brand-footer">© 2024 Thai Post Office System</div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  FORM FIELD HELPER
// ════════════════════════════════════════════════
function FormField({ label, req, id, icon, value, onChange, placeholder, error, type = "text", maxLength }) {
  return (
    <div className="field">
      <label>{label}{req && <span className="req"> *</span>}</label>
      <div className={`input-wrap${error ? " error" : ""}`}>
        <span className="ii">{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength} />
      </div>
      {error && <div className="field-error show">{error}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════
//  SVG ICONS
// ════════════════════════════════════════════════
const UserSVG   = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
const CalSVG    = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockSVG  = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>;
const MailSVG   = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const PhoneSVG  = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>;
const PinSVG    = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const LockSVG   = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>;
const ShieldSVG = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
const EyeSVG    = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
const EyeOffSVG = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>;

// ════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--accent:#E60012;--accent-dark:#8B0009;--accent-light:#FF5555;--card-bg:rgba(255,255,255,0.97);--text-dark:#1a1a1a;--text-muted:#6b6b6b;--input-bg:#FFF5F5;--input-border:#FFD0D0;--error:#e53935;--success:#2e7d32;}
body{min-height:100vh;background:linear-gradient(135deg,#ffffff 0%,#FFD0D0 100%);font-family:'IBM Plex Sans',sans-serif;display:flex;align-items:center;justify-content:center;padding:32px 16px;overflow-x:hidden;}
.blob{position:fixed;border-radius:50%;filter:blur(70px);opacity:.18;pointer-events:none;animation:blobFloat 10s ease-in-out infinite alternate;}
.b1{width:500px;height:500px;background:#FF3333;top:-150px;left:-130px;}
.b2{width:380px;height:380px;background:#FF6666;bottom:-100px;right:-100px;animation-delay:4s;}
.b3{width:240px;height:240px;background:#FFB3B3;top:45%;left:58%;animation-delay:7s;}
.b4{width:170px;height:170px;background:#FFCCCC;top:18%;right:12%;animation-delay:2s;}
@keyframes blobFloat{from{transform:translateY(0) scale(1);}to{transform:translateY(-35px) scale(1.06);}}
.shell{width:100%;max-width:900px;display:grid;grid-template-columns:1fr 1.5fr;border-radius:22px;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.18);position:relative;z-index:1;}
.brand{background:linear-gradient(160deg,#E60012,#8B0009);padding:48px 38px;display:flex;flex-direction:column;justify-content:space-between;color:white;}
.brand-logo{display:flex;align-items:center;gap:12px;}
.logo-icon{width:46px;height:46px;background:rgba(255,255,255,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;}
.logo-text h2{font-family:'Barlow',serif;font-size:1.1rem;}
.logo-text p{font-size:.7rem;opacity:.7;letter-spacing:1px;}
.brand-body{margin-top:40px;}
.brand-body h1{font-family:'Barlow',serif;font-size:1.7rem;margin-bottom:10px;}
.brand-body span{display:block;font-size:.9rem;opacity:.7;}
.brand-body p{font-size:.85rem;opacity:.8;line-height:1.6;margin-top:8px;}
.brand-features{margin-top:32px;display:flex;flex-direction:column;gap:12px;}
.feat{display:flex;align-items:center;gap:10px;}
.feat-icon{width:32px;height:32px;background:rgba(255,255,255,.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;}
.feat-text{font-size:.78rem;opacity:.85;line-height:1.4;}
.brand-footer{font-size:.7rem;opacity:.6;margin-top:32px;}
.form-panel{background:white;padding:44px;overflow-y:auto;max-height:95vh;}
.form-head h2{font-family:'Barlow',serif;font-size:1.6rem;margin-bottom:4px;color:var(--text-dark);}
.form-head p{color:var(--text-muted);font-size:.85rem;margin-bottom:24px;}
.sec-label{font-size:.7rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;margin-top:22px;display:flex;align-items:center;gap:8px;}
.sec-label::after{content:'';flex:1;height:1px;background:var(--input-border);}
.fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;}
.fields-grid .full{grid-column:1/-1;}
.field{display:flex;flex-direction:column;}
.field label{font-size:.77rem;font-weight:600;color:var(--text-dark);margin-bottom:6px;letter-spacing:.3px;}
.field label .req,.req{color:var(--accent);margin-left:2px;}
.input-wrap{display:flex;align-items:center;background:var(--input-bg);border:1.5px solid var(--input-border);border-radius:10px;padding:0 13px;transition:border-color .2s,box-shadow .2s;}
.input-wrap:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(214,40,40,.1);}
.input-wrap.error{border-color:var(--error);}
.input-wrap.error:focus-within{box-shadow:0 0 0 3px rgba(229,57,53,.1);}
.ii{color:#d4a0a0;display:flex;align-items:center;margin-right:9px;flex-shrink:0;}
.ii svg{width:15px;height:15px;}
.input-wrap input,.input-wrap select{border:none;background:transparent;outline:none;flex:1;padding:11px 0;font-family:'IBM Plex Sans',sans-serif;font-size:.86rem;color:var(--text-dark);}
.input-wrap input::placeholder{color:#d4aaaa;}
.pw-toggle{cursor:pointer;color:#d4a0a0;display:flex;align-items:center;margin-left:6px;flex-shrink:0;transition:color .2s;}
.pw-toggle:hover{color:var(--accent);}
.pw-toggle svg{width:15px;height:15px;}
.pw-strength{margin-top:6px;display:none;}
.pw-strength.show{display:block;}
.pw-bars{display:flex;gap:4px;margin-bottom:4px;}
.pw-bar{flex:1;height:3px;border-radius:2px;background:#FFD0D0;transition:background .3s;}
.pw-bar.weak{background:#e53935;}
.pw-bar.fair{background:#fb8c00;}
.pw-bar.good{background:#43a047;}
.pw-bar.strong{background:#1b5e20;}
.pw-hint{font-size:.69rem;color:var(--text-muted);}
.field-error{font-size:.72rem;color:var(--error);margin-top:4px;display:none;}
.field-error.show{display:block;}
.phone-prefix{font-size:.82rem;font-weight:600;color:var(--text-dark);padding-right:8px;border-right:1.5px solid var(--input-border);margin-right:8px;white-space:nowrap;user-select:none;}
.select-wrap select{cursor:pointer;}
.terms-row{display:flex;align-items:flex-start;gap:10px;margin-top:16px;}
.terms-row input[type=checkbox]{accent-color:var(--accent);margin-top:2px;width:14px;height:14px;cursor:pointer;flex-shrink:0;}
.terms-row label{font-size:.78rem;color:var(--text-muted);cursor:pointer;line-height:1.5;}
.terms-row a{color:var(--accent);text-decoration:none;font-weight:600;}
.terms-row a:hover{text-decoration:underline;}
.terms-error{font-size:.72rem;color:var(--error);margin-top:4px;display:none;}
.terms-error.show{display:block;}
.nav-next{margin-top:20px;width:100%;padding:13px;border:none;border-radius:10px;background:linear-gradient(135deg,#E60012,#8B0009);color:white;font-family:'Barlow',serif;font-size:.95rem;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden;}
.nav-next::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent);pointer-events:none;}
.nav-next:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(214,40,40,.35);}
.nav-next:active{transform:translateY(0);}
.nav-next.loading{opacity:.75;pointer-events:none;}
.nav-next .spinner{display:none;width:17px;height:17px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
.nav-next.loading .btn-txt{display:none;}
.nav-next.loading .spinner{display:block;}
@keyframes spin{to{transform:rotate(360deg);}}
.login-link{text-align:center;margin-top:14px;font-size:.8rem;color:var(--text-muted);}
.login-link a{color:var(--accent);font-weight:600;text-decoration:none;}
.login-link a:hover{text-decoration:underline;}
.success-box{display:none;text-align:center;padding:40px 20px;animation:fadeUp .5s ease both;}
.success-box.show{display:block;}
.s-icon{font-size:3.2rem;display:block;margin-bottom:14px;animation:bounce .6s cubic-bezier(.22,.68,0,1.4) both .1s;}
.success-box h3{font-family:'Barlow',serif;font-size:1.5rem;margin-bottom:8px;}
.success-box p{color:var(--text-muted);font-size:.84rem;line-height:1.6;margin-bottom:20px;}
.success-box a{display:inline-block;padding:11px 32px;background:linear-gradient(135deg,#E60012,#8B0009);color:white;border-radius:10px;text-decoration:none;font-weight:600;font-size:.88rem;transition:.2s;}
.success-box a:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(214,40,40,.35);}
.user-card{background:#FFF5F5;border:1.5px solid var(--input-border);border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:14px;text-align:left;}
.user-avatar{width:46px;height:46px;background:linear-gradient(135deg,#E60012,#8B0009);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.user-name{font-weight:700;color:var(--text-dark);font-size:.95rem;}
.user-email{font-size:.78rem;color:var(--text-muted);margin-top:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes bounce{0%{transform:scale(.4);}60%{transform:scale(1.15);}100%{transform:scale(1);}}
.id-upload-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:2px;}
.upload-zone{border:2px dashed var(--input-border);border-radius:14px;background:var(--input-bg);cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s;position:relative;overflow:hidden;min-height:148px;display:flex;flex-direction:column;}
.upload-zone:hover{border-color:var(--accent-light);background:#fff0f0;box-shadow:0 4px 16px rgba(214,40,40,.08);}
.upload-zone.dragover{border-color:var(--accent);background:#FFE0E0;box-shadow:0 0 0 3px rgba(214,40,40,.12);}
.upload-zone.error{border-color:var(--error);}
.upload-zone.uploaded{border-style:solid;border-color:#c8e6c9;background:#f1f8e9;}
.upload-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:22px 16px;flex:1;text-align:center;}
.upload-placeholder .up-icon-wrap{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;transition:transform .2s;}
.upload-zone:hover .up-icon-wrap{transform:scale(1.08);}
.upload-placeholder .up-title{font-size:.8rem;font-weight:700;color:var(--text-dark);line-height:1.35;}
.upload-placeholder .up-sub{font-size:.68rem;color:var(--text-muted);line-height:1.5;}
.upload-placeholder .up-badge{display:inline-block;background:#ffe0e0;color:var(--accent);font-size:.64rem;font-weight:700;border-radius:20px;padding:2px 10px;border:1px solid #FFB3B3;text-transform:uppercase;letter-spacing:.5px;}
.upload-preview{display:none;flex-direction:column;flex:1;}
.upload-preview.show{display:flex;}
.preview-bar{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:#fff;border-top:1px solid #e8f5e9;gap:6px;}
.preview-fname{font-size:.68rem;font-weight:600;color:#2e7d32;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
.preview-ok{font-size:.75rem;color:#2e7d32;flex-shrink:0;}
.preview-remove{width:20px;height:20px;border:none;background:#ffe0e0;color:var(--accent);border-radius:50%;cursor:pointer;font-size:.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s;padding:0;line-height:1;}
.preview-remove:hover{background:#FFB3B3;}
.id-tip{margin-top:12px;background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;padding:10px 14px;display:flex;gap:10px;align-items:flex-start;}
.id-tip-icon{font-size:1rem;flex-shrink:0;margin-top:1px;}
.id-tip p{font-size:.72rem;color:#92400e;line-height:1.55;}
.id-tip strong{color:#78350f;}
@media(max-width:700px){.shell{grid-template-columns:1fr;}.brand{display:none;}.form-panel{padding:32px 24px;max-height:none;}.fields-grid{grid-template-columns:1fr;}.fields-grid .full{grid-column:1;}.id-upload-grid{grid-template-columns:1fr;}}
`;
