import { useState, useEffect } from "react";
import { Project, Milestone } from "@/api/entities";

const STATUS_COLORS = {
  "Planning":   { bg: "#ede9fb", color: "#6c5ce7" },
  "Active":     { bg: "#e4f7ec", color: "#1e8a4a" },
  "On Hold":    { bg: "#fff4e0", color: "#d4820a" },
  "Completed":  { bg: "#e8e4fb", color: "#5a4fa8" },
  "Cancelled":  { bg: "#fde8e8", color: "#c0392b" },
};

const MS_STATUS = {
  "Not Started": { bg: "#f0edfb", color: "#9b93c9" },
  "In Progress": { bg: "#fff4e0", color: "#d4820a" },
  "Completed":   { bg: "#e4f7ec", color: "#1e8a4a" },
  "Overdue":     { bg: "#fde8e8", color: "#c0392b" },
};

const EMPTY_PROJECT = { name: "", description: "", client: "", status: "Planning", start_date: "", end_date: "", budget: "", currency: "HKD", progress: 0 };
const EMPTY_MILESTONE = { title: "", description: "", due_date: "", status: "Not Started", assigned_to: "", order: 1 };

export default function ProjectsPage({ brand = {} }) {
  const P = {
    purple: "#8b7fd4", purpleLight: "#b8aee8", purplePale: "#f0edfb",
    purpleDark: "#5a4fa8", text: "#2d2847", textMuted: "#9b93c9", bg: "#f7f5ff", ...brand
  };

  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [milestoneForm, setMilestoneForm] = useState(EMPTY_MILESTONE);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (selected) loadMilestones(selected.id); }, [selected]);

  async function loadProjects() {
    setLoading(true);
    const data = await Project.list("-created_date");
    setProjects(data);
    setLoading(false);
  }

  async function loadMilestones(pid) {
    const data = await Milestone.filter({ project_id: pid });
    setMilestones(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
  }

  async function saveProject() {
    if (editingProject) await Project.update(editingProject, projectForm);
    else await Project.create(projectForm);
    setShowProjectForm(false);
    loadProjects();
  }

  async function saveMilestone() {
    const data = { ...milestoneForm, project_id: selected.id };
    if (editingMilestone) await Milestone.update(editingMilestone, data);
    else await Milestone.create(data);
    setShowMilestoneForm(false);
    loadMilestones(selected.id);
  }

  async function deleteProject(id) {
    if (confirm("Delete this project?")) { await Project.delete(id); setSelected(null); loadProjects(); }
  }

  async function deleteMilestone(id) {
    if (confirm("Delete this milestone?")) { await Milestone.delete(id); loadMilestones(selected.id); }
  }

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${P.purpleLight}`, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: P.text };

  if (selected) {
    return (
      <div style={{ padding: 36 }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 13, marginBottom: 20, padding: 0, fontWeight: 600, letterSpacing: "0.04em" }}>← BACK TO PROJECTS</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "0.04em" }}>{selected.name}</h1>
            <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>{selected.status}</span>
              {selected.client && <span style={{ fontSize: 12, color: P.textMuted }}>Client: {selected.client}</span>}
              {selected.budget && <span style={{ fontSize: 12, color: P.textMuted }}>{selected.currency} {parseFloat(selected.budget).toLocaleString()} budget</span>}
            </div>
            {selected.description && <p style={{ margin: "10px 0 0", color: "#666", fontSize: 13, lineHeight: 1.6 }}>{selected.description}</p>}
          </div>
          <button onClick={() => { setMilestoneForm(EMPTY_MILESTONE); setEditingMilestone(null); setShowMilestoneForm(true); }}
            style={{ background: P.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>+ ADD MILESTONE</button>
        </div>

        {/* Progress */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 22px", marginBottom: 28, boxShadow: "0 2px 10px rgba(139,127,212,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: P.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Overall Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.purple }}>{selected.progress || 0}%</span>
          </div>
          <div style={{ background: P.purplePale, borderRadius: 8, height: 8 }}>
            <div style={{ background: `linear-gradient(90deg, ${P.purple}, ${P.purpleLight})`, borderRadius: 8, height: 8, width: `${selected.progress || 0}%`, transition: "width 0.4s" }} />
          </div>
        </div>

        {/* Timeline */}
        <h2 style={{ fontSize: 13, fontWeight: 700, color: P.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Milestones</h2>
        {milestones.length === 0 && <div style={{ textAlign: "center", padding: 40, color: P.textMuted }}>No milestones yet.</div>}
        {milestones.map((m, i) => (
          <div key={m.id} style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: MS_STATUS[m.status]?.color || P.purple, border: "3px solid #fff", boxShadow: `0 0 0 2px ${MS_STATUS[m.status]?.color || P.purple}`, flexShrink: 0 }} />
              {i < milestones.length - 1 && <div style={{ width: 2, flex: 1, background: P.purplePale, minHeight: 20, marginTop: 4 }} />}
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", flex: 1, boxShadow: "0 2px 8px rgba(139,127,212,0.08)", marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, color: P.text, fontSize: 14 }}>{m.title}</div>
                  {m.description && <div style={{ fontSize: 12, color: P.textMuted, marginTop: 3 }}>{m.description}</div>}
                  <div style={{ fontSize: 11, color: P.textMuted, marginTop: 6 }}>
                    {m.due_date && <span>📅 {m.due_date}</span>}
                    {m.assigned_to && <span style={{ marginLeft: 12 }}>👤 {m.assigned_to}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", background: MS_STATUS[m.status]?.bg, color: MS_STATUS[m.status]?.color }}>{m.status}</span>
                  <button onClick={() => { setMilestoneForm({ ...m }); setEditingMilestone(m.id); setShowMilestoneForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 11, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => deleteMilestone(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c5c", fontSize: 11, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {showMilestoneForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(45,40,71,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: 440, boxShadow: "0 12px 40px rgba(139,127,212,0.25)" }}>
              <h2 style={{ margin: "0 0 22px", fontSize: 17, color: P.text, letterSpacing: "0.06em" }}>{editingMilestone ? "EDIT" : "ADD"} MILESTONE</h2>
              {[{ label: "Title", key: "title", type: "text" }, { label: "Due Date", key: "due_date", type: "date" }, { label: "Assigned To", key: "assigned_to", type: "text" }, { label: "Order", key: "order", type: "number" }].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{f.label}</label>
                  <input type={f.type} value={milestoneForm[f.key] || ""} onChange={e => setMilestoneForm({ ...milestoneForm, [f.key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Status</label>
                <select value={milestoneForm.status || ""} onChange={e => setMilestoneForm({ ...milestoneForm, status: e.target.value })} style={inputStyle}>
                  {["Not Started", "In Progress", "Completed", "Overdue"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Description</label>
                <textarea value={milestoneForm.description || ""} onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowMilestoneForm(false)} style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${P.purpleLight}`, background: "#fff", cursor: "pointer", fontSize: 13, color: P.textMuted }}>Cancel</button>
                <button onClick={saveMilestone} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: P.purple, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>SAVE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "0.04em" }}>📁 Projects</h1>
          <p style={{ margin: "5px 0 0", color: P.textMuted, fontSize: 13, letterSpacing: "0.05em" }}>MANAGE YOUR PROJECTS & TIMELINES</p>
        </div>
        <button onClick={() => { setProjectForm(EMPTY_PROJECT); setEditingProject(null); setShowProjectForm(true); }}
          style={{ background: P.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>+ NEW PROJECT</button>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => setSelected(p)}
              style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(139,127,212,0.1)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", borderTop: `4px solid ${P.purple}` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,127,212,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(139,127,212,0.1)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: P.text, letterSpacing: "0.03em" }}>{p.name}</div>
                <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", background: STATUS_COLORS[p.status]?.bg, color: STATUS_COLORS[p.status]?.color, whiteSpace: "nowrap", marginLeft: 8 }}>{p.status}</span>
              </div>
              {p.client && <div style={{ fontSize: 11, color: P.textMuted, marginBottom: 6, letterSpacing: "0.03em" }}>👤 {p.client}</div>}
              {p.description && <div style={{ fontSize: 12, color: "#777", marginBottom: 14, lineHeight: 1.5 }}>{p.description.slice(0, 80)}{p.description.length > 80 ? "…" : ""}</div>}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: P.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: P.purple }}>{p.progress || 0}%</span>
                </div>
                <div style={{ background: P.purplePale, borderRadius: 6, height: 6 }}>
                  <div style={{ background: `linear-gradient(90deg, ${P.purple}, ${P.purpleLight})`, borderRadius: 6, height: 6, width: `${p.progress || 0}%` }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontSize: 11, color: P.textMuted }}>{p.start_date} → {p.end_date || "Ongoing"}</div>
                <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setProjectForm({ ...p }); setEditingProject(p.id); setShowProjectForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 11, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => deleteProject(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c5c", fontSize: 11, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: P.textMuted }}>No projects yet — create your first one!</div>}
        </div>
      )}

      {showProjectForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,40,71,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: 500, maxHeight: "82vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(139,127,212,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 17, color: P.text, letterSpacing: "0.06em" }}>{editingProject ? "EDIT" : "NEW"} PROJECT</h2>
            {[{ label: "Project Name", key: "name", type: "text" }, { label: "Client", key: "client", type: "text" }, { label: "Start Date", key: "start_date", type: "date" }, { label: "End Date", key: "end_date", type: "date" }, { label: "Budget", key: "budget", type: "number" }, { label: "Progress (%)", key: "progress", type: "number" }].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{f.label}</label>
                <input type={f.type} value={projectForm[f.key] || ""} onChange={e => setProjectForm({ ...projectForm, [f.key]: e.target.value })} style={inputStyle} />
              </div>
            ))}
            {[
              { label: "Status", key: "status", options: ["Planning", "Active", "On Hold", "Completed", "Cancelled"] },
              { label: "Currency", key: "currency", options: ["HKD", "USD", "CNY", "EUR", "GBP"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{f.label}</label>
                <select value={projectForm[f.key] || ""} onChange={e => setProjectForm({ ...projectForm, [f.key]: e.target.value })} style={inputStyle}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Description</label>
              <textarea value={projectForm.description || ""} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowProjectForm(false)} style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${P.purpleLight}`, background: "#fff", cursor: "pointer", fontSize: 13, color: P.textMuted }}>Cancel</button>
              <button onClick={saveProject} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: P.purple, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
