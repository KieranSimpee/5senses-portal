import { useState, useEffect } from "react";
import { Brand, BrandReport, Campaign, RevenueRecord, Influencer, CampaignInfluencer } from "@/api/entities";

const C = {
  bg: "#e8e6fe",
  accent: "#5e50fb",
  primary: "#8c82fc",
  soft: "#bab4fd",
  container: "#ffffff",
  text: "#1a1a1f",
  muted: "#9896ad",
  border: "#e2e0fd",
};

const REPORT_SECTIONS = [
  { key: "gmv", label: "GMV (Total Sales)", required: true },
  { key: "orders_count", label: "Total Orders", required: true },
  { key: "avg_order_value_usd", label: "Average Order Value", required: true },
  { key: "commission_captured_usd", label: "Commission Captured", required: true },
  { key: "top_product", label: "Top Product", required: false },
  { key: "top_influencer", label: "Top Influencer", required: false },
  { key: "total_lives_done", label: "Total Lives Done", required: false },
  { key: "refund_rate_pct", label: "Refund Rate %", required: false },
  { key: "engagement_rate_pct", label: "Engagement Rate %", required: false },
  { key: "audience_us_pct", label: "US Audience %", required: false },
  { key: "audience_top_age", label: "Top Age Group", required: false },
  { key: "brand_satisfaction_score", label: "Brand Satisfaction Score (1–10)", required: false },
  { key: "influencer_reliability_avg", label: "Influencer Reliability Avg (1–10)", required: false },
];

const TIERS = [
  {
    key: "Basic (Free)",
    label: "Basic Report (Free)",
    color: "#16a34a",
    bg: "#dcfce7",
    desc: "GMV, Orders, Commission, Top Product. Included in platform fee.",
    sections: ["gmv", "orders_count", "avg_order_value_usd", "commission_captured_usd", "top_product", "top_influencer"],
  },
  {
    key: "Growth (HKD 800)",
    label: "Growth Report (HKD 800/mo)",
    color: "#5e50fb",
    bg: "#ede9fe",
    desc: "Everything in Basic + Lives Done, Refund Rate, Engagement Rate.",
    sections: ["gmv", "orders_count", "avg_order_value_usd", "commission_captured_usd", "top_product", "top_influencer", "total_lives_done", "refund_rate_pct", "engagement_rate_pct"],
  },
  {
    key: "Full Intelligence (HKD 2000)",
    label: "Full Intelligence (HKD 2,000/mo)",
    color: "#d97706",
    bg: "#fef3c7",
    desc: "Full data suite including audience demographics and satisfaction scores.",
    sections: REPORT_SECTIONS.map(s => s.key),
  },
];

