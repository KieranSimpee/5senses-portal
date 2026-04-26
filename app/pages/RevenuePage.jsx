import { useState, useEffect } from "react";
import { RevenueRecord, Campaign, Influencer, Brand } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";
const TYPE_COLORS = {
  "Platform Commission": { bg: "#ede9fe", color: "#7C3AED" },
  "Membership Fee": { bg: "#d1fae5", color: "#065f46" },
  "Performance Fee": { bg: "#e0f2fe", color: "#0277bd" },
  "Penalty": { bg: "#fee2e2", color: "#dc2626" },
  "Bonus": { bg: "#fef3c7", color: "#d97706" },
  "Other": { bg: "#f1f5f9", color: "#475569" },
};
const CURRENCIES = ["USD", "HKD", "CNY"];
const EMPTY = { campaign_id: "", campaign_title: "", influencer_id: "", influencer_name: "", brand_name: "", amount: "", currency: "USD", type: "Platform Commission", date: "", notes: "" };

export default function RevenuePage() {
  const [records, setRecords] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Promise.all([RevenueRecord.list("-date"), Campaign.list(), Influencer.list(), Brand.list()]).then(([r, c, i, b]) => {
      setRecords(r); setCampaigns(c); setInfluencers(i); setBrands(b); setLoading(false);
    });
  }, []);

  async function save() {
    const selCampaign = campaigns.find(c => c.id === form.campaign_id);
    const selInfluencer = influencers.find(i => i.id === form.influencer_id);
    const payload = {
      ...form,
      campaign_title: selCampaign?.title || form.campaign_title,
      influencer_name: selInfluencer?.name || form.influencer_name,
    };
    if (editing) await RevenueRecord.update(editing, payload);
    else await RevenueRecord.create(payload);
    setShowForm(false); setEditing(null);
    RevenueRecord.list("-date").then(setRecords);
  }

  async function remove(id) {
    if (confirm("Delete this record?")) {
      await RevenueRecord.delete(id);
      RevenueRecord.list("-date").then(setRecords);
    }
  }

  const filtered = filter === "All" ? records : records.filter(r => r.type === filter);
  const totalUSD = records.filter(r => r.currency === "USD").reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const totalHKD = records.filter(r => r.currency === "HKD").reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const commissions = records.filter(r => r.type === "Platform Commission").reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const memberships = records.filter(r => r.type === "Membership Fee").reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);

  const types = ["All", "Platform Commission", "Membership Fee", "Performance Fee", "Penalty", "Bonus", "Other"];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>💰 Revenue</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Platform commissions, membership fees & income tracking</p>
        </div>
        <button onClick={() => { setForm({ ...EMPTY, date: new Date().toISOString().split("T")[0] }); setEditing(null); setShowForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Record</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total USD", value: `$${totalUSD.toLocaleString()}`, color: "#059669", icon: "💵" },
          { label: "Total HKD", value: `HK$${totalHKD.toLocaleString()}`, color: "#0277bd", icon: "💴" },
          { label: "Platform Commissions", value: `$${commissions.toLocaleString()}`, color: BRAND_COLOR, icon: "✨" },
          { label: "Membership Fees", value: `$${memberships.toLocaleString()}`, color: "#d97706", icon: "🏢" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 12px rgba(124,58,237,0.07)", borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Type breakdown */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(124,58,237,0.07)", marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a0533", marginBottom: 14 }}>Revenue Breakdown by Type</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.keys(TYPE_COLORS).map(type => {
            const total = records.filter(r => r.type === type).reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
            return (
              <div key={type} style={{ background: TYPE_COLORS[type].bg, borderRadius: 10, padding: "10px 16px", minWidth: 130 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: TYPE_COLORS[type].color }}>${total.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{type}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 13px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: filter === t ? BRAND_COLOR : "#fff", color: filter === t ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filter === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {/* Records */}
      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(124,58,237,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf5ff" }}>
                {["Date", "Type", "Brand / Campaign", "Influencer", "Amount", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: BRAND_COLOR, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ borderTop: "1px solid #f5f0ff", background: i % 2 === 0 ? "#fff" : "#fdfcff" }}>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#64748b" }}>{r.date}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ padding: "3px 9px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: TYPE_COLORS[r.type]?.bg, color: TYPE_COLORS[r.type]?.color }}>{r.type}</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533" }}>{r.brand_name || "—"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.campaign_title}</div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#334155" }}>{r.influencer_name || "—"}</td>
                  <td style={{ padding: "13px 16px", fontWeight: 800, fontSize: 15, color: "#059669" }}>{r.currency} {parseFloat(r.amount || 0).toLocaleString()}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <button onClick={() => { setForm({ ...r }); setEditing(r.id); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 13, marginRight: 8 }}>Edit</button>
                    <button onClick={() => remove(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 50, color: "#94a3b8" }}>No revenue records yet</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 500, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editing ? "Edit" : "Add"} Revenue Record</h2>

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Type</label>
              <select value={form.type || ""} onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                {["Platform Commission","Membership Fee","Performance Fee","Penalty","Bonus","Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Campaign</label>
              <select value={form.campaign_id || ""} onChange={e => setForm({ ...form, campaign_id: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                <option value="">— None —</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Influencer</label>
              <select value={form.influencer_id || ""} onChange={e => setForm({ ...form, influencer_id: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                <option value="">— None —</option>
                {influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>

            {[
              { label: "Brand Name", key: "brand_name", type: "text" },
              { label: "Amount", key: "amount", type: "number" },
              { label: "Date", key: "date", type: "date" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Currency</label>
              <select value={form.currency || "USD"} onChange={e => setForm({ ...form, currency: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 9, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
