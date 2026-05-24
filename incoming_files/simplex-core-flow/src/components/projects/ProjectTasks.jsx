import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, X, Check, AlertTriangle, Circle, Clock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isPast } from "date-fns";
import { Label } from "@/components/ui/label";

const statusIcons = {
  todo: <Circle className="w-4 h-4 text-muted-foreground" />,
  in_progress: <Clock className="w-4 h-4 text-primary" />,
  blocked: <AlertTriangle className="w-4 h-4 text-red-500" />,
  done: <Check className="w-4 h-4 text-green-500" />,
};

const statusColors = {
  todo: "text-muted-foreground",
  in_progress: "text-primary",
  blocked: "text-red-500",
  done: "text-green-500 line-through",
};

const priorityColors = {
  critical: "text-red-600",
  high: "text-orange-500",
  medium: "text-primary",
  low: "text-muted-foreground",
};

const empty = { title: "", status: "todo", priority: "medium", assignee: "", due_date: "", is_milestone: false, notes: "" };

export default function ProjectTasks({ project, onClose, onRefresh }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const t = await base44.entities.Task.filter({ project_id: project.id }, "due_date");
    setTasks(t);
    setLoading(false);
  };

  useEffect(() => { load(); }, [project.id]);

  const save = async () => {
    setSaving(true);
    await base44.entities.Task.create({ ...form, project_id: project.id });
    setSaving(false);
    setForm(empty);
    setShowAdd(false);
    load();
    onRefresh();
  };

  const toggleStatus = async (task) => {
    const next = task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "done";
    await base44.entities.Task.update(task.id, { status: next });
    load();
    onRefresh();
  };

  const deleteTask = async (id) => {
    await base44.entities.Task.delete(id);
    load();
    onRefresh();
  };

  const milestones = tasks.filter(t => t.is_milestone);
  const regularTasks = tasks.filter(t => !t.is_milestone);

  return (
    <Card className="border-border h-fit">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-exo text-base">{project.name}</CardTitle>
            <p className="text-xs text-muted-foreground font-montserrat mt-0.5">Critical Path & Tasks</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Milestones */}
        {milestones.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground font-montserrat uppercase tracking-wide mb-2 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Milestones
            </div>
            <div className="space-y-2">
              {milestones.map(t => (
                <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                  <button onClick={() => toggleStatus(t)}>{statusIcons[t.status]}</button>
                  <span className={`font-montserrat text-sm flex-1 ${statusColors[t.status]}`}>{t.title}</span>
                  {t.due_date && <span className={`text-[11px] font-montserrat ${isPast(parseISO(t.due_date)) && t.status !== "done" ? "text-red-500" : "text-muted-foreground"}`}>{format(parseISO(t.due_date), "MMM d")}</span>}
                  <button onClick={() => deleteTask(t.id)} className="p-0.5 rounded hover:bg-red-50"><X className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground font-montserrat uppercase tracking-wide mb-2">Tasks</div>
          {loading ? (
            <div className="text-sm text-muted-foreground font-montserrat text-center py-4">Loading...</div>
          ) : regularTasks.length === 0 && !showAdd ? (
            <div className="text-sm text-muted-foreground font-montserrat text-center py-4">No tasks yet</div>
          ) : (
            <div className="space-y-2">
              {regularTasks.map(t => (
                <div key={t.id} className={`flex items-center gap-2 p-2 rounded-lg ${t.status === "done" ? "opacity-60" : "bg-secondary/50"}`}>
                  <button onClick={() => toggleStatus(t)}>{statusIcons[t.status]}</button>
                  <span className={`font-montserrat text-sm flex-1 ${statusColors[t.status]}`}>{t.title}</span>
                  {t.assignee && <span className="text-[11px] text-muted-foreground font-montserrat">{t.assignee}</span>}
                  {t.due_date && <span className={`text-[11px] font-montserrat ${isPast(parseISO(t.due_date)) && t.status !== "done" ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>{format(parseISO(t.due_date), "MMM d")}</span>}
                  <Flag className={`w-3 h-3 ${priorityColors[t.priority]}`} />
                  <button onClick={() => deleteTask(t.id)} className="p-0.5 rounded hover:bg-red-50"><X className="w-3 h-3 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Task */}
        {showAdd ? (
          <div className="border border-border rounded-lg p-3 space-y-3 bg-secondary/30">
            <Input placeholder="Task title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="font-montserrat text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="text-xs font-montserrat h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger className="text-xs font-montserrat h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Assignee" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="font-montserrat text-xs h-8" />
              <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="font-montserrat text-xs h-8" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="milestone" checked={form.is_milestone} onChange={e => setForm({ ...form, is_milestone: e.target.checked })} className="accent-primary" />
              <label htmlFor="milestone" className="text-xs font-montserrat text-muted-foreground">Mark as Milestone</label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={save} disabled={!form.title || saving} className="bg-primary hover:bg-primary/90 font-montserrat text-xs h-8">{saving ? "..." : "Add"}</Button>
              <Button size="sm" variant="outline" onClick={() => { setShowAdd(false); setForm(empty); }} className="font-montserrat text-xs h-8">Cancel</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(true)} className="w-full font-montserrat text-xs border-dashed">
            <Plus className="w-3 h-3 mr-1" /> Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  );
}