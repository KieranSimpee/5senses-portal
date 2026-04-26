import { useState, useEffect } from "react";
import { Campaign, Brand } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";
const STATUS_COLORS = {
  "Planning": { bg: "#e0f2fe", color: "#0277bd" },
  "Active": { bg: "#d1fae5", color: "#065f46" },
  "Completed": { bg: "#ede9fe", color: "#7C3AED" },
  "Cancelled": { bg: "#fee2e2", color: "#991b1b" },
};
const PHASE_COLORS = {
  "Phase 1 - Trial": { bg: "#fef3c7", color: "#d97706" },
  "Phase 2 - Growth": { bg: "#ede9fe", color: "#7C3AED" },
};
const EMPTY = { title: "", brand_id: "", brand_name: "", status: "Planning", phase: "Phase 1 - Trial", start_date: "", end_date: "", trial_price: "", discount_pct: 30, target_influencers: 5, total_revenue: "", platform_commission: "", notes: "" };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Promise.all([Campaign.list("-created_date"), Brand.list()]).then(([c, b]) => {
      setCampaigns(c); setBrands(b); setLoading(false);
    });
  }, []);

  async function save() {
    const selectedBrand = brands.find(b => b.id === form.brand_id);
    const payload = { ...form, brand_name: selectedBrand?.name || form.brand_name };
    if (editing) await Campaign.update(editing, payload);
    else await Campaign.create(payload);
    setShowForm(false); setEditing(null);
    Campaign.list("-created_date").then(setCampaigns);
  }

  async function remove(id) {
    if (confirm("Delete this campaign?")) {
      await Campaign.delete(id);
      Campaign.list("-created_date").then(setCampaigns);
    }
  }

  const statuses = ["All", "Planning", "Active", "Completed", "Cancelled"];
  const filtered = filter === "All" ? campaigns : campaigns.filter(c => c.status === filter);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>🚀 Campaigns</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Brand launch campaigns — Phase 1 trials & Phase 2 growth</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ New Campaign</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {["Planning","Active","Completed","Cancelled"].map(s => (
          <div key={s} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${STATUS_COLORS[s].color}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: STATUS_COLORS[s].color }}>{campaigns.filter(c => c.status === s).length}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, background: filter === s ? BRAND_COLOR : "#fff", color: filter === s ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filter === s ? 600 : 400 }}>{s}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 10px rgba(124,58,237,0.07)", border: "1px solid #f3f0ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#1a0533" }}>{c.title}</div>
                    <span style={{ padding: "2px 9px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: STATUS_COLORS[c.status]?.bg, color: STATUS_COLORS[c.status]?.color }}>{c.status}</span>
                    <span style={{ padding: "2px 9px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: PHASE_COLORS[c.phase]?.bg, color: PHASE_COLORS[c.phase]?.color }}>{c.phase}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                    🏢 {c.brand_name} · 📅 {c.start_date} → {c.end_date}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                    {[
                      { label: "Trial Price", value: c.trial_price ? `$${parseFloat(c.trial_price).toLocaleString()}` : "—" },
                      { label: "Discount", value: c.discount_pct ? `${c.discount_pct}%` : "—" },
                      { label: "Target Influencers", value: c.target_influencers || "—" },
                      { label: "Platform Revenue", value: c.platform_commission ? `$${parseFloat(c.platform_commission).toLocaleString()}` : "—" },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: "#faf5ff", borderRadius: 9, padding: "10px 14px" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: BRAND_COLOR }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  {c.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 10, fontStyle: "italic" }}>📝 {c.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, marginLeft: 20 }}>
                  <button onClick={() => { setForm({ ...c }); setEditing(c.id); setShowForm(true); }} style={{ background: "#ede9fe", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 13, padding: "6px 14px", borderRadius: 8, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => remove(c.id)} style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, padding: "6px 14px", borderRadius: 8, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>No campaigns yet. Create your first brand campaign!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 540, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editing ? "Edit" : "New"} Campaign</h2>

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Campaign Title</label>
              <input type="text" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Brand</label>
              <select value={form.brand_id || ""} onChange={e => setForm({ ...form, brand_id: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                <option value="">— Select Brand —</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            {[
              { label: "Start Date", key: "start_date", type: "date" },
              { label: "End Date", key: "end_date", type: "date" },
              { label: "Trial Price ($)", key: "trial_price", type: "number" },
              { label: "Discount (%)", key: "discount_pct", type: "number" },
              { label: "Target Influencers", key: "target_influencers", type: "number" },
              { label: "Platform Commission Earned ($)", key: "platform_commission", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}

            {[
              { label: "Status", key: "status", options: ["Planning", "Active", "Completed", "Cancelled"] },
              { label: "Phase", key: "phase", options: ["Phase 1 - Trial", "Phase 2 - Growth"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 9, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
