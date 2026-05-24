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

const CATEGORIES = ["All", "Company Admin", "AI & Platform", "Branding & Design", "Design & Marketing", "Website & Hosting", "Internal Tools", "Finance & Banking"];

export default function VaultPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    VaultItem.list().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const filtered = items.filter(i => {
    const matchCat = filter === "All" || i.category === filter;
    const matchSearch = !search || i.service_name?.toLowerCase().includes(search.toLowerCase()) || i.category?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleReveal = (id) => setRevealed(v => ({ ...v, [id]: !v[id] }));

  const catGroups = {};
  filtered.forEach(item => {
    const cat = item.category || "Other";
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(item);
  });

  return (
    <div style={{ padding: "28px", fontFamily: "'Montserrat', 'Inter', sans-serif", color: BRAND.bodyText }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Exo 2', 'Montserrat', sans-serif", fontWeight: 800, fontSize: 20, color: BRAND.bodyText }}>
          🔐 Credential Vault
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
          Secure login credentials · Admin only · {items.length} items stored
        </div>
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
          style={{
            padding: "8px 14px", borderRadius: 8,
            border: `1px solid ${BRAND.neutralGrey}`,
            fontSize: 13, outline: "none", width: 220,
            fontFamily: "'Montserrat', sans-serif"
          }}
        />
        {CATEGORIES.map(cat => (
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
        <div key={cat} style={{ marginBottom: 22 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: BRAND.primaryLilac,
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10
          }}>{cat}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {catItems.map(item => (
              <div key={item.id} style={{
                background: BRAND.white, borderRadius: 12,
                border: `1px solid ${BRAND.neutralGrey}`,
                padding: "16px 18px",
                boxShadow: "0 2px 8px rgba(140,130,252,0.06)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.bodyText }}>{item.service_name}</div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" style={{
                        fontSize: 10, color: BRAND.primaryLilac, textDecoration: "none",
                        fontWeight: 500, display: "block", marginTop: 2
                      }}>{item.url}</a>
                    )}
                  </div>
                  {item.is_admin_only && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#ef4444",
                      background: "#fef2f2", padding: "2px 7px", borderRadius: 8
                    }}>ADMIN</span>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ fontSize: 11 }}>
                    <div style={{ color: "#888", fontWeight: 600, marginBottom: 2 }}>USERNAME</div>
                    <div style={{ color: BRAND.bodyText, fontWeight: 500, wordBreak: "break-all" }}>{item.username || "—"}</div>
                  </div>
                  <div style={{ fontSize: 11 }}>
                    <div style={{ color: "#888", fontWeight: 600, marginBottom: 2 }}>PASSWORD</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: BRAND.bodyText, fontWeight: 500, fontFamily: "monospace", fontSize: 12 }}>
                        {item.password ? (revealed[item.id] ? item.password : "••••••••") : "—"}
                      </span>
                      {item.password && (
                        <button onClick={() => toggleReveal(item.id)} style={{
                          background: BRAND.lavenderWash, border: "none",
                          borderRadius: 4, padding: "1px 6px",
                          fontSize: 10, color: BRAND.accentViolet,
                          cursor: "pointer", fontWeight: 600
                        }}>{revealed[item.id] ? "Hide" : "Show"}</button>
                      )}
                    </div>
                  </div>
                </div>
                {item.notes && (
                  <div style={{
                    marginTop: 10, fontSize: 11, color: "#666",
                    background: BRAND.lavenderWash, borderRadius: 6,
                    padding: "6px 10px", lineHeight: 1.5
                  }}>{item.notes}</div>
                )}
                {item.assigned_to && item.assigned_to.length > 0 && (
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
    </div>
  );
}
