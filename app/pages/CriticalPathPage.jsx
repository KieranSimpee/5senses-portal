import { useState, useEffect } from "react";
import { BuildProject, BuildCheckpoint, ActivityLog } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";

const PHASES = [
  {
    id: 1,
    title: "Phase 1 — Foundation",
    subtitle: "Must exist before anything else",
    color: "#dc2626",
    bg: "#fee2e2",
    deadline: "May 2026",
    items: [
      "Admin Control Tower Dashboard",
      "Influencer Reliability Scorecard Interface",
      "Shared Calendar Booking Interface",
      "Brand Onboarding Template",
      "Influencer Onboarding Template",
    ]
  },
  {
    id: 2,
    title: "Phase 2 — Core Platform",
    subtitle: "Required before first brand goes live",
    color: "#d97706",
    bg: "#fef3c7",
    deadline: "Jun 2026",
    items: [
      "Brand Business Center Dashboard",
      "Influencer Mini-Shop HQ Dashboard",
      "Mini-Shop Storefront Interface",
      "AI Certification Module",
      "Commission & Wallet System",
    ]
  },
  {
    id: 3,
    title: "Phase 3 — Intelligence Layer",
    subtitle: "Data & reporting — the retention engine",
    color: "#0277bd",
    bg: "#e0f2fe",
    deadline: "Jul 2026",
    items: [
      "Post-Campaign Diagnostic Report Template",
      "TINT AI Try-On Integration",
      "Membership Tier Upgrade Flow",
    ]
  },
  {
    id: 4,
    title: "Phase 4 — Scale",
    subtitle: "Growth features after platform is stable",
    color: "#059669",
    bg: "#d1fae5",
    deadline: "Aug 2026",
    items: [
      "Competitor Benchmarking Feature",
      "Influencer ROI Ranking Report",
      "Algorithm Management (Cross-pollination)",
    ]
  }
];

