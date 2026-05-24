import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, ExternalLink, Trash2, Edit, Search, Grid3X3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";

const catColors = {
  hosting: "bg-blue-100 text-blue-700",
  design: "bg-pink-100 text-pink-700",
  branding: "bg-purple-100 text-purple-700",
  development: "bg-indigo-100 text-indigo-700",
  productivity: "bg-green-100 text-green-700",
  analytics: "bg-yellow-100 text-yellow-700",
  communication: "bg-orange-100 text-orange-700",
  finance: "bg-emerald-100 text-emerald-700",
  other: "bg-secondary text-muted-foreground",
};

const catEmojis = { hosting: "🌐", design: "🎨", branding: "✨", development: "💻", productivity: "⚡", analytics: "📊", communication: "💬", finance: "💰", other: "🔧" };

// Pre-defined popular tools for Simplex-ity
const suggestedTools = [
  { name: "GoDaddy", url: "https://www.godaddy.com", category: "hosting", description: "Domain & hosting management" },
  { name: "Looka", url: "https://looka.com", category: "branding", description: "AI logo & brand design" },
  { name: "Canva", url: "https://canva.com", category: "design", description: "Design & marketing materials" },
  { name: "Base44", url: "https://base44.com", category: "development", description: "App builder platform" },
  { name: "Microsoft Outlook", url: "https://outlook.office365.com", category: "communication", description: "Email & calendar" },
  { name: "Shopify", url: "https://shopify.com", category: "development", description: "E-commerce platform" },
  { name: "Notion", url: "https://notion.so", category: "productivity", description: "Documentation & notes" },
  { name: "Google Analytics", url: "https://analytics.google.com", category: "analytics", description: "Website analytics" },
];

const empty = { name: "", category: "other", url: "", description: "", logo_url: "", monthly_cost: "", yearly_cost: "", renewal_date: "", is_active: true, notes: "" };

export default function Tools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const d = await base44.entities.AppTool.list("-created_date");
    setTools(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = (prefill = null) => {
    setEditing(null);
    setForm(prefill ? { ...empty, ...prefill } : empty);
    setShowForm(true);
  };
  const openEdit = (t) => { setEditing(t); setForm({ ...t, monthly_cost: t.monthly_cost || "", yearly_cost: t.yearly_cost || "" }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    const data = { ...form, monthly_cost: form.monthly_cost ? parseFloat(form.monthly_cost) : undefined, yearly_cost: form.yearly_cost ? parseFloat(form.yearly_cost) : undefined };
    if (editing) await base44.entities.AppTool.update(editing.id, data);
    else await base44.entities.AppTool.create(data);
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await base44.entities.AppTool.delete(id);
    load();
  };

  const filtered = tools.filter(t => {
    const ms = t.name?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "all" || t.category === catFilter;
    return ms && mc;
  });

  const totalMonthlyCost = tools.reduce((s, t) => s + (t.monthly_cost || 0), 0);
  const totalYearlyCost = tools.reduce((s, t) => s + (t.yearly_cost || 0), 0);

  const existingNames = tools.map(t => t.name.toLowerCase());
  const availableSuggestions = suggestedTools.filter(s => !existingNames.includes(s.name.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-exo text-2xl font-semibold text-foreground">Tools & Apps</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Quick-launch external tools and track subscriptions</p>
        </div>
        <Button onClick={() => openCreate()} className="bg-primary hover:bg-primary/90 font-montserrat">
          <Plus className="w-4 h-4 mr-2" /> Add Tool
        </Button>
      </div>

      {/* Cost Summary */}
      {tools.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-montserrat mb-1">Total Monthly Tools Cost</div>
              <div className="font-exo font-bold text-xl text-foreground">HKD {totalMonthlyCost.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground font-montserrat">{tools.filter(t => t.is_active).length} active tools</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-montserrat mb-1">Total Yearly Tools Cost</div>
              <div className="font-exo font-bold text-xl text-foreground">HKD {totalYearlyCost.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground font-montserrat">{tools.length} total registered</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-muted-foreground font-montserrat uppercase tracking-wide mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> Suggested Tools for Simplex-ity
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map(s => (
              <button key={s.name} onClick={() => openCreate(s)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-xs font-montserrat text-muted-foreground hover:text-primary">
                <Plus className="w-3 h-3" /> {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-44 font-montserrat"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.keys(catColors).map(c => <SelectItem key={c} value={c}>{catEmojis[c]} {c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-8 text-sm text-muted-foreground font-montserrat">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground font-montserrat">
          <Grid3X3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          No tools added yet. Add tools to quick-launch them from here.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(t => (
            <Card key={t.id} className={`border-border hover:shadow-md transition-all group cursor-pointer ${!t.is_active ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                    {t.logo_url ? <img src={t.logo_url} alt={t.name} className="w-8 h-8 object-contain rounded" /> : <span>{catEmojis[t.category] || "🔧"}</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(t)} className="p-1 rounded hover:bg-secondary"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => remove(t.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>
                <h3 className="font-exo font-semibold text-sm text-foreground mb-1">{t.name}</h3>
                {t.description && <p className="text-xs text-muted-foreground font-montserrat mb-2 line-clamp-2">{t.description}</p>}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold font-montserrat ${catColors[t.category] || ""}`}>{catEmojis[t.category]} {t.category}</span>
                  {t.monthly_cost > 0 && <span className="text-[11px] text-muted-foreground font-montserrat">HKD {t.monthly_cost}/mo</span>}
                </div>
                {t.url && (
                  <a href={t.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="mt-3 flex items-center gap-1 text-xs text-primary font-montserrat font-medium hover:underline pt-3 border-t border-border">
                    <ExternalLink className="w-3 h-3" /> Open {t.name}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg font-montserrat">
          <DialogHeader><DialogTitle className="font-exo">{editing ? "Edit Tool" : "Add Tool"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Tool Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Canva" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.keys(catColors).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">URL *</Label>
              <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Monthly Cost (HKD)</Label>
                <Input type="number" value={form.monthly_cost} onChange={e => setForm({ ...form, monthly_cost: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Yearly Cost (HKD)</Label>
                <Input type="number" value={form.yearly_cost} onChange={e => setForm({ ...form, yearly_cost: e.target.value })} placeholder="0" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Renewal Date</Label>
                <Input type="date" value={form.renewal_date} onChange={e => setForm({ ...form, renewal_date: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
              <label htmlFor="isActive" className="text-sm font-montserrat">Active subscription</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || !form.url || saving} className="bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}