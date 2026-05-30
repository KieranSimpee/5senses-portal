import { useState, useEffect } from "react";
import { VaultItem } from "@/api/entities";

const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
};

const CATEGORIES = ["Company Admin", "AI & Platform", "Branding & Design", "Design & Marketing", "Website & Hosting", "Internal Tools", "Finance & Banking"];

const EMPTY_FORM = {
  service_name: "", category: "Company Admin", url: "",
  username: "", password: "", client_id: "", api_key: "",
  notes: "", assigned_to: [], is_admin_only: false, last_updated: new Date().toISOString().slice(0, 10)
};

export default function VaultPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    VaultItem.list().then(data => { setItems(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => {
    const matchCat = filter === "All" || i.category === filter;
    const matchSearch = !search ||
      i.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catGroups = {};
  filtered.forEach(item => {
    const cat = item.category || "Other";
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(item);
  });

  const toggleReveal = (id, field) =>
    setRevealed(v => ({ ...v, [`${id}_${field}`]: !v[`${id}_${field}`] }));

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, last_updated: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      service_name: item.service_name || "",
      category: item.category || "Company Admin",
      url: item.url || "",
      username: item.username || "",
      password: item.password || "",
      client_id: item.client_id || "",
      api_key: item.api_key || "",
      notes: item.notes || "",
      assigned_to: item.assigned_to || [],
      is_admin_only: item.is_admin_only || false,
      last_updated: new Date().toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.service_name.trim()) return;
    setSaving(true);
    try {
      if (editItem) {
        await VaultItem.update(editItem.id, form);
      } else {
        await VaultItem.create(form);
      }
      setShowModal(false);
      load();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await VaultItem.delete(id);
    setDeleteConfirm(null);
    load();
  };

  const SecretField = ({ label, value, id, field }) => {
    const key = `${id}_${field}`;
    const isRevealed = revealed[key];
    if (!value) return (
      <div style={{ fontSize: 11 }}>
        <div style={{ color: "#888", fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ color: "#ccc" }}>—</div>
      </div>
    );
    return (
      <div style={{ fontSize: 11 }}>
        <div style={{ color: "#888", fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            color: BRAND.bodyText, fontWeight: 500,
            fontFamily: "monospace", fontSize: 11,
            wordBreak: "break-all", maxWidth: 160
          }}>
            {isRevealed ? value : "••••••••"}
          </span>
          <button onClick={() => toggleReveal(id, field)} style={{
            background: BRAND.lavenderWash, border: "none",
            borderRadius: 4, padding: "1px 7px",
            fontSize: 10, color: BRAND.accentViolet,
            cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap"
          }}>{isRevealed ? "Hide" : "Show"}</button>
          {isRevealed && (
            <button onClick={() => navigator.clipboard?.writeText(value)} style={{
              background: "#f0fdf4", border: "none",
              borderRadius: 4, padding: "1px 7px",
              fontSize: 10, color: "#16a34a",
              cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap"
            }}>Copy</button>
          )}
        </div>
      </div>
    );
  };

  const inputStyle = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: `1px solid ${BRAND.neutralGrey}`,
    fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "'Montserrat', sans-serif", color: BRAND.bodyText
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: "#555",
    marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 0.5
  };

  // Determine if item has API credentials
  const hasApiCreds = (item) => item.client_id || item.api_key;
  const hasLoginCreds = (item) => item.username || item.password;

  return (
    <div style={{ padding: "28px", fontFamily: "'Montserrat', 'Inter', sans-serif", color: BRAND.bodyText, maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Exo 2', 'Montserrat', sans-serif", fontWeight: 800, fontSize: 20, color: BRAND.bodyText }}>
            🔐 Credential Vault
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
            Secure credentials · Admin only · {items.length} items stored
          </div>
        </div>
        <button onClick={openAdd} style={{
          background: BRAND.accentViolet, color: "#fff",
          border: "none", borderRadius: 10, padding: "10px 20px",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Exo 2', sans-serif"
        }}>+ Add Credential</button>
      </div>

      {/* Warning */}
      <div style={{
        background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10,
        padding: "10px 16px", marginBottom: 18, fontSize: 12, color: "#92400e"
      }}>
        ⚠️ Sensitive data. Do not share or screenshot this page. Admin access only.
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input
          placeholder="Search services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 220 }}
        />
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 12px", borderRadius: 20,
            border: filter === cat ? `1.5px solid ${BRAND.primaryLilac}` : `1px solid ${BRAND.neutralGrey}`,
            background: filter === cat ? BRAND.lavenderWash : BRAND.white,
            color: filter === cat ? BRAND.accentViolet : "#666",
            fontSize: 11, fontWeight: filter === cat ? 600 : 400, cursor: "pointer"
          }}>{cat}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", color: BRAND.primaryLilac, padding: 40 }}>Loading vault...</div>}

      {/* Grouped Cards */}
      {Object.entries(catGroups).map(([cat, catItems]) => (
        <div key={cat} style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac,
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10
          }}>{cat} <span style={{ color: "#bbb", fontWeight: 400 }}>({catItems.length})</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {catItems.map(item => (
              <div key={item.id} style={{
                background: BRAND.white, borderRadius: 12,
                border: `1px solid ${BRAND.neutralGrey}`,
                padding: "16px 18px",
                boxShadow: "0 2px 8px rgba(140,130,252,0.06)"
              }}>
                {/* Card Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.bodyText }}>{item.service_name}</div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" style={{
                        fontSize: 10, color: BRAND.primaryLilac, textDecoration: "none",
                        fontWeight: 500, display: "block", marginTop: 2
                      }}>{item.url}</a>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {item.is_admin_only && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: "#ef4444",
                        background: "#fef2f2", padding: "2px 7px", borderRadius: 8
                      }}>ADMIN</span>
                    )}
                    <button onClick={() => openEdit(item)} style={{
                      background: BRAND.lavenderWash, border: "none", borderRadius: 6,
                      padding: "3px 9px", fontSize: 11, color: BRAND.accentViolet,
                      cursor: "pointer", fontWeight: 600
                    }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(item.id)} style={{
                      background: "#fef2f2", border: "none", borderRadius: 6,
                      padding: "3px 9px", fontSize: 11, color: "#ef4444",
                      cursor: "pointer", fontWeight: 600
                    }}>Del</button>
                  </div>
                </div>

                {/* Credential Type Badge */}
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {hasLoginCreds(item) && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#0369a1",
                      background: "#e0f2fe", padding: "2px 8px", borderRadius: 8
                    }}>LOGIN</span>
                  )}
                  {hasApiCreds(item) && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#7c3aed",
                      background: "#ede9fe", padding: "2px 8px", borderRadius: 8
                    }}>API KEY</span>
                  )}
                </div>

                {/* Login Credentials */}
                {hasLoginCreds(item) && (
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
                    marginBottom: hasApiCreds(item) ? 12 : 0,
                    paddingBottom: hasApiCreds(item) ? 12 : 0,
                    borderBottom: hasApiCreds(item) ? `1px dashed ${BRAND.neutralGrey}` : "none"
                  }}>
                    <div style={{ fontSize: 11 }}>
                      <div style={{ color: "#888", fontWeight: 600, marginBottom: 2 }}>USERNAME / EMAIL</div>
                      <div style={{ color: BRAND.bodyText, fontWeight: 500, wordBreak: "break-all", fontSize: 11 }}>
                        {item.username || "—"}
                      </div>
                    </div>
                    <SecretField label="PASSWORD" value={item.password} id={item.id} field="password" />
                  </div>
                )}

                {/* API Credentials */}
                {hasApiCreds(item) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <SecretField label="CLIENT ID" value={item.client_id} id={item.id} field="client_id" />
                    <SecretField label="API KEY" value={item.api_key} id={item.id} field="api_key" />
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <div style={{
                    marginTop: 12, fontSize: 11, color: "#666",
                    background: BRAND.lavenderWash, borderRadius: 6,
                    padding: "6px 10px", lineHeight: 1.6
                  }}>{item.notes}</div>
                )}

                {/* Assigned */}
                {item.assigned_to?.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {item.assigned_to.map(user => (
                      <span key={user} style={{
                        fontSize: 9, fontWeight: 600, color: BRAND.primaryLilac,
                        background: BRAND.lavenderWash, padding: "2px 7px", borderRadius: 10
                      }}>{user}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20
        }}>
          <div style={{
            background: BRAND.white, borderRadius: 16, padding: 28,
            width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              fontFamily: "'Exo 2', sans-serif", fontWeight: 800,
              fontSize: 17, color: BRAND.bodyText, marginBottom: 20
            }}>
              {editItem ? "✏️ Edit Credential" : "🔐 Add Credential"}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

              {/* Service Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Service Name *</label>
                <input value={form.service_name} onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                  placeholder="e.g. Airwallex, GoDaddy, ChatGPT" style={inputStyle} />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* URL */}
              <div>
                <label style={labelStyle}>URL</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://..." style={inputStyle} />
              </div>

              {/* Divider: Login */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "#0369a1",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
                  borderTop: `1px solid ${BRAND.neutralGrey}`, paddingTop: 14
                }}>🔑 Login Credentials</div>
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>Username / Email</label>
                <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="email or username" style={inputStyle} />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="password" style={inputStyle} />
              </div>

              {/* Divider: API */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "#7c3aed",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
                  borderTop: `1px solid ${BRAND.neutralGrey}`, paddingTop: 14
                }}>⚙️ API Credentials</div>
              </div>

              {/* Client ID */}
              <div>
                <label style={labelStyle}>Client ID</label>
                <input value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}
                  placeholder="e.g. S4_56L3OSni..." style={inputStyle} />
              </div>

              {/* API Key */}
              <div>
                <label style={labelStyle}>API Key</label>
                <input value={form.api_key} onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))}
                  placeholder="paste full API key" style={inputStyle} />
              </div>

              {/* Notes */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "#555",
                  textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
                  borderTop: `1px solid ${BRAND.neutralGrey}`, paddingTop: 14
                }}>📝 Notes</div>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Account IDs, scopes, renewal dates, plan type..." rows={3}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* Admin Only */}
              <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="admin_only" checked={form.is_admin_only}
                  onChange={e => setForm(f => ({ ...f, is_admin_only: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: BRAND.primaryLilac }} />
                <label htmlFor="admin_only" style={{ fontSize: 12, fontWeight: 600, color: "#555", cursor: "pointer" }}>
                  Admin only (hide from non-admin team members)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: "9px 20px", borderRadius: 9,
                border: `1px solid ${BRAND.neutralGrey}`,
                background: BRAND.white, fontSize: 13, cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif", color: "#555"
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.service_name.trim()} style={{
                padding: "9px 24px", borderRadius: 9, border: "none",
                background: saving ? BRAND.softLilac : BRAND.accentViolet,
                color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "'Exo 2', sans-serif"
              }}>{saving ? "Saving..." : editItem ? "Save Changes" : "Add to Vault"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: BRAND.white, borderRadius: 14, padding: 28,
            width: 340, textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Delete this credential?</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                padding: "8px 20px", borderRadius: 8,
                border: `1px solid ${BRAND.neutralGrey}`,
                background: BRAND.white, fontSize: 13, cursor: "pointer"
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{
                padding: "8px 20px", borderRadius: 8, border: "none",
                background: "#ef4444", color: "#fff",
                fontSize: 13, fontWeight: 700, cursor: "pointer"
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
