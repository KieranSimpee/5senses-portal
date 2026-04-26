import { useState, useEffect } from "react";
import { CalendarEvent, Campaign, Influencer } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";
const TYPE_COLORS = {
  "Live Stream": { bg: "#fee2e2", color: "#dc2626", icon: "🎥" },
  "Blog Post": { bg: "#fef3c7", color: "#d97706", icon: "✍️" },
  "Brand Onboarding": { bg: "#d1fae5", color: "#065f46", icon: "🏢" },
  "Campaign Review": { bg: "#ede9fe", color: "#7C3AED", icon: "📊" },
  "AI Certification": { bg: "#e0f2fe", color: "#0277bd", icon: "🤖" },
  "Other": { bg: "#f1f5f9", color: "#475569", icon: "📌" },
};
const STATUS_COLORS = {
  "Scheduled": { bg: "#e0f2fe", color: "#0277bd" },
  "Completed": { bg: "#d1fae5", color: "#065f46" },
  "Late": { bg: "#fef3c7", color: "#d97706" },
  "Missed": { bg: "#fee2e2", color: "#dc2626" },
};
const EMPTY = { title: "", type: "Live Stream", campaign_id: "", campaign_title: "", influencer_id: "", influencer_name: "", brand_name: "", due_date: "", status: "Scheduled", notes: "" };

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Promise.all([CalendarEvent.list("due_date"), Campaign.list(), Influencer.list()]).then(([e, c, i]) => {
      setEvents(e); setCampaigns(c); setInfluencers(i); setLoading(false);
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
    if (editing) await CalendarEvent.update(editing, payload);
    else await CalendarEvent.create(payload);
    setShowForm(false); setEditing(null);
    CalendarEvent.list("due_date").then(setEvents);
  }

  async function remove(id) {
    if (confirm("Delete this event?")) {
      await CalendarEvent.delete(id);
      CalendarEvent.list("due_date").then(setEvents);
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const types = ["All", "Live Stream", "Blog Post", "Brand Onboarding", "Campaign Review", "AI Certification"];
  const filtered = filter === "All" ? events : events.filter(e => e.type === filter);

  const upcoming = filtered.filter(e => e.due_date >= today && e.status === "Scheduled");
  const overdue = filtered.filter(e => e.due_date < today && e.status === "Scheduled");
  const done = filtered.filter(e => ["Completed", "Late", "Missed"].includes(e.status));

  function Section({ title, items, emptyMsg }) {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>{title} ({items.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(ev => (
            <div key={ev.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(124,58,237,0.07)", display: "flex", gap: 14, alignItems: "flex-start", border: ev.status === "Missed" ? "1.5px solid #fca5a5" : "1.5px solid #f3f0ff" }}>
              <div style={{ fontSize: 24, marginTop: 2 }}>{TYPE_COLORS[ev.type]?.icon || "📌"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0533" }}>{ev.title}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: TYPE_COLORS[ev.type]?.bg, color: TYPE_COLORS[ev.type]?.color }}>{ev.type}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[ev.status]?.bg, color: STATUS_COLORS[ev.status]?.color }}>{ev.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {ev.influencer_name && <span>⭐ {ev.influencer_name} · </span>}
                  {ev.campaign_title && <span>🚀 {ev.campaign_title} · </span>}
                  {ev.brand_name && <span>🏢 {ev.brand_name} · </span>}
                  <span>📅 {ev.due_date}</span>
                </div>
                {ev.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontStyle: "italic" }}>{ev.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => { setForm({ ...ev }); setEditing(ev.id); setShowForm(true); }} style={{ background: "#ede9fe", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 12, padding: "5px 12px", borderRadius: 7, fontWeight: 600 }}>Edit</button>
                <button onClick={() => remove(ev.id)} style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, padding: "5px 12px", borderRadius: 7, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>📅 Shared Calendar</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Live streams, blog deadlines & campaign milestones</p>
        </div>
        <button onClick={() => { setForm({ ...EMPTY, due_date: today }); setEditing(null); setShowForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Event</button>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Upcoming", value: upcoming.length, color: "#0277bd" },
          { label: "Overdue", value: overdue.length, color: "#dc2626" },
          { label: "Completed", value: events.filter(e => e.status === "Completed").length, color: "#059669" },
          { label: "Missed", value: events.filter(e => e.status === "Missed").length, color: "#d97706" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: filter === t ? BRAND_COLOR : "#fff", color: filter === t ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filter === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <>
          {overdue.length > 0 && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div style={{ fontWeight: 700, color: "#991b1b", fontSize: 13 }}>{overdue.length} overdue event{overdue.length > 1 ? "s" : ""} — take action now</div>
            </div>
          )}
          <Section title="🔴 Overdue" items={overdue} />
          <Section title="📅 Upcoming" items={upcoming} />
          <Section title="✅ Past" items={done} />
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>No events yet. Add your first calendar event!</div>}
        </>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 500, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editing ? "Edit" : "Add"} Event</h2>

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Title</label>
              <input type="text" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            {[
              { label: "Type", key: "type", options: ["Live Stream", "Blog Post", "Brand Onboarding", "Campaign Review", "AI Certification", "Other"] },
              { label: "Status", key: "status", options: ["Scheduled", "Completed", "Late", "Missed"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

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
                {influencers.map(i => <option key={i.id} value={i.id}>{i.name} (@{i.handle})</option>)}
              </select>
            </div>

            {[
              { label: "Brand Name", key: "brand_name", type: "text" },
              { label: "Due Date", key: "due_date", type: "date" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 9, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
