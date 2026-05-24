import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Eye, EyeOff, ExternalLink, Trash2, Edit, Search, Lock, ShieldCheck, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATS = ["Company Admin","Microsoft Licenses","Website & Hosting","Branding & Design","AI & Platform","Finance & Trading","Internal Tools","Other"];

const CAT_COLORS = {
  "Company Admin": "bg-blue-100 text-blue-700",
  "Microsoft Licenses": "bg-cyan-100 text-cyan-700",
  "Website & Hosting": "bg-orange-100 text-orange-700",
  "Branding & Design": "bg-pink-100 text-pink-700",
  "AI & Platform": "bg-purple-100 text-purple-700",
  "Finance & Trading": "bg-green-100 text-green-700",
  "Internal Tools": "bg-yellow-100 text-yellow-700",
  "Other": "bg-gray-100 text-gray-600",
};

const CAT_ICONS = {
  "Company Admin": "🏢",
  "Microsoft Licenses": "📧",
  "Website & Hosting": "🌐",
  "Branding & Design": "🎨",
  "AI & Platform": "🤖",
  "Finance & Trading": "💹",
  "Internal Tools": "🔧",
  "Other": "🔒",
};

const empty = {
  service_name: "", category: "Company Admin", url: "", username: "",
  password: "", notes: "", is_admin_only: true
};

const F = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</Label>
    {children}
  </div>
);

export default function Vault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [copied, setCopied] = useState({});

  useEffect(() => { load(); }, []);

  const load = async () => {
    const d = await base44.entities.VaultItem.list().catch(() => []);
    setItems(d);
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await base44.entities.VaultItem.update(editing.id, form);
    else await base44.entities.VaultItem.create({ ...form, last_updated: new Date().toISOString().split("T")[0] });
    await load();
    setShowForm(false);
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this vault entry?")) return;
    await base44.entities.VaultItem.delete(id);
    await load();
  };

  const copyToClipboard = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(c => ({ ...c, [key]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 1500);
  };

  const categories = ["All", ...CATS];
  const filtered = items.filter(i =>
    (catFilter === "All" || i.category === catFilter) &&
    (!search || i.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.username?.toLowerCase().includes(search.toLowerCase()) ||
      i.notes?.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = CATS.reduce((acc, cat) => {
    const matches = filtered.filter(i => i.category === cat);
    if (matches.length > 0) acc[cat] = matches;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#8c82fc]" />
            <span className="text-xs font-bold text-[#8c82fc] tracking-widest" style={{ fontFamily: "Montserrat, sans-serif" }}>SECURE VAULT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{ fontFamily: "Exo 2, sans-serif" }}>Credentials Vault</h1>
          <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {items.length} entries · All logins, tools & platforms
          </p>
        </div>
        <Button
          onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}
          className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Plus className="w-4 h-4" /> Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search vault..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 w-56"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                catFilter === c
                  ? "bg-[#8c82fc] text-white border-[#8c82fc]"
                  : "text-gray-500 border-gray-200 hover:border-[#8c82fc]"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {c === "All" ? "All" : `${CAT_ICONS[c]} ${c}`}
            </button>
          ))}
        </div>
      </div>

      {/* Vault entries grouped by category */}
      {loading ? (
        <p className="text-center py-12 text-gray-400 text-sm">Loading vault...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Lock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>No entries found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <h3 className="text-xs font-bold text-[#8c82fc] uppercase tracking-widest mb-3 flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <span>{CAT_ICONS[cat]}</span> {cat} <span className="text-gray-300">({catItems.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {catItems.map(item => (
                  <Card key={item.id} className="border-[#e8e6fe] hover:border-[#bab4fd] hover:shadow-sm transition-all group">
                    <CardContent className="p-4">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#1a1a1f] truncate" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            {item.service_name}
                          </p>
                          <Badge className={`mt-0.5 text-[10px] font-bold border-0 ${CAT_COLORS[item.category] || "bg-gray-100 text-gray-500"}`}>
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-[#e8e6fe] rounded-lg transition-colors">
                              <ExternalLink className="w-3.5 h-3.5 text-[#8c82fc]" />
                            </a>
                          )}
                          <button onClick={() => { setEditing(item); setForm({ ...item }); setShowForm(true); }} className="p-1.5 hover:bg-[#e8e6fe] rounded-lg transition-colors">
                            <Edit className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          <button onClick={() => remove(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Username */}
                      {item.username && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-gray-400 w-16 flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif" }}>Username</span>
                          <span className="text-xs font-medium text-[#1a1a1f] flex-1 truncate" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            {item.username}
                          </span>
                          <button onClick={() => copyToClipboard(item.username, item.id + "_u")} className="p-1 hover:bg-[#e8e6fe] rounded flex-shrink-0">
                            <Copy className={`w-3 h-3 ${copied[item.id + "_u"] ? "text-green-500" : "text-gray-300"}`} />
                          </button>
                        </div>
                      )}

                      {/* Password */}
                      {item.password && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-gray-400 w-16 flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif" }}>Password</span>
                          <span className="text-xs font-mono bg-[#f5f4ff] px-2 py-0.5 rounded flex-1 truncate">
                            {revealed[item.id] ? item.password : "••••••••••"}
                          </span>
                          <button onClick={() => setRevealed(r => ({ ...r, [item.id]: !r[item.id] }))} className="p-1 hover:bg-[#e8e6fe] rounded flex-shrink-0">
                            {revealed[item.id] ? <EyeOff className="w-3 h-3 text-gray-400" /> : <Eye className="w-3 h-3 text-gray-400" />}
                          </button>
                          <button onClick={() => copyToClipboard(item.password, item.id + "_p")} className="p-1 hover:bg-[#e8e6fe] rounded flex-shrink-0">
                            <Copy className={`w-3 h-3 ${copied[item.id + "_p"] ? "text-green-500" : "text-gray-300"}`} />
                          </button>
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className="text-[11px] text-gray-400 leading-relaxed mt-2 border-t border-[#e8e6fe] pt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                          {item.notes}
                        </p>
                      )}
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Exo 2, sans-serif" }}>
              {editing ? "Edit Vault Entry" : "Add Vault Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Service Name">
              <Input value={form.service_name} onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))} placeholder="e.g. GoDaddy" style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Category">
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger style={{ fontFamily: "Montserrat, sans-serif" }}><SelectValue /></SelectTrigger>
                <SelectContent>{CATS.map(c => <SelectItem key={c} value={c}>{CAT_ICONS[c]} {c}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="URL">
              <Input value={form.url || ""} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Username / Email">
              <Input value={form.username || ""} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Password">
              <Input type="text" value={form.password || ""} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Notes">
              <Input value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 bg-[#8c82fc] hover:bg-[#5e50fb]">
                {saving ? "Saving..." : editing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
