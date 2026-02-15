import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// DUST BUNNIES CLEANING — Admin Dashboard
// ═══════════════════════════════════════════════════════════════

const SERVICED_AREAS = [
  "Twin Waters", "Maroochydore", "Kuluin", "Forest Glen", "Mons",
  "Buderim", "Alexandra Headland", "Mooloolaba", "Mountain Creek", "Minyama"
];

const WEEKLY_DISCOUNT = 0.10;

const INITIAL_PRICING = [
  { id: "bedroom", label: "Bedroom", price: 25, unit: "per room", icon: "🛏️", category: "rooms" },
  { id: "bathroom", label: "Bathroom", price: 35, unit: "per room", icon: "🚿", category: "rooms" },
  { id: "living", label: "Living Room", price: 25, unit: "per room", icon: "🛋️", category: "rooms" },
  { id: "kitchen", label: "Kitchen", price: 50, unit: "per room", icon: "🍳", category: "rooms" },
  { id: "oven", label: "Oven Clean", price: 65, unit: "per clean", icon: "♨️", category: "addon" },
  { id: "sheets", label: "Sheet Changes", price: 10, unit: "per change", icon: "🛏️", category: "addon" },
  { id: "windows", label: "Window Cleaning", price: 5, unit: "per window", icon: "🪟", category: "addon" },
  { id: "organising", label: "Organising", price: 60, unit: "per area", icon: "📦", category: "addon" },
];

const INITIAL_ENQUIRIES = [
  {
    id: 1, name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "0412 345 678",
    channel: "email", suburb: "Buderim", date: "2026-02-14T09:15:00", status: "quote_ready",
    message: "Hi there! I've got a 3 bedroom, 2 bathroom home in Buderim and I'm looking for a fortnightly clean. We also have a pretty grubby oven that could use some love! Can you send me a quote?",
    extracted: { bedrooms: 3, bathrooms: 2, living: 1, kitchen: 1, frequency: "fortnightly", addons: { oven: 1 } },
    aiSummary: "Sarah has a 3-bed, 2-bath home in Buderim. Wants fortnightly cleaning + oven clean. Full details extracted — quote auto-generated and ready for your review.",
    autoReplyStatus: "sent",
  },
  {
    id: 2, name: "James Chen", email: "jchen@email.com", phone: "0423 456 789",
    channel: "messenger", suburb: "Mooloolaba", date: "2026-02-13T16:42:00", status: "info_requested",
    message: "Hey! We just moved into a place in Mooloolaba and need a regular cleaner. It's a 4 bedroom house. Can you help?",
    extracted: { bedrooms: 4, bathrooms: null, living: null, kitchen: 1, frequency: null, addons: {} },
    aiSummary: "James has a 4-bed home in Mooloolaba, needs regular cleaning. Missing: bathroom count, living rooms, and preferred frequency. Customer info form sent — waiting for response.",
    autoReplyStatus: "form_sent",
  },
  {
    id: 3, name: "Priya Sharma", email: "priya.s@email.com", phone: "0434 567 890",
    channel: "instagram", suburb: "Maroochydore", date: "2026-02-13T11:20:00", status: "quote_sent",
    message: "Hi! Love your page 🌿 I'd like a weekly clean for my 2 bed, 1 bath apartment in Maroochydore. Just the basics plus window cleaning (6 windows). Thanks!",
    extracted: { bedrooms: 2, bathrooms: 1, living: 1, kitchen: 1, frequency: "weekly", addons: { windows: 6 } },
    aiSummary: "Priya wants weekly cleaning for a 2-bed, 1-bath apartment in Maroochydore with 6 windows. 10% weekly discount applied. Quote sent and awaiting response.",
    autoReplyStatus: "sent",
  },
  {
    id: 4, name: "Tom Bradley", email: "tom.b@email.com", phone: "0445 678 901",
    channel: "email", suburb: "Caloundra", date: "2026-02-12T20:05:00", status: "out_of_area",
    message: "G'day, we're in Caloundra and looking for a fortnightly house clean. 4 bed, 2 bath. Let me know your rates!",
    extracted: {},
    aiSummary: "Tom is in Caloundra — outside our service area. Polite decline auto-sent explaining we currently service the Maroochydore corridor only.",
    autoReplyStatus: "declined_area",
  },
  {
    id: 5, name: "Lena Kowalski", email: "lena.k@email.com", phone: "0456 789 012",
    channel: "messenger", suburb: "Mountain Creek", date: "2026-02-12T14:30:00", status: "accepted",
    message: "Hi! I need a fortnightly clean for my 3 bed, 2 bath, 2 living area home in Mountain Creek. Would also love the oven and fridge done. And maybe organising for 2 areas?",
    extracted: { bedrooms: 3, bathrooms: 2, living: 2, kitchen: 1, frequency: "fortnightly", addons: { oven: 1, organising: 2 } },
    aiSummary: "Lena accepted the quote! 3-bed, 2-bath, 2 living areas in Mountain Creek. Fortnightly with oven clean + 2x organising. Total: $335.00. Ready to schedule first clean.",
    autoReplyStatus: "sent",
  },
  {
    id: 6, name: "Emma Wallace", email: "emma.w@email.com", phone: "0467 890 123",
    channel: "email", suburb: "Twin Waters", date: "2026-02-14T11:30:00", status: "new",
    message: "Hello, I found you on Google. I'm interested in getting my house cleaned. I'm in Twin Waters. Can you give me some pricing info?",
    extracted: { bedrooms: null, bathrooms: null, living: null, kitchen: null, frequency: null, addons: {} },
    aiSummary: "New enquiry from Emma in Twin Waters. No property details provided yet. Acknowledgment being sent with info request form.",
    autoReplyStatus: "pending",
  },
];

