import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, FileText, AlertCircle, CheckCircle, Loader, RefreshCw, ExternalLink, Plus, Eye } from "lucide-react";
import EmailPreviewModal from "@/components/EmailPreviewModal";

const PRIORITY_COLORS = { high: "#e53935", medium: "#f9a825", low: "#00897b" };
const PRIORITY_BG = { high: "#fdecea", medium: "#fffde7", low: "#e8f5e9" };

export default function EmailScan() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedInvoices, setCapturedInvoices] = useState({});
  const [capturingId, setCapturingId] = useState(null);
  const [previewEmail, setPreviewEmail] = useState(null);

  async function scan() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await base44.functions.invoke("outlookScanEmails", {});
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function captureInvoice(inv, idx) {
    setCapturingId(idx);
    await base44.entities.Expense.create({
      title: inv.suggested_title || inv.email.subject,
      vendor: inv.suggested_vendor || inv.email.from?.emailAddress?.name || "",
      amount: parseFloat(inv.suggested_amount?.replace(/[^0-9.]/g, "")) || 0,
      currency: inv.suggested_currency || "HKD",
      category: "Other",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      payment_method: "Bank Transfer",
      notes: `Captured from email: ${inv.email.subject}`,
    });
    setCapturedInvoices(prev => ({ ...prev, [idx]: true }));
    setCapturingId(null);
  }

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1f2e" }}>📬 Email Scanner</h1>
          <p style={{ margin: "4px 0 0", color: "#7b8db0", fontSize: 14 }}>AI scans your unread inbox for replies needed & invoices to capture</p>
        </div>
        <button
          onClick={scan}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? <Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={16} />}
          {loading ? "Scanning..." : "Scan Inbox"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fdecea", border: "1px solid #f5c6cb", borderRadius: 10, padding: "14px 18px", color: "#e53935", marginBottom: 20, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {!result && !loading && !error && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
          <Mail size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 15 }}>Click "Scan Inbox" to analyse your unread emails</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#7b8db0" }}>
          <Loader size={36} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ fontSize: 14 }}>Fetching emails and running AI analysis…</p>
        </div>
      )}

      {result && (
        <>
          <div style={{ background: "#f0f6ff", borderRadius: 10, padding: "12px 18px", marginBottom: 24, fontSize: 13, color: "#4f8ef7", fontWeight: 600 }}>
            ✅ Scanned {result.scanned} unread emails · {result.needs_reply.length} need replies · {result.invoices.length} invoices found
          </div>

          {/* Needs Reply */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1f2e", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={18} color="#f9a825" /> Needs Reply ({result.needs_reply.length})
            </h2>
            {result.needs_reply.length === 0 ? (
              <div style={{ color: "#aaa", fontSize: 13, padding: "16px 0" }}>No emails requiring a reply 🎉</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.needs_reply.map((item, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 10, padding: "14px 18px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    borderLeft: `3px solid ${PRIORITY_COLORS[item.priority] || "#aaa"}`,
                    display: "flex", alignItems: "flex-start", gap: 14
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1f2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.email.subject}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: PRIORITY_BG[item.priority] || "#f5f5f5", color: PRIORITY_COLORS[item.priority] || "#888", whiteSpace: "nowrap", flexShrink: 0 }}>
                          {item.priority?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#9aa3b2", marginBottom: 5 }}>
                        From: {item.email.from?.emailAddress?.name} · {new Date(item.email.receivedDateTime).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: 13, color: "#555" }}>{item.reason}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
                      <button
                        onClick={() => setPreviewEmail(item.email)}
                        style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#4f8ef7", background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}
                      >
                        Preview <Eye size={12} />
                      </button>
                      <a
                        href={`https://outlook.office.com/mail/inbox`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7b8db0", textDecoration: "none" }}
                      >
                        Open <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Invoices */}
          <section>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1f2e", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} color="#4f8ef7" /> Invoices / Bills ({result.invoices.length})
            </h2>
            {result.invoices.length === 0 ? (
              <div style={{ color: "#aaa", fontSize: 13, padding: "16px 0" }}>No invoice emails detected</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.invoices.map((item, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 10, padding: "14px 18px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    borderLeft: "3px solid #4f8ef7",
                    display: "flex", alignItems: "center", gap: 14
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1f2e", marginBottom: 3 }}>{item.suggested_title || item.email.subject}</div>
                      <div style={{ fontSize: 12, color: "#9aa3b2" }}>
                        From: {item.email.from?.emailAddress?.name} · {new Date(item.email.receivedDateTime).toLocaleDateString()}
                      </div>
                      {item.suggested_amount && (
                        <div style={{ fontSize: 13, color: "#00897b", fontWeight: 600, marginTop: 4 }}>
                          {item.suggested_currency || "HKD"} {item.suggested_amount}
                          {item.suggested_vendor && <span style={{ fontWeight: 400, color: "#888", marginLeft: 8 }}>· {item.suggested_vendor}</span>}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => setPreviewEmail(item.email)}
                        style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7b8db0", background: "none", border: "none", cursor: "pointer" }}
                      >
                        <Eye size={14} />
                      </button>
                      {capturedInvoices[i] ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#00897b", fontWeight: 600 }}>
                          <CheckCircle size={14} /> Captured
                        </span>
                      ) : (
                        <button
                          onClick={() => captureInvoice(item, i)}
                          disabled={capturingId === i}
                          style={{ display: "flex", alignItems: "center", gap: 5, background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          <Plus size={13} />
                          {capturingId === i ? "Saving..." : "Add to Expenses"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <EmailPreviewModal email={previewEmail} onClose={() => setPreviewEmail(null)} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}