import { useState, useEffect } from "react";
import { Expense } from "@/api/entities";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
};

const CATEGORIES = ["All", "Professional Services", "Software & Subscriptions", "Domain & Hosting", "Branding & Design", "Marketing & Advertising", "Office & Admin"];

const catColor = (cat) => {
  const map = {
    "Professional Services": "#8c82fc",
    "Software & Subscriptions": "#5e50fb",
    "Domain & Hosting": "#06b6d4",
    "Branding & Design": "#ec4899",
    "Marketing & Advertising": "#f59e0b",
    "Office & Admin": "#64748b",
  };
  return map[cat] || "#8c82fc";
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Expense.list().then(data => {
      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
      setLoading(false);
    });
  }, []);

  const filtered = expenses.filter(e => {
    const matchCat = filter === "All" || e.category === filter;
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.vendor?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalHKD = filtered.filter(e => e.currency === "HKD").reduce((s, e) => s + (e.amount || 0), 0);
  const totalUSD = filtered.filter(e => e.currency === "USD").reduce((s, e) => s + (e.amount || 0), 0);

  // Category breakdown
  const catTotals = {};
  expenses.forEach(e => {
    if (!catTotals[e.category]) catTotals[e.category] = 0;
    if (e.currency === "HKD") catTotals[e.category] += e.amount || 0;
    else if (e.currency === "USD") catTotals[e.category] += (e.amount || 0) * 7.8;
  });

  return (
    <div style={{ padding: "28px", fontFamily: "'Montserrat', 'Inter', sans-serif", color: BRAND.bodyText }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Exo 2', 'Montserrat', sans-serif", fontWeight: 800, fontSize: 20, color: BRAND.bodyText }}>
          Finance & Expenses
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
          Subscriptions · Invoices · Vendor payments · Cost tracking
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total (HKD)", value: `HKD ${totalHKD.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: BRAND.accentViolet },
          { label: "Total (USD)", value: `USD ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: BRAND.primaryLilac },
          { label: "Total Records", value: filtered.length, color: "#06b6d4" },
          { label: "Vendors", value: new Set(filtered.map(e => e.vendor)).size, color: "#ec4899" },
        ].map((s, i) => (
          <div key={i} style={{
            background: BRAND.white, borderRadius: 12,
            padding: "16px 18px",
            border: `1px solid ${BRAND.neutralGrey}`,
            borderTop: `3px solid ${s.color}`,
            boxShadow: "0 2px 8px rgba(140,130,252,0.07)"
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div style={{
        background: BRAND.white, borderRadius: 14, padding: "18px 20px",
        border: `1px solid ${BRAND.neutralGrey}`, marginBottom: 18,
        boxShadow: "0 2px 8px rgba(140,130,252,0.07)"
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
          Spend by Category (HKD equivalent)
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([cat, total]) => (
            <div key={cat} style={{
              padding: "8px 14px", borderRadius: 10,
              background: BRAND.lavenderWash,
              border: `1px solid ${BRAND.softLilac}`,
            }}>
              <div style={{ fontSize: 10, color: catColor(cat), fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{cat}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: BRAND.bodyText, marginTop: 2 }}>
                HKD {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Search expenses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            border: `1px solid ${BRAND.neutralGrey}`,
            fontSize: 13, outline: "none", width: 220,
            fontFamily: "'Montserrat', sans-serif"
          }}
        />
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "7px 12px", borderRadius: 20,
            border: filter === cat ? `1.5px solid ${BRAND.primaryLilac}` : `1px solid ${BRAND.neutralGrey}`,
            background: filter === cat ? BRAND.lavenderWash : BRAND.white,
            color: filter === cat ? BRAND.accentViolet : "#666",
            fontSize: 11, fontWeight: filter === cat ? 600 : 400,
            cursor: "pointer"
          }}>{cat}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: BRAND.white, borderRadius: 14, border: `1px solid ${BRAND.neutralGrey}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(140,130,252,0.07)" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
          padding: "11px 20px", background: BRAND.lavenderWash,
          borderBottom: `1px solid ${BRAND.neutralGrey}`,
          fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac,
          textTransform: "uppercase", letterSpacing: 1
        }}>
          <div>Description</div>
          <div>Vendor</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Date</div>
        </div>

        {loading && <div style={{ padding: 30, textAlign: "center", color: BRAND.primaryLilac }}>Loading...</div>}
        {!loading && filtered.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#888", fontSize: 13 }}>No expenses found.</div>}

        {filtered.map((item, idx) => (
          <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
            padding: "13px 20px",
            borderBottom: idx < filtered.length - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
            cursor: "pointer", transition: "background 0.1s",
            background: selected?.id === item.id ? BRAND.lavenderWash : "transparent"
          }}
            onMouseEnter={e => e.currentTarget.style.background = BRAND.lavenderWash}
            onMouseLeave={e => e.currentTarget.style.background = selected?.id === item.id ? BRAND.lavenderWash : "transparent"}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.bodyText }}>{item.title}</div>
              {item.notes && <div style={{ fontSize: 10, color: "#888", marginTop: 2, maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.notes}</div>}
            </div>
            <div style={{ fontSize: 12, color: "#555", alignSelf: "center" }}>{item.vendor}</div>
            <div style={{ alignSelf: "center" }}>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: catColor(item.category),
                background: BRAND.lavenderWash,
                padding: "2px 8px", borderRadius: 10
              }}>{item.category}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accentViolet, alignSelf: "center" }}>
              {item.currency} {(item.amount || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "#666", alignSelf: "center" }}>
              {item.date ? new Date(item.date).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div style={{
          marginTop: 16, background: BRAND.white, borderRadius: 14,
          border: `1.5px solid ${BRAND.softLilac}`,
          padding: "20px 24px", boxShadow: "0 2px 16px rgba(140,130,252,0.10)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 15, color: BRAND.bodyText }}>{selected.title}</div>
              <div style={{ fontSize: 11, color: BRAND.primaryLilac, fontWeight: 600, marginTop: 3 }}>{selected.vendor} · {selected.category}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              background: BRAND.lavenderWash, border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 12, color: BRAND.accentViolet, cursor: "pointer", fontWeight: 600
            }}>Close</button>
          </div>
          {selected.notes && (
            <div style={{ marginTop: 12, fontSize: 13, color: "#555", lineHeight: 1.65, whiteSpace: "pre-line" }}>{selected.notes}</div>
          )}
          {selected.receipt_url && (
            <a href={selected.receipt_url} target="_blank" rel="noreferrer" style={{
              display: "inline-block", marginTop: 10,
              color: BRAND.accentViolet, fontSize: 12, fontWeight: 600,
              background: BRAND.lavenderWash, padding: "6px 14px", borderRadius: 8, textDecoration: "none"
            }}>View Receipt / Invoice →</a>
          )}
        </div>
      )}
    </div>
  );
}
