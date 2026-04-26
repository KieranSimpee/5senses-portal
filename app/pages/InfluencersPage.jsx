import { useState, useEffect } from "react";
import { Influencer } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";
const TIER_COLORS = {
  "Trial": { bg: "#fef3c7", color: "#d97706" },
  "Rising": { bg: "#e0f2fe", color: "#0277bd" },
  "Pro": { bg: "#ede9fe", color: "#7C3AED" },
  "Superstar": { bg: "#fce7f3", color: "#be185d" },
};
const STATUS_COLORS = {
  "Active": { bg: "#d1fae5", color: "#065f46" },
  "Pending": { bg: "#fef9c3", color: "#854d0e" },
  "Suspended": { bg: "#fee2e2", color: "#991b1b" },
  "Banned": { bg: "#1a0533", color: "#fff" },
};
const EMPTY = { name: "", handle: "", platform: "Instagram", email: "", phone: "", reliability_score: 100, tier: "Trial", commission_rate: 10, status: "Pending", ai_certified: false, follower_count: "", premium_shop: false, notes: "" };

function ScoreBar({ score }) {
  const color = score >= 90 ? "#059669" : score >= 75 ? "#7C3AED" : score >= 70 ? "#d97706" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 7, background: "#f0f0f0", borderRadius: 4 }}>
        <div style={{ width: `${score}%`, height: "100%", borderRadius: 4, background: color, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36 }}>{score}%</span>
    </div>
  );
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await Influencer.list("-reliability_score");
    setInfluencers(data);
    setLoading(false);
  }

  async function save() {
    const payload = { ...form, reliability_score: parseFloat(form.reliability_score) || 0, commission_rate: parseFloat(form.commission_rate) || 0, follower_count: parseFloat(form.follower_count) || 0 };
    if (editing) await Influencer.update(editing, payload);
    else await Influencer.create(payload);
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id) {
    if (confirm("Remove this influencer?")) { await Influencer.delete(id); load(); }
  }

  const tiers = ["All", "Trial", "Rising", "Pro", "Superstar"];
  const filtered = influencers.filter(inf =>
    (filter === "All" || inf.tier === filter) &&
    (!search || inf.name?.toLowerCase().includes(search.toLowerCase()) || inf.handle?.toLowerCase().includes(search.toLowerCase()))
  );
  const atRisk = influencers.filter(i => (i.reliability_score || 0) < 75);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>⭐ Influencers</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Reliability scores, tiers & commission tracking</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Influencer</button>
      </div>

      {/* At Risk Alert */}
      {atRisk.length > 0 && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13 }}>{atRisk.length} influencer{atRisk.length > 1 ? "s" : ""} below 75% reliability</div>
            <div style={{ fontSize: 12, color: "#b91c1c" }}>{atRisk.map(i => i.name).join(", ")} — review immediately</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {["Trial","Rising","Pro","Superstar"].map(tier => (
          <div key={tier} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${TIER_COLORS[tier].color}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: TIER_COLORS[tier].color }}>{influencers.filter(i => i.tier === tier).length}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{tier}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {tiers.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, background: filter === t ? BRAND_COLOR : "#fff", color: filter === t ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filter === t ? 600 : 400 }}>{t}</button>
        ))}
        <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 10, border: "1px solid #e2d9f3", fontSize: 13, outline: "none" }} />
      </div>

      {/* Cards */}
      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(inf => (
            <div key={inf.id} style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(124,58,237,0.08)", border: (inf.reliability_score || 0) < 70 ? "1.5px solid #fca5a5" : "1.5px solid #f3f0ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a0533" }}>{inf.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>@{inf.handle} · {inf.platform}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <span style={{ padding: "2px 9px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: TIER_COLORS[inf.tier]?.bg, color: TIER_COLORS[inf.tier]?.color }}>{inf.tier}</span>
                  {inf.tier === "Superstar" && <span style={{ fontSize: 10, color: "#be185d", fontWeight: 600 }}>✦ Data Verified</span>}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>RELIABILITY SCORE</span>
                  {(inf.reliability_score || 0) < 70 && <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>🚨 RED CARD RISK</span>}
                </div>
                <ScoreBar score={inf.reliability_score || 0} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "#faf5ff", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: BRAND_COLOR }}>{inf.commission_rate || 0}%</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>Commission</div>
                </div>
                <div style={{ background: "#faf5ff", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: BRAND_COLOR }}>{inf.follower_count ? (inf.follower_count >= 1000 ? `${(inf.follower_count/1000).toFixed(1)}K` : inf.follower_count) : "—"}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>Followers</div>
                </div>
                <div style={{ background: "#faf5ff", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14 }}>{inf.ai_certified ? "✅" : "❌"}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>AI Cert</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ padding: "3px 9px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[inf.status]?.bg, color: STATUS_COLORS[inf.status]?.color }}>{inf.status}</span>
                <div>
                  <button onClick={() => { setForm({ ...inf }); setEditing(inf.id); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 12, marginRight: 8 }}>Edit</button>
                  <button onClick={() => remove(inf.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12 }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#94a3b8" }}>No influencers found. Add your first one!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editing ? "Edit" : "Add"} Influencer</h2>
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Handle / Username", key: "handle", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "text" },
              { label: "Follower Count", key: "follower_count", type: "number" },
              { label: "Reliability Score (0-100)", key: "reliability_score", type: "number" },
              { label: "Commission Rate (%)", key: "commission_rate", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            {[
              { label: "Platform", key: "platform", options: ["Instagram", "TikTok", "YouTube", "XiaoHongShu", "Multi-Platform"] },
              { label: "Tier", key: "tier", options: ["Trial", "Rising", "Pro", "Superstar"] },
              { label: "Status", key: "status", options: ["Pending", "Active", "Suspended", "Banned"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display: "flex", gap: 16, marginBottom: 13 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={form.ai_certified || false} onChange={e => setForm({ ...form, ai_certified: e.target.checked })} />
                AI Certified
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={form.premium_shop || false} onChange={e => setForm({ ...form, premium_shop: e.target.checked })} />
                Premium Shop ($20/mo)
              </label>
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
