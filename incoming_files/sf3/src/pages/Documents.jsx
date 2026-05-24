import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Trash2, FileText, ExternalLink, Upload, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CATS = [
  "Brand Deck","Influencer Deck","Core Values","Contract","Design Asset",
  "Legal","Finance","Invoice","Company Registration","Compliance","HR",
  "Partner Correspondence","Other"
];

const CAT_COLORS = {
  "Brand Deck": "bg-purple-100 text-purple-700",
  "Influencer Deck": "bg-pink-100 text-pink-700",
  "Core Values": "bg-violet-100 text-violet-700",
  "Contract": "bg-red-100 text-red-700",
  "Design Asset": "bg-indigo-100 text-indigo-700",
  "Legal": "bg-red-100 text-red-700",
  "Finance": "bg-green-100 text-green-700",
  "Invoice": "bg-emerald-100 text-emerald-700",
  "Company Registration": "bg-blue-100 text-blue-700",
  "Compliance": "bg-orange-100 text-orange-700",
  "HR": "bg-yellow-100 text-yellow-700",
  "Partner Correspondence": "bg-cyan-100 text-cyan-700",
  "Other": "bg-gray-100 text-gray-600",
};

const CAT_ICONS = {
  "Brand Deck": "✨", "Influencer Deck": "📱", "Core Values": "💡",
  "Contract": "📄", "Design Asset": "🎨", "Legal": "⚖️",
  "Finance": "💰", "Invoice": "🧾", "Company Registration": "🏢",
  "Compliance": "✅", "HR": "👥", "Partner Correspondence": "📧", "Other": "📁",
};

const FOLDER_GROUPS = [
  { id: "all", label: "All Documents", icon: "📁" },
  { id: "Company Registration", label: "Company Docs", icon: "🏢" },
  { id: "Contract", label: "Contracts", icon: "📄" },
  { id: "Finance", label: "Finance", icon: "💰" },
  { id: "Invoice", label: "Invoices", icon: "🧾" },
  { id: "Brand Deck", label: "Brand", icon: "✨" },
  { id: "Legal", label: "Legal", icon: "⚖️" },
  { id: "HR", label: "HR", icon: "👥" },
  { id: "Compliance", label: "Compliance", icon: "✅" },
  { id: "Partner Correspondence", label: "Partnerships", icon: "📧" },
  { id: "Other", label: "Other", icon: "📎" },
];

const empty = {
  title: "", category: "Other", description: "", tags: "", version: "1.0",
  file_url: "", file_name: "", file_type: "", is_pinned: false
};

