import { useState } from "react";

const TOOLS = [
  {
    name: "Canva",
    logo: "🎨",
    url: "https://www.canva.com/login",
    color: "#00C4CC",
    bg: "#e0fffe",
    desc: "Design brand materials, social content & marketing assets",
    brand: "SIMPLEX-ITY",
    username: "kieran.li@5sensesbeauty.com",
    tip: "Login via Microsoft SSO. Switch to kieran@5senses.global recommended."
  },
  {
    name: "Looka",
    logo: "✏️",
    url: "https://looka.com/login",
    color: "#6c5ce7",
    bg: "#f0edff",
    desc: "Logo maker & brand kit — edit your Simplex-ity brand identity",
    brand: "SIMPLEX-ITY",
    username: "kieran@5senses.global",
    tip: "Your brand kit and logo files are stored here."
  },
  {
    name: "TINT / Banuba",
    logo: "💄",
    url: "https://merchant.tintvto.com/login",
    color: "#e84393",
    bg: "#fce7f3",
    desc: "AI virtual try-on merchant portal — Banuba TINT integration",
    brand: "SIMPLEX-ITY",
    username: "5sensesbeauty",
    tip: "Contact Nikita (Banuba) for product integration support."
  },
  {
    name: "Synthesia",
    logo: "🎬",
    url: "https://app.synthesia.io",
    color: "#0984e3",
    bg: "#dbeafe",
    desc: "AI video generation for marketing campaigns",
    brand: "SIMPLEX-ITY",
    username: "kieran@5senses.global",
    tip: "Create AI spokesperson videos for brands & campaigns."
  },
  {
    name: "Microsoft Teams",
    logo: "💬",
    url: "https://teams.microsoft.com",
    color: "#6264a7",
    bg: "#eef0fb",
    desc: "Team communication, meetings & collaboration",
    brand: "Both",
    username: "kieran@5senses.global",
    tip: "Use for internal team meetings, channels, and file sharing with Loreen & Wilson."
  },
  {
    name: "Microsoft 365 Admin",
    logo: "⚙️",
    url: "https://admin.microsoft.com",
    color: "#d83b01",
    bg: "#fff4f0",
    desc: "Manage M365 users, licenses, billing & email settings",
    brand: "Both",
    username: "kieran.li@5sensesbeauty.com",
    tip: "Main admin panel for all Microsoft 365 services."
  },
  {
    name: "Squarespace",
    logo: "🌐",
    url: "https://login.squarespace.com",
    color: "#1a1a1a",
    bg: "#f1f5f9",
    desc: "Website builder for Simplex-ity public site",
    brand: "SIMPLEX-ITY",
    username: "kieran@5senses.global",
    tip: "Main website editor and publishing platform."
  },
  {
    name: "Siteground",
    logo: "🖥️",
    url: "https://login.siteground.com/login",
    color: "#ff6b35",
    bg: "#fff4f0",
    desc: "Web hosting management",
    brand: "SIMPLEX-ITY",
    username: "kieran@5senses.global",
    tip: "Hosting panel — SSL, email accounts, file manager."
  },
  {
    name: "GoDaddy",
    logo: "🌍",
    url: "https://sso.godaddy.com/login",
    color: "#1bdb00",
    bg: "#f0fff0",
    desc: "Domain registrar — simplex-ity.com, 5senses.global",
    brand: "Both",
    username: "kieran@simplex-ity.com",
    tip: "Manage DNS, domain renewals, and email hosting."
  },
  {
    name: "Shopify",
    logo: "🛍️",
    url: "https://accounts.shopify.com/login",
    color: "#96bf48",
    bg: "#f4f9ec",
    desc: "E-commerce store (currently inactive — review for cancellation)",
    brand: "SIMPLEX-ITY",
    username: "kieranli@yahoo.com.hk",
    tip: "⚠️ Currently inactive. $9/month — consider cancelling.",
    warning: true
  },
  {
    name: "FundFluent / FluentLab",
    logo: "🔧",
    url: "https://simplex-ity.fluentlab.co",
    color: "#f39c12",
    bg: "#fef9ec",
    desc: "Platform development workspace — managed with Wilson",
    brand: "SIMPLEX-ITY",
    username: "simplex-ity.fluentlab.co",
    tip: "Dev workspace for the Simplex-ity AI beauty platform build."
  },
  {
    name: "Base44 / Simpee",
    logo: "🤖",
    url: "https://app.base44.com",
    color: "#7c3aed",
    bg: "#f3e8ff",
    desc: "Simpee AI agent + this company portal (App S)",
    brand: "Both",
    username: "kieran@5senses.global",
    tip: "Manage automations, Simpee, and App S here."
  },
  {
    name: "Google Workspace",
    logo: "📧",
    url: "https://admin.google.com",
    color: "#4285f4",
    bg: "#e8f0fe",
    desc: "Google Workspace admin — users, domains & Gmail",
    brand: "Both",
    username: "info@5senses.global",
    tip: "Admin panel for 5senses.global Google Workspace."
  },
  {
    name: "Sleek Sign",
    logo: "✍️",
    url: "https://app.sleek.hk",
    color: "#00b894",
    bg: "#e6faf6",
    desc: "Legal document signing — contracts, NDAs, agreements",
    brand: "Both",
    username: "kieran@5senses.global",
    tip: "Used for FundFluent Partnership Agreement & NDA signing."
  },
];

