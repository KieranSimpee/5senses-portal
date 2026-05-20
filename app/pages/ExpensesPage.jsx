import { useState, useEffect } from "react";
import { Expense } from "@/api/entities";

const EMPTY_FORM = {
  title: "", amount: "", currency: "HKD", category: "Office",
  date: "", vendor: "", notes: "", status: "Pending", payment_method: "Bank Transfer",
  receipt_url: ""
};

const CATEGORY_COLORS = {
  "Office": "#4f8ef7", "Salaries": "#9c27b0", "MPF": "#00897b",
  "Marketing": "#f4511e", "Professional Fees": "#1565c0",
  "Government Fees": "#6d4c41", "Travel": "#f9a825",
  "Utilities": "#558b2f", "Software": "#0288d1", "Other": "#757575",
  "legal": "#e53935", "design": "#8c82fc", "hosting": "#00bcd4",
  "software": "#0288d1", "office": "#4f8ef7", "Company Registration": "#6d4c41"
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadExpenses(); }, []);

  async function loadExpenses() {
    setLoading(true);
    const data = await Expense.list("-date");
    setExpenses(data);
    setLoading(false);
  }

  const categories = ["All", ...new Set(expenses.map(e => e.category).filter(Boolean))];
  const filtered = expenses
    .filter(e => filter === "All" || e.category === filter)
    .filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.vendor?.toLowerCase().includes(search.toLowerCase()));

  const totalHKD = filtered.filter(e => e.currency === "HKD").reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const recurringTotal = filtered.filter(e => e.recurring).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const withReceipt = filtered.filter(e => e.receipt_url).length;

  function openAdd() { setForm({ ...EMPTY_FORM, date: new Date().toISOString().split("T")[0] }); setEditing(null); setShowForm(true); }
  function openEdit(item) { setForm({ ...item, receipt_url: item.receipt_url || "" }); setEditing(item.id); setShowForm(true); }

  async function handleSave() {
    const payload = { ...form };
    if (!payload.receipt_url) delete payload.receipt_url;
    if (editing) await Expense.update(editing, payload);
    else await Expense.create(payload);
    setShowForm(false);
    loadExpenses();
  }

  async function handleDelete(id) {
    if (confirm("Delete this expense?")) { await Expense.delete(id); loadExpenses(); }
  }

  const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || "#9aa3b2";

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>💰 Expenses</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>Track all company costs and subscriptions</p>
        </div>
        <button onClick={openAdd} style={{ background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Expense</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Spent", value: `HKD ${totalHKD.toLocaleString()}`, color: "#4f8ef7" },
          { label: "Recurring/mo", value: `HKD ${Math.round(recurringTotal).toLocaleString()}`, color: "#9c27b0" },
          { label: "Entries", value: filtered.length, color: "#00897b" },
          { label: "With Receipt", value: `${withReceipt} / ${filtered.length}`, color: withReceipt === filtered.length ? "#00897b" : "#f4511e" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: "#7b8db0", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Search expenses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 20, border: "1px solid #dde2ec", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12,
              background: filter === cat ? "#1a1f2e" : "#fff",
              color: filter === cat ? "#fff" : "#555",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Expense List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(exp => (
            <div key={exp.id} style={{
              background: "#fff", borderRadius: 12, padding: "16px 20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: 14,
              borderLeft: `3px solid ${getCategoryColor(exp.category)}`
            }}>
              {/* Category dot */}
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: getCategoryColor(exp.category), flexShrink: 0 }} />

              {/* Title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: "#1a1f2e", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</div>
                <div style={{ fontSize: 12, color: "#9aa3b2", marginTop: 2 }}>
                  {exp.vendor} · {exp.date}
                  {exp.recurring && <span style={{ marginLeft: 6, background: "#e8e6fe", color: "#8c82fc", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{exp.recurring_cycle}</span>}
                </div>
              </div>

              {/* Category badge */}
              <div style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                background: getCategoryColor(exp.category) + "20",
                color: getCategoryColor(exp.category),
                whiteSpace: "nowrap"
              }}>{exp.category}</div>

              {/* Amount */}
              <div style={{ fontWeight: 700, color: "#1a1f2e", fontSize: 15, minWidth: 110, textAlign: "right", whiteSpace: "nowrap" }}>
                {exp.currency} {parseFloat(exp.amount || 0).toLocaleString()}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                {/* Receipt / Invoice download button */}
                {exp.receipt_url ? (
                  <a
                    href={exp.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#e8f5e9", color: "#2e7d32", border: "none",
                      borderRadius: 6, padding: "5px 12px", fontSize: 12,
                      fontWeight: 600, cursor: "pointer", textDecoration: "none",
                      display: "inline-flex", alignItems: "center", gap: 4
                    }}
                    title="View Receipt / Invoice"
                  >
                    📄 Receipt
                  </a>
                ) : (
                  <span style={{
                    background: "#fafafa", color: "#ccc", border: "1px dashed #ddd",
                    borderRadius: 6, padding: "5px 12px", fontSize: 12, whiteSpace: "nowrap"
                  }}>No receipt</span>
                )}
                <button onClick={() => openEdit(exp)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 13, padding: "4px 8px" }}>Edit</button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 13, padding: "4px 8px" }}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No expenses found.</div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 500, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#1a1f2e" }}>{editing ? "✏️ Edit" : "➕ Add"} Expense</h2>

            {[
              { label: "Title *", key: "title", type: "text" },
              { label: "Amount *", key: "amount", type: "number" },
              { label: "Date *", key: "date", type: "date" },
              { label: "Vendor", key: "vendor", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}

            {[
              { label: "Currency", key: "currency", options: ["HKD", "USD", "CNY", "EUR", "GBP"] },
              { label: "Category", key: "category", options: ["Office", "Salaries", "MPF", "Marketing", "Professional Fees", "Government Fees", "Legal", "Design", "Software", "Hosting", "Travel", "Utilities", "Company Registration", "Other"] },
              { label: "Payment Method", key: "payment_method", options: ["Cash", "Bank Transfer", "Credit Card", "FPS", "Cheque", "Other"] },
              { label: "Status", key: "status", options: ["Pending", "Approved", "Rejected", "Reimbursed"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            {/* Receipt URL field */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>📄 Receipt / Invoice URL</label>
              <input
                type="url"
                placeholder="https://... (paste direct link to PDF or image)"
                value={form.receipt_url || ""}
                onChange={e => setForm({ ...form, receipt_url: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 13, boxSizing: "border-box", color: "#1a1f2e" }}
              />
              {form.receipt_url && (
                <a href={form.receipt_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#4f8ef7", marginTop: 4, display: "inline-block" }}>
                  Preview ↗
                </a>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #dde2ec", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
