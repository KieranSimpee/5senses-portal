import { useState, useEffect } from "react";
import { ComplianceItem, Expense, Note, VaultItem, Document } from "@/api/entities";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: BRAND.white,
    borderRadius: 14,
    padding: "20px 22px",
    boxShadow: "0 2px 12px rgba(140,130,252,0.08)",
    border: `1px solid ${BRAND.neutralGrey}`,
    ...style
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{
    fontFamily: "'Exo 2', 'Montserrat', sans-serif",
    fontWeight: 700, fontSize: 11,
    color: BRAND.primaryLilac,
    textTransform: "uppercase", letterSpacing: 1.5,
    marginBottom: 14
  }}>{children}</div>
);

const StatCard = ({ label, value, sub, color, onClick }) => (
  <div onClick={onClick} style={{
    background: BRAND.white,
    borderRadius: 12,
    padding: "18px 20px",
    boxShadow: "0 2px 10px rgba(140,130,252,0.07)",
    border: `1px solid ${BRAND.neutralGrey}`,
    cursor: onClick ? "pointer" : "default",
    borderTop: `3px solid ${color || BRAND.primaryLilac}`,
    transition: "box-shadow 0.15s",
  }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: color || BRAND.accentViolet, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.bodyText, marginTop: 5 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>{sub}</div>}
  </div>
);

