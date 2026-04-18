import { useState, useEffect } from "react";
import { Note } from "@/api/entities";

const SOURCE_COLORS = {
  "WhatsApp": { bg: "#e8f5e9", color: "#2e7d32", icon: "💬" },
  "App": { bg: "#e8f0fe", color: "#1a73e8", icon: "📱" },
  "Email": { bg: "#fff8e1", color: "#f9a825", icon: "📧" },
  "Other": { bg: "#f5f5f5", color: "#757575", icon: "📌" },
};

const EMPTY_FORM = { title: "", content: "", source: "App", tags: [], pinned: false };

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    setLoading(true);
    const data = await Note.list("-created_date");
    setNotes(data);
    setLoading(false);
  }

  const filtered = notes.filter(n =>
    !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase())
  );
  const pinned = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);

  function openAdd() { setForm(EMPTY_FORM); setTagsInput(""); setEditing(null); setShowForm(true); }
  function openEdit(note) { setForm({ ...note }); setTagsInput((note.tags || []).join(", ")); setEditing(note.id); setShowForm(true); }

  async function handleSave() {
    const data = { ...form, tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean) };
    if (editing) await Note.update(editing, data);
    else await Note.create(data);
    setShowForm(false);
    loadNotes();
  }

  async function togglePin(note) {
    await Note.update(note.id, { pinned: !note.pinned });
    loadNotes();
  }

  async function handleDelete(id) {
    if (confirm("Delete this note?")) { await Note.delete(id); loadNotes(); }
  }

  const NoteCard = ({ note }) => (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderLeft: note.pinned ? "4px solid #f9a825" : "4px solid transparent" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontWeight: 600, color: "#1a1f2e", fontSize: 15 }}>{note.title || "Untitled"}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ padding: "3px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: SOURCE_COLORS[note.source]?.bg || "#f5f5f5", color: SOURCE_COLORS[note.source]?.color || "#555" }}>
            {SOURCE_COLORS[note.source]?.icon} {note.source}
          </span>
          <button onClick={() => togglePin(note)} title={note.pinned ? "Unpin" : "Pin"} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: note.pinned ? 1 : 0.4 }}>📌</button>
          <button onClick={() => openEdit(note)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 13 }}>Edit</button>
          <button onClick={() => handleDelete(note.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 13 }}>Delete</button>
        </div>
      </div>
      {note.content && <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{note.content}</div>}
      {note.tags && note.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {note.tags.map(tag => (
            <span key={tag} style={{ padding: "2px 8px", borderRadius: 10, background: "#f0f2f7", color: "#555", fontSize: 11 }}>#{tag}</span>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11, color: "#bbb", marginTop: 8 }}>{new Date(note.created_date).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
    </div>
  );

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>📝 Notes</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>Capture ideas, meetings, and updates</p>
        </div>
        <button onClick={openAdd} style={{ background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Quick Note</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="🔍 Search notes..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: 400, padding: "10px 16px", borderRadius: 10, border: "1px solid #dde2ec", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pinned.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f9a825", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>📌 Pinned</div>
              {pinned.map(n => <NoteCard key={n.id} note={n} />)}
              <div style={{ height: 8 }} />
            </>
          )}
          {unpinned.length > 0 && (
            <>
              {pinned.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#9aa3b2", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>All Notes</div>}
              {unpinned.map(n => <NoteCard key={n.id} note={n} />)}
            </>
          )}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>No notes yet. Add your first one — or send me a message on WhatsApp!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18 }}>{editing ? "Edit" : "Add"} Note</h2>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Title</label>
              <input type="text" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Content</label>
              <textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })}
                rows={5} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Source</label>
              <select value={form.source || "App"} onChange={e => setForm({ ...form, source: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14 }}>
                {["App", "WhatsApp", "Email", "Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Tags (comma separated)</label>
              <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="e.g. client, urgent, meeting"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="pinned" checked={form.pinned || false} onChange={e => setForm({ ...form, pinned: e.target.checked })} />
              <label htmlFor="pinned" style={{ fontSize: 13, color: "#555", cursor: "pointer" }}>📌 Pin this note</label>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #dde2ec", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#4f8ef7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
