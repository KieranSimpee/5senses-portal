import { useState, useEffect } from "react";
import { Brand } from "@/api/entities";

const V = "#5e50fb";
const V2 = "#8c82fc";
const DARK = "#1a1a1f";
const BG = "#e8e6fe";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  brands: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ae9cdc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  mrr:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ae9cdc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  tint:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  tiers:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  add:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const TIER_INFO = {
  Trial:        { color: "#d97706", bg: "#fef3c7", fee: "20% Commission", content: "Basic Insights (free)",    influencers: "5-10 matched" },
  Essential:    { color: "#0277bd", bg: "#e0f2fe", fee: "$400/mo",        content: "1x Blog + 1x Live",        influencers: "1 Nano" },
  Professional: { color: V,        bg: "#ede9fe", fee: "$900/mo",        content: "2x Blogs + 4x Lives",      influencers: "2 Micro" },
  Enterprise:   { color: "#be185d", bg: "#fce7f3", fee: "$2,500/mo",     content: "5x Blogs + 10x Lives",     influencers: "4 Star + 1 Super" },
};

const STATUS_COLORS = {
  Active:   { bg: "#d1fae5", color: "#065f46" },
  Pending:  { bg: "#fef9c3", color: "#854d0e" },
  Inactive: { bg: "#f1f5f9", color: "#475569" },
  Churned:  { bg: "#fee2e2", color: "#991b1b" },
};

const EMPTY = { name: "", contact_name: "", contact_email: "", tier: "Trial", status: "Pending", membership_fee: "", category: "", country: "Hong Kong", tint_integrated: false, notes: "", brand_code: "", login_email: "" };

// ── Simplex-ity Hero Banner (editable via localStorage) ──────────────────────
const DEFAULT_BANNER = {
  headline: "Asian beauty, made easier to trust, learn, and love.",
  sub: "Join SIMPLEX-ITY — the curator platform connecting Korean beauty brands with the right voices.",
  cta: "Learn More",
  ctaUrl: "https://simplex-ity.com",
  bg1: "#1a0533",
  bg2: "#2d1157",
};

