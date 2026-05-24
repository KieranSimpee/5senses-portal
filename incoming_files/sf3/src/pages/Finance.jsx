import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, TrendingUp, TrendingDown, AlertCircle, Search, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, isPast, differenceInDays } from "date-fns";

const CATS = ["Professional Fees","Government Fees","Software & Subscriptions","Domain & Hosting","Microsoft Licenses","Branding & Design","Marketing","Office & Admin","MPF","Salaries","Other"];
const METHODS = ["Bank Transfer / FPS","Credit Card","AMEX","PayPal","Shopify billing","Government Portal","Other"];
const empty = { title:"", amount:0, currency:"HKD", category:"Other", date:"", vendor:"", notes:"", status:"paid", payment_method:"Bank Transfer / FPS" };

export default function Finance() {
  const [expenses, setExpenses] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [exp, comp, bk] = await Promise.all([
      base44.entities.Expense.list("-date").catch(() => []),
      base44.entities.ComplianceItem.list().catch(() => []),
      base44.entities.BankAccount.list().catch(() => []),
    ]);
    setExpenses(exp); setCompliance(comp); setBanks(bk); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await base44.entities.Expense.update(editing.id, form);
    else await base44.entities.Expense.create(form);
    await load(); setShowForm(false); setSaving(false);
  };

  const remove = async (id) => { if(confirm("Delete?")) { await base44.entities.Expense.delete(id); await load(); }};

  const filtered = expenses.filter(e =>
    (catFilter === "All" || e.category === catFilter) &&
    (!search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.vendor?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalHKD = expenses.filter(e => e.currency === "HKD").reduce((s,e) => s + (e.amount||0), 0);
  const totalUSD = expenses.filter(e => e.currency === "USD").reduce((s,e) => s + (e.amount||0), 0);
  const paid = expenses.filter(e => e.status === "paid").length;

  const renewals = compliance.filter(c => c.status !== "Completed" && c.due_date);
  const urgentRenewals = renewals.filter(c => differenceInDays(parseISO(c.due_date), new Date()) <= 60).sort((a,b) => new Date(a.due_date)-new Date(b.due_date));

  const F = ({ label, children }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide" style={{fontFamily:'Montserrat, sans-serif'}}>{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>Finance</h1>
          <p className="text-sm text-gray-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>Expenses · Renewals · Bank accounts</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}>
          <Plus className="w-4 h-4"/> Add Expense
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Total HKD", value:`HKD ${totalHKD.toLocaleString()}`, color:"text-[#5e50fb]" },
          { label:"Total USD", value:`USD ${totalUSD.toLocaleString()}`, color:"text-green-600" },
          { label:"Transactions", value:expenses.length, color:"text-[#1a1a1f]" },
          { label:"Urgent Renewals", value:urgentRenewals.length, color:"text-red-600" },
        ].map(s => (
          <Card key={s.label} className="border-[#e8e6fe]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1" style={{fontFamily:'Montserrat, sans-serif'}}>{s.label}</p>
              <p className={`text-xl font-extrabold ${s.color}`} style={{fontFamily:'Exo 2, sans-serif'}}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="expenses">
        <TabsList className="bg-[#e8e6fe]">
          <TabsTrigger value="expenses" style={{fontFamily:'Montserrat, sans-serif'}}>💰 Expenses</TabsTrigger>
          <TabsTrigger value="renewals" style={{fontFamily:'Montserrat, sans-serif'}}>🔄 Renewals</TabsTrigger>
          <TabsTrigger value="banks" style={{fontFamily:'Montserrat, sans-serif'}}>🏦 Bank Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><Input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 w-52" style={{fontFamily:'Montserrat, sans-serif'}}/></div>
            <div className="flex flex-wrap gap-2">
              {["All",...CATS].map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${catFilter===c?"bg-[#8c82fc] text-white border-[#8c82fc]":"text-gray-500 border-gray-200 hover:border-[#8c82fc]"}`} style={{fontFamily:'Montserrat, sans-serif'}}>{c}</button>
              ))}
            </div>
          </div>
          <Card className="border-[#e8e6fe]">
            <CardContent className="p-0">
              {loading ? <p className="text-center py-8 text-gray-400">Loading...</p> : (
                <div className="divide-y divide-[#e8e6fe]">
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#f5f4ff] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div>Description</div><div>Vendor</div><div>Date</div><div>Amount</div><div>Status</div><div></div>
                  </div>
                  {filtered.map(e => (
                    <div key={e.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 hover:bg-[#f5f4ff] items-center">
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{e.title}</p>
                        <p className="text-xs text-gray-400">{e.category}</p>
                      </div>
                      <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>{e.vendor}</p>
                      <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>{e.date ? format(parseISO(e.date),"d MMM yy") : "—"}</p>
                      <p className="text-sm font-bold text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{e.currency} {(e.amount||0).toLocaleString()}</p>
                      <Badge className={`text-xs font-bold border-0 ${e.status==="paid"?"bg-green-100 text-green-700":e.status==="pending"?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-500"}`}>{e.status}</Badge>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(e); setForm({...e}); setShowForm(true); }} className="p-1 hover:bg-[#e8e6fe] rounded"><Edit className="w-3.5 h-3.5 text-gray-400"/></button>
                        <button onClick={() => remove(e.id)} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400"/></button>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No expenses found</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewals" className="mt-4">
          <div className="space-y-3">
            {urgentRenewals.map(c => {
              const days = differenceInDays(parseISO(c.due_date), new Date());
              const isOvd = days < 0;
              return (
                <Card key={c.id} className={`border ${isOvd?"border-red-200 bg-red-50":"border-yellow-200 bg-yellow-50"}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{c.title}</p>
                      <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>{c.category} · Due {format(parseISO(c.due_date),"d MMM yyyy")}</p>
                    </div>
                    <Badge className={`font-bold border-0 ${isOvd?"bg-red-100 text-red-700":"bg-yellow-100 text-yellow-700"}`}>
                      {isOvd ? `${Math.abs(days)}d overdue` : `${days}d left`}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
            {urgentRenewals.length === 0 && <p className="text-sm text-gray-400">No urgent renewals — all clear ✅</p>}
          </div>
        </TabsContent>

        <TabsContent value="banks" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map(b => (
              <Card key={b.id} className="border-[#e8e6fe]">
                <CardContent className="p-4">
                  <p className="font-bold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>{b.bank_name}</p>
                  <p className="text-xs text-gray-400 mb-2" style={{fontFamily:'Montserrat, sans-serif'}}>{b.account_name} · {b.currency}</p>
                  <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>A/C: {b.account_number}</p>
                  {b.notes && <p className="text-[11px] text-gray-400 mt-2" style={{fontFamily:'Montserrat, sans-serif'}}>{b.notes}</p>}
                </CardContent>
              </Card>
            ))}
            {banks.length === 0 && <p className="text-gray-400 text-sm">Add bank accounts in Admin → Bank Accounts</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle style={{fontFamily:'Exo 2, sans-serif'}}>{editing ? "Edit Expense" : "Add Expense"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Title"><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Amount"><Input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:parseFloat(e.target.value)||0}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
              <F label="Currency"><Select value={form.currency} onValueChange={v=>setForm(f=>({...f,currency:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{["HKD","USD","EUR","GBP"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></F>
            </div>
            <F label="Category"><Select value={form.category} onValueChange={v=>setForm(f=>({...f,category:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{CATS.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Date"><Input type="date" value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
              <F label="Status"><Select value={form.status||"paid"} onValueChange={v=>setForm(f=>({...f,status:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{["paid","pending","cancelled"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></F>
            </div>
            <F label="Vendor"><Input value={form.vendor||""} onChange={e=>setForm(f=>({...f,vendor:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Payment Method"><Select value={form.payment_method||"Other"} onValueChange={v=>setForm(f=>({...f,payment_method:v}))}><SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger><SelectContent>{METHODS.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></F>
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