export default function ReportGeneratorPage() {
  const [brands, setBrands] = useState([]);
  const [reports, setReports] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [campaignInfluencers, setCampaignInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | create | preview
  const [selectedReport, setSelectedReport] = useState(null);

  // Form state
  const [form, setForm] = useState({
    brand_name: "",
    report_tier: "Basic (Free)",
    report_month: "",
    gmv_usd: "",
    orders_count: "",
    avg_order_value_usd: "",
    commission_captured_usd: "",
    top_product: "",
    top_influencer: "",
    total_lives_done: "",
    refund_rate_pct: "",
    engagement_rate_pct: "",
    audience_us_pct: "",
    audience_top_age: "",
    brand_satisfaction_score: "",
    influencer_reliability_avg: "",
    notes: "",
    report_status: "Draft",
    paid_amount_hkd: "",
  });

  const [autoFilling, setAutoFilling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      Brand.list(),
      BrandReport.list("-created_date"),
      Campaign.list(),
      RevenueRecord.list("-date"),
      Influencer.list(),
      CampaignInfluencer.list(),
    ]).then(([b, r, c, rv, i, ci]) => {
      setBrands(b);
      setReports(r);
      setCampaigns(c);
      setRevenues(rv);
      setInfluencers(i);
      setCampaignInfluencers(ci);
      setLoading(false);
    });
  }, []);

  function autoFill() {
    if (!form.brand_name) return;
    setAutoFilling(true);

    const brandRevenues = revenues.filter(r => r.brand_name === form.brand_name);
    const brandCampaigns = campaigns.filter(c => c.brand_name === form.brand_name);
    const brandCIs = campaignInfluencers.filter(ci =>
      brandCampaigns.some(c => c.id === ci.campaign_id)
    );

    const totalGMV = brandRevenues.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const totalOrders = brandCIs.reduce((s, ci) => s + (ci.live_count_done || 0) + (ci.blog_count_done || 0), 0);
    const totalCommission = brandRevenues
      .filter(r => r.type === "Platform Commission")
      .reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const avgOrder = totalOrders > 0 ? (totalGMV / totalOrders).toFixed(2) : "";
    const topInfluencer = brandCIs.sort((a, b) => (b.commission_earned || 0) - (a.commission_earned || 0))[0];
    const topInfluencerName = topInfluencer?.influencer_name || "";
    const totalLives = brandCIs.reduce((s, ci) => s + (ci.live_count_done || 0), 0);
    const reliabilityScores = brandCIs.map(ci => {
      const inf = influencers.find(i => i.id === ci.influencer_id);
      return inf?.reliability_score || null;
    }).filter(Boolean);
    const avgReliability = reliabilityScores.length > 0
      ? (reliabilityScores.reduce((a, b) => a + b, 0) / reliabilityScores.length).toFixed(1)
      : "";

    setForm(f => ({
      ...f,
      gmv_usd: totalGMV > 0 ? totalGMV.toFixed(2) : f.gmv_usd,
      orders_count: totalOrders > 0 ? totalOrders : f.orders_count,
      avg_order_value_usd: avgOrder || f.avg_order_value_usd,
      commission_captured_usd: totalCommission > 0 ? totalCommission.toFixed(2) : f.commission_captured_usd,
      top_influencer: topInfluencerName || f.top_influencer,
      total_lives_done: totalLives > 0 ? totalLives : f.total_lives_done,
      influencer_reliability_avg: avgReliability || f.influencer_reliability_avg,
    }));

    setAutoFilling(false);
  }

  async function saveReport() {
    setSaving(true);
    const payload = {
      ...form,
      gmv_usd: parseFloat(form.gmv_usd) || 0,
      orders_count: parseFloat(form.orders_count) || 0,
      avg_order_value_usd: parseFloat(form.avg_order_value_usd) || 0,
      commission_captured_usd: parseFloat(form.commission_captured_usd) || 0,
      total_lives_done: parseFloat(form.total_lives_done) || null,
      refund_rate_pct: parseFloat(form.refund_rate_pct) || null,
      engagement_rate_pct: parseFloat(form.engagement_rate_pct) || null,
      audience_us_pct: parseFloat(form.audience_us_pct) || null,
      brand_satisfaction_score: parseFloat(form.brand_satisfaction_score) || null,
      influencer_reliability_avg: parseFloat(form.influencer_reliability_avg) || null,
      paid_amount_hkd: parseFloat(form.paid_amount_hkd) || null,
    };
    const saved_rec = await BrandReport.create(payload);
    setReports(r => [saved_rec, ...r]);
    setSaving(false);
    setSaved(true);
    setSelectedReport(saved_rec);
    setView("preview");
    setTimeout(() => setSaved(false), 3000);
  }

  const activeTier = TIERS.find(t => t.key === form.report_tier) || TIERS[0];

  // ── STATUS BADGE ──
  function StatusBadge({ status }) {
    const map = {
      Draft: { bg: "#fef3c7", color: "#92400e" },
      "Ready to Send": { bg: "#dcfce7", color: "#166534" },
      Sent: { bg: "#ede9fe", color: "#4c1d95" },
    };
    const s = map[status] || map["Draft"];
    return (
      <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
        {status}
      </span>
    );
  }

  // ── REPORT PREVIEW ──
  function ReportPreview({ report }) {
    const tier = TIERS.find(t => t.key === report.report_tier) || TIERS[0];
    return (
      <div style={{ background: C.container, borderRadius: 16, padding: 28, border: `2px solid ${tier.color}` }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "Montserrat", marginBottom: 4 }}>BRAND PERFORMANCE REPORT</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "Exo 2", color: C.text }}>{report.brand_name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{report.report_month}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: tier.bg, color: tier.color, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
              {report.report_tier}
            </div>
            <div style={{ marginTop: 8 }}>
              <StatusBadge status={report.report_status} />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total GMV", value: report.gmv_usd ? `$${Number(report.gmv_usd).toLocaleString()} USD` : "—" },
            { label: "Total Orders", value: report.orders_count ? Number(report.orders_count).toLocaleString() : "—" },
            { label: "Avg Order Value", value: report.avg_order_value_usd ? `$${Number(report.avg_order_value_usd).toFixed(2)} USD` : "—" },
            { label: "Commission Captured", value: report.commission_captured_usd ? `$${Number(report.commission_captured_usd).toLocaleString()} USD` : "—" },
            { label: "Top Product", value: report.top_product || "—" },
            { label: "Top Influencer", value: report.top_influencer || "—" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>{m.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Growth / Full Intelligence extras */}
        {(report.total_lives_done || report.refund_rate_pct || report.engagement_rate_pct) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Lives Done", value: report.total_lives_done ?? "—" },
              { label: "Refund Rate", value: report.refund_rate_pct ? `${report.refund_rate_pct}%` : "—" },
              { label: "Engagement Rate", value: report.engagement_rate_pct ? `${report.engagement_rate_pct}%` : "—" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#ede9fe", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>{m.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Full Intelligence extras */}
        {(report.audience_us_pct || report.audience_top_age || report.brand_satisfaction_score || report.influencer_reliability_avg) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "US Audience", value: report.audience_us_pct ? `${report.audience_us_pct}%` : "—" },
              { label: "Top Age Group", value: report.audience_top_age || "—" },
              { label: "Brand Satisfaction", value: report.brand_satisfaction_score ? `${report.brand_satisfaction_score}/10` : "—" },
              { label: "Influencer Reliability", value: report.influencer_reliability_avg ? `${report.influencer_reliability_avg}/10` : "—" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#fef3c7", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#92400e", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>{m.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#92400e" }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {report.notes && (
          <div style={{ background: "#f8f7ff", borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${C.accent}` }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>NOTES</div>
            <div style={{ fontSize: 13, color: C.text }}>{report.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>Powered by Simplex-ity Platform</div>
          {report.paid_amount_hkd && (
            <div style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Paid: HKD ${report.paid_amount_hkd}</div>
          )}
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.accent, fontFamily: "Exo 2", fontSize: 18 }}>Loading Report Generator...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Montserrat", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "Exo 2", color: C.text }}>
              Report Generator
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
              Create and preview brand performance reports for Simplex-ity
            </div>
          </div>
          {view !== "create" && (
            <button
              onClick={() => { setView("create"); setSelectedReport(null); setForm({ brand_name: "", report_tier: "Basic (Free)", report_month: "", period_type: "monthly", period_start: "", period_end: "", gmv_usd: "", orders_count: "", avg_order_value_usd: "", commission_captured_usd: "", top_product: "", top_influencer: "", total_lives_done: "", refund_rate_pct: "", engagement_rate_pct: "", audience_us_pct: "", audience_top_age: "", brand_satisfaction_score: "", influencer_reliability_avg: "", notes: "", report_status: "Draft", paid_amount_hkd: "" }); }}
              style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Montserrat" }}
            >
              + New Report
            </button>
          )}
          {view === "create" && (
            <button
              onClick={() => setView("list")}
              style={{ background: C.border, color: C.text, border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Montserrat" }}
            >
              ← Back
            </button>
          )}
        </div>

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <div>
            {/* Tier info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
              {TIERS.map(t => (
                <div key={t.key} style={{ background: C.container, borderRadius: 12, padding: 16, border: `2px solid ${t.color}` }}>
                  <div style={{ fontWeight: 700, color: t.color, fontSize: 13, marginBottom: 6 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{t.desc}</div>
                </div>
              ))}
            </div>

            {/* Reports list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reports.length === 0 && (
                <div style={{ background: C.container, borderRadius: 12, padding: 32, textAlign: "center", color: C.muted }}>
                  No reports yet. Click "New Report" to create your first one.
                </div>
              )}
              {reports.map(r => {
                const tier = TIERS.find(t => t.key === r.report_tier) || TIERS[0];
                return (
                  <div key={r.id} style={{ background: C.container, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                    onClick={() => { setSelectedReport(r); setView("preview"); }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{r.brand_name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.report_month}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ background: tier.bg, color: tier.color, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{r.report_tier}</span>
                      <StatusBadge status={r.report_status} />
                      <span style={{ fontSize: 14, color: C.muted }}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CREATE VIEW ── */}
        {view === "create" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Form */}
            <div style={{ background: C.container, borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 20, fontFamily: "Exo 2" }}>Report Details</div>

              {/* Brand */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 6 }}>BRAND NAME *</label>
                {brands.length > 0 ? (
                  <select value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 13, color: C.text }}>
                    <option value="">Select brand...</option>
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    <option value="__custom__">+ Type custom name</option>
                  </select>
                ) : (
                  <input placeholder="Type brand name..." value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 13, boxSizing: "border-box" }} />
                )}
                {form.brand_name === "__custom__" && (
                  <input placeholder="Type brand name..." value={form._custom_brand || ""} onChange={e => setForm(f => ({ ...f, _custom_brand: e.target.value, brand_name: e.target.value }))}
                    style={{ width: "100%", marginTop: 8, padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.accent}`, fontFamily: "Montserrat", fontSize: 13, boxSizing: "border-box" }} />
                )}
              </div>

              {/* Report Period */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 8 }}>REPORT PERIOD *</label>

                {/* Quick select buttons */}
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "This Week", fn: () => {
                      const now = new Date();
                      const day = now.getDay();
                      const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
                      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
                      const fmt = d => d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
                      setForm(f => ({ ...f, period_type: "weekly", period_start: mon.toISOString().slice(0,10), period_end: sun.toISOString().slice(0,10), report_month: `Week ${fmt(mon)} – ${fmt(sun)}` }));
                    }},
                    { label: "This Month", fn: () => {
                      const now = new Date();
                      const start = new Date(now.getFullYear(), now.getMonth(), 1);
                      const end = new Date(now.getFullYear(), now.getMonth()+1, 0);
                      const monthName = now.toLocaleDateString("en-GB", { month:"long", year:"numeric" });
                      setForm(f => ({ ...f, period_type: "monthly", period_start: start.toISOString().slice(0,10), period_end: end.toISOString().slice(0,10), report_month: monthName }));
                    }},
                    { label: "This Quarter", fn: () => {
                      const now = new Date();
                      const q = Math.floor(now.getMonth() / 3);
                      const start = new Date(now.getFullYear(), q * 3, 1);
                      const end = new Date(now.getFullYear(), q * 3 + 3, 0);
                      const qLabel = `Q${q+1} ${now.getFullYear()}`;
                      setForm(f => ({ ...f, period_type: "quarterly", period_start: start.toISOString().slice(0,10), period_end: end.toISOString().slice(0,10), report_month: qLabel }));
                    }},
                    { label: "This Year", fn: () => {
                      const yr = new Date().getFullYear();
                      setForm(f => ({ ...f, period_type: "yearly", period_start: `${yr}-01-01`, period_end: `${yr}-12-31`, report_month: `Full Year ${yr}` }));
                    }},
                  ].map(({ label, fn }) => (
                    <button key={label} type="button" onClick={fn}
                      style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${C.accent}`, background: C.bg, color: C.accent, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat" }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Date range pickers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>FROM DATE</label>
                    <input type="date" value={form.period_start || ""} onChange={e => {
                      setForm(f => ({ ...f, period_start: e.target.value, report_month: f.period_end ? `${e.target.value} – ${f.period_end}` : e.target.value }));
                    }} style={{ width: "100%", padding: "9px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>TO DATE</label>
                    <input type="date" value={form.period_end || ""} onChange={e => {
                      setForm(f => ({ ...f, period_end: e.target.value, report_month: f.period_start ? `${f.period_start} – ${e.target.value}` : e.target.value }));
                    }} style={{ width: "100%", padding: "9px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* Period label display */}
                {form.report_month && (
                  <div style={{ background: "#ede9fe", borderRadius: 7, padding: "8px 12px", fontSize: 12, color: C.accent, fontWeight: 600 }}>
                    📅 Period: {form.report_month}
                  </div>
                )}
              </div>

              {/* Tier */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 8 }}>REPORT TIER *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {TIERS.map(t => (
                    <div key={t.key} onClick={() => setForm(f => ({ ...f, report_tier: t.key }))}
                      style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${form.report_tier === t.key ? t.color : C.border}`, background: form.report_tier === t.key ? t.bg : C.container, cursor: "pointer" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: t.color }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-fill button */}
              {form.brand_name && (
                <button onClick={autoFill} disabled={autoFilling}
                  style={{ width: "100%", background: "#ede9fe", color: C.accent, border: `1px solid ${C.soft}`, borderRadius: 8, padding: "9px 0", fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 16, fontFamily: "Montserrat" }}>
                  {autoFilling ? "Filling from platform data..." : "✨ Auto-fill from Platform Data"}
                </button>
              )}

              {/* Metrics */}
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 10 }}>Metrics</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {REPORT_SECTIONS.filter(s => activeTier.sections.includes(s.key)).map(s => (
                  <div key={s.key}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
                      {s.label.toUpperCase()}{s.required ? " *" : ""}
                    </label>
                    <input
                      placeholder={s.required ? "Required" : "Optional"}
                      value={form[s.key] || ""}
                      onChange={e => setForm(f => ({ ...f, [s.key]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 6 }}>NOTES / OBSERVATIONS</label>
                <textarea rows={3} placeholder="Add any notes for this brand..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
              </div>

              {/* Status + Paid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>STATUS</label>
                  <select value={form.report_status} onChange={e => setForm(f => ({ ...f, report_status: e.target.value }))}
                    style={{ width: "100%", padding: "9px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 12 }}>
                    <option>Draft</option>
                    <option>Ready to Send</option>
                    <option>Sent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>PAID AMOUNT (HKD)</label>
                  <input placeholder="0" value={form.paid_amount_hkd} onChange={e => setForm(f => ({ ...f, paid_amount_hkd: e.target.value }))}
                    style={{ width: "100%", padding: "9px 10px", borderRadius: 7, border: `1px solid ${C.border}`, fontFamily: "Montserrat", fontSize: 12, boxSizing: "border-box" }} />
                </div>
              </div>

              <button onClick={saveReport} disabled={saving || !form.brand_name || !form.report_month}
                style={{ width: "100%", marginTop: 20, background: saving ? C.soft : C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat" }}>
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save Report"}
              </button>
            </div>

            {/* Live Preview */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Live Preview</div>
              <ReportPreview report={{ ...form, gmv_usd: parseFloat(form.gmv_usd) || 0, orders_count: parseFloat(form.orders_count) || 0, avg_order_value_usd: parseFloat(form.avg_order_value_usd) || 0, commission_captured_usd: parseFloat(form.commission_captured_usd) || 0 }} />
            </div>
          </div>
        )}

        {/* ── PREVIEW VIEW ── */}
        {view === "preview" && selectedReport && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
              <button onClick={() => setView("list")}
                style={{ background: C.border, color: C.text, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Montserrat" }}>
                ← All Reports
              </button>
              <button onClick={() => { setForm({ ...selectedReport }); setView("create"); }}
                style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Montserrat" }}>
                Edit Report
              </button>
            </div>
            <ReportPreview report={selectedReport} />
          </div>
        )}
      </div>
    </div>
  );
}
