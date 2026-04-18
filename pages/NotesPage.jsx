import { useState, useEffect } from "react";
import { Note } from "@/api/entities";

const SOURCE_STYLES = {
  "WhatsApp": { bg: "#e4f7ec", color: "#1e8a4a", icon: "💬" },
  "App":      { bg: "#ede9fb", color: "#6c5ce7", icon: "📱" },
  "Email":    { bg: "#fff4e0", color: "#d4820a", icon: "📧" },
  "Other":    { bg: "#f0edfb", color: "#9b93c9", icon: "📌" },
};

const EMPTY_FORM = { title: "", content: "", source: "App", tags: [], pinned: false };

export default function NotesPage({ brand = {} }) {
  const P = {
    purple: "#8b7fd4", purpleLight: "#b8aee8", purplePale: "#f0edfb",
    purpleDark: "#5a4fa8", text: "#2d2847", textMuted: "#9b93c9", bg: "#f7f5ff", ...brand
  };

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

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${P.purpleLight}`, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: P.text };

  const NoteCard = ({ note }) => (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "18px 22px",
      boxShadow: "0 2px 10px rgba(139,127,212,0.08)",
      borderLeft: note.pinned ? `4px solid ${P.purple}` : `4px solid transparent`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontWeight: 600, color: P.text, fontSize: 15 }}>{note.title || "Untitled"}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 10 }}>
          <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", background: SOURCE_STYLES[note.source]?.bg || "#f0edfb", color: SOURCE_STYLES[note.source]?.color || P.textMuted }}>
            {SOURCE_STYLES[note.source]?.icon} {note.source}
          </span>
          <button onClick={() => togglePin(note)} title={note.pinned ? "Unpin" : "Pin"}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, opacity: note.pinned ? 1 : 0.35, padding: 0 }}>📌</button>
          <button onClick={() => openEdit(note)} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 12, fontWeight: 600 }}>Edit</button>
          <button onClick={() => handleDelete(note.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c5c", fontSize: 12, fontWeight: 600 }}>Delete</button>
        </div>
      </div>
      {note.content && <div style={{ fontSize: 13, color: "#666", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{note.content}</div>}
      {note.tags && note.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {note.tags.map(tag => (
            <span key={tag} style={{ padding: "2px 10px", borderRadius: 10, background: P.purplePale, color: P.purple, fontSize: 11, fontWeight: 500 }}>#{tag}</span>
          ))}
        </div>
      )}
      <div style={{ fontSize: 10, color: "#ccc", marginTop: 10, letterSpacing: "0.04em" }}>
        {new Date(note.created_date).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "0.04em" }}>📝 Notes</h1>
          <p style={{ margin: "5px 0 0", color: P.textMuted, fontSize: 13, letterSpacing: "0.05em" }}>CAPTURE IDEAS, MEETINGS & UPDATES</p>
        </div>
        <button onClick={openAdd} style={{ background: P.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>+ QUICK NOTE</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 22 }}>
        <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: 380, paddingLeft: 16 }} />
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pinned.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: P.purple, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>📌 Pinned</div>
              {pinned.map(n => <NoteCard key={n.id} note={n} />)}
              <div style={{ height: 10 }} />
            </>
          )}
          {unpinned.length > 0 && (
            <>
              {pinned.length > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: P.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>All Notes</div>}
              {unpinned.map(n => <NoteCard key={n.id} note={n} />)}
            </>
          )}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>No notes yet — add one here or send me a WhatsApp!</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,40,71,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: 480, boxShadow: "0 12px 40px rgba(139,127,212,0.25)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 17, color: P.text, letterSpacing: "0.06em" }}>{editing ? "EDIT" : "ADD"} NOTE</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Title</label>
              <input type="text" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Content</label>
              <textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Source</label>
              <select value={form.source || "App"} onChange={e => setForm({ ...form, source: e.target.value })} style={inputStyle}>
                {["App", "WhatsApp", "Email", "Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tags (comma separated)</label>
              <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="client, urgent, meeting" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 22, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="pinned" checked={form.pinned || false} onChange={e => setForm({ ...form, pinned: e.target.checked })}
                style={{ accentColor: P.purple, width: 16, height: 16 }} />
              <label htmlFor="pinned" style={{ fontSize: 12, color: P.textMuted, cursor: "pointer", letterSpacing: "0.04em" }}>📌 Pin this note</label>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${P.purpleLight}`, background: "#fff", cursor: "pointer", fontSize: 13, color: P.textMuted }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: P.purple, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