const INITIAL_QUOTES = [
  {
    id: 1, enquiryId: 1, name: "Sarah Mitchell", suburb: "Buderim", channel: "email",
    frequency: "fortnightly", discount: 0,
    items: [
      { label: "Bedroom", qty: 3, unitPrice: 25, total: 75 },
      { label: "Bathroom", qty: 2, unitPrice: 35, total: 70 },
      { label: "Living Room", qty: 1, unitPrice: 25, total: 25 },
      { label: "Kitchen", qty: 1, unitPrice: 50, total: 50 },
      { label: "Oven Clean", qty: 1, unitPrice: 65, total: 65 },
    ],
    subtotal: 285, discountAmount: 0, total: 285,
    status: "pending_approval", date: "2026-02-14T09:20:00",
  },
  {
    id: 2, enquiryId: 3, name: "Priya Sharma", suburb: "Maroochydore", channel: "instagram",
    frequency: "weekly", discount: 0.10,
    items: [
      { label: "Bedroom", qty: 2, unitPrice: 25, total: 50 },
      { label: "Bathroom", qty: 1, unitPrice: 35, total: 35 },
      { label: "Living Room", qty: 1, unitPrice: 25, total: 25 },
      { label: "Kitchen", qty: 1, unitPrice: 50, total: 50 },
      { label: "Window Cleaning", qty: 6, unitPrice: 5, total: 30 },
    ],
    subtotal: 190, discountAmount: 19, total: 171,
    status: "sent", date: "2026-02-13T11:30:00",
  },
  {
    id: 3, enquiryId: 5, name: "Lena Kowalski", suburb: "Mountain Creek", channel: "messenger",
    frequency: "fortnightly", discount: 0,
    items: [
      { label: "Bedroom", qty: 3, unitPrice: 25, total: 75 },
      { label: "Bathroom", qty: 2, unitPrice: 35, total: 70 },
      { label: "Living Room", qty: 2, unitPrice: 25, total: 50 },
      { label: "Kitchen", qty: 1, unitPrice: 50, total: 50 },
      { label: "Oven Clean", qty: 1, unitPrice: 65, total: 65 },
      { label: "Organising", qty: 2, unitPrice: 60, total: 120 },
    ],
    subtotal: 430, discountAmount: 0, total: 430,
    status: "accepted", date: "2026-02-12T15:00:00",
  },
];

// ─── Theme ────────────────────────────────────────────────────
const T = {
  bg: "#F4F8F6", card: "#FFFFFF", sidebar: "#1B3A2D", sidebarHover: "#26503E", sidebarActive: "#347A5E",
  primary: "#4A9E7E", primaryLight: "#E8F5EE", primaryDark: "#2D7A5E",
  blue: "#5B9EC4", blueLight: "#E6F0F7", blueDark: "#3A7CA5",
  accent: "#E8C86A", accentLight: "#FFF8E7",
  text: "#2C3E36", textMuted: "#7A8F85", textLight: "#A3B5AD",
  border: "#E2EBE6", borderLight: "#EDF3EF",
  danger: "#D4645C", dangerLight: "#FDF0EF",
  orange: "#D4895C", orangeLight: "#FDF3EF",
  success: "#4A9E7E", successLight: "#E8F5EE",
  shadow: "0 1px 4px rgba(27,58,45,0.06)", shadowMd: "0 4px 16px rgba(27,58,45,0.08)", shadowLg: "0 12px 40px rgba(27,58,45,0.12)",
  radius: 12, radiusSm: 8, radiusLg: 16, font: "'Nunito', sans-serif",
};

