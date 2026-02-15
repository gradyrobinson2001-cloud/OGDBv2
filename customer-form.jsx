import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// DUST BUNNIES CLEANING — Customer Info Form (Standalone)
// Customers access this via a link. No pricing shown.
// ═══════════════════════════════════════════════════════════════

const SERVICED_AREAS = [
  "Twin Waters", "Maroochydore", "Kuluin", "Forest Glen", "Mons",
  "Buderim", "Alexandra Headland", "Mooloolaba", "Mountain Creek", "Minyama"
];

const T = {
  bg: "#F0F7F4", card: "#FFFFFF", primary: "#4A9E7E", primaryLight: "#E8F5EE", primaryDark: "#2D7A5E",
  blue: "#5B9EC4", blueLight: "#E6F0F7", accent: "#E8C86A", accentLight: "#FFF8E7",
  text: "#2C3E36", textMuted: "#7A8F85", textLight: "#A3B5AD", border: "#E2EBE6", borderLight: "#EDF3EF",
  danger: "#D4645C", dangerLight: "#FDF0EF", sidebar: "#1B3A2D",
  shadow: "0 2px 8px rgba(27,58,45,0.06)", shadowLg: "0 12px 40px rgba(27,58,45,0.1)",
  radius: 12, radiusSm: 8, radiusLg: 16, font: "'Nunito', sans-serif",
};