export default function CriticalPathPage() {
  const [projects, setProjects] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState(null);

  useEffect(() => {
    Promise.all([
      BuildProject.list("-created_date"),
      BuildCheckpoint.list("-created_date"),
      ActivityLog.list("-created_date"),
    ]).then(([p, c, l]) => {
      setProjects(p);
      setCheckpoints(c);
      setLogs(l);
      setLoading(false);
    });
  }, []);

  function getProjectForItem(name) {
    return projects.find(p => p.name?.toLowerCase().includes(name.toLowerCase().split(" ")[0]) || name.toLowerCase().includes(p.name?.toLowerCase().split(" ")[0]));
  }

  function getPhaseProgress(phase) {
    const matched = phase.items.map(i => getProjectForItem(i)).filter(Boolean);
    if (matched.length === 0) return 0;
    const total = matched.reduce((s, p) => s + (p.progress || 0), 0);
    return Math.round(total / matched.length);
  }

  const overallProgress = projects.length > 0
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length)
    : 0;

  const criticalBlocked = projects.filter(p => p.priority === "Critical" && p.status !== "Done" && p.status !== "In Progress");

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>🗺️ Critical Path</h1>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>What needs to be built before the next step — phased roadmap</p>
      </div>

      {/* Overall Progress Banner */}
      <div style={{ background: "linear-gradient(135deg, #1a0533, #4c1d95)", borderRadius: 16, padding: "24px 28px", marginBottom: 28, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Platform Build Progress</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{overallProgress}% <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}>complete</span></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Total Build Items</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{projects.length}</div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, height: 10 }}>
          <div style={{ width: `${overallProgress}%`, height: "100%", borderRadius: 8, background: "linear-gradient(90deg, #a855f7, #e879f9)", transition: "width 0.5s" }} />
        </div>
        {criticalBlocked.length > 0 && (
          <div style={{ marginTop: 14, background: "rgba(220,38,38,0.3)", borderRadius: 8, padding: "8px 14px", fontSize: 12 }}>
            ⚠️ {criticalBlocked.length} critical item{criticalBlocked.length > 1 ? "s" : ""} not yet started: {criticalBlocked.map(p => p.name).join(", ")}
          </div>
        )}
      </div>

      {/* Phase Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
        {PHASES.map((phase, idx) => {
          const pct = getPhaseProgress(phase);
          const isExpanded = activePhase === phase.id;
          const prevPhase = idx > 0 ? PHASES[idx - 1] : null;
          const prevPct = prevPhase ? getPhaseProgress(prevPhase) : 100;
          const isLocked = prevPct < 50 && idx > 0;

          return (
            <div key={phase.id}>
              {/* Connector arrow */}
              {idx > 0 && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: isLocked ? "#cbd5e1" : "#7C3AED" }}>
                    <div style={{ width: 2, height: 20, background: isLocked ? "#e2e8f0" : "#c4b5fd" }} />
                    <div style={{ fontSize: 16 }}>{isLocked ? "🔒" : "▼"}</div>
                  </div>
                </div>
              )}

              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(124,58,237,0.08)", border: `1.5px solid ${isLocked ? "#e2e8f0" : phase.color + "30"}`, overflow: "hidden", opacity: isLocked ? 0.7 : 1 }}>
                {/* Phase Header */}
                <div onClick={() => setActivePhase(isExpanded ? null : phase.id)}
                  style={{ padding: "20px 24px", cursor: "pointer", borderLeft: `5px solid ${phase.color}`, background: isExpanded ? phase.bg : "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ background: phase.color, color: "#fff", borderRadius: 8, width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{phase.id}</span>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#1a0533" }}>{phase.title}</div>
                        {isLocked && <span style={{ fontSize: 11, color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>Blocked — complete Phase {idx} first</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginLeft: 38 }}>{phase.subtitle} · Deadline: {phase.deadline}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: phase.color }}>{pct}%</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>done</div>
                      </div>
                      <span style={{ fontSize: 18, color: "#94a3b8" }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, marginLeft: 38 }}>
                    <div style={{ background: "#f0eaf8", borderRadius: 6, height: 6 }}>
                      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: pct === 100 ? "#059669" : phase.color, transition: "width 0.4s" }} />
                    </div>
                  </div>
                </div>

                {/* Phase Items (expanded) */}
                {isExpanded && (
                  <div style={{ padding: "16px 24px 20px", borderTop: `1px solid ${phase.color}20` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                      {phase.items.map((item, i) => {
                        const proj = getProjectForItem(item);
                        return (
                          <div key={i} style={{ background: phase.bg, borderRadius: 10, padding: "12px 16px", border: `1px solid ${phase.color}25` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533", flex: 1 }}>{item}</div>
                              {proj && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: proj.status === "Done" ? "#d1fae5" : proj.status === "In Progress" ? "#e0f2fe" : "#f1f5f9", color: proj.status === "Done" ? "#065f46" : proj.status === "In Progress" ? "#0277bd" : "#64748b", flexShrink: 0, marginLeft: 6 }}>{proj.status}</span>}
                            </div>
                            {proj && (
                              <>
                                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 5, height: 5, marginBottom: 4 }}>
                                  <div style={{ width: `${proj.progress || 0}%`, height: "100%", borderRadius: 5, background: phase.color }} />
                                </div>
                                <div style={{ fontSize: 10, color: "#64748b" }}>{proj.progress || 0}% · {proj.priority}</div>
                              </>
                            )}
                            {!proj && <div style={{ fontSize: 11, color: "#94a3b8" }}>Not in tracker yet</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Log */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#1a0533" }}>📋 Activity Log</h3>
        {loading ? <div style={{ color: "#94a3b8", fontSize: 13 }}>Loading...</div> : logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>No activity recorded yet. Actions you take will appear here automatically.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {logs.slice(0, 20).map(log => (
              <div key={log.id} style={{ display: "flex", gap: 12, padding: "10px 14px", background: "#fafafa", borderRadius: 9, alignItems: "flex-start" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", minWidth: 80, paddingTop: 1 }}>{log.date}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ padding: "1px 7px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "#ede9fe", color: BRAND_COLOR, marginRight: 8 }}>{log.area}</span>
                  <span style={{ fontSize: 13, color: "#1a0533", fontWeight: 600 }}>{log.action}</span>
                  {log.detail && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{log.detail}</div>}
                </div>
                {log.related_name && <div style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{log.related_name}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
