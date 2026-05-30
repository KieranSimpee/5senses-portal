import { useState, useEffect } from "react";
import { ComplianceItem, Expense, Note, Document, Invoice } from "@/api/entities";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
  textSecondary: "#5a5870",
  textMuted: "#9896ad",
};

const shadow = {
  xs: "0 1px 2px rgba(140,130,252,0.06)",
  sm: "0 2px 8px rgba(140,130,252,0.10)",
  md: "0 4px 16px rgba(140,130,252,0.12)",
};

// ── Sub-components ──────────────────────────────────────────

function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: "'Exo', 'Exo 2', sans-serif",
      fontSize: 9, fontWeight: 700,
      color: BRAND.textMuted,
      textTransform: "uppercase", letterSpacing: 1.8,
      marginBottom: 10,
    }}>{children}</div>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: BRAND.white,
      borderRadius: 12,
      border: `1px solid ${BRAND.neutralGrey}`,
      boxShadow: shadow.sm,
      padding: "20px 22px",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.15s, transform 0.15s",
      ...style,
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = shadow.md; e.currentTarget.style.transform = "translateY(-1px)"; }}}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = shadow.sm; e.currentTarget.style.transform = "translateY(0)"; }}}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, accentColor, icon, onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: accentColor + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "'Exo', 'Exo 2', sans-serif",
            fontSize: 24, fontWeight: 800,
            color: accentColor, lineHeight: 1,
          }}>{value}</div>
          <div style={{ fontSize: 11, color: BRAND.textMuted, marginTop: 3 }}>{sub}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.bodyText, marginTop: 12 }}>{label}</div>
      <div style={{ height: 2, borderRadius: 1, background: accentColor + "30", marginTop: 10 }}>
        <div style={{ height: 2, width: "40%", borderRadius: 1, background: accentColor }} />
      </div>
    </Card>
  );
}

function Tag({ children, color = BRAND.accentViolet }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 20,
      fontSize: 10, fontWeight: 600,
      background: color + "15", color: color,
      border: `1px solid ${color}30`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function ViewAllBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      marginTop: 14, width: "100%", padding: "9px",
      background: BRAND.lavenderWash,
      border: `1px solid ${BRAND.softLilac}`,
      borderRadius: 8, color: BRAND.accentViolet,
      fontSize: 12, fontWeight: 600, cursor: "pointer",
      transition: "background 0.15s",
      fontFamily: "'Montserrat', sans-serif",
    }}
    onMouseEnter={e => e.currentTarget.style.background = BRAND.softLilac + "60"}
    onMouseLeave={e => e.currentTarget.style.background = BRAND.lavenderWash}
    >{label} →</button>
  );
}

// ── Main Dashboard ───────────────────────────────────────────

