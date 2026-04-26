import { useState, useEffect } from "react";
import { Brand } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";

const TIER_INFO = {
  "Trial": { color: "#d97706", bg: "#fef3c7", fee: "20% Commission", content: "Basic Insights (free)", influencers: "5-10 matched" },
  "Essential": { color: "#0277bd", bg: "#e0f2fe", fee: "$400/mo", content: "1x Blog + 1x Live", influencers: "1 Rising Star (Nano)" },
  "Professional": { color: "#7C3AED", bg: "#ede9fe", fee: "$900/mo", content: "2x Blogs + 4x Lives", influencers: "2 Star (Micro)" },
  "Enterprise": { color: "#be185d", bg: "#fce7f3", fee: "$2,500/mo", content: "5x Blogs + 10x Lives", influencers: "4 Star + 1 Superstar" },
};

const STATUS_COLORS = {
  "Active": { bg: "#d1fae5", color: "#065f46" },
  "Pending": { bg: "#fef9c3", color: "#854d0e" },
  "Inactive": { bg: "#f1f5f9", color: "#475569" },
  "Churned": { bg: "#fee2e2", color: "#991b1b" },
};

const EMPTY = { name: "", contact_name: "", contact_email: "", tier: "Trial", status: "Pending", membership_fee: "", category: "", country: "Hong Kong", tint_integrated: false, notes: "" };

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTiers, setShowTiers] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await Brand.list("-created_date");
    setBrands(data);
    setLoading(false);
  }

  async function save() {
    // Auto-set membership fee based on tier
    const tierFees = { "Trial": 0, "Essential": 400, "Professional": 900, "Enterprise": 2500 };
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

  const totalMRR = brands.filter(b => b.status === "Active" && b.tier !== "Trial")
    .reduce((s, b) => s + (parseFloat(b.membership_fee) || 0), 0);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>🏢 Brands</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Manage brand partnerships & membership tiers</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowTiers(!showTiers)} style={{ background: "#ede9fe", color: BRAND_COLOR, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📋 Tier Guide</button>
          <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Brand</button>
        </div>
      </div>

      {/* Tier Guide Panel */}
      {showTiers && (
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(124,58,237,0.08)", border: "1px solid #ede9fe" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a0533", marginBottom: 16 }}>✨ Brand Membership Tiers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {Object.entries(TIER_INFO).map(([tier, info]) => (
              <div key={tier} style={{ borderRadius: 12, padding: 16, background: info.bg, border: `1.5px solid ${info.color}30` }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: info.color, marginBottom: 8 }}>{tier}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a0533", marginBottom: 6 }}>{info.fee}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>👥 {info.influencers}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>📝 {info.content}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 12 }}>* All tiers include 20% platform commission on sales. Campaign Lineup Fee: $1,000+ per event (Phase 2).</div>
        </div>
      )}

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: "4px solid #7C3AED" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#7C3AED" }}>{brands.length}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Total Brands</div>
        </div>
        {["Trial","Essential","Professional","Enterprise"].map(tier => (
          <div key={tier} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${TIER_INFO[tier].color}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: TIER_INFO[tier].color }}>{brands.filter(b => b.tier === tier).length}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{tier}</div>
          </div>
        ))}
      </div>

      {/* MRR Banner */}
      {totalMRR > 0 && (
        <div style={{ background: "linear-gradient(135deg, #7C3AED, #a855f7)", borderRadius: 12, padding: "14px 22px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", letterSpacing: 0.8 }}>Monthly Recurring Revenue (Memberships)</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>${totalMRR.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>/mo</span></div>
          </div>
          <div style={{ fontSize: 30 }}>💰</div>
        </div>
      )}

      {/* Search */}
      <input type="text" placeholder="🔍 Search brands..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", maxWidth: 360, padding: "9px 16px", borderRadius: 10, border: "1px solid #e2d9f3", fontSize: 13, marginBottom: 18, outline: "none", boxSizing: "border-box" }} />

      {/* Table */}
      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(124,58,237,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf5ff" }}>
                {["Brand", "Contact", "Tier", "Status", "Monthly Fee", "TINT", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderTop: "1px solid #f5f0ff", background: i % 2 === 0 ? "#fff" : "#fdfcff" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#1a0533", fontSize: 14 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{b.category}{b.country ? ` · ${b.country}` : ""}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, color: "#334155" }}>{b.contact_name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{b.contact_email}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: TIER_INFO[b.tier]?.bg, color: TIER_INFO[b.tier]?.color }}>{b.tier}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: STATUS_COLORS[b.status]?.bg, color: STATUS_COLORS[b.status]?.color }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#1a0533" }}>
                    {b.tier === "Trial" ? <span style={{ color: "#d97706" }}>20% Commission</span> : b.membership_fee ? `$${parseFloat(b.membership_fee).toLocaleString()}/mo` : TIER_INFO[b.tier]?.fee}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 18 }}>{b.tint_integrated ? "✅" : "—"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => { setForm({ ...b }); setEditing(b.id); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 13, marginRight: 8 }}>Edit</button>
                    <button onClick={() => remove(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 50, color: "#94a3b8" }}>No brands yet. Add your first brand partner!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editing ? "Edit" : "Add"} Brand</h2>

            {/* Tier selector with visual cards */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>Membership Tier</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(TIER_INFO).map(([tier, info]) => (
                  <div key={tier} onClick={() => setForm({ ...form, tier, membership_fee: tier === "Trial" ? 0 : tier === "Essential" ? 400 : tier === "Professional" ? 900 : 2500 })}
                    style={{ borderRadius: 10, padding: "10px 14px", cursor: "pointer", border: `2px solid ${form.tier === tier ? info.color : "#e2d9f3"}`, background: form.tier === tier ? info.bg : "#fff", transition: "all 0.15s" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: info.color }}>{tier}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{info.fee}</div>
                  </div>
                ))}
              </div>
            </div>

            {[
              { label: "Brand Name", key: "name", type: "text" },
              { label: "Contact Name", key: "contact_name", type: "text" },
              { label: "Contact Email", key: "contact_email", type: "email" },
              { label: "Category (e.g. Skincare, Makeup)", key: "category", type: "text" },
              { label: "Country", key: "country", type: "text" },
              { label: "Monthly Fee (USD) — auto-filled by tier", key: "membership_fee", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Status</label>
              <select value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                {["Pending", "Active", "Inactive", "Churned"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="tint" checked={form.tint_integrated || false} onChange={e => setForm({ ...form, tint_integrated: e.target.checked })} />
              <label htmlFor="tint" style={{ fontSize: 13, color: "#334155", cursor: "pointer" }}>✅ TINT AI Try-On Integrated</label>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 9, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save Brand</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
