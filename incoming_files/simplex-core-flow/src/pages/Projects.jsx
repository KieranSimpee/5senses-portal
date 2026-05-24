import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, ChevronDown, Trash2, Edit, CheckSquare, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, isPast } from "date-fns";
import ProjectTasks from "@/components/projects/ProjectTasks";

const statusColors = {
  planning: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  on_hold: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const priorityColors = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-500",
};

const emptyProject = { name: "", description: "", status: "planning", priority: "medium", start_date: "", due_date: "", budget: "", owner: "", notes: "" };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [selectedProject, setSelectedProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [p, t] = await Promise.all([
      base44.entities.Project.list("-updated_date"),
      base44.entities.Task.list("-due_date"),
    ]);
    setProjects(p);
    setTasks(t);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyProject); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, budget: p.budget || "" }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    const data = { ...form, budget: form.budget ? parseFloat(form.budget) : undefined };
    if (editing) await base44.entities.Project.update(editing.id, data);
    else await base44.entities.Project.create(data);
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await base44.entities.Project.delete(id);
    if (selectedProject?.id === id) setSelectedProject(null);
    load();
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getTaskCounts = (projectId) => {
    const pt = tasks.filter(t => t.project_id === projectId);
    return { total: pt.length, done: pt.filter(t => t.status === "done").length, overdue: pt.filter(t => t.due_date && isPast(parseISO(t.due_date)) && t.status !== "done").length };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-exo text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Critical path tracking & team assignments</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 font-montserrat">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 font-montserrat"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Project List */}
        <div className={selectedProject ? "lg:col-span-2" : "lg:col-span-5"}>
          {loading ? (
            <div className="text-sm text-muted-foreground font-montserrat py-8 text-center">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground font-montserrat py-8 text-center">No projects found.</div>
          ) : (
            <div className="space-y-3">
              {filtered.map(p => {
                const counts = getTaskCounts(p.id);
                const progress = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;
                const isSelected = selectedProject?.id === p.id;
                return (
                  <Card key={p.id} className={`border-border cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedProject(isSelected ? null : p)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-exo font-semibold text-sm text-foreground">{p.name}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); openEdit(p); }} className="p-1 rounded hover:bg-secondary"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={e => { e.stopPropagation(); remove(p.id); }} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold font-montserrat ${statusColors[p.status] || ""}`}>{p.status?.replace("_", " ")}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold font-montserrat ${priorityColors[p.priority] || ""}`}>{p.priority}</span>
                        {p.due_date && <span className="text-[11px] text-muted-foreground font-montserrat flex items-center gap-1"><Clock className="w-3 h-3" /> {format(parseISO(p.due_date), "MMM d")}</span>}
                      </div>
                      {counts.total > 0 && (
                        <div>
                          <div className="flex justify-between text-[11px] text-muted-foreground font-montserrat mb-1">
                            <span>{counts.done}/{counts.total} tasks</span>
                            {counts.overdue > 0 && <span className="text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{counts.overdue} overdue</span>}
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Task Panel */}
        {selectedProject && (
          <div className="lg:col-span-3">
            <ProjectTasks project={selectedProject} onClose={() => setSelectedProject(null)} onRefresh={load} />
          </div>
        )}
      </div>

      {/* Project Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg font-montserrat">
          <DialogHeader>
            <DialogTitle className="font-exo">{editing ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold mb-1">Project Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Simplex-ity Website Launch" />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Start Date</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Due Date</Label>
                <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Budget (HKD)</Label>
                <Input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Owner</Label>
                <Input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="e.g. Jenny Au" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || saving} className="bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Save Project"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}