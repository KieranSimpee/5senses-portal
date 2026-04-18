import { useState, useEffect } from "react";
import { ComplianceItem } from "@/api/entities";

const STATUS_COLORS = {
  "Upcoming":    { bg: "#ede9fb", color: "#6c5ce7" },
  "In Progress": { bg: "#fff4e0", color: "#d4820a" },
  "Completed":   { bg: "#e4f7ec", color: "#1e8a4a" },
  "Overdue":     { bg: "#fde8e8", color: "#c0392b" },
};

const EMPTY_FORM = {
  title: "", category: "Business Registration", due_date: "", status: "Upcoming",
  description: "", reminder_days_before: 30, recurrence: "Annual", assigned_to: "", notes: ""
};

export default function CompliancePage({ brand = {} }) {
  const P = {
    purple: "#8b7fd4", purpleLight: "#b8aee8", purplePale: "#f0edfb",
    purpleDark: "#5a4fa8", sidebar: "#2d2847", text: "#2d2847",
    textMuted: "#9b93c9", bg: "#f7f5ff", ...brand
  };

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    setLoading(true);
    const data = await ComplianceItem.list("-due_date");
    setItems(data);
    setLoading(false);
  }

  const categories = ["All", ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);

  function openAdd() { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); }
  function openEdit(item) { setForm({ ...item }); setEditing(item.id); setShowForm(true); }

  async function handleSave() {
    if (editing) await ComplianceItem.update(editing, form);
    else await ComplianceItem.create(form);
    setShowForm(false);
    loadItems();
  }

  async function handleDelete(id) {
    if (confirm("Delete this compliance item?")) {
      await ComplianceItem.delete(id);
      loadItems();
    }
  }

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${P.purpleLight}`, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: P.text };

  return (
    <div style={{ padding: 36 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "0.04em" }}>🛡️ Compliance</h1>
          <p style={{ margin: "5px 0 0", color: P.textMuted, fontSize: 13, letterSpacing: "0.05em" }}>HK REGULATORY DEADLINES & REQUIREMENTS</p>
        </div>
        <button onClick={openAdd} style={{ background: P.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>+ ADD ITEM</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filter === cat ? P.purple : "#ddd"}`, cursor: "pointer", fontSize: 12,
            background: filter === cat ? P.purple : "#fff",
            color: filter === cat ? "#fff" : P.textMuted,
            fontWeight: filter === cat ? 600 : 400, letterSpacing: "0.05em", transition: "all 0.2s"
          }}>{cat}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>Loading...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(139,127,212,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: P.purplePale }}>
                {["Title", "Category", "Due Date", "Recurrence", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: P.purple, textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f0edfb", background: i % 2 === 0 ? "#fff" : "#faf9fe" }}>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 600, color: P.text, fontSize: 14 }}>{item.title}</div>
                    {item.description && <div style={{ fontSize: 11, color: P.textMuted, marginTop: 3 }}>{item.description.slice(0, 60)}…</div>}
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 12, color: P.textMuted, letterSpacing: "0.03em" }}>{item.category}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: P.text, fontWeight: 500 }}>{item.due_date}</td>
                  <td style={{ padding: "14px 18px", fontSize: 12, color: P.textMuted }}>{item.recurrence}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                      background: STATUS_COLORS[item.status]?.bg || "#eee",
                      color: STATUS_COLORS[item.status]?.color || "#555"
                    }}>{item.status}</span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <button onClick={() => openEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 12, fontWeight: 600, marginRight: 10 }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c5c", fontSize: 12, fontWeight: 600 }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: P.textMuted }}>No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,40,71,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: 500, maxHeight: "82vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(139,127,212,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 17, color: P.text, letterSpacing: "0.06em" }}>{editing ? "EDIT" : "ADD"} COMPLIANCE ITEM</h2>
            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Due Date", key: "due_date", type: "date" },
              { label: "Assigned To", key: "assigned_to", type: "text" },
              { label: "Reminder (days before)", key: "reminder_days_before", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
              </div>
            ))}
            {[
              { label: "Category", key: "category", options: ["Business Registration", "Annual Return", "Profits Tax", "Audit", "MPF", "IRD Filing", "Company Secretary", "Other"] },
              { label: "Status", key: "status", options: ["Upcoming", "In Progress", "Completed", "Overdue"] },
              { label: "Recurrence", key: "recurrence", options: ["One-time", "Annual", "Quarterly", "Monthly"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${P.purpleLight}`, background: "#fff", cursor: "pointer", fontSize: 13, color: P.textMuted }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: P.purple, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