// ─── Icons ────────────────────────────────────────────────────
const SVG = ({ children, size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{children}</svg>
);
const Icons = {
  inbox: (s) => <SVG size={s}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></SVG>,
  quote: (s) => <SVG size={s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></SVG>,
  price: (s) => <SVG size={s}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></SVG>,
  form: (s) => <SVG size={s}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></SVG>,
  check: (s) => <SVG size={s}><polyline points="20 6 9 17 4 12"/></SVG>,
  x: (s) => <SVG size={s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></SVG>,
  edit: (s) => <SVG size={s}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></SVG>,
  send: (s) => <SVG size={s}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></SVG>,
  plus: (s) => <SVG size={s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></SVG>,
  trash: (s) => <SVG size={s}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></SVG>,
  user: (s) => <SVG size={s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></SVG>,
  zap: (s) => <SVG size={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SVG>,
  clock: (s) => <SVG size={s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></SVG>,
  eye: (s) => <SVG size={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></SVG>,
  map: (s) => <SVG size={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></SVG>,
  email: (s) => <SVG size={s}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></SVG>,
  messenger: (s) => <SVG size={s}><path d="M12 2C6.48 2 2 6.04 2 11c0 2.83 1.41 5.35 3.61 7.01L5 22l3.71-2.03C9.77 20.31 10.86 20.5 12 20.5c5.52 0 10-3.54 10-8.5S17.52 2 12 2z"/><path d="M8 11l3 3 5-5"/></SVG>,
  instagram: (s) => <SVG size={s}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></SVG>,
};

const ChannelIcon = ({ channel, size = 18 }) => {
  if (channel === "email") return <span style={{ color: T.blue }}>{Icons.email(size)}</span>;
  if (channel === "messenger") return <span style={{ color: "#0084FF" }}>{Icons.messenger(size)}</span>;
  if (channel === "instagram") return <span style={{ color: "#E1306C" }}>{Icons.instagram(size)}</span>;
  return null;
};

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (n) => `$${Number(n).toFixed(2)}`;
const fmtShort = (n) => `$${Number(n).toFixed(0)}`;
const fmtDate = (d) => {
  const dt = new Date(d); const now = new Date("2026-02-14T14:00:00"); const diff = now - dt;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 172800000) return "Yesterday";
  return dt.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
};

const statusConfig = {
  new: { label: "New", bg: T.accentLight, color: "#B8941A", dot: T.accent },
  info_requested: { label: "Info Requested", bg: T.blueLight, color: T.blueDark, dot: T.blue },
  quote_ready: { label: "Quote Ready", bg: T.orangeLight, color: "#B56B3A", dot: T.orange },
  quote_sent: { label: "Quote Sent", bg: T.blueLight, color: T.blueDark, dot: T.blue },
  accepted: { label: "Accepted", bg: T.successLight, color: T.primaryDark, dot: T.success },
  declined: { label: "Declined", bg: T.dangerLight, color: T.danger, dot: T.danger },
  out_of_area: { label: "Out of Area", bg: "#F0EDED", color: "#8A7070", dot: "#B09090" },
  pending_approval: { label: "Pending Approval", bg: T.accentLight, color: "#B8941A", dot: T.accent },
  sent: { label: "Sent", bg: T.blueLight, color: T.blueDark, dot: T.blue },
};

const StatusBadge = ({ status }) => {
  const c = statusConfig[status] || statusConfig.new;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.bg, color: c.color, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
};

// ─── Shared UI ────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", size = "md", onClick, style: sx, ...props }) => {
  const base = { border: "none", cursor: "pointer", fontFamily: T.font, fontWeight: 700, borderRadius: T.radiusSm, display: "inline-flex", alignItems: "center", gap: 7, transition: "all 0.15s" };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "9px 20px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } };
  const variants = {
    primary: { background: T.primary, color: "#fff" },
    secondary: { background: T.primaryLight, color: T.primaryDark },
    outline: { background: "transparent", color: T.textMuted, border: `1.5px solid ${T.border}` },
    danger: { background: T.dangerLight, color: T.danger },
    ghost: { background: "transparent", color: T.textMuted, padding: "6px 10px" },
    dark: { background: T.sidebar, color: "#fff" },
  };
  return <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...sx }} {...props}>{children}</button>;
};

const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>}
    <input style={{ padding: "10px 14px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.text, background: "#fff", outline: "none" }}
      onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>}
    <select style={{ padding: "10px 14px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.text, background: "#fff" }} {...props}>{children}</select>
  </div>
);

const Card = ({ children, style: sx, ...props }) => (
  <div style={{ background: T.card, borderRadius: T.radiusLg, border: `1px solid ${T.borderLight}`, boxShadow: T.shadow, ...sx }} {...props}>{children}</div>
);

const CardHeader = ({ title, subtitle, right }) => (
  <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.text }}>{title}</h3>
      {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>{subtitle}</p>}
    </div>
    {right}
  </div>
);

const Modal = ({ title, subtitle, onClose, children, width = 560 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,45,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(6px)" }} onClick={onClose}>
    <div style={{ background: "#fff", borderRadius: T.radiusLg, width: `min(${width}px, 94vw)`, maxHeight: "90vh", overflow: "auto", boxShadow: T.shadowLg }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: "24px 28px 16px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text }}>{title}</h2>
          {subtitle && <p style={{ margin: "4px 0 0", color: T.textMuted, fontSize: 13 }}>{subtitle}</p>}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight, padding: 4 }}>{Icons.x(20)}</button>
      </div>
      {children}
    </div>
  </div>
);

const PageHeader = ({ title, subtitle, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>{title}</h1>
      {subtitle && <p style={{ margin: "5px 0 0", color: T.textMuted, fontSize: 14 }}>{subtitle}</p>}
    </div>
    <div style={{ display: "flex", gap: 10 }}>{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("inbox");
  const [pricing, setPricing] = useState(INITIAL_PRICING);
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [inboxFilter, setInboxFilter] = useState("all");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const getPrice = (id) => pricing.find(p => p.id === id)?.price || 0;

  const navItems = [
    { id: "inbox", icon: Icons.inbox, label: "Inbox", badge: enquiries.filter(e => e.status === "new" || e.status === "quote_ready").length },
    { id: "quotes", icon: Icons.quote, label: "Quotes", badge: quotes.filter(q => q.status === "pending_approval").length },
    { id: "form_preview", icon: Icons.form, label: "Customer Form" },
    { id: "pricing", icon: Icons.price, label: "Pricing" },
  ];

  // ═══════════════════════════════════════════════════════════
  // INBOX PAGE
  // ═══════════════════════════════════════════════════════════
  const InboxPage = () => {
    const filters = [
      { id: "all", label: "All" }, { id: "new", label: "New" }, { id: "info_requested", label: "Awaiting Info" },
      { id: "quote_ready", label: "Quote Ready" }, { id: "quote_sent", label: "Quote Sent" },
      { id: "accepted", label: "Accepted" }, { id: "out_of_area", label: "Out of Area" },
    ];
    const filtered = inboxFilter === "all" ? enquiries : enquiries.filter(e => e.status === inboxFilter);

    return (
      <div>
        <PageHeader title="Unified Inbox" subtitle={`${enquiries.length} enquiries · ${enquiries.filter(e => e.status === "new" || e.status === "quote_ready").length} need attention`} />

        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {filters.map(f => {
            const count = f.id === "all" ? enquiries.length : enquiries.filter(e => e.status === f.id).length;
            return (
              <button key={f.id} onClick={() => setInboxFilter(f.id)}
                style={{
                  padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${inboxFilter === f.id ? T.primary : T.border}`,
                  background: inboxFilter === f.id ? T.primaryLight : "#fff", color: inboxFilter === f.id ? T.primaryDark : T.textMuted,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: T.font,
                }}>
                {f.label}
                {count > 0 && <span style={{ marginLeft: 6, background: inboxFilter === f.id ? T.primary : T.border, color: inboxFilter === f.id ? "#fff" : T.textMuted, padding: "1px 7px", borderRadius: 10, fontSize: 10 }}>{count}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(e => {
            const pendingQuote = quotes.find(q => q.enquiryId === e.id && q.status === "pending_approval");
            return (
              <Card key={e.id} style={{ border: (e.status === "new" || e.status === "quote_ready") ? `1.5px solid ${T.accent}` : undefined }}>
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.primary, fontWeight: 800, fontSize: 15 }}>
                        {e.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{e.name}</span>
                          <ChannelIcon channel={e.channel} size={15} />
                        </div>
                        <div style={{ fontSize: 12, color: T.textLight, marginTop: 2, display: "flex", alignItems: "center", gap: 8 }}>
                          {e.suburb && <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.map(11)} {e.suburb}</span>}
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.clock(11)} {fmtDate(e.date)}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>

                  <div style={{ background: T.bg, borderRadius: T.radiusSm, padding: "12px 16px", marginBottom: 14, borderLeft: `3px solid ${T.border}` }}>
                    <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.65 }}>{e.message}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 12 }}>🤖</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: T.textMuted, lineHeight: 1.6, fontStyle: "italic" }}>{e.aiSummary}</p>
                  </div>

                  {/* Auto-reply indicator */}
                  {e.autoReplyStatus === "sent" && e.status !== "accepted" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.primary, fontWeight: 600, marginBottom: 10, paddingLeft: 36 }}>
                      {Icons.check(13)} Acknowledgment sent automatically
                    </div>
                  )}
                  {e.autoReplyStatus === "declined_area" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.danger, fontWeight: 600, marginBottom: 10, paddingLeft: 36 }}>
                      {Icons.map(13)} Polite "outside service area" reply auto-sent
                    </div>
                  )}
                  {e.autoReplyStatus === "form_sent" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.blue, fontWeight: 600, marginBottom: 10, paddingLeft: 36 }}>
                      {Icons.form(13)} Customer info form sent — pre-filled with extracted details
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    {e.status === "new" && (
                      <Btn variant="secondary" size="sm" onClick={() => {
                        showToast(`Acknowledgment + info form sent to ${e.name}`);
                        setEnquiries(enquiries.map(x => x.id === e.id ? { ...x, status: "info_requested", autoReplyStatus: "form_sent", aiSummary: `Acknowledgment sent to ${e.name}. Customer info form sent to collect property details. Waiting for response.` } : x));
                      }}>
                        {Icons.send(14)} Send Info Form
                      </Btn>
                    )}
                    {e.status === "quote_ready" && pendingQuote && (
                      <Btn variant="primary" size="sm" onClick={() => setModal({ type: "review_quote", quote: pendingQuote, enquiry: e })}>
                        {Icons.eye(14)} Review Quote
                      </Btn>
                    )}
                    {e.status === "quote_ready" && !pendingQuote && (
                      <Btn variant="primary" size="sm" onClick={() => setModal({ type: "build_quote", enquiry: e })}>
                        {Icons.quote(14)} Build Quote
                      </Btn>
                    )}
                    {e.status === "info_requested" && (
                      <span style={{ fontSize: 12, color: T.textLight, display: "flex", alignItems: "center", gap: 6 }}>
                        {Icons.clock(14)} Awaiting customer response...
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: T.textLight }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <p style={{ fontSize: 14 }}>No enquiries matching this filter</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // QUOTES PAGE
  // ═══════════════════════════════════════════════════════════
  const QuotesPage = () => {
    const pending = quotes.filter(q => q.status === "pending_approval");
    const others = quotes.filter(q => q.status !== "pending_approval");

    return (
      <div>
        <PageHeader title="Quotes" subtitle={`${quotes.length} total · ${pending.length} awaiting approval`} />

        {pending.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#B8941A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              {Icons.zap(15)} Awaiting Your Approval
            </h3>
            {pending.map(q => {
              const enq = enquiries.find(e => e.id === q.enquiryId);
              return (
                <Card key={q.id} style={{ border: `1.5px solid ${T.accent}`, marginBottom: 14 }}>
                  <div style={{ padding: "22px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <ChannelIcon channel={q.channel} size={20} />
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{q.name}</div>
                          <div style={{ fontSize: 12, color: T.textLight }}>{q.suburb} · {q.frequency} clean</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 30, fontWeight: 800, color: T.text }}>{fmt(q.total)}</div>
                        {q.discount > 0 && <div style={{ fontSize: 11, color: T.primary, fontWeight: 700 }}>✨ 10% weekly discount</div>}
                      </div>
                    </div>

                    <div style={{ background: T.bg, borderRadius: T.radiusSm, padding: "14px 18px", marginBottom: 18 }}>
                      {q.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < q.items.length - 1 ? `1px solid ${T.borderLight}` : "none" }}>
                          <span style={{ fontSize: 13, color: T.text }}>{item.label} × {item.qty}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmt(item.total)}</span>
                        </div>
                      ))}
                      {q.discount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px dashed ${T.border}`, marginTop: 6 }}>
                          <span style={{ fontSize: 13, color: T.primary, fontWeight: 600 }}>Weekly Discount (10%)</span>
                          <span style={{ fontSize: 13, color: T.primary, fontWeight: 700 }}>-{fmt(q.discountAmount)}</span>
                        </div>
                      )}
                    </div>

                    {/* AI Message Preview */}
                    <div style={{ background: T.primaryLight, borderRadius: T.radiusSm, padding: "14px 16px", marginBottom: 18 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.primaryDark, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>🤖 Message that will be sent</div>
                      <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.65 }}>
                        Hey {q.name.split(" ")[0]}! 🌿 Thanks so much for your enquiry! Here's your personalised cleaning quote for your home in {q.suburb}:
                        {q.items.map(i => `\n• ${i.label}: ${i.qty} × ${fmt(i.unitPrice)} = ${fmt(i.total)}`).join("")}
                        {q.discount > 0 ? `\n\n✨ Weekly clean discount: -${fmt(q.discountAmount)}` : ""}
                        {`\n\nTotal: ${fmt(q.total)} per ${q.frequency} clean`}
                        {"\n\n"}If everything looks good, just let us know and we'll get you booked in! Any questions at all, we're here to help 😊
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <Btn variant="outline" onClick={() => setModal({ type: "modify_quote", quote: q, enquiry: enq })}>
                        {Icons.edit(14)} Modify
                      </Btn>
                      <Btn variant="primary" onClick={() => {
                        setQuotes(quotes.map(x => x.id === q.id ? { ...x, status: "sent" } : x));
                        setEnquiries(enquiries.map(x => x.id === q.enquiryId ? { ...x, status: "quote_sent", aiSummary: `Quote for ${fmt(q.total)} approved and sent via ${q.channel}. Awaiting customer response.` } : x));
                        showToast(`Quote sent to ${q.name} via ${q.channel}!`);
                      }}>
                        {Icons.send(14)} Approve & Send
                      </Btn>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {others.length > 0 && (
          <Card>
            <CardHeader title="All Quotes" subtitle={`${others.length} quotes`} />
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr>
                    {["Client", "Channel", "Frequency", "Total", "Date", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `2px solid ${T.borderLight}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {others.map(q => (
                    <tr key={q.id} style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 700, color: T.text }}>{q.name}</div>
                        <div style={{ fontSize: 12, color: T.textLight }}>{q.suburb}</div>
                      </td>
                      <td style={{ padding: "14px 20px" }}><ChannelIcon channel={q.channel} size={16} /></td>
                      <td style={{ padding: "14px 20px", color: T.textMuted, textTransform: "capitalize" }}>
                        {q.frequency}
                        {q.discount > 0 && <span style={{ marginLeft: 6, fontSize: 10, color: T.primary, fontWeight: 700, background: T.primaryLight, padding: "1px 6px", borderRadius: 8 }}>-10%</span>}
                      </td>
                      <td style={{ padding: "14px 20px", fontWeight: 700, color: T.text }}>{fmt(q.total)}</td>
                      <td style={{ padding: "14px 20px", color: T.textLight, fontSize: 12 }}>{fmtDate(q.date)}</td>
                      <td style={{ padding: "14px 20px" }}><StatusBadge status={q.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // CUSTOMER FORM PAGE (Preview)
  // ═══════════════════════════════════════════════════════════
  const CustomerFormPage = () => {
    const [fd, setFd] = useState({ name: "", suburb: "", bedrooms: 1, bathrooms: 1, living: 1, kitchen: 1, frequency: "fortnightly", oven: false, sheets: false, windows: false, windowCount: 0, organising: false, notes: "" });
    const u = (k, v) => setFd({ ...fd, [k]: v });

    const calcTotal = () => {
      let t = fd.bedrooms * getPrice("bedroom") + fd.bathrooms * getPrice("bathroom") + fd.living * getPrice("living") + fd.kitchen * getPrice("kitchen");
      if (fd.oven) t += getPrice("oven");
      if (fd.sheets) t += getPrice("sheets");
      if (fd.windows && fd.windowCount > 0) t += fd.windowCount * getPrice("windows");
      if (fd.organising) t += getPrice("organising");
      if (fd.frequency === "weekly") t *= (1 - WEEKLY_DISCOUNT);
      return t;
    };

    const RoomCounter = ({ k, label, icon, price }) => (
      <div style={{ background: T.bg, borderRadius: T.radiusSm, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{icon} {label}</div>
          <div style={{ fontSize: 11, color: T.textLight }}>{fmtShort(price)} each</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => u(k, Math.max(0, fd[k] - 1))} style={{ width: 28, height: 28, borderRadius: 7, border: `1.5px solid ${T.border}`, background: "#fff", cursor: "pointer", fontSize: 16, color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
          <span style={{ width: 24, textAlign: "center", fontWeight: 700, fontSize: 15, color: T.text }}>{fd[k]}</span>
          <button onClick={() => u(k, fd[k] + 1)} style={{ width: 28, height: 28, borderRadius: 7, border: `1.5px solid ${T.primary}`, background: T.primaryLight, cursor: "pointer", fontSize: 16, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>
      </div>
    );

    return (
      <div>
        <PageHeader title="Customer Info Form" subtitle="Preview of the form sent to customers when more details are needed" />
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <Card>
            <div style={{ padding: "32px 32px 24px", textAlign: "center", borderBottom: `1px solid ${T.borderLight}`, background: `linear-gradient(135deg, ${T.primaryLight}, ${T.blueLight})`, borderRadius: `${T.radiusLg}px ${T.radiusLg}px 0 0` }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>🌿</div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: T.text }}>Dust Bunnies Cleaning</h2>
              <p style={{ margin: 0, fontSize: 14, color: T.textMuted }}>Tell us about your home so we can prepare your personalised quote!</p>
            </div>

            <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
              <Input label="Your Name" value={fd.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Sarah Mitchell" />

              <Select label="Suburb" value={fd.suburb} onChange={e => u("suburb", e.target.value)}>
                <option value="">Select your suburb...</option>
                {SERVICED_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </Select>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, display: "block" }}>Rooms</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <RoomCounter k="bedrooms" label="Bedrooms" icon="🛏️" price={getPrice("bedroom")} />
                  <RoomCounter k="bathrooms" label="Bathrooms" icon="🚿" price={getPrice("bathroom")} />
                  <RoomCounter k="living" label="Living Rooms" icon="🛋️" price={getPrice("living")} />
                  <RoomCounter k="kitchen" label="Kitchens" icon="🍳" price={getPrice("kitchen")} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, display: "block" }}>Cleaning Frequency</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["weekly", "fortnightly", "monthly"].map(f => (
                    <button key={f} onClick={() => u("frequency", f)}
                      style={{
                        flex: 1, padding: "12px 8px", borderRadius: T.radiusSm, cursor: "pointer", fontFamily: T.font, textAlign: "center",
                        border: fd.frequency === f ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`,
                        background: fd.frequency === f ? T.primaryLight : "#fff", color: fd.frequency === f ? T.primaryDark : T.textMuted,
                      }}>
                      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize" }}>{f}</div>
                      {f === "weekly" && <div style={{ fontSize: 11, color: T.primary, fontWeight: 700, marginTop: 3 }}>🎉 Save 10%</div>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, display: "block" }}>Add-ons (Optional)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { key: "oven", label: "♨️ Oven Clean", price: getPrice("oven") },
                    { key: "sheets", label: "🛏️ Sheet Changes", price: getPrice("sheets") },
                    { key: "organising", label: "📦 Organising", price: getPrice("organising") },
                  ].map(a => (
                    <button key={a.key} onClick={() => u(a.key, !fd[a.key])}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: T.radiusSm, cursor: "pointer", fontFamily: T.font,
                        border: fd[a.key] ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`,
                        background: fd[a.key] ? T.primaryLight : "#fff",
                      }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.textMuted }}>{fmt(a.price)}</span>
                        {fd[a.key] && <span style={{ color: T.primary }}>{Icons.check(16)}</span>}
                      </div>
                    </button>
                  ))}

                  <div style={{ padding: "12px 16px", borderRadius: T.radiusSm, border: fd.windows ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`, background: fd.windows ? T.primaryLight : "#fff" }}>
                    <button onClick={() => u("windows", !fd.windows)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: T.font, padding: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>🪟 Window Cleaning</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.textMuted }}>{fmtShort(getPrice("windows"))}/window</span>
                        {fd.windows && <span style={{ color: T.primary }}>{Icons.check(16)}</span>}
                      </div>
                    </button>
                    {fd.windows && (
                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, color: T.textMuted }}>How many windows?</span>
                        <input type="number" min="1" value={fd.windowCount} onChange={e => u("windowCount", Math.max(0, Number(e.target.value)))}
                          style={{ width: 60, padding: "6px 10px", borderRadius: 6, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font, textAlign: "center" }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Total */}
              <div style={{ background: `linear-gradient(135deg, ${T.sidebar}, #26503E)`, borderRadius: T.radius, padding: "20px 24px", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Estimated Quote</div>
                    {fd.frequency === "weekly" && <div style={{ fontSize: 12, color: T.accent, fontWeight: 700, marginTop: 4 }}>✨ 10% weekly discount applied!</div>}
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>{fmt(calcTotal())}</div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>per {fd.frequency} clean</div>
              </div>

              <textarea placeholder="Any additional notes or special requests..." rows={3} value={fd.notes} onChange={e => u("notes", e.target.value)}
                style={{ padding: "12px 14px", borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font, color: T.text, resize: "vertical", lineHeight: 1.6 }} />

              <Btn variant="dark" size="lg" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast("Form submitted! Quote will be auto-generated for owner review.")}>
                Submit & Get My Quote 🌿
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // PRICING PAGE
  // ═══════════════════════════════════════════════════════════
  const PricingPage = () => {
    const rooms = pricing.filter(p => p.category === "rooms");
    const addons = pricing.filter(p => p.category === "addon");

    return (
      <div>
        <PageHeader title="Service Pricing" subtitle="Update prices here — changes apply to all new quotes instantly">
          <Btn variant="primary" onClick={() => setModal({ type: "add_service" })}>{Icons.plus(15)} Add Service</Btn>
        </PageHeader>

        <h3 style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Room Pricing</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          {rooms.map(s => (
            <Card key={s.id} style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginTop: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: T.textLight, marginTop: 2 }}>{s.unit}</div>
                </div>
                <button onClick={() => setModal({ type: "edit_price", service: s })} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight, padding: 4 }}>{Icons.edit(16)}</button>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: T.text, marginTop: 14 }}>{fmt(s.price)}</div>
            </Card>
          ))}
        </div>

        <h3 style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Add-on Services</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          {addons.map(s => (
            <Card key={s.id} style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginTop: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: T.textLight, marginTop: 2 }}>{s.unit}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setModal({ type: "edit_price", service: s })} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight, padding: 4 }}>{Icons.edit(16)}</button>
                  <button onClick={() => { setPricing(pricing.filter(x => x.id !== s.id)); showToast(`"${s.label}" removed`); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight, padding: 4 }}>{Icons.trash(16)}</button>
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: T.text, marginTop: 14 }}>{fmt(s.price)}</div>
            </Card>
          ))}
        </div>

        <Card style={{ border: `1.5px solid ${T.primary}`, background: T.primaryLight }}>
          <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 28 }}>✨</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.primaryDark }}>Weekly Clean Discount: 10% off</div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>Automatically applied when customers choose weekly frequency</div>
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ padding: "18px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ color: T.primary }}>{Icons.map(18)}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Serviced Areas</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SERVICED_AREAS.map(a => (
                <span key={a} style={{ background: T.bg, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: T.textMuted }}>{a}</span>
              ))}
            </div>
            <p style={{ margin: "12px 0 0", fontSize: 12, color: T.textLight }}>Enquiries from outside these areas receive an automatic polite decline.</p>
          </div>
        </Card>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════
  const EditPriceModal = ({ service, onClose }) => {
    const [price, setPrice] = useState(service?.price || 0);
    const [label, setLabel] = useState(service?.label || "");
    const [unit, setUnit] = useState(service?.unit || "per unit");
    const isNew = !service;
    const save = () => {
      if (isNew) {
        setPricing([...pricing, { id: `custom_${Date.now()}`, label, price: Number(price), unit, icon: "🧹", category: "addon" }]);
        showToast(`"${label}" added`);
      } else {
        setPricing(pricing.map(p => p.id === service.id ? { ...p, label: label || p.label, price: Number(price), unit } : p));
        showToast(`${service.label} updated to ${fmt(Number(price))}`);
      }
      onClose();
    };
    return (
      <Modal title={isNew ? "Add Service" : `Edit ${service.label}`} onClose={onClose} width={400}>
        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          {isNew && <Input label="Service Name" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Balcony Clean" />}
          <Input label="Price ($)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <Input label="Unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. per room" />
        </div>
        <div style={{ padding: "16px 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={save}>{isNew ? "Add" : "Save"}</Btn>
        </div>
      </Modal>
    );
  };

  const ModifyQuoteModal = ({ quote, enquiry, onClose }) => {
    const [items, setItems] = useState(quote.items.map(i => ({ ...i })));
    const [freq, setFreq] = useState(quote.frequency);
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const isWeekly = freq === "weekly";
    const disc = isWeekly ? Math.round(subtotal * WEEKLY_DISCOUNT * 100) / 100 : 0;
    const total = subtotal - disc;

    const updateItem = (idx, field, val) => {
      const n = [...items];
      n[idx] = { ...n[idx], [field]: val, total: field === "qty" ? val * n[idx].unitPrice : n[idx].qty * val };
      if (field === "qty") n[idx].total = val * n[idx].unitPrice;
      if (field === "unitPrice") n[idx].total = n[idx].qty * val;
      setItems(n);
    };

    const save = () => {
      setQuotes(quotes.map(q => q.id === quote.id ? { ...q, items, frequency: freq, discount: isWeekly ? WEEKLY_DISCOUNT : 0, subtotal, discountAmount: disc, total } : q));
      showToast("Quote modified successfully");
      onClose();
    };

    return (
      <Modal title="Modify Quote" subtitle={`For ${quote.name}`} onClose={onClose} width={580}>
        <div style={{ padding: "20px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 80px 30px", gap: 8, marginBottom: 8 }}>
            {["Service", "Qty", "Unit $", "Total", ""].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</span>
            ))}
          </div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 80px 30px", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.label}</span>
              <input type="number" min="0" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))}
                style={{ padding: "7px 8px", borderRadius: 6, border: `1.5px solid ${T.border}`, fontSize: 13, textAlign: "center", fontFamily: T.font }} />
              <input type="number" min="0" value={item.unitPrice} onChange={e => updateItem(i, "unitPrice", Number(e.target.value))}
                style={{ padding: "7px 8px", borderRadius: 6, border: `1.5px solid ${T.border}`, fontSize: 13, textAlign: "center", fontFamily: T.font }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmt(item.total)}</span>
              <button onClick={() => setItems(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.textLight }}>{Icons.trash(14)}</button>
            </div>
          ))}

          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, display: "block" }}>Frequency</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["weekly", "fortnightly", "monthly"].map(f => (
                <button key={f} onClick={() => setFreq(f)} style={{
                  padding: "8px 16px", borderRadius: T.radiusSm, cursor: "pointer", fontFamily: T.font, fontSize: 12, fontWeight: 700, textTransform: "capitalize",
                  border: freq === f ? `2px solid ${T.primary}` : `1.5px solid ${T.border}`, background: freq === f ? T.primaryLight : "#fff", color: freq === f ? T.primaryDark : T.textMuted
                }}>{f} {f === "weekly" && "(-10%)"}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, paddingTop: 16, borderTop: `2px solid ${T.border}` }}>
            {isWeekly && <span style={{ fontSize: 12, color: T.primary, fontWeight: 600 }}>-{fmt(disc)} discount</span>}
            <span style={{ fontSize: 14, color: T.textMuted }}>Total:</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: T.text }}>{fmt(total)}</span>
          </div>
        </div>
        <div style={{ padding: "16px 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={save}>Save Changes</Btn>
        </div>
      </Modal>
    );
  };

  // ─── Render ─────────────────────────────────────────────
  const pgs = { inbox: InboxPage, quotes: QuotesPage, form_preview: CustomerFormPage, pricing: PricingPage };
  const Pg = pgs[page] || InboxPage;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text }}>
        <aside style={{ width: 250, background: T.sidebar, padding: "28px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", boxShadow: "4px 0 20px rgba(0,0,0,0.1)" }}>
          <div style={{ paddingLeft: 14, marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>🌿</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.3 }}>Dust Bunnies</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Admin Dashboard</div>
              </div>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
                background: page === n.id ? T.sidebarActive : "transparent",
                color: page === n.id ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: 14, fontWeight: page === n.id ? 700 : 500, cursor: "pointer", fontFamily: T.font,
              }}>
                {n.icon(18)} {n.label}
                {n.badge > 0 && (
                  <span style={{ marginLeft: "auto", background: page === n.id ? T.accent : "rgba(255,255,255,0.15)", color: page === n.id ? T.sidebar : "rgba(255,255,255,0.8)", minWidth: 22, height: 22, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>
                    {n.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: "auto", paddingLeft: 14 }}>
            <div style={{ padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Sunshine Coast, QLD 🌊</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 4 }}>Eco-conscious cleaning ♻️</div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, padding: "36px 44px", maxWidth: 920 }}>
          <Pg />
        </main>

        {(modal?.type === "edit_price" || modal?.type === "add_service") && <EditPriceModal service={modal.type === "edit_price" ? modal.service : null} onClose={() => setModal(null)} />}
        {modal?.type === "modify_quote" && <ModifyQuoteModal quote={modal.quote} enquiry={modal.enquiry} onClose={() => setModal(null)} />}
        {modal?.type === "review_quote" && (
          <Modal title="Review Auto-Generated Quote" subtitle={`For ${modal.quote.name} · ${modal.quote.suburb}`} onClose={() => setModal(null)}>
            <div style={{ padding: "20px 28px" }}>
              {modal.enquiry && (
                <div style={{ background: T.bg, borderRadius: T.radiusSm, padding: "14px 16px", marginBottom: 18, borderLeft: `3px solid ${T.primary}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Original Message</div>
                  <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.65 }}>{modal.enquiry.message}</p>
                </div>
              )}
              {modal.quote.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.borderLight}` }}>
                  <span style={{ fontSize: 13, color: T.text }}>{item.label} × {item.qty} @ {fmt(item.unitPrice)}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmt(item.total)}</span>
                </div>
              ))}
              {modal.quote.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", color: T.primary }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Weekly Discount (10%)</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>-{fmt(modal.quote.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", borderTop: `2px solid ${T.border}`, marginTop: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Total ({modal.quote.frequency})</span>
                <span style={{ fontSize: 26, fontWeight: 800 }}>{fmt(modal.quote.total)}</span>
              </div>
            </div>
            <div style={{ padding: "16px 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="outline" onClick={() => { const q = modal.quote; const e = modal.enquiry; setModal({ type: "modify_quote", quote: q, enquiry: e }); }}>
                {Icons.edit(14)} Modify
              </Btn>
              <Btn variant="primary" onClick={() => {
                const q = modal.quote;
                setQuotes(quotes.map(x => x.id === q.id ? { ...x, status: "sent" } : x));
                setEnquiries(enquiries.map(x => x.id === q.enquiryId ? { ...x, status: "quote_sent", aiSummary: `Quote for ${fmt(q.total)} approved and sent via ${q.channel}. Awaiting customer response.` } : x));
                showToast(`Quote sent to ${q.name} via ${q.channel}!`);
                setModal(null);
              }}>
                {Icons.send(14)} Approve & Send
              </Btn>
            </div>
          </Modal>
        )}

        {toast && (
          <div style={{
            position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
            background: T.sidebar, color: "#fff", padding: "12px 24px", borderRadius: T.radius,
            fontSize: 14, fontWeight: 700, boxShadow: T.shadowLg, display: "flex", alignItems: "center", gap: 10, zIndex: 2000,
            animation: "toastIn 0.3s ease"
          }}>
            {Icons.check(16)} {toast.msg}
          </div>
        )}

        <style>{`
          @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
          * { box-sizing: border-box; margin: 0; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
          select:focus, input:focus, textarea:focus { outline: none; border-color: ${T.primary} !important; }
          button:hover { opacity: 0.92; }
          tr:hover { background: ${T.bg}; }
        `}</style>
      </div>
    </>
  );
}
