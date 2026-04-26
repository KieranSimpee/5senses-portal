import { useState, useEffect, useRef } from "react";
import { Document } from "@/api/entities";
import { uploadFile } from "@/api/storage";

const BRAND_COLOR = "#7C3AED";

const CATEGORY_COLORS = {
  "Brand Deck":       { bg: "#fef3c7", color: "#d97706", icon: "🏢" },
  "Influencer Deck":  { bg: "#fce7f3", color: "#be185d", icon: "⭐" },
  "Core Values":      { bg: "#ede9fe", color: "#7C3AED", icon: "💎" },
  "Contract":         { bg: "#fee2e2", color: "#dc2626", icon: "📝" },
  "Campaign Brief":   { bg: "#d1fae5", color: "#065f46", icon: "🚀" },
  "Report":           { bg: "#e0f2fe", color: "#0277bd", icon: "📊" },
  "Design Asset":     { bg: "#f3e8ff", color: "#9333ea", icon: "🎨" },
  "Legal":            { bg: "#fee2e2", color: "#991b1b", icon: "⚖️" },
  "Finance":          { bg: "#d1fae5", color: "#065f46", icon: "💰" },
  "Other":            { bg: "#f1f5f9", color: "#475569", icon: "📄" },
};

const EMPTY = { title: "", category: "Other", description: "", related_to: "", version: "v1.0", tags: [], is_pinned: false };

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();
  const editFileRef = useRef();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await Document.list("-created_date");
    setDocs(data);
    setLoading(false);
  }

  async function handleFileUpload(file, meta = {}) {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadFile(file);
      const payload = {
        title: meta.title || file.name.replace(/\.[^/.]+$/, ""),
        category: meta.category || "Other",
        file_url,
        file_name: file.name,
        file_type: file.type,
        description: meta.description || "",
        related_to: meta.related_to || "",
        version: meta.version || "v1.0",
        tags: meta.tags || [],
        is_pinned: false,
      };
      await Document.create(payload);
      load();
    } catch (e) {
      alert("Upload failed. Try again.");
    }
    setUploading(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) await handleFileUpload(file);
  }

  async function save() {
    if (editing) await Document.update(editing, form);
    else await Document.create(form);
    setShowForm(false); setEditing(null); load();
  }

  async function remove(id) {
    if (confirm("Delete this document?")) { await Document.delete(id); load(); }
  }

  async function togglePin(doc) {
    await Document.update(doc.id, { is_pinned: !doc.is_pinned });
    load();
  }

  const categories = ["All", ...Object.keys(CATEGORY_COLORS)];
  const pinned = docs.filter(d => d.is_pinned);
  let filtered = docs.filter(d =>
    (filterCat === "All" || d.category === filterCat) &&
    (!search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase()))
  );

  function formatSize(url) { return url ? "Uploaded" : "—"; }
  function getFileIcon(type) {
    if (!type) return "📄";
    if (type.includes("pdf")) return "📕";
    if (type.includes("word") || type.includes("document")) return "📘";
    if (type.includes("image")) return "🖼️";
    if (type.includes("sheet") || type.includes("excel")) return "📗";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📙";
    return "📄";
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a0533" }}>📁 Documents Vault</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Upload, store & organise all SIMPLEX-ITY documents</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => fileInputRef.current.click()} style={{ background: "#ede9fe", color: BRAND_COLOR, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {uploading ? "Uploading..." : "⬆️ Upload File"}
          </button>
          <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} style={{ background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Link / Note</button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
        onChange={e => Array.from(e.target.files).forEach(f => handleFileUpload(f))} />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ border: `2px dashed ${dragOver ? BRAND_COLOR : "#d8d0f0"}`, borderRadius: 14, padding: "24px", textAlign: "center", marginBottom: 24, background: dragOver ? "#f5f0ff" : "#fdfcff", transition: "all 0.2s", cursor: "pointer" }}
        onClick={() => fileInputRef.current.click()}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
        <div style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600 }}>Drop files here or click to upload</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>PDF, Word, Excel, Images — auto-saved to vault</div>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>📌 Pinned</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {pinned.map(doc => (
              <div key={doc.id} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", boxShadow: "0 2px 8px rgba(124,58,237,0.1)", border: "1.5px solid #c4b5fd", display: "flex", gap: 10, alignItems: "center", maxWidth: 280 }}>
                <span style={{ fontSize: 22 }}>{getFileIcon(doc.file_type)}</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a0533", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{doc.category}</div>
                </div>
                {doc.file_url && <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ color: BRAND_COLOR, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>Open</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "Brand Deck", "Influencer Deck", "Core Values", "Contract", "Report", "Other"].map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: filterCat === c ? BRAND_COLOR : "#fff", color: filterCat === c ? "#fff" : "#64748b", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: filterCat === c ? 600 : 400 }}>{c}</button>
          ))}
        </div>
        <input type="text" placeholder="🔍 Search documents..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 10, border: "1px solid #e2d9f3", fontSize: 13, outline: "none" }} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 20 }}>
        {["Brand Deck","Influencer Deck","Core Values","Contract","Report"].map(cat => (
          <div key={cat} style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", boxShadow: "0 1px 5px rgba(0,0,0,0.05)", borderLeft: `3px solid ${CATEGORY_COLORS[cat].color}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: CATEGORY_COLORS[cat].color }}>{docs.filter(d => d.category === cat).length}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{cat}</div>
          </div>
        ))}
      </div>

      {/* Document Grid */}
      {loading ? <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 2px 10px rgba(124,58,237,0.07)", border: "1.5px solid #f3f0ff", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28 }}>{getFileIcon(doc.file_type)}</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0533", marginBottom: 2 }}>{doc.title}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 7, fontSize: 10, fontWeight: 600, background: CATEGORY_COLORS[doc.category]?.bg, color: CATEGORY_COLORS[doc.category]?.color }}>{doc.category}</span>
                </div>
                <button onClick={() => togglePin(doc)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: doc.is_pinned ? "#7C3AED" : "#d1d5db" }} title="Pin">📌</button>
              </div>

              {doc.description && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{doc.description.slice(0, 80)}{doc.description.length > 80 ? "..." : ""}</div>}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#94a3b8" }}>
                <span>{doc.file_name || "No file attached"}</span>
                {doc.version && <span style={{ background: "#f1f5f9", borderRadius: 6, padding: "1px 6px", color: "#64748b" }}>{doc.version}</span>}
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ background: "#ede9fe", border: "none", color: BRAND_COLOR, fontSize: 12, padding: "5px 12px", borderRadius: 7, fontWeight: 600, textDecoration: "none" }}>Open ↗</a>
                )}
                <button onClick={() => { setForm({ ...doc }); setEditing(doc.id); setShowForm(true); }} style={{ background: "#f1f5f9", border: "none", cursor: "pointer", color: "#475569", fontSize: 12, padding: "5px 12px", borderRadius: 7 }}>Edit</button>
                <button onClick={() => remove(doc.id)} style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, padding: "5px 12px", borderRadius: 7 }}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#94a3b8" }}>
              No documents yet. Drag & drop files above or click Upload.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 500, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(124,58,237,0.25)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#1a0533" }}>{editing ? "Edit" : "Add"} Document</h2>
            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Description", key: "description", type: "text" },
              { label: "Related To (Brand / Campaign name)", key: "related_to", type: "text" },
              { label: "Version", key: "version", type: "text" },
              { label: "File URL (if linking externally)", key: "file_url", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Category</label>
              <select value={form.category || "Other"} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2d9f3", fontSize: 14 }}>
                {Object.keys(CATEGORY_COLORS).map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.is_pinned || false} onChange={e => setForm({ ...form, is_pinned: e.target.checked })} />
              <label style={{ fontSize: 13, cursor: "pointer" }}>📌 Pin this document</label>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 9, border: "1px solid #e2d9f3", background: "#fff", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 9, border: "none", background: BRAND_COLOR, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
