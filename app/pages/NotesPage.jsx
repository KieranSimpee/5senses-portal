import { useState, useEffect } from "react";
import { Note } from "@/api/entities";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
};

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Note.list().then(data => {
      const sorted = [...data].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created_date) - new Date(a.created_date);
      });
      setNotes(sorted);
      setLoading(false);
    });
  }, []);

  const filtered = notes.filter(n =>
    !search || n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase()) ||
    n.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const pinned = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);

  const NoteCard = ({ note }) => (
    <div onClick={() => setSelected(selected?.id === note.id ? null : note)} style={{
      background: BRAND.white,
      borderRadius: 12,
      border: note.pinned ? `1.5px solid ${BRAND.softLilac}` : `1px solid ${BRAND.neutralGrey}`,
      padding: "16px 18px",
      cursor: "pointer",
      boxShadow: note.pinned ? "0 2px 12px rgba(140,130,252,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.15s",
      position: "relative"
    }}>
      {note.pinned && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          fontSize: 12, color: BRAND.primaryLilac
        }}>📌</div>
      )}
      <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.bodyText, paddingRight: 24 }}>{note.title}</div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 6, lineHeight: 1.6 }}>
        {note.content?.slice(0, 120)}{note.content?.length > 120 ? "..." : ""}
      </div>
      {note.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
          {note.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 9, fontWeight: 600, color: BRAND.primaryLilac,
              background: BRAND.lavenderWash, padding: "2px 7px",
              borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5
            }}>{tag}</span>
          ))}
        </div>
      )}
      <div style={{ fontSize: 10, color: "#aaa", marginTop: 8 }}>
        {note.source && <span>{note.source} · </span>}
        {new Date(note.created_date).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric" })}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px", fontFamily: "'Montserrat', 'Inter', sans-serif", color: BRAND.bodyText }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Exo 2', 'Montserrat', sans-serif", fontWeight: 800, fontSize: 20, color: BRAND.bodyText }}>
          Notes
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
          Strategy notes · Action items · WhatsApp imports · {notes.length} total
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search notes by title, content or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "9px 16px", borderRadius: 8,
            border: `1px solid ${BRAND.neutralGrey}`,
            fontSize: 13, outline: "none", width: 340,
            fontFamily: "'Montserrat', sans-serif"
          }}
        />
      </div>

      {loading && <div style={{ textAlign: "center", color: BRAND.primaryLilac, padding: 40 }}>Loading notes...</div>}

      {/* Pinned */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            📌 Pinned Notes
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {pinned.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        </div>
      )}

      {/* All Notes */}
      {unpinned.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            All Notes
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {unpinned.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div style={{
          position: "fixed", right: 0, top: 0, bottom: 0, width: 420,
          background: BRAND.white, boxShadow: "-4px 0 24px rgba(140,130,252,0.14)",
          padding: "28px 24px", overflowY: "auto", zIndex: 100,
          borderLeft: `2px solid ${BRAND.softLilac}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 16, color: BRAND.bodyText, flex: 1, paddingRight: 12 }}>
              {selected.title}
            </div>
            <button onClick={() => setSelected(null)} style={{
              background: BRAND.lavenderWash, border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 12, color: BRAND.accentViolet,
              cursor: "pointer", fontWeight: 600, flexShrink: 0
            }}>✕ Close</button>
          </div>
          {selected.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 9, fontWeight: 600, color: BRAND.primaryLilac,
                  background: BRAND.lavenderWash, padding: "2px 8px",
                  borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5
                }}>{tag}</span>
              ))}
            </div>
          )}
          <div style={{ fontSize: 13, color: BRAND.bodyText, lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {selected.content}
          </div>
          <div style={{ marginTop: 16, fontSize: 10, color: "#aaa" }}>
            {selected.source && <div>Source: {selected.source}</div>}
            <div>Created: {new Date(selected.created_date).toLocaleDateString("en-HK", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        </div>
      )}
    </div>
  );
}
