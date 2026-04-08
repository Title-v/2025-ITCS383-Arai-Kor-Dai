import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --accent: #E60012;
    --accent-dark: #8B0009;
    --accent-light: #FF6666;
    --card-bg: rgba(255,255,255,0.97);
    --text-dark: #1a1a2e;
    --text-muted: #6B5050;
    --input-bg: #FFF5F5;
    --input-border: #FFD0D0;
    --input-focus: #E60012;
    --error: #e53935;
  }

  .login-page-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #E60012 0%, #FFAAAA 100%);
    font-family: 'IBM Plex Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .login-page-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }

  .blob {
    position: fixed; border-radius: 50%;
    filter: blur(70px); opacity: 0.2;
    pointer-events: none; z-index: 0;
    animation: blobFloat 9s ease-in-out infinite alternate;
  }
  .b1 { width: 480px; height: 480px; background: #E60012; top: -120px; left: -120px; animation-delay: 0s; }
  .b2 { width: 360px; height: 360px; background: #FF9999; bottom: -80px; right: -80px; animation-delay: 3.5s; }
  .b3 { width: 220px; height: 220px; background: #FFB3B3; top: 55%; left: 60%; animation-delay: 6s; }
  .b4 { width: 160px; height: 160px; background: #f9c2e8; top: 20%; right: 18%; animation-delay: 2s; }

  @keyframes blobFloat {
    from { transform: translateY(0) rotate(0deg) scale(1); }
    to   { transform: translateY(-40px) rotate(8deg) scale(1.07); }
  }

  .deco-envelope {
    position: fixed;
    opacity: 0.06;
    pointer-events: none;
    z-index: 0;
    animation: envFloat 12s ease-in-out infinite alternate;
  }
  .deco-envelope svg { fill: #fff; }
  .env1 { width: 120px; top: 10%; left: 8%; animation-delay: 0s; }
  .env2 { width: 80px; bottom: 15%; left: 20%; animation-delay: 4s; transform: rotate(-20deg); }
  .env3 { width: 100px; top: 35%; right: 6%; animation-delay: 7s; transform: rotate(15deg); }
  .env4 { width: 60px; bottom: 30%; right: 22%; animation-delay: 2s; transform: rotate(-10deg); }

  @keyframes envFloat {
    from { transform: translateY(0) rotate(0deg); }
    to   { transform: translateY(-25px) rotate(5deg); }
  }

  .login-shell {
    position: relative; z-index: 1;
    width: 100%; max-width: 880px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(130,20,20,0.28), 0 2px 12px rgba(130,20,20,0.12);
    animation: shellIn 0.6s cubic-bezier(.22,.68,0,1.2) both;
  }

  @keyframes shellIn {
    from { opacity: 0; transform: translateY(36px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .brand-panel {
    background: linear-gradient(160deg, #B8000E 0%, #E60012 100%);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .brand-panel::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%);
  }

  .brand-logo {
    display: flex; align-items: center; gap: 12px;
    position: relative; z-index: 1;
  }
  .logo-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.18);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px);
    font-size: 1.5rem;
    border: 1px solid rgba(255,255,255,0.25);
  }
  .logo-text { color: #fff; }
  .logo-text h2 {
    font-family: 'Barlow', sans-serif;
    font-size: 1.15rem; font-weight: 700;
    line-height: 1;
  }
  .logo-text p {
    font-size: 0.7rem; opacity: 0.7;
    font-weight: 300; margin-top: 2px;
    letter-spacing: 1.5px; text-transform: uppercase;
  }

  .brand-content {
    position: relative; z-index: 1;
    flex: 1;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 40px 0 20px;
  }

  .brand-content h1 {
    font-family: 'Barlow', sans-serif;
    font-size: 2rem; font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 14px;
  }
  .brand-content h1 span { opacity: 0.7; display: block; font-size: 1.1rem; font-weight: 500; }

  .brand-content > p {
    color: rgba(255,255,255,0.72);
    font-size: 0.875rem; line-height: 1.65;
    font-weight: 300;
  }

  .brand-features {
    display: flex; flex-direction: column; gap: 12px;
    margin-top: 28px;
  }
  .feat-item {
    display: flex; align-items: center; gap: 10px;
    color: rgba(255,255,255,0.85);
    font-size: 0.82rem;
  }
  .feat-icon {
    width: 30px; height: 30px; flex-shrink: 0;
    background: rgba(255,255,255,0.15);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
  }

  .brand-footer {
    position: relative; z-index: 1;
    color: rgba(255,255,255,0.45);
    font-size: 0.7rem;
  }

  .brand-circle {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
  }
  .bc1 { width: 300px; height: 300px; bottom: -80px; right: -80px; }
  .bc2 { width: 180px; height: 180px; bottom: -20px; right: -20px; }
  .bc3 { width: 120px; height: 120px; top: -40px; right: 20px; }

  .form-panel {
    background: var(--card-bg);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-header { margin-bottom: 32px; }
  .form-header h2 {
    font-family: 'Barlow', sans-serif;
    font-size: 1.65rem; font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 6px;
  }
  .form-header p {
    color: var(--text-muted);
    font-size: 0.875rem; font-weight: 300;
  }

  .role-tabs {
    display: grid; grid-template-columns: 1fr 1fr;
    background: var(--input-bg);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
  }
  .role-tab {
    padding: 9px;
    border-radius: 9px;
    border: none;
    background: transparent;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.22s;
    display: flex; align-items: center;
    justify-content: center; gap: 6px;
  }
  .role-tab.active {
    background: #fff;
    color: var(--accent);
    box-shadow: 0 2px 10px rgba(192,57,43,0.14);
  }

  .field { margin-bottom: 16px; }
  .field label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 7px;
    letter-spacing: 0.3px;
  }

  .input-wrap {
    display: flex; align-items: center;
    background: var(--input-bg);
    border: 1.5px solid var(--input-border);
    border-radius: 11px;
    padding: 0 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .input-wrap:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
  }
  .input-wrap.error { border-color: var(--error); }
  .input-wrap.error:focus-within { box-shadow: 0 0 0 3px rgba(229,57,53,0.1); }

  .input-icon {
    color: #d4a0a0; flex-shrink: 0;
    display: flex; align-items: center;
    margin-right: 10px;
  }
  .input-icon svg { width: 17px; height: 17px; }

  .input-wrap input {
    border: none; background: transparent; outline: none;
    flex: 1; padding: 12px 0;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem; color: var(--text-dark);
  }
  .input-wrap input::placeholder { color: #d4aaaa; }

  .toggle-pw {
    background: none; border: none; cursor: pointer;
    color: #d4a0a0; display: flex; align-items: center;
    padding: 0; transition: color 0.15s;
  }
  .toggle-pw:hover { color: var(--accent); }
  .toggle-pw svg { width: 17px; height: 17px; }

  .field-error {
    font-size: 0.73rem; color: var(--error);
    margin-top: 5px; display: none;
  }
  .field-error.show { display: block; }

  .form-meta {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .remember {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer;
  }
  .remember input[type=checkbox] {
    width: 16px; height: 16px;
    accent-color: var(--accent);
    cursor: pointer;
  }
  .remember span { font-size: 0.8rem; color: var(--text-muted); }

  .forgot-link {
    font-size: 0.8rem; color: var(--accent);
    text-decoration: none; font-weight: 500;
    transition: color 0.15s;
  }
  .forgot-link:hover { color: var(--accent-dark); text-decoration: underline; }

  .submit-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #E60012, #B8000E);
    color: #fff;
    border: none;
    border-radius: 11px;
    font-family: 'Barlow', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 20px rgba(192,57,43,0.35);
    position: relative;
    overflow: hidden;
  }
  .submit-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    pointer-events: none;
  }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(192,57,43,0.45); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn.loading { opacity: 0.75; pointer-events: none; }

  .btn-spinner {
    display: none;
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto;
  }
  .submit-btn.loading .btn-text { display: none; }
  .submit-btn.loading .btn-spinner { display: block; }

  @keyframes spin { to { transform: rotate(360deg); } }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 18px 0 14px;
    color: var(--text-muted); font-size: 0.75rem;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: var(--input-border);
  }

  .create-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px solid var(--input-border);
    border-radius: 11px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.9rem; font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    transition: all 0.22s;
    letter-spacing: 0.2px;
    cursor: pointer;
  }
  .create-btn:hover {
    border-color: var(--accent);
    background: var(--input-bg);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(192,57,43,0.12);
  }
  .create-btn:active { transform: translateY(0); }

  .admin-portal-link {
    text-align: center;
    margin-top: 16px;
  }
  .admin-portal-link a {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.8rem; font-weight: 600;
    color: var(--text-muted);
    text-decoration: none;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1.5px solid var(--input-border);
    background: var(--input-bg);
    transition: all 0.18s;
  }
  .admin-portal-link a:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: #FFE0E0;
  }

  .success-msg {
    display: none;
    text-align: center;
    padding: 20px 0 10px;
    animation: fadeUp 0.4s ease both;
  }
  .success-msg.show { display: block; }
  .success-icon {
    font-size: 3rem; margin-bottom: 10px;
    animation: popIn 0.5s cubic-bezier(.22,.68,0,1.4) both 0.1s;
  }
  .success-msg h3 {
    font-family: 'Barlow', sans-serif;
    font-size: 1.2rem; color: var(--text-dark); margin-bottom: 6px;
  }
  .success-msg p { font-size: 0.82rem; color: var(--text-muted); }

  @keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 680px) {
    .login-shell { grid-template-columns: 1fr; max-width: 420px; }
    .brand-panel { padding: 32px 28px; min-height: 0; }
    .brand-content { padding: 20px 0 10px; }
    .brand-content h1 { font-size: 1.4rem; }
    .brand-features { display: none; }
    .form-panel { padding: 36px 28px; }
  }
`;

const EnvelopeSVG = () => (
  <svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="70" rx="6" />
    <polyline points="0,0 50,42 100,0" stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none" />
  </svg>
);

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const AddUserIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function LoginPage() {
  const [pwVisible, setPwVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearErrors = () => setErrors({ username: false, password: false });

  const handleLogin = () => {
  clearErrors();
  const newErrors = {
    username: !username.trim(),
    password: !password.trim(),
  };
  setErrors(newErrors);
  if (newErrors.username || newErrors.password) return;
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 1200);
  }, 1800);
};
  

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleLogin();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [username, password]);

  return (
    <>
      <style>{styles}</style>
      <div className="login-page-root">
        {/* Background blobs */}
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />

        {/* Floating envelope decorations */}
        <div className="deco-envelope env1"><EnvelopeSVG /></div>
        <div className="deco-envelope env2"><EnvelopeSVG /></div>
        <div className="deco-envelope env3"><EnvelopeSVG /></div>
        <div className="deco-envelope env4"><EnvelopeSVG /></div>

        {/* Main card */}
        <div className="login-shell">

          {/* Left brand panel */}
          <div className="brand-panel">
            <div className="brand-circle bc1" />
            <div className="brand-circle bc2" />
            <div className="brand-circle bc3" />

            <div className="brand-logo">
              <div className="logo-icon">📮</div>
              <div className="logo-text">
                <h2>Post Office</h2>
                <p>Management System</p>
              </div>
            </div>

            <div className="brand-content">
              <h1>
                Welcome back
                <span>Sign in to continue</span>
              </h1>
              <p>Manage parcels, track deliveries, and access postal records — all in one unified platform.</p>
              <div className="brand-features">
                <div className="feat-item">
                  <div className="feat-icon">📦</div>
                  <span>Real-time parcel tracking</span>
                </div>
                <div className="feat-item">
                  <div className="feat-icon">📊</div>
                  <span>Full transaction history</span>
                </div>
                <div className="feat-item">
                  <div className="feat-icon">🔒</div>
                  <span>Secure role-based access</span>
                </div>
                <div className="feat-item">
                  <div className="feat-icon">⚡</div>
                  <span>Express delivery management</span>
                </div>
              </div>
            </div>

            <div className="brand-footer">© 2024 Thai Post Office System</div>
          </div>

          {/* Right form panel */}
          <div className="form-panel">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {/* Login form */}
            {!success ? (
              <div id="loginForm">
                <div className="field">
                  <label>Username</label>
                  <div className={`input-wrap${errors.username ? " error" : ""}`}>
                    <span className="input-icon"><UserIcon /></span>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  {errors.username && (
                    <div className="field-error show">Please enter your username.</div>
                  )}
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className={`input-wrap${errors.password ? " error" : ""}`}>
                    <span className="input-icon"><LockIcon /></span>
                    <input
                      type={pwVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() => setPwVisible((v) => !v)}
                      title="Show/hide password"
                    >
                      {pwVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="field-error show">Please enter your password.</div>
                  )}
                </div>

                <div className="form-meta">
                  <label className="remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>

                <button
                  className={`submit-btn${loading ? " loading" : ""}`}
                  onClick={handleLogin}
                >
                  <span className="btn-text">Sign In</span>
                  <span className="btn-spinner" />
                </button>

                <div className="divider"><span>or</span></div>

                <a href="/register" className="create-btn">
                  <AddUserIcon />
                  Create New Account
                </a>

                <div className="admin-portal-link">
                  <a href="/admin/login">
                    <ShieldIcon />
                    Admin Portal →
                  </a>
                </div>
              </div>
            ) : (
              /* Success message */
              <div className="success-msg show">
                <div className="success-icon">✅</div>
                <h3>Login Successful!</h3>
                <p>Redirecting to your dashboard…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
