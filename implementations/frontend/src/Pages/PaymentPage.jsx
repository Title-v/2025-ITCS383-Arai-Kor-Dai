import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const METHOD_NAMES = {
  card: "Credit/Debit Card", promptpay: "PromptPay",
  transfer: "Bank Transfer",  cash: "Pay at Counter",
  wallet: "e-Wallet",         cod: "Cash on Delivery",
};

const METHODS = [
  { id:"card",      icon:"💳", name:"Credit / Debit",  desc:"Visa, Mastercard, JCB"    },
  { id:"promptpay", icon:"📱", name:"PromptPay",        desc:"Scan QR to pay instantly" },
  { id:"transfer",  icon:"🏦", name:"Bank Transfer",    desc:"Direct bank transfer"     },
  { id:"cash",      icon:"💵", name:"Pay at Counter",   desc:"Pay at any post office"   },
  { id:"wallet",    icon:"👜", name:"e-Wallet",         desc:"TrueMoney, Rabbit LINE"   },
  { id:"cod",       icon:"📦", name:"COD",              desc:"Cash on delivery (+฿30)"  },
];

// ── Formatters ──
function fmtCardNum(v) {
  return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
}
function fmtExpiry(v) {
  let d = v.replace(/\D/g,"").slice(0,4);
  if (d.length >= 3) d = d.slice(0,2)+"/"+d.slice(2);
  return d;
}
function cardDisplay(raw) {
  const d = raw.replace(/\s/g,"").padEnd(16,"•");
  return d.replace(/(.{4})/g,"$1 ").trim();
}

// ════════════════════════════════════════════════
//  CARD PREVIEW
// ════════════════════════════════════════════════
function CardPreview({ num, name, expiry }) {
  return (
    <div className="card-number-display">
      <div className="cnd-chip" />
      <div className="cnd-num">{cardDisplay(num)}</div>
      <div className="cnd-bottom">
        <div>
          <div className="cnd-label">Card Holder</div>
          <div className="cnd-value">{name.toUpperCase() || "YOUR NAME"}</div>
        </div>
        <div>
          <div className="cnd-label">Expires</div>
          <div className="cnd-value">{expiry || "MM/YY"}</div>
        </div>
        <div className="cnd-brand">💳</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  PROMPTPAY QR PANEL
// ════════════════════════════════════════════════
function PromptPayPanel({ amount, trackId, active }) {
  const qrRef = useRef(null);
  const [timer, setTimer] = useState(600);
  const [expired, setExpired] = useState(false);
  const [refNum, setRefNum]   = useState("—");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    // Generate QR via QRCode lib (loaded via CDN in index.html)
    if (qrRef.current && window.QRCode) {
      qrRef.current.innerHTML = "";
      const promptPayId = "0021489001234";
      const amtStr = String(amount) + ".00";
      const payload = buildPromptPayPayload(promptPayId, amtStr);
      new window.QRCode(qrRef.current, {
        text: payload, width: 180, height: 180,
        colorDark: "#1a1a2e", colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    }
    const ref = "PP" + trackId.replace("PO-","") + Math.floor(Math.random()*100).toString().padStart(2,"0");
    setRefNum(ref);
    setTimer(600); setExpired(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(s => {
        if (s <= 1) { clearInterval(timerRef.current); setExpired(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active, amount, trackId]);

  const m = Math.floor(timer/60).toString().padStart(2,"0");
  const s = (timer%60).toString().padStart(2,"0");

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"18px 0 8px", gap:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ background:"linear-gradient(135deg,#003b95,#0050c8)", borderRadius:10, padding:"7px 14px", display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:"1rem" }}>📱</span>
          <span style={{ color:"#fff", fontWeight:700, fontSize:"0.88rem" }}>PromptPay</span>
        </div>
        <div style={{ background:"#e8f5e9", border:"1.5px solid #a5d6a7", borderRadius:8, padding:"5px 12px" }}>
          <span style={{ color:"#2e7d32", fontSize:"0.78rem", fontWeight:700 }}>฿{amount}</span>
        </div>
      </div>
      <div style={{ background:"#fff", border:"2.5px solid #e8d0d0", borderRadius:18, padding:16, boxShadow:"0 6px 24px rgba(192,57,43,0.10)", position:"relative" }}>
        {/* corner brackets */}
        {[["top","left","borderTop","borderLeft","3px 0 0 0"],["top","right","borderTop","borderRight","0 3px 0 0"],
          ["bottom","left","borderBottom","borderLeft","0 0 0 3px"],["bottom","right","borderBottom","borderRight","0 0 3px 0"]].map(([v,h,b1,b2,r],i)=>
          <div key={i} style={{ position:"absolute", [v]:10, [h]:10, width:16, height:16, [b1]:"3px solid #E60012", [b2]:"3px solid #E60012", borderRadius:r }} />
        )}
        <div ref={qrRef} style={{ width:180, height:180, display:"flex", alignItems:"center", justifyContent:"center",
          opacity: expired ? 0.35 : 1, filter: expired ? "grayscale(1)" : "none" }}>
          {!window.QRCode && <span style={{ fontSize:"3rem" }}>📱</span>}
        </div>
      </div>
      <div style={{ marginTop:12, background:"#FFF5F5", border:"1.5px solid #FFD0D0", borderRadius:8, padding:"6px 18px", textAlign:"center" }}>
        <div style={{ fontSize:".65rem", color:"#9e7070", textTransform:"uppercase", letterSpacing:".8px", fontWeight:600 }}>Reference</div>
        <div style={{ fontSize:".9rem", fontWeight:700, color:"#E60012", letterSpacing:"1.5px" }}>{refNum}</div>
      </div>
      <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8 }}>
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#E60012" strokeWidth={2.2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span style={{ fontSize:".78rem", color:"#9e7070" }}>
          QR expires in <strong style={{ color: expired||timer<=60 ? "#e53935" : "#E60012", fontSize:".88rem" }}>
            {expired ? "Expired" : `${m}:${s}`}
          </strong>
        </span>
      </div>
      <div style={{ marginTop:14, background:"#f8f8ff", border:"1.5px solid #e0e0ff", borderRadius:10, padding:"12px 16px", maxWidth:280, textAlign:"left" }}>
        <div style={{ fontSize:".72rem", fontWeight:700, color:"#3b3b8c", marginBottom:6 }}>How to pay</div>
        <ol style={{ fontSize:".74rem", color:"#555", lineHeight:1.8, margin:0, paddingLeft:16 }}>
          <li>Open your bank or wallet app</li>
          <li>Tap <strong>"Scan QR"</strong> or <strong>"Pay via QR"</strong></li>
          <li>Scan the code above</li>
          <li>Confirm the amount and tap <strong>Pay</strong></li>
        </ol>
      </div>
      <p style={{ fontSize:".7rem", color:"#b09090", marginTop:10, textAlign:"center" }}>
        Supports: KBank · SCB · KTB · BBL · BAY · TTB · GSB
      </p>
    </div>
  );
}

// ── PromptPay helpers ──
function buildPromptPayPayload(promptPayId, amount) {
  function tlv(tag, value) { return tag + value.length.toString().padStart(2,"0") + value; }
  const merchantAcct = tlv("00","A000000677010111") + tlv("01",promptPayId);
  let payload = "000201" + tlv("29",merchantAcct) + "5303764" + tlv("54",amount) + "5802TH" + "6304";
  return payload + crc16(payload);
}
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? (crc<<1)^0x1021 : crc<<1;
  }
  return ((crc&0xFFFF).toString(16).toUpperCase()).padStart(4,"0");
}

