import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Edit, Trash2, AlertCircle, CheckCircle2, Clock, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isPast, parseISO, differenceInDays } from "date-fns";

const CATEGORIES = ["Business Registration","Tax","MPF","Company Secretarial","Admin","Office & Admin","Contracts & Partnerships","Audit","Immigration","Other"];
const STATUSES = ["Upcoming","In Progress","Done","Overdue"];
const RECURRENCES = ["One-time","Annual","Quarterly","Monthly"];

const empty = { title:"", category:"Admin", due_date:"", status:"Upcoming", description:"", notes:"", recurrence:"Annual", assigned_to:"Kieran" };

const getStatusInfo = (item) => {
  if (item.status === "Done" || item.status === "Completed")
    return { label:"Done", cls:"bg-green-100 text-green-700", icon:<CheckCircle2 className="w-3 h-3"/> };
  if (!item.due_date) return { label:item.status||"Upcoming", cls:"bg-secondary text-muted-foreground", icon:<Clock className="w-3 h-3"/> };
  const due = parseISO(item.due_date);
  if (isPast(due)) return { label:"Overdue", cls:"bg-red-100 text-red-700", icon:<AlertCircle className="w-3 h-3"/> };
  const days = differenceInDays(due, new Date());
  if (days <= 14) return { label:`${days}d left`, cls:"bg-yellow-100 text-yellow-700", icon:<Clock className="w-3 h-3"/> };
  return { label:`${days}d left`, cls:"bg-primary/10 text-primary", icon:<Clock className="w-3 h-3"/> };
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
    try { setItems(await base44.entities.ComplianceItem.list("due_date")); }
    catch { setItems([]); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await base44.entities.ComplianceItem.update(editing.id, form);
      else await base44.entities.ComplianceItem.create(form);
      await load(); setShowForm(false);
    } catch {}
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    await base44.entities.ComplianceItem.delete(id);
    await load();
  };

  const filtered = items.filter(i =>
    (catFilter === "All" || i.category === catFilter) &&
    (!search || i.title?.toLowerCase().includes(search.toLowerCase()))
  );

  const overdue = items.filter(i => i.status !== "Done" && i.due_date && isPast(parseISO(i.due_date)));
  const soon = items.filter(i => i.status !== "Done" && i.due_date && !isPast(parseISO(i.due_date)) && differenceInDays(parseISO(i.due_date), new Date()) <= 30);

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
        <Button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="gap-2 font-montserrat">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {/* Alert Banner */}
      {(overdue.length > 0 || soon.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          {soon.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="font-exo font-bold text-yellow-700 text-lg">{soon.length} Due Soon</div>
                  <div className="text-xs text-yellow-600 font-montserrat">Within next 30 days</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat w-56" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-montserrat font-semibold border transition-all ${catFilter === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50"}`}>
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
            <div className="py-12 text-center text-muted-foreground font-montserrat text-sm">
              No items found. <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="text-primary underline">Add one</button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-secondary/40 rounded-t-lg text-[10px] font-montserrat font-bold text-muted-foreground uppercase tracking-widest">
                <div>Item</div><div>Category</div><div>Due Date</div><div>Status</div><div></div>
              </div>
              {filtered.map(item => {
                const si = getStatusInfo(item);
                return (
                  <div key={item.id}>
                    <div
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors cursor-pointer items-center"
                      onClick={() => setExpanded(v => ({ ...v, [item.id]: !v[item.id] }))}
                    >
                      <div>
                        <div className="font-montserrat font-semibold text-sm text-foreground">{item.title}</div>
                        {item.assigned_to && <div className="text-xs text-muted-foreground mt-0.5">{item.assigned_to} · {item.recurrence}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground font-montserrat">{item.category}</div>
                      <div className="text-sm font-montserrat font-medium">{item.due_date ? format(parseISO(item.due_date), "d MMM yyyy") : "—"}</div>
                      <div>
                        <Badge className={`${si.cls} gap-1 text-xs font-montserrat font-semibold border-0`}>{si.icon}{si.label}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); setEditing(item); setForm({...item}); setShowForm(true); }} className="p-1.5 hover:bg-secondary rounded-md">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); remove(item.id); }} className="p-1.5 hover:bg-red-100 rounded-md">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                        {expanded[item.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                    {expanded[item.id] && (item.description || item.notes) && (
                      <div className="px-5 pb-4 bg-secondary/10 border-t border-border space-y-2 pt-3">
                        {item.description && <p className="text-sm font-montserrat text-foreground leading-relaxed">{item.description}</p>}
                        {item.notes && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs font-montserrat text-yellow-800"><strong>Notes:</strong> {item.notes}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-exo">{editing ? "Edit Item" : "Add Compliance Item"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <F label="Title"><Input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} className="font-montserrat" placeholder="e.g. Business Registration Renewal" /></F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Category">
                <Select value={form.category} onValueChange={v=>setForm(f=>({...f,category:v}))}>
                  <SelectTrigger className="font-montserrat"><SelectValue/></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Status">
                <Select value={form.status} onValueChange={v=>setForm(f=>({...f,status:v}))}>
                  <SelectTrigger className="font-montserrat"><SelectValue/></SelectTrigger>
                  <SelectContent>{STATUSES.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F label="Due Date"><Input type="date" value={form.due_date} onChange={e=>setForm(f=>({...f,due_date:e.target.value}))} className="font-montserrat"/></F>
              <F label="Recurrence">
                <Select value={form.recurrence||"Annual"} onValueChange={v=>setForm(f=>({...f,recurrence:v}))}>
                  <SelectTrigger className="font-montserrat"><SelectValue/></SelectTrigger>
                  <SelectContent>{RECURRENCES.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <F label="Assigned To"><Input value={form.assigned_to||""} onChange={e=>setForm(f=>({...f,assigned_to:e.target.value}))} className="font-montserrat"/></F>
            <F label="Description"><Textarea value={form.description||""} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="font-montserrat"/></F>
            <F label="Notes"><Textarea value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} className="font-montserrat"/></F>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 font-montserrat">{saving?"Saving...":editing?"Update":"Create"}</Button>
              <Button variant="outline" onClick={()=>setShowForm(false)} className="font-montserrat">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
