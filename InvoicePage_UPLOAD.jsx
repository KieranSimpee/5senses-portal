import { useState, useEffect } from "react";
import { Invoice } from "@/api/entities";


const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
};

const STATUS_COLORS = {
  Draft: { bg: "#f1f5f9", text: "#64748b" },
  Sent: { bg: "#e0f2fe", text: "#0369a1" },
  Paid: { bg: "#dcfce7", text: "#16a34a" },
  Overdue: { bg: "#fef2f2", text: "#ef4444" },
  Cancelled: { bg: "#f1f5f9", text: "#94a3b8" },
};

const EMPTY_FORM = {
  invoice_no: "", client_name: "", client_email: "", client_address: "",
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  currency: "HKD",
  items: [{ description: "", qty: 1, unit_price: 0 }],
  tax: 0, notes: "", payment_method: "Bank Transfer / Airwallex",
  status: "Draft", airwallex_synced: false,
};

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [nextNo, setNextNo] = useState("SXTY-INV-001");

  const load = () => {
    setLoading(true);
    Invoice.list().then(data => {
      const sorted = [...data].sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date));
      setInvoices(sorted);
      setLoading(false);
      // Auto-increment invoice number
      const nums = sorted.map(i => {
        const m = i.invoice_no?.match(/(\d+)$/);
        return m ? parseInt(m[1]) : 0;
      });
      const max = nums.length ? Math.max(...nums) : 0;
      setNextNo(`SXTY-INV-${String(max + 1).padStart(3, "0")}`);
    });
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = invoices.filter(i => i.status === "Paid")
    .reduce((s, i) => s + (i.total || 0), 0);
  const totalPending = invoices.filter(i => ["Draft", "Sent"].includes(i.status))
    .reduce((s, i) => s + (i.total || 0), 0);

  const calcSubtotal = (items) =>
    (items || []).reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.unit_price) || 0), 0);

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, invoice_no: nextNo });
    setShowModal(true);
  };

  const openEdit = (inv) => {
    setEditItem(inv);
    // Parse items back from string array
    const parsedItems = (inv.items || []).map(item => {
      const parts = item.split("|").map(p => p.trim());
      const name = parts[0] || "";
      const qtyMatch = parts[1]?.match(/qty[:\s]*([\d.]+)/i);
      const priceMatch = parts[2]?.match(/([\d,.]+)/);
      return {
        description: name,
        qty: qtyMatch ? parseFloat(qtyMatch[1]) : 1,
        unit_price: priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : 0,
      };
    });
    setForm({
      invoice_no: inv.invoice_no || "",
      client_name: inv.client_name || "",
      client_email: inv.client_email || "",
      client_address: inv.client_address || "",
      issue_date: inv.issue_date || new Date().toISOString().slice(0, 10),
      due_date: inv.due_date || "",
      currency: inv.currency || "HKD",
      items: parsedItems.length ? parsedItems : [{ description: "", qty: 1, unit_price: 0 }],
      tax: inv.tax || 0,
      notes: inv.notes || "",
      payment_method: inv.payment_method || "Bank Transfer / Airwallex",
      status: inv.status || "Draft",
      airwallex_synced: inv.airwallex_synced || false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.client_name.trim()) return;
    setSaving(true);
    const subtotal = calcSubtotal(form.items);
    const tax = parseFloat(form.tax) || 0;
    const total = subtotal + tax;
    const itemStrings = form.items.map(it =>
      `${it.description} | qty:${it.qty} | ${form.currency} ${it.unit_price}`
    );
    const payload = {
      ...form,
      items: itemStrings,
      subtotal,
      total,
      related_project: form.related_project || null,
    };
    try {
      if (editItem) {
        await Invoice.update(editItem.id, payload);
      } else {
        await Invoice.create(payload);
      }
      setShowModal(false);
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await Invoice.delete(id);
    setDeleteConfirm(null);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const handleSync = async (inv) => {
    setSyncing(inv.id);
    setSyncResult(null);
    try {
      const res = await fetch("/api/functions/syncInvoiceToAirwallex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: inv.id, invoice: inv }),
      });
      const data = await res.json();
      setSyncResult(data);
      if (data.success) {
        await Invoice.update(inv.id, { airwallex_synced: true });
        load();
      }
    } catch (e) {
      setSyncResult({ success: false, error: e.message });
    }
    setSyncing(null);
  };

  const inputStyle = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: `1px solid ${BRAND.neutralGrey}`,
    fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "'Montserrat', sans-serif", color: BRAND.bodyText,
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4,
    display: "block", textTransform: "uppercase", letterSpacing: 0.5,
  };

  return (
    <div style={{ padding: "28px", fontFamily: "'Montserrat', sans-serif", color: BRAND.bodyText, maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 20 }}>🧾 Invoices</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>SIMPLEX-ITY · Auto-sequenced · Airwallex sync</div>
        </div>
        <button onClick={openAdd} style={{
          background: BRAND.accentViolet, color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Exo 2', sans-serif"
        }}>+ New Invoice</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Invoices", value: invoices.length, color: BRAND.primaryLilac },
          { label: "Revenue Collected", value: `HKD ${totalRevenue.toLocaleString()}`, color: "#16a34a" },
          { label: "Pending / Draft", value: `HKD ${totalPending.toLocaleString()}`, color: "#f59e0b" },
          { label: "Synced to Airwallex", value: `${invoices.filter(i => i.airwallex_synced).length} / ${invoices.length}`, color: BRAND.accentViolet },
        ].map((s, i) => (
          <div key={i} style={{
            background: BRAND.white, borderRadius: 12, padding: "16px 18px",
            border: `1px solid ${BRAND.neutralGrey}`, borderTop: `3px solid ${s.color}`,
            boxShadow: "0 2px 8px rgba(140,130,252,0.07)"
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Invoice List */}
      <div style={{ background: BRAND.white, borderRadius: 14, border: `1px solid ${BRAND.neutralGrey}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(140,130,252,0.07)" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr 1fr",
          padding: "11px 20px", background: BRAND.lavenderWash,
          borderBottom: `1px solid ${BRAND.neutralGrey}`,
          fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac,
          textTransform: "uppercase", letterSpacing: 1
        }}>
          <div>Invoice No.</div><div>Client</div><div>Amount</div>
          <div>Status</div><div>Due Date</div><div>Airwallex</div>
        </div>

        {loading && <div style={{ padding: 30, textAlign: "center", color: BRAND.primaryLilac }}>Loading...</div>}
        {!loading && invoices.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#888", fontSize: 13 }}>
            No invoices yet. Click "+ New Invoice" to create your first one.
          </div>
        )}

        {invoices.map((inv, idx) => {
          const sc = STATUS_COLORS[inv.status] || STATUS_COLORS.Draft;
          return (
            <div key={inv.id}
              onClick={() => setSelected(selected?.id === inv.id ? null : inv)}
              style={{
                display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr 1fr",
                padding: "13px 20px", cursor: "pointer",
                borderBottom: idx < invoices.length - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                background: selected?.id === inv.id ? BRAND.lavenderWash : "transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.background = BRAND.lavenderWash}
              onMouseLeave={e => e.currentTarget.style.background = selected?.id === inv.id ? BRAND.lavenderWash : "transparent"}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.accentViolet, alignSelf: "center" }}>{inv.invoice_no}</div>
              <div style={{ alignSelf: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.bodyText }}>{inv.client_name}</div>
                {inv.client_email && <div style={{ fontSize: 10, color: "#888" }}>{inv.client_email}</div>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.bodyText, alignSelf: "center" }}>
                {inv.currency} {(inv.total || 0).toLocaleString()}
              </div>
              <div style={{ alignSelf: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, background: sc.bg, color: sc.text, padding: "3px 9px", borderRadius: 8 }}>
                  {inv.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#666", alignSelf: "center" }}>
                {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-HK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
              </div>
              <div style={{ alignSelf: "center" }}>
                {inv.airwallex_synced ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "3px 8px", borderRadius: 8 }}>✓ Synced</span>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); handleSync(inv); }}
                    disabled={syncing === inv.id}
                    style={{
                      background: syncing === inv.id ? BRAND.softLilac : BRAND.lavenderWash,
                      border: `1px solid ${BRAND.softLilac}`, borderRadius: 8,
                      padding: "3px 10px", fontSize: 10, fontWeight: 700,
                      color: BRAND.accentViolet, cursor: syncing === inv.id ? "wait" : "pointer"
                    }}
                  >{syncing === inv.id ? "Syncing..." : "→ Sync"}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync Result Banner */}
      {syncResult && (
        <div style={{
          marginTop: 14, borderRadius: 10, padding: "12px 18px",
          background: syncResult.success ? "#dcfce7" : "#fef2f2",
          border: `1px solid ${syncResult.success ? "#86efac" : "#fca5a5"}`,
          fontSize: 12, color: syncResult.success ? "#166534" : "#991b1b",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span>{syncResult.success
            ? `✅ Synced! Airwallex Invoice ID: ${syncResult.airwallex_invoice_id}`
            : `❌ ${syncResult.error} — ${syncResult.hint || ""}`
          }</span>
          <button onClick={() => setSyncResult(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#666" }}>✕</button>
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div style={{
          marginTop: 16, background: BRAND.white, borderRadius: 14,
          border: `1.5px solid ${BRAND.softLilac}`, padding: "20px 24px",
          boxShadow: "0 2px 16px rgba(140,130,252,0.10)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 15 }}>{selected.invoice_no} — {selected.client_name}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>Issued: {selected.issue_date} · Due: {selected.due_date}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {selected.pdf_url && (
                <a href={selected.pdf_url} target="_blank" rel="noreferrer" style={{
                  background: BRAND.lavenderWash, border: `1px solid ${BRAND.softLilac}`,
                  borderRadius: 8, padding: "6px 14px", fontSize: 12,
                  color: BRAND.accentViolet, textDecoration: "none", fontWeight: 600
                }}>📄 PDF</a>
              )}
              <button onClick={() => openEdit(selected)} style={{
                background: BRAND.lavenderWash, border: "none", borderRadius: 8,
                padding: "6px 14px", fontSize: 12, color: BRAND.accentViolet, cursor: "pointer", fontWeight: 600
              }}>Edit</button>
              <button onClick={() => setDeleteConfirm(selected.id)} style={{
                background: "#fef2f2", border: "none", borderRadius: 8,
                padding: "6px 14px", fontSize: 12, color: "#ef4444", cursor: "pointer", fontWeight: 600
              }}>Delete</button>
              <button onClick={() => setSelected(null)} style={{
                background: BRAND.neutralGrey, border: "none", borderRadius: 8,
                padding: "6px 14px", fontSize: 12, color: "#555", cursor: "pointer"
              }}>Close</button>
            </div>
          </div>
          {/* Line items */}
          <div style={{ background: BRAND.lavenderWash, borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Line Items</div>
            {(selected.items || []).map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: BRAND.bodyText }}>
                <span>{item}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${BRAND.softLilac}`, marginTop: 10, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 14, color: BRAND.accentViolet }}>{selected.currency} {(selected.total || 0).toLocaleString()}</span>
            </div>
          </div>
          {selected.notes && (
            <div style={{ fontSize: 12, color: "#666", background: "#f8f8f8", borderRadius: 8, padding: "8px 12px" }}>{selected.notes}</div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: BRAND.white, borderRadius: 16, padding: 28, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 20 }}>
              {editItem ? "✏️ Edit Invoice" : `🧾 New Invoice — ${form.invoice_no}`}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={labelStyle}>Invoice No.</label>
                <input value={form.invoice_no} onChange={e => setForm(f => ({ ...f, invoice_no: e.target.value }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                  {["Draft", "Sent", "Paid", "Overdue", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Client Name *</label>
                <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} placeholder="Company name" style={inputStyle} /></div>
              <div><label style={labelStyle}>Client Email</label>
                <input value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))} placeholder="client@email.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Currency</label>
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} style={inputStyle}>
                  {["HKD", "USD", "EUR", "GBP", "CNY"].map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Client Address</label>
                <input value={form.client_address} onChange={e => setForm(f => ({ ...f, client_address: e.target.value }))} placeholder="Address" style={inputStyle} /></div>
              <div><label style={labelStyle}>Issue Date</label>
                <input type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} style={inputStyle} /></div>

              {/* Line Items */}
              <div style={{ gridColumn: "1 / -1", borderTop: `1px solid ${BRAND.neutralGrey}`, paddingTop: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Line Items</div>
                {form.items.map((item, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr auto", gap: 8, marginBottom: 8 }}>
                    <input value={item.description} onChange={e => setForm(f => { const it = [...f.items]; it[idx] = { ...it[idx], description: e.target.value }; return { ...f, items: it }; })}
                      placeholder="Description" style={inputStyle} />
                    <input type="number" value={item.qty} onChange={e => setForm(f => { const it = [...f.items]; it[idx] = { ...it[idx], qty: e.target.value }; return { ...f, items: it }; })}
                      placeholder="Qty" style={inputStyle} />
                    <input type="number" value={item.unit_price} onChange={e => setForm(f => { const it = [...f.items]; it[idx] = { ...it[idx], unit_price: e.target.value }; return { ...f, items: it }; })}
                      placeholder="Unit price" style={inputStyle} />
                    <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))}
                      style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "0 10px", color: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>✕</button>
                  </div>
                ))}
                <button onClick={() => setForm(f => ({ ...f, items: [...f.items, { description: "", qty: 1, unit_price: 0 }] }))}
                  style={{ background: BRAND.lavenderWash, border: `1px dashed ${BRAND.softLilac}`, borderRadius: 8, padding: "7px 16px", fontSize: 12, color: BRAND.accentViolet, cursor: "pointer", fontWeight: 600 }}>
                  + Add Item
                </button>
                <div style={{ marginTop: 12, textAlign: "right", fontSize: 14, fontWeight: 800, color: BRAND.accentViolet }}>
                  Subtotal: {form.currency} {calcSubtotal(form.items).toLocaleString()}
                </div>
              </div>

              <div><label style={labelStyle}>Tax / Other (flat)</label>
                <input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: parseFloat(e.target.value) || 0 }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Payment Method</label>
                <input value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))} style={inputStyle} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: BRAND.accentViolet }}>
                Total: {form.currency} {(calcSubtotal(form.items) + (parseFloat(form.tax) || 0)).toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "9px 20px", borderRadius: 9, border: `1px solid ${BRAND.neutralGrey}`, background: BRAND.white, fontSize: 13, cursor: "pointer", color: "#555" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.client_name.trim()} style={{ padding: "9px 24px", borderRadius: 9, border: "none", background: saving ? BRAND.softLilac : BRAND.accentViolet, color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Exo 2', sans-serif" }}>
                  {saving ? "Saving..." : editItem ? "Save Changes" : "Create Invoice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: BRAND.white, borderRadius: 14, padding: 28, width: 340, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Delete this invoice?</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${BRAND.neutralGrey}`, background: BRAND.white, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