// ════════════════════════════════════════════════
//  SUCCESS OVERLAY
// ════════════════════════════════════════════════
function SuccessOverlay({ data, onDownload }) {
  return (
    <div className="success-overlay show">
      <div className="success-box">
        <span className="s-icon">🎉</span>
        <h2>Payment Successful!</h2>
        <p>Your shipment is confirmed and will be processed shortly. Check your history for updates.</p>
        <div className="receipt-strip">
          {[["Tracking ID",data.trackId,"accent"],["Amount Paid",`฿${data.amount}`,""],
            ["Method",data.method,""],["Date",data.date,""]].map(([k,v,cls])=>(
            <div className="rs-row" key={k}>
              <span className="rs-key">{k}</span>
              <span className={`rs-val${cls?" "+cls:""}`}>{v}</span>
            </div>
          ))}
        </div>
        <div className="success-actions" style={{ flexDirection:"column", gap:10 }}>
          <button className="sa-btn sa-primary" onClick={onDownload} style={{ width:"100%", gap:8 }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Shipping Label (PDF)
          </button>
          <div style={{ display:"flex", gap:10, width:"100%" }}>
            <a href="/create-shipment" className="sa-btn sa-primary" style={{ flex:1, gap:7 }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              New Shipment
            </a>
            <a href="/history" className="sa-btn sa-secondary" style={{ flex:1, gap:7 }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Shipment History
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function PaymentPage() {
  // ── Read URL params ──
  const params     = new URLSearchParams(window.location.search);
  const trackId    = params.get("trackId")   || "PO-20240325001";
  const totalRaw   = params.get("total")     || "฿85";
  const pkg        = params.get("pkg")       || "Parcel";
  const svc        = params.get("svc")       || "Standard";
  const from       = params.get("sprov")     || params.get("from") || "—";
  const to         = params.get("rprov")     || params.get("to")   || "—";
  const weight     = params.get("weight")    || "—";
  const sname      = params.get("sname")     || "—";
  const sphone     = params.get("sphone")    || "—";
  const saddr      = params.get("saddr")     || "—";
  const sprov      = params.get("sprov")     || "—";
  const szip       = params.get("szip")      || "—";
  const rname      = params.get("rname")     || "—";
  const rphone     = params.get("rphone")    || "—";
  const raddr      = params.get("raddr")     || "—";
  const rprov      = params.get("rprov")     || "—";
  const rzip       = params.get("rzip")      || "—";
  const contents   = params.get("contents")  || "—";
  const declval    = params.get("declval")   || "—";
  const insurance  = params.get("insurance") || "No";
  const handling   = params.get("handling")  || "None";
  const dims       = params.get("dims")      || "";
  const baseAmount = parseInt(totalRaw.replace(/[^0-9]/g,"")) || 85;

  // ── State ──
  const [method,   setMethod]   = useState("card");
  const [card,     setCard]     = useState({ num:"", name:"", expiry:"", cvv:"" });
  const [errors,   setErrors]   = useState({});
  const [coupon,   setCoupon]   = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg,setCouponMsg]= useState({ text:"", ok:true });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(null);

  const codExtra = method === "cod" ? 30 : 0;
  const total    = baseAmount - discount + codExtra;

  // ── Card input helpers ──
  function setCardField(k) {
    return (e) => {
      let v = e.target.value;
      if (k==="num")    v = fmtCardNum(v);
      if (k==="expiry") v = fmtExpiry(v);
      if (k==="name")   v = v.toUpperCase();
      setCard(p=>({...p,[k]:v}));
      setErrors(p=>({...p,[k]:""}));
    };
  }

  // ── Coupon ──
  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (code === "POST10") {
      setDiscount(Math.round(baseAmount * 0.1));
      setCouponMsg({ text:"✅ Promo code applied! 10% discount added.", ok:true });
    } else {
      setDiscount(0);
      setCouponMsg({ text:"❌ Invalid promo code.", ok:false });
    }
  }

  // ── Card validation ──
  function validateCard() {
    const errs = {};
    if (card.num.replace(/\s/g,"").length !== 16) errs.num    = "Please enter a valid card number.";
    if (card.name.trim().length < 2)              errs.name   = "Card holder name required.";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry))      errs.expiry = "Invalid expiry date.";
    if (card.cvv.length < 3)                       errs.cvv    = "CVV required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Process payment ──
  async function processPayment() {
    if (method === "card" && !validateCard()) return;
    setLoading(true);
    const payload = {
      userId: 1, trackId, total, pkg, svc,
      sname, sphone, saddr, sprov, szip,
      rname, rphone, raddr, rprov, rzip,
      weight, dims, contents, declval, insurance, handling,
      paymentMethod: METHOD_NAMES[method] || method,
      paymentRef: trackId + "-" + Date.now(),
    };
    try {
      const res  = await fetch(`${API_URL}/shipments`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Server error");
      setSuccess({
        trackId, amount: total,
        method: METHOD_NAMES[method] || method,
        date: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
      });
    } catch (err) {
      alert(`Payment could not be saved: ${err.message}\n\nPlease try again or contact support.`);
    } finally {
      setLoading(false);
    }
  }

  // ── Download PDF label ──
  function downloadShippingLabel() {
    if (!window.jspdf) { alert("PDF library not loaded. Add jsPDF to index.html."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:"mm", format:"a5", orientation:"portrait" });
    const W=148, H=210;
    const finalTotal = success?.amount || total;
    const finalMethod = success?.method || METHOD_NAMES[method];
    const finalDate   = success?.date   || new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
    const issuedTime  = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

    const box=(x,y,w,h,r,fill)=>{ doc.setFillColor(...fill); r?doc.roundedRect(x,y,w,h,r,r,"F"):doc.rect(x,y,w,h,"F"); };
    const txt=(text,x,y,opts={})=>doc.text(String(text||"—"),x,y,opts);

    // Header
    box(0,0,W,26,0,[192,57,43]); box(0,0,W,13,0,[210,80,60]);
    doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(255,255,255);
    txt("THAILAND POST",8,11);
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(255,210,210);
    txt("Official Shipping Label  -  Thailand Post Co., Ltd.",8,17);
    box(W-42,4,38,18,3,[255,255,255,0.15]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(255,255,255);
    txt(svc.toUpperCase(),W-40,11);
    doc.setFontSize(6); doc.setTextColor(255,200,200); txt(pkg.toUpperCase(),W-40,17);

    // Tracking ID
    box(6,29,W-12,22,3,[255,245,245]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(180,60,60);
    txt("TRACKING NUMBER",W/2,35,{align:"center"});
    doc.setFontSize(17); doc.setTextColor(192,57,43);
    txt(trackId,W/2,46,{align:"center"});

    // Barcode visual
    const barX=14,barY=53,barH=9,barW=W-28,bars=70,bw=barW/bars;
    const seed=trackId.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
    for(let i=0;i<bars;i++){
      const thick=((seed*(i+7))%5)<2;
      const w=thick?bw*1.6:bw*0.75;
      if(i%2===0){doc.setFillColor(20,20,40);doc.rect(barX+i*bw,barY,w,barH,"F");}
    }
    doc.setFont("helvetica","normal"); doc.setFontSize(6); doc.setTextColor(120,80,80);
    txt(trackId.replace("PO-","").split("").join("  "),W/2,barY+barH+3.5,{align:"center"});

    // FROM/TO
    const addrY=70,colW=(W-18)/2,colH=46;
    box(6,addrY,colW,colH,3,[253,245,245]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(192,57,43);
    txt("FROM",9,addrY+6);
    doc.setFontSize(8.5); doc.setTextColor(20,20,40);
    txt(sname.slice(0,22),9,addrY+12);
    doc.setFont("helvetica","normal"); doc.setFontSize(7.2); doc.setTextColor(80,50,50);
    txt(sphone,9,addrY+18);
    doc.setFontSize(7); txt(saddr.slice(0,28),9,addrY+23);
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(192,57,43);
    txt(`${sprov}  ${szip}`,9,addrY+32);

    const toX=6+colW+6;
    box(toX,addrY,colW,colH,3,[192,57,43]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,210,210);
    txt("TO",toX+3,addrY+6);
    doc.setFontSize(8.5); doc.setTextColor(255,255,255);
    txt(rname.slice(0,22),toX+3,addrY+12);
    doc.setFont("helvetica","normal"); doc.setFontSize(7.2); doc.setTextColor(255,220,220);
    txt(rphone,toX+3,addrY+18);
    doc.setFontSize(7); txt(raddr.slice(0,28),toX+3,addrY+23);
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(255,240,150);
    txt(`${rprov}  ${rzip}`,toX+3,addrY+32);

    // Parcel table
    const tableY=addrY+colH+6;
    box(6,tableY,W-12,7,0,[192,57,43]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,255,255);
    txt("PARCEL DETAILS",9,tableY+4.8);
    const rows=[["Package Type",pkg],["Service Level",svc],["Weight",weight],
      ["Contents",contents],["Declared Value",declval&&declval!=="—"?`THB ${declval}`:"—"],
      ["Insurance",insurance],["Special Handling",handling||"None"],
      ["Amount Paid",`THB ${finalTotal}`],["Payment Method",finalMethod]];
    let ry=tableY+7;
    rows.forEach(([k,v],i)=>{
      box(6,ry,W-12,7.5,0,i%2===0?[252,244,244]:[255,250,250]);
      doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(140,80,80);
      txt(k,10,ry+5);
      doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(20,20,40);
      txt(String(v||"—").slice(0,30),W-10,ry+5,{align:"right"});
      ry+=7.5;
    });
    doc.setDrawColor(220,180,180); doc.setLineWidth(0.3);
    doc.rect(6,tableY,W-12,7+rows.length*7.5);

    // Footer
    const footY=ry+4;
    box(6,footY,W-12,10,2,[255,245,245]);
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(140,100,100);
    txt(`Issued: ${finalDate}  ${issuedTime}`,10,footY+4);
    txt(`Ref: ${trackId}`,10,footY+8);
    doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(192,57,43);
    txt("Keep this label attached until delivered.",W-10,footY+4,{align:"right"});
    txt(`Thailand Post © ${new Date().getFullYear()}`,W-10,footY+8,{align:"right"});
    box(0,H-10,W,10,0,[192,57,43]);
    doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(255,255,255);
    txt("thailandpost.th  |  Call Center 1545  |  postoffice@post.th",W/2,H-4,{align:"center"});

    doc.save(`ShippingLabel_${trackId}.pdf`);
  }

  return (
    <>
      <style>{CSS}</style>

      <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
      <div className="deco d1"><svg viewBox="0 0 100 70"><rect width="100" height="70" rx="6"/><polyline points="0,0 50,38 100,0" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none"/></svg></div>
      <div className="deco d2"><svg viewBox="0 0 80 80"><rect x="5" y="20" width="70" height="50" rx="5"/><rect x="5" y="28" width="70" height="6"/><rect x="35" y="20" width="10" height="50"/></svg></div>
      <div className="deco d3"><svg viewBox="0 0 100 70"><rect width="100" height="70" rx="6"/><polyline points="0,0 50,38 100,0" stroke="rgba(0,0,0,0.15)" strokeWidth="2" fill="none"/></svg></div>

      <div className="page">

        {/* Topbar */}
        <div className="topbar">
          <a href="/create-shipment" className="back-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Edit Shipment
          </a>
          <div className="page-title">
            <h1>💳 Payment</h1>
            <p>Complete your shipment payment securely</p>
          </div>
          <div className="topbar-spacer"/>
        </div>

        {/* Steps */}
        <div className="step-progress">
          {[{n:"✓",l:"Shipment",cls:"done"},{n:"2",l:"Payment",cls:"active"},{n:"3",l:"Confirmation",cls:""}].map(({n,l,cls})=>(
            <div className={`sp-item${cls?" "+cls:""}`} key={l}>
              <div className="sp-circle">{n}</div>
              <div className="sp-label">{l}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="main-grid">

          {/* LEFT */}
          <div>

            {/* Shipment recap */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📦</div>
                <div><h3>Shipment Details</h3><p>Review before paying</p></div>
              </div>
              <div className="card-body">
                <div className="recap-strip">
                  {[["From",from,"accent"],["To",to,"accent"],["Package",pkg,""],
                    ["Service",svc,""],["Weight",weight,""],["Amount",totalRaw,"accent"]].map(([label,val,cls])=>(
                    <div className="recap-cell" key={label}>
                      <div className="rc-label">{label}</div>
                      <div className={`rc-val${cls?" "+cls:""}`}>{val}</div>
                    </div>
                  ))}
                </div>
                <div className="track-badge">
                  <span className="tb-label">Tracking</span>
                  <span className="tb-id">{trackId}</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="card" style={{ marginTop:18 }}>
              <div className="card-header">
                <div className="card-icon">💳</div>
                <div><h3>Payment Method</h3><p>Choose how you'd like to pay</p></div>
              </div>
              <div className="card-body">

                <div className="method-grid">
                  {METHODS.map(m=>(
                    <div key={m.id} className={`method-card${method===m.id?" selected":""}`} onClick={()=>setMethod(m.id)}>
                      <div className="mc-icon">{m.icon}</div>
                      <div className="mc-name">{m.name}</div>
                      <div className="mc-desc">{m.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Card panel */}
                {method==="card" && (
                  <div className="method-panel active">
                    <CardPreview num={card.num} name={card.name} expiry={card.expiry} />
                    <div className="sec-label">Card Details</div>
                    <div className="fields-grid">
                      <div className="field full">
                        <label>Card Number <span className="req">*</span></label>
                        <div className={`input-wrap${errors.num?" error":""}`}>
                          <span className="ii"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
                          <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={card.num} onChange={setCardField("num")} />
                        </div>
                        {errors.num && <div className="field-error show">{errors.num}</div>}
                      </div>
                      <div className="field full">
                        <label>Card Holder Name <span className="req">*</span></label>
                        <div className={`input-wrap${errors.name?" error":""}`}>
                          <span className="ii"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></span>
                          <input type="text" placeholder="SOMCHAI JAIDEE" value={card.name} onChange={setCardField("name")} style={{ textTransform:"uppercase" }} />
                        </div>
                        {errors.name && <div className="field-error show">{errors.name}</div>}
                      </div>
                      <div className="field">
                        <label>Expiry Date <span className="req">*</span></label>
                        <div className={`input-wrap${errors.expiry?" error":""}`}>
                          <span className="ii"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                          <input type="text" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={setCardField("expiry")} />
                        </div>
                        {errors.expiry && <div className="field-error show">{errors.expiry}</div>}
                      </div>
                      <div className="field">
                        <label>CVV / CVC <span className="req">*</span></label>
                        <div className={`input-wrap${errors.cvv?" error":""}`}>
                          <span className="ii"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
                          <input type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={setCardField("cvv")} />
                        </div>
                        {errors.cvv && <div className="field-error show">{errors.cvv}</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* PromptPay panel */}
                {method==="promptpay" && (
                  <div className="method-panel active">
                    <PromptPayPanel amount={total} trackId={trackId} active={method==="promptpay"} />
                  </div>
                )}

                {/* Bank Transfer panel */}
                {method==="transfer" && (
                  <div className="method-panel active">
                    <div className="bank-list">
                      {[{bg:"#1565c0",icon:"🏦",name:"Krungthai Bank (KTB)",acc:"123-4-56789-0"},
                        {bg:"#1b5e20",icon:"🌿",name:"Kasikorn Bank (KBANK)",acc:"098-7-65432-1"},
                        {bg:"#e65100",icon:"🔶",name:"SCB (Siam Commercial)",acc:"555-6-78901-2"}].map(b=>(
                        <div className="bank-row" key={b.name}>
                          <div className="bank-logo" style={{ background:b.bg }}>{b.icon}</div>
                          <div className="bank-info">
                            <strong>{b.name}</strong>
                            <span>Account: {b.acc} · Thai Post Office Co., Ltd.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:".76rem", color:"var(--muted)", marginTop:12, lineHeight:1.6 }}>
                      After transfer, please keep your slip and reference Tracking ID <strong style={{ color:"var(--accent)" }}>{trackId}</strong> in the remarks.
                    </p>
                  </div>
                )}

                {/* Cash panel */}
                {method==="cash" && (
                  <div className="method-panel active">
                    <div className="cash-info">
                      <div className="cash-icon">🏪</div>
                      <div>
                        <h4>Pay at any Post Office Counter</h4>
                        <p>Bring this tracking ID to any Thailand Post branch and pay at the counter. Your shipment will be processed after payment is confirmed.<br/><br/>Amount due: <strong>฿{total}</strong></p>
                      </div>
                    </div>
                  </div>
                )}

                {/* e-Wallet panel */}
                {method==="wallet" && (
                  <div className="method-panel active">
                    <div className="method-grid" style={{ marginTop:4 }}>
                      {[{icon:"💛",name:"TrueMoney",desc:"Scan or enter number"},
                        {icon:"🐰",name:"Rabbit LINE Pay",desc:"Scan with LINE app"},
                        {icon:"🍊",name:"ShopeePay",desc:"Pay via Shopee app"}].map(w=>(
                        <div className="method-card" style={{ cursor:"default" }} key={w.name}>
                          <div className="mc-icon">{w.icon}</div>
                          <div className="mc-name">{w.name}</div>
                          <div className="mc-desc">{w.desc}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:".76rem", color:"var(--muted)", marginTop:12 }}>Select your preferred wallet and follow the on-screen instructions to complete payment.</p>
                  </div>
                )}

                {/* COD panel */}
                {method==="cod" && (
                  <div className="method-panel active">
                    <div className="cash-info" style={{ background:"#f0f9ff", borderColor:"#bae6fd" }}>
                      <div className="cash-icon">📦</div>
                      <div>
                        <h4 style={{ color:"#0c4a6e" }}>Cash on Delivery (COD)</h4>
                        <p style={{ color:"#075985" }}>The receiver pays upon delivery. A COD surcharge of <strong>฿30</strong> has been added to the total. Ensure the receiver is aware of the amount to be collected.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Coupon */}
                <div style={{ marginTop:22 }}>
                  <div className="sec-label">Coupon / Promo Code</div>
                  <div className="coupon-row">
                    <div className="input-wrap coupon-input">
                      <span className="ii"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z"/></svg></span>
                      <input type="text" placeholder="Enter promo code (try POST10)" value={coupon} onChange={e=>setCoupon(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyCoupon()} />
                    </div>
                    <button type="button" className="apply-btn" onClick={applyCoupon}>Apply</button>
                  </div>
                  {couponMsg.text && (
                    <div className="coupon-success show" style={{ color: couponMsg.ok?"var(--success,#16a34a)":"var(--error)" }}>
                      {couponMsg.text}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT — order summary */}
          <div>
            <div className="order-card">
              <div className="order-header">
                <h3>Order Summary</h3>
                <p>Payment breakdown</p>
              </div>
              <div className="order-body">
                {[["Tracking ID",trackId,"accent"],["Package Type",pkg,""],["Service Level",svc,""],
                  ["Route",`${from} → ${to}`,""],["Shipping Fee",totalRaw,""]].map(([k,v,cls])=>(
                  <div className="o-row" key={k}>
                    <span className="o-key">{k}</span>
                    <span className={`o-val${cls?" "+cls:""}`} style={{ fontSize:k==="Route"?".78rem":"" }}>{v}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="o-row">
                    <span className="o-key">Discount (10%)</span>
                    <span className="o-val" style={{ color:"#16a34a" }}>-฿{discount}</span>
                  </div>
                )}
                {method==="cod" && (
                  <div className="o-row">
                    <span className="o-key">COD Surcharge</span>
                    <span className="o-val">฿30</span>
                  </div>
                )}
                <div className="o-divider"/>
                <div className="o-total">
                  <span className="tl">Total Due</span>
                  <span className="ta">฿{total}</span>
                </div>
              </div>

              <div className="secure-badge">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span>256-bit SSL encrypted · Secure payment</span>
              </div>

              <button type="button" className={`pay-btn${loading?" loading":""}`} onClick={processPayment} disabled={loading}>
                <span className="btn-txt">Pay ฿{total}</span>
                <svg className="btn-svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span className="spinner"/>
              </button>

              <div className="pay-methods-logos">
                {["VISA","MC","JCB","QR","COD"].map(l=><span key={l} className="pm-logo">{l}</span>)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {success && <SuccessOverlay data={success} onDownload={downloadShippingLabel} />}
    </>
  );
}

// ════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--accent:#E60012;--accent-dark:#8B0009;--accent-light:#FF6666;--bg:linear-gradient(135deg,#E60012 0%,#FFAAAA 100%);--card:rgba(255,255,255,0.97);--text:#1a1a2e;--muted:#6B5050;--input-bg:#FFF5F5;--input-border:#FFD0D0;--error:#e53935;}
body{min-height:100vh;background:var(--bg);font-family:'IBM Plex Sans',sans-serif;padding:36px 16px 72px;position:relative;overflow-x:hidden;}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0;}
.blob{position:fixed;border-radius:50%;filter:blur(72px);opacity:0.17;pointer-events:none;z-index:0;animation:blobFloat 10s ease-in-out infinite alternate;}
.b1{width:500px;height:500px;background:#E60012;top:-150px;left:-130px;}
.b2{width:380px;height:380px;background:#FF9999;bottom:-100px;right:-80px;animation-delay:4s;}
.b3{width:200px;height:200px;background:#FFB3B3;top:38%;left:62%;animation-delay:7s;}
@keyframes blobFloat{from{transform:translateY(0) scale(1);}to{transform:translateY(-30px) scale(1.05);}}
.deco{position:fixed;opacity:0.05;pointer-events:none;z-index:0;}.deco svg{fill:#fff;}
.d1{width:110px;top:8%;left:5%;animation:drift 12s ease-in-out infinite alternate;}
.d2{width:70px;bottom:12%;left:16%;animation:drift 9s ease-in-out infinite alternate;animation-delay:3s;}
.d3{width:90px;top:32%;right:5%;animation:drift 11s ease-in-out infinite alternate;animation-delay:5s;}
@keyframes drift{from{transform:translateY(0) rotate(0deg);}to{transform:translateY(-20px) rotate(6deg);}}
.page{position:relative;z-index:1;max-width:980px;margin:0 auto;}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;animation:fadeDown 0.5s ease both;}
.back-btn{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.22);border:none;color:#fff;font-family:'IBM Plex Sans',sans-serif;font-size:0.875rem;font-weight:500;padding:9px 18px;border-radius:50px;cursor:pointer;backdrop-filter:blur(8px);text-decoration:none;transition:background 0.2s;}
.back-btn:hover{background:rgba(255,255,255,0.35);}
.back-btn svg{width:15px;height:15px;}
.page-title{text-align:center;flex:1;}
.page-title h1{font-family:'Barlow',sans-serif;font-size:1.9rem;font-weight:700;color:#fff;text-shadow:0 2px 14px rgba(160,20,20,0.22);}
.page-title p{color:rgba(255,255,255,0.72);font-size:0.82rem;font-weight:300;margin-top:3px;}
.topbar-spacer{width:110px;}
.step-progress{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:28px;animation:fadeDown 0.5s ease both 0.1s;}
.sp-item{display:flex;flex-direction:column;align-items:center;position:relative;width:120px;}
.sp-item:not(:last-child)::after{content:'';position:absolute;top:14px;left:50%;width:120px;height:2px;background:rgba(255,255,255,0.3);z-index:0;}
.sp-item.done:not(:last-child)::after{background:rgba(255,255,255,0.7);}
.sp-circle{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:rgba(255,255,255,0.7);position:relative;z-index:1;backdrop-filter:blur(4px);transition:all 0.3s;}
.sp-item.done .sp-circle{background:rgba(255,255,255,0.9);color:var(--accent);border-color:#fff;}
.sp-item.active .sp-circle{background:#fff;color:var(--accent);border-color:#fff;box-shadow:0 0 0 4px rgba(255,255,255,0.25);}
.sp-label{font-size:0.68rem;color:rgba(255,255,255,0.65);margin-top:5px;font-weight:500;white-space:nowrap;}
.sp-item.active .sp-label,.sp-item.done .sp-label{color:#fff;font-weight:600;}
.main-grid{display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start;}
.card{background:var(--card);border-radius:20px;box-shadow:0 20px 60px rgba(140,30,30,0.16),0 2px 8px rgba(140,30,30,0.07);overflow:hidden;animation:fadeUp 0.55s ease both 0.15s;}
.card+.card{margin-top:18px;}
.card-header{padding:20px 26px 16px;border-bottom:1px solid #FFE0E0;display:flex;align-items:center;gap:12px;}
.card-icon{width:38px;height:38px;flex-shrink:0;background:linear-gradient(135deg,#FF6666,#E60012);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;box-shadow:0 4px 10px rgba(192,57,43,0.3);}
.card-header h3{font-family:'Barlow',sans-serif;font-size:1.02rem;font-weight:700;color:var(--text);}
.card-header p{font-size:0.74rem;color:var(--muted);margin-top:1px;}
.card-body{padding:22px 26px;}
.recap-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--input-border);border-radius:12px;overflow:hidden;margin-bottom:4px;}
.recap-cell{background:var(--input-bg);padding:12px 14px;}
.recap-cell .rc-label{font-size:0.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;font-weight:600;}
.recap-cell .rc-val{font-size:0.88rem;font-weight:600;color:var(--text);margin-top:3px;}
.recap-cell .rc-val.accent{color:var(--accent);}
.track-badge{display:inline-flex;align-items:center;gap:7px;background:#ffe0e0;border:1.5px solid #ebb8b8;border-radius:8px;padding:8px 14px;margin-top:14px;}
.track-badge .tb-label{font-size:0.7rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.6px;}
.track-badge .tb-id{font-size:0.92rem;font-weight:700;color:var(--accent);letter-spacing:1px;}
.method-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.method-card{border:2px solid var(--input-border);border-radius:14px;padding:16px 12px;text-align:center;cursor:pointer;background:var(--input-bg);transition:all 0.22s;user-select:none;}
.method-card:hover{border-color:var(--accent-light);background:#fff0f0;transform:translateY(-2px);}
.method-card.selected{border-color:var(--accent);background:#ffe0e0;box-shadow:0 0 0 3px rgba(192,57,43,0.12);transform:translateY(-2px);}
.method-card .mc-icon{font-size:1.8rem;margin-bottom:7px;}
.method-card .mc-name{font-size:0.8rem;font-weight:700;color:var(--text);}
.method-card .mc-desc{font-size:0.68rem;color:var(--muted);margin-top:3px;line-height:1.4;}
.method-card.selected .mc-name{color:var(--accent);}
.sec-label{font-size:0.7rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.sec-label::after{content:'';flex:1;height:1px;background:var(--input-border);}
.fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;}
.fields-grid .full{grid-column:1/-1;}
.field{display:flex;flex-direction:column;}
.field label{font-size:0.77rem;font-weight:600;color:var(--text);margin-bottom:6px;letter-spacing:0.3px;}
.field label .req,.req{color:var(--accent);margin-left:2px;}
.input-wrap{display:flex;align-items:center;background:var(--input-bg);border:1.5px solid var(--input-border);border-radius:10px;padding:0 13px;transition:border-color 0.2s,box-shadow 0.2s;}
.input-wrap:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(192,57,43,0.1);}
.input-wrap.error{border-color:var(--error);}
.ii{color:#d4a0a0;display:flex;align-items:center;margin-right:9px;flex-shrink:0;}
.ii svg{width:15px;height:15px;}
.input-wrap input,.input-wrap select{border:none;background:transparent;outline:none;flex:1;padding:11px 0;font-family:'IBM Plex Sans',sans-serif;font-size:0.86rem;color:var(--text);}
.input-wrap input::placeholder{color:#d4aaaa;}
.field-error{font-size:0.72rem;color:var(--error);margin-top:4px;display:none;}
.field-error.show{display:block;}
.card-number-display{background:linear-gradient(135deg,#B8000E,#E60012);border-radius:14px;padding:22px 24px;margin-bottom:18px;position:relative;overflow:hidden;}
.card-number-display::before{content:'';position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.08);top:-60px;right:-40px;}
.card-number-display::after{content:'';position:absolute;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,0.06);bottom:-50px;left:20px;}
.cnd-chip{width:32px;height:24px;background:linear-gradient(135deg,#e8c97a,#c9a84c);border-radius:5px;margin-bottom:20px;position:relative;z-index:1;}
.cnd-num{font-family:'IBM Plex Sans',sans-serif;font-size:1.1rem;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:3px;position:relative;z-index:1;margin-bottom:14px;}
.cnd-bottom{display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:1;}
.cnd-label{font-size:0.62rem;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.8px;}
.cnd-value{font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.9);margin-top:2px;}
.cnd-brand{font-size:1.4rem;}
.qr-panel{text-align:center;padding:20px 0 10px;}
.bank-list{display:flex;flex-direction:column;gap:10px;}
.bank-row{display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--input-bg);border:1.5px solid var(--input-border);border-radius:10px;}
.bank-logo{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
.bank-info strong{display:block;font-size:0.84rem;font-weight:600;color:var(--text);}
.bank-info span{font-size:0.76rem;color:var(--muted);}
.cash-info{background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:18px 20px;display:flex;gap:14px;align-items:flex-start;}
.cash-icon{font-size:1.8rem;flex-shrink:0;}
.cash-info h4{font-size:0.88rem;font-weight:700;color:#92400e;margin-bottom:4px;}
.cash-info p{font-size:0.8rem;color:#78350f;line-height:1.6;}
.method-panel{display:none;margin-top:20px;}
.method-panel.active{display:block;animation:panelIn 0.3s ease both;}
@keyframes panelIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.coupon-row{display:flex;gap:10px;margin-top:4px;}
.coupon-input{flex:1;}
.apply-btn{background:var(--input-bg);border:1.5px solid var(--input-border);border-radius:10px;padding:0 18px;font-family:'IBM Plex Sans',sans-serif;font-size:0.82rem;font-weight:600;color:var(--accent);cursor:pointer;transition:all 0.15s;white-space:nowrap;}
.apply-btn:hover{background:#ffe0e0;border-color:var(--accent);}
.coupon-success{display:none;font-size:0.76rem;margin-top:5px;font-weight:600;}
.coupon-success.show{display:block;}
.order-card{background:var(--card);border-radius:20px;box-shadow:0 20px 60px rgba(140,30,30,0.16),0 2px 8px rgba(140,30,30,0.07);overflow:hidden;position:sticky;top:24px;animation:fadeUp 0.55s ease both 0.2s;}
.order-header{background:linear-gradient(135deg,#B8000E,#E60012);padding:20px 24px;position:relative;overflow:hidden;}
.order-header::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,255,255,0.13) 0%,transparent 60%);}
.order-header h3{font-family:'Barlow',sans-serif;font-size:1rem;font-weight:700;color:#fff;position:relative;z-index:1;}
.order-header p{font-size:0.72rem;color:rgba(255,255,255,0.65);margin-top:2px;position:relative;z-index:1;}
.order-body{padding:18px 22px;}
.o-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid #fff4f4;font-size:0.82rem;}
.o-row:last-of-type{border-bottom:none;}
.o-key{color:var(--muted);}
.o-val{font-weight:600;color:var(--text);text-align:right;}
.o-val.accent{color:var(--accent);}
.o-divider{height:1px;background:var(--input-border);margin:10px 0;}
.o-total{display:flex;justify-content:space-between;align-items:center;padding:10px 0 4px;}
.o-total .tl{font-family:'Barlow',sans-serif;font-size:0.95rem;font-weight:700;color:var(--text);}
.o-total .ta{font-family:'Barlow',sans-serif;font-size:1.5rem;font-weight:700;color:var(--accent);}
.secure-badge{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:14px 22px 0;}
.secure-badge svg{color:#16a34a;width:14px;height:14px;flex-shrink:0;}
.secure-badge span{font-size:0.72rem;color:#15803d;font-weight:500;}
.pay-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:calc(100% - 44px);margin:14px 22px 20px;padding:13px;background:linear-gradient(135deg,#E60012,#B8000E);color:#fff;border:none;border-radius:11px;font-family:'Barlow',sans-serif;font-size:1rem;font-weight:500;cursor:pointer;transition:transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 18px rgba(192,57,43,0.35);position:relative;overflow:hidden;}
.pay-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.14),transparent);pointer-events:none;}
.pay-btn:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(192,57,43,0.42);}
.pay-btn:active{transform:translateY(0);}
.pay-btn.loading{opacity:0.75;pointer-events:none;}
.pay-btn .spinner{display:none;width:18px;height:18px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;}
.pay-btn.loading .btn-txt,.pay-btn.loading .btn-svg{display:none;}
.pay-btn.loading .spinner{display:block;}
@keyframes spin{to{transform:rotate(360deg);}}
.pay-methods-logos{display:flex;align-items:center;justify-content:center;gap:8px;padding:0 22px 18px;}
.pm-logo{background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:4px 10px;font-size:0.72rem;font-weight:700;color:var(--muted);}
.success-overlay{display:none;position:fixed;inset:0;z-index:100;background:rgba(160,20,20,0.45);backdrop-filter:blur(8px);align-items:center;justify-content:center;animation:fadeIn 0.3s ease both;}
.success-overlay.show{display:flex;}
.success-box{background:#fff;border-radius:24px;padding:44px 40px;text-align:center;max-width:400px;width:92%;box-shadow:0 32px 80px rgba(130,20,20,0.28);animation:popUp 0.45s cubic-bezier(.22,.68,0,1.2) both;}
.s-icon{font-size:3.8rem;display:block;margin-bottom:12px;animation:bounce 0.6s cubic-bezier(.22,.68,0,1.4) both 0.1s;}
.success-box h2{font-family:'Barlow',sans-serif;font-size:1.5rem;color:var(--text);margin-bottom:6px;}
.success-box p{font-size:0.84rem;color:var(--muted);line-height:1.65;}
.receipt-strip{margin:20px 0 0;background:var(--input-bg);border-radius:14px;padding:16px 20px;text-align:left;}
.rs-row{display:flex;justify-content:space-between;padding:6px 0;font-size:0.8rem;border-bottom:1px solid var(--input-border);}
.rs-row:last-child{border-bottom:none;}
.rs-key{color:var(--muted);}
.rs-val{font-weight:600;color:var(--text);}
.rs-val.accent{color:var(--accent);}
.success-actions{display:flex;gap:10px;margin-top:22px;}
.sa-btn{flex:1;padding:11px;border-radius:10px;font-family:'IBM Plex Sans',sans-serif;font-size:0.84rem;font-weight:600;cursor:pointer;transition:all 0.15s;border:none;text-decoration:none;display:flex;align-items:center;justify-content:center;}
.sa-primary{background:linear-gradient(135deg,#E60012,#B8000E);color:#fff;box-shadow:0 4px 14px rgba(192,57,43,0.3);}
.sa-primary:hover{transform:translateY(-1px);}
.sa-secondary{background:var(--input-bg);color:var(--accent);border:2px solid var(--input-border)!important;}
.sa-secondary:hover{border-color:var(--accent)!important;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes popUp{from{opacity:0;transform:scale(0.88) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
@keyframes bounce{0%{transform:scale(0.4);}60%{transform:scale(1.15);}100%{transform:scale(1);}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:760px){.main-grid{grid-template-columns:1fr;}.order-card{position:static;}.method-grid{grid-template-columns:repeat(2,1fr);}.recap-strip{grid-template-columns:1fr 1fr;}.fields-grid{grid-template-columns:1fr;}.fields-grid .full{grid-column:1;}.page-title h1{font-size:1.4rem;}.sp-item:not(:last-child)::after{width:70px;}}
`;
