import { useState, useEffect } from "react";
import { Project, Milestone } from "@/api/entities";

const STATUS_COLORS = {
  "Planning": { bg: "#e8f0fe", color: "#1a73e8" },
  "Active": { bg: "#e8f5e9", color: "#2e7d32" },
  "On Hold": { bg: "#fff8e1", color: "#f9a825" },
  "Completed": { bg: "#ede7f6", color: "#4527a0" },
  "Cancelled": { bg: "#fce8e8", color: "#c62828" },
};

const MILESTONE_STATUS_COLORS = {
  "Not Started": { bg: "#f5f5f5", color: "#757575" },
  "In Progress": { bg: "#fff8e1", color: "#f9a825" },
  "Completed": { bg: "#e8f5e9", color: "#2e7d32" },
  "Overdue": { bg: "#fce8e8", color: "#c62828" },
};

const EMPTY_PROJECT = { name: "", description: "", client: "", status: "Planning", start_date: "", end_date: "", budget: "", currency: "HKD", progress: 0 };
const EMPTY_MILESTONE = { title: "", description: "", due_date: "", status: "Not Started", assigned_to: "", order: 1 };

export default function ProjectsPage() {
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

  async function loadMilestones(projectId) {
    const data = await Milestone.filter({ project_id: projectId });
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

  if (selected) {
    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 14, marginBottom: 16, padding: 0 }}>← Back to Projects</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>{selected.name}</h1>
            <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
              <span style={{ padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>{selected.status}</span>
              {selected.client && <span style={{ fontSize: 13, color: "#7b8db0" }}>Client: {selected.client}</span>}
              {selected.budget && <span style={{ fontSize: 13, color: "#7b8db0" }}>{selected.currency} {parseFloat(selected.budget).toLocaleString()} budget</span>}
            </div>
            {selected.description && <p style={{ margin: "10px 0 0", color: "#555", fontSize: 14 }}>{selected.description}</p>}
          </div>
          <button onClick={() => { setMilestoneForm(EMPTY_MILESTONE); setEditingMilestone(null); setShowMilestoneForm(true); }}
            style={{ background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Milestone</button>
        </div>

        {/* Progress Bar */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 24, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Overall Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4f8ef7" }}>{selected.progress || 0}%</span>
          </div>
          <div style={{ background: "#e8f0fe", borderRadius: 8, height: 10 }}>
            <div style={{ background: "#4f8ef7", borderRadius: 8, height: 10, width: `${selected.progress || 0}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Timeline */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1f2e", marginBottom: 16 }}>Milestones</h2>
        <div style={{ position: "relative" }}>
          {milestones.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No milestones yet. Add one!</div>}
          {milestones.map((m, i) => (
            <div key={m.id} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: MILESTONE_STATUS_COLORS[m.status]?.color || "#ccc", border: "3px solid #fff", boxShadow: "0 0 0 2px " + (MILESTONE_STATUS_COLORS[m.status]?.color || "#ccc"), flexShrink: 0 }} />
                {i < milestones.length - 1 && <div style={{ width: 2, flex: 1, background: "#e0e4ef", minHeight: 20, marginTop: 4 }} />}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", flex: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a1f2e", fontSize: 14 }}>{m.title}</div>
                    {m.description && <div style={{ fontSize: 12, color: "#9aa3b2", marginTop: 2 }}>{m.description}</div>}
                    <div style={{ fontSize: 12, color: "#7b8db0", marginTop: 6 }}>
                      {m.due_date && <span>📅 {m.due_date}</span>}
                      {m.assigned_to && <span style={{ marginLeft: 12 }}>👤 {m.assigned_to}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ padding: "3px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: MILESTONE_STATUS_COLORS[m.status]?.bg, color: MILESTONE_STATUS_COLORS[m.status]?.color }}>{m.status}</span>
                    <button onClick={() => { setMilestoneForm({ ...m }); setEditingMilestone(m.id); setShowMilestoneForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 12 }}>Edit</button>
                    <button onClick={() => deleteMilestone(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 12 }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Milestone Modal */}
        {showMilestoneForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>{editingMilestone ? "Edit" : "Add"} Milestone</h2>
              {[{ label: "Title", key: "title", type: "text" }, { label: "Due Date", key: "due_date", type: "date" }, { label: "Assigned To", key: "assigned_to", type: "text" }, { label: "Order", key: "order", type: "number" }].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} value={milestoneForm[f.key] || ""} onChange={e => setMilestoneForm({ ...milestoneForm, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Status</label>
                <select value={milestoneForm.status || ""} onChange={e => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14 }}>
                  {["Not Started", "In Progress", "Completed", "Overdue"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Description</label>
                <textarea value={milestoneForm.description || ""} onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowMilestoneForm(false)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #dde2ec", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
                <button onClick={saveMilestone} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>📁 Projects</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>Manage your projects and timelines</p>
        </div>
        <button onClick={() => { setProjectForm(EMPTY_PROJECT); setEditingProject(null); setShowProjectForm(true); }}
          style={{ background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ New Project</button>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1f2e" }}>{p.name}</div>
                <span style={{ padding: "3px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[p.status]?.bg, color: STATUS_COLORS[p.status]?.color, whiteSpace: "nowrap" }}>{p.status}</span>
              </div>
              {p.client && <div style={{ fontSize: 12, color: "#9aa3b2", marginBottom: 6 }}>👤 {p.client}</div>}
              {p.description && <div style={{ fontSize: 13, color: "#666", marginBottom: 12, lineHeight: 1.5 }}>{p.description.slice(0, 80)}{p.description.length > 80 ? "..." : ""}</div>}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#9aa3b2" }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4f8ef7" }}>{p.progress || 0}%</span>
                </div>
                <div style={{ background: "#e8f0fe", borderRadius: 4, height: 6 }}>
                  <div style={{ background: "#4f8ef7", borderRadius: 4, height: 6, width: `${p.progress || 0}%` }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div style={{ fontSize: 12, color: "#9aa3b2" }}>{p.start_date} → {p.end_date || "Ongoing"}</div>
                <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setProjectForm({ ...p }); setEditingProject(p.id); setShowProjectForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 12 }}>Edit</button>
                  <button onClick={() => deleteProject(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 12 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#aaa" }}>No projects yet. Create your first one!</div>}
        </div>
      )}

      {/* Project Modal */}
      {showProjectForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 500, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>{editingProject ? "Edit" : "New"} Project</h2>
            {[{ label: "Project Name", key: "name", type: "text" }, { label: "Client", key: "client", type: "text" }, { label: "Start Date", key: "start_date", type: "date" }, { label: "End Date", key: "end_date", type: "date" }, { label: "Budget", key: "budget", type: "number" }, { label: "Progress (%)", key: "progress", type: "number" }].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} value={projectForm[f.key] || ""} onChange={e => setProjectForm({ ...projectForm, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            {[
              { label: "Status", key: "status", options: ["Planning", "Active", "On Hold", "Completed", "Cancelled"] },
              { label: "Currency", key: "currency", options: ["HKD", "USD", "CNY", "EUR", "GBP"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <select value={projectForm[f.key] || ""} onChange={e => setProjectForm({ ...projectForm, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Description</label>
              <textarea value={projectForm.description || ""} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowProjectForm(false)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #dde2ec", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={saveProject} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
