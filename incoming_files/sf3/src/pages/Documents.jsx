import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Trash2, FileText, ExternalLink, Sparkles, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import FolderSidebar from "@/components/documents/FolderSidebar";

const catColors = {
  contract: "bg-red-100 text-red-700",
  agreement: "bg-orange-100 text-orange-700",
  letterhead: "bg-blue-100 text-blue-700",
  brand: "bg-purple-100 text-purple-700",
  legal: "bg-red-100 text-red-700",
  finance: "bg-green-100 text-green-700",
  hr: "bg-yellow-100 text-yellow-700",
  marketing: "bg-pink-100 text-pink-700",
  other: "bg-secondary text-muted-foreground",
};

const catIcons = { contract: "📄", agreement: "🤝", letterhead: "📝", brand: "✨", legal: "⚖️", finance: "💰", hr: "👥", marketing: "📢", other: "📁" };

const empty = { title: "", category: "other", notes: "", is_template: false, access_level: "team", tags: "", version: "1.0", folder_id: "" };

// Tag-based matching for built-in virtual folders
const BUILTIN_FOLDER_TAGS = {
  "__simplexity__": ["simplex-ity", "simplexity", "trademark", "brand", "simplex"],
  "__5senses__": ["5senses", "5sensesbeauty", "incorporation", "business registration", "company setup", "virtual office", "airwallex", "sick leave", "hr", "reap business"],
};

