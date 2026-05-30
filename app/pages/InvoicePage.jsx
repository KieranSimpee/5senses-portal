import { useState, useEffect, useRef } from "react";
import { Invoice } from "@/api/entities";
import { createClient } from "@/api/functions";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
  green: "#16a34a",
  amber: "#d97706",
  red: "#dc2626",
};

const STATUS_COLORS = {
  Draft:     { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" },
  Sent:      { bg: "#e0f2fe", text: "#0369a1", dot: "#38bdf8" },
  Paid:      { bg: "#dcfce7", text: "#16a34a", dot: "#4ade80" },
  Overdue:   { bg: "#fef2f2", text: "#ef4444", dot: "#f87171" },
  Cancelled: { bg: "#f8fafc", text: "#94a3b8", dot: "#cbd5e1" },
};

const CURRENCIES = ["HKD", "USD", "EUR", "GBP", "CNY", "SGD"];
const PAYMENT_METHODS = [
  "Bank Transfer / Airwallex",
  "FPS (Hong Kong)",
  "Credit Card",
  "Cash",
  "Cheque",
  "PayPal",
  "Other",
];

const COMPANY = {
  name: "SIMPLEX-ITY",
  legal: "Branch of 5SENSESBEAUTY LIMITED",
  address: "RM1608, 16/F, APEC PLAZA, 49 HOI YUEN RD, KWUN TONG, KL",
  email: "enquiries@simplex-ity.com",
  web: "www.simplex-ity.com",
  brn: "78459506-001-07-25-A",
  bank: "Airwallex / HSBC",
};

const EMPTY_FORM = {
  invoice_no: "",
  client_name: "",
  client_email: "",
  client_address: "",
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: "",
  currency: "HKD",
  items: [{ description: "", qty: 1, unit_price: "" }],
  tax: 0,
  notes: "",
  payment_method: "Bank Transfer / Airwallex",
  status: "Draft",
  airwallex_synced: false,
};

// ─────────────────────────────────────────────
// PDF generator (runs in-browser, no backend)
// ─────────────────────────────────────────────
async function generatePDF(inv, type = "invoice") {
  const { jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm");
  const isReceipt = type === "receipt";

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const margin = 18;
  const lilac = [140, 130, 252];
  const violet = [94, 80, 251];
  const bodyText = [26, 26, 31];
  const grey = [140, 140, 150];

  // ── Header bar ──
  doc.setFillColor(...lilac);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SIMPLEX-ITY", margin, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Branch of 5SENSESBEAUTY LIMITED", margin, 19);

  // Right side header
  doc.setFontSize(8);
  doc.text(COMPANY.address, W - margin, 10, { align: "right" });
  doc.text(`${COMPANY.email}  ·  ${COMPANY.web}`, W - margin, 15, { align: "right" });
  doc.text(`BRN: ${COMPANY.brn}`, W - margin, 20, { align: "right" });

  // ── Title ──
  let y = 34;
  doc.setTextColor(...violet);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(isReceipt ? "RECEIPT" : "INVOICE", margin, y);

  // Status badge
  if (!isReceipt) {
    doc.setFillColor(230, 230, 254);
    doc.roundedRect(W - margin - 30, y - 8, 30, 9, 3, 3, "F");
    doc.setTextColor(...lilac);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(inv.status || "Draft", W - margin - 15, y - 2.5, { align: "center" });
  } else {
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(W - margin - 30, y - 8, 30, 9, 3, 3, "F");
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PAID", W - margin - 15, y - 2.5, { align: "center" });
  }

  // ── Invoice meta ──
  y += 8;
  doc.setTextColor(...grey);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${isReceipt ? "Receipt" : "Invoice"} No:`, margin, y);
  doc.setTextColor(...bodyText);
  doc.setFont("helvetica", "bold");
  doc.text(inv.invoice_no || "—", margin + 30, y);

  doc.setTextColor(...grey);
  doc.setFont("helvetica", "normal");
  doc.text("Issue Date:", W / 2, y);
  doc.setTextColor(...bodyText);
  doc.setFont("helvetica", "bold");
  doc.text(inv.issue_date || "—", W / 2 + 22, y);

  y += 6;
  if (!isReceipt && inv.due_date) {
    doc.setTextColor(...grey);
    doc.setFont("helvetica", "normal");
    doc.text("Due Date:", margin, y);
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.text(inv.due_date, margin + 30, y);
  }

  doc.setTextColor(...grey);
  doc.setFont("helvetica", "normal");
  doc.text("Payment:", W / 2, y);
  doc.setTextColor(...bodyText);
  doc.setFont("helvetica", "bold");
  doc.text(inv.payment_method || "—", W / 2 + 22, y);

  // ── Divider ──
  y += 8;
  doc.setDrawColor(...lilac);
  doc.setLineWidth(0.4);
  doc.line(margin, y, W - margin, y);

  // ── Bill To ──
  y += 8;
  doc.setFillColor(248, 247, 255);
  doc.roundedRect(margin, y, (W - margin * 2) / 2 - 4, 28, 4, 4, "F");
  doc.setTextColor(...lilac);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", margin + 4, y + 6);
  doc.setTextColor(...bodyText);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(inv.client_name || "—", margin + 4, y + 13);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grey);
  if (inv.client_address) doc.text(inv.client_address, margin + 4, y + 19, { maxWidth: 75 });
  if (inv.client_email) doc.text(inv.client_email, margin + 4, y + 25);

  y += 36;

  // ── Line items table ──
  const colX = [margin, margin + 80, margin + 110, margin + 138, margin + 162];
  doc.setFillColor(...lilac);
  doc.rect(margin, y, W - margin * 2, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  ["DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT", ""].forEach((h, i) => {
    if (i < 4) doc.text(h, colX[i] + 2, y + 5.5);
  });

  y += 8;
  const items = parseItems(inv.items);
  let subtotal = 0;
  items.forEach((item, idx) => {
    const amt = (parseFloat(item.qty) || 0) * (parseFloat(item.unit_price) || 0);
    subtotal += amt;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 247, 255);
      doc.rect(margin, y, W - margin * 2, 8, "F");
    }
    doc.setTextColor(...bodyText);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(item.description || "—", colX[0] + 2, y + 5.5, { maxWidth: 76 });
    doc.text(String(item.qty || 1), colX[1] + 2, y + 5.5);
    doc.text(fmtAmt(item.unit_price, inv.currency), colX[2] + 2, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(fmtAmt(amt, inv.currency), colX[3] + 2, y + 5.5);
    y += 8;
  });

  // ── Totals ──
  y += 4;
  doc.setDrawColor(...lilac);
  doc.setLineWidth(0.3);
  doc.line(W / 2, y, W - margin, y);
  y += 6;

  const tax = parseFloat(inv.tax) || 0;
  const total = subtotal + tax;

  const drawTotal = (label, value, bold = false, highlight = false) => {
    if (highlight) {
      doc.setFillColor(...lilac);
      doc.roundedRect(W / 2, y - 4, W / 2 - margin, 8, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(...grey);
    }
    doc.setFontSize(bold ? 10 : 8.5);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    if (!highlight) doc.setTextColor(...bodyText);
    doc.text(label, W / 2 + 4, y);
    doc.text(value, W - margin - 2, y, { align: "right" });
    y += 7;
  };

  drawTotal("Subtotal", fmtAmt(subtotal, inv.currency));
  if (tax > 0) drawTotal(`Tax`, fmtAmt(tax, inv.currency));
  drawTotal("TOTAL", fmtAmt(total, inv.currency), true, true);

  // ── Notes ──
  if (inv.notes) {
    y += 6;
    doc.setDrawColor(...lilac);
    doc.setLineWidth(0.3);
    doc.line(margin, y, W - margin, y);
    y += 6;
    doc.setTextColor(...lilac);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("NOTES", margin, y);
    y += 5;
    doc.setTextColor(...grey);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(inv.notes, margin, y, { maxWidth: W - margin * 2 });
  }

  // ── Footer ──
  doc.setFillColor(...lilac);
  doc.rect(0, H - 14, W, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${COMPANY.address}  ·  ${COMPANY.email}  ·  ${COMPANY.web}`, W / 2, H - 6, { align: "center" });
  doc.setFontSize(7);
  doc.text(`Generated by 5S Portal  ·  ${new Date().toLocaleDateString("en-HK")}`, W / 2, H - 2, { align: "center" });

  const filename = `${isReceipt ? "Receipt" : "Invoice"}_${inv.invoice_no || "draft"}.pdf`;
  doc.save(filename);
  return filename;
}