export default function CustomerForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [areaError, setAreaError] = useState(false);
  const [fd, setFd] = useState({
    name: "", email: "", phone: "", suburb: "",
    bedrooms: 1, bathrooms: 1, living: 1, kitchen: 1,
    frequency: "fortnightly",
    oven: false, sheets: false, windows: false, windowCount: 0, organising: false,
    notes: ""
  });
  const u = (k, v) => setFd({ ...fd, [k]: v });

  const checkArea = (suburb) => {
    u("suburb", suburb);
    setAreaError(suburb && !SERVICED_AREAS.includes(suburb));
  };

  const RoomCounter = ({ k, label, icon }) => (
    <div style={{ background: "#fff", borderRadius: T.radiusSm, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${T.borderLight}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => u(k, Math.max(0, fd[k] - 1))}
          style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${T.border}`, background: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 600, color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>−</button>
        <span style={{ width: 28, textAlign: "center", fontWeight: 800, fontSize: 18, color: T.text }}>{fd[k]}</span>
        <button onClick={() => u(k, fd[k] + 1)}
          style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${T.primary}`, background: T.primaryLight, cursor: "pointer", fontSize: 18, fontWeight: 600, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>+</button>
      </div>
    </div>
  );

  const AddonToggle = ({ k, label, icon, subtitle }) => (
    <button onClick={() => u(k, !fd[k])}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: T.radiusSm, cursor: "pointer", fontFamily: T.font, width: "100%", textAlign: "left",
        border: fd[k] ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`,
        background: fd[k] ? T.primaryLight : "#fff", transition: "all 0.15s",
      }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{label}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{
        width: 24, height: 24, borderRadius: 7, border: fd[k] ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`,
        background: fd[k] ? T.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
      }}>
        {fd[k] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
    </button>
  );

  // ─── Success Screen ─────────────────────────────────────
  if (submitted) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
            <div style={{ background: "#fff", borderRadius: T.radiusLg, padding: "48px 40px", boxShadow: T.shadowLg }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.4s ease" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: T.text }}>You're all set! 🌿</h2>
              <p style={{ margin: "0 0 24px", fontSize: 15, color: T.textMuted, lineHeight: 1.7 }}>
                Thanks so much, {fd.name.split(" ")[0] || "lovely"}! We've got your details and we'll have a personalised quote over to you really soon.
              </p>
              <div style={{ background: T.primaryLight, borderRadius: T.radius, padding: "18px 24px", textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.primaryDark, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Your Details</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 2 }}>
                  📍 {fd.suburb}<br/>
                  🛏️ {fd.bedrooms} bed · 🚿 {fd.bathrooms} bath · 🛋️ {fd.living} living · 🍳 {fd.kitchen} kitchen<br/>
                  📅 {fd.frequency.charAt(0).toUpperCase() + fd.frequency.slice(1)} clean
                  {fd.frequency === "weekly" && <span style={{ color: T.primary, fontWeight: 700 }}> (10% discount!)</span>}
                  {(fd.oven || fd.sheets || fd.windows || fd.organising) && (
                    <><br/>✨ Add-ons: {[fd.oven && "Oven", fd.sheets && "Sheets", fd.windows && `Windows (${fd.windowCount})`, fd.organising && "Organising"].filter(Boolean).join(", ")}</>
                  )}
                </div>
              </div>
              <p style={{ margin: "24px 0 0", fontSize: 13, color: T.textLight }}>Keep an eye on your inbox — we'll be in touch! 💚</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
      </>
    );
  }

  // ─── Out of Area Screen ─────────────────────────────────
  if (areaError && fd.suburb) {
    // Show inline — don't block form, just show message
  }

  const canProceedStep1 = fd.name && fd.email && fd.suburb && !areaError;
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24, marginTop: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🌿</div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900, color: T.text, letterSpacing: -0.3 }}>Dust Bunnies Cleaning</h1>
          <p style={{ margin: 0, fontSize: 14, color: T.textMuted }}>Eco-conscious cleaning on the Sunshine Coast</p>
        </div>

        {/* Progress Bar */}
        <div style={{ maxWidth: 520, width: "100%", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            {["Your Details", "Your Home", "Extras & Submit"].map((s, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: step > i ? T.primary : T.textLight, textTransform: "uppercase", letterSpacing: 0.6 }}>
                {s}
              </span>
            ))}
          </div>
          <div style={{ height: 6, background: T.borderLight, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${T.primary}, ${T.blue})`, borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Form Card */}
        <div style={{ maxWidth: 520, width: "100%", background: "#fff", borderRadius: T.radiusLg, boxShadow: T.shadowLg, overflow: "hidden" }}>

          {/* ─── Step 1: Contact Details ─── */}
          {step === 1 && (
            <div style={{ padding: "32px 32px 28px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: T.text }}>Let's start with you 👋</h2>
              <p style={{ margin: "0 0 24px", fontSize: 13, color: T.textMuted }}>So we know who to send your quote to</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Your Name *</label>
                  <input value={fd.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Sarah Mitchell"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 15, fontFamily: T.font, color: T.text, boxSizing: "border-box", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Email *</label>
                  <input type="email" value={fd.email} onChange={e => u("email", e.target.value)} placeholder="sarah@email.com"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 15, fontFamily: T.font, color: T.text, boxSizing: "border-box", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Phone (optional)</label>
                  <input type="tel" value={fd.phone} onChange={e => u("phone", e.target.value)} placeholder="04XX XXX XXX"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 15, fontFamily: T.font, color: T.text, boxSizing: "border-box", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Your Suburb *</label>
                  <select value={fd.suburb} onChange={e => checkArea(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: T.radiusSm, border: `1.5px solid ${areaError ? T.danger : T.border}`, fontSize: 15, fontFamily: T.font, color: fd.suburb ? T.text : T.textLight, background: "#fff", boxSizing: "border-box" }}>
                    <option value="">Select your suburb...</option>
                    {SERVICED_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    <option value="__other">My suburb isn't listed</option>
                  </select>

                  {(areaError || fd.suburb === "__other") && (
                    <div style={{ marginTop: 10, background: T.dangerLight, borderRadius: T.radiusSm, padding: "14px 16px", borderLeft: `3px solid ${T.danger}` }}>
                      <p style={{ margin: 0, fontSize: 13, color: T.danger, lineHeight: 1.6, fontWeight: 600 }}>
                        We're so sorry! 😔 We currently only service the Maroochydore corridor area. We're growing though, so please check back soon — and thanks for considering us! 💚
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2: Home Details ─── */}
          {step === 2 && (
            <div style={{ padding: "32px 32px 28px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: T.text }}>Tell us about your home 🏡</h2>
              <p style={{ margin: "0 0 24px", fontSize: 13, color: T.textMuted }}>So we can tailor your clean perfectly</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <RoomCounter k="bedrooms" label="Bedrooms" icon="🛏️" />
                <RoomCounter k="bathrooms" label="Bathrooms" icon="🚿" />
                <RoomCounter k="living" label="Living Rooms" icon="🛋️" />
                <RoomCounter k="kitchen" label="Kitchens" icon="🍳" />
              </div>

              <div style={{ marginTop: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 10 }}>How often would you like us? 📅</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { id: "weekly", label: "Weekly", badge: "Best value!" },
                    { id: "fortnightly", label: "Fortnightly", badge: "Most popular" },
                    { id: "monthly", label: "Monthly", badge: null },
                  ].map(f => (
                    <button key={f.id} onClick={() => u("frequency", f.id)}
                      style={{
                        flex: 1, padding: "16px 10px", borderRadius: T.radius, cursor: "pointer", fontFamily: T.font, textAlign: "center",
                        border: fd.frequency === f.id ? `2.5px solid ${T.primary}` : `1.5px solid ${T.border}`,
                        background: fd.frequency === f.id ? T.primaryLight : "#fff",
                        transition: "all 0.15s",
                      }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: fd.frequency === f.id ? T.primaryDark : T.text }}>{f.label}</div>
                      {f.id === "weekly" && (
                        <div style={{ marginTop: 6, background: T.accent, color: T.sidebar, padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 800, display: "inline-block" }}>
                          🎉 SAVE 10%
                        </div>
                      )}
                      {f.badge && f.id !== "weekly" && (
                        <div style={{ marginTop: 6, fontSize: 10, color: T.textMuted, fontWeight: 600 }}>{f.badge}</div>
                      )}
                    </button>
                  ))}
                </div>
                {fd.frequency === "weekly" && (
                  <div style={{ marginTop: 10, background: T.accentLight, borderRadius: T.radiusSm, padding: "10px 14px", textAlign: "center" }}>
                    <span style={{ fontSize: 13, color: "#8B6914", fontWeight: 700 }}>✨ Great choice! You'll save 10% on every clean with a weekly booking.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Step 3: Add-ons & Submit ─── */}
          {step === 3 && (
            <div style={{ padding: "32px 32px 28px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: T.text }}>Anything extra? ✨</h2>
              <p style={{ margin: "0 0 24px", fontSize: 13, color: T.textMuted }}>These are totally optional — just tick what you'd like included</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                <AddonToggle k="oven" label="Oven Clean" icon="♨️" subtitle="Deep clean of your oven inside and out" />
                <AddonToggle k="sheets" label="Sheet Changes" icon="🛏️" subtitle="Fresh sheets put on for you" />
                <AddonToggle k="organising" label="Organising" icon="📦" subtitle="Tidy and organise an area of your home" />

                {/* Windows with count */}
                <div style={{
                  borderRadius: T.radiusSm, overflow: "hidden",
                  border: fd.windows ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`,
                  background: fd.windows ? T.primaryLight : "#fff", transition: "all 0.15s",
                }}>
                  <button onClick={() => u("windows", !fd.windows)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: T.font, textAlign: "left" }}>
                    <span style={{ fontSize: 22 }}>🪟</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Window Cleaning</div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>Sparkling clean windows inside and out</div>
                    </div>
                    <div style={{
                      width: 24, height: 24, borderRadius: 7, border: fd.windows ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`,
                      background: fd.windows ? T.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {fd.windows && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </button>
                  {fd.windows && (
                    <div style={{ padding: "0 18px 16px", display: "flex", alignItems: "center", gap: 12, marginLeft: 36 }}>
                      <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 600 }}>How many windows?</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => u("windowCount", Math.max(1, fd.windowCount - 1))} style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${T.border}`, background: "#fff", cursor: "pointer", fontSize: 16, color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <span style={{ width: 28, textAlign: "center", fontWeight: 800, fontSize: 16, color: T.text }}>{fd.windowCount}</span>
                        <button onClick={() => u("windowCount", fd.windowCount + 1)} style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${T.primary}`, background: T.primaryLight, cursor: "pointer", fontSize: 16, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Anything else we should know?</label>
                <textarea value={fd.notes} onChange={e => u("notes", e.target.value)} rows={3} placeholder="e.g. We have 2 dogs, please close the front gate..."
                  style={{ width: "100%", padding: "12px 16px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.text, resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
              </div>

              {/* Summary */}
              <div style={{ marginTop: 24, background: T.bg, borderRadius: T.radius, padding: "18px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.primaryDark, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Quick Summary</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 2 }}>
                  <strong>{fd.name}</strong> · {fd.suburb}<br/>
                  🛏️ {fd.bedrooms} bed · 🚿 {fd.bathrooms} bath · 🛋️ {fd.living} living · 🍳 {fd.kitchen} kitchen<br/>
                  📅 {fd.frequency.charAt(0).toUpperCase() + fd.frequency.slice(1)}
                  {fd.frequency === "weekly" && <span style={{ color: T.primary, fontWeight: 700 }}> (10% off!)</span>}
                  {(fd.oven || fd.sheets || fd.windows || fd.organising) && (
                    <><br/>✨ {[fd.oven && "Oven clean", fd.sheets && "Sheet changes", fd.windows && `Windows (${fd.windowCount})`, fd.organising && "Organising"].filter(Boolean).join(" · ")}</>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── Navigation Buttons ─── */}
          <div style={{ padding: "0 32px 28px", display: "flex", gap: 10, justifyContent: "space-between" }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)}
                style={{ padding: "13px 24px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, background: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: T.font, color: T.textMuted }}>
                ← Back
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button onClick={() => canProceedStep1 && setStep(step + 1)} disabled={step === 1 && !canProceedStep1}
                style={{
                  padding: "13px 28px", borderRadius: T.radius, border: "none", fontSize: 14, fontWeight: 700, cursor: (step === 1 && !canProceedStep1) ? "not-allowed" : "pointer", fontFamily: T.font,
                  background: (step === 1 && !canProceedStep1) ? T.border : T.primary, color: (step === 1 && !canProceedStep1) ? T.textLight : "#fff",
                  transition: "all 0.15s",
                }}>
                Next →
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)}
                style={{
                  padding: "13px 28px", borderRadius: T.radius, border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: T.font,
                  background: `linear-gradient(135deg, ${T.primary}, ${T.blue})`, color: "#fff",
                  boxShadow: `0 4px 16px rgba(74,158,126,0.3)`, transition: "all 0.15s",
                }}>
                Submit & Get My Quote 🌿
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: T.textLight }}>
            🌿 Eco-conscious · ♻️ Sustainable products · 💚 Sunshine Coast local
          </p>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; }
        select:focus, input:focus, textarea:focus { border-color: ${T.primary} !important; outline: none; }
        button:hover:not(:disabled) { opacity: 0.92; }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </>
  );
}
