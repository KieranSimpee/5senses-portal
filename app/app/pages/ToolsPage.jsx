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
    tip: "⚠️ Currently inactive. $9/month — consider cancelling."
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
    name: "Base44",
    logo: "🤖",
    url: "https://app.base44.com",
    color: "#7c3aed",
    bg: "#f3e8ff",
    desc: "Simpee AI agent + this company portal (App S)",
    brand: "Both",
    username: "kieran@5senses.global",
    tip: "Manage automations, Simpee, and App S here."
  },
];

const BRAND_FILTERS = ["All", "SIMPLEX-ITY", "5SENSESBEAUTY", "Both"];

export default function ToolsPage({ user }) {
  const [brandFilter, setBrandFilter] = useState("All");
  const [copied, setCopied] = useState({});

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  const filtered = TOOLS.filter(t => brandFilter === "All" || t.brand === brandFilter);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0533", margin: 0 }}>🛠️ Brand Tools</h1>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Quick-launch all company tools. Credentials visible to admin.</p>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {BRAND_FILTERS.map(f => (
          <button key={f} onClick={() => setBrandFilter(f)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: brandFilter === f ? "#7c3aed" : "#f3f0ff", color: brandFilter === f ? "#fff" : "#6d28d9", border: "none" }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map(tool => (
          <div key={tool.name} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #ede9fe", overflow: "hidden" }}>
            {/* Tool header */}
            <div style={{ background: tool.bg, padding: "16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                {tool.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#1a0533" }}>{tool.name}</div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{tool.desc}</div>
              </div>
              <span style={{ fontSize: 9, background: "#fff", color: "#6d28d9", fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>{tool.brand}</span>
            </div>

            {/* Tool body */}
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Login: </span>{tool.username}
                <button onClick={() => copy(tool.username, `u_${tool.name}`)} style={{ marginLeft: 6, background: "none", border: "none", color: "#7c3aed", fontSize: 10, cursor: "pointer" }}>
                  {copied[`u_${tool.name}`] ? "✓" : "Copy"}
                </button>
              </div>
              {tool.tip && (
                <div style={{ fontSize: 10, color: "#94a3b8", background: "#faf9ff", borderRadius: 6, padding: "6px 8px", marginBottom: 10 }}>
                  💡 {tool.tip}
                </div>
              )}
              <a href={tool.url} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none" }}>
                <button style={{ width: "100%", background: `linear-gradient(135deg, ${tool.color}dd, ${tool.color})`, color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Open {tool.name} →
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
