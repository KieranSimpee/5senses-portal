import { useState, useEffect } from "react";
import { VaultItem } from "@/api/entities";

const CATEGORIES = ["All", "Design & Marketing", "AI & Platform", "Company Admin", "Email", "Finance & Trading", "Website & Hosting", "Other"];

const CATEGORY_COLORS = {
  "Design & Marketing": { bg: "#f3e8ff", text: "#7c3aed", border: "#c4b5fd" },
  "AI & Platform": { bg: "#ede9fe", text: "#6d28d9", border: "#a78bfa" },
  "Company Admin": { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  "Email": { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
  "Finance & Trading": { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  "Website & Hosting": { bg: "#fce7f3", text: "#9d174d", border: "#f9a8d4" },
  "Other": { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
};

// Simulated role — in production this would come from the logged-in user's role
const CURRENT_ROLE = "admin"; // "admin" or "member"

export default function VaultPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});
  const [copied, setCopied] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const isAdmin = CURRENT_ROLE === "admin";

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await VaultItem.list();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filtered = items.filter(item => {
    const matchCat = category === "All" || item.category === category;
    const matchSearch = !search || item.service_name?.toLowerCase().includes(search.toLowerCase()) || item.username?.toLowerCase().includes(search.toLowerCase());
    const matchRole = isAdmin || !item.is_admin_only;
    return matchCat && matchSearch && matchRole;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  const toggleReveal = (id) => {
    setRevealed(p => ({ ...p, [id]: !p[id] }));
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const openNew = () => {
    setEditItem(null);
    setFormData({ service_name: "", category: "Design & Marketing", url: "", username: "", password: "", notes: "", assigned_to: [], is_admin_only: false, last_updated: new Date().toISOString().split("T")[0] });
    setShowForm(true);
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      const payload = { ...formData, last_updated: new Date().toISOString().split("T")[0] };
      if (editItem) {
        await VaultItem.update(editItem.id, payload);
      } else {
        await VaultItem.create(payload);
      }
      await fetchItems();
      setShowForm(false);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Remove this credential from the vault?")) return;
    await VaultItem.delete(id);
    fetchItems();
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0533", margin: 0 }}>🔐 Credentials Vault</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
            {isAdmin ? "Admin view — all credentials visible. Members see assigned tools only, passwords hidden." : "Your assigned tools — contact admin to update credentials."}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openNew} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            + Add Credential
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          placeholder="Search services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 9, border: "1.5px solid #e2d9f3", fontSize: 13, background: "#fff", outline: "none" }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "Design & Marketing", "AI & Platform", "Company Admin", "Finance & Trading", "Website & Hosting"].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "7px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: category === cat ? "#7c3aed" : "#f3f0ff",
              color: category === cat ? "#fff" : "#6d28d9",
              border: "none"
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Items by Category */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>Loading vault...</div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => {
          const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"];
          return (
            <div key={cat} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{cat}</span>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{catItems.length} {catItems.length === 1 ? "item" : "items"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                {catItems.map(item => (
                  <div key={item.id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #ede9fe", padding: "16px 18px", boxShadow: "0 1px 6px rgba(124,58,237,0.06)" }}>
                    {/* Service name + admin badge */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#1a0533" }}>{item.service_name}</span>
                        {item.is_admin_only && <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>ADMIN</span>}
                      </div>
                      {isAdmin && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(item)} style={{ background: "#f3f0ff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#7c3aed", cursor: "pointer", fontWeight: 600 }}>Edit</button>
                          <button onClick={() => deleteItem(item.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#dc2626", cursor: "pointer" }}>✕</button>
                        </div>
                      )}
                    </div>

                    {/* URL */}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#7c3aed", textDecoration: "none", display: "block", marginBottom: 10, wordBreak: "break-all" }}>
                        🔗 {item.url}
                      </a>
                    )}

                    {/* Username */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase" }}>Username / Email</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, color: "#1a0533", background: "#f8f7ff", padding: "4px 8px", borderRadius: 6, flex: 1, wordBreak: "break-all" }}>{item.username}</span>
                        <button onClick={() => copyToClipboard(item.username, `u_${item.id}`)} style={{ background: "#f3f0ff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#7c3aed", cursor: "pointer", flexShrink: 0 }}>
                          {copied[`u_${item.id}`] ? "✓" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Password — admin sees, member sees hidden */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase" }}>Password</div>
                      {isAdmin ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, color: "#1a0533", background: "#f8f7ff", padding: "4px 8px", borderRadius: 6, flex: 1, fontFamily: "monospace", letterSpacing: revealed[item.id] ? 0 : 2 }}>
                            {revealed[item.id] ? item.password : "••••••••••••"}
                          </span>
                          <button onClick={() => toggleReveal(item.id)} style={{ background: "#f3f0ff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#7c3aed", cursor: "pointer", flexShrink: 0 }}>
                            {revealed[item.id] ? "Hide" : "Show"}
                          </button>
                          <button onClick={() => copyToClipboard(item.password, `p_${item.id}`)} style={{ background: "#f3f0ff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#7c3aed", cursor: "pointer", flexShrink: 0 }}>
                            {copied[`p_${item.id}`] ? "✓" : "Copy"}
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: "#94a3b8", background: "#f8f7ff", padding: "4px 8px", borderRadius: 6, fontFamily: "monospace" }}>
                          🔒 Contact admin for access
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div style={{ fontSize: 11, color: "#64748b", background: "#fafafa", borderRadius: 6, padding: "6px 8px", marginTop: 6 }}>
                        {item.notes}
                      </div>
                    )}

                    {/* Assigned to */}
                    {item.assigned_to?.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {item.assigned_to.map(name => (
                          <span key={name} style={{ background: "#ede9fe", color: "#6d28d9", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10 }}>{name}</span>
                        ))}
                      </div>
                    )}

                    {/* Last updated */}
                    {item.last_updated && (
                      <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 8 }}>Updated: {item.last_updated}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>No credentials found.</div>
      )}

      {/* Edit / Add Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,5,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1a0533", marginBottom: 20 }}>{editItem ? "Edit Credential" : "Add New Credential"}</h2>

            {[
              { label: "Service Name", key: "service_name", type: "text" },
              { label: "URL", key: "url", type: "text" },
              { label: "Username / Email", key: "username", type: "text" },
              { label: "Password", key: "password", type: "text" },
              { label: "Notes", key: "notes", type: "textarea" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase" }}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea value={formData[field.key] || ""} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }} />
                ) : (
                  <input value={formData[field.key] || ""} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13, boxSizing: "border-box" }} />
                )}
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4, textTransform: "uppercase" }}>Category</label>
              <select value={formData.category || ""} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2d9f3", fontSize: 13 }}>
                {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={!!formData.is_admin_only} onChange={e => setFormData(p => ({ ...p, is_admin_only: e.target.checked }))} id="adminOnly" />
              <label htmlFor="adminOnly" style={{ fontSize: 13, color: "#1a0533", fontWeight: 600 }}>Admin only (members cannot see this)</label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={saveItem} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {saving ? "Saving..." : (editItem ? "Save Changes" : "Add to Vault")}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "#f3f0ff", color: "#7c3aed", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
