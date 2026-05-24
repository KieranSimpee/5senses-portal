import { useState, useEffect } from "react";
import { ComplianceItem } from "@/api/entities";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
};

const statusColor = (status, dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  if (status === "Done" || status === "Completed") return { bg: "#f0fdf4", text: "#16a34a", label: "Done" };
  if (due < today) return { bg: "#fef2f2", text: "#ef4444", label: "Overdue" };
  const days = Math.ceil((due - today) / 86400000);
  if (days <= 14) return { bg: "#fffbeb", text: "#d97706", label: `${days}d left` };
  return { bg: BRAND.lavenderWash, text: BRAND.primaryLilac, label: `${days}d left` };
};

const CATEGORIES = ["All", "Business Registration", "Tax", "MPF", "Company Secretarial", "Admin", "Office & Admin", "Contracts & Partnerships", "Partnerships"];

export default function CompliancePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    ComplianceItem.list().then(data => {
      const sorted = [...data].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setItems(sorted);
      setLoading(false);
    });
  }, []);

  const filtered = items.filter(i => {
    const matchCat = filter === "All" || i.category === filter;
    const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const today = new Date();
  const overdue = items.filter(i => i.status !== "Done" && i.status !== "Completed" && new Date(i.due_date) < today);
  const upcoming = items.filter(i => i.status !== "Done" && i.status !== "Completed" && new Date(i.due_date) >= today && Math.ceil((new Date(i.due_date) - today) / 86400000) <= 30);

  return (
    <div style={{ padding: "28px", fontFamily: "'Montserrat', 'Inter', sans-serif", color: BRAND.bodyText }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Exo 2', 'Montserrat', sans-serif", fontWeight: 800, fontSize: 20, color: BRAND.bodyText }}>
            Compliance Tracker
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
            HK regulatory deadlines · Business registration · Tax · MPF
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
            padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#ef4444"
          }}>
            🚨 {overdue.length} Overdue
          </div>
          <div style={{
            background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8,
            padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#d97706"
          }}>
            ⚠️ {upcoming.length} Due Soon
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input
          placeholder="Search compliance items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            border: `1px solid ${BRAND.neutralGrey}`,
            fontSize: 13, outline: "none", width: 240,
            fontFamily: "'Montserrat', sans-serif"
          }}
        />
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "7px 14px", borderRadius: 20,
            border: filter === cat ? `1.5px solid ${BRAND.primaryLilac}` : `1px solid ${BRAND.neutralGrey}`,
            background: filter === cat ? BRAND.lavenderWash : BRAND.white,
            color: filter === cat ? BRAND.accentViolet : "#666",
            fontSize: 12, fontWeight: filter === cat ? 600 : 400,
            cursor: "pointer"
          }}>{cat}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", color: BRAND.primaryLilac, padding: 40 }}>Loading...</div>
      ) : (
        <div style={{ background: BRAND.white, borderRadius: 14, border: `1px solid ${BRAND.neutralGrey}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(140,130,252,0.07)" }}>
          {/* Table Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
            padding: "12px 20px", background: BRAND.lavenderWash,
            borderBottom: `1px solid ${BRAND.neutralGrey}`,
            fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac,
            textTransform: "uppercase", letterSpacing: 1
          }}>
            <div>Item</div>
            <div>Category</div>
            <div>Due Date</div>
            <div>Status</div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: 30, textAlign: "center", color: "#888", fontSize: 13 }}>No items found.</div>
          )}

          {filtered.map((item, idx) => {
            const sc = statusColor(item.status, item.due_date);
            return (
              <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "14px 20px",
                borderBottom: idx < filtered.length - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                cursor: "pointer", transition: "background 0.1s",
                background: selected?.id === item.id ? BRAND.lavenderWash : "transparent",
              }}
                onMouseEnter={e => e.currentTarget.style.background = BRAND.lavenderWash}
                onMouseLeave={e => e.currentTarget.style.background = selected?.id === item.id ? BRAND.lavenderWash : "transparent"}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.bodyText }}>{item.title}</div>
                  {item.assigned_to && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.assigned_to}</div>}
                </div>
                <div style={{ fontSize: 12, color: "#666", alignSelf: "center" }}>{item.category}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: BRAND.bodyText, alignSelf: "center" }}>
                  {item.due_date ? new Date(item.due_date).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </div>
                <div style={{ alignSelf: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: sc.text, background: sc.bg,
                    padding: "3px 10px", borderRadius: 20
                  }}>{sc.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div style={{
          marginTop: 18, background: BRAND.white, borderRadius: 14,
          border: `1.5px solid ${BRAND.softLilac}`,
          padding: "20px 24px", boxShadow: "0 2px 16px rgba(140,130,252,0.10)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 16, color: BRAND.bodyText }}>{selected.title}</div>
              <div style={{ fontSize: 11, color: BRAND.primaryLilac, marginTop: 3, fontWeight: 600 }}>{selected.category} · {selected.recurrence || "One-time"}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              background: BRAND.lavenderWash, border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 12, color: BRAND.accentViolet,
              cursor: "pointer", fontWeight: 600
            }}>Close</button>
          </div>
          {selected.description && (
            <div style={{ marginTop: 14, fontSize: 13, color: "#555", lineHeight: 1.65, whiteSpace: "pre-line" }}>{selected.description}</div>
          )}
          {selected.notes && (
            <div style={{ marginTop: 10, background: BRAND.lavenderWash, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: BRAND.bodyText }}>
              <strong>Notes:</strong> {selected.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
