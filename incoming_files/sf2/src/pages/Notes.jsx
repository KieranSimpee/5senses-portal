import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pin, PinOff, Search, X, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";

const empty = { title:"", content:"", source:"Manual", tags:[], pinned:false };

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setNotes(await base44.entities.Note.list("-created_date")); }
    catch { setNotes([]); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await base44.entities.Note.update(editing.id, form);
      else await base44.entities.Note.create(form);
      await load(); setShowForm(false); setSelected(null);
    } catch {}
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this note?")) return;
    await base44.entities.Note.delete(id);
    setSelected(null); await load();
  };

  const togglePin = async (note) => {
    await base44.entities.Note.update(note.id, { ...note, pinned: !note.pinned });
    await load();
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...(f.tags||[]), t] }));
    setTagInput("");
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const filtered = notes.filter(n =>
    !search || n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase()) ||
    n.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );
  const pinned = filtered.filter(n => n.pinned);
  const rest = filtered.filter(n => !n.pinned);

  const F = ({ label, children }) => (
    <div className="space-y-1.5">
      <Label className="font-montserrat text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );

  const NoteCard = ({ note }) => (
    <div
      onClick={() => setSelected(note)}
      className={`group p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${note.pinned ? "border-primary/30 bg-primary/5" : "border-border bg-white hover:border-primary/20"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-montserrat font-semibold text-sm text-foreground flex-1 leading-tight">{note.title}</div>
        <button onClick={e => { e.stopPropagation(); togglePin(note); }} className="p-1 rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {note.pinned ? <PinOff className="w-3.5 h-3.5 text-primary" /> : <Pin className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>
      <p className="text-xs text-muted-foreground font-montserrat mt-2 leading-relaxed line-clamp-3">{note.content}</p>
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[9px] font-montserrat px-1.5 py-0 uppercase tracking-wide">{tag}</Badge>)}
        </div>
      )}
      <div className="text-[10px] text-muted-foreground/50 font-montserrat mt-2">
        {note.source && <span>{note.source} · </span>}
        {note.created_date && format(parseISO(note.created_date), "d MMM yyyy")}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-exo text-2xl font-bold text-foreground">Notes</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Strategy notes · Action items · WhatsApp imports · {notes.length} total</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(empty); setTagInput(""); setShowForm(true); }} className="gap-2 font-montserrat">
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search notes, tags..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-montserrat" />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground font-montserrat text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground font-montserrat text-sm">No notes yet. <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="text-primary underline">Add one</button></div>
      ) : (
        <div className="space-y-6">
          {pinned.length > 0 && (
            <div>
              <div className="text-[10px] font-montserrat font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5"><Pin className="w-3 h-3"/>Pinned</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{pinned.map(n => <NoteCard key={n.id} note={n}/>)}</div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              {pinned.length > 0 && <div className="text-[10px] font-montserrat font-bold text-muted-foreground uppercase tracking-widest mb-3">All Notes</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{rest.map(n => <NoteCard key={n.id} note={n}/>)}</div>
            </div>
          )}
        </div>
      )}

      {/* Detail Side Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-border overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="font-exo font-bold text-lg text-foreground flex-1 pr-4">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-secondary rounded-md"><X className="w-4 h-4"/></button>
            </div>
            {selected.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">{selected.tags.map(t => <Badge key={t} variant="secondary" className="text-[9px] uppercase tracking-wide font-montserrat">{t}</Badge>)}</div>
            )}
            <p className="text-sm font-montserrat text-foreground leading-relaxed whitespace-pre-line">{selected.content}</p>
            <div className="text-xs text-muted-foreground font-montserrat pt-2">
              {selected.source && <div>Source: {selected.source}</div>}
              {selected.created_date && <div>Created: {format(parseISO(selected.created_date), "d MMMM yyyy")}</div>}
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => { setEditing(selected); setForm({...selected}); setTagInput(""); setShowForm(true); setSelected(null); }} className="font-montserrat gap-1"><Edit className="w-3 h-3"/>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(selected.id)} className="font-montserrat gap-1"><Trash2 className="w-3 h-3"/>Delete</Button>
              <Button size="sm" variant="outline" onClick={() => togglePin(selected)} className="font-montserrat gap-1">
                {selected.pinned ? <><PinOff className="w-3 h-3"/>Unpin</> : <><Pin className="w-3 h-3"/>Pin</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-exo">{editing ? "Edit Note" : "New Note"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <F label="Title"><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="font-montserrat" placeholder="Note title"/></F>
            <F label="Content"><Textarea value={form.content||""} onChange={e=>setForm(f=>({...f,content:e.target.value}))} rows={6} className="font-montserrat" placeholder="Write your note here..."/></F>
            <F label="Source"><Input value={form.source||""} onChange={e=>setForm(f=>({...f,source:e.target.value}))} className="font-montserrat" placeholder="e.g. WhatsApp, Meeting, Email"/></F>
            <F label="Tags">
              <div className="flex gap-2">
                <Input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){e.preventDefault();addTag();}}} placeholder="Add tag + Enter" className="font-montserrat"/>
                <Button type="button" variant="outline" onClick={addTag} className="font-montserrat">Add</Button>
              </div>
              {form.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.map(t=><Badge key={t} variant="secondary" className="font-montserrat text-xs gap-1">{t}<button onClick={()=>removeTag(t)}><X className="w-2.5 h-2.5"/></button></Badge>)}
                </div>
              )}
            </F>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pinned" checked={!!form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))} className="rounded"/>
              <label htmlFor="pinned" className="text-sm font-montserrat text-foreground">Pin this note</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 font-montserrat">{saving?"Saving...":editing?"Update":"Create"}</Button>
              <Button variant="outline" onClick={()=>setShowForm(false)} className="font-montserrat">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
