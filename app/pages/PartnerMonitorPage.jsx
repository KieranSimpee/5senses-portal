import { useState, useEffect } from "react";
import { WilsonDeliverable, PlatformCheck } from "@/api/entities";

const STATUS_COLORS = {
  "Completed": { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  "In Progress": { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  "Pending": { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
  "Overdue": { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  "Tested ✅": { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  "Not Tested": { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "Failed ❌": { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS["Pending"];
  return (
    <span style={{ background: s.bg, color: s.text, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function SectionHeader({ emoji, title, subtitle, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <div style={{ background: color, borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{emoji}</div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1a0533" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default function PartnerMonitorPage() {
  const [wilsonItems, setWilsonItems] = useState([]);
  const [vybdItems, setVydbItems] = useState([]);
  const [platformChecks, setPlatformChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("wilson");

  useEffect(() => {
    Promise.all([
      WilsonDeliverable.list(),
      PlatformCheck.list(),
    ]).then(([deliverables, checks]) => {
      const wilson = deliverables.filter(d => d.month?.toLowerCase().includes("month") || !d.month?.toLowerCase().includes("vybd"));
      const vybd = deliverables.filter(d => d.month?.toLowerCase().includes("vybd"));
      setWilsonItems(wilson);
      setVydbItems(vybd);
      setPlatformChecks(checks);
      setLoading(false);
    });
  }, []);

  // Stats
  const wilsonDone = wilsonItems.filter(i => i.status === "Completed").length;
  const wilsonTotal = wilsonItems.length;
  const vydbDone = vydbItems.filter(i => i.status === "Completed").length;
  const vydbTotal = vydbItems.length;
  const checksPassed = platformChecks.filter(i => i.status === "Tested ✅").length;
  const checksTotal = platformChecks.length;

  const tabs = [
    { id: "wilson", label: "Wilson (FundFluent)", emoji: "🏗️", done: wilsonDone, total: wilsonTotal, color: "#7C3AED" },
    { id: "vybd", label: "Vybd Partnership", emoji: "🤝", done: vydbDone, total: vydbTotal, color: "#0ea5e9" },
    { id: "platform", label: "Platform Health", emoji: "🔬", done: checksPassed, total: checksTotal, color: "#10b981" },
  ];

  const groupBy = (arr, key) => arr.reduce((acc, item) => {
    const k = item[key] || "Other";
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

  const wilsonGroups = groupBy(wilsonItems, "month");
  const vydbGroups = groupBy(vydbItems, "month");
  const platformGroups = groupBy(platformChecks, "tier");

  function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric" });
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#7C3AED", fontWeight: 700, fontSize: 16 }}>
      Loading Partner Monitor...
    </div>
  );

  return (
    <div style={{ padding: 28, maxWidth: 960, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a0533" }}>🔭 Partner Monitor</h1>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Wilson (FundFluent) · Vybd Partnership · Platform Health — all in one place</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {tabs.map(tab => {
          const pct = tab.total > 0 ? Math.round((tab.done / tab.total) * 100) : 0;
          return (
            <div key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ background: activeTab === tab.id ? `linear-gradient(135deg, ${tab.color}15, ${tab.color}05)` : "#fff", border: `2px solid ${activeTab === tab.id ? tab.color : "#e2e8f0"}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{tab.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: activeTab === tab.id ? tab.color : "#475569", marginBottom: 8 }}>{tab.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#1a0533" }}>{tab.done}<span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>/{tab.total}</span></div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>completed</div>
              <div style={{ background: "#f1f5f9", borderRadius: 6, height: 5 }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: tab.color, transition: "width 0.4s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px 28px" }}>

        {/* WILSON TAB */}
        {activeTab === "wilson" && (
          <>
            <SectionHeader emoji="🏗️" title="Wilson (FundFluent) — Deliverables" subtitle="Monthly build milestones and payment tracking · HKD $35,000/month" color="#ede9fe" />
            {Object.entries(wilsonGroups).map(([month, items]) => (
              <div key={month} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, paddingBottom: 6, borderBottom: "1.5px solid #ede9fe" }}>{month}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 110px 90px", gap: 10, alignItems: "center", padding: "12px 16px", background: "#fafafa", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533", marginBottom: 3 }}>{item.deliverable}</div>
                        {item.notes && <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.notes.length > 80 ? item.notes.slice(0, 80) + "..." : item.notes}</div>}
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Agreed</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{formatDate(item.agreed_date)}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Actual</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: item.actual_date ? "#059669" : "#94a3b8" }}>{formatDate(item.actual_date)}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <StatusBadge status={item.status} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: item.payment_released ? "#d1fae5" : "#fff7ed", color: item.payment_released ? "#065f46" : "#c2410c" }}>
                          {item.payment_released ? "💸 Paid" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* VYBD TAB */}
        {activeTab === "vybd" && (
          <>
            <SectionHeader emoji="🤝" title="Vybd — Partnership Tracker" subtitle="US market execution partnership milestones · hello@vybd.ai" color="#e0f2fe" />
            {Object.entries(vydbGroups).map(([phase, items]) => (
              <div key={phase} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, paddingBottom: 6, borderBottom: "1.5px solid #e0f2fe" }}>{phase}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 10, alignItems: "center", padding: "12px 16px", background: "#f0f9ff", borderRadius: 10, border: "1px solid #e0f2fe" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533", marginBottom: 3 }}>{item.deliverable}</div>
                        {item.notes && <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.notes.length > 100 ? item.notes.slice(0, 100) + "..." : item.notes}</div>}
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Target Date</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{formatDate(item.agreed_date)}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* PLATFORM HEALTH TAB */}
        {activeTab === "platform" && (
          <>
            <SectionHeader emoji="🔬" title="Platform Health Checks" subtitle="Simplex-ity Shopify platform verification checklist — updated weekly" color="#d1fae5" />
            {Object.entries(platformGroups).map(([tier, items]) => {
              const tierColor = tier.includes("1") ? "#ef4444" : tier.includes("2") ? "#f59e0b" : "#3b82f6";
              return (
                <div key={tier} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tierColor, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, paddingBottom: 6, borderBottom: `1.5px solid ${tierColor}20` }}>{tier}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px 160px", gap: 10, alignItems: "center", padding: "12px 16px", background: "#fafafa", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533", marginBottom: 3 }}>{item.surface}</div>
                          {item.action_required && (
                            <div style={{ fontSize: 11, color: "#f59e0b", display: "flex", alignItems: "center", gap: 4 }}>
                              ⚠️ {item.action_required}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Week</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>W{item.week_number || "—"}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <StatusBadge status={item.status} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          {item.notes && <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.notes.length > 50 ? item.notes.slice(0, 50) + "..." : item.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