export default function Dashboard({ setPage }) {
  const [compliance, setCompliance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    Promise.all([
      ComplianceItem.list(),
      Expense.list(),
      Note.list(),
      Document.list(),
    ]).then(([c, e, n, d]) => {
      setCompliance(c);
      setExpenses(e);
      setNotes(n);
      setDocs(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const overdue = compliance.filter(c => c.status !== "Done" && c.status !== "Completed" && new Date(c.due_date) < today);
  const upcoming30 = compliance.filter(c => c.status !== "Done" && c.status !== "Completed" && new Date(c.due_date) >= today && (new Date(c.due_date) - today) / 86400000 <= 30);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const pinnedNotes = notes.filter(n => n.pinned);
  const recentDocs = [...docs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);

  const daysUntil = (date) => Math.ceil((new Date(date) - today) / 86400000);
  const statusColor = (s) => {
    if (s === "Done" || s === "Completed") return "#22c55e";
    if (s === "overdue") return "#ef4444";
    if (s === "In Progress") return BRAND.primaryLilac;
    return "#f59e0b";
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: BRAND.primaryLilac }}>
      Loading 5S Portal...
    </div>
  );

  return (
    <div style={{ padding: "28px 28px", fontFamily: "'Montserrat', 'Inter', sans-serif", color: BRAND.bodyText }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: "'Exo 2', 'Montserrat', sans-serif",
          fontWeight: 800, fontSize: 22, color: BRAND.bodyText, lineHeight: 1.2
        }}>
          Good {today.getHours() < 12 ? "morning" : today.getHours() < 18 ? "afternoon" : "evening"}, Kieran 👋
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
          {today.toLocaleDateString("en-HK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · SIMPLEX-ITY Operations
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard
          label="Overdue Items"
          value={overdue.length}
          sub="Need immediate action"
          color="#ef4444"
          onClick={() => setPage("compliance")}
        />
        <StatCard
          label="Due in 30 Days"
          value={upcoming30.length}
          sub="Upcoming compliance"
          color="#f59e0b"
          onClick={() => setPage("compliance")}
        />
        <StatCard
          label="Total Expenses"
          value={`HKD ${totalExpenses.toLocaleString()}`}
          sub={`${expenses.length} records`}
          color={BRAND.primaryLilac}
          onClick={() => setPage("expenses")}
        />
        <StatCard
          label="Documents"
          value={docs.length}
          sub={`${pinnedNotes.length} pinned notes`}
          color={BRAND.accentViolet}
          onClick={() => setPage("documents")}
        />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

        {/* Overdue Compliance */}
        <Card>
          <SectionTitle>🚨 Overdue Compliance</SectionTitle>
          {overdue.length === 0 ? (
            <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>✓ All clear — nothing overdue</div>
          ) : (
            overdue.slice(0, 5).map(item => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 0", borderBottom: `1px solid ${BRAND.neutralGrey}`
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.bodyText }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.category}</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "#ef4444",
                  background: "#fef2f2", padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", marginLeft: 8
                }}>
                  {Math.abs(daysUntil(item.due_date))}d overdue
                </div>
              </div>
            ))
          )}
          <button onClick={() => setPage("compliance")} style={{
            marginTop: 12, width: "100%", padding: "8px",
            background: BRAND.lavenderWash, border: `1px solid ${BRAND.softLilac}`,
            borderRadius: 8, color: BRAND.accentViolet, fontSize: 12, fontWeight: 600,
            cursor: "pointer"
          }}>View All Compliance →</button>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <SectionTitle>📅 Upcoming — Next 30 Days</SectionTitle>
          {upcoming30.length === 0 ? (
            <div style={{ color: "#888", fontSize: 13 }}>No deadlines in the next 30 days.</div>
          ) : (
            upcoming30.slice(0, 5).map(item => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 0", borderBottom: `1px solid ${BRAND.neutralGrey}`
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.bodyText }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.category}</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: daysUntil(item.due_date) <= 7 ? "#f59e0b" : BRAND.primaryLilac,
                  background: daysUntil(item.due_date) <= 7 ? "#fffbeb" : BRAND.lavenderWash,
                  padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", marginLeft: 8
                }}>
                  {daysUntil(item.due_date)}d left
                </div>
              </div>
            ))
          )}
          <button onClick={() => setPage("compliance")} style={{
            marginTop: 12, width: "100%", padding: "8px",
            background: BRAND.lavenderWash, border: `1px solid ${BRAND.softLilac}`,
            borderRadius: 8, color: BRAND.accentViolet, fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>View Full Calendar →</button>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* Recent Documents */}
        <Card>
          <SectionTitle>📁 Recent Documents</SectionTitle>
          {recentDocs.length === 0 ? (
            <div style={{ color: "#888", fontSize: 13 }}>No documents yet.</div>
          ) : (
            recentDocs.map(doc => (
              <div key={doc.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0", borderBottom: `1px solid ${BRAND.neutralGrey}`
              }}>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.bodyText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.title}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>{doc.category}</div>
                </div>
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noreferrer" style={{
                    fontSize: 11, color: BRAND.accentViolet, marginLeft: 8, textDecoration: "none",
                    fontWeight: 600, whiteSpace: "nowrap"
                  }}>View →</a>
                )}
              </div>
            ))
          )}
          <button onClick={() => setPage("documents")} style={{
            marginTop: 12, width: "100%", padding: "8px",
            background: BRAND.lavenderWash, border: `1px solid ${BRAND.softLilac}`,
            borderRadius: 8, color: BRAND.accentViolet, fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>View All Documents →</button>
        </Card>

        {/* Pinned Notes */}
        <Card>
          <SectionTitle>📌 Pinned Notes</SectionTitle>
          {pinnedNotes.length === 0 ? (
            <div style={{ color: "#888", fontSize: 13 }}>No pinned notes yet.</div>
          ) : (
            pinnedNotes.slice(0, 4).map(note => (
              <div key={note.id} style={{
                padding: "10px 0", borderBottom: `1px solid ${BRAND.neutralGrey}`
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.bodyText }}>{note.title}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 3, lineHeight: 1.5 }}>
                  {note.content?.slice(0, 90)}{note.content?.length > 90 ? "..." : ""}
                </div>
                {note.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontSize: 9, fontWeight: 600, color: BRAND.primaryLilac,
                        background: BRAND.lavenderWash, padding: "2px 6px", borderRadius: 10,
                        textTransform: "uppercase", letterSpacing: 0.5
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          <button onClick={() => setPage("notes")} style={{
            marginTop: 12, width: "100%", padding: "8px",
            background: BRAND.lavenderWash, border: `1px solid ${BRAND.softLilac}`,
            borderRadius: 8, color: BRAND.accentViolet, fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>View All Notes →</button>
        </Card>

      </div>
    </div>
  );
}
