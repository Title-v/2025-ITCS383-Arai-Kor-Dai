import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-dark: #1a0505; --bg-mid: #180606; --bg-card: #1e0808;
    --bg-input: #280c0c; --border: #3d1010; --border-focus: #c0392b;
    --accent: #c0392b; --accent-light: #e07070; --accent-glow: rgba(192,57,43,0.35);
    --text: #e8e6f5; --text-muted: #7c789e;
    --error: #f87171; --error-bg: rgba(248,113,113,0.12);
    --green: #34d399; --gold: #f59e0b;
  }

  .al-root {
    min-height: 100vh; background: var(--bg-dark);
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 24px 16px; position: relative; overflow: hidden;
  }
  .al-root::before {
    content: ''; position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(192,57,43,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 80%, rgba(153,27,27,0.2) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(30,5,5,0.8) 0%, transparent 100%);
    pointer-events: none; z-index: 0;
  }
  .al-root::after {
    content: ''; position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }

  .grid-lines {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(192,57,43,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(192,57,43,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
    animation: gridShift 20s linear infinite;
  }
  @keyframes gridShift { from { background-position: 0 0; } to { background-position: 48px 48px; } }

  .orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; animation: orbFloat 12s ease-in-out infinite alternate; }
  .o1 { width: 400px; height: 400px; background: rgba(192,57,43,0.15); top: -120px; left: -100px; }
  .o2 { width: 300px; height: 300px; background: rgba(153,27,27,0.2); bottom: -80px; right: -80px; animation-delay: 5s; }
  .o3 { width: 180px; height: 180px; background: rgba(224,112,112,0.1); top: 42%; left: 58%; animation-delay: 8s; }
  @keyframes orbFloat { from { transform: translateY(0) scale(1); } to { transform: translateY(-30px) scale(1.06); } }

  .corner { position: fixed; width: 60px; height: 60px; pointer-events: none; z-index: 1; }
  .corner svg { width: 100%; height: 100%; }
  .c-tl { top: 20px; left: 20px; }
  .c-tr { top: 20px; right: 20px; transform: scaleX(-1); }
  .c-bl { bottom: 20px; left: 20px; transform: scaleY(-1); }
  .c-br { bottom: 20px; right: 20px; transform: scale(-1); }

  .shell {
    position: relative; z-index: 2;
    width: 100%; max-width: 900px;
    display: grid; grid-template-columns: 1.1fr 1fr;
    border-radius: 24px; overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 0 0 1px rgba(192,57,43,0.15), 0 32px 80px rgba(0,0,0,0.6), 0 0 80px rgba(192,57,43,0.08);
    animation: shellIn 0.6s cubic-bezier(.22,.68,0,1.15) both;
  }
  @keyframes shellIn { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Left panel */
  .left-panel {
    background: linear-gradient(160deg, #1a0606 0%, #110303 100%);
    padding: 52px 44px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
    border-right: 1px solid var(--border);
  }
  .left-panel::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 30% 30%, rgba(192,57,43,0.12) 0%, transparent 70%);
  }
  .left-panel::after {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 34L0 84V52l28-16 28 16v32L28 100z' fill='none' stroke='rgba(192,57,43,0.06)' stroke-width='1'/%3E%3C/svg%3E");
  }

  .brand-logo { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
  .logo-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, rgba(192,57,43,0.3), rgba(224,112,112,0.2));
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; border: 1px solid rgba(192,57,43,0.4);
    box-shadow: 0 0 20px rgba(192,57,43,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .logo-text h2 { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--text); line-height: 1; }
  .logo-text p  { font-size: 0.67rem; color: var(--text-muted); font-weight: 400; margin-top: 2px; letter-spacing: 1.8px; text-transform: uppercase; }

  .admin-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3);
    border-radius: 6px; padding: 5px 12px; margin-top: 10px;
    width: fit-content; position: relative; z-index: 1;
  }
  .ab-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: blink 2s ease infinite; }
  .admin-badge span { font-size: 0.68rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 1.2px; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  .brand-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 36px 0 16px; }
  .brand-body h1 { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 700; color: var(--text); line-height: 1.25; margin-bottom: 10px; }
  .brand-body h1 em { font-style: normal; color: var(--accent-light); }
  .brand-body > p { font-size: 0.83rem; color: var(--text-muted); line-height: 1.65; font-weight: 300; }

  .admin-perms { margin-top: 28px; display: flex; flex-direction: column; gap: 10px; }
  .perm-item { display: flex; align-items: center; gap: 10px; }
  .perm-icon { width: 28px; height: 28px; flex-shrink: 0; background: rgba(192,57,43,0.15); border: 1px solid rgba(192,57,43,0.25); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
  .perm-text { font-size: 0.78rem; color: rgba(232,230,245,0.7); }

  .security-strip { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); border-radius: 8px; position: relative; z-index: 1; }
  .security-strip svg { color: var(--green); width: 14px; height: 14px; flex-shrink: 0; }
  .security-strip span { font-size: 0.71rem; color: var(--green); font-weight: 600; }
  .brand-footer { position: relative; z-index: 1; font-size: 0.67rem; color: var(--text-muted); margin-top: 14px; }

  /* Right form panel */
  .form-panel { background: var(--bg-card); padding: 52px 44px; display: flex; flex-direction: column; justify-content: center; }
  .form-head { margin-bottom: 28px; }
  .form-head h2 { font-family: 'Playfair Display', serif; font-size: 1.55rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .form-head p { font-size: 0.84rem; color: var(--text-muted); font-weight: 300; }

  .access-tabs { display: grid; grid-template-columns: 1fr 1fr; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 10px; padding: 3px; margin-bottom: 24px; }
  .access-tab { padding: 9px; border-radius: 7px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
  .access-tab:hover { color: var(--text); }
  .access-tab.active { background: var(--accent); color: #fff; box-shadow: 0 2px 12px var(--accent-glow); }
  .access-tab svg { width: 13px; height: 13px; }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 0.76rem; font-weight: 600; color: var(--text-muted); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.6px; }
  .field label .req { color: var(--accent-light); margin-left: 2px; }

  .input-wrap { display: flex; align-items: center; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; padding: 0 14px; transition: border-color 0.2s, box-shadow 0.2s; }
  .input-wrap:focus-within { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-glow); }
  .input-wrap.error { border-color: var(--error); }
  .input-wrap.error:focus-within { box-shadow: 0 0 0 3px rgba(248,113,113,0.2); }

  .ii { color: var(--text-muted); display: flex; align-items: center; margin-right: 10px; flex-shrink: 0; }
  .ii svg { width: 15px; height: 15px; }

  .input-wrap input { border: none; background: transparent; outline: none; flex: 1; padding: 12px 0; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--text); }
  .input-wrap input::placeholder { color: #5a2020; }

  .toggle-pw { background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; transition: color 0.15s; padding: 0; }
  .toggle-pw:hover { color: var(--accent-light); }
  .toggle-pw svg { width: 16px; height: 16px; }

  .field-error { font-size: 0.72rem; color: var(--error); margin-top: 5px; display: none; }
  .field-error.show { display: block; }

  .otp-row { display: flex; gap: 8px; justify-content: center; margin-top: 6px; }
  .otp-box { width: 44px; height: 52px; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; text-align: center; font-family: 'DM Sans', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .otp-box:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-glow); }
  .otp-box.otp-error { border-color: var(--error); }

  .form-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
  .remember { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .remember input[type=checkbox] { width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer; }
  .remember span { font-size: 0.78rem; color: var(--text-muted); }
  .forgot-link { font-size: 0.78rem; color: var(--accent-light); text-decoration: none; font-weight: 500; transition: color 0.15s; }
  .forgot-link:hover { color: var(--text); }

  .submit-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #c0392b, #b71c1c);
    color: #fff; border: none; border-radius: 10px;
    font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 500;
    cursor: pointer; letter-spacing: 0.3px;
    transition: transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px var(--accent-glow);
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent); pointer-events: none; }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(192,57,43,0.5); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn.loading { opacity: 0.7; pointer-events: none; }
  .btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0 14px; color: var(--text-muted); font-size: 0.72rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .user-login-link { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: 11px; background: transparent; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.84rem; font-weight: 500; color: var(--text-muted); text-decoration: none; transition: all 0.2s; }
  .user-login-link:hover { border-color: rgba(192,57,43,0.5); color: var(--text); background: rgba(192,57,43,0.06); }
  .user-login-link svg { width: 14px; height: 14px; }

  .alert-banner { display: none; align-items: center; gap: 10px; background: var(--error-bg); border: 1px solid rgba(248,113,113,0.3); border-radius: 9px; padding: 10px 14px; margin-bottom: 16px; }
  .alert-banner.show { display: flex; }
  .alert-banner svg { color: var(--error); width: 16px; height: 16px; flex-shrink: 0; }
  .alert-banner span { font-size: 0.8rem; color: var(--error); }

  .back-step-btn { width: 100%; margin-top: 12px; padding: 10px; background: none; border: 1.5px solid var(--border); border-radius: 10px; color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 0.83rem; cursor: pointer; transition: all 0.15s; }
  .back-step-btn:hover { border-color: rgba(192,57,43,0.5); color: var(--text); }

  .success-state { text-align: center; padding: 20px 0; animation: fadeUp 0.4s ease both; }
  .s-icon { font-size: 3.2rem; display: block; margin-bottom: 12px; animation: popIn 0.5s cubic-bezier(.22,.68,0,1.4) both 0.1s; }
  .success-state h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--text); margin-bottom: 6px; }
  .success-state p { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
  .success-role { display: inline-flex; align-items: center; gap: 6px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 6px; padding: 5px 14px; font-size: 0.76rem; font-weight: 700; color: var(--gold); margin-top: 14px; letter-spacing: 0.5px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  @media (max-width: 680px) {
    .shell { grid-template-columns: 1fr; max-width: 420px; }
    .left-panel { padding: 32px 28px; }
    .admin-perms { display: none; }
    .form-panel { padding: 36px 28px; }
    .corner { display: none; }
  }
`;

// ─── Corner decoration SVG ────────────────────────────────────────────────────
const CornerSVG = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 30 L0 0 L30 0" stroke="rgba(192,57,43,0.4)" strokeWidth="1.5" />
    <path d="M0 48 L0 0 L48 0" stroke="rgba(192,57,43,0.15)" strokeWidth="1" />
  </svg>
);

// ─── OTP input row ────────────────────────────────────────────────────────────
function OtpRow({ values, onChange, hasError }) {
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5];

  const handleInput = (i, val) => {
    const next = [...values];
    next[i] = val.slice(-1);
    onChange(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="otp-row">
      {values.map((v, i) => (
        <input
          key={i}
          ref={refs[i]}
          className={`otp-box${hasError ? ' otp-error' : ''}`}
          maxLength={1}
          value={v}
          onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}

// ─── Eye icons ────────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeClosed = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// ─── Step constants ───────────────────────────────────────────────────────────
const STEP_LOGIN   = 'login';
const STEP_2FA     = '2fa';
const STEP_SUCCESS = 'success';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  // ── React Router navigate hook ──
  const navigate = useNavigate();

  const [step, setStep]             = useState(STEP_LOGIN);
  const [adminLevel, setAdminLevel] = useState('superadmin');
  const [uid, setUid]               = useState('');
  const [pw, setPw]                 = useState('');
  const [pwVisible, setPwVisible]   = useState(false);
  const [staySignedIn, setStay]     = useState(false);
  const [errors, setErrors]         = useState({ uid: false, pw: false });
  const [alert, setAlert]           = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading]     = useState(false);
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError]     = useState(false);
  const loginAttempts               = useRef(0);

  const clearErrors = () => {
    setErrors({ uid: false, pw: false });
    setAlert('');
  };

  const handleLevelChange = (level) => {
    setAdminLevel(level);
    clearErrors();
  };

  // ── Step 1: Login submit ──
  const handleAdminLogin = useCallback(() => {
    clearErrors();
    const newErrors = { uid: !uid.trim(), pw: !pw.trim() };
    setErrors(newErrors);
    if (newErrors.uid || newErrors.pw) return;

    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      loginAttempts.current += 1;

      if (loginAttempts.current === 1 && pw !== 'admin123' && uid !== 'admin') {
        setAlert(`Invalid credentials. ${2 - loginAttempts.current} attempt remaining before lockout.`);
        setErrors(e => ({ ...e, pw: true }));
        return;
      }

      setStep(STEP_2FA);
    }, 1400);
  }, [uid, pw]);

  // ── Step 2: OTP verify — navigates to AdminDashboardPage on success ──
  const verifyOtp = useCallback(() => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 1200);
      return;
    }

    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setStep(STEP_SUCCESS);

      // ── Navigate to AdminDashboardPage after a short success flash ──
      setTimeout(() => {
        navigate('/admin/dashboard', {
          // Pass login context so the dashboard knows who logged in
          state: { adminLevel, uid },
        });
      }, 1200);
    }, 1500);
  }, [otp, navigate, adminLevel, uid]);

  const backToLogin = () => {
    setStep(STEP_LOGIN);
    loginAttempts.current = 0;
    setOtp(['', '', '', '', '', '']);
  };

  // ── Enter key handler ──
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter') return;
      if (step === STEP_LOGIN) handleAdminLogin();
      if (step === STEP_2FA)   verifyOtp();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, handleAdminLogin, verifyOtp]);

  const roleLabel = adminLevel === 'superadmin' ? '⭐ Super Admin' : '👤 Staff Admin';

  return (
    <>
      <style>{styles}</style>
      <div className="al-root">
        {/* Background */}
        <div className="grid-lines" />
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />

        {/* Corner decorations */}
        <div className="corner c-tl"><CornerSVG /></div>
        <div className="corner c-tr"><CornerSVG /></div>
        <div className="corner c-bl"><CornerSVG /></div>
        <div className="corner c-br"><CornerSVG /></div>

        <div className="shell">

          {/* ── Left panel ── */}
          <div className="left-panel">
            <div>
              <div className="brand-logo">
                <div className="logo-icon">🛡️</div>
                <div className="logo-text">
                  <h2>Post Office</h2>
                  <p>Admin Portal</p>
                </div>
              </div>
              <div className="admin-badge">
                <div className="ab-dot" />
                <span>Restricted Access</span>
              </div>
            </div>

            <div className="brand-body">
              <h1>Admin<br /><em>Control Centre</em></h1>
              <p>Secure access for authorised postal administration staff. All sessions are logged and monitored.</p>
              <div className="admin-perms">
                {[
                  ['📊', 'System-wide analytics & reports'],
                  ['👥', 'User account management'],
                  ['📦', 'All shipment oversight'],
                  ['⚙️', 'System configuration & settings'],
                  ['🔐', 'Role & permission management'],
                ].map(([icon, text]) => (
                  <div key={text} className="perm-item">
                    <div className="perm-icon">{icon}</div>
                    <span className="perm-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="security-strip">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>256-bit SSL · Session logged · 2FA enabled</span>
              </div>
              <div className="brand-footer" style={{ marginTop: 12 }}>© 2024 Thai Post Office — Admin v2.4.1</div>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="form-panel">

            {/* Step 1 — Login */}
            {step === STEP_LOGIN && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div className="form-head">
                  <h2>Admin Sign In</h2>
                  <p>Restricted to authorised personnel only</p>
                </div>

                {/* Access level tabs */}
                <div className="access-tabs">
                  <button
                    className={`access-tab${adminLevel === 'superadmin' ? ' active' : ''}`}
                    onClick={() => handleLevelChange('superadmin')}
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Super Admin
                  </button>
                  <button
                    className={`access-tab${adminLevel === 'staff' ? ' active' : ''}`}
                    onClick={() => handleLevelChange('staff')}
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                    Staff Admin
                  </button>
                </div>

                {/* Error alert */}
                <div className={`alert-banner${alert ? ' show' : ''}`}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{alert}</span>
                </div>

                {/* Admin ID */}
                <div className="field">
                  <label>Admin ID / Username <span className="req">*</span></label>
                  <div className={`input-wrap${errors.uid ? ' error' : ''}`}>
                    <span className="ii">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. admin_001 or SA-2024"
                      value={uid}
                      onChange={e => setUid(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  {errors.uid && <div className="field-error show">Admin ID is required.</div>}
                </div>

                {/* Password */}
                <div className="field">
                  <label>Password <span className="req">*</span></label>
                  <div className={`input-wrap${errors.pw ? ' error' : ''}`}>
                    <span className="ii">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </span>
                    <input
                      type={pwVisible ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={pw}
                      onChange={e => setPw(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button type="button" className="toggle-pw" onClick={() => setPwVisible(v => !v)}>
                      {pwVisible ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {errors.pw && <div className="field-error show">Password is required.</div>}
                </div>

                {/* Meta row */}
                <div className="form-meta">
                  <label className="remember">
                    <input type="checkbox" checked={staySignedIn} onChange={e => setStay(e.target.checked)} />
                    <span>Stay signed in</span>
                  </label>
                  <a href="#" className="forgot-link">Reset access</a>
                </div>

                <button
                  className={`submit-btn${loginLoading ? ' loading' : ''}`}
                  onClick={handleAdminLogin}
                >
                  {loginLoading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      <span>Access Admin Portal</span>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="divider"><span>back to</span></div>

                <a href="/login" className="user-login-link">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  User Login
                </a>
              </div>
            )}

            {/* Step 2 — 2FA */}
            {step === STEP_2FA && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div className="form-head">
                  <h2>Verify Identity</h2>
                  <p>Enter the 6-digit code from your authenticator app</p>
                </div>

                <div style={{ textAlign: 'center', margin: '10px 0 24px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 10 }}>🔐</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    A verification code has been sent to your authenticator. This step ensures your admin account is secure.
                  </p>
                </div>

                <OtpRow values={otp} onChange={setOtp} hasError={otpError} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0 24px' }}>
                  Try any 6 digits for this demo
                </p>

                <button
                  className={`submit-btn${otpLoading ? ' loading' : ''}`}
                  onClick={verifyOtp}
                >
                  {otpLoading ? (
                    <span className="btn-spinner" />
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </button>

                <button className="back-step-btn" onClick={backToLogin}>← Back</button>
              </div>
            )}

            {/* Step 3 — Success flash before redirect */}
            {step === STEP_SUCCESS && (
              <div className="success-state">
                <span className="s-icon">🛡️</span>
                <h3>Access Granted</h3>
                <p>Welcome to the Admin Control Centre.<br />Redirecting to your dashboard…</p>
                <div className="success-role">{roleLabel}</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
