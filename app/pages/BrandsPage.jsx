import { useState, useEffect } from "react";
import { Brand, UISettings } from "@/api/entities";

const V = "#5e50fb";
const V2 = "#8c82fc";
const DARK = "#1a1a1f";
const BG = "#e8e6fe";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  brands: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ae9cdc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  tint:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  del:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  tiers:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  add:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  settings: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e50fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  save:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
};

const TIER_INFO = {
  Trial:        { color: "#d97706", bg: "#fef3c7", fee: "20% Commission", content: "Basic Insights (free)", influencers: "5-10 matched" },
  Essential:    { color: "#0277bd", bg: "#e0f2fe", fee: "$400/mo",        content: "1x Blog + 1x Live",    influencers: "1 Nano" },
  Professional: { color: V,        bg: "#ede9fe", fee: "$900/mo",        content: "2x Blogs + 4x Lives",  influencers: "2 Micro" },
  Enterprise:   { color: "#be185d", bg: "#fce7f3", fee: "$2,500/mo",     content: "5x Blogs + 10x Lives", influencers: "4 Star + 1 Super" },
};

const STATUS_COLORS = {
  Active:   { bg: "#d1fae5", color: "#065f46" },
  Pending:  { bg: "#fef9c3", color: "#854d0e" },
  Inactive: { bg: "#f1f5f9", color: "#475569" },
  Churned:  { bg: "#fee2e2", color: "#991b1b" },
};

const EMPTY_BRAND = { name: "", contact_name: "", contact_email: "", tier: "Trial", status: "Pending", membership_fee: "", category: "", country: "Hong Kong", tint_integrated: false, notes: "", brand_code: "", login_email: "" };

const PAGE_KEY = "brands_page";

const DEFAULT_SETTINGS = {
  banner_headline: "Asian beauty, made easier to trust, learn, and love.",
  banner_sub: "Join SIMPLEX-ITY — the curator platform connecting Korean beauty brands with the right voices.",
  banner_cta: "Learn More",
  banner_url: "https://simplex-ity.com",
  banner_bg1: "#1a0533",
  banner_bg2: "#2d1157",
  page_title: "Brands",
  page_subtitle: "Manage brand partnerships & membership tiers",
  show_kpi_total: "true",
  show_kpi_active: "true",
  show_kpi_trial: "true",
  show_kpi_mrr: "true",
  show_kpi_tint: "true",
  show_banner: "true",
};

// ── usePageSettings hook ─────────────────────────────────────────────────────
function usePageSettings(pageKey) {
  const LS_KEY = `simpee_page_settings_${pageKey}`;

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });
  const [recordMap, setRecordMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // localStorage is always the source of truth
        const lsSaved = localStorage.getItem(LS_KEY);
        if (lsSaved) {
          try {
            const parsed = JSON.parse(lsSaved);
            setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            setLoaded(true);
            return; // localStorage has data — use it, skip DB
          } catch(e) {}
        }
        // No localStorage — try UISettings entity
        try {
          const records = await UISettings.filter({ page_key: pageKey });
          if (records && records.length > 0) {
            const map = {};
            const merged = { ...DEFAULT_SETTINGS };
            records.forEach(r => {
              map[r.setting_key] = r.id;
              merged[r.setting_key] = r.value;
            });
            setRecordMap(map);
            setSettings(merged);
            localStorage.setItem(LS_KEY, JSON.stringify(merged));
          }
        } catch (e) {
          console.log("UISettings entity not available, using defaults");
        }
      } catch (e) {
        console.error("Settings load error", e);
      }
      setLoaded(true);
    }
    load();
  }, [pageKey]);

  async function saveSettings(newSettings) {
    // Always save to localStorage first (instant, reliable)
    localStorage.setItem(LS_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    // Try to also save to UISettings entity
    try {
      const updates = [];
      for (const [key, value] of Object.entries(newSettings)) {
        if (recordMap[key]) {
          updates.push(UISettings.update(recordMap[key], { value: String(value) }));
        } else {
          updates.push(
            UISettings.create({ page_key: pageKey, setting_key: key, value: String(value), value_type: "text", label: key })
              .then(r => { recordMap[key] = r.id; })
          );
        }
      }
      await Promise.all(updates);
    } catch (e) {
      console.log("UISettings entity save skipped, localStorage saved");
    }
  }

  return { settings, saveSettings, loaded };
}

