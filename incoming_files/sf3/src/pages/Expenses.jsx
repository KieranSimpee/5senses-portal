import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Paperclip, Download, X, FileText, Link2 } from "lucide-react";

const EMPTY_FORM = {
  title: "", amount: "", currency: "HKD", category: "Office",
  date: "", vendor: "", notes: "", status: "Pending", payment_method: "Bank Transfer",
  receipt_url: "", document_id: ""
};

const CATEGORY_COLORS = {
  "Office": "#4f8ef7", "Salaries": "#9c27b0", "MPF": "#00897b",
  "Marketing": "#f4511e", "Professional Fees": "#1565c0",
  "Government Fees": "#6d4c41", "Travel": "#f9a825",
  "Utilities": "#558b2f", "Software": "#0288d1", "Other": "#757575",
  "Legal": "#e53935", "Design": "#8c82fc", "Hosting": "#00bcd4",
  "Company Registration": "#6d4c41"
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [showDocPicker, setShowDocPicker] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [expData, docData] = await Promise.all([
      base44.entities.Expense.list("-date"),
      base44.entities.Document.list("-created_date"),
    ]);
    setExpenses(expData);
    setDocuments(docData);
    setLoading(false);
  }

  const categories = ["All", ...new Set(expenses.map(e => e.category).filter(Boolean))];
  const filtered = expenses
    .filter(e => filter === "All" || e.category === filter)
    .filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.vendor?.toLowerCase().includes(search.toLowerCase()));

  const totalHKD = filtered.filter(e => e.currency === "HKD").reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const withReceipt = filtered.filter(e => e.receipt_url || e.document_id).length;

  function openAdd() { setForm({ ...EMPTY_FORM, date: new Date().toISOString().split("T")[0] }); setEditing(null); setShowForm(true); setDocSearch(""); }
  function openEdit(item) { setForm({ ...item, receipt_url: item.receipt_url || "", document_id: item.document_id || "" }); setEditing(item.id); setShowForm(true); setDocSearch(""); }

  async function handleFileUpload(file) {
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, receipt_url: file_url, document_id: "" }));
    setUploading(false);
  }

  function linkDocument(doc) {
    setForm(f => ({ ...f, document_id: doc.id, receipt_url: doc.file_url || "" }));
    setShowDocPicker(false);
    setDocSearch("");
  }

  function clearAttachment() {
    setForm(f => ({ ...f, receipt_url: "", document_id: "" }));
  }

  const linkedDoc = form.document_id ? documents.find(d => d.id === form.document_id) : null;

  async function handleSave() {
    const payload = { ...form, amount: parseFloat(form.amount) || 0 };
    if (!payload.receipt_url) delete payload.receipt_url;
    if (!payload.document_id) delete payload.document_id;
    if (editing) await base44.entities.Expense.update(editing, payload);
    else await base44.entities.Expense.create(payload);
    setShowForm(false);
    loadData();
  }

  async function handleDelete(id) {
    if (confirm("Delete this expense?")) { await base44.entities.Expense.delete(id); loadData(); }
  }

  const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || "#9aa3b2";

  const filteredDocs = documents.filter(d =>
    !docSearch || d.title?.toLowerCase().includes(docSearch.toLowerCase()) || d.category?.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>💰 Expenses</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>Track all company costs</p>
        </div>
        <button onClick={openAdd} style={{ background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Expense</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Spent", value: `HKD ${totalHKD.toLocaleString()}`, color: "#4f8ef7" },
          { label: "Entries", value: filtered.length, color: "#00897b" },
          { label: "With Receipt", value: `${withReceipt} / ${filtered.length}`, color: withReceipt === filtered.length ? "#00897b" : "#f4511e" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: "#7b8db0", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Search expenses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 20, border: "1px solid #dde2ec", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12,
              background: filter === cat ? "#1a1f2e" : "#fff",
              color: filter === cat ? "#fff" : "#555",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(exp => {
            const linkedDocument = exp.document_id ? documents.find(d => d.id === exp.document_id) : null;
            const hasAttachment = exp.receipt_url || linkedDocument;
            return (
              <div key={exp.id} style={{
                background: "#fff", borderRadius: 12, padding: "16px 20px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", gap: 14,
                borderLeft: `3px solid ${getCategoryColor(exp.category)}`
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: getCategoryColor(exp.category), flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "#1a1f2e", fontSize: 14 }}>{exp.title}</div>
                  <div style={{ fontSize: 12, color: "#9aa3b2", marginTop: 2 }}>{exp.vendor} · {exp.date}</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                  background: getCategoryColor(exp.category) + "20",
                  color: getCategoryColor(exp.category), whiteSpace: "nowrap"
                }}>{exp.category}</div>
                <div style={{ fontWeight: 700, color: "#1a1f2e", fontSize: 15, minWidth: 110, textAlign: "right" }}>
                  {exp.currency} {parseFloat(exp.amount || 0).toLocaleString()}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  {hasAttachment ? (
                    <a
                      href={linkedDocument ? linkedDocument.file_url : exp.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={linkedDocument ? linkedDocument.title : "Receipt"}
                      style={{ display: "flex", alignItems: "center", gap: 5, background: "#e8f5e9", color: "#2e7d32", borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                    >
                      <FileText size={13} />
                      {linkedDocument ? linkedDocument.title : "Receipt"}
                      <Download size={11} style={{ marginLeft: 2 }} />
                    </a>
                  ) : (
                    <span style={{ background: "#fafafa", color: "#ccc", border: "1px dashed #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12 }}>No receipt</span>
                  )}
                  <button onClick={() => openEdit(exp)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f8ef7", fontSize: 13 }}>Edit</button>
                  <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 13 }}>Delete</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No expenses found.</div>}
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#1a1f2e" }}>{editing ? "✏️ Edit" : "➕ Add"} Expense</h2>
            {[
              { label: "Title", key: "title", type: "text" },
              { label: "Amount", key: "amount", type: "number" },
              { label: "Date", key: "date", type: "date" },
              { label: "Vendor", key: "vendor", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            {[
              { label: "Currency", key: "currency", options: ["HKD", "USD", "CNY", "EUR", "GBP"] },
              { label: "Category", key: "category", options: ["Office", "Salaries", "MPF", "Marketing", "Professional Fees", "Government Fees", "Legal", "Design", "Software", "Hosting", "Travel", "Utilities", "Company Registration", "Other"] },
              { label: "Payment Method", key: "payment_method", options: ["Cash", "Bank Transfer", "Credit Card", "FPS", "Cheque", "Other"] },
              { label: "Status", key: "status", options: ["Pending", "Approved", "Rejected", "Reimbursed"] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>{f.label}</label>
                <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14 }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            {/* Receipt / Document attachment */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 6 }}>📄 Receipt / Invoice / Quotation</label>

              {/* Show current attachment */}
              {(form.receipt_url || linkedDoc) ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #dde2ec", borderRadius: 8, padding: "8px 12px", background: "#f8fafc" }}>
                  <FileText size={15} color={linkedDoc ? "#4f8ef7" : "#888"} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {linkedDoc ? linkedDoc.title : "Uploaded file"}
                  </span>
                  {linkedDoc && <span style={{ fontSize: 11, color: "#888", background: "#f0f0f0", borderRadius: 4, padding: "2px 6px" }}>{linkedDoc.category}</span>}
                  <a href={form.receipt_url} target="_blank" rel="noopener noreferrer" style={{ color: "#4f8ef7", flexShrink: 0 }} title="Download">
                    <Download size={14} />
                  </a>
                  <button type="button" onClick={clearAttachment} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0, flexShrink: 0 }} title="Remove">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Upload new file */}
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", border: "1px dashed #dde2ec", borderRadius: 8, padding: "9px 12px", color: "#888", fontSize: 13, background: uploading ? "#f5f5f5" : "#fff" }}>
                    <Paperclip size={15} />
                    {uploading ? "Uploading..." : "Upload new file (PDF, image)"}
                    <input type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e => handleFileUpload(e.target.files[0])} disabled={uploading} />
                  </label>
                  {/* Or link from Documents */}
                  <button
                    type="button"
                    onClick={() => setShowDocPicker(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: 8, border: "1px dashed #b0c4de", borderRadius: 8, padding: "9px 12px", color: "#4f8ef7", fontSize: 13, background: "#f0f6ff", cursor: "pointer" }}
                  >
                    <Link2 size={15} />
                    Link from Documents vault
                  </button>

                  {showDocPicker && (
                    <div style={{ border: "1px solid #dde2ec", borderRadius: 8, background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                      <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>
                        <input
                          autoFocus
                          placeholder="Search documents..."
                          value={docSearch}
                          onChange={e => setDocSearch(e.target.value)}
                          style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #dde2ec", fontSize: 13, boxSizing: "border-box", outline: "none" }}
                        />
                      </div>
                      <div style={{ maxHeight: 200, overflowY: "auto" }}>
                        {filteredDocs.filter(d => d.file_url).length === 0 ? (
                          <div style={{ padding: "16px", textAlign: "center", color: "#aaa", fontSize: 13 }}>No documents found</div>
                        ) : filteredDocs.filter(d => d.file_url).map(doc => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => linkDocument(doc)}
                            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #f8f8f8" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f5f8ff"}
                            onMouseLeave={e => e.currentTarget.style.background = "none"}
                          >
                            <FileText size={14} color="#4f8ef7" style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1f2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                              <div style={{ fontSize: 11, color: "#9aa3b2", marginTop: 1 }}>{doc.category}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4 }}>Notes</label>
              <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #dde2ec", fontSize: 14, boxSizing: "border-box" }} />
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