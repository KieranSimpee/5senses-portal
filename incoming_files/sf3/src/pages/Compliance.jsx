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

const CATS = ["Business Registration","Tax","MPF","Company Secretarial","Admin","Office & Admin","Contracts & Partnerships","Audit","Immigration","Other"];
const STATUSES = ["Upcoming","In Progress","Completed","Overdue"];
const RECURRENCES = ["One-time","Annual","Quarterly","Monthly"];
const empty = { title:"", category:"Admin", due_date:"", status:"Upcoming", description:"", notes:"", recurrence:"Annual", assigned_to:"Kieran" };

const getStatus = (item) => {
  if (item.status === "Completed") return { label:"Done", cls:"bg-green-100 text-green-700", icon:<CheckCircle2 className="w-3 h-3"/> };
  if (!item.due_date) return { label:item.status||"Upcoming", cls:"bg-gray-100 text-gray-500", icon:<Clock className="w-3 h-3"/> };
  const due = parseISO(item.due_date);
  if (isPast(due)) return { label:"Overdue", cls:"bg-red-100 text-red-700", icon:<AlertCircle className="w-3 h-3"/> };
  const days = differenceInDays(due, new Date());
  if (days <= 30) return { label:`${days}d left`, cls:"bg-yellow-100 text-yellow-700", icon:<Clock className="w-3 h-3"/> };
  return { label:`${days}d`, cls:"bg-[#e8e6fe] text-[#5e50fb]", icon:<Clock className="w-3 h-3"/> };
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
  const load = async () => { setItems(await base44.entities.ComplianceItem.list("due_date").catch(()=>[])); setLoading(false); };
  const save = async () => { setSaving(true); if(editing) await base44.entities.ComplianceItem.update(editing.id,form); else await base44.entities.ComplianceItem.create(form); await load(); setShowForm(false); setSaving(false); };
  const remove = async (id) => { if(confirm("Delete?")) { await base44.entities.ComplianceItem.delete(id); await load(); }};

  const filtered = items.filter(i => (catFilter==="All"||i.category===catFilter) && (!search||i.title?.toLowerCase().includes(search.toLowerCase())));
  const overdue = items.filter(i => i.status!=="Completed" && i.due_date && isPast(parseISO(i.due_date)));
  const soon = items.filter(i => i.status!=="Completed" && i.due_date && !isPast(parseISO(i.due_date)) && differenceInDays(parseISO(i.due_date),new Date())<=30);

  const F = ({label,children}) => <div className="space-y-1.5"><Label className="text-xs font-bold text-gray-500 uppercase tracking-wide" style={{fontFamily:'Montserrat, sans-serif'}}>{label}</Label>{children}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>Compliance</h1>
          <p className="text-sm text-gray-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>HK regulatory deadlines · BR · Tax · MPF</p>
        </div>
        <Button onClick={()=>{setEditing(null);setForm(empty);setShowForm(true);}} className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}><Plus className="w-4 h-4"/>Add Item</Button>
      </div>

      {(overdue.length>0||soon.length>0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {overdue.length>0 && <Card className="border-red-200 bg-red-50"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0"/><div><p className="font-extrabold text-red-700 text-lg" style={{fontFamily:'Exo 2, sans-serif'}}>{overdue.length} Overdue</p><p className="text-xs text-red-500" style={{fontFamily:'Montserrat, sans-serif'}}>Immediate action required</p></div></CardContent></Card>}
          {soon.length>0 && <Card className="border-yellow-200 bg-yellow-50"><CardContent className="p-4 flex items-center gap-3"><Clock className="w-6 h-6 text-yellow-600 flex-shrink-0"/><div><p className="font-extrabold text-yellow-700 text-lg" style={{fontFamily:'Exo 2, sans-serif'}}>{soon.length} Due in 30 days</p><p className="text-xs text-yellow-600" style={{fontFamily:'Montserrat, sans-serif'}}>Action needed soon</p></div></CardContent></Card>}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><Input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 w-52" style={{fontFamily:'Montserrat, sans-serif'}}/></div>
        <div className="flex flex-wrap gap-2">{["All",...CATS].map(c=><button key={c} onClick={()=>setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${catFilter===c?"bg-[#8c82fc] text-white border-[#8c82fc]":"text-gray-500 border-gray-200 hover:border-[#8c82fc]"}`} style={{fontFamily:'Montserrat, sans-serif'}}>{c}</button>)}</div>
      </div>

      <Card className="border-[#e8e6fe]">
        <CardContent className="p-0">
          {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : filtered.length===0 ? <p className="text-center py-8 text-gray-400 text-sm">No items. <button onClick={()=>{setEditing(null);setForm(empty);setShowForm(true);}} className="text-[#8c82fc] underline">Add one</button></p> : (
            <div className="divide-y divide-[#e8e6fe]">
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#f5f4ff] text-[10px] font-bold text-gray-400 uppercase tracking-widest"><div>Item</div><div>Category</div><div>Due Date</div><div>Status</div><div/></div>
              {filtered.map(item => {
                const si = getStatus(item);
                return (
                  <div key={item.id}>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 hover:bg-[#f5f4ff] cursor-pointer items-center" onClick={()=>setExpanded(v=>({...v,[item.id]:!v[item.id]}))}>
                      <div><p className="font-semibold text-sm text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{item.title}</p>{item.assigned_to&&<p className="text-xs text-gray-400 mt-0.5">{item.assigned_to} · {item.recurrence}</p>}</div>
                      <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>{item.category}</p>
                      <p className="text-sm font-medium" style={{fontFamily:'Montserrat, sans-serif'}}>{item.due_date?format(parseISO(item.due_date),"d MMM yyyy"):"—"}</p>
                      <Badge className={`${si.cls} gap-1 text-xs font-bold border-0`}>{si.icon}{si.label}</Badge>
                      <div className="flex gap-1">
                        <button onClick={e=>{e.stopPropagation();setEditing(item);setForm({...item});setShowForm(true);}} className="p-1 hover:bg-[#e8e6fe] rounded"><Edit className="w-3.5 h-3.5 text-gray-400"/></button>
                        <button onClick={e=>{e.stopPropagation();remove(item.id);}} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400"/></button>
                        {expanded[item.id]?<ChevronUp className="w-4 h-4 text-gray-400"/>:<ChevronDown className="w-4 h-4 text-gray-400"/>}
                      </div>
                    </div>
                    {expanded[item.id]&&(item.description||item.notes)&&(
                      <div className="px-5 pb-4 pt-3 bg-[#f5f4ff] border-t border-[#e8e6fe] space-y-2">
                        {item.description&&<p className="text-sm text-[#1a1a1f] leading-relaxed" style={{fontFamily:'Montserrat, sans-serif'}}>{item.description}</p>}
                        {item.notes&&<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800" style={{fontFamily:'Montserrat, sans-serif'}}><strong>Notes:</strong> {item.notes}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle style={{fontFamily:'Exo 2, sans-serif'}}>{editing?"Edit":"Add"} Compliance Item</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Title"><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Category"><Select value={form.category} onValueChange={v=>setForm(f=>({...f,category:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{CATS.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></F>
              <F label="Status"><Select value={form.status} onValueChange={v=>setForm(f=>({...f,status:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{STATUSES.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Due Date"><Input type="date" value={form.due_date||""} onChange={e=>setForm(f=>({...f,due_date:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
              <F label="Recurrence"><Select value={form.recurrence||"Annual"} onValueChange={v=>setForm(f=>({...f,recurrence:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{RECURRENCES.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></F>
            </div>
            <F label="Assigned To"><Input value={form.assigned_to||""} onChange={e=>setForm(f=>({...f,assigned_to:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Description"><Textarea value={form.description||""} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Notes"><Textarea value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 bg-[#8c82fc] hover:bg-[#5e50fb]">{saving?"Saving...":editing?"Update":"Create"}</Button>
              <Button variant="outline" onClick={()=>setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