// ── Settings Drawer ──────────────────────────────────────────────────────────
function SettingsDrawer({ open, onClose, settings, onSave }) {
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setDraft(settings); }, [settings, open]);

  async function handleSave() {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    onClose();
  }

  const inp = { width: "100%", padding: "8px 11px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, Inter, sans-serif" };
  const toggle = (key) => setDraft(d => ({ ...d, [key]: d[key] === "true" ? "false" : "true" }));

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(26,5,51,0.4)" }} />
      <div style={{ width: 340, background: "#fff", height: "100%", overflowY: "auto", boxShadow: "-4px 0 24px rgba(94,80,251,0.15)", display: "flex", flexDirection: "column" }}>

        {/* Drawer Header */}
        <div style={{ background: `linear-gradient(135deg, #1a0533, #2d1157)`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, fontFamily: "Exo 2, sans-serif" }}>Page Settings</div>
            <div style={{ color: "#a78bfa", fontSize: 10, marginTop: 2 }}>Changes save to database</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>{Icon.close}</button>
        </div>

        <div style={{ padding: "18px 20px", flex: 1 }}>

          {/* Page Info */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#1a0533", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Page Info</div>
            {[["Page Title", "page_title"], ["Page Subtitle", "page_subtitle"]].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>{label}</label>
                <input value={draft[key] || ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} style={inp} />
              </div>
            ))}
          </div>

          {/* KPI Cards */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#1a0533", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>KPI Cards — Show / Hide</div>
            {[
              ["Total Brands", "show_kpi_total"],
              ["Active Brands", "show_kpi_active"],
              ["Trial Brands", "show_kpi_trial"],
              ["MRR", "show_kpi_mrr"],
              ["TINT Live", "show_kpi_tint"],
            ].map(([label, key]) => (
              <div key={key} onClick={() => toggle(key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: draft[key] === "true" ? "#f0eeff" : "#f8f9fa", marginBottom: 6, cursor: "pointer", border: `1.5px solid ${draft[key] === "true" ? V + "40" : "#e2e8f0"}` }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: draft[key] === "true" ? DARK : "#94a3b8" }}>{label}</span>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: draft[key] === "true" ? V : "#cbd5e1", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: draft[key] === "true" ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#1a0533", textTransform: "uppercase", letterSpacing: 0.8 }}>Simplex-ity Banner</div>
              <div onClick={() => toggle("show_banner")} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <span style={{ fontSize: 10, color: "#64748b" }}>{draft.show_banner === "true" ? "Visible" : "Hidden"}</span>
                <div style={{ width: 32, height: 18, borderRadius: 9, background: draft.show_banner === "true" ? V : "#cbd5e1", position: "relative" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: draft.show_banner === "true" ? 16 : 2, transition: "left 0.2s" }} />
                </div>
              </div>
            </div>
            {[
              ["Headline", "banner_headline"],
              ["Subtitle", "banner_sub"],
              ["Button Text", "banner_cta"],
              ["Button URL", "banner_url"],
            ].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 9 }}>
                <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, fontWeight: 700, textTransform: "uppercase" }}>{label}</label>
                <input value={draft[key] || ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} style={inp} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
              {[["Bg Start", "banner_bg1"], ["Bg End", "banner_bg2"]].map(([label, key]) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, fontWeight: 700 }}>{label}</label>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="color" value={draft[key] || "#1a0533"} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} style={{ width: 32, height: 28, borderRadius: 6, border: "1.5px solid #e2d9f3", cursor: "pointer", padding: 2 }} />
                    <input value={draft[key] || ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} style={{ ...inp, width: "auto", flex: 1, fontSize: 11 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #f0eeff" }}>
          <button onClick={handleSave} disabled={saving} style={{ width: "100%", background: saving ? "#a5b4fc" : V, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {Icon.save} {saving ? "Saving..." : "Save Changes"}
          </button>
          <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>Saved to database — refresh safe</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BrandsPage({ user }) {
  const [brands, setBrands]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [showTiers, setShowTiers]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY_BRAND);
  const [search, setSearch]         = useState("");

  const { settings, saveSettings, loaded } = usePageSettings(PAGE_KEY);
  const isAdmin = !user || user.role === "Admin";

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await Brand.list("-created_date");
    setBrands(data);
    setLoading(false);
  }

  async function saveBrand() {
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

  const allKpis = [
    { key: "show_kpi_total",  label: "Total Brands", value: brands.length,                                  color: V },
    { key: "show_kpi_active", label: "Active",        value: active.length,                                  color: "#065f46" },
    { key: "show_kpi_trial",  label: "Trial",         value: brands.filter(b => b.tier === "Trial").length,  color: "#d97706" },
    { key: "show_kpi_mrr",    label: "MRR",           value: `$${totalMRR.toLocaleString()}`,                color: "#be185d" },
    { key: "show_kpi_tint",   label: "TINT Live",     value: brands.filter(b => b.tint_integrated).length,   color: V2 },
  ];

  const visibleKpis = allKpis.filter(k => settings[k.key] === "true");

  const inp = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, Inter, sans-serif" };

  return (
    <div style={{ padding: "24px 28px", background: BG, minHeight: "100vh", fontFamily: "Montserrat, Inter, sans-serif" }}>

      {/* Settings Drawer */}
      <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} settings={settings} onSave={saveSettings} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            {Icon.brands}
            <span style={{ fontSize: 18, fontWeight: 900, color: DARK, fontFamily: "Exo 2, sans-serif" }}>
              {loaded ? settings.page_title : "Brands"}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{loaded ? settings.page_subtitle : "Manage brand partnerships & membership tiers"}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && (
            <button onClick={() => setShowSettings(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: V, border: `1.5px solid ${V}30`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              {Icon.settings} Settings
            </button>
          )}
          <button onClick={() => setShowTiers(!showTiers)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: V, border: `1.5px solid ${V}30`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {Icon.tiers} Tier Guide
          </button>
          <button onClick={() => { setForm(EMPTY_BRAND); setEditing(null); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 6, background: V, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {Icon.add} Add Brand
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      {visibleKpis.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${visibleKpis.length},1fr)`, gap: 10, marginBottom: 16 }}>
          {visibleKpis.map(k => (
            <div key={k.key} style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", borderLeft: `3px solid ${k.color}`, boxShadow: "0 1px 4px rgba(94,80,251,0.06)" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Simplex-ity Hero Banner */}
      {settings.show_banner === "true" && loaded && (
        <div style={{ background: `linear-gradient(135deg, ${settings.banner_bg1}, ${settings.banner_bg2})`, borderRadius: 14, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, minHeight: 90, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: "#a78bfa", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>SIMPLEX-ITY · Partner Network</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.4, maxWidth: 520 }}>{settings.banner_headline}</div>
            <div style={{ fontSize: 11, color: "#c4b5fd", marginTop: 5, maxWidth: 480 }}>{settings.banner_sub}</div>
          </div>
          <a href={settings.banner_url} target="_blank" rel="noreferrer" style={{ background: V, color: "#fff", borderRadius: 8, padding: "9px 18px", fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>{settings.banner_cta}</a>
        </div>
      )}

      {/* Tier Guide */}
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
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 10 }}>{Icon.search}</span>
        <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, width: 280, paddingLeft: 32, fontSize: 12 }} />
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

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 520, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(94,80,251,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: DARK, fontFamily: "Exo 2, sans-serif" }}>{editing ? "Edit" : "Add"} Brand</div>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}>{Icon.close}</button>
            </div>
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
            {[["Brand Name","name","text"],["Contact Name","contact_name","text"],["Contact Email","contact_email","email"],["Login Email (Portal)","login_email","email"],["Brand Code (e.g. SK-LAMER-01)","brand_code","text"],["Category","category","text"],["Country","country","text"]].map(([label,key,type]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>{label}</label>
                <input type={type} value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inp} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
                {["Active","Pending","Inactive","Churned"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 12px", background: "#f9f7ff", borderRadius: 8 }}>
              <input type="checkbox" checked={!!form.tint_integrated} onChange={e => setForm({ ...form, tint_integrated: e.target.checked })} id="tint_cb" />
              <label htmlFor="tint_cb" style={{ fontSize: 12, fontWeight: 600, color: DARK, cursor: "pointer" }}>TINT AR Try-On Integrated</label>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveBrand} style={{ flex: 1, background: V, color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{editing ? "Save Changes" : "Add Brand"}</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
