import { useState, useEffect } from "react";
import { Expense } from "@/api/entities";

const EMPTY_FORM = {
  title: "", amount: "", currency: "HKD", category: "Office",
  date: "", vendor: "", notes: "", status: "Pending", payment_method: "Bank Transfer"
};

const CATEGORY_COLORS = {
  "Office": "#4f8ef7", "Salaries": "#9c27b0", "MPF": "#00897b",
  "Marketing": "#f4511e", "Professional Fees": "#1565c0",
  "Government Fees": "#6d4c41", "Travel": "#f9a825",
  "Utilities": "#558b2f", "Software": "#0288d1", "Other": "#757575"
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
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
  const filtered = filter === "All" ? expenses : expenses.filter(e => e.category === filter);
  const totalHKD = filtered.filter(e => e.currency === "HKD").reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  function openAdd() { setForm({ ...EMPTY_FORM, date: new Date().toISOString().split("T")[0] }); setEditing(null); setShowForm(true); }
  function openEdit(item) { setForm({ ...item }); setEditing(item.id); setShowForm(true); }

  async function handleSave() {
    if (editing) await Expense.update(editing, form);
    else await Expense.create(form);
    setShowForm(false);
    loadExpenses();
  }

  async function handleDelete(id) {
    if (confirm("Delete this expense?")) { await Expense.delete(id); loadExpenses(); }
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>💰 Expenses</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>Track all company expenditure</p>
        </div>
        <button onClick={openAdd} style={{ background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Expense</button>
      </div>

      {/* Summary Card */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total (HKD)", value: `HK$${totalHKD.toLocaleString()}`, color: "#4f8ef7" },
          { label: "Total Entries", value: filtered.length, color: "#9c27b0" },
          { label: "Categories", value: categories.length - 1, color: "#00897b" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: "#7b8db0", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
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

      {/* List */}
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(exp => (
            <div key={exp.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: CATEGORY_COLORS[exp.category] || "#ccc", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#1a1f2e", fontSize: 14 }}>{exp.title}</div>
                <div style={{ fontSize: 12, color: "#9aa3b2", marginTop: 2 }}>{exp.vendor} · {exp.date} · {exp.payment_method}</div>
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>{exp.category}</div>
              <div style={{ fontWeight: 700, color: "#1a1f2e", fontSize: 16, minWidth: 100, textAlign: "right" }}>
                {exp.currency} {parseFloat(exp.amount || 0).toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(exp)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 13 }}>Edit</button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 13 }}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No expenses yet. Add one!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>{editing ? "Edit" : "Add"} Expense</h2>
            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Amount", key: "amount", type: "number" },
              { label: "Date", key: "date", type: "date" },
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
              { label: "Category", key: "category", options: ["Office", "Salaries", "MPF", "Marketing", "Professional Fees", "Government Fees", "Travel", "Utilities", "Software", "Other"] },
              { label: "Payment Method", key: "payment_method", options: ["Cash", "Bank Transfer", "Credit Card", "Cheque", "Other"] },
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
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
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