export default function Dashboard({ setPage }) {
  const [compliance, setCompliance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    Promise.all([
      ComplianceItem.list(),
      Expense.list(),
      Note.list(),
      Document.list(),
      Invoice.list().catch(() => []),
    ]).then(([c, e, n, d, inv]) => {
      setCompliance(c);
      setExpenses(e);
      setNotes(n);
      setDocs(d);
      setInvoices(inv || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const overdue = compliance.filter(c =>
    c.status !== "Done" && c.status !== "Completed" &&
    c.due_date && new Date(c.due_date) < today
  );
  const upcoming30 = compliance.filter(c =>
    c.status !== "Done" && c.status !== "Completed" &&
    c.due_date && new Date(c.due_date) >= today &&
    (new Date(c.due_date) - today) / 86400000 <= 30
  );
  const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const paidInvoices = invoices.filter(i => i.status === "paid");
  const totalRevenue = paidInvoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
  const pinnedNotes = notes.filter(n => n.pinned);
  const recentDocs = [...docs]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  const daysUntil = (date) => Math.ceil((new Date(date) - today) / 86400000);

  const greeting = today.getHours() < 12 ? "Good morning" :
                   today.getHours() < 18 ? "Good afternoon" : "Good evening";

  const dateStr = today.toLocaleDateString("en-HK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100%", flexDirection: "column", gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: `linear-gradient(135deg, ${BRAND.accentViolet}, ${BRAND.primaryLilac})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 800, color: "#fff",
        animation: "pulse 1.5s infinite",
      }}>5S</div>
      <div style={{ color: BRAND.textMuted, fontSize: 13 }}>Loading 5S Portal…</div>
    </div>
  );

  return (
    <div style={{
      padding: "28px 32px",
      fontFamily: "'Montserrat', 'Calibri', system-ui, sans-serif",
      color: BRAND.bodyText,
      maxWidth: 1200,
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.8,
          textTransform: "uppercase", color: BRAND.textMuted,
          fontFamily: "'Exo', sans-serif", margin: "0 0 6px",
        }}>SIMPLEX-ITY HQ</p>
        <h1 style={{
          fontFamily: "'Exo', 'Exo 2', sans-serif",
          fontWeight: 800, fontSize: 26, color: BRAND.bodyText,
          lineHeight: 1.2, margin: 0,
        }}>{greeting}, Kieran 👋</h1>
        <p style={{ fontSize: 13, color: BRAND.textMuted, marginTop: 5, marginBottom: 0 }}>
          {dateStr} · Operations Overview
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14, marginBottom: 24,
      }}>
        <StatCard
          label="Overdue Items"
          value={overdue.length}
          sub="Need immediate action"
          accentColor="#ef4444"
          icon="⚠️"
          onClick={() => setPage("compliance")}
        />
        <StatCard
          label="Due in 30 Days"
          value={upcoming30.length}
          sub="Upcoming compliance"
          accentColor="#f59e0b"
          icon="📅"
          onClick={() => setPage("compliance")}
        />
        <StatCard
          label="Total Expenses"
          value={`HK$${Math.round(totalExpenses).toLocaleString()}`}
          sub={`${expenses.length} records`}
          accentColor={BRAND.primaryLilac}
          icon="💸"
          onClick={() => setPage("expenses")}
        />
        <StatCard
          label="Revenue Collected"
          value={`HK$${Math.round(totalRevenue).toLocaleString()}`}
          sub={`${paidInvoices.length} paid invoices`}
          accentColor={BRAND.accentViolet}
          icon="📈"
          onClick={() => setPage("invoices")}
        />
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

        {/* Overdue Compliance */}
        <Card>
          <Eyebrow>Compliance · Overdue</Eyebrow>
          {overdue.length === 0 ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              color: "#16a34a", fontSize: 13, fontWeight: 600,
              background: "#f0fdf4", borderRadius: 8, padding: "10px 14px",
            }}>
              <span>✓</span> All clear — nothing overdue
            </div>
          ) : (
            <div>
              {overdue.slice(0, 5).map((item, i) => (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < Math.min(overdue.length, 5) - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                }}>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.bodyText, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: BRAND.textMuted, marginTop: 2 }}>{item.category}</div>
                  </div>
                  <Tag color="#ef4444">{Math.abs(daysUntil(item.due_date))}d overdue</Tag>
                </div>
              ))}
            </div>
          )}
          <ViewAllBtn label="View All Compliance" onClick={() => setPage("compliance")} />
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <Eyebrow>Compliance · Next 30 Days</Eyebrow>
          {upcoming30.length === 0 ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              color: BRAND.textMuted, fontSize: 13,
              background: BRAND.lavenderWash, borderRadius: 8, padding: "10px 14px",
            }}>
              No deadlines in the next 30 days
            </div>
          ) : (
            <div>
              {upcoming30.slice(0, 5).map((item, i) => {
                const days = daysUntil(item.due_date);
                const urgent = days <= 7;
                return (
                  <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0",
                    borderBottom: i < Math.min(upcoming30.length, 5) - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                  }}>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.bodyText }}>{item.title}</div>
                      <div style={{ fontSize: 10, color: BRAND.textMuted, marginTop: 2 }}>{item.category}</div>
                    </div>
                    <Tag color={urgent ? "#f59e0b" : BRAND.primaryLilac}>{days}d left</Tag>
                  </div>
                );
              })}
            </div>
          )}
          <ViewAllBtn label="View Full Calendar" onClick={() => setPage("compliance")} />
        </Card>
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* Recent Documents */}
        <Card>
          <Eyebrow>Documents · Recent</Eyebrow>
          {recentDocs.length === 0 ? (
            <div style={{ color: BRAND.textMuted, fontSize: 13 }}>No documents uploaded yet.</div>
          ) : (
            <div>
              {recentDocs.map((doc, i) => (
                <div key={doc.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 0",
                  borderBottom: i < recentDocs.length - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                }}>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: BRAND.bodyText,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{doc.title}</div>
                    <div style={{ fontSize: 10, color: BRAND.textMuted, marginTop: 1 }}>{doc.category}</div>
                  </div>
                  {doc.file_url && (
                    <a href={doc.file_url} target="_blank" rel="noreferrer" style={{
                      fontSize: 11, color: BRAND.accentViolet, marginLeft: 8,
                      textDecoration: "none", fontWeight: 600,
                      padding: "3px 8px", borderRadius: 6,
                      background: BRAND.lavenderWash,
                    }}>Open</a>
                  )}
                </div>
              ))}
            </div>
          )}
          <ViewAllBtn label="All Documents" onClick={() => setPage("documents")} />
        </Card>

        {/* Pinned Notes + Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Pinned Notes */}
          <Card style={{ flex: 1 }}>
            <Eyebrow>Notes · Pinned</Eyebrow>
            {pinnedNotes.length === 0 ? (
              <div style={{ color: BRAND.textMuted, fontSize: 13 }}>No pinned notes yet.</div>
            ) : (
              pinnedNotes.slice(0, 3).map((note, i) => (
                <div key={note.id} style={{
                  padding: "8px 0",
                  borderBottom: i < Math.min(pinnedNotes.length, 3) - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.bodyText }}>{note.title}</div>
                  {note.content && (
                    <div style={{
                      fontSize: 11, color: BRAND.textMuted, marginTop: 2,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{note.content}</div>
                  )}
                </div>
              ))
            )}
            <ViewAllBtn label="All Notes" onClick={() => setPage("notes")} />
          </Card>

          {/* Quick Nav */}
          <Card>
            <Eyebrow>Quick Access</Eyebrow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "🔐 Vault", page: "vault" },
                { label: "🧾 Invoices", page: "invoices" },
                { label: "📣 Campaigns", page: "campaigns" },
                { label: "◉ Brands", page: "brands" },
              ].map(item => (
                <button key={item.page} onClick={() => setPage(item.page)} style={{
                  padding: "9px 10px",
                  background: BRAND.lavenderWash,
                  border: `1px solid ${BRAND.softLilac}`,
                  borderRadius: 8, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: BRAND.accentViolet,
                  textAlign: "left", transition: "all 0.15s",
                  fontFamily: "'Montserrat', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = BRAND.softLilac + "50"; e.currentTarget.style.borderColor = BRAND.primaryLilac; }}
                onMouseLeave={e => { e.currentTarget.style.background = BRAND.lavenderWash; e.currentTarget.style.borderColor = BRAND.softLilac; }}
                >{item.label}</button>
              ))}
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