function parseItems(rawItems) {
  if (!rawItems) return [];
  return rawItems.map((item) => {
    if (typeof item === "object") return item;
    const parts = item.split("|").map((p) => p.trim());
    const name = parts[0] || "";
    const qtyMatch = parts[1]?.match(/qty[:\s]*([\d.]+)/i);
    const priceMatch = parts[2]?.match(/([\d,.]+)/);
    return {
      description: name,
      qty: qtyMatch ? parseFloat(qtyMatch[1]) : 1,
      unit_price: priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : 0,
    };
  });
}

function fmtAmt(amount, currency = "HKD") {
  const n = parseFloat(amount) || 0;
  return `${currency} ${n.toLocaleString("en-HK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-HK", { day: "2-digit", month: "short", year: "numeric" });
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [nextNo, setNextNo] = useState("SXTY-INV-001");
  const [tab, setTab] = useState("all");
  const [generating, setGenerating] = useState(null);
  const [toast, setToast] = useState(null);
  const [showMarkPaid, setShowMarkPaid] = useState(null);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().slice(0, 10));

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    Invoice.list().then((data) => {
      const sorted = [...data].sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date));
      setInvoices(sorted);
      setLoading(false);
      const nums = sorted.map((i) => {
        const m = i.invoice_no?.match(/(\d+)$/);
        return m ? parseInt(m[1]) : 0;
      });
      const max = nums.length ? Math.max(...nums) : 0;
      setNextNo(`SXTY-INV-${String(max + 1).padStart(3, "0")}`);
    });
  };

  useEffect(() => { load(); }, []);

  const filtered = invoices.filter((i) => {
    if (tab === "all") return true;
    if (tab === "draft") return i.status === "Draft";
    if (tab === "sent") return i.status === "Sent";
    if (tab === "paid") return i.status === "Paid";
    if (tab === "overdue") return i.status === "Overdue";
    return true;
  });

  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + (i.total || 0), 0);
  const totalPending = invoices.filter((i) => ["Draft", "Sent"].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + (i.total || 0), 0);

  const calcSubtotal = (items) =>
    items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.unit_price) || 0), 0);

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, invoice_no: nextNo });
    setShowModal(true);
  };

  const openEdit = (inv) => {
    setEditItem(inv);
    const parsedItems = parseItems(inv.items);
    setForm({
      invoice_no: inv.invoice_no || "",
      client_name: inv.client_name || "",
      client_email: inv.client_email || "",
      client_address: inv.client_address || "",
      issue_date: inv.issue_date || new Date().toISOString().slice(0, 10),
      due_date: inv.due_date || "",
      currency: inv.currency || "HKD",
      items: parsedItems.length ? parsedItems : [{ description: "", qty: 1, unit_price: "" }],
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
    const itemStrings = form.items.map(
      (it) => `${it.description} | qty:${it.qty} | ${form.currency} ${it.unit_price}`
    );
    const payload = { ...form, items: itemStrings, subtotal, total };
    try {
      if (editItem) {
        await Invoice.update(editItem.id, payload);
        showToast("Invoice updated ✓");
      } else {
        await Invoice.create(payload);
        showToast("Invoice created ✓");
      }
      setShowModal(false);
      load();
    } catch (e) {
      showToast("Error saving invoice", "error");
    }
    setSaving(false);
  };

  const handleMarkSent = async (inv) => {
    await Invoice.update(inv.id, { status: "Sent" });
    showToast(`${inv.invoice_no} marked as Sent`);
    load();
    if (selected?.id === inv.id) setSelected({ ...inv, status: "Sent" });
  };

  const handleMarkPaid = async () => {
    const inv = showMarkPaid;
    await Invoice.update(inv.id, { status: "Paid", notes: inv.notes ? inv.notes + `\nPaid on ${paidDate}` : `Paid on ${paidDate}` });
    showToast(`${inv.invoice_no} marked as Paid 🎉`);
    setShowMarkPaid(null);
    load();
    if (selected?.id === inv.id) setSelected({ ...inv, status: "Paid" });
  };

  const handleMarkOverdue = async (inv) => {
    await Invoice.update(inv.id, { status: "Overdue" });
    showToast(`${inv.invoice_no} marked as Overdue`);
    load();
    if (selected?.id === inv.id) setSelected({ ...inv, status: "Overdue" });
  };

  const handleDelete = async (id) => {
    await Invoice.delete(id);
    setDeleteConfirm(null);
    if (selected?.id === id) setSelected(null);
    showToast("Invoice deleted");
    load();
  };

  const handleDownloadInvoice = async (inv) => {
    setGenerating(inv.id + "_invoice");
    try {
      await generatePDF(inv, "invoice");
      showToast(`Invoice PDF downloaded ✓`);
    } catch (e) {
      showToast("PDF generation failed: " + e.message, "error");
    }
    setGenerating(null);
  };

  const handleDownloadReceipt = async (inv) => {
    setGenerating(inv.id + "_receipt");
    try {
      await generatePDF(inv, "receipt");
      showToast(`Receipt PDF downloaded ✓`);
    } catch (e) {
      showToast("Receipt generation failed: " + e.message, "error");
    }
    setGenerating(null);
  };

  const handleDuplicate = async (inv) => {
    const parsedItems = parseItems(inv.items);
    const itemStrings = parsedItems.map(
      (it) => `${it.description} | qty:${it.qty} | ${inv.currency} ${it.unit_price}`
    );
    await Invoice.create({
      ...inv,
      id: undefined,
      invoice_no: nextNo,
      status: "Draft",
      airwallex_synced: false,
      issue_date: new Date().toISOString().slice(0, 10),
      items: itemStrings,
    });
    showToast(`Duplicated as ${nextNo}`);
    load();
  };

  // ─── Styles ───
  const btn = (bg, color = "#fff", small = false) => ({
    background: bg, color, border: "none", borderRadius: 8,
    padding: small ? "6px 12px" : "9px 18px",
    fontSize: small ? 11 : 12, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Exo 2', sans-serif", transition: "opacity 0.15s",
    whiteSpace: "nowrap",
  });

  const input = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: `1.5px solid ${BRAND.neutralGrey}`, fontSize: 13,
    outline: "none", boxSizing: "border-box",
    fontFamily: "'Montserrat', sans-serif", color: BRAND.bodyText,
    background: BRAND.white,
  };

  const label = {
    fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 4,
    display: "block", textTransform: "uppercase", letterSpacing: 0.6,
  };

  return (
    <div style={{ padding: "24px 28px", fontFamily: "'Montserrat', sans-serif", color: BRAND.bodyText, maxWidth: 1300 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 24, zIndex: 9999,
          background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#86efac"}`,
          color: toast.type === "error" ? BRAND.red : BRAND.green,
          padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 22, color: BRAND.bodyText }}>
            🧾 Invoices & Receipts
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
            SIMPLEX-ITY · Auto-sequenced SXTY-INV-XXX · Looka-branded PDF
          </div>
        </div>
        <button onClick={openAdd} style={btn(BRAND.accentViolet)}>+ New Invoice</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Invoices", value: invoices.length, color: BRAND.primaryLilac, icon: "🧾" },
          { label: "Revenue Collected", value: `HKD ${totalRevenue.toLocaleString()}`, color: BRAND.green, icon: "✅" },
          { label: "Pending Amount", value: `HKD ${totalPending.toLocaleString()}`, color: BRAND.amber, icon: "⏳" },
          { label: "Overdue", value: `HKD ${totalOverdue.toLocaleString()}`, color: BRAND.red, icon: "⚠️" },
        ].map((s, i) => (
          <div key={i} style={{
            background: BRAND.white, borderRadius: 14, padding: "16px 18px",
            border: `1px solid ${BRAND.neutralGrey}`, borderLeft: `4px solid ${s.color}`,
            boxShadow: "0 2px 8px rgba(140,130,252,0.06)",
          }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 3, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: `2px solid ${BRAND.lavenderWash}` }}>
        {[
          { key: "all", label: `All (${invoices.length})` },
          { key: "draft", label: `Draft (${invoices.filter(i => i.status === "Draft").length})` },
          { key: "sent", label: `Sent (${invoices.filter(i => i.status === "Sent").length})` },
          { key: "paid", label: `Paid (${invoices.filter(i => i.status === "Paid").length})` },
          { key: "overdue", label: `Overdue (${invoices.filter(i => i.status === "Overdue").length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: "none", border: "none", padding: "8px 14px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, fontFamily: "'Exo 2', sans-serif",
            color: tab === t.key ? BRAND.accentViolet : "#888",
            borderBottom: tab === t.key ? `2.5px solid ${BRAND.accentViolet}` : "2.5px solid transparent",
            marginBottom: -2,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Invoice List + Detail Panel */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", gap: 16 }}>

        {/* List */}
        <div style={{
          background: BRAND.white, borderRadius: 14,
          border: `1px solid ${BRAND.neutralGrey}`,
          boxShadow: "0 2px 12px rgba(140,130,252,0.06)", overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1.4fr 2fr 1fr 1fr 1fr 1.6fr",
            padding: "10px 18px", background: BRAND.lavenderWash,
            borderBottom: `1px solid ${BRAND.neutralGrey}`,
            fontSize: 9.5, fontWeight: 700, color: BRAND.primaryLilac,
            textTransform: "uppercase", letterSpacing: 1,
          }}>
            <div>Invoice No.</div><div>Client</div><div>Amount</div>
            <div>Status</div><div>Due Date</div><div>Actions</div>
          </div>

          {loading && <div style={{ padding: 32, textAlign: "center", color: BRAND.primaryLilac, fontSize: 13 }}>Loading...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 13 }}>
              {tab === "all" ? "No invoices yet — click \"+ New Invoice\" to create one." : `No ${tab} invoices.`}
            </div>
          )}

          {filtered.map((inv, idx) => {
            const sc = STATUS_COLORS[inv.status] || STATUS_COLORS.Draft;
            const isSelected = selected?.id === inv.id;
            return (
              <div key={inv.id}
                style={{
                  display: "grid", gridTemplateColumns: "1.4fr 2fr 1fr 1fr 1fr 1.6fr",
                  padding: "12px 18px", cursor: "pointer",
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${BRAND.neutralGrey}` : "none",
                  background: isSelected ? BRAND.lavenderWash : "transparent",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#faf9ff"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                <div onClick={() => setSelected(isSelected ? null : inv)} style={{ alignSelf: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: BRAND.accentViolet }}>{inv.invoice_no}</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{fmtDate(inv.issue_date)}</div>
                </div>
                <div onClick={() => setSelected(isSelected ? null : inv)} style={{ alignSelf: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{inv.client_name}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{inv.client_email}</div>
                </div>
                <div onClick={() => setSelected(isSelected ? null : inv)} style={{ alignSelf: "center", fontSize: 12, fontWeight: 700 }}>
                  {fmtAmt(inv.total, inv.currency)}
                </div>
                <div onClick={() => setSelected(isSelected ? null : inv)} style={{ alignSelf: "center" }}>
                  <span style={{
                    background: sc.bg, color: sc.text, borderRadius: 20,
                    padding: "3px 10px", fontSize: 10, fontWeight: 700,
                  }}>● {inv.status}</span>
                </div>
                <div onClick={() => setSelected(isSelected ? null : inv)} style={{ alignSelf: "center", fontSize: 11, color: "#777" }}>
                  {fmtDate(inv.due_date)}
                </div>
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 4, alignSelf: "center", flexWrap: "wrap" }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDownloadInvoice(inv); }}
                    style={btn(BRAND.lavenderWash, BRAND.accentViolet, true)}
                    title="Download Invoice PDF">
                    {generating === inv.id + "_invoice" ? "..." : "📄 PDF"}
                  </button>
                  {inv.status === "Paid" && (
                    <button onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(inv); }}
                      style={btn("#dcfce7", BRAND.green, true)}
                      title="Download Receipt PDF">
                      {generating === inv.id + "_receipt" ? "..." : "🧾 Receipt"}
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); openEdit(inv); }}
                    style={btn("#f1f5f9", "#475569", true)}>✏️</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            background: BRAND.white, borderRadius: 14,
            border: `1px solid ${BRAND.neutralGrey}`,
            boxShadow: "0 2px 12px rgba(140,130,252,0.08)", padding: 20,
            height: "fit-content", position: "sticky", top: 20,
          }}>
            {/* Detail header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 15, color: BRAND.accentViolet }}>
                  {selected.invoice_no}
                </div>
                <span style={{
                  background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.text,
                  borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700,
                }}>● {selected.status}</span>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#aaa" }}>✕</button>
            </div>

            {/* Client info */}
            <div style={{ background: BRAND.lavenderWash, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: BRAND.primaryLilac, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Bill To</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{selected.client_name}</div>
              {selected.client_email && <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{selected.client_email}</div>}
              {selected.client_address && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{selected.client_address}</div>}
            </div>

            {/* Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[["Issue Date", fmtDate(selected.issue_date)], ["Due Date", fmtDate(selected.due_date)]].map(([l, v]) => (
                <div key={l} style={{ background: "#f8f8ff", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9.5, color: "#888", fontWeight: 600, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Line items */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: BRAND.primaryLilac, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Items</div>
              {parseItems(selected.items).map((item, i) => {
                const amt = (parseFloat(item.qty) || 0) * (parseFloat(item.unit_price) || 0);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BRAND.lavenderWash}`, fontSize: 11 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.description}</div>
                      <div style={{ color: "#aaa", fontSize: 10 }}>× {item.qty} @ {fmtAmt(item.unit_price, selected.currency)}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: BRAND.accentViolet }}>{fmtAmt(amt, selected.currency)}</div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div style={{ background: BRAND.lavenderWash, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              {selected.tax > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777", marginBottom: 4 }}>
                  <span>Subtotal</span><span>{fmtAmt(selected.subtotal, selected.currency)}</span>
                </div>
              )}
              {selected.tax > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777", marginBottom: 4 }}>
                  <span>Tax</span><span>{fmtAmt(selected.tax, selected.currency)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14, color: BRAND.accentViolet }}>
                <span>TOTAL</span><span>{fmtAmt(selected.total, selected.currency)}</span>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ fontSize: 11, color: "#777", marginBottom: 14 }}>
              <span style={{ fontWeight: 600 }}>Payment: </span>{selected.payment_method}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 11, color: "#92400e" }}>
                {selected.notes}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleDownloadInvoice(selected)} style={{ ...btn(BRAND.accentViolet), flex: 1 }}>
                  {generating === selected.id + "_invoice" ? "Generating..." : "📄 Download Invoice PDF"}
                </button>
              </div>

              {selected.status === "Paid" && (
                <button onClick={() => handleDownloadReceipt(selected)} style={{ ...btn(BRAND.green), width: "100%" }}>
                  {generating === selected.id + "_receipt" ? "Generating..." : "🧾 Download Receipt PDF"}
                </button>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                {selected.status === "Draft" && (
                  <button onClick={() => handleMarkSent(selected)} style={{ ...btn("#0369a1"), flex: 1 }}>
                    📤 Mark Sent
                  </button>
                )}
                {["Draft", "Sent", "Overdue"].includes(selected.status) && (
                  <button onClick={() => { setShowMarkPaid(selected); setPaidDate(new Date().toISOString().slice(0, 10)); }}
                    style={{ ...btn(BRAND.green), flex: 1 }}>
                    ✅ Mark Paid
                  </button>
                )}
                {selected.status === "Sent" && (
                  <button onClick={() => handleMarkOverdue(selected)} style={{ ...btn(BRAND.red), flex: 1 }}>
                    ⚠️ Mark Overdue
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(selected)} style={{ ...btn("#f1f5f9", "#475569"), flex: 1 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDuplicate(selected)} style={{ ...btn("#f1f5f9", "#475569"), flex: 1 }}>
                  📋 Duplicate
                </button>
                <button onClick={() => setDeleteConfirm(selected.id)} style={{ ...btn("#fef2f2", BRAND.red), flex: 1 }}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(26,26,31,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          backdropFilter: "blur(2px)",
        }}>
          <div style={{
            background: BRAND.white, borderRadius: 18, width: 660, maxHeight: "92vh",
            overflowY: "auto", padding: 28, boxShadow: "0 20px 60px rgba(94,80,251,0.18)",
          }}>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 20, color: BRAND.accentViolet }}>
              {editItem ? `✏️ Edit ${editItem.invoice_no}` : `🆕 New Invoice — ${nextNo}`}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {/* Invoice No */}
              <div>
                <span style={label}>Invoice No.</span>
                <input style={input} value={form.invoice_no}
                  onChange={e => setForm(f => ({ ...f, invoice_no: e.target.value }))} />
              </div>
              {/* Status */}
              <div>
                <span style={label}>Status</span>
                <select style={input} value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Client Name */}
              <div>
                <span style={label}>Client Name *</span>
                <input style={input} value={form.client_name} placeholder="Client / Company"
                  onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
              </div>
              {/* Client Email */}
              <div>
                <span style={label}>Client Email</span>
                <input style={input} value={form.client_email} placeholder="billing@client.com"
                  onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))} />
              </div>
              {/* Client Address */}
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={label}>Client Address</span>
                <input style={input} value={form.client_address} placeholder="Unit, Building, District, City"
                  onChange={e => setForm(f => ({ ...f, client_address: e.target.value }))} />
              </div>
              {/* Dates */}
              <div>
                <span style={label}>Issue Date</span>
                <input type="date" style={input} value={form.issue_date}
                  onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} />
              </div>
              <div>
                <span style={label}>Due Date</span>
                <input type="date" style={input} value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
              </div>
              {/* Currency + Payment */}
              <div>
                <span style={label}>Currency</span>
                <select style={input} value={form.currency}
                  onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span style={label}>Payment Method</span>
                <select style={input} value={form.payment_method}
                  onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ ...label, margin: 0 }}>Line Items</span>
                <button onClick={() => setForm(f => ({ ...f, items: [...f.items, { description: "", qty: 1, unit_price: "" }] }))}
                  style={btn(BRAND.lavenderWash, BRAND.accentViolet, true)}>+ Add Item</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr auto", gap: 4, marginBottom: 6 }}>
                {["Description", "Qty", "Unit Price", ""].map(h => (
                  <div key={h} style={{ fontSize: 9.5, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, paddingLeft: 2 }}>{h}</div>
                ))}
              </div>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr auto", gap: 6, marginBottom: 6 }}>
                  <input style={input} value={item.description} placeholder="Service description"
                    onChange={e => setForm(f => ({ ...f, items: f.items.map((it, j) => j === i ? { ...it, description: e.target.value } : it) }))} />
                  <input style={input} type="number" value={item.qty} min={0}
                    onChange={e => setForm(f => ({ ...f, items: f.items.map((it, j) => j === i ? { ...it, qty: e.target.value } : it) }))} />
                  <input style={input} type="number" value={item.unit_price} placeholder="0.00" min={0}
                    onChange={e => setForm(f => ({ ...f, items: f.items.map((it, j) => j === i ? { ...it, unit_price: e.target.value } : it) }))} />
                  <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", fontSize: 16, padding: "0 4px" }}
                    disabled={form.items.length === 1}>✕</button>
                </div>
              ))}
              {/* Subtotal preview */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 8, fontSize: 12 }}>
                <span style={{ color: "#888" }}>Subtotal:</span>
                <span style={{ fontWeight: 700, color: BRAND.accentViolet }}>{fmtAmt(calcSubtotal(form.items), form.currency)}</span>
              </div>
            </div>

            {/* Tax + Notes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginTop: 14 }}>
              <div>
                <span style={label}>Tax Amount ({form.currency})</span>
                <input style={input} type="number" value={form.tax} min={0}
                  onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} />
              </div>
              <div>
                <span style={label}>Notes / Remarks</span>
                <input style={input} value={form.notes} placeholder="Payment instructions, terms..."
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>

            {/* Total preview */}
            <div style={{ background: BRAND.lavenderWash, borderRadius: 10, padding: "10px 16px", marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 13, color: BRAND.accentViolet }}>TOTAL</span>
              <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 18, color: BRAND.accentViolet }}>
                {fmtAmt(calcSubtotal(form.items) + (parseFloat(form.tax) || 0), form.currency)}
              </span>
            </div>

            {/* Modal buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ ...btn("#f1f5f9", "#475569"), flex: 1 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.client_name.trim()} style={{ ...btn(BRAND.accentViolet), flex: 2, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : editItem ? "Update Invoice" : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Paid Modal ── */}
      {showMarkPaid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,31,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: BRAND.white, borderRadius: 16, padding: 28, width: 360, boxShadow: "0 16px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 16, color: BRAND.green }}>
              ✅ Mark as Paid
            </div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 14 }}>
              Recording payment for <strong>{showMarkPaid.invoice_no}</strong> — {fmtAmt(showMarkPaid.total, showMarkPaid.currency)}
            </p>
            <div style={{ marginBottom: 16 }}>
              <span style={label}>Payment Date</span>
              <input type="date" style={input} value={paidDate}
                onChange={e => setPaidDate(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowMarkPaid(null)} style={{ ...btn("#f1f5f9", "#475569"), flex: 1 }}>Cancel</button>
              <button onClick={handleMarkPaid} style={{ ...btn(BRAND.green), flex: 2 }}>Confirm Paid</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,31,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: BRAND.white, borderRadius: 16, padding: 28, width: 340, boxShadow: "0 16px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 12, color: BRAND.red }}>Delete Invoice?</div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...btn("#f1f5f9", "#475569"), flex: 1 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ ...btn(BRAND.red), flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
