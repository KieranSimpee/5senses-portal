import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Upload, Trash2, Edit, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, isPast, differenceInDays } from "date-fns";

const HR_TYPES = ["Employment Contract","MPF Enrollment","Medical Insurance","Associate Agreement","NDA","Sick Leave","Annual Leave","Payroll","Other"];
const empty = { name:"", type:"Employment Contract", person_name:"", start_date:"", expiry_date:"", status:"Active", notes:"", section:"HR", amount:0, currency:"HKD" };

export default function HR() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const r = await base44.entities.HRRecord.list().catch(() => []);
    setRecords(r); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await base44.entities.HRRecord.update(editing.id, form);
    else await base44.entities.HRRecord.create(form);
    await load(); setShowForm(false); setSaving(false);
  };

  const remove = async (id) => { if(confirm("Delete?")) { await base44.entities.HRRecord.delete(id); await load(); }};

  const expiring = records.filter(r => r.expiry_date && !isPast(parseISO(r.expiry_date)) && differenceInDays(parseISO(r.expiry_date), new Date()) <= 60);
  const expired = records.filter(r => r.expiry_date && isPast(parseISO(r.expiry_date)) && r.status !== "Completed");

  const sections = {
    "Contracts": records.filter(r => ["Employment Contract","Associate Agreement","NDA"].includes(r.type)),
    "MPF": records.filter(r => r.type === "MPF Enrollment"),
    "Insurance": records.filter(r => r.type === "Medical Insurance"),
    "Leave": records.filter(r => ["Sick Leave","Annual Leave"].includes(r.type)),
    "Payroll": records.filter(r => r.type === "Payroll"),
    "Other": records.filter(r => ["Other"].includes(r.type)),
  };

  const F = ({ label, children }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide" style={{fontFamily:'Montserrat, sans-serif'}}>{label}</Label>
      {children}
    </div>
  );

  const RecordCard = ({ r }) => {
    const days = r.expiry_date ? differenceInDays(parseISO(r.expiry_date), new Date()) : null;
    const isOvd = days !== null && days < 0;
    const isSoon = days !== null && days >= 0 && days <= 60;
    return (
      <Card className={`border ${isOvd?"border-red-200":isSoon?"border-yellow-200":"border-[#e8e6fe]"}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-bold text-sm text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{r.name}</p>
              {r.person_name && <p className="text-xs text-gray-400">{r.person_name}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => { setEditing(r); setForm({...r}); setShowForm(true); }} className="p-1 hover:bg-[#e8e6fe] rounded"><Edit className="w-3.5 h-3.5 text-gray-400"/></button>
              <button onClick={() => remove(r.id)} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400"/></button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-400" style={{fontFamily:'Montserrat, sans-serif'}}>
            {r.start_date && <span>From {format(parseISO(r.start_date),"d MMM yyyy")}</span>}
            {r.expiry_date && <span>· Expires {format(parseISO(r.expiry_date),"d MMM yyyy")}</span>}
          </div>
          {r.amount > 0 && <p className="text-xs font-bold text-[#5e50fb] mt-1">{r.currency} {r.amount.toLocaleString()}</p>}
          {isOvd && <Badge className="mt-2 bg-red-100 text-red-700 border-0 text-xs">Expired</Badge>}
          {isSoon && !isOvd && <Badge className="mt-2 bg-yellow-100 text-yellow-700 border-0 text-xs">Expiring in {days}d</Badge>}
          {r.notes && <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{r.notes}</p>}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>HR</h1>
          <p className="text-sm text-gray-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>Contracts · MPF · Insurance · Associates</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}>
          <Plus className="w-4 h-4"/> Add Record
        </Button>
      </div>

      {(expired.length > 0 || expiring.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {expired.length > 0 && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"><AlertCircle className="w-4 h-4 text-red-500"/><span className="text-sm font-bold text-red-700" style={{fontFamily:'Montserrat, sans-serif'}}>{expired.length} expired record{expired.length>1?"s":""}</span></div>}
          {expiring.length > 0 && <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5"><AlertCircle className="w-4 h-4 text-yellow-600"/><span className="text-sm font-bold text-yellow-700" style={{fontFamily:'Montserrat, sans-serif'}}>{expiring.length} expiring soon</span></div>}
        </div>
      )}

      <Tabs defaultValue="Contracts">
        <TabsList className="bg-[#e8e6fe] flex-wrap h-auto">
          {Object.keys(sections).map(s => (
            <TabsTrigger key={s} value={s} style={{fontFamily:'Montserrat, sans-serif'}}>{s} {sections[s].length > 0 && `(${sections[s].length})`}</TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(sections).map(([name, recs]) => (
          <TabsContent key={name} value={name} className="mt-4">
            {loading ? <p className="text-gray-400 text-sm">Loading...</p> : recs.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No {name} records yet.
                <button onClick={() => { setEditing(null); setForm({...empty, type: HR_TYPES.find(t=>t.toLowerCase().includes(name.toLowerCase()))||"Other"}); setShowForm(true); }} className="block mx-auto mt-2 text-[#8c82fc] underline">Add one</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recs.map(r => <RecordCard key={r.id} r={r} />)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle style={{fontFamily:'Exo 2, sans-serif'}}>{editing ? "Edit HR Record" : "Add HR Record"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Record Name"><Input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Wilson Tai Employment Contract" style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Type"><Select value={form.type} onValueChange={v=>setForm(f=>({...f,type:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{HR_TYPES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></F>
            <F label="Person Name"><Input value={form.person_name||""} onChange={e=>setForm(f=>({...f,person_name:e.target.value}))} placeholder="Full name" style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Start Date"><Input type="date" value={form.start_date||""} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
              <F label="Expiry Date"><Input type="date" value={form.expiry_date||""} onChange={e=>setForm(f=>({...f,expiry_date:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Amount"><Input type="number" value={form.amount||0} onChange={e=>setForm(f=>({...f,amount:parseFloat(e.target.value)||0}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
              <F label="Currency"><Select value={form.currency||"HKD"} onValueChange={v=>setForm(f=>({...f,currency:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{["HKD","USD","EUR"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></F>
            </div>
            <F label="Status"><Select value={form.status||"Active"} onValueChange={v=>setForm(f=>({...f,status:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{["Active","Inactive","Pending","Completed"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></F>
            <F label="Notes"><Input value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 bg-[#8c82fc] hover:bg-[#5e50fb]">{saving?"Saving...":editing?"Update":"Add"}</Button>
              <Button variant="outline" onClick={()=>setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
