import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Folder, FolderOpen, Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function FolderNode({ folder, allFolders, selectedId, onSelect, onDelete, onDrop, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const children = allFolders.filter(f => f.parent_id === folder.id);
  const isSelected = selectedId === folder.id;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const docId = e.dataTransfer.getData("docId");
    if (docId) onDrop(docId, folder.id);
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer group transition-all ${
          dragOver ? "bg-primary/20 ring-2 ring-primary/40 scale-[1.02]" :
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(folder.id)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children.length > 0 ? (
          <button onClick={e => { e.stopPropagation(); setOpen(!open); }} className="flex-shrink-0">
            {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : <span className="w-3" />}
        <span className="text-sm">{folder.icon || "📁"}</span>
        <span className="text-xs font-montserrat font-medium flex-1 truncate">{folder.name}</span>
        <button
          onClick={e => { e.stopPropagation(); onDelete(folder.id); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100"
        >
          <Trash2 className="w-3 h-3 text-red-400" />
        </button>
      </div>
      {open && children.map(child => (
        <FolderNode key={child.id} folder={child} allFolders={allFolders} selectedId={selectedId} onSelect={onSelect} onDelete={onDelete} onDrop={onDrop} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function FolderSidebar({ folders, selectedFolder, onSelect, onRefresh, onDropDoc }) {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", company: "shared", parent_id: "", icon: "📁" });
  const [saving, setSaving] = useState(false);
  const [builtinDragOver, setBuiltinDragOver] = useState(null);

  const rootFolders = folders.filter(f => !f.parent_id);

  const save = async () => {
    setSaving(true);
    await base44.entities.DocumentFolder.create({ ...form, parent_id: form.parent_id || null });
    setSaving(false);
    setShowNew(false);
    setForm({ name: "", company: "shared", parent_id: "", icon: "📁" });
    onRefresh();
  };

  const remove = async (id) => {
    await base44.entities.DocumentFolder.delete(id);
    if (selectedFolder === id) onSelect(null);
    onRefresh();
  };

  const handleBuiltinDrop = (e, folderId) => {
    e.preventDefault();
    setBuiltinDragOver(null);
    const docId = e.dataTransfer.getData("docId");
    if (docId) onDropDoc(docId, folderId);
  };

  return (
    <div className="w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-montserrat font-bold text-muted-foreground uppercase tracking-wider">Folders</span>
        <button onClick={() => setShowNew(true)} className="p-1 rounded hover:bg-secondary">
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* All Documents */}
      <div
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors mb-1 ${!selectedFolder ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"}`}
      >
        <FolderOpen className="w-3.5 h-3.5" />
        <span className="text-xs font-montserrat font-medium">All Documents</span>
      </div>

      {/* Built-in company folders */}
      {[
        { id: "__simplexity__", name: "Simplex-ity Brand", icon: "✨" },
        { id: "__5senses__", name: "5Senses Beauty Ltd", icon: "💄" },
      ].map(f => (
        <div
          key={f.id}
          onClick={() => onSelect(f.id)}
          onDragOver={e => { e.preventDefault(); setBuiltinDragOver(f.id); }}
          onDragLeave={() => setBuiltinDragOver(null)}
          onDrop={e => handleBuiltinDrop(e, f.id)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all mb-0.5 ${
            builtinDragOver === f.id ? "bg-primary/20 ring-2 ring-primary/40 scale-[1.02]" :
            selectedFolder === f.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
          }`}
        >
          <span className="text-sm">{f.icon}</span>
          <span className="text-xs font-montserrat font-medium flex-1">{f.name}</span>
        </div>
      ))}

      {/* Custom folders */}
      {rootFolders.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          {rootFolders.map(f => (
            <FolderNode key={f.id} folder={f} allFolders={folders} selectedId={selectedFolder} onSelect={onSelect} onDelete={remove} onDrop={onDropDoc} />
          ))}
        </div>
      )}

      {/* New Folder Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-sm font-montserrat">
          <DialogHeader><DialogTitle className="font-exo">New Folder</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold mb-1">Folder Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Trademark Filing 2026" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold mb-1">Company</Label>
                <Select value={form.company} onValueChange={v => setForm({ ...form, company: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simplexity">✨ Simplex-ity</SelectItem>
                    <SelectItem value="5senses">💄 5Senses Beauty</SelectItem>
                    <SelectItem value="shared">📁 Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">Icon</Label>
                <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📁" maxLength={2} />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Parent Folder (optional)</Label>
              <Select value={form.parent_id} onValueChange={v => setForm({ ...form, parent_id: v })}>
                <SelectTrigger><SelectValue placeholder="Root level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Root level</SelectItem>
                  {folders.map(f => <SelectItem key={f.id} value={f.id}>{f.icon} {f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || saving} className="bg-primary hover:bg-primary/90">
                {saving ? "Creating..." : "Create Folder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}