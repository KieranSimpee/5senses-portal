import { useState, useEffect } from "react";
import { HRRecord, Expense, Document } from "@/api/entities";

const TABS = ["All Records", "Contracts", "MPF", "Medical & Insurance", "Documents"];
const RECORD_TYPES = ["Contract", "MPF", "Medical", "Insurance", "Leave Record", "Performance Review", "Onboarding", "Offboarding", "Other"];

export default function HRPage({ user }) {
  const [tab, setTab] = useState("All Records");
  const [records, setRecords] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const today = new Date();

  const editable = user.role === "Admin" || user.access_hr === "Edit";

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [r, d] = await Promise.all([HRRecord.list(), Document.list()]);
      setRecords(r.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setDocs(d.filter(doc => doc.tags?.includes("hr")));
    } catch (e) {}
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const resp = await fetch("/api/upload", { method: "POST", body: formData });
      const { url } = await resp.json();

      // Auto-detect type
      const name = file.name.toLowerCase();
      let type = "Other";
      if (name.includes("contract") || name.includes("agreement")) type = "Contract";
      else if (name.includes("mpf")) type = "MPF";
      else if (name.includes("medical") || name.includes("insurance")) type = "Medical";
      else if (name.includes("invoice") || name.includes("receipt")) type = "Other";

      await HRRecord.create({ name: file.name, type, file_url: url, file_name: file.name, status: "Active", synced_to_finance: false });
      await Document.create({ title: file.name, category: "Other", file_url: url, file_name: file.name, file_type: file.type, tags: ["hr"] });
      await loadAll();
      alert("HR document uploaded and filed!");
    } catch (err) { alert("Upload failed."); }
    setUploading(false);
    e.target.value = "";
  };

  const saveRecord = async () => {
    setSaving(true);
    try {
      let expenseId = form.finance_expense_id;

      // If has amount and not yet synced to finance, create expense
      if (form.amount && !form.synced_to_finance) {
        const exp = await Expense.create({
          title: `[HR] ${form.name}`,
          amount: form.amount,
          currency: form.currency || "HKD",
          category: form.type === "MPF" ? "MPF" : form.type === "Medical" || form.type === "Insurance" ? "Other" : "Salaries",
          date: form.start_date || new Date().toISOString().split("T")[0],
          vendor: form.person_name || "",
          status: "Pending",
          notes: `Auto-synced from HR: ${form.type}`,
          receipt_url: form.file_url || ""
        });
        expenseId = exp.id;
      }

      const payload = { ...form, synced_to_finance: !!form.amount, finance_expense_id: expenseId };
      if (editItem) await HRRecord.update(editItem.id, payload);
      else await HRRecord.create(payload);
      await loadAll();
      setShowForm(false);
    } catch (e) {}
    setSaving(false);
  };

  const typeFilter = {
    "All Records": null,
    "Contracts": "Contract",
    "MPF": "MPF",
    "Medical & Insurance": null, // both medical and insurance
  };

  const filteredRecords = records.filter(r => {
    if (tab === "All Records") return true;
    if (tab === "Medical & Insurance") return r.type === "Medical" || r.type === "Insurance";
    if (tab === "Documents") return false;
    return r.type === typeFilter[tab];
  });

  const statusColor = { Active: "#d1fae5", Expired: "#fef2f2", Pending: "#fef3c7", Terminated: "#f1f5f9" };
  const statusText = { Active: "#065f46", Expired: "#dc2626", Pending: "#92400e", Terminated: "#475569" };

  const tabStyle = (t) => ({
    padding: "9px 16px", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600,
    background: tab === t ? "#7c3aed" : "#f3f0ff", color: tab === t ? "#fff" : "#6d28d9", transition: "all 0.15s"
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0533", margin: 0 }}>👥 HR</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Contracts, MPF, medical, team records — invoices auto-sync to Finance</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {uploading ? "Uploading..." : "📎 Upload Document"}
            <input type="file" style={{ display: "none" }} onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png,.docx" />
          </label>
          {editable && (
            <button onClick={() => { setEditItem(null); setForm({ currency: "HKD", status: "Active", section: "SIMPLEX-ITY" }); setShowForm(true); }}
              style={{ background: "#fff", border: "1.5px solid #7c3aed", color: "#7c3aed", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              + Add Record
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Records", val: records.length, color: "#f3e8ff", text: "#6d28d9" },
          { label: "Active", val: records.filter(r => r.status === "Active").length, color: "#d1fae5", text: "#065f46" },
          { label: "Expiring Soon", val: records.filter(r => { if (!r.expiry_date) return false; const d = new Date(r.expiry_date); return (d - today) / 86400000 <= 30 && (d - today) / 86400000 >= 0; }).length, color: "#fef3c7", text: "#92400e" },
          { label: "Synced Finance", val: records.filter(r => r.synced_to_finance).length, color: "#dbeafe", text: "#1e40af" },
        ].map(c => (
          <div key={c.label} style={{ background: c.color, borderRadius: 12, padding: "14px", border: `1px solid ${c.text}22` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: c.text, textTransform: "uppercase" }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.text, marginTop: 4 }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>{t}</button>)}
      </div>

      {loading ? <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>Loading...</div> : (
        <>
          {tab !== "Documents" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {filteredRecords.map(rec => {
                const expiring = rec.expiry_date && (new Date(rec.expiry_date) - today) / 86400000 <= 30 && (new Date(rec.expiry_date) - today) / 86400000 >= 0;
                return (
                  <div key={rec.id} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${expiring ? "#fcd34d" : "#ede9fe"}`, padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0533" }}>{rec.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{rec.person_name}</div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span style={{ background: statusColor[rec.status], color: statusText[rec.status], fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5 }}>{rec.status}</span>
                        {editable && <button onClick={() => { setEditItem(rec); setForm({ ...rec }); setShowForm(true); }} style={{ background: "#f3f0ff", border: "none", borderRadius: 5, padding: "3px 7px", fontSize: 10, color: "#7c3aed", cursor: "pointer" }}>Edit</button>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ background: "#ede9fe", color: "#6d28d9", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6 }}>{rec.type}</span>
                      <span style={{ background: "#f0fdf4", color: "#065f46", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6 }}>{rec.section}</span>
                      {rec.synced_to_finance && <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6 }}>💰 Synced</span>}
                    </div>
                    {rec.amount && <div style={{ fontSize: 12, fontWeight: 700, color: "#1a0533", marginBottom: 6 }}>{rec.currency} {rec.amount?.toLocaleString()}</div>}
                    {rec.start_date && <div style={{ fontSize: 11, color: "#64748b" }}>Start: {rec.start_date}</div>}
                    {rec.expiry_date && (
                      <div style={{ fontSize: 11, color: expiring ? "#dc2626" : "#64748b", fontWeight: expiring ? 700 : 400 }}>
                        Expiry: {rec.expiry_date} {expiring && "⚠️ Expiring soon"}
                      </div>
                    )}
                    {rec.file_url && (
                      <a href={rec.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#7c3aed", display: "block", marginTop: 8 }}>📄 View Document</a>
                    )}
                    {rec.notes && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 8 }}>{rec.notes}</div>}
                  </div>
                );
              })}
              {filteredRecords.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13, padding: 20 }}>No records yet for this category.</div>}
            </div>
          )}

          {tab === "Documents" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {docs.map(doc => (
                <a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #ede9fe", padding: "14px", cursor: "pointer" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a0533" }}>{doc.title}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{doc.file_type}</div>
                  </div>
                </a>
              ))}
              {docs.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13, padding: 20 }}>No HR documents yet. Upload one above.</div>}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: "#1a0533", marginBottom: 20 }}>{editItem ? "Edit HR Record" : "Add HR Record"}</h2>
            {[["Record Name", "name", "text"], ["Person / Employee Name", "person_name", "text"], ["Start Date", "start_date", "date"], ["Expiry Date", "expiry_date", "date"], ["Amount", "amount", "number"], ["Notes", "notes", "text"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>
                <input type={type} value={form[key] || ""} onChange={e => setForm(p => ({ ...p, [key]: type === "number" ? parseFloat(e.target.value) : e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            ))}
            {[["Type", "type", RECORD_TYPES], ["Currency", "currency", ["HKD", "USD", "CNY", "EUR"]], ["Status", "status", ["Active", "Expired", "Pending", "Terminated"]], ["Section", "section", ["5SENSESBEAUTY", "SIMPLEX-ITY"]]].map(([label, key, opts]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>
                <select value={form[key] || ""} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13 }}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#92400e", marginBottom: 16 }}>
              💡 If you add an amount, it will automatically sync to Finance as an expense record.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveRecord} disabled={saving} style={{ flex: 1, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: 11, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setShowForm(false)} style={{ background: "#f3f0ff", color: "#7c3aed", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