const F = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</Label>
    {children}
  </div>
);

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const d = await base44.entities.Document.list("-created_date").catch(() => []);
    setDocs(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    let file_url = form.file_url || "";
    let file_name = form.file_name || "";
    let file_type = form.file_type || "";
    if (file) {
      const { file_url: url } = await base44.integrations.Core.UploadFile({ file });
      file_url = url;
      file_name = file.name;
      file_type = file.type;
    }
    const tags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    await base44.entities.Document.create({ ...form, file_url, file_name, file_type, tags });
    await load();
    setShowForm(false);
    setFile(null);
    setForm(empty);
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this document?")) return;
    await base44.entities.Document.delete(id);
    await load();
  };

  const togglePin = async (doc) => {
    await base44.entities.Document.update(doc.id, { is_pinned: !doc.is_pinned });
    await load();
  };

  const filtered = docs.filter(d => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) ||
      (d.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFolder = selectedFolder === "all" || d.category === selectedFolder;
    return matchSearch && matchFolder;
  });

  const pinned = filtered.filter(d => d.is_pinned);
  const unpinned = filtered.filter(d => !d.is_pinned);

  const folderCounts = FOLDER_GROUPS.reduce((acc, g) => {
    acc[g.id] = g.id === "all" ? docs.length : docs.filter(d => d.category === g.id).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{ fontFamily: "Exo 2, sans-serif" }}>Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {docs.length} files · Contracts, invoices, brand assets & compliance
          </p>
        </div>
        <Button
          onClick={() => { setForm(empty); setFile(null); setShowForm(true); }}
          className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Plus className="w-4 h-4" /> Upload Doc
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Left folder sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {FOLDER_GROUPS.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedFolder(g.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                selectedFolder === g.id
                  ? "bg-[#8c82fc] text-white"
                  : "text-gray-600 hover:bg-[#e8e6fe] hover:text-[#5e50fb]"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="flex items-center gap-2">
                <span>{g.icon}</span>
                <span className="truncate">{g.label}</span>
              </span>
              {folderCounts[g.id] > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  selectedFolder === g.id ? "bg-white/20 text-white" : "bg-[#e8e6fe] text-[#8c82fc]"
                }`}>
                  {folderCounts[g.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            />
          </div>

          {loading ? (
            <p className="text-center py-12 text-gray-400 text-sm">Loading documents...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>No documents found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pinned */}
              {pinned.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#8c82fc] uppercase tracking-widest mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    📌 Pinned
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {pinned.map(doc => <DocCard key={doc.id} doc={doc} onDelete={remove} onPin={togglePin} />)}
                  </div>
                </div>
              )}

              {/* All others */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {unpinned.map(doc => <DocCard key={doc.id} doc={doc} onDelete={remove} onPin={togglePin} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Exo 2, sans-serif" }}>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Title">
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Category">
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger style={{ fontFamily: "Montserrat, sans-serif" }}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATS.map(c => <SelectItem key={c} value={c}>{CAT_ICONS[c]} {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            <F label="File">
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#e8e6fe] file:text-[#5e50fb] file:font-bold file:text-xs cursor-pointer"
              />
            </F>
            <F label="Or paste file URL directly">
              <Input value={form.file_url || ""} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} placeholder="https://..." style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Description">
              <Textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <F label="Tags (comma separated)">
              <Input value={form.tags || ""} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. fundfluent, contract, 2026" style={{ fontFamily: "Montserrat, sans-serif" }} />
            </F>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pinned" checked={form.is_pinned} onChange={e => setForm(f => ({ ...f, is_pinned: e.target.checked }))} className="rounded" />
              <label htmlFor="pinned" className="text-xs font-semibold text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>Pin this document</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || (!file && !form.file_url && !form.title)} className="flex-1 bg-[#8c82fc] hover:bg-[#5e50fb]">
                {saving ? "Saving..." : "Upload"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocCard({ doc, onDelete, onPin }) {
  return (
    <Card className={`border-[#e8e6fe] hover:border-[#bab4fd] hover:shadow-sm transition-all group ${doc.is_pinned ? "border-[#bab4fd] bg-[#faf9ff]" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#e8e6fe] flex items-center justify-center flex-shrink-0 text-lg">
            {CAT_ICONS[doc.category] || "📁"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-sm text-[#1a1a1f] leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {doc.title}
              </p>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => onPin(doc)} className="p-1 hover:bg-[#e8e6fe] rounded transition-colors" title={doc.is_pinned ? "Unpin" : "Pin"}>
                  <Pin className={`w-3 h-3 ${doc.is_pinned ? "text-[#8c82fc] fill-[#8c82fc]" : "text-gray-300"}`} />
                </button>
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#e8e6fe] rounded transition-colors">
                    <ExternalLink className="w-3 h-3 text-[#8c82fc]" />
                  </a>
                )}
                <button onClick={() => onDelete(doc.id)} className="p-1 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            </div>
            <Badge className={`mt-1 text-[10px] font-bold border-0 ${CAT_COLORS[doc.category] || "bg-gray-100 text-gray-500"}`}>
              {doc.category}
            </Badge>
            {doc.description && (
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {doc.description}
              </p>
            )}
            {(doc.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {doc.tags.map(t => (
                  <span key={t} className="text-[10px] bg-[#e8e6fe] text-[#5e50fb] px-2 py-0.5 rounded-full font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const CAT_COLORS = {
  "Brand Deck": "bg-purple-100 text-purple-700",
  "Influencer Deck": "bg-pink-100 text-pink-700",
  "Core Values": "bg-violet-100 text-violet-700",
  "Contract": "bg-red-100 text-red-700",
  "Design Asset": "bg-indigo-100 text-indigo-700",
  "Legal": "bg-red-100 text-red-700",
  "Finance": "bg-green-100 text-green-700",
  "Invoice": "bg-emerald-100 text-emerald-700",
  "Company Registration": "bg-blue-100 text-blue-700",
  "Compliance": "bg-orange-100 text-orange-700",
  "HR": "bg-yellow-100 text-yellow-700",
  "Partner Correspondence": "bg-cyan-100 text-cyan-700",
  "Other": "bg-gray-100 text-gray-600",
};

const CAT_ICONS = {
  "Brand Deck": "✨", "Influencer Deck": "📱", "Core Values": "💡",
  "Contract": "📄", "Design Asset": "🎨", "Legal": "⚖️",
  "Finance": "💰", "Invoice": "🧾", "Company Registration": "🏢",
  "Compliance": "✅", "HR": "👥", "Partner Correspondence": "📧", "Other": "📁",
};
