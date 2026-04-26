import { useState, useEffect } from "react";
import { BuildProject, BuildCheckpoint } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";

const CATEGORY_COLORS = {
  "Dashboard":   { bg: "#ede9fe", color: "#7C3AED", icon: "📊" },
  "Template":    { bg: "#e0f2fe", color: "#0277bd", icon: "📄" },
  "Interface":   { bg: "#fce7f3", color: "#be185d", icon: "🖥️" },
  "Feature":     { bg: "#d1fae5", color: "#065f46", icon: "⚙️" },
  "Integration": { bg: "#fef3c7", color: "#d97706", icon: "🔗" },
  "Content":     { bg: "#f3e8ff", color: "#9333ea", icon: "✍️" },
  "Operations":  { bg: "#f1f5f9", color: "#475569", icon: "🏗️" },
};

const AUDIENCE_COLORS = {
  "Admin (Kieran)": { bg: "#1a0533", color: "#c4b5fd" },
  "Brand":          { bg: "#fef3c7", color: "#d97706" },
  "Influencer":     { bg: "#fce7f3", color: "#be185d" },
  "Customer":       { bg: "#d1fae5", color: "#065f46" },
  "All":            { bg: "#ede9fe", color: "#7C3AED" },
};

const STATUS_COLORS = {
  "Not Started": { bg: "#f1f5f9", color: "#64748b" },
  "In Progress": { bg: "#e0f2fe", color: "#0277bd" },
  "Review":      { bg: "#fef3c7", color: "#d97706" },
  "Done":        { bg: "#d1fae5", color: "#065f46" },
};

const PRIORITY_COLORS = {
  "Critical": { bg: "#fee2e2", color: "#dc2626" },
  "High":     { bg: "#fef3c7", color: "#d97706" },
  "Medium":   { bg: "#e0f2fe", color: "#0277bd" },
  "Low":      { bg: "#f1f5f9", color: "#64748b" },
};

const CP_STATUS_COLORS = {
  "Pending":     { bg: "#f1f5f9", color: "#64748b" },
  "In Progress": { bg: "#e0f2fe", color: "#0277bd" },
  "Done":        { bg: "#d1fae5", color: "#065f46" },
  "Blocked":     { bg: "#fee2e2", color: "#dc2626" },
};

const EMPTY_PROJECT = { name: "", category: "Dashboard", audience: "Admin (Kieran)", status: "Not Started", priority: "High", due_date: "", description: "", notes: "", progress: 0 };
const EMPTY_CP = { title: "", description: "", status: "Pending", order: 1, due_date: "", notes: "" };

