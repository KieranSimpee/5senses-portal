import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Eye, EyeOff, ExternalLink, Trash2, Edit, Search, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";

const catColors = {
  bank: "bg-green-100 text-green-700",
  login: "bg-blue-100 text-blue-700",
  api_key: "bg-purple-100 text-purple-700",
  domain: "bg-orange-100 text-orange-700",
  social_media: "bg-pink-100 text-pink-700",
  email: "bg-yellow-100 text-yellow-700",
  payment: "bg-red-100 text-red-700",
  other: "bg-secondary text-muted-foreground",
};

const catIcons = { bank: "🏦", login: "🔑", api_key: "⚙️", domain: "🌐", social_media: "📱", email: "📧", payment: "💳", other: "🔒" };

const empty = { name: "", category: "login", username: "", password_hint: "", url: "", account_number: "", bank_name: "", notes: "", admin_only: true, monthly_cost: "", yearly_cost: "", renewal_date: "", auto_launch_url: "" };

export default function Vault() {
  const [creds, setCreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [accessChecked, setAccessChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setAccessChecked(true);
      if (u?.role === "admin") {
        base44.entities.SecureCredential.list("-created_date").then(d => { setCreds(d); setLoading(false); });
      } else {
        setLoading(false);
      }
    }).catch(() => setAccessChecked(true));
  }, []);

  const load = async () => {
    const d = await base44.entities.SecureCredential.list("-created_date");
    setCreds(d);
  };

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c, monthly_cost: c.monthly_cost || "", yearly_cost: c.yearly_cost || "" }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    const data = { ...form, monthly_cost: form.monthly_cost ? parseFloat(form.monthly_cost) : undefined, yearly_cost: form.yearly_cost ? parseFloat(form.yearly_cost) : undefined };
    if (editing) await base44.entities.SecureCredential.update(editing.id, data);
    else await base44.entities.SecureCredential.create(data);
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await base44.entities.SecureCredential.delete(id);
    load();
  };

  if (!accessChecked) return <div className="text-center py-20 text-sm text-muted-foreground font-montserrat">Loading...</div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-exo text-xl font-semibold text-foreground">Admin Access Required</h2>
        <p className="text-sm text-muted-foreground font-montserrat text-center max-w-sm">The Vault is restricted to admin users only. Contact your administrator for access.</p>
      </div>
    );
  }

  const filtered = creds.filter(c => {
    const ms = c.name?.toLowerCase().includes(search.toLowerCase()) || c.url?.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "all" || c.category === catFilter;
    return ms && mc;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-montserrat text-primary font-semibold">ADMIN ONLY</span>
          </div>
          <h1 className="font-exo text-2xl font-semibold text-foreground">Secure Vault</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Bank accounts, login credentials & API keys</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 font-montserrat">
          <Plus className="w-4 h-4 mr-2" /> Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search vault..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-44 font-montserrat"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.keys(catColors).map(c => <SelectItem key={c} value={c}>{catIcons[c]} {c.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-muted-foreground font-montserrat">Loading vault...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground font-montserrat">
          <Lock className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          No entries yet. Add your first credential.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <Card key={c.id} className="border-border hover:shadow-md transition-shadow group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{catIcons[c.category] || "🔒"}</span>
                    <div>
                      <h3 className="font-exo font-semibold text-sm text-foreground">{c.name}</h3>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold font-montserrat ${catColors[c.category] || ""}`}>{c.category?.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="p-1 rounded hover:bg-secondary"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => remove(c.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-montserrat">
                  {c.username && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Username</span>
                      <span className="font-medium text-foreground">{revealed[c.id + "_user"] ? c.username : "••••••••"}</span>
                      <button onClick={() => setRevealed(r => ({ ...r, [c.id + "_user"]: !r[c.id + "_user"] }))}>
                        {revealed[c.id + "_user"] ? <EyeOff className="w-3 h-3 text-muted-foreground" /> : <Eye className="w-3 h-3 text-muted-foreground" />}
                      </button>
                    </div>
                  )}
                  {c.password_hint && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Password hint</span>
                      <span className="font-medium text-foreground">{revealed[c.id + "_pass"] ? c.password_hint : "••••••"}</span>
                      <button onClick={() => setRevealed(r => ({ ...r, [c.id + "_pass"]: !r[c.id + "_pass"] }))}>
                        {revealed[c.id + "_pass"] ? <EyeOff className="w-3 h-3 text-muted-foreground" /> : <Eye className="w-3 h-3 text-muted-foreground" />}
                      </button>
                    </div>
                  )}
                  {c.account_number && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium text-foreground">{revealed[c.id + "_acct"] ? c.account_number : "•••• " + c.account_number.slice(-4)}</span>
                      <button onClick={() => setRevealed(r => ({ ...r, [c.id + "_acct"]: !r[c.id + "_acct"] }))}>
                        {revealed[c.id + "_acct"] ? <EyeOff className="w-3 h-3 text-muted-foreground" /> : <Eye className="w-3 h-3 text-muted-foreground" />}
                      </button>
                    </div>
                  )}
                  {c.monthly_cost && <div className="flex justify-between"><span className="text-muted-foreground">Monthly cost</span><span className="font-semibold text-foreground">HKD {c.monthly_cost}</span></div>}
                  {c.renewal_date && <div className="flex justify-between"><span className="text-muted-foreground">Renewal</span><span className="text-foreground">{format(parseISO(c.renewal_date), "MMM d, yyyy")}</span></div>}
                </div>

                {(c.auto_launch_url || c.url) && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <a href={c.auto_launch_url || c.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary font-montserrat font-medium hover:underline">
                      <ExternalLink className="w-3 h-3" /> Open {c.name}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg font-montserrat max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-exo">{editing ? "Edit Entry" : "Add Vault Entry"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. GoDaddy Account" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.keys(catColors).map(c => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Username / Email</Label>
                <Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username@email.com" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Password Hint</Label>
                <Input value={form.password_hint} onChange={e => setForm({ ...form, password_hint: e.target.value })} placeholder="Hint (not actual password)" />
              </div>
            </div>
            {form.category === "bank" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold mb-1">Bank Name</Label>
                  <Input value={form.bank_name} onChange={e => setForm({ ...form, bank_name: e.target.value })} placeholder="e.g. HSBC" />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1">Account Number</Label>
                  <Input value={form.account_number} onChange={e => setForm({ ...form, account_number: e.target.value })} placeholder="Account number" />
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs font-semibold mb-1">Website URL</Label>
              <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Quick Launch URL (direct login page)</Label>
              <Input value={form.auto_launch_url} onChange={e => setForm({ ...form, auto_launch_url: e.target.value })} placeholder="https://app.example.com/login" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Monthly Cost</Label>
                <Input type="number" value={form.monthly_cost} onChange={e => setForm({ ...form, monthly_cost: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Yearly Cost</Label>
                <Input type="number" value={form.yearly_cost} onChange={e => setForm({ ...form, yearly_cost: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Renewal Date</Label>
                <Input type="date" value={form.renewal_date} onChange={e => setForm({ ...form, renewal_date: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || saving} className="bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}