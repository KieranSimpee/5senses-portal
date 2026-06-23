import { useState, useEffect, useRef } from "react";
import { Campaign, CampaignInfluencer, Influencer, Invoice, CalendarEvent } from "@/api/entities";

const PURPLE = "#7c3aed";
const LIGHT_PURPLE = "#ede9fe";
const DARK = "#1a0533";
const TABS = ["Dashboard", "Calendar", "Influencers", "Products", "Invoices"];

const TAB_ICONS = {
  Dashboard: "◈",
  Calendar: "▦",
  Influencers: "◉",
  Products: "▣",
  Invoices: "◎",
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Active:    { bg: "#d1fae5", color: "#065f46" },
    Confirmed: { bg: "#d1fae5", color: "#065f46" },
    Done:      { bg: "#e0f2fe", color: "#0277bd" },
    Completed: { bg: "#e0f2fe", color: "#0277bd" },
    Pending:   { bg: "#fef9c3", color: "#854d0e" },
    Planning:  { bg: "#fef9c3", color: "#854d0e" },
    Paid:      { bg: "#d1fae5", color: "#065f46" },
    Overdue:   { bg: "#fee2e2", color: "#991b1b" },
    Inactive:  { bg: "#f1f5f9", color: "#475569" },
  };
  const style = map[status] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700
    }}>{status}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 20,
      boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
      border: "1px solid #ede9fe", ...style
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: DARK }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
function DashboardTab({ brand, campaigns, influencers, invoices }) {
  const activeCampaigns = campaigns.filter(c => c.status === "Active" || c.status === "Planning");
  const paidInvoices = invoices.filter(i => i.status === "Paid");
  const pendingInvoices = invoices.filter(i => i.status === "Pending" || i.status === "Overdue");
  const totalPaid = paidInvoices.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);

  const stats = [
    { label: "Active Campaigns", value: activeCampaigns.length, color: PURPLE },
    { label: "Assigned Influencers", value: influencers.length, color: "#0277bd" },
    { label: "Invoices Pending", value: pendingInvoices.length, color: "#d97706" },
    { label: "Total Paid (USD)", value: `$${totalPaid.toLocaleString()}`, color: "#065f46" },
  ];

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${DARK}, #2d1157)`, borderRadius: 16, padding: "24px 28px", marginBottom: 24, color: "#fff" }}>
        <div style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Welcome back</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{brand.brand_name}</div>
        <div style={{ fontSize: 12, color: "#a78bfa", marginTop: 4 }}>
          {brand.brand_tier} Partner · Code: {brand.brand_code}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginTop: 6 }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {activeCampaigns.length > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 800, color: DARK, marginBottom: 12 }}>Active Campaigns</div>
          {activeCampaigns.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f0ff" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{c.start_date} → {c.end_date}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── CALENDAR TAB ─────────────────────────────────────────────────────────────
function CalendarTab({ events, campaigns }) {
  const upcoming = [...events].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const typeColor = {
    Live:  { bg: "#ede9fe", color: PURPLE },
    Video: { bg: "#e0f2fe", color: "#0277bd" },
    Blog:  { bg: "#fef9c3", color: "#854d0e" },
    Other: { bg: "#f1f5f9", color: "#475569" },
  };

  return (
    <div>
      <SectionTitle title="Campaign Calendar" sub="Your confirmed schedule of lives, videos and deliverables" />
      {upcoming.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 12, color: "#c4b5fd" }}>▦</div>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>No scheduled events yet.</div>
          <div style={{ color: "#c4b5fd", fontSize: 12, marginTop: 6 }}>Your campaign schedule will appear here once confirmed.</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.map(ev => {
            const tc = typeColor[ev.type] || typeColor.Other;
            const date = ev.due_date ? new Date(ev.due_date) : null;
            return (
              <Card key={ev.id} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {/* Date block */}
                <div style={{ minWidth: 52, textAlign: "center", background: LIGHT_PURPLE, borderRadius: 12, padding: "10px 8px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: PURPLE }}>
                    {date ? date.getDate() : "--"}
                  </div>
                  <div style={{ fontSize: 10, color: "#6d28d9", fontWeight: 700 }}>
                    {date ? date.toLocaleString("default", { month: "short" }).toUpperCase() : ""}
                  </div>
                </div>
                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                    {ev.influencer_name && `Influencer: ${ev.influencer_name}`}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{ev.type}</span>
                  <StatusBadge status={ev.status} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── INFLUENCERS TAB ──────────────────────────────────────────────────────────
function InfluencersTab({ influencers }) {
  const tierColor = {
    Nano:  { bg: "#ede9fe", color: PURPLE },
    Micro: { bg: "#fce7f3", color: "#be185d" },
    Macro: { bg: "#e0f2fe", color: "#0277bd" },
  };

  return (
    <div>
      <SectionTitle title="Your Influencer Team" sub="Influencers assigned to your campaigns — no internal rates shown" />
      {influencers.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 12, color: "#c4b5fd" }}>◉</div>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>No influencers assigned yet.</div>
          <div style={{ color: "#c4b5fd", fontSize: 12, marginTop: 6 }}>Your campaign influencers will appear here once assigned by your account manager.</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {influencers.map(inf => {
            const tc = tierColor[inf.tier] || { bg: "#f1f5f9", color: "#475569" };
            const score = inf.reliability_score || 0;
            const bars = Math.round(score / 20);
            return (
              <Card key={inf.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: LIGHT_PURPLE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: PURPLE, fontWeight: 900 }}>
                    {(inf.name || "?")[0].toUpperCase()}
                  </div>
                  <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{inf.tier}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: DARK }}>{inf.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  {inf.platform} {inf.handle ? `· ${inf.handle}` : ""}
                </div>
                {/* Reliability */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}>RELIABILITY</div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= bars ? PURPLE : "#e2d9f3" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{score}/100</div>
                </div>
                {inf.ai_certified && (
                  <div style={{ marginTop: 10, fontSize: 10, color: "#065f46", background: "#d1fae5", borderRadius: 6, padding: "3px 8px", display: "inline-block", fontWeight: 700 }}>
                    AI Certified
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
function ProductsTab({ brandId }) {
  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState("list"); // list | manual | csv
  const [form, setForm] = useState({ title: "", sku: "", price: "", type: "", description: "", image_url: "" });
  const [saving, setSaving] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [csvPreview, setCsvPreview] = useState(false);
  const fileRef = useRef();

  // Load from localStorage keyed by brandId
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`brand_products_${brandId}`) || "[]");
      setProducts(saved);
    } catch (e) {}
  }, [brandId]);

  const saveProducts = (list) => {
    setProducts(list);
    localStorage.setItem(`brand_products_${brandId}`, JSON.stringify(list));
  };

  const handleManualSave = () => {
    if (!form.title) return;
    setSaving(true);
    const newList = [...products, { ...form, id: Date.now().toString(), added: new Date().toISOString() }];
    saveProducts(newList);
    setForm({ title: "", sku: "", price: "", type: "", description: "", image_url: "" });
    setSaving(false);
    setMode("list");
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, "").toLowerCase());
      const rows = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
        return {
          id: Date.now().toString() + Math.random(),
          title: obj["title"] || obj["name"] || "",
          sku: obj["variant sku"] || obj["sku"] || "",
          price: obj["variant price"] || obj["price"] || "",
          type: obj["type"] || obj["product type"] || "",
          description: obj["body (html)"] || obj["body"] || obj["description"] || "",
          image_url: obj["image src"] || obj["image_src"] || "",
          added: new Date().toISOString()
        };
      }).filter(r => r.title);
      setCsvRows(rows);
      setCsvPreview(true);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmCSV = () => {
    saveProducts([...products, ...csvRows]);
    setCsvRows([]);
    setCsvPreview(false);
    setMode("list");
  };

  const removeProduct = (id) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid #e2d9f3", fontSize: 13, background: "#faf9ff",
    outline: "none", boxSizing: "border-box"
  };

  return (
    <div>
      <SectionTitle title="Product Catalogue" sub="Upload your products — Shopify CSV format supported" />

      {/* CSV Preview modal */}
      {csvPreview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card style={{ maxWidth: 600, width: "90%", maxHeight: "80vh", overflow: "auto" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: DARK, marginBottom: 4 }}>CSV Preview</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>{csvRows.length} products found — confirm to import</div>
            {csvRows.slice(0, 10).map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f0ff", fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: DARK }}>{r.title}</div>
                  <div style={{ color: "#94a3b8" }}>SKU: {r.sku || "—"} · ${r.price || "—"}</div>
                </div>
                <span style={{ color: "#6d28d9", fontSize: 11 }}>{r.type || "—"}</span>
              </div>
            ))}
            {csvRows.length > 10 && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>...and {csvRows.length - 10} more</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={confirmCSV} style={{ flex: 1, background: PURPLE, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Import {csvRows.length} Products
              </button>
              <button onClick={() => { setCsvPreview(false); setCsvRows([]); }} style={{ flex: 1, background: LIGHT_PURPLE, color: PURPLE, border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <label style={{ flex: 1, background: PURPLE, color: "#fff", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "center" }}>
          Drop CSV File
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleCSV} />
        </label>
        <button onClick={() => setMode(mode === "manual" ? "list" : "manual")} style={{ flex: 1, background: LIGHT_PURPLE, color: PURPLE, border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {mode === "manual" ? "Cancel" : "+ Add Manually"}
        </button>
      </div>

      {/* CSV format hint */}
      <div style={{ background: "#faf7ff", border: "1px solid #e9e3ff", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 11, color: "#6d5d8e" }}>
        Accepts Shopify standard CSV export. Columns: Title, Variant SKU, Variant Price, Type, Body (HTML), Image Src
      </div>

      {/* Manual form */}
      {mode === "manual" && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: DARK, marginBottom: 14 }}>Add Product Manually</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Product Name *</label>
              <input style={inputStyle} placeholder="e.g. Moisturiser SPF30" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>SKU</label>
              <input style={inputStyle} placeholder="e.g. SKU-001" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Price (USD)</label>
              <input style={inputStyle} placeholder="e.g. 45.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Type / Category</label>
              <input style={inputStyle} placeholder="e.g. Skincare" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Image URL (optional)</label>
              <input style={inputStyle} placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
            </div>
          </div>
          <button onClick={handleManualSave} disabled={!form.title || saving} style={{ marginTop: 14, background: PURPLE, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: !form.title ? 0.6 : 1 }}>
            Save Product
          </button>
        </Card>
      )}

      {/* Product list */}
      {products.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 12, color: "#c4b5fd" }}>▣</div>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>No products uploaded yet.</div>
          <div style={{ color: "#c4b5fd", fontSize: 12, marginTop: 6 }}>Drop a Shopify CSV or add products manually above.</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {products.map(p => (
            <Card key={p.id} style={{ position: "relative" }}>
              {p.image_url && (
                <img src={p.image_url} alt={p.title} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} onError={e => { e.target.style.display = "none"; }} />
              )}
              <div style={{ fontSize: 13, fontWeight: 800, color: DARK }}>{p.title}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                {p.sku && `SKU: ${p.sku}`} {p.price && `· $${p.price}`}
              </div>
              {p.type && <div style={{ fontSize: 10, color: PURPLE, marginTop: 4, fontWeight: 600 }}>{p.type}</div>}
              <button onClick={() => removeProduct(p.id)} style={{ position: "absolute", top: 10, right: 10, background: "#fee2e2", border: "none", borderRadius: 6, color: "#dc2626", fontSize: 11, padding: "2px 7px", cursor: "pointer", fontWeight: 700 }}>✕</button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── INVOICES TAB ─────────────────────────────────────────────────────────────
function InvoicesTab({ invoices }) {
  const total = invoices.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  const paid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  const pending = total - paid;

  return (
    <div>
      <SectionTitle title="Invoices" sub="View your invoices — payments processed securely via Airwallex" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Total Billed</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: DARK, marginTop: 6 }}>${total.toLocaleString()}</div>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#065f46", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Paid</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#065f46", marginTop: 6 }}>${paid.toLocaleString()}</div>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#854d0e", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Pending</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#d97706", marginTop: 6 }}>${pending.toLocaleString()}</div>
        </Card>
      </div>

      {invoices.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 12, color: "#c4b5fd" }}>◎</div>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>No invoices yet.</div>
          <div style={{ color: "#c4b5fd", fontSize: 12, marginTop: 6 }}>Your invoices will appear here once issued by your account manager.</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {invoices.map(inv => (
            <Card key={inv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: DARK }}>{inv.invoice_no}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  Issued: {inv.issue_date} · Due: {inv.due_date}
                </div>
                {inv.notes && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{inv.notes}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: DARK }}>{inv.currency} ${parseFloat(inv.total || 0).toLocaleString()}</div>
                <div style={{ marginTop: 6 }}><StatusBadge status={inv.status} /></div>
              </div>
              {(inv.status === "Pending" || inv.status === "Overdue") && (
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, textAlign: "center" }}>Pay via</div>
                  <div style={{ background: LIGHT_PURPLE, color: PURPLE, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, textAlign: "center" }}>
                    Airwallex
                  </div>
                  <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 3, textAlign: "center" }}>Contact your manager</div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN BRAND PORTAL ────────────────────────────────────────────────────────
export default function BrandPortalPage({ user, onLogout }) {
  const [tab, setTab] = useState("Dashboard");
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [events, setEvents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [user.brand_id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allCampaigns, allAssignments, allInfluencers, allEvents, allInvoices] = await Promise.all([
        Campaign.filter({ brand_id: user.brand_id }),
        CampaignInfluencer.filter({ campaign_id: user.brand_id }),
        Influencer.list(),
        CalendarEvent.filter({ brand_name: user.brand_name }),
        Invoice.filter({ client_name: user.brand_name }),
      ]);

      setCampaigns(allCampaigns);
      setEvents(allEvents);
      setInvoices(allInvoices);

      // Get unique influencer IDs from assignments
      const myAssignments = allAssignments.filter(a =>
        allCampaigns.some(c => c.id === a.campaign_id)
      );
      const infIds = [...new Set(myAssignments.map(a => a.influencer_id))];
      const myInfluencers = allInfluencers.filter(inf => infIds.includes(inf.id));
      setInfluencers(myInfluencers);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", fontFamily: "'Inter', sans-serif" }}>
      {/* Top nav */}
      <div style={{ background: DARK, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 900, fontSize: 16, color: "#fff", letterSpacing: 1 }}>
            SIMPLEX<span style={{ color: "#a78bfa" }}>-ITY</span>
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>Brand Portal</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 700 }}>{user.brand_name}</div>
            <div style={{ fontSize: 10, color: "#6d5d8e" }}>{user.brand_code}</div>
          </div>
          <button onClick={onLogout} style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#a78bfa", fontSize: 11, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ede9fe", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "14px 18px", border: "none", background: "transparent", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t ? 700 : 500,
            color: tab === t ? PURPLE : "#94a3b8",
            borderBottom: tab === t ? `2px solid ${PURPLE}` : "2px solid transparent",
            whiteSpace: "nowrap", transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <span style={{ fontSize: 14 }}>{TAB_ICONS[t]}</span>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px", maxWidth: 900, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: "#c4b5fd" }}>◈</div>
            Loading your portal...
          </div>
        ) : (
          <>
            {tab === "Dashboard"   && <DashboardTab brand={user} campaigns={campaigns} influencers={influencers} invoices={invoices} />}
            {tab === "Calendar"    && <CalendarTab events={events} campaigns={campaigns} />}
            {tab === "Influencers" && <InfluencersTab influencers={influencers} />}
            {tab === "Products"    && <ProductsTab brandId={user.brand_id} />}
            {tab === "Invoices"    && <InvoicesTab invoices={invoices} />}
          </>
        )}
      </div>
    </div>
  );
}