export default function BuildTrackerPage() {
  const [projects, setProjects] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCPForm, setShowCPForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingCP, setEditingCP] = useState(null);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [cpForm, setCpForm] = useState(EMPTY_CP);
  const [filterAudience, setFilterAudience] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (selected) loadCheckpoints(selected.id); }, [selected]);

  async function loadAll() {
    setLoading(true);
    const data = await BuildProject.list("-created_date");
    setProjects(data);
    setLoading(false);
  }

  async function loadCheckpoints(pid) {
    const data = await BuildCheckpoint.filter({ project_id: pid });
    setCheckpoints(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
  }

  async function saveProject() {
    const payload = { ...projectForm, progress: parseFloat(projectForm.progress) || 0 };
    if (editingProject) await BuildProject.update(editingProject, payload);
    else await BuildProject.create(payload);
    setShowProjectForm(false); setEditingProject(null); loadAll();
  }

  async function saveCP() {
    const payload = { ...cpForm, project_id: selected.id, project_name: selected.name, order: parseInt(cpForm.order) || 1 };
    if (editingCP) await BuildCheckpoint.update(editingCP, payload);
    else await BuildCheckpoint.create(payload);
    setShowCPForm(false); setEditingCP(null); loadCheckpoints(selected.id);
    // Auto-update project progress
    const allCPs = await BuildCheckpoint.filter({ project_id: selected.id });
    const done = allCPs.filter(c => c.status === "Done").length;
    const pct = allCPs.length > 0 ? Math.round((done / allCPs.length) * 100) : 0;
    await BuildProject.update(selected.id, { progress: pct });
    loadAll();
  }

  async function toggleCPDone(cp) {
    const newStatus = cp.status === "Done" ? "Pending" : "Done";
    await BuildCheckpoint.update(cp.id, { status: newStatus });
    // Recalculate progress
    const allCPs = await BuildCheckpoint.filter({ project_id: cp.project_id });
    const updated = allCPs.map(c => c.id === cp.id ? { ...c, status: newStatus } : c);
    const done = updated.filter(c => c.status === "Done").length;
    const pct = updated.length > 0 ? Math.round((done / updated.length) * 100) : 0;
    await BuildProject.update(cp.project_id, { progress: pct });
    loadCheckpoints(cp.project_id);
    loadAll();
  }

  async function deleteProject(id) {
    if (confirm("Delete this build item?")) { await BuildProject.delete(id); setSelected(null); loadAll(); }
  }

  async function deleteCP(id) {
    if (confirm("Delete checkpoint?")) { await BuildCheckpoint.delete(id); loadCheckpoints(selected.id); }
  }

  const audiences = ["All", "Admin (Kieran)", "Brand", "Influencer", "Customer"];
  const statuses = ["All", "Not Started", "In Progress", "Review", "Done"];

  let filtered = projects;
  if (filterAudience !== "All") filtered = filtered.filter(p => p.audience === filterAudience);
  if (filterStatus !== "All") filtered = filtered.filter(p => p.status === filterStatus);

  const totalDone = projects.filter(p => p.status === "Done").length;
  const totalInProgress = projects.filter(p => p.status === "In Progress").length;
  const totalCritical = projects.filter(p => p.priority === "Critical" && p.status !== "Done").length;
  const overallProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length) : 0;

  // Detail view
  if (selected) {
    const doneCount = checkpoints.filter(c => c.status === "Done").length;
    const progress = checkpoints.length > 0 ? Math.round((doneCount / checkpoints.length) * 100) : 0;

    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 14, marginBottom: 16, padding: 0, fontWeight: 600 }}>← Back to Build Tracker</button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>{CATEGORY_COLORS[selected.category]?.icon}</span>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a0533" }}>{selected.name}</h1>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: CATEGORY_COLORS[selected.category]?.bg, color: CATEGORY_COLORS[selected.category]?.color }}>{selected.category}</span>
              <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: AUDIENCE_COLORS[selected.audience]?.bg, color: AUDIENCE_COLORS[selected.audience]?.color }}>For: {selected.audience}</span>
              <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>{selected.status}</span>
              <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: PRIORITY_COLORS[selected.priority]?.bg, color: PRIORITY_COLORS[selected.priority]?.color }}>{selected.priority}</span>
            </div>
            {selected.description && <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 13, maxWidth: 600 }}>{selected.description}</p>}
          </div>
          <button onClick={() => { setCpForm(EMPTY_CP); setEditingCP(null); setShowCPForm(true); }}
            style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Checkpoint</button>
        </div>

        {/* Progress */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 22px", marginBottom: 24, boxShadow: "0 2px 10px rgba(124,58,237,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Build Progress</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: BRAND_COLOR }}>{doneCount}/{checkpoints.length} checkpoints done · {progress}%</span>
          </div>
          <div style={{ background: "#f0eaf8", borderRadius: 8, height: 12 }}>
            <div style={{ background: progress === 100 ? "#059669" : "linear-gradient(90deg, #7C3AED, #a855f7)", borderRadius: 8, height: 12, width: `${progress}%`, transition: "width 0.4s" }} />
          </div>
          {selected.due_date && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>📅 Due: {selected.due_date}</div>}
        </div>

        {/* Checkpoints */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a0533", marginBottom: 14 }}>✅ Checkpoints</h3>
        {checkpoints.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 14 }}>
            No checkpoints yet. Add the steps needed to complete this build item.
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {checkpoints.map((cp, i) => (
            <div key={cp.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(124,58,237,0.06)", display: "flex", gap: 14, alignItems: "flex-start", border: cp.status === "Blocked" ? "1.5px solid #fca5a5" : "1.5px solid #f3f0ff", opacity: cp.status === "Done" ? 0.75 : 1 }}>
              {/* Checkbox */}
              <button onClick={() => toggleCPDone(cp)} style={{ width: 24, height: 24, borderRadius: 6, border: cp.status === "Done" ? "none" : "2px solid #d8d0f0", background: cp.status === "Done" ? BRAND_COLOR : "#fff", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", marginTop: 2 }}>
                {cp.status === "Done" ? "✓" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>#{cp.order}</span>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0533", textDecoration: cp.status === "Done" ? "line-through" : "none" }}>{cp.title}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 10, fontWeight: 700, background: CP_STATUS_COLORS[cp.status]?.bg, color: CP_STATUS_COLORS[cp.status]?.color }}>{cp.status}</span>
                </div>
                {cp.description && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{cp.description}</div>}
                {cp.due_date && <div style={{ fontSize: 11, color: "#94a3b8" }}>📅 {cp.due_date}</div>}
                {cp.notes && <div style={{ fontSize: 11, color: "#7C3AED", marginTop: 4, fontStyle: "italic" }}>💬 {cp.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <select value={cp.status} onChange={async e => { await BuildCheckpoint.update(cp.id, { status: e.target.value }); loadCheckpoints(selected.id); }}
                  style={{ padding: "4px 8px", borderRadius: 7, border: "1px solid #e2d9f3", fontSize: 11, color: "#334155", cursor: "pointer" }}>
                  {["Pending","In Progress","Done","Blocked"].map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => { setCpForm({ ...cp }); setEditingCP(cp.id); setShowCPForm(true); }} style={{ background: "#ede9fe", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 11, padding: "4px 10px", borderRadius: 7, fontWeight: 600 }}>Edit</button>
                <button onClick={() => deleteCP(cp.id)} style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11, padding: "4px 10px", borderRadius: 7 }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* CP Modal */}
        {showCPForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: 28, width: 460, boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#1a0533" }}>{editingCP ? "Edit" : "Add"} Checkpoint</h3>
              {[
                { label: "Checkpoint Title", key: "title", type: "text" },
                { label: "Description", key: "description", type: "text" },
                { label: "Step Order #", key: "order", type: "number" },
                { label: "Due Date", key: "due_date", type: "date" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 3, fontWeight: 600 }}>{f.label}</label>
                  <input type={f.type} value={cpForm[f.key] || ""} onChange={e => setCpForm({ ...cpForm, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2d9f3", fontSize: 13, boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 3, fontWeight: 600 }}>Status</label>
                <select value={cpForm.status || "Pending"} onChange={e => setCpForm({ ...cpForm, status: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2d9f3", fontSize: 13 }}>
                  {["Pending","In Progress","Done","Blocked"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 3, fontWeight: 600 }}>Notes / Reminder</label>
                <textarea value={cpForm.notes || ""} onChange={e => setCpForm({ ...cpForm, notes: e.target.value })}
                  rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2d9f3", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowCPForm(false)} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                <button onClick={saveCP} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main list view
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>🏗️ Build Tracker</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Track every dashboard, template & interface you need to build</p>
        </div>
        <button onClick={() => { setProjectForm(EMPTY_PROJECT); setEditingProject(null); setShowProjectForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Build Item</button>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Overall Progress", value: `${overallProgress}%`, color: BRAND_COLOR, icon: "🚀" },
          { label: "In Progress", value: totalInProgress, color: "#0277bd", icon: "⚙️" },
          { label: "Completed", value: totalDone, color: "#059669", icon: "✅" },
          { label: "Critical Pending", value: totalCritical, color: "#dc2626", icon: "🔴" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 10px rgba(124,58,237,0.07)", borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Category Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginBottom: 22 }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, style]) => (
          <div key={cat} style={{ background: style.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{style.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: style.color }}>{projects.filter(p => p.category === cat).length}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{cat}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {audiences.map(a => (
            <button key={a} onClick={() => setFilterAudience(a)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: filterAudience === a ? BRAND_COLOR : "#fff", color: filterAudience === a ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filterAudience === a ? 600 : 400 }}>{a}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: filterStatus === s ? "#1a0533" : "#fff", color: filterStatus === s ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filterStatus === s ? 600 : 400 }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map(p => {
            const pct = p.progress || 0;
            return (
              <div key={p.id} onClick={() => setSelected(p)} style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(124,58,237,0.07)", border: `1.5px solid ${p.priority === "Critical" && p.status !== "Done" ? "#fca5a5" : "#f3f0ff"}`, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(124,58,237,0.07)"; }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 22 }}>{CATEGORY_COLORS[p.category]?.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0533" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{p.category}</div>
                    </div>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 10, fontWeight: 700, background: PRIORITY_COLORS[p.priority]?.bg, color: PRIORITY_COLORS[p.priority]?.color }}>{p.priority}</span>
                </div>

                {p.description && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>{p.description.slice(0, 80)}{p.description.length > 80 ? "..." : ""}</div>}

                {/* Progress bar */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? "#059669" : BRAND_COLOR }}>{pct}%</span>
                  </div>
                  <div style={{ background: "#f0eaf8", borderRadius: 6, height: 6 }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: pct === 100 ? "#059669" : "linear-gradient(90deg, #7C3AED, #a855f7)", transition: "width 0.3s" }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 10, fontWeight: 600, background: STATUS_COLORS[p.status]?.bg, color: STATUS_COLORS[p.status]?.color }}>{p.status}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 10, fontWeight: 600, background: AUDIENCE_COLORS[p.audience]?.bg, color: AUDIENCE_COLORS[p.audience]?.color }}>{p.audience}</span>
                  </div>
                  {p.due_date && <span style={{ fontSize: 10, color: "#94a3b8" }}>📅 {p.due_date}</span>}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setProjectForm({ ...p }); setEditingProject(p.id); setShowProjectForm(true); }}
                    style={{ background: "#ede9fe", border: "none", cursor: "pointer", color: BRAND_COLOR, fontSize: 11, padding: "5px 12px", borderRadius: 7, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => deleteProject(p.id)}
                    style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11, padding: "5px 12px", borderRadius: 7 }}>Delete</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#94a3b8" }}>
              No build items yet. Add your first one to get started!
            </div>
          )}
        </div>
      )}

      {/* Project Modal */}
      {showProjectForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editingProject ? "Edit" : "Add"} Build Item</h2>

            {[
              { label: "Name / Title", key: "name", type: "text" },
              { label: "Due Date", key: "due_date", type: "date" },
              { label: "Progress % (0-100)", key: "progress", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={projectForm[f.key] || ""} onChange={e => setProjectForm({ ...projectForm, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}

            {[
              { label: "Category", key: "category", options: ["Dashboard", "Template", "Interface", "Feature", "Integration", "Content", "Operations"] },
              { label: "For Audience", key: "audience", options: ["Admin (Kieran)", "Brand", "Influencer", "Customer", "All"] },
              { label: "Status", key: "status", options: ["Not Started", "In Progress", "Review", "Done"] },
              { label: "Priority", key: "priority", options: ["Critical", "High", "Medium", "Low"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <select value={projectForm[f.key] || ""} onChange={e => setProjectForm({ ...projectForm, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Description</label>
              <textarea value={projectForm.description || ""} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Notes</label>
              <textarea value={projectForm.notes || ""} onChange={e => setProjectForm({ ...projectForm, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowProjectForm(false)} style={{ padding: "10px 22px", borderRadius: 9, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={saveProject} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