const BRAND_FILTERS = ["All", "SIMPLEX-ITY", "Both"];
const CATEGORY_GROUPS = {
  "Design & Creative": ["Canva", "Looka", "Synthesia"],
  "AI & Platform": ["TINT / Banuba", "FundFluent / FluentLab"],
  "Communication": ["Microsoft Teams"],
  "Website & Hosting": ["Squarespace", "Siteground", "GoDaddy", "Shopify"],
  "Admin & Operations": ["Microsoft 365 Admin", "Google Workspace", "Sleek Sign", "Base44 / Simpee"],
};

export default function ToolsPage({ user }) {
  const [brandFilter, setBrandFilter] = useState("All");
  const [viewMode, setViewMode] = useState("category"); // "category" or "grid"
  const [copied, setCopied] = useState({});

  const isAdmin = user.role === "Admin";

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  const filtered = TOOLS.filter(t => brandFilter === "All" || t.brand === brandFilter || t.brand === "Both");

  const ToolCard = ({ tool }) => (
    <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${tool.warning ? "#fcd34d" : "#ede9fe"}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: tool.bg, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", flexShrink: 0 }}>
          {tool.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#1a0533", display: "flex", alignItems: "center", gap: 6 }}>
            {tool.name}
            {tool.warning && <span style={{ fontSize: 9, background: "#fef3c7", color: "#92400e", fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>REVIEW</span>}
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tool.desc}</div>
        </div>
        <span style={{ fontSize: 8, background: "rgba(124,58,237,0.1)", color: "#7c3aed", fontWeight: 700, padding: "2px 6px", borderRadius: 5, flexShrink: 0 }}>{tool.brand}</span>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Login */}
        <div style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600 }}>Login:</span>
          <span style={{ fontFamily: "monospace", fontSize: 10 }}>{tool.username}</span>
          <button onClick={() => copy(tool.username, `u_${tool.name}`)} style={{ background: "#f3f0ff", border: "none", borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "#7c3aed", cursor: "pointer" }}>
            {copied[`u_${tool.name}`] ? "✓" : "Copy"}
          </button>
        </div>

        {/* Tip */}
        {tool.tip && (
          <div style={{ fontSize: 10, color: "#94a3b8", background: "#faf9ff", borderRadius: 6, padding: "5px 8px", lineHeight: 1.4 }}>
            💡 {tool.tip}
          </div>
        )}

        {/* Launch button */}
        <a href={tool.url} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", marginTop: "auto" }}>
          <button style={{
            width: "100%",
            background: `linear-gradient(135deg, ${tool.color}cc, ${tool.color})`,
            color: "#fff", border: "none", borderRadius: 9, padding: "9px",
            fontWeight: 700, fontSize: 12, cursor: "pointer",
            boxShadow: `0 3px 10px ${tool.color}44`
          }}>
            Open {tool.name} →
          </button>
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0533", margin: 0 }}>🛠️ Brand Tools</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Quick-launch all company tools. {isAdmin ? "Credentials visible to admin only." : "Contact admin for login details."}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{filtered.length} tools</span>
          <button onClick={() => setViewMode(v => v === "category" ? "grid" : "category")} style={{ background: "#f3f0ff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 11, color: "#7c3aed", cursor: "pointer", fontWeight: 600 }}>
            {viewMode === "category" ? "Grid View" : "Category View"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {BRAND_FILTERS.map(f => (
          <button key={f} onClick={() => setBrandFilter(f)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: brandFilter === f ? "#7c3aed" : "#f3f0ff", color: brandFilter === f ? "#fff" : "#6d28d9", border: "none" }}>{f}</button>
        ))}
      </div>

      {/* iCloud note */}
      <div style={{ background: "#f0f8ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18 }}>☁️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1" }}>Cloud Backup for App S</div>
          <div style={{ fontSize: 11, color: "#0c4a6e", marginTop: 3 }}>
            iCloud doesn't support third-party app integrations. For cloud backup of documents and data, we recommend connecting *Google Drive* (free, full API) or *OneDrive* (you already have M365). Tell Simpee which you prefer and I'll set it up.
          </div>
        </div>
      </div>

      {/* Category view */}
      {viewMode === "category" ? (
        Object.entries(CATEGORY_GROUPS).map(([groupName, toolNames]) => {
          const groupTools = filtered.filter(t => toolNames.includes(t.name));
          if (groupTools.length === 0) return null;
          return (
            <div key={groupName} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12, borderBottom: "1px solid #ede9fe", paddingBottom: 6 }}>
                {groupName}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
                {groupTools.map(tool => <ToolCard key={tool.name} tool={tool} />)}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
          {filtered.map(tool => <ToolCard key={tool.name} tool={tool} />)}
        </div>
      )}
    </div>
  );
}
