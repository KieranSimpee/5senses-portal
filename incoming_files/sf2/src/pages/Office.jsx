import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Edit, Trash2, Building2, MapPin, Phone, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const catIcons = {
  address: <MapPin className="w-4 h-4 text-primary" />,
  contact: <Phone className="w-4 h-4 text-blue-500" />,
  legal: <FileText className="w-4 h-4 text-red-500" />,
  banking: <Building2 className="w-4 h-4 text-green-600" />,
  registration: <Globe className="w-4 h-4 text-orange-500" />,
  other: <Building2 className="w-4 h-4 text-muted-foreground" />,
};

const catColors = {
  address: "bg-primary/10 text-primary",
  contact: "bg-blue-100 text-blue-700",
  legal: "bg-red-100 text-red-700",
  banking: "bg-green-100 text-green-700",
  registration: "bg-orange-100 text-orange-700",
  other: "bg-secondary text-muted-foreground",
};

const empty = { key: "", label: "", value: "", category: "other", admin_only: false, notes: "" };

const defaultInfo = [
  { key: "company_name", label: "Company Name", value: "Simplex-ity Limited", category: "legal" },
  { key: "office_address", label: "Office Address", value: "RM1608, 16/F, APEC Plaza, 49 Hoi Tuen Rd, Kwun Tong, Hong Kong", category: "address" },
  { key: "website", label: "Website", value: "https://www.simplex-ity.com", category: "contact" },
  { key: "tagline", label: "Brand Tagline", value: "One Stop Asian Beauty: Simplify to Amplify", category: "other" },
];

export default function Office() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const load = async () => {
    const d = await base44.entities.OfficeInfo.list("category");
    setInfo(d);
    setLoading(false);
    return d;
  };

  useEffect(() => {
    load().then(d => {
      if (d.length === 0 && !seeded) {
        setSeeded(true);
        Promise.all(defaultInfo.map(item => base44.entities.OfficeInfo.create(item))).then(load);
      }
    });
  }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    if (editing) await base44.entities.OfficeInfo.update(editing.id, form);
    else await base44.entities.OfficeInfo.create(form);
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await base44.entities.OfficeInfo.delete(id);
    load();
  };

  const grouped = info.reduce((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const catOrder = ["address", "contact", "legal", "banking", "registration", "other"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-exo text-2xl font-semibold text-foreground">Office Info</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Company address, contacts, legal & registration details</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 font-montserrat">
          <Plus className="w-4 h-4 mr-2" /> Add Info
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-muted-foreground font-montserrat">Loading...</div>
      ) : (
        <div className="space-y-6">
          {catOrder.filter(c => grouped[c]).map(cat => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                {catIcons[cat]}
                <h2 className="font-exo font-semibold text-sm text-foreground capitalize">{cat.replace("_", " ")}</h2>
                <span className="text-xs text-muted-foreground font-montserrat">({grouped[cat].length})</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {grouped[cat].map(item => (
                  <Card key={item.id} className="border-border hover:shadow-md transition-shadow group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold font-montserrat ${catColors[item.category] || ""}`}>{item.category}</span>
                          {item.admin_only && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold font-montserrat">Admin</span>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="p-1 rounded hover:bg-secondary"><Edit className="w-3 h-3 text-muted-foreground" /></button>
                          <button onClick={() => remove(item.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3 h-3 text-red-400" /></button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-montserrat mb-0.5">{item.label}</p>
                      <p className="font-montserrat text-sm font-medium text-foreground break-words">{item.value}</p>
                      {item.notes && <p className="text-xs text-muted-foreground font-montserrat mt-1 italic">{item.notes}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md font-montserrat">
          <DialogHeader><DialogTitle className="font-exo">{editing ? "Edit Info" : "Add Company Info"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Key (unique ID)</Label>
                <Input value={form.key} onChange={e => setForm({ ...form, key: e.target.value.toLowerCase().replace(/\s/g, "_") })} placeholder="e.g. company_name" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["address","contact","legal","banking","registration","other"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Label *</Label>
              <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Office Address" />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Value *</Label>
              <Textarea value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="The actual information" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Notes</Label>
              <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="adminOnly" checked={form.admin_only} onChange={e => setForm({ ...form, admin_only: e.target.checked })} className="accent-primary" />
              <label htmlFor="adminOnly" className="text-sm font-montserrat">Restrict to admin only</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.label || !form.value || saving} className="bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}