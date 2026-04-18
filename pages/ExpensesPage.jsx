import { useState, useEffect } from "react";
import { Expense } from "@/api/entities";

const EMPTY_FORM = {
  title: "", amount: "", currency: "HKD", category: "Office",
  date: "", vendor: "", notes: "", status: "Pending", payment_method: "Bank Transfer"
};

const CAT_COLORS = ["#8b7fd4","#a89ee0","#6c5ce7","#b8aee8","#5a4fa8","#9b93c9","#c4bdf0","#7b6fc4","#d4cff5","#4a3f9a"];

export default function ExpensesPage({ brand = {} }) {
  const P = {
    purple: "#8b7fd4", purpleLight: "#b8aee8", purplePale: "#f0edfb",
    purpleDark: "#5a4fa8", text: "#2d2847", textMuted: "#9b93c9", bg: "#f7f5ff", ...brand
  };

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
  const totalHKD = filtered.filter(e => e.currency === "HKD").reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

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

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${P.purpleLight}`, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: P.text };

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "0.04em" }}>💰 Expenses</h1>
          <p style={{ margin: "5px 0 0", color: P.textMuted, fontSize: 13, letterSpacing: "0.05em" }}>TRACK ALL COMPANY EXPENDITURE</p>
        </div>
        <button onClick={openAdd} style={{ background: P.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>+ ADD EXPENSE</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 26 }}>
        {[
          { label: "Total (HKD)", value: `HK$${totalHKD.toLocaleString()}` },
          { label: "Total Entries", value: filtered.length },
          { label: "Categories", value: categories.length - 1 },
        ].map((c, i) => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(139,127,212,0.1)", borderTop: `4px solid ${CAT_COLORS[i]}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: CAT_COLORS[i] }}>{c.value}</div>
            <div style={{ fontSize: 12, color: P.textMuted, marginTop: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filter === cat ? P.purple : "#e0dcf5"}`,
            cursor: "pointer", fontSize: 12, background: filter === cat ? P.purple : "#fff",
            color: filter === cat ? "#fff" : P.textMuted, fontWeight: filter === cat ? 600 : 400,
            letterSpacing: "0.05em", transition: "all 0.2s"
          }}>{cat}</button>
        ))}
      </div>

      {/* List */}
      {loading ? <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((exp, i) => (
            <div key={exp.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 22px", boxShadow: "0 2px 8px rgba(139,127,212,0.08)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: P.text, fontSize: 14 }}>{exp.title}</div>
                <div style={{ fontSize: 11, color: P.textMuted, marginTop: 2, letterSpacing: "0.03em" }}>{exp.vendor} · {exp.date} · {exp.payment_method}</div>
              </div>
              <div style={{ fontSize: 11, color: P.textMuted, letterSpacing: "0.05em" }}>{exp.category}</div>
              <div style={{ fontWeight: 700, color: P.purpleDark, fontSize: 15, minWidth: 110, textAlign: "right" }}>
                {exp.currency} {parseFloat(exp.amount || 0).toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(exp)} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c5c", fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>No expenses yet — add your first one!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,40,71,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: 480, maxHeight: "82vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(139,127,212,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 17, color: P.text, letterSpacing: "0.06em" }}>{editing ? "EDIT" : "ADD"} EXPENSE</h2>
            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Amount", key: "amount", type: "number" },
              { label: "Date", key: "date", type: "date" },
              { label: "Vendor", key: "vendor", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
              </div>
            ))}
            {[
              { label: "Currency", key: "currency", options: ["HKD", "USD", "CNY", "EUR", "GBP"] },
              { label: "Category", key: "category", options: ["Office", "Salaries", "MPF", "Marketing", "Professional Fees", "Government Fees", "Travel", "Utilities", "Software", "Other"] },
              { label: "Payment Method", key: "payment_method", options: ["Cash", "Bank Transfer", "Credit Card", "Cheque", "Other"] },
              { label: "Status", key: "status", options: ["Pending", "Approved", "Rejected", "Reimbursed"] },
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
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
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
