import { useState, useEffect } from "react";
import { ComplianceItem } from "@/api/entities";

const STATUS_COLORS = {
  "Upcoming": { bg: "#e8f0fe", color: "#1a73e8" },
  "In Progress": { bg: "#fff8e1", color: "#f9a825" },
  "Completed": { bg: "#e8f5e9", color: "#2e7d32" },
  "Overdue": { bg: "#fce8e8", color: "#c62828" },
};

const EMPTY_FORM = {
  title: "", category: "Business Registration", due_date: "", status: "Upcoming",
  description: "", reminder_days_before: 30, recurrence: "Annual", assigned_to: "", notes: ""
};

export default function CompliancePage() {
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

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>🛡️ Compliance</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>HK regulatory deadlines & requirements</p>
        </div>
        <button onClick={openAdd} style={{
          background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>+ Add Item</button>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13,
            background: filter === cat ? "#1a1f2e" : "#fff",
            color: filter === cat ? "#fff" : "#555",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}>{cat}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div> : (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Title", "Category", "Due Date", "Recurrence", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#7b8db0", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} style={{ borderTop: "1px solid #f0f2f7", background: i % 2 === 0 ? "#fff" : "#fafbfd" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#1a1f2e", fontSize: 14 }}>{item.title}</div>
                    {item.description && <div style={{ fontSize: 12, color: "#9aa3b2", marginTop: 2 }}>{item.description.slice(0, 60)}...</div>}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{item.category}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#1a1f2e", fontWeight: 500 }}>{item.due_date}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{item.recurrence}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: STATUS_COLORS[item.status]?.bg || "#eee",
                      color: STATUS_COLORS[item.status]?.color || "#555"
                    }}>{item.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => openEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", marginRight: 8, fontSize: 13 }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 13 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 500, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>{editing ? "Edit" : "Add"} Compliance Item</h2>
            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Due Date", key: "due_date", type: "date" },
              { label: "Assigned To", key: "assigned_to", type: "text" },
              { label: "Reminder (days before)", key: "reminder_days_before", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            {[
              { label: "Category", key: "category", options: ["Business Registration", "Annual Return", "Profits Tax", "Audit", "MPF", "IRD Filing", "Company Secretary", "Other"] },
              { label: "Status", key: "status", options: ["Upcoming", "In Progress", "Completed", "Overdue"] },
              { label: "Recurrence", key: "recurrence", options: ["One-time", "Annual", "Quarterly", "Monthly"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #dde2ec", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
