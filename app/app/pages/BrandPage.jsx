import { useState, useEffect } from "react";
import { Document, Expense } from "@/api/entities";

const BRAND_TABS = ["5SENSESBEAUTY", "SIMPLEX-ITY"];
const FOLDER_CATS = ["Brand Deck", "Design Asset", "Contract", "Campaign Brief", "Report", "Legal", "Finance", "Other"];

const SENSES_LOGO = "https://media.base44.com/images/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/2597cdedd_whatsapp_image_1608728383529314.jpg";

function detectBrandFromFile(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("simplex") || lower.includes("simplexity")) return "SIMPLEX-ITY";
  if (lower.includes("5senses") || lower.includes("senses") || lower.includes("sentie")) return "5SENSESBEAUTY";
  return null;
}

function detectCategoryFromFile(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("invoice") || lower.includes("receipt")) return "Finance";
  if (lower.includes("contract") || lower.includes("agreement") || lower.includes("nda")) return "Contract";
  if (lower.includes("deck") || lower.includes("pitch") || lower.includes("brand")) return "Brand Deck";
  if (lower.includes("report") || lower.includes("analysis")) return "Report";
  if (lower.includes("design") || lower.includes("logo") || lower.includes("guideline")) return "Design Asset";
  return "Other";
}

export default function BrandPage({ user }) {
  const [brand, setBrand] = useState("SIMPLEX-ITY");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const all = await Document.list();
      setDocs(all);
    } catch (e) {}
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    let uploaded = 0;
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resp = await fetch("/api/upload", { method: "POST", body: formData });
        const { url } = await resp.json();

        const detectedBrand = detectBrandFromFile(file.name) || brand;
        const detectedCat = detectCategoryFromFile(file.name);

        await Document.create({
          title: file.name,
          category: detectedCat,
          file_url: url,
          file_name: file.name,
          file_type: file.type,
          description: `Auto-filed under ${detectedBrand}`,
          tags: [detectedBrand.toLowerCase().replace("-", ""), detectedCat.toLowerCase().replace(" ", "-")],
          related_to: detectedBrand,
          is_pinned: false
        });

        // If invoice/finance doc, also sync to Finance
        if (detectedCat === "Finance") {
          await Expense.create({
            title: file.name,
            receipt_url: url,
            date: new Date().toISOString().split("T")[0],
            currency: "HKD",
            status: "Pending",
            category: "Marketing",
            notes: `Auto-synced from Brand (${detectedBrand}) upload`
          });
        }
        uploaded++;
      } catch (err) {}
    }
    await loadDocs();
    setUploading(false);
    alert(`${uploaded} file(s) uploaded and auto-filed!`);
    e.target.value = "";
  };

  const brandDocs = docs.filter(d => {
    const related = d.related_to || "";
    const tags = d.tags || [];
    const isBrand = brand === "5SENSESBEAUTY"
      ? (related.includes("5SENSES") || tags.some(t => t.includes("5senses") || t.includes("senses")) || related === "5SENSESBEAUTY")
      : (related.includes("SIMPLEX") || tags.some(t => t.includes("simplex")) || related === "SIMPLEX-ITY");
    if (!isBrand && related !== "") return false;
    if (filterCat !== "All" && d.category !== filterCat) return false;
    return true;
  });

  const groupedByCategory = FOLDER_CATS.reduce((acc, cat) => {
    const items = brandDocs.filter(d => d.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const tabStyle = (t) => ({
    padding: "10px 24px", border: "none", cursor: "pointer", borderRadius: 10, fontSize: 14, fontWeight: 700,
    background: brand === t ? (t === "SIMPLEX-ITY" ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "linear-gradient(135deg, #8a7070, #b09090)") : "#f3f0ff",
    color: brand === t ? "#fff" : "#6d28d9", transition: "all 0.2s", boxShadow: brand === t ? "0 4px 12px rgba(124,58,237,0.25)" : "none"
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a0533", margin: 0 }}>✨ Brand</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Documents auto-routed by brand. Invoice uploads sync to Finance.</p>
        </div>
        <label style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {uploading ? "Uploading..." : "📎 Upload & Auto-File"}
          <input type="file" multiple style={{ display: "none" }} onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx" />
        </label>
      </div>

      {/* Brand selector */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, alignItems: "center" }}>
        {/* 5Senses */}
        <button onClick={() => setBrand("5SENSESBEAUTY")} style={tabStyle("5SENSESBEAUTY")}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={SENSES_LOGO} alt="5Senses" style={{ height: 22, objectFit: "contain" }} />
            <span>5SENSESBEAUTY</span>
          </div>
        </button>

        {/* Simplex-ity */}
        <button onClick={() => setBrand("SIMPLEX-ITY")} style={tabStyle("SIMPLEX-ITY")}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: 0.5 }}>S</div>
            <span>SIMPLEX-ITY</span>
          </div>
        </button>
      </div>

      {/* Brand header */}
      <div style={{
        background: brand === "SIMPLEX-ITY" ? "linear-gradient(135deg, #1a0533, #2d1157)" : "linear-gradient(135deg, #3d2e2e, #6b5050)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 24, color: "#fff", display: "flex", alignItems: "center", gap: 20
      }}>
        {brand === "5SENSESBEAUTY" ? (
          <img src={SENSES_LOGO} alt="5Senses" style={{ height: 56, objectFit: "contain", background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: 6 }} />
        ) : (
          <div style={{ background: "rgba(124,58,237,0.3)", borderRadius: 12, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900 }}>✨</div>
        )}
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>
            {brand === "SIMPLEX-ITY" ? "SIMPLEX-ITY" : "5SENSESBEAUTY LIMITED"}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>
            {brand === "SIMPLEX-ITY" ? "Marketing & AI Beauty Platform · Branch of 5SENSESBEAUTY LIMITED" : "Parent Company · Feel Beauty Live Fully"}
          </div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
            {brandDocs.length} document{brandDocs.length !== 1 ? "s" : ""} filed
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", ...FOLDER_CATS].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: filterCat === cat ? "#7c3aed" : "#f3f0ff", color: filterCat === cat ? "#fff" : "#6d28d9", border: "none" }}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>Loading...</div>
      ) : filterCat === "All" ? (
        // Show by folder/category
        Object.keys(groupedByCategory).length === 0 ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
            <div>No documents yet for {brand}.</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Upload files above — they'll be auto-filed into the right folder.</div>
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>📁</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a0533" }}>{cat}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{items.length} file{items.length !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                {items.map(doc => (
                  <a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #ede9fe", padding: "14px", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#ede9fe"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{doc.file_type?.includes("pdf") ? "📕" : doc.file_type?.includes("image") ? "🖼️" : "📄"}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1a0533", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                      {doc.version && <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>v{doc.version}</div>}
                      {doc.is_pinned && <div style={{ fontSize: 9, color: "#f59e0b", marginTop: 2 }}>📌 Pinned</div>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
        )
      ) : (
        // Filtered view
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {brandDocs.map(doc => (
            <a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #ede9fe", padding: "14px", cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1a0533" }}>{doc.title}</div>
              </div>
            </a>
          ))}
          {brandDocs.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13 }}>No files in this category.</div>}
        </div>
      )}
    </div>
  );
}