function HeroBanner({ isAdmin }) {
  const [editing, setEditing] = useState(false);
  const [banner, setBanner] = useState(() => {
    try { return { ...DEFAULT_BANNER, ...JSON.parse(localStorage.getItem("sx_banner") || "{}") }; }
    catch { return DEFAULT_BANNER; }
  });
  const [draft, setDraft] = useState(banner);

  function save() {
    localStorage.setItem("sx_banner", JSON.stringify(draft));
    setBanner(draft);
    setEditing(false);
  }

  return (
    <div style={{ marginBottom: 20, position: "relative" }}>
      <div style={{ background: `linear-gradient(135deg, ${banner.bg1}, ${banner.bg2})`, borderRadius: 14, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, minHeight: 90 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: "#a78bfa", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>SIMPLEX-ITY · Partner Network</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.4, maxWidth: 520 }}>{banner.headline}</div>
          <div style={{ fontSize: 11, color: "#c4b5fd", marginTop: 5, maxWidth: 480 }}>{banner.sub}</div>
        </div>
        <a href={banner.ctaUrl} target="_blank" rel="noreferrer" style={{ background: V, color: "#fff", borderRadius: 8, padding: "9px 18px", fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>{banner.cta}</a>
        {isAdmin && (
          <button onClick={() => { setDraft(banner); setEditing(true); }} title="Edit banner" style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#c4b5fd", fontSize: 10, fontWeight: 700 }}>Edit</button>
        )}
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 480, boxShadow: "0 12px 40px rgba(94,80,251,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: DARK }}>Edit Banner</div>
              <button onClick={() => setEditing(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
            </div>
            {[["Headline", "headline"], ["Subtitle", "sub"], ["Button Text", "cta"], ["Button URL", "ctaUrl"]].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.7 }}>{label}</label>
                <input value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={save} style={{ flex: 1, background: V, color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Banner</button>
              <button onClick={() => setEditing(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BrandsPage({ user }) {
  const [brands, setBrands]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTiers, setShowTiers] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [search, setSearch]     = useState("");

  const isAdmin = !user || user.role === "Admin";

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await Brand.list("-created_date");
    setBrands(data);
    setLoading(false);
  }

  async function save() {
    const tierFees = { Trial: 0, Essential: 400, Professional: 900, Enterprise: 2500 };
    const payload = { ...form, membership_fee: form.membership_fee || tierFees[form.tier] || 0 };
    if (editing) await Brand.update(editing, payload);
    else await Brand.create(payload);
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id) {
    if (confirm("Delete this brand?")) { await Brand.delete(id); load(); }
  }

  const filtered = brands.filter(b =>
    !search || b.name?.toLowerCase().includes(search.toLowerCase()) || b.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  const active   = brands.filter(b => b.status === "Active");
  const totalMRR = active.filter(b => b.tier !== "Trial").reduce((s, b) => s + (parseFloat(b.membership_fee) || 0), 0);

  const kpis = [
    { label: "Total Brands", value: brands.length,                      color: V },
    { label: "Active",       value: active.length,                       color: "#065f46" },
    { label: "Trial",        value: brands.filter(b=>b.tier==="Trial").length, color: "#d97706" },
    { label: "MRR",          value: `$${totalMRR.toLocaleString()}`,     color: "#be185d" },
    { label: "TINT Live",    value: brands.filter(b=>b.tint_integrated).length, color: V2 },
  ];

  const inp = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, Inter, sans-serif" };

  return (
    <div style={{ padding: "24px 28px", background: BG, minHeight: "100vh", fontFamily: "Montserrat, Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            {Icon.brands}
            <span style={{ fontSize: 18, fontWeight: 900, color: DARK, fontFamily: "Exo 2, sans-serif" }}>Brands</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Manage brand partnerships & membership tiers</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowTiers(!showTiers)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: V, border: `1.5px solid ${V}30`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {Icon.tiers} Tier Guide
          </button>
          <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 6, background: V, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {Icon.add} Add Brand
          </button>
        </div>
      </div>

      {/* KPI Strip — compact */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 16 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", borderLeft: `3px solid ${k.color}`, boxShadow: "0 1px 4px rgba(94,80,251,0.06)" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Simplex-ity Hero Banner */}
      <HeroBanner isAdmin={isAdmin} />

      {/* Tier Guide (collapsible) */}
      {showTiers && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 18, marginBottom: 16, border: "1px solid #ede9fe" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: DARK, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Membership Tiers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {Object.entries(TIER_INFO).map(([tier, info]) => (
              <div key={tier} style={{ borderRadius: 10, padding: "12px 14px", background: info.bg, border: `1.5px solid ${info.color}30` }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: info.color, marginBottom: 6 }}>{tier}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 }}>{info.fee}</div>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{info.influencers}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{info.content}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 10 }}>All tiers include 20% platform commission. Campaign Lineup Fee: $1,000+ per event (Phase 2).</div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 10 }}>{Icon.search}</span>
        <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, width: 280, paddingLeft: 32 }} />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(94,80,251,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9f7ff" }}>
                {["Brand", "Contact", "Tier", "Status", "Monthly Fee", "TINT", "Code", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: V, textTransform: "uppercase", letterSpacing: 0.6 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderTop: "1px solid #f5f0ff", background: i % 2 === 0 ? "#fff" : "#fdfcff" }}>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{b.name}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>{b.category}{b.country ? ` · ${b.country}` : ""}</div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontSize: 12, color: "#334155" }}>{b.contact_name}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>{b.contact_email}</div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ padding: "2px 9px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: TIER_INFO[b.tier]?.bg, color: TIER_INFO[b.tier]?.color }}>{b.tier}</span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ padding: "2px 9px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[b.status]?.bg, color: STATUS_COLORS[b.status]?.color }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 600, color: DARK }}>
                    {b.tier === "Trial" ? <span style={{ color: "#d97706", fontSize: 11 }}>20% Commission</span> : b.membership_fee ? `$${parseFloat(b.membership_fee).toLocaleString()}/mo` : TIER_INFO[b.tier]?.fee}
                  </td>
                  <td style={{ padding: "11px 14px" }}>{b.tint_integrated ? Icon.tint : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}</td>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{b.brand_code || "—"}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <button onClick={() => { setForm({ ...b }); setEditing(b.id); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8 }} title="Edit">{Icon.edit}</button>
                    <button onClick={() => remove(b.id)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Delete">{Icon.del}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 13 }}>No brands found. Add your first brand partner.</div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 520, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(94,80,251,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: DARK, fontFamily: "Exo 2, sans-serif" }}>{editing ? "Edit" : "Add"} Brand</div>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
            </div>

            {/* Tier Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>Membership Tier</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {Object.entries(TIER_INFO).map(([tier, info]) => (
                  <div key={tier} onClick={() => setForm({ ...form, tier, membership_fee: tier === "Trial" ? 0 : tier === "Essential" ? 400 : tier === "Professional" ? 900 : 2500 })}
                    style={{ borderRadius: 9, padding: "9px 12px", cursor: "pointer", border: `2px solid ${form.tier === tier ? info.color : "#e2d9f3"}`, background: form.tier === tier ? info.bg : "#fff" }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: info.color }}>{tier}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{info.fee}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fields */}
            {[
              ["Brand Name", "name", "text"],
              ["Contact Name", "contact_name", "text"],
              ["Contact Email", "contact_email", "email"],
              ["Login Email (Portal)", "login_email", "email"],
              ["Brand Code (e.g. SK-LAMER-01)", "brand_code", "text"],
              ["Category", "category", "text"],
              ["Country", "country", "text"],
            ].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>{label}</label>
                <input type={type} value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inp} />
              </div>
            ))}

            {/* Status */}
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
                {["Active", "Pending", "Inactive", "Churned"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* TINT */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 12px", background: "#f9f7ff", borderRadius: 8 }}>
              <input type="checkbox" checked={!!form.tint_integrated} onChange={e => setForm({ ...form, tint_integrated: e.target.checked })} id="tint_cb" />
              <label htmlFor="tint_cb" style={{ fontSize: 12, fontWeight: 600, color: DARK, cursor: "pointer" }}>TINT AR Try-On Integrated</label>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                style={{ ...inp, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} style={{ flex: 1, background: V, color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {editing ? "Save Changes" : "Add Brand"}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
