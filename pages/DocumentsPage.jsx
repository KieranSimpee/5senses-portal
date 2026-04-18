import { useState, useEffect, useRef } from "react";
import { Document } from "@/api/entities";
import { uploadFile } from "@/api/storage";

const CATEGORIES = [
  "Business Registration", "Bank Documents", "Licences",
  "Audit & Tax", "Contracts", "Company Secretary", "MPF", "Insurance", "Other"
];

const CAT_ICONS = {
  "Business Registration": "🏢",
  "Bank Documents": "🏦",
  "Licences": "📜",
  "Audit & Tax": "🧾",
  "Contracts": "📋",
  "Company Secretary": "👔",
  "MPF": "💼",
  "Insurance": "🛡️",
  "Other": "📁",
};

const EMPTY_FORM = {
  title: "", category: "Business Registration", description: "",
  expiry_date: "", tags: [], is_confidential: true, file_url: "", file_name: ""
};

export default function DocumentsPage({ brand = {} }) {
  const P = {
    purple: "#8b7fd4", purpleLight: "#b8aee8", purplePale: "#f0edfb",
    purpleDark: "#5a4fa8", text: "#2d2847", textMuted: "#9b93c9", bg: "#f7f5ff", ...brand
  };

  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    setLoading(true);
    const data = await Document.list("-created_date");
    setDocs(data);
    setLoading(false);
  }

  const categories = ["All", ...CATEGORIES];
  const filtered = filter === "All" ? docs : docs.filter(d => d.category === filter);

  function openAdd() { setForm(EMPTY_FORM); setTagsInput(""); setEditing(null); setShowForm(true); }
  function openEdit(doc) { setForm({ ...doc }); setTagsInput((doc.tags || []).join(", ")); setEditing(doc.id); setShowForm(true); }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadFile(file);
      setForm(f => ({ ...f, file_url, file_name: file.name }));
    } catch (err) {
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  }

  async function handleSave() {
    const data = { ...form, tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean) };
    if (editing) await Document.update(editing, data);
    else await Document.create(data);
    setShowForm(false);
    loadDocs();
  }

  async function handleDelete(id) {
    if (confirm("Delete this document?")) { await Document.delete(id); loadDocs(); }
  }

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 60;
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1.5px solid ${P.purpleLight}`, fontSize: 14,
    boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: P.text
  };

  // Group by category for display
  const grouped = {};
  filtered.forEach(d => {
    const cat = d.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(d);
  });

  return (
    <div style={{ padding: 36 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "0.04em" }}>🔒 Documents</h1>
          <p style={{ margin: "5px 0 0", color: P.textMuted, fontSize: 13, letterSpacing: "0.05em" }}>SECURE COMPANY DOCUMENT VAULT</p>
        </div>
        <button onClick={openAdd} style={{ background: P.purple, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>+ UPLOAD DOCUMENT</button>
      </div>

      {/* Security Banner */}
      <div style={{ background: "linear-gradient(135deg, #2d2847, #3d3660)", borderRadius: 14, padding: "16px 22px", marginBottom: 26, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28 }}>🔐</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em" }}>CONFIDENTIAL VAULT</div>
          <div style={{ color: P.purpleLight, fontSize: 12, marginTop: 3 }}>All documents are encrypted. Only you (Admin) can access this section.</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ color: P.purpleLight, fontSize: 11 }}>{docs.filter(d => d.is_confidential).length} confidential</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{docs.length} total</div>
        </div>
      </div>

      {/* Expiry Alerts */}
      {docs.filter(d => isExpiringSoon(d.expiry_date) || isExpired(d.expiry_date)).length > 0 && (
        <div style={{ marginBottom: 22 }}>
          {docs.filter(d => isExpired(d.expiry_date)).map(d => (
            <div key={d.id} style={{ background: "#fde8e8", borderRadius: 10, padding: "10px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span>⚠️</span>
              <span style={{ fontSize: 13, color: "#c0392b", fontWeight: 600 }}>{d.title} — <strong>EXPIRED</strong> on {d.expiry_date}</span>
            </div>
          ))}
          {docs.filter(d => isExpiringSoon(d.expiry_date)).map(d => (
            <div key={d.id} style={{ background: "#fff4e0", borderRadius: 10, padding: "10px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span>⏰</span>
              <span style={{ fontSize: 13, color: "#d4820a", fontWeight: 600 }}>{d.title} — expires {d.expiry_date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === cat ? P.purple : "#e0dcf5"}`,
            cursor: "pointer", fontSize: 12, background: filter === cat ? P.purple : "#fff",
            color: filter === cat ? "#fff" : P.textMuted, fontWeight: filter === cat ? 600 : 400,
            letterSpacing: "0.04em", transition: "all 0.2s"
          }}>
            {CAT_ICONS[cat] || "📁"} {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: P.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ fontSize: 14 }}>No documents yet — upload your first one!</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>BR Certificate, bank letters, licences, audit reports…</div>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catDocs]) => (
          <div key={cat} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: P.purple, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {CAT_ICONS[cat]} {cat} <span style={{ color: P.textMuted, fontWeight: 400 }}>({catDocs.length})</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {catDocs.map(doc => (
                <div key={doc.id} style={{
                  background: "#fff", borderRadius: 14, padding: "18px 20px",
                  boxShadow: "0 2px 10px rgba(139,127,212,0.1)",
                  borderTop: `3px solid ${isExpired(doc.expiry_date) ? "#e05c5c" : isExpiringSoon(doc.expiry_date) ? "#d4820a" : P.purple}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: P.text, fontSize: 14, flex: 1, paddingRight: 8 }}>{doc.title}</div>
                    {doc.is_confidential && <span style={{ fontSize: 10, background: P.purplePale, color: P.purple, padding: "2px 8px", borderRadius: 8, fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>🔒 CONFIDENTIAL</span>}
                  </div>
                  {doc.description && <div style={{ fontSize: 12, color: "#777", marginBottom: 10, lineHeight: 1.5 }}>{doc.description}</div>}
                  {doc.expiry_date && (
                    <div style={{ fontSize: 11, marginBottom: 8, fontWeight: 600, color: isExpired(doc.expiry_date) ? "#c0392b" : isExpiringSoon(doc.expiry_date) ? "#d4820a" : P.textMuted }}>
                      {isExpired(doc.expiry_date) ? "⚠️ EXPIRED: " : isExpiringSoon(doc.expiry_date) ? "⏰ EXPIRES: " : "📅 Expires: "}{doc.expiry_date}
                    </div>
                  )}
                  {doc.tags && doc.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                      {doc.tags.map(tag => <span key={tag} style={{ padding: "2px 8px", borderRadius: 8, background: P.purplePale, color: P.purple, fontSize: 10, fontWeight: 500 }}>#{tag}</span>)}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${P.purplePale}` }}>
                    {doc.file_url ? (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: P.purple, fontWeight: 600, textDecoration: "none" }}>
                        📎 {doc.file_name || "View File"}
                      </a>
                    ) : (
                      <span style={{ fontSize: 11, color: P.textMuted }}>No file attached</span>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(doc)} style={{ background: "none", border: "none", cursor: "pointer", color: P.purple, fontSize: 11, fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(doc.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c5c", fontSize: 11, fontWeight: 600 }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Upload Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,40,71,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: 500, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(139,127,212,0.3)" }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 17, color: P.text, letterSpacing: "0.06em" }}>{editing ? "EDIT" : "UPLOAD"} DOCUMENT</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Document Title</label>
              <input type="text" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="e.g. BR Certificate 2026" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Category</label>
              <select value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Description</label>
              <textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Brief description of this document" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Expiry Date (if applicable)</label>
              <input type="date" value={form.expiry_date || ""} onChange={e => setForm({ ...form, expiry_date: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tags (comma separated)</label>
              <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} style={inputStyle} placeholder="original, scanned, 2026" />
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: P.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Upload File</label>
              <div onClick={() => fileRef.current?.click()} style={{
                border: `2px dashed ${P.purpleLight}`, borderRadius: 10, padding: "18px", textAlign: "center",
                cursor: "pointer", background: P.purplePale, transition: "all 0.2s"
              }}>
                {uploading ? (
                  <div style={{ color: P.purple, fontSize: 13 }}>Uploading...</div>
                ) : form.file_name ? (
                  <div style={{ color: P.purpleDark, fontSize: 13, fontWeight: 600 }}>✅ {form.file_name}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
                    <div style={{ fontSize: 13, color: P.purple, fontWeight: 600 }}>Click to upload file</div>
                    <div style={{ fontSize: 11, color: P.textMuted, marginTop: 3 }}>PDF, JPG, PNG, DOCX — max 10MB</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" style={{ display: "none" }} onChange={handleFileUpload} />
            </div>

            <div style={{ marginBottom: 22, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="confidential" checked={form.is_confidential !== false} onChange={e => setForm({ ...form, is_confidential: e.target.checked })}
                style={{ accentColor: P.purple, width: 16, height: 16 }} />
              <label htmlFor="confidential" style={{ fontSize: 12, color: P.textMuted, cursor: "pointer", letterSpacing: "0.04em" }}>🔒 Mark as Confidential</label>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${P.purpleLight}`, background: "#fff", cursor: "pointer", fontSize: 13, color: P.textMuted }}>Cancel</button>
              <button onClick={handleSave} disabled={uploading} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: P.purple, color: "#fff", cursor: uploading ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", opacity: uploading ? 0.7 : 1 }}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
