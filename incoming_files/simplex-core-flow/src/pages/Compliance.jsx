import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Edit, Trash2, AlertCircle, CheckCircle2, Clock, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isPast, parseISO, differenceInDays } from "date-fns";

const CATEGORIES = ["Business Registration", "Tax", "MPF", "Company Secretarial", "Admin", "Office & Admin", "Contracts & Partnerships", "Audit", "Immigration", "Other"];
const STATUSES = ["Upcoming", "In Progress", "Done", "Overdue"];
const RECURRENCES = ["One-time", "Annual", "Quarterly", "Monthly"];

const empty = {
  title: "", category: "Admin", due_date: "", status: "Upcoming",
  description: "", notes: "", reminder_days_before: 30, recurrence: "Annual", assigned_to: "Kieran"
};

const getStatusInfo = (item) => {
  if (item.status === "Done" || item.status === "Completed")
    return { label: "Done", color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> };
  if (!item.due_date) return { label: item.status, color: "bg-secondary text-muted-foreground", icon: <Clock className="w-3 h-3" /> };
  const due = parseISO(item.due_date);
  if (isPast(due))
    return { label: "Overdue", color: "bg-red-100 text-red-700", icon: <AlertCircle className="w-3 h-3" /> };
  const days = differenceInDays(due, new Date());
  if (days <= 14)
    return { label: `${days}d left`, color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> };
  return { label: `${days}d left`, color: "bg-primary/10 text-primary", icon: <Clock className="w-3 h-3" /> };
};

export default function Compliance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const d = await base44.entities.ComplianceItem.list("due_date");
      setItems(d);
    } catch (e) { setItems([]); }
    setLoading(false);
  };

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await base44.entities.ComplianceItem.update(editing.id, form);
      else await base44.entities.ComplianceItem.create(form);
      await load();
      setShowForm(false);
    } catch (e) { }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this compliance item?")) return;
    await base44.entities.ComplianceItem.delete(id);
    await load();
  };

  const filtered = items.filter(i => {
    const matchCat = catFilter === "All" || i.category === catFilter;
    const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const overdue = items.filter(i => i.status !== "Done" && i.due_date && isPast(parseISO(i.due_date)));
  const upcoming30 = items.filter(i => i.status !== "Done" && i.due_date && !isPast(parseISO(i.due_date)) && differenceInDays(parseISO(i.due_date), new Date()) <= 30);

  const F = ({ label, children }) => (
    <div className="space-y-1.5">
      <Label className="font-montserrat text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-exo text-2xl font-bold text-foreground">Compliance Tracker</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">HK regulatory deadlines · Business registration · Tax · MPF</p>
        </div>
        <Button onClick={openCreate} className="gap-2 font-montserrat">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {/* Alert Cards */}
      {(overdue.length > 0 || upcoming30.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {overdue.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <div className="font-exo font-bold text-red-700 text-lg">{overdue.length} Overdue</div>
                  <div className="text-xs text-red-500 font-montserrat">Immediate action required</div>
                </div>
              </CardContent>
            </Card>
          )}
          {upcoming30.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="font-exo font-bold text-yellow-700 text-lg">{upcoming30.length} Due Soon</div>
                  <div className="text-xs text-yellow-600 font-montserrat">Within the next 30 days</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-montserrat font-semibold transition-all border ${catFilter === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground font-montserrat text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-montserrat text-sm">No compliance items found.</div>
          ) : (
            <div className="divide-y divide-border">
              {/* Header Row */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-secondary/50 rounded-t-lg">
                {["Item", "Category", "Due Date", "Status", ""].map((h, i) => (
                  <div key={i} className="text-[10px] font-montserrat font-bold text-muted-foreground uppercase tracking-widest">{h}</div>
                ))}
              </div>
              {filtered.map(item => {
                const si = getStatusInfo(item);
                const isExpanded = expanded[item.id];
                return (
                  <div key={item.id}>
                    <div
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors cursor-pointer items-center"
                      onClick={() => setExpanded(v => ({ ...v, [item.id]: !v[item.id] }))}
                    >
                      <div>
                        <div className="font-montserrat font-semibold text-sm text-foreground">{item.title}</div>
                        {item.assigned_to && <div className="text-xs text-muted-foreground mt-0.5">{item.assigned_to}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground font-montserrat">{item.category}</div>
                      <div className="text-sm font-montserrat font-medium">
                        {item.due_date ? format(parseISO(item.due_date), "d MMM yyyy") : "—"}
                      </div>
                      <div>
                        <Badge className={`${si.color} gap-1 text-xs font-montserrat font-semibold border-0`}>
                          {si.icon}{si.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); openEdit(item); }} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); remove(item.id); }} className="p-1.5 hover:bg-red-100 rounded-md transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                    {isExpanded && (item.description || item.notes) && (
                      <div className="px-5 pb-4 bg-secondary/20 border-t border-border">
                        {item.description && <p className="text-sm text-foreground font-montserrat mt-3 leading-relaxed">{item.description}</p>}
                        {item.notes && (
                          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs font-montserrat text-yellow-800">
                            <strong>Notes:</strong> {item.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-exo">{editing ? "Edit Compliance Item" : "Add Compliance Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <F label="Title"><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="font-montserrat" /></F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Category">
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="font-montserrat"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Status">
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="font-montserrat"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F label="Due Date"><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="font-montserrat" /></F>
              <F label="Recurrence">
                <Select value={form.recurrence || "Annual"} onValueChange={v => setForm(f => ({ ...f, recurrence: v }))}>
                  <SelectTrigger className="font-montserrat"><SelectValue /></SelectTrigger>
                  <SelectContent>{RECURRENCES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <F label="Assigned To"><Input value={form.assigned_to || ""} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))} className="font-montserrat" /></F>
            <F label="Description"><Textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="font-montserrat" /></F>
            <F label="Notes"><Textarea value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="font-montserrat" /></F>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 font-montserrat">{saving ? "Saving..." : editing ? "Update" : "Create"}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="font-montserrat">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