function docMatchesFolder(doc, folderId) {
  if (!folderId) return true;
  if (folderId.startsWith("__")) {
    const tags = BUILTIN_FOLDER_TAGS[folderId] || [];
    const docTags = (doc.tags || []).map(t => t.toLowerCase());
    const titleLower = (doc.title || "").toLowerCase();
    return tags.some(ft => docTags.includes(ft) || titleLower.includes(ft));
  }
  return doc.folder_id === folderId;
}

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [autoAssigning, setAutoAssigning] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [genPrompt, setGenPrompt] = useState("");
  const [genType, setGenType] = useState("letterhead");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const load = async () => {
    const [d, f] = await Promise.all([
      base44.entities.Document.list("-created_date"),
      base44.entities.DocumentFolder.list("name"),
    ]);
    setDocs(d);
    setFolders(f);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // AI auto-assign folder when a file is selected
  const handleFileChange = async (selectedFile) => {
    setFile(selectedFile);
    if (!selectedFile || folders.length === 0) return;
    setAutoAssigning(true);
    const folderNames = folders.map(f => `${f.id}|${f.name}`).join(", ");
    const builtins = "__simplexity__|Simplex-ity Brand, __5senses__|5Senses Beauty Ltd";
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a document filing assistant. Given a document filename and title, suggest which folder it belongs to.

Filename: "${selectedFile.name}"
Document title: "${form.title || selectedFile.name}"

Available folders (id|name):
${builtins}, ${folderNames}

Reply with ONLY the folder id that best matches, or "none" if no folder fits. Examples of matching: "business registration" → __5senses__, "trademark" → __simplexity__, "company registration" → __5senses__, "contract" → whichever folder is most relevant.`,
    });
    const suggested = result?.trim();
    if (suggested && suggested !== "none") {
      // Check if it's a known id
      const validIds = folders.map(f => f.id).concat(["__simplexity__", "__5senses__"]);
      if (validIds.includes(suggested)) {
        const folderLabel = suggested === "__simplexity__" ? "Simplex-ity Brand"
          : suggested === "__5senses__" ? "5Senses Beauty Ltd"
          : folders.find(f => f.id === suggested)?.name || suggested;
        setForm(prev => ({ ...prev, folder_id: suggested, _aiSuggestedFolder: folderLabel }));
      }
    }
    setAutoAssigning(false);
  };

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
    await base44.entities.Document.create({ ...form, file_url, file_name, file_type, tags, folder_id: form.folder_id || null });
    setSaving(false);
    setShowForm(false);
    setFile(null);
    setForm(empty);
    load();
  };

  // Handle drag-and-drop of a doc onto a folder
  const handleDropDoc = async (docId, folderId) => {
    // For built-in virtual folders, we update tags instead of folder_id
    if (folderId === "__simplexity__") {
      const doc = docs.find(d => d.id === docId);
      if (!doc) return;
      const existingTags = doc.tags || [];
      if (!existingTags.includes("simplexity")) {
        await base44.entities.Document.update(docId, { tags: [...existingTags, "simplexity"] });
      }
    } else if (folderId === "__5senses__") {
      const doc = docs.find(d => d.id === docId);
      if (!doc) return;
      const existingTags = doc.tags || [];
      if (!existingTags.includes("5senses")) {
        await base44.entities.Document.update(docId, { tags: [...existingTags, "5senses"] });
      }
    } else {
      await base44.entities.Document.update(docId, { folder_id: folderId });
    }
    load();
  };

  const remove = async (id) => {
    await base44.entities.Document.delete(id);
    load();
  };

  const generateDoc = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a professional Simplex-ity company document of type: ${genType}. 
Company: Simplex-ity Limited
Address: RM1608, 16/F, APEC Plaza, 49 Hoi Tuen Rd, Kwun Tong, Hong Kong
Website: https://www.simplex-ity.com
Brand: One Stop Asian Beauty - Simplify to Amplify

Additional instructions: ${genPrompt}

Format as clean, professional document text ready for use. Include appropriate headers, sections, and placeholder fields marked with [PLACEHOLDER].`,
    });
    setGeneratedContent(result);
    setGenerating(false);
  };

  const saveGenerated = async () => {
    setSaving(true);
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const fileObj = new File([blob], `${genType}-${Date.now()}.txt`, { type: "text/plain" });
    const { file_url } = await base44.integrations.Core.UploadFile({ file: fileObj });
    await base44.entities.Document.create({
      title: `${genType.charAt(0).toUpperCase() + genType.slice(1)} - ${new Date().toLocaleDateString()}`,
      category: genType === "letterhead" ? "letterhead" : genType === "contract" ? "contract" : "other",
      file_url,
      file_name: fileObj.name,
      file_type: "text/plain",
      is_template: true,
      access_level: "team",
      notes: genPrompt,
      folder_id: selectedFolder && !selectedFolder.startsWith("__") ? selectedFolder : null,
    });
    setSaving(false);
    setGenerateOpen(false);
    setGeneratedContent("");
    setGenPrompt("");
    load();
  };

  const filtered = docs.filter(d => {
    const ms = d.title?.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "all" || d.category === catFilter;
    const mf = docMatchesFolder(d, selectedFolder);
    return ms && mc && mf;
  });

  const folderName = selectedFolder
    ? selectedFolder === "__simplexity__" ? "✨ Simplex-ity Brand"
    : selectedFolder === "__5senses__" ? "💄 5Senses Beauty Limited"
    : folders.find(f => f.id === selectedFolder)?.name || "Folder"
    : "All Documents";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-exo text-2xl font-semibold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Company files, templates & generated documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setGenerateOpen(true)} className="font-montserrat text-sm">
            <Sparkles className="w-4 h-4 mr-2 text-primary" /> Generate Doc
          </Button>
          <Button onClick={() => { setForm({ ...empty, folder_id: selectedFolder && !selectedFolder.startsWith("__") ? selectedFolder : "" }); setFile(null); setShowForm(true); }} className="bg-primary hover:bg-primary/90 font-montserrat">
            <Plus className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Folder Sidebar */}
        <FolderSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelect={setSelectedFolder}
          onRefresh={load}
          onDropDoc={handleDropDoc}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="font-exo font-semibold text-foreground text-base">{folderName}</span>
            <span className="text-muted-foreground text-sm font-montserrat">({filtered.length} docs)</span>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat" />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-40 font-montserrat"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(catColors).map(c => <SelectItem key={c} value={c} className="capitalize">{catIcons[c]} {c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Doc Grid */}
          {loading ? (
            <div className="text-sm text-muted-foreground font-montserrat text-center py-8">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground font-montserrat text-center py-12">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              No documents in this folder yet.
            </div>
          ) : (
            <div>
            <p className="text-[11px] text-muted-foreground font-montserrat -mt-2 mb-1 flex items-center gap-1">
              <GripVertical className="w-3 h-3" /> Drag a document onto a folder to move it
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(d => (
                <Card
                  key={d.id}
                  draggable
                  onDragStart={e => e.dataTransfer.setData("docId", d.id)}
                  className="border-border hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing active:opacity-60 active:scale-95 transition-transform"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">{catIcons[d.category] || "📁"}</div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer" className="p-1 rounded hover:bg-secondary"><ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /></a>}
                        <button onClick={() => remove(d.id)} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </div>
                    <h3 className="font-exo font-semibold text-sm text-foreground line-clamp-2 mb-2">{d.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold font-montserrat capitalize ${catColors[d.category] || ""}`}>{d.category}</span>
                      {d.is_template && <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-montserrat">Template</span>}
                    </div>
                    {d.created_date && <p className="text-[11px] text-muted-foreground font-montserrat mt-2">{format(parseISO(d.created_date), "MMM d, yyyy")}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md font-montserrat">
          <DialogHeader><DialogTitle className="font-exo">Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold mb-1">Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Document title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.keys(catColors).map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Folder</Label>
                <Select value={form.folder_id} onValueChange={v => setForm({ ...form, folder_id: v })}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>None</SelectItem>
                    {folders.map(f => <SelectItem key={f.id} value={f.id}>{f.icon} {f.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">File</Label>
              <Input type="file" onChange={e => handleFileChange(e.target.files[0])} className="cursor-pointer" />
              {autoAssigning && (
                <p className="text-[11px] text-primary font-montserrat mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> AI is determining the best folder…
                </p>
              )}
              {form._aiSuggestedFolder && !autoAssigning && (
                <p className="text-[11px] text-green-700 font-montserrat mt-1">
                  ✅ AI suggested folder: <strong>{form._aiSuggestedFolder}</strong>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isTemplate" checked={form.is_template} onChange={e => setForm({ ...form, is_template: e.target.checked })} className="accent-primary" />
              <label htmlFor="isTemplate" className="text-sm font-montserrat">Mark as Template</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.title || saving} className="bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Upload"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-2xl font-montserrat">
          <DialogHeader><DialogTitle className="font-exo flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Document Generator</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold mb-1">Document Type</Label>
              <Select value={genType} onValueChange={setGenType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="letterhead">Company Letterhead</SelectItem>
                  <SelectItem value="contract">Service Contract</SelectItem>
                  <SelectItem value="agreement">Partnership Agreement</SelectItem>
                  <SelectItem value="proposal">Business Proposal</SelectItem>
                  <SelectItem value="invoice">Invoice Template</SelectItem>
                  <SelectItem value="nda">NDA Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Additional Instructions</Label>
              <Textarea value={genPrompt} onChange={e => setGenPrompt(e.target.value)} placeholder="e.g. Brand partnership agreement for influencer collaboration, include payment terms of 30 days..." rows={3} />
            </div>
            {!generatedContent ? (
              <Button onClick={generateDoc} disabled={generating} className="bg-primary hover:bg-primary/90 w-full">
                {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Document</>}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-secondary/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs font-montserrat whitespace-pre-wrap text-foreground">{generatedContent}</pre>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setGeneratedContent("")} className="flex-1">Regenerate</Button>
                  <Button onClick={saveGenerated} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Save to Documents"}</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}